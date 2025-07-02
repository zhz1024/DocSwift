---
title: "API 参考"
description: "完整的 API 参考文档"
tags: ["API", "参考", "开发"]
category: "API 文档"
categoryId: 3
postId: 1
order: 1
date: "2024-01-03"
author: "API 团队"
---

# API 参考

本文档提供了文档系统 API 的完整参考。

## 核心函数

### getAllDocs()

获取所有文档文件。

\`\`\`typescript
const docs = await getAllDocs()
\`\`\`

#### 返回值

返回 `DocItem[]` 数组，包含所有文档的元数据和内容。

#### 排序规则

文档按以下优先级排序：

1. `categoryId` - 分类ID（数字越小越靠前）
2. `order` - 文档顺序
3. `postId` - 文章ID

### getDocBySlug(slug)

根据 slug 获取特定文档。

\`\`\`typescript
const doc = await getDocBySlug('getting-started')
\`\`\`

#### 参数

- `slug: string` - 文档的唯一标识符

#### 返回值

返回 `DocItem | null`，如果找不到文档则返回 `null`。

### getAdjacentDocs(currentDoc)

获取同一分类的上一篇和下一篇文档。

\`\`\`typescript
const { previousDoc, nextDoc } = await getAdjacentDocs(currentDoc)
\`\`\`

#### 参数

- `currentDoc: DocItem` - 当前文档对象

#### 返回值

返回包含 `previousDoc` 和 `nextDoc` 的对象。

## 类型定义

### DocItem

\`\`\`typescript
interface DocItem {
  slug: string
  meta: DocMeta
  content: string
  html: string
  path: string
  excerpt?: string
}
\`\`\`

### DocMeta

\`\`\`typescript
interface DocMeta {
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
\`\`\`

## 工具函数

### getDocsByTag(docs, tag)

根据标签过滤文档。

\`\`\`typescript
const taggedDocs = getDocsByTag(docs, 'guide')
\`\`\`

### getDocsByCategory(docs)

按分类分组文档。

\`\`\`typescript
const categories = getDocsByCategory(docs)
\`\`\`

### searchDocs(docs, query)

搜索文档内容。

\`\`\`typescript
const results = searchDocs(docs, '搜索关键词')
\`\`\`

## 配置选项

### YAML 前置信息

每个文档文件都应包含 YAML 前置信息：

\`\`\`yaml
---
title: "文档标题"
description: "文档描述"
tags: ["标签1", "标签2"]
category: "分类名称"
categoryId: 1
postId: 1
order: 1
date: "2024-01-01"
author: "作者名称"
---
\`\`\`

#### 字段说明

- `title`: 文档标题（必需）
- `description`: 文档描述
- `tags`: 标签数组
- `category`: 分类名称
- `categoryId`: 分类ID，用于排序
- `postId`: 文章ID，用于同分类内排序
- `order`: 显示顺序
- `date`: 发布日期
- `author`: 作者名称

## 最佳实践

### 文档组织

1. 使用有意义的分类名称
2. 设置合理的 `categoryId` 和 `postId`
3. 保持标签的一致性

### 性能优化

1. 合理使用缓存
2. 优化图片大小
3. 减少不必要的重新渲染

### SEO 优化

1. 设置描述性的标题
2. 添加元描述
3. 使用语义化的标签

这个 API 参考提供了使用文档系统所需的所有信息。
