"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronRight } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const tocRef = useRef<HTMLDivElement>(null)

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

    // 设置滚动监听
    const observers: IntersectionObserver[] = []
    const headingElements = Array.from(headings)

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    headingElements.forEach((heading) => {
      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      })
      observer.observe(heading)
      observers.push(observer)
    })

    // GSAP 动画
    if (tocRef.current) {
      gsap.fromTo(
        tocRef.current.children,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.3 },
      )
    }

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // 考虑固定头部的高度
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="space-y-4" ref={tocRef}>
        <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">目录</div>
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left text-sm transition-all duration-200 hover:text-foreground group ${
                activeId === item.id
                  ? "text-primary font-medium border-l-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{
                paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingRight: "12px",
              }}
            >
              <div className="flex items-center gap-2">
                {item.level > 1 && (
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${
                      activeId === item.id ? "rotate-90" : "group-hover:rotate-90"
                    }`}
                  />
                )}
                <span className="truncate" title={item.text}>
                  {item.text}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
