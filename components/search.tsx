"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { gsap } from "gsap"
import type { DocItem } from "@/lib/docs"

interface SearchProps {
  docs: DocItem[]
}

interface SearchResult extends DocItem {
  searchScore: number
  matchedContent: string
}

// 安全的搜索函数，处理特殊字符
function clientSearchDocs(docs: DocItem[], query: string): SearchResult[] {
  if (!query.trim()) return []

  try {
    // 转义特殊的正则表达式字符
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    // 分割搜索词，并转义特殊字符
    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => escapeRegExp(term))

    if (searchTerms.length === 0) return []

    return docs
      .map((doc) => {
        const searchableText =
          `${doc.meta.title} ${doc.meta.description || ""} ${doc.content} ${doc.meta.tags?.join(" ") || ""}`.toLowerCase()

        let score = 0
        let matchedContent = ""

        searchTerms.forEach((term) => {
          try {
            // 使用转义后的搜索词创建正则表达式
            const regex = new RegExp(term, "gi")

            if (regex.test(doc.meta.title.toLowerCase())) {
              score += 10
            }
            if (doc.meta.description && regex.test(doc.meta.description.toLowerCase())) {
              score += 5
            }
            if (doc.meta.tags?.some((tag) => regex.test(tag.toLowerCase()))) {
              score += 3
            }
            if (regex.test(doc.content.toLowerCase())) {
              score += 1
              const match = doc.content.toLowerCase().match(regex)
              if (match && match.index !== undefined) {
                const start = Math.max(0, match.index - 50)
                const end = Math.min(doc.content.length, match.index + 100)
                matchedContent = doc.content.slice(start, end)
              }
            }
          } catch (regexError) {
            // 如果正则表达式失败，使用简单的字符串包含检查
            console.warn("Regex failed for term:", term, regexError)
            const simpleTerm = term.replace(/\\/g, "") // 移除转义字符

            if (doc.meta.title.toLowerCase().includes(simpleTerm)) {
              score += 10
            }
            if (doc.meta.description?.toLowerCase().includes(simpleTerm)) {
              score += 5
            }
            if (doc.meta.tags?.some((tag) => tag.toLowerCase().includes(simpleTerm))) {
              score += 3
            }
            if (doc.content.toLowerCase().includes(simpleTerm)) {
              score += 1
              const contentIndex = doc.content.toLowerCase().indexOf(simpleTerm)
              if (contentIndex !== -1) {
                const start = Math.max(0, contentIndex - 50)
                const end = Math.min(doc.content.length, contentIndex + 100)
                matchedContent = doc.content.slice(start, end)
              }
            }
          }
        })

        return score > 0 ? { ...doc, searchScore: score, matchedContent } : null
      })
      .filter((doc): doc is SearchResult => doc !== null)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 20)
  } catch (error) {
    console.error("Search failed:", error)
    return []
  }
}

export function SearchDialog({ docs }: SearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string>("")
  const resultsRef = useRef<HTMLDivElement>(null)

  // 防抖搜索
  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsSearching(false)
        setSearchError("")
        return
      }

      setIsSearching(true)
      setSearchError("")

      const timeoutId = setTimeout(() => {
        try {
          const searchResults = clientSearchDocs(docs, searchQuery)
          setResults(searchResults)
          setSearchError("")

          // GSAP animation
          if (resultsRef.current && searchResults.length > 0) {
            gsap.fromTo(
              resultsRef.current.children,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 },
            )
          }
        } catch (error) {
          console.error("Search error:", error)
          setSearchError("搜索时发生错误，请尝试其他关键词")
          setResults([])
        } finally {
          setIsSearching(false)
        }
      }, 300)

      return () => clearTimeout(timeoutId)
    },
    [docs],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const cleanup = handleSearch(query)
    return cleanup
  }, [query, handleSearch])

  const highlightText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text

    try {
      // 转义特殊字符
      const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      }

      const escapedQuery = escapeRegExp(query)
      const regex = new RegExp(`(${escapedQuery.split(/\s+/).map(escapeRegExp).join("|")})`, "gi")
      const parts = text.split(regex)

      return parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        ),
      )
    } catch (error) {
      // 如果高亮失败，返回原始文本
      console.warn("Highlight failed:", error)
      return text
    }
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        搜索文档...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>搜索文档</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="输入关键词搜索... (支持中文、英文、特殊字符)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>

            {isSearching && <div className="text-center py-8 text-muted-foreground">搜索中...</div>}

            {searchError && (
              <div className="text-center py-8 text-destructive">
                <div className="space-y-2">
                  <div>{searchError}</div>
                  <div className="text-xs text-muted-foreground">
                    提示：避免使用过多的特殊字符，尝试使用更简单的关键词
                  </div>
                </div>
              </div>
            )}

            {!isSearching && !searchError && results.length > 0 && (
              <div className="max-h-96 overflow-y-auto space-y-3" ref={resultsRef}>
                {results.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    onClick={() => setOpen(false)}
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-base mb-1">{highlightText(doc.meta.title, query)}</div>
                        {doc.meta.description && (
                          <div className="text-sm text-muted-foreground mb-2">
                            {highlightText(doc.meta.description, query)}
                          </div>
                        )}
                        {doc.matchedContent && (
                          <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded text-xs mb-2">
                            ...{highlightText(doc.matchedContent, query)}...
                          </div>
                        )}
                        {doc.meta.tags && doc.meta.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {doc.meta.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isSearching && !searchError && query && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="space-y-2">
                  <div>没有找到包含 "{query}" 的文档</div>
                  <div className="text-xs">尝试使用不同的关键词，或检查拼写是否正确</div>
                </div>
              </div>
            )}

            {!query && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="space-y-2">
                  <div>输入关键词开始搜索</div>
                  <div className="text-xs">支持搜索标题、内容、标签等，支持特殊字符</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
