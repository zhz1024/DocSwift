"use client"

import { useState, useEffect, useRef } from "react"
import { MarkdownRenderer } from "./markdown-renderer"

interface StreamingTextProps {
  content: string
  isStreaming: boolean
  className?: string
  speed?: number // 打字机效果速度（毫秒）
}

export function StreamingText({ content, isStreaming, className = "", speed = 30 }: StreamingTextProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [showCursor, setShowCursor] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const indexRef = useRef(0)

  useEffect(() => {
    if (isStreaming) {
      setShowCursor(true)
      // 实时显示流式内容
      setDisplayedContent(content)
    } else {
      // 流式结束后，隐藏光标
      setShowCursor(false)
      setDisplayedContent(content)
    }
  }, [content, isStreaming])

  // 光标闪烁效果
  useEffect(() => {
    if (!showCursor) return

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [showCursor])

  return (
    <div className={`relative ${className}`}>
      <MarkdownRenderer content={displayedContent} animate={!isStreaming} />
      {isStreaming && (
        <span
          className={`inline-block w-2 h-4 bg-primary ml-1 transition-opacity duration-200 ${
            showCursor ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  )
}
