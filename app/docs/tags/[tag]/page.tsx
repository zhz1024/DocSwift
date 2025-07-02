import { notFound } from "next/navigation"
import { getAllDocs, getDocsByTag, getAllTags } from "@/lib/docs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  try {
    console.log("Generating static params for tags...")
    const docs = await getAllDocs()
    const tags = getAllTags(docs)

    console.log("Found tags:", tags)

    // 重要：不要在这里编码，Next.js会自动处理URL编码
    const params = tags.map((tag) => {
      console.log(`Generating param for tag: "${tag}"`)
      return {
        tag: tag, // 直接返回原始标签，不编码
      }
    })

    console.log("Generated static params:", params)
    return params
  } catch (error) {
    console.error("Error generating static params for tags:", error)
    return []
  }
}

export async function generateMetadata({ params }: TagPageProps) {
  try {
    // Next.js会自动解码URL参数，所以这里直接使用
    const tag = decodeURIComponent(params.tag)
    const allDocs = await getAllDocs()
    const docs = getDocsByTag(allDocs, tag)

    return {
      title: `标签: ${tag}`,
      description: `包含标签 "${tag}" 的所有文档 (${docs.length} 篇)`,
    }
  } catch (error) {
    console.error("Error generating metadata for tag:", error)
    return {
      title: "标签页面",
      description: "文档标签页面",
    }
  }
}

export default async function TagPage({ params }: TagPageProps) {
  try {
    console.log("TagPage received params:", params)

    // Next.js传递的params.tag可能是编码的，需要解码
    const rawTag = params.tag
    const decodedTag = decodeURIComponent(rawTag)

    console.log(`Raw tag param: "${rawTag}"`)
    console.log(`Decoded tag: "${decodedTag}"`)

    const allDocs = await getAllDocs()
    console.log(`Total docs: ${allDocs.length}`)

    // 获取所有标签用于调试
    const allTags = getAllTags(allDocs)
    console.log("All available tags:", allTags)

    // 检查解码后的标签是否在标签列表中
    const tagExists = allTags.includes(decodedTag)
    console.log(`Tag "${decodedTag}" exists in tag list: ${tagExists}`)

    // 尝试多种匹配方式
    let docs = getDocsByTag(allDocs, decodedTag)
    console.log(`Exact match docs: ${docs.length}`)

    // 如果精确匹配失败，尝试大小写不敏感匹配
    if (docs.length === 0) {
      docs = getDocsByTagCaseInsensitive(allDocs, decodedTag)
      console.log(`Case insensitive match docs: ${docs.length}`)
    }

    // 如果还是没有找到，尝试模糊匹配
    if (docs.length === 0) {
      docs = getDocsByTagFuzzy(allDocs, decodedTag)
      console.log(`Fuzzy match docs: ${docs.length}`)
    }

    // 查找相似标签
    const similarTags = findSimilarTags(allTags, decodedTag)
    console.log("Similar tags:", similarTags)

    if (docs.length === 0) {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Tag className="h-6 w-6" />
            <h1 className="text-3xl font-bold">标签: "{decodedTag}"</h1>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>没有找到包含标签 "{decodedTag}" 的文档。</p>

                {/* 调试信息 */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">调试信息</summary>
                  <div className="mt-2 p-3 bg-muted rounded text-xs space-y-2">
                    <p>
                      <strong>原始URL参数:</strong> {rawTag}
                    </p>
                    <p>
                      <strong>解码后标签:</strong> {decodedTag}
                    </p>
                    <p>
                      <strong>标签是否存在:</strong> {tagExists ? "是" : "否"}
                    </p>
                    <p>
                      <strong>总文档数:</strong> {allDocs.length}
                    </p>
                    <p>
                      <strong>所有标签 ({allTags.length}):</strong>
                    </p>
                    <div className="ml-4 max-h-32 overflow-y-auto">
                      {allTags.map((tag, index) => (
                        <div key={index} className="text-xs">
                          {index + 1}. "{tag}"
                        </div>
                      ))}
                    </div>
                  </div>
                </details>

                {/* 相似标签建议 */}
                {similarTags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">您可能在寻找这些标签:</p>
                    <div className="flex gap-2 flex-wrap">
                      {similarTags.map((similarTag) => (
                        <Link key={similarTag} href={`/docs/tags/${encodeURIComponent(similarTag)}`}>
                          <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                            {similarTag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 所有标签 */}
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">所有可用标签:</p>
                  <div className="flex gap-2 flex-wrap max-h-40 overflow-y-auto">
                    {allTags.map((tag) => (
                      <Link key={tag} href={`/docs/tags/${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary" className="hover:bg-muted cursor-pointer text-xs">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6" />
          <h1 className="text-3xl font-bold">标签: "{decodedTag}"</h1>
          <Badge variant="secondary">{docs.length} 篇文档</Badge>
        </div>

        <div className="grid gap-4">
          {docs.map((doc) => (
            <Card key={doc.slug}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/docs/${doc.slug}`} className="hover:underline">
                    {doc.meta.title}
                  </Link>
                </CardTitle>
                {doc.meta.description && <CardDescription>{doc.meta.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doc.meta.tags && (
                    <div className="flex gap-1 flex-wrap">
                      {doc.meta.tags.map((docTag) => (
                        <Link key={docTag} href={`/docs/tags/${encodeURIComponent(docTag)}`}>
                          <Badge
                            variant={docTag === decodedTag ? "default" : "secondary"}
                            className="text-xs hover:bg-muted cursor-pointer"
                          >
                            {docTag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* 文档元信息 */}
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {doc.meta.category && <span>分类: {doc.meta.category}</span>}
                    {doc.meta.date && <span>日期: {new Date(doc.meta.date).toLocaleDateString("zh-CN")}</span>}
                    {doc.meta.author && <span>作者: {doc.meta.author}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading tag page:", error)
    notFound()
  }
}

// 大小写不敏感的标签匹配
function getDocsByTagCaseInsensitive(docs: any[], tag: string) {
  const lowerTag = tag.toLowerCase()
  return docs.filter((doc) => doc.meta.tags?.some((docTag: string) => docTag.toLowerCase() === lowerTag))
}

// 模糊匹配（包含关系）
function getDocsByTagFuzzy(docs: any[], tag: string) {
  const lowerTag = tag.toLowerCase()
  return docs.filter((doc) =>
    doc.meta.tags?.some(
      (docTag: string) => docTag.toLowerCase().includes(lowerTag) || lowerTag.includes(docTag.toLowerCase()),
    ),
  )
}

// 查找相似标签
function findSimilarTags(allTags: string[], targetTag: string): string[] {
  const lowerTarget = targetTag.toLowerCase()

  return allTags
    .filter((tag) => {
      const lowerTag = tag.toLowerCase()
      return (
        lowerTag.includes(lowerTarget) ||
        lowerTarget.includes(lowerTag) ||
        levenshteinDistance(lowerTag, lowerTarget) <= 2
      )
    })
    .slice(0, 5)
}

// 简单的编辑距离算法
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}
