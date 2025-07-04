"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronRight } from "lucide-react"
import { gsap } from "gsap"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

// 创建一个全局状态管理器
class TocStateManager {
  private listeners: Set<(isVisible: boolean) => void> = new Set()
  private _isVisible = true

  get isVisible() {
    return this._isVisible
  }

  setVisible(visible: boolean) {
    this._isVisible = visible
    this.listeners.forEach((listener) => listener(visible))
  }

  subscribe(listener: (isVisible: boolean) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const tocStateManager = new TocStateManager()

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 订阅全局状态
  useEffect(() => {
    const unsubscribe = tocStateManager.subscribe(setIsVisible)
    setIsVisible(tocStateManager.isVisible)
    return unsubscribe
  }, [])

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1280 // xl breakpoint
      setIsMobile(mobile)
      if (mobile) {
        tocStateManager.setVisible(false) // 移动端默认隐藏
      } else {
        tocStateManager.setVisible(true) // 桌面端默认显示
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // 解析 Markdown 内容中的标题
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "")

      items.push({ id, text, level })
    }

    setTocItems(items)
  }, [content])

  useEffect(() => {
    if (tocItems.length === 0) return

    // 为页面中的标题添加 ID
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach((heading, index) => {
      if (tocItems[index]) {
        heading.id = tocItems[index].id
      }
    })

    // 清理之前的观察器
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // 设置新的 Intersection Observer
    const headingElements = Array.from(headings).filter((_, index) => tocItems[index])

    if (headingElements.length > 0) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // 找到当前可见的标题
          const visibleEntries = entries.filter((entry) => entry.isIntersecting)

          if (visibleEntries.length > 0) {
            // 选择最靠近顶部的可见标题
            const topEntry = visibleEntries.reduce((closest, entry) => {
              return entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest
            })
            setActiveId(topEntry.target.id)
          } else {
            // 如果没有可见的标题，找到最接近顶部的标题
            const allEntries = entries.filter((entry) => entry.boundingClientRect.top > 0)
            if (allEntries.length > 0) {
              const closestEntry = allEntries.reduce((closest, entry) => {
                return Math.abs(entry.boundingClientRect.top) < Math.abs(closest.boundingClientRect.top)
                  ? entry
                  : closest
              })
              setActiveId(closestEntry.target.id)
            }
          }
        },
        {
          rootMargin: "-80px 0% -80% 0%",
          threshold: [0, 0.1, 0.5, 1],
        },
      )

      headingElements.forEach((heading) => {
        observerRef.current?.observe(heading)
      })
    }

    // GSAP 动画
    if (tocRef.current && isVisible) {
      gsap.fromTo(
        tocRef.current.children,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.3 },
      )
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [tocItems, isVisible])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 计算精确的滚动位置
      const headerHeight = 80 // 固定头部高度
      const additionalOffset = 20 // 额外的间距
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset
      const targetPosition = elementTop - headerHeight - additionalOffset

      // 使用平滑滚动
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })

      // 立即更新活跃状态，提供即时反馈
      setActiveId(id)
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <>
      {/* 目录面板 - 固定在屏幕右侧 */}
      <div
        className={`fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-72 bg-background/95 backdrop-blur-sm border-l shadow-lg z-40 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="space-y-4 p-6" ref={tocRef}>
            {/* 标题 */}
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">目录导航</div>
              <div className="text-xs text-muted-foreground">{tocItems.length} 个章节</div>
            </div>

            {/* 目录列表 */}
            <nav className="space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full text-left text-sm transition-all duration-200 hover:text-foreground group relative rounded-md ${
                    activeId === item.id
                      ? "text-primary font-medium bg-primary/10 border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  style={{
                    paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    paddingRight: "12px",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {item.level > 1 && (
                      <ChevronRight
                        className={`h-3 w-3 transition-transform ${
                          activeId === item.id ? "rotate-90 text-primary" : "group-hover:rotate-90"
                        }`}
                      />
                    )}
                    <span className="truncate leading-relaxed" title={item.text}>
                      {item.text}
                    </span>
                  </div>

                  {/* 活跃指示器 */}
                  {activeId === item.id && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r" />}
                </button>
              ))}
            </nav>

            {/* 底部信息 */}
            <div className="pt-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>💡 点击章节快速跳转</div>
                <div>📍 当前位置会自动高亮</div>
                <div>🎯 支持多级标题导航</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 遮罩层 - 移动端点击关闭 */}
      {isVisible && isMobile && (
        <div className="fixed inset-0 bg-black/20 z-30 xl:hidden" onClick={() => tocStateManager.setVisible(false)} />
      )}
    </>
  )
}
