"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import type { DocItem } from "@/lib/docs"

interface CollapsibleSidebarProps {
  docs: DocItem[]
}

export function CollapsibleSidebar({ docs }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // 监听来自头部按钮的折叠事件
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsCollapsed(event.detail.isCollapsed)
    }

    window.addEventListener("sidebar-toggle", handleSidebarToggle as EventListener)
    return () => window.removeEventListener("sidebar-toggle", handleSidebarToggle as EventListener)
  }, [])

  // 移动端显示原始侧边栏
  if (isMobile) {
    return <Sidebar docs={docs} />
  }

  return (
    <>
      {/* 侧边栏 */}
      <aside
        className={`
          hidden lg:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 
          sticky top-14 h-[calc(100vh-3.5rem)] transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-0 overflow-hidden" : "w-64"}
        `}
      >
        <div className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
          <Sidebar docs={docs} />
        </div>
      </aside>

      {/* 折叠状态下的占位符 */}
      {isCollapsed && <div className="hidden lg:block w-0 border-r border-transparent" />}
    </>
  )
}
