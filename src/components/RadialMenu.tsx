import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Software, Workflow } from '@/types';
import { track } from '@/lib/analytics';

const INNER_R = 56;
const OUTER_R = 140;
const ACTIVE_OUTER_R = 152;
const LABEL_R = (INNER_R + OUTER_R) / 2;

interface RadialMenuProps {
  software: Software[];
  workflows: Workflow[];
  onLaunchSoftware?: (id: string) => void;
  onLaunchWorkflow?: (id: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: 'middle-click' | 'disabled';
}

interface MenuItem {
  slot: number;
  name: string;
  color?: string;
  type: 'software' | 'workflow';
  targetId: string;
  icon?: string;
  unavailable?: boolean;
}

interface RadialStyleTokens {
  sectorFill: (isActive: boolean, itemColor?: string) => string;
  sectorStroke: (isActive: boolean) => string;
  sectorStrokeWidth: (isActive: boolean) => number;
  sectorGap: number;
  centerFill: string;
  centerStroke: string;
  textFill: (isActive: boolean) => string;
  emptyMarkFill: string;
}

type AnimPhase = 'idle' | 'out' | 'switch' | 'in';

function getDefaultTokens(): RadialStyleTokens {
  return {
    sectorFill: (isActive) =>
      isActive ? 'rgba(139,92,246,0.42)' : 'rgba(21,21,28,0.82)',
    sectorStroke: (isActive) =>
      isActive ? 'rgba(167,139,250,0.9)' : 'rgba(148,163,184,0.25)',
    sectorStrokeWidth: (isActive) => (isActive ? 2 : 1.5),
    sectorGap: 0,
    centerFill: 'rgba(21,21,28,0.55)',
    centerStroke: 'rgba(148,163,184,0.2)',
    textFill: (isActive) => (isActive ? '#fff' : '#cbd5e1'),
    emptyMarkFill: 'rgba(148,163,184,0.4)',
  };
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function sectorPath(
  cx: number,
  cy: number,
  startDeg: number,
  endDeg: number,
  outerR = OUTER_R,
  gapDeg = 0
) {
  const half = gapDeg / 2;
  const s = startDeg + half;
  const e = endDeg - half;
  const oStart = polar(cx, cy, outerR, s);
  const oEnd = polar(cx, cy, outerR, e);
  const iEnd = polar(cx, cy, INNER_R, e);
  const iStart = polar(cx, cy, INNER_R, s);
  const largeArc = e - s > 180 ? 1 : 0;
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
    'Z',
  ].join(' ');
}

function isTouchpadWheel(e: WheelEvent): boolean {
  if (e.deltaY !== Math.floor(e.deltaY)) return true;
  const wd = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
  if (typeof wd === 'number' && wd !== 0 && wd % 120 !== 0) return true;
  if (e.deltaMode === 0 && Math.abs(e.deltaY) > 0 && Math.abs(e.deltaY) < 50) return true;
  return false;
}

export function RadialMenu({
  software,
  workflows,
  onLaunchSoftware,
  onLaunchWorkflow,
  open,
  onOpenChange,
  trigger = 'middle-click',
}: RadialMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const openTimeRef = useRef(0);

  const [page, setPage] = useState(0);
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');
  const wheelDirRef = useRef(1);

  const WHEEL_THRESHOLD = 60;
  const WHEEL_COOLDOWN = 800;
  const wheelAccumRef = useRef(0);
  const wheelCooldownRef = useRef(false);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = open !== undefined ? open : internalOpen;
  const styleTokens = useMemo(() => getDefaultTokens(), []);

  const sectors = 6;

  const allMenuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    const favoriteSoftware = software
      .filter((s) => s.launchCount > 100)
      .sort((a, b) => b.launchCount - a.launchCount);

    const favoriteWorkflows = workflows.filter((w) => w.isFavorite);

    favoriteSoftware.slice(0, 6).forEach((app, idx) => {
      items.push({
        slot: idx,
        name: app.name,
        color: app.color,
        type: 'software',
        targetId: app.id,
      });
    });

    if (favoriteSoftware.length < 6) {
      favoriteWorkflows.slice(0, 6 - favoriteSoftware.length).forEach((wf, idx) => {
        items.push({
          slot: favoriteSoftware.length + idx,
          name: wf.name,
          color: wf.color,
          type: 'workflow',
          targetId: wf.id,
        });
      });
    }

    const secondPageStart = sectors;
    const moreSoftware = favoriteSoftware.slice(6);
    const moreWorkflows = favoriteWorkflows.slice(Math.max(0, 6 - favoriteSoftware.length));

    const secondPageItems: MenuItem[] = [];
    moreSoftware.slice(0, 6).forEach((app, idx) => {
      secondPageItems.push({
        slot: secondPageStart + idx,
        name: app.name,
        color: app.color,
        type: 'software',
        targetId: app.id,
      });
    });

    if (secondPageItems.length < 6) {
      moreWorkflows.slice(0, 6 - secondPageItems.length).forEach((wf, idx) => {
        secondPageItems.push({
          slot: secondPageStart + secondPageItems.length + idx,
          name: wf.name,
          color: wf.color,
          type: 'workflow',
          targetId: wf.id,
        });
      });
    }

    return [...items, ...secondPageItems];
  }, [software, workflows]);

  const totalPages = useMemo(() => {
    const maxSlot = allMenuItems.reduce((max, it) => Math.max(max, it.slot), -1);
    return Math.max(1, Math.ceil((maxSlot + 1) / sectors));
  }, [allMenuItems, sectors]);

  const currentItems = useMemo(() => {
    return allMenuItems
      .filter((it) => Math.floor(it.slot / sectors) === page)
      .map((it) => ({ ...it, slot: it.slot % sectors }));
  }, [allMenuItems, page, sectors]);

  const itemBySlot = useMemo(() => {
    const map = new Map<number, MenuItem>();
    currentItems.forEach((it) => map.set(it.slot, it));
    return map;
  }, [currentItems]);

  const setIsOpen = useCallback((value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  }, [onOpenChange]);

  const sectorAngle = 360 / sectors;
  const centerAngleOf = (slot: number) => slot * sectorAngle - 90;

  const openMenu = useCallback((e?: MouseEvent) => {
    const x = e?.clientX ?? lastMousePosRef.current.x;
    const y = e?.clientY ?? lastMousePosRef.current.y;
    setCursorPos({ x, y });
    setActiveSlot(null);
    setMounted(false);
    setPage(0);
    setAnimPhase('idle');
    openTimeRef.current = Date.now();
    setIsOpen(true);
    track('radial_menu_open', { trigger: e ? 'middle_click' : 'button' });
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, [setIsOpen]);

  const closeMenu = useCallback((closeMethod?: string) => {
    const duration = openTimeRef.current ? Date.now() - openTimeRef.current : 0;
    track('radial_menu_close', {
      close_method: closeMethod ?? 'unknown',
      duration_ms: duration,
    });
    setIsOpen(false);
    setMounted(false);
    setActiveSlot(null);
    wheelAccumRef.current = 0;
    wheelCooldownRef.current = false;
    if (wheelIdleTimerRef.current) clearTimeout(wheelIdleTimerRef.current);
    if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
  }, [setIsOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 当 isOpen 变为 true 时自动初始化状态（支持受控模式点击弹出）
  useEffect(() => {
    if (isOpen) {
      setCursorPos(lastMousePosRef.current);
      setActiveSlot(null);
      setPage(0);
      setAnimPhase('idle');
      wheelAccumRef.current = 0;
      wheelCooldownRef.current = false;
      setTimeout(() => {
        setMounted(true);
      }, 50);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  // 使用 ref 保持最新状态值，避免 wheel effect 频繁重新注册
  const animPhaseRef = useRef(animPhase);
  animPhaseRef.current = animPhase;
  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  // 原生 wheel 事件（非 passive），在 window 捕获阶段阻止页面滚动
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (totalPagesRef.current <= 1) return;

      const touchpad = isTouchpadWheel(e);

      if (!touchpad) {
        if (animPhaseRef.current !== 'idle') return;
        wheelDirRef.current = e.deltaY > 0 ? 1 : -1;
        wheelAccumRef.current = 0;
        setAnimPhase('out');
        return;
      }

      if (wheelCooldownRef.current) return;
      wheelAccumRef.current += e.deltaY;

      if (wheelIdleTimerRef.current) {
        clearTimeout(wheelIdleTimerRef.current);
        wheelIdleTimerRef.current = null;
      }

      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD) {
        const dir = wheelAccumRef.current > 0 ? 1 : -1;
        wheelDirRef.current = dir;
        wheelAccumRef.current = 0;
        wheelCooldownRef.current = true;

        if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
        wheelCooldownTimerRef.current = setTimeout(() => {
          wheelCooldownRef.current = false;
          wheelAccumRef.current = 0;
        }, WHEEL_COOLDOWN);

        setAnimPhase('out');
        return;
      }

      wheelIdleTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
      }, 150);
    };

    window.addEventListener('wheel', handler, { passive: false, capture: true } as AddEventListenerOptions);

    return () => {
      window.removeEventListener('wheel', handler, { passive: false, capture: true } as EventListenerOptions);
    };
  }, [isOpen]);

  useEffect(() => {
    if (trigger !== 'middle-click') return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        openMenu(e);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [trigger, openMenu]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeMenu('esc');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu('click_outside');
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (animPhase === 'out') {
      const fromPage = page;
      const dir = wheelDirRef.current;
      const t = setTimeout(() => {
        setPage((p) => {
          const len = totalPages || 1;
          const newPage = (p + dir + len) % len;
          track('radial_menu_page_switch', {
            from_page: fromPage,
            to_page: newPage,
            direction: dir > 0 ? 'next' : 'prev',
          });
          return newPage;
        });
        setAnimPhase('switch');
      }, 220);
      return () => clearTimeout(t);
    }
    if (animPhase === 'switch') {
      const t = setTimeout(() => {
        setAnimPhase('in');
      }, 40);
      return () => clearTimeout(t);
    }
    if (animPhase === 'in') {
      const t = setTimeout(() => {
        setAnimPhase('idle');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [animPhase, totalPages, page]);

  const slotAt = useCallback(
    (clientX: number, clientY: number): number | null => {
      const dx = clientX - cursorPos.x;
      const dy = clientY - cursorPos.y;
      const dist = Math.hypot(dx, dy);
      if (dist < INNER_R || dist > OUTER_R) return null;
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
      let rel = deg - (-90 - sectorAngle / 2);
      rel = ((rel % 360) + 360) % 360;
      return Math.floor(rel / sectorAngle) % sectors;
    },
    [cursorPos, sectorAngle, sectors]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setActiveSlot(slotAt(e.clientX, e.clientY));
    },
    [slotAt]
  );

  const onClick = useCallback(() => {
    if (activeSlot === null) {
      closeMenu('click_outside');
      return;
    }
    const item = itemBySlot.get(activeSlot);
    if (item) {
      track('radial_menu_launch', {
        slot_index: activeSlot,
        item_name: item.name,
        item_type: item.type,
        target_id: item.targetId,
        page_index: page,
      });
      if (item.type === 'software' && onLaunchSoftware) {
        onLaunchSoftware(item.targetId);
      } else if (item.type === 'workflow' && onLaunchWorkflow) {
        onLaunchWorkflow(item.targetId);
      }
    }
    closeMenu('slot_click');
  }, [activeSlot, itemBySlot, onLaunchSoftware, onLaunchWorkflow, closeMenu, page]);

  if (!isOpen) return null;

  const { x: cx, y: cy } = cursorPos;
  const isAnimating = animPhase !== 'idle';
  const animRotate =
    animPhase === 'out'
      ? wheelDirRef.current * sectorAngle
      : animPhase === 'switch'
        ? -wheelDirRef.current * sectorAngle
        : 0;
  const animOpacity = animPhase === 'out' || animPhase === 'switch' ? 0.12 : 1;
  const animScale = animPhase === 'out' || animPhase === 'switch' ? 0.9 : 1;

  const pageLabel =
    totalPages > 1 ? (page === 0 ? '第一页' : '第二页') : 'ESC';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100]"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: mounted
              ? `rotate(${animRotate}deg) scale(${animScale})`
              : `rotate(${animRotate}deg) scale(0.82)`,
            opacity: mounted ? animOpacity : 0,
            transition: isAnimating
              ? 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease-in-out'
              : 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 140ms ease-out',
          }}
        >
          {Array.from({ length: sectors }).map((_, slot) => {
            const center = centerAngleOf(slot);
            const start = center - sectorAngle / 2;
            const end = center + sectorAngle / 2;
            const isActive = activeSlot === slot;
            const item = itemBySlot.get(slot);
            const labelR = isActive ? LABEL_R + 6 : LABEL_R;
            const labelPos = polar(cx, cy, labelR, center);

            return (
              <g key={slot}>
                <path
                  d={sectorPath(
                    cx,
                    cy,
                    start,
                    end,
                    isActive ? ACTIVE_OUTER_R : OUTER_R,
                    styleTokens.sectorGap
                  )}
                  fill={styleTokens.sectorFill(isActive, item?.color)}
                  stroke={styleTokens.sectorStroke(isActive)}
                  strokeWidth={styleTokens.sectorStrokeWidth(isActive)}
                  style={{ transition: 'fill 90ms ease-out' }}
                />

                {item ? (
                  <g style={{ opacity: item.unavailable ? 0.38 : 1 }}>
                    <circle
                      cx={labelPos.x}
                      cy={labelPos.y - 6}
                      r={isActive ? 19 : 16}
                      fill={(item.color || '#8b5cf6') + '40'}
                      style={{ pointerEvents: 'none' }}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 18}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isActive ? 12 : 11}
                      fontWeight={isActive ? 600 : 400}
                      fill={styleTokens.textFill(isActive)}
                      style={{ pointerEvents: 'none' }}
                    >
                      {item.name.length > 7 ? item.name.slice(0, 6) + '…' : item.name}
                    </text>
                  </g>
                ) : (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={20}
                    fill={styleTokens.emptyMarkFill}
                    style={{ pointerEvents: 'none' }}
                  >
                    +
                  </text>
                )}
              </g>
            );
          })}

          <circle
            cx={cx}
            cy={cy}
            r={INNER_R - 2}
            fill={styleTokens.centerFill}
            stroke={styleTokens.centerStroke}
            strokeWidth={1}
          />

          {(() => {
            const activeItem = activeSlot !== null ? itemBySlot.get(activeSlot) : undefined;
            if (activeItem) {
              const len = activeItem.name.length;
              const fontSize = len <= 10 ? 11 : len <= 20 ? 10 : 9;
              return (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight={600}
                  fill={activeItem.unavailable ? 'rgba(203,213,225,0.55)' : '#fff'}
                  style={{ pointerEvents: 'none' }}
                >
                  {activeItem.name.length > 12
                    ? activeItem.name.slice(0, 10) + '…'
                    : activeItem.name}
                </text>
              );
            }
            return (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fill="rgba(148,163,184,0.7)"
                style={{ pointerEvents: 'none' }}
              >
                {pageLabel}
              </text>
            );
          })()}
        </g>
      </svg>
    </div>
  );
}
