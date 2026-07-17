import { ArrowLeft, Shield, FileText, Lock, Database, Eye, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyProps {
  theme: 'light' | 'dark';
}

export function Privacy({ theme }: PrivacyProps) {
  return (
    <div
      className={cn(
        'min-h-screen',
        theme === 'light' ? 'bg-white' : 'bg-slate-950'
      )}
    >
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => window.history.back()}
          className={cn(
            'flex items-center gap-2 text-sm mb-8 transition-colors',
            theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <header className="mb-12">
          <h1
            className={cn(
              'text-3xl font-bold mb-4',
              theme === 'light' ? 'text-slate-900' : 'text-white'
            )}
          >
            隐私政策
          </h1>
          <p
            className={cn(
              'text-sm',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            生效日期：2024年1月1日
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2
              className={cn(
                'text-xl font-semibold mb-4 flex items-center gap-2',
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              <Shield className="w-5 h-5" />
              我们收集什么信息
            </h2>
            <div className="space-y-4">
              <div
                className={cn(
                  'p-4 rounded-lg',
                  theme === 'light' ? 'bg-slate-50' : 'bg-slate-900/50'
                )}
              >
                <h3
                  className={cn(
                    'font-medium mb-2',
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  )}
                >
                  网站访问数据
                </h3>
                <p
                  className={cn(
                    'text-sm',
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  当您访问我们的网站时，我们可能通过 Google Analytics 和 Microsoft Clarity 收集以下信息：
                </p>
                <ul
                  className={cn(
                    'mt-2 text-sm list-disc list-inside space-y-1',
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  <li>您的 IP 地址</li>
                  <li>浏览器类型和版本</li>
                  <li>操作系统信息</li>
                  <li>访问时间和日期</li>
                  <li>您访问的页面</li>
                  <li>页面停留时间</li>
                  <li>滚动深度</li>
                  <li>点击行为</li>
                </ul>
              </div>

              <div
                className={cn(
                  'p-4 rounded-lg',
                  theme === 'light' ? 'bg-slate-50' : 'bg-slate-900/50'
                )}
              >
                <h3
                  className={cn(
                    'font-medium mb-2',
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  )}
                >
                  AI 服务数据
                </h3>
                <p
                  className={cn(
                    'text-sm',
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  当您使用 SoftDesk 应用中的 AI 功能时，您的软件清单、工作流配置和相关输入可能会发送给您选择的 AI 服务商（如 OpenAI、豆包等）。这些数据仅用于提供 AI 分析和建议功能。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2
              className={cn(
                'text-xl font-semibold mb-4 flex items-center gap-2',
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              <Database className="w-5 h-5" />
              我们如何使用您的信息
            </h2>
            <ul
              className={cn(
                'space-y-2 text-sm list-disc list-inside',
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              <li>分析网站流量和用户行为，以改进我们的服务</li>
              <li>优化网站性能和用户体验</li>
              <li>提供 AI 驱动的功能和建议</li>
              <li>确保网站安全</li>
            </ul>
          </section>

          <section>
            <h2
              className={cn(
                'text-xl font-semibold mb-4 flex items-center gap-2',
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              <Users className="w-5 h-5" />
              信息共享
            </h2>
            <p
              className={cn(
                'text-sm mb-4',
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              我们不会向第三方出售、出租或分享您的个人信息，除以下情况外：
            </p>
            <ul
              className={cn(
                'space-y-2 text-sm list-disc list-inside',
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              <li>您选择的 AI 服务商（用于提供 AI 功能）</li>
              <li>法律要求或司法程序</li>
              <li>保护我们的权利或财产</li>
            </ul>
          </section>

          <section>
            <h2
              className={cn(
                'text-xl font-semibold mb-4 flex items-center gap-2',
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              <Eye className="w-5 h-5" />
              分析工具说明
            </h2>
            <div className="space-y-4">
              <div
                className={cn(
                  'p-4 rounded-lg',
                  theme === 'light' ? 'bg-slate-50' : 'bg-slate-900/50'
                )}
              >
                <h3
                  className={cn(
                    'font-medium mb-2',
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  )}
                >
                  Google Analytics
                </h3>
                <p
                  className={cn(
                    'text-sm',
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  Google Analytics 是 Google 提供的网络分析服务。它使用 Cookie 来收集和报告网站流量数据。您可以在{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('underline', theme === 'light' ? 'text-blue-600' : 'text-blue-400')}
                  >
                    Google 隐私政策
                  </a>{' '}
                  了解更多。
                </p>
              </div>

              <div
                className={cn(
                  'p-4 rounded-lg',
                  theme === 'light' ? 'bg-slate-50' : 'bg-slate-900/50'
                )}
              >
                <h3
                  className={cn(
                    'font-medium mb-2',
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  )}
                >
                  Microsoft Clarity
                </h3>
                <p
                  className={cn(
                    'text-sm',
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  Microsoft Clarity 是 Microsoft 提供的用户行为分析服务。它记录会话回放和热力图，帮助我们了解用户如何与网站互动。您可以在{' '}
                  <a
                    href="https://privacy.microsoft.com/en-us/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('underline', theme === 'light' ? 'text-blue-600' : 'text-blue-400')}
                  >
                    Microsoft 隐私政策
                  </a>{' '}
                  了解更多。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2
              className={cn(
                'text-xl font-semibold mb-4 flex items-center gap-2',
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              <Lock className="w-5 h-5" />
              您的权利
            </h2>
            <ul
              className={cn(
                'space-y-2 text-sm list-disc list-inside',
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              <li>访问、更正或删除您的个人信息</li>
              <li>拒绝或撤回分析追踪同意</li>
              <li>导出您的数据</li>
              <li>关闭 Cookie 和追踪技术</li>
            </ul>
            <p
              className={cn(
                'text-sm mt-4',
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              您可以通过页脚的"分析偏好"入口管理您的追踪同意设置。
            </p>
          </section>

          <section>
            <h2
              className={cn(
                'text-xl font-semibold mb-4 flex items-center gap-2',
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              <FileText className="w-5 h-5" />
              政策变更
            </h2>
            <p
              className={cn(
                'text-sm',
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              我们可能会不时更新此隐私政策。当我们做出重要变更时，我们会在网站上发布通知。建议您定期查看此页面以了解最新信息。
            </p>
          </section>

          <section>
            <h2
              className={cn(
                'text-xl font-semibold mb-4',
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              联系我们
            </h2>
            <p
              className={cn(
                'text-sm',
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              )}
            >
              如果您对本隐私政策有任何疑问或建议，请通过 GitHub Issues 联系我们：
              <a
                href="https://github.com/bayernjf/soft-desk/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={cn('ml-1 underline', theme === 'light' ? 'text-blue-600' : 'text-blue-400')}
              >
                GitHub Issues
              </a>
            </p>
          </section>
        </div>

        <footer
          className={cn(
            'mt-16 pt-8 border-t text-center text-xs',
            theme === 'light' ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-500'
          )}
        >
          <p>© {new Date().getFullYear()} SoftDesk</p>
        </footer>
      </div>
    </div>
  );
}