import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkHtml from "remark-html"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { rehype } from "rehype"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"

export interface DocMeta {
  title: string
  description?: string
  tags?: string[]
  order?: number
  category?: string
  categoryId?: number
  postId?: number
  date?: string
  author?: string
  lang?: string
}

export interface DocItem {
  slug: string
  meta: DocMeta
  content: string
  html: string
  path: string
  excerpt?: string
}

const docsDirectory = path.join(process.cwd(), "docs")

export async function getAllDocs(): Promise<DocItem[]> {
  try {
    if (!fs.existsSync(docsDirectory)) {
      console.warn("Docs directory does not exist:", docsDirectory)
      return []
    }

    const fileNames = getAllMarkdownFiles(docsDirectory)

    if (fileNames.length === 0) {
      console.warn("No markdown files found in docs directory")
      return []
    }

    const allDocs = await Promise.all(
      fileNames.map(async (fileName) => {
        try {
          const fullPath = path.join(docsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")
          const { data, content } = matter(fileContents)

          // 生成摘要
          const excerpt =
            content
              .slice(0, 200)
              .replace(/[#*`$]/g, "")
              .trim() + "..."

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

          const slug = fileName.replace(/\.md$/, "").replace(/\//g, "-")

          return {
            slug,
            meta: data as DocMeta,
            content,
            html: rehypeResult.toString(),
            path: fileName,
            excerpt,
          }
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error)
          return null
        }
      }),
    )

    const validDocs = allDocs.filter((doc): doc is DocItem => doc !== null)

    // 改进排序逻辑：先按 categoryId，再按 order，最后按 postId
    return validDocs.sort((a, b) => {
      // 首先按 categoryId 排序
      const categoryIdA = a.meta.categoryId || 999
      const categoryIdB = b.meta.categoryId || 999
      if (categoryIdA !== categoryIdB) {
        return categoryIdA - categoryIdB
      }

      // 然后按 order 排序
      const orderA = a.meta.order || 999
      const orderB = b.meta.order || 999
      if (orderA !== orderB) {
        return orderA - orderB
      }

      // 最后按 postId 排序
      const postIdA = a.meta.postId || 999
      const postIdB = b.meta.postId || 999
      return postIdA - postIdB
    })
  } catch (error) {
    console.error("Error in getAllDocs:", error)
    return []
  }
}

function getAllMarkdownFiles(dir: string, baseDir = ""): string[] {
  try {
    const files: string[] = []
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const relativePath = path.join(baseDir, item)

      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...getAllMarkdownFiles(fullPath, relativePath))
      } else if (item.endsWith(".md")) {
        files.push(relativePath)
      }
    }

    return files
  } catch (error) {
    console.error("Error reading directory:", dir, error)
    return []
  }
}

export async function getDocBySlug(slug: string): Promise<DocItem | null> {
  try {
    const docs = await getAllDocs()
    return docs.find((doc) => doc.slug === slug) || null
  } catch (error) {
    console.error("Error in getDocBySlug:", error)
    return null
  }
}

// 获取同一分类的上一篇和下一篇文档
export async function getAdjacentDocs(currentDoc: DocItem): Promise<{
  previousDoc?: DocItem
  nextDoc?: DocItem
}> {
  try {
    const allDocs = await getAllDocs()

    // 过滤同一分类的文档
    const sameCategoryDocs = allDocs.filter((doc) => doc.meta.category === currentDoc.meta.category)

    // 按 postId 排序
    sameCategoryDocs.sort((a, b) => {
      const postIdA = a.meta.postId || 999
      const postIdB = b.meta.postId || 999
      return postIdA - postIdB
    })

    const currentIndex = sameCategoryDocs.findIndex((doc) => doc.slug === currentDoc.slug)

    if (currentIndex === -1) {
      return {}
    }

    return {
      previousDoc: currentIndex > 0 ? sameCategoryDocs[currentIndex - 1] : undefined,
      nextDoc: currentIndex < sameCategoryDocs.length - 1 ? sameCategoryDocs[currentIndex + 1] : undefined,
    }
  } catch (error) {
    console.error("Error in getAdjacentDocs:", error)
    return {}
  }
}

// Client-safe utility functions
export function getDocsByTag(docs: DocItem[], tag: string): DocItem[] {
  console.log(`Searching for tag: "${tag}"`)

  const result = docs.filter((doc) => {
    const hasTag = doc.meta.tags?.includes(tag)
    if (hasTag) {
      console.log(`Found doc "${doc.meta.title}" with tag "${tag}"`)
    }
    return hasTag
  })

  console.log(`Found ${result.length} docs with tag "${tag}"`)
  return result
}

export function getAllTags(docs: DocItem[]): string[] {
  const tags = new Set<string>()
  docs.forEach((doc) => {
    doc.meta.tags?.forEach((tag) => {
      // 确保标签被正确添加，去除前后空格
      const cleanTag = tag.trim()
      if (cleanTag) {
        tags.add(cleanTag)
      }
    })
  })

  const tagArray = Array.from(tags).sort()
  console.log("All tags found:", tagArray)
  return tagArray
}

export function getDocsByCategory(docs: DocItem[]): Record<string, DocItem[]> {
  const categories: Record<string, DocItem[]> = {}

  docs.forEach((doc) => {
    const category = doc.meta.category || "未分类"
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(doc)
  })

  // 对每个分类内的文档进行排序
  Object.keys(categories).forEach((category) => {
    categories[category].sort((a, b) => {
      const orderA = a.meta.order || 999
      const orderB = b.meta.order || 999
      if (orderA !== orderB) {
        return orderA - orderB
      }

      const postIdA = a.meta.postId || 999
      const postIdB = b.meta.postId || 999
      return postIdA - postIdB
    })
  })

  return categories
}

// Client-safe search function
export function searchDocs(
  docs: DocItem[],
  query: string,
): Array<DocItem & { searchScore: number; matchedContent: string }> {
  if (!query.trim()) return []

  const searchTerms = query.toLowerCase().split(/\s+/)

  return docs
    .map((doc) => {
      const searchableText =
        `${doc.meta.title} ${doc.meta.description} ${doc.content} ${doc.meta.tags?.join(" ")}`.toLowerCase()

      let score = 0
      let matchedContent = ""

      searchTerms.forEach((term) => {
        // 标题匹配权重最高
        if (doc.meta.title.toLowerCase().includes(term)) {
          score += 10
        }
        // 描述匹配
        if (doc.meta.description?.toLowerCase().includes(term)) {
          score += 5
        }
        // 标签匹配
        if (doc.meta.tags?.some((tag) => tag.toLowerCase().includes(term))) {
          score += 3
        }
        // 内容匹配
        if (doc.content.toLowerCase().includes(term)) {
          score += 1
          // 提取匹配的内容片段
          const contentIndex = doc.content.toLowerCase().indexOf(term)
          if (contentIndex !== -1) {
            const start = Math.max(0, contentIndex - 50)
            const end = Math.min(doc.content.length, contentIndex + 100)
            matchedContent = doc.content.slice(start, end)
          }
        }
      })

      return score > 0 ? { ...doc, searchScore: score, matchedContent } : null
    })
    .filter((doc): doc is DocItem & { searchScore: number; matchedContent: string } => doc !== null)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 20)
}
