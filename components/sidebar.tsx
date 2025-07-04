"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, FileText, Tag, Menu, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { gsap } from "gsap"
import type { DocItem } from "@/lib/docs"

interface SidebarProps {
  docs: DocItem[]
}

// 客户端安全的工具函数
function getDocsByCategory(docs: DocItem[]): Record<string, DocItem[]> {
  const categories: Record<string, DocItem[]> = {}

  docs.forEach((doc) => {
    const category = doc.meta.category || "未分类"
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(doc)
  })

  return categories
}

function getAllTags(docs: DocItem[]): string[] {
  const tags = new Set<string>()
  docs.forEach((doc) => {
    doc.meta.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

function SidebarContent({ docs }: SidebarProps) {
  const pathname = usePathname()

  // 使用 useMemo 缓存计算结果，避免每次渲染都重新计算
  const categories = useMemo(() => getDocsByCategory(docs), [docs])
  const tags = useMemo(() => getAllTags(docs), [docs])

  // 使用 useMemo 计算初始的 openCategories 状态
  const initialOpenCategories = useMemo(() => {
    const defaultOpen: Record<string, boolean> = {}
    Object.keys(categories).forEach((category) => {
      defaultOpen[category] = true
    })
    return defaultOpen
  }, [categories])

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(initialOpenCategories)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // 当 categories 改变时更新 openCategories（只在必要时）
  useEffect(() => {
    setOpenCategories((prev) => {
      const newCategories = Object.keys(categories)
      const hasNewCategories = newCategories.some((cat) => !(cat in prev))

      if (hasNewCategories) {
        const updated = { ...prev }
        newCategories.forEach((category) => {
          if (!(category in updated)) {
            updated[category] = true
          }
        })
        return updated
      }

      return prev
    })
  }, [categories])

  // 动画效果
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
      )
    }
  }, [])

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-4" ref={sidebarRef}>
        {/* 快速导航 */}
        <div className="space-y-2">
          <Link
            href="/docs"
            className={`block p-2 text-sm rounded-md transition-all duration-200 hover:bg-muted/50 ${
              pathname === "/docs"
                ? "bg-muted font-medium text-foreground border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📚 文档首页
          </Link>
        </div>

        {/* 分类导航 */}
        {Object.keys(categories).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">文档分类</h3>
            <div className="space-y-1">
              {Object.entries(categories).map(([category, categoryDocs]) => (
                <div key={category} className="space-y-1">
                  <Collapsible open={openCategories[category] ?? true} onOpenChange={() => toggleCategory(category)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto font-medium text-left hover:bg-muted/50 group"
                      >
                        <span className="flex items-center gap-2 truncate min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate text-sm">{category}</span>
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {categoryDocs.length}
                          </Badge>
                        </span>
                        {(openCategories[category] ?? true) ? (
                          <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                        ) : (
                          <ChevronRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      <div className="ml-6 space-y-1 border-l border-border/50 pl-3">
                        {categoryDocs
                          .sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999))
                          .map((doc) => (
                            <Link
                              key={doc.slug}
                              href={`/docs/${doc.slug}`}
                              className={`block p-2 text-sm rounded-md transition-all duration-200 hover:bg-muted/50 group ${
                                pathname === `/docs/${doc.slug}`
                                  ? "bg-muted font-medium text-foreground border-l-2 border-primary shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <div
                                className="truncate group-hover:text-foreground transition-colors"
                                title={doc.meta.title}
                              >
                                {doc.meta.title}
                              </div>
                              {doc.meta.description && (
                                <div className="text-xs text-muted-foreground/70 mt-1 truncate">
                                  {doc.meta.description}
                                </div>
                              )}
                            </Link>
                          ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 标签云 */}
        {tags.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Tag className="h-4 w-4" />
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 20).map((tag) => (
                <Link key={tag} href={`/docs/tags/${encodeURIComponent(tag)}`} className="inline-block">
                  <Badge
                    variant="outline"
                    className="text-xs hover:bg-muted hover:border-primary/50 cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
              {tags.length > 20 && (
                <Badge variant="secondary" className="text-xs">
                  +{tags.length - 20} 更多
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function Sidebar({ docs }: SidebarProps) {
  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:block w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-14 h-[calc(100vh-3.5rem)]">
        <SidebarContent docs={docs} />
      </aside>

      {/* 移动端侧边栏 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">打开菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          {/* 修复：使用统一的头部，只有一个关闭按钮 */}
          <SheetHeader className="flex flex-row items-center justify-between p-4 border-b">
            <SheetTitle>文档导航</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">关闭</span>
              </Button>
            </SheetClose>
          </SheetHeader>
          <SidebarContent docs={docs} />
        </SheetContent>
      </Sheet>
    </>
  )
}
