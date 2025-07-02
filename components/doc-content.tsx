"use client"

import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag, User, Clock } from "lucide-react"
import { gsap } from "gsap"
import { GiscusComments } from "@/components/giscus-comments"
import { DocNavigation } from "@/components/doc-navigation"
import { TableOfContents } from "@/components/table-of-contents"
import { AIAssistant } from "@/components/ai-assistant"
import type { DocItem } from "@/lib/docs"

interface DocContentProps {
  doc: DocItem
  previousDoc?: DocItem
  nextDoc?: DocItem
}

export function DocContent({ doc, previousDoc, nextDoc }: DocContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // 内容淡入动画
      gsap.fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })

      // 标题动画
      const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      gsap.fromTo(headings, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.2 })

      // 代码块动画
      const codeBlocks = contentRef.current.querySelectorAll("pre")
      gsap.fromTo(
        codeBlocks,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, delay: 0.4 },
      )
    }
  }, [doc])

  const readingTime = Math.ceil(doc.content.length / 1000) // 大约每分钟1000字符

  return (
    <div className="flex gap-8 max-w-none">
      {/* 主内容区域 */}
      <div className="flex-1 min-w-0">
        <article className="max-w-4xl" ref={contentRef}>
          {/* 头部信息 */}
          <header className="mb-8 pb-6 border-b">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text leading-tight">
              {doc.meta.title}
            </h1>

            {doc.meta.description && (
              <p className="text-xl text-muted-foreground mb-4 leading-relaxed">{doc.meta.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {doc.meta.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(doc.meta.date).toLocaleDateString("zh-CN")}
                </div>
              )}

              {doc.meta.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {doc.meta.author}
                </div>
              )}

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />约 {readingTime} 分钟阅读
              </div>

              {doc.meta.postId && (
                <div className="flex items-center gap-1">
                  <span className="text-xs bg-muted px-2 py-1 rounded">ID: {doc.meta.postId}</span>
                </div>
              )}

              {doc.meta.tags && doc.meta.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <div className="flex gap-1 flex-wrap">
                    {doc.meta.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* AI 助手 */}
          <AIAssistant title={doc.meta.title} content={doc.content} className="mb-8" />

          {/* 内容 */}
          <div
            className="prose prose-gray dark:prose-invert max-w-none 
                       prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight
                       prose-p:leading-7 prose-p:text-muted-foreground
                       prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:overflow-x-auto
                       prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                       prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r
                       prose-img:rounded-lg prose-img:shadow-md prose-img:border
                       prose-table:border prose-th:border prose-td:border prose-th:bg-muted/50
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                       prose-strong:text-foreground prose-strong:font-semibold
                       prose-ul:my-4 prose-ol:my-4 prose-li:my-1
                       prose-hr:border-border prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />

          {/* 文档导航 */}
          <DocNavigation currentDoc={doc} previousDoc={previousDoc} nextDoc={nextDoc} />

          {/* 评论区域 */}
          <div className="mt-16 pt-8 border-t">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">评论讨论</h2>
              <p className="text-muted-foreground text-sm">
                欢迎在下方留言讨论，分享您的想法和建议。评论需要 GitHub 账号登录。
              </p>
            </div>
            <GiscusComments className="min-h-[200px]" />
          </div>
        </article>
      </div>

      {/* 右侧目录导航 */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents content={doc.content} />
      </aside>
    </div>
  )
}
