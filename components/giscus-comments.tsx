"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface GiscusCommentsProps {
  className?: string
}

export function GiscusComments({ className }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()

  // Giscus 配置
  const giscusConfig = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
    mapping: process.env.NEXT_PUBLIC_GISCUS_MAPPING || "pathname",
    strict: process.env.NEXT_PUBLIC_GISCUS_STRICT || "0",
    reactionsEnabled: process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED || "1",
    emitMetadata: process.env.NEXT_PUBLIC_GISCUS_EMIT_METADATA || "0",
    inputPosition: process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION || "bottom",
    lang: process.env.NEXT_PUBLIC_GISCUS_LANG || "zh-CN",
  }

  // 检查是否配置了必要的环境变量
  const isConfigured = giscusConfig.repo && giscusConfig.repoId && giscusConfig.category && giscusConfig.categoryId

  useEffect(() => {
    if (!isConfigured || !ref.current) return

    // 清除之前的 Giscus 实例
    const container = ref.current
    container.innerHTML = ""

    // 根据当前主题设置 Giscus 主题
    const giscusTheme = (() => {
      if (process.env.NEXT_PUBLIC_GISCUS_THEME === "preferred_color_scheme") {
        return resolvedTheme === "dark" ? "dark" : "light"
      }
      return process.env.NEXT_PUBLIC_GISCUS_THEME || "preferred_color_scheme"
    })()

    // 创建 Giscus 脚本
    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", giscusConfig.repo!)
    script.setAttribute("data-repo-id", giscusConfig.repoId!)
    script.setAttribute("data-category", giscusConfig.category!)
    script.setAttribute("data-category-id", giscusConfig.categoryId!)
    script.setAttribute("data-mapping", giscusConfig.mapping)
    script.setAttribute("data-strict", giscusConfig.strict)
    script.setAttribute("data-reactions-enabled", giscusConfig.reactionsEnabled)
    script.setAttribute("data-emit-metadata", giscusConfig.emitMetadata)
    script.setAttribute("data-input-position", giscusConfig.inputPosition as "top" | "bottom")
    script.setAttribute("data-theme", giscusTheme)
    script.setAttribute("data-lang", giscusConfig.lang)
    script.setAttribute("crossorigin", "anonymous")
    script.async = true

    container.appendChild(script)

    return () => {
      // 清理函数
      if (container) {
        container.innerHTML = ""
      }
    }
  }, [isConfigured, resolvedTheme])

  // 主题变化时更新 Giscus 主题
  useEffect(() => {
    if (!isConfigured) return

    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
    if (iframe) {
      const giscusTheme = (() => {
        if (process.env.NEXT_PUBLIC_GISCUS_THEME === "preferred_color_scheme") {
          return resolvedTheme === "dark" ? "dark" : "light"
        }
        return process.env.NEXT_PUBLIC_GISCUS_THEME || "preferred_color_scheme"
      })()

      iframe.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: giscusTheme,
            },
          },
        },
        "https://giscus.app",
      )
    }
  }, [resolvedTheme, isConfigured])

  if (!isConfigured) {
    return (
      <div className={`p-6 border border-dashed border-muted-foreground/30 rounded-lg text-center ${className}`}>
        <div className="space-y-2">
          <h3 className="font-medium text-muted-foreground">评论系统未配置</h3>
          <p className="text-sm text-muted-foreground">
            请在 <code className="bg-muted px-1 py-0.5 rounded text-xs">.env.local</code> 文件中配置 Giscus 环境变量
          </p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-primary hover:underline">查看配置说明</summary>
            <div className="mt-2 p-3 bg-muted rounded text-xs space-y-1">
              <p>需要配置以下环境变量：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>NEXT_PUBLIC_GISCUS_REPO</li>
                <li>NEXT_PUBLIC_GISCUS_REPO_ID</li>
                <li>NEXT_PUBLIC_GISCUS_CATEGORY</li>
                <li>NEXT_PUBLIC_GISCUS_CATEGORY_ID</li>
              </ul>
              <p className="mt-2">
                访问{" "}
                <a
                  href="https://giscus.app/zh-CN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  giscus.app
                </a>{" "}
                获取配置值
              </p>
            </div>
          </details>
        </div>
      </div>
    )
  }

  return <div ref={ref} className={className} />
}
