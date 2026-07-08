import { useEffect, useRef, useCallback } from 'react';
import { track, trackElementView, trackScrollDepth } from '@/lib/analytics';

export function useSectionVisibility(sectionName: string) {
  const sectionRef = useRef<HTMLElement>(null);
  const reported = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !reported.current) {
            reported.current = true;
            trackElementView(sectionName);
          }
        }
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [sectionName]);

  return sectionRef;
}

export function useScrollDepthTracking() {
  useEffect(() => {
    const handleScroll = () => {
      trackScrollDepth();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    trackScrollDepth();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}

export function useFeatureCardClick(featureName: string) {
  return useCallback(() => {
    track('feature_card_click', { feature_name: featureName });
  }, [featureName]);
}