"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { List, X } from "lucide-react"
import { tocStateManager } from "@/components/table-of-contents"

export function TocToggle() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // 订阅全局状态
  useEffect(() => {
    const unsubscribe = tocStateManager.subscribe(setIsVisible)
    setIsVisible(tocStateManager.isVisible)
    return unsubscribe
  }, [])

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleVisibility = () => {
    tocStateManager.setVisible(!isVisible)
  }

  return (
    <Button
      onClick={toggleVisibility}
      variant="ghost"
      size="sm"
      className="h-8 w-8 px-0"
      title={isVisible ? "隐藏目录" : "显示目录"}
    >
      {isVisible ? <X className="h-[1.2rem] w-[1.2rem]" /> : <List className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">{isVisible ? "隐藏目录" : "显示目录"}</span>
    </Button>
  )
}
