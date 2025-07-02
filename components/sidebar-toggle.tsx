"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeft, PanelLeftClose } from "lucide-react"

interface SidebarToggleProps {
  className?: string
}

export function SidebarToggle({ className }: SidebarToggleProps) {
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

  // 移动端不显示折叠按钮
  if (isMobile) {
    return null
  }

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
    // 发送自定义事件通知侧边栏组件
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: { isCollapsed: !isCollapsed },
      }),
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`h-8 w-8 p-0 hover:bg-muted ${className}`}
      title={isCollapsed ? "展开侧边栏" : "折叠侧边栏"}
    >
      {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
    </Button>
  )
}
