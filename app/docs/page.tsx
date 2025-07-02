import { getAllDocs, getDocsByCategory, getAllTags } from "@/lib/docs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Tag, BookOpen } from "lucide-react"
import Link from "next/link"

export default async function DocsPage() {
  let docs = []
  let error = null

  try {
    docs = await getAllDocs()
  } catch (err) {
    console.error("Failed to load docs:", err)
    error = err instanceof Error ? err.message : "Failed to load documentation"
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">文档加载失败</h1>
          <p className="text-xl text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const categories = getDocsByCategory(docs)
  const tags = getAllTags(docs)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">文档中心</h1>
        <p className="text-xl text-muted-foreground">全面的指南和文档，帮助您快速上手</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">文档总数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{docs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">分类数量</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categories).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">标签数量</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">按分类浏览</h2>
        <div className="grid gap-6">
          {Object.entries(categories).map(([category, categoryDocs]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {category}
                </CardTitle>
                <CardDescription>{categoryDocs.length} 篇文档</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {categoryDocs.slice(0, 5).map((doc) => (
                    <Link
                      key={doc.slug}
                      href={`/docs/${doc.slug}`}
                      className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium">{doc.meta.title}</div>
                      {doc.meta.description && (
                        <div className="text-sm text-muted-foreground mt-1">{doc.meta.description}</div>
                      )}
                      {doc.meta.tags && doc.meta.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {doc.meta.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                  {categoryDocs.length > 5 && (
                    <div className="text-sm text-muted-foreground text-center pt-2">
                      还有 {categoryDocs.length - 5} 篇文档...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
