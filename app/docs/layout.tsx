import type React from "react"
import { Suspense } from "react"
import { getAllDocs } from "@/lib/docs"
import { DocsLayoutClient } from "@/components/docs-layout-client"
import { Book, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { TocToggle } from "@/components/toc-toggle"
import { SidebarToggle } from "@/components/sidebar-toggle"

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
    </div>
  )
}

// Error component
function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let docs = []
  let error = null

  try {
    docs = await getAllDocs()
  } catch (err) {
    console.error("Failed to load docs:", err)
    error = err instanceof Error ? err.message : "Failed to load documentation"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 头部导航 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            {/* 侧边栏折叠按钮 */}
            {!error && <SidebarToggle />}

            <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
              <Book className="h-6 w-6" />
              <span className="hidden sm:inline">文档系统</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            {/* 目录切换按钮 - 放在主题切换按钮右边 */}
            <TocToggle />
          </div>
        </div>
      </header>

      {error ? (
        <ErrorAlert message={error} />
      ) : (
        <DocsLayoutClient docs={docs}>
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </DocsLayoutClient>
      )}
    </div>
  )
}
