"use client"

import { useEffect, useRef } from "react"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkHtml from "remark-html"
import { rehype } from "rehype"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"

interface MarkdownRendererProps {
  content: string
  className?: string
  animate?: boolean
}

export function MarkdownRenderer({ content, className = "", animate = false }: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderMarkdown = async () => {
      if (!content.trim()) return

      try {
        // 先用 remark 处理 Markdown 和数学公式
        const remarkResult = await remark()
          .use(remarkGfm)
          .use(remarkMath)
          .use(remarkHtml, { sanitize: false })
          .process(content)

        // 再用 rehype 处理 HTML 和 KaTeX
        const rehypeResult = await rehype()
          .use(rehypeKatex, {
            strict: false,
            trust: true,
            macros: {
              "\\RR": "\\mathbb{R}",
              "\\NN": "\\mathbb{N}",
              "\\ZZ": "\\mathbb{Z}",
              "\\QQ": "\\mathbb{Q}",
              "\\CC": "\\mathbb{C}",
            },
          })
          .use(rehypeHighlight, {
            detect: true,
            subset: false,
          })
          .use(rehypeStringify)
          .process(remarkResult.value)

        if (contentRef.current) {
          contentRef.current.innerHTML = rehypeResult.toString()

          // 如果启用动画，添加淡入效果
          if (animate) {
            contentRef.current.style.opacity = "0"
            requestAnimationFrame(() => {
              if (contentRef.current) {
                contentRef.current.style.transition = "opacity 0.3s ease-in-out"
                contentRef.current.style.opacity = "1"
              }
            })
          }
        }
      } catch (error) {
        console.error("Markdown rendering failed:", error)
        if (contentRef.current) {
          contentRef.current.textContent = content
        }
      }
    }

    renderMarkdown()
  }, [content, animate])

  return (
    <div
      ref={contentRef}
      className={`
        prose prose-sm dark:prose-invert max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight prose-headings:mt-4 prose-headings:mb-2
        prose-p:leading-6 prose-p:my-2
        prose-pre:bg-muted prose-pre:border prose-pre:rounded prose-pre:text-xs prose-pre:overflow-x-auto
        prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:rounded-r prose-blockquote:my-2
        prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
        prose-table:border prose-th:border prose-td:border prose-th:bg-muted/50 prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:text-foreground prose-strong:font-semibold
        prose-hr:border-border prose-hr:my-4
        ${className}
      `}
    />
  )
}
