"use client"

import type React from "react"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { SearchDialog } from "@/components/search"
import type { DocItem } from "@/lib/docs"

interface DocsLayoutClientProps {
  docs: DocItem[]
  children: React.ReactNode
}

export function DocsLayoutClient({ docs, children }: DocsLayoutClientProps) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* 可折叠侧边栏 */}
      <CollapsibleSidebar docs={docs} />

      {/* 主内容区域 */}
      <main className="flex-1 overflow-x-hidden">
        <div className="container max-w-6xl mx-auto p-6">
          {/* 搜索功能 */}
          <div className="mb-6 flex justify-end lg:hidden">
            <SearchDialog docs={docs} />
          </div>

          {/* 桌面端搜索 */}
          <div className="hidden lg:block mb-6">
            <div className="flex justify-end">
              <SearchDialog docs={docs} />
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}
