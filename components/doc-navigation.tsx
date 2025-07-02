"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DocItem } from "@/lib/docs"

interface DocNavigationProps {
  currentDoc: DocItem
  previousDoc?: DocItem
  nextDoc?: DocItem
}

export function DocNavigation({ currentDoc, previousDoc, nextDoc }: DocNavigationProps) {
  if (!previousDoc && !nextDoc) {
    return null
  }

  return (
    <div className="mt-16 pt-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 上一篇 */}
        {previousDoc ? (
          <Link href={`/docs/${previousDoc.slug}`} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-muted group-hover:border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>上一篇</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {previousDoc.meta.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {previousDoc.meta.description && (
                  <CardDescription className="line-clamp-2 mb-3">{previousDoc.meta.description}</CardDescription>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {previousDoc.meta.date && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(previousDoc.meta.date).toLocaleDateString("zh-CN")}
                    </div>
                  )}
                  {previousDoc.meta.tags && previousDoc.meta.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <div className="flex gap-1">
                        {previousDoc.meta.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs h-5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <div></div>
        )}

        {/* 下一篇 */}
        {nextDoc && (
          <Link href={`/docs/${nextDoc.slug}`} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-r-4 border-r-muted group-hover:border-r-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                  <span>下一篇</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 text-right">
                  {nextDoc.meta.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {nextDoc.meta.description && (
                  <CardDescription className="line-clamp-2 mb-3 text-right">{nextDoc.meta.description}</CardDescription>
                )}
                <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
                  {nextDoc.meta.date && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(nextDoc.meta.date).toLocaleDateString("zh-CN")}
                    </div>
                  )}
                  {nextDoc.meta.tags && nextDoc.meta.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <div className="flex gap-1">
                        {nextDoc.meta.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs h-5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  )
}
