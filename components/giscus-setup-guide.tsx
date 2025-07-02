"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Copy, Check, Info, Github } from "lucide-react"

export function GiscusSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const envTemplate = `# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
NEXT_PUBLIC_GISCUS_MAPPING=pathname
NEXT_PUBLIC_GISCUS_STRICT=0
NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED=1
NEXT_PUBLIC_GISCUS_EMIT_METADATA=0
NEXT_PUBLIC_GISCUS_INPUT_POSITION=bottom
NEXT_PUBLIC_GISCUS_THEME=preferred_color_scheme
NEXT_PUBLIC_GISCUS_LANG=zh-CN`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Giscus 评论系统配置指南</h1>
        <p className="text-muted-foreground">
          按照以下步骤配置 Giscus 评论系统，为您的文档添加基于 GitHub Discussions 的评论功能
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Giscus 是一个基于 GitHub Discussions 的评论系统，用户需要 GitHub 账号才能评论。
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* 步骤 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">步骤 1</Badge>
              <CardTitle className="text-lg">准备 GitHub 仓库</CardTitle>
            </div>
            <CardDescription>确保您的 GitHub 仓库满足 Giscus 的要求</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">仓库要求：</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>仓库必须是公开的</li>
                <li>已安装 Giscus 应用</li>
                <li>已启用 Discussions 功能</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/apps/giscus" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  安装 Giscus 应用
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 步骤 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">步骤 2</Badge>
              <CardTitle className="text-lg">获取配置参数</CardTitle>
            </div>
            <CardDescription>访问 Giscus 官网获取您的仓库配置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                访问 Giscus 配置页面，输入您的仓库信息，获取所需的配置参数：
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>仓库名称 (repo)</li>
                <li>仓库 ID (repo-id)</li>
                <li>讨论分类 (category)</li>
                <li>分类 ID (category-id)</li>
              </ul>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="https://giscus.app/zh-CN" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                打开 Giscus 配置页面
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* 步骤 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">步骤 3</Badge>
              <CardTitle className="text-lg">配置环境变量</CardTitle>
            </div>
            <CardDescription>在项目根目录创建或编辑 .env.local 文件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">环境变量模板：</h4>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(envTemplate, 3)} className="h-8">
                  {copiedStep === 3 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedStep === 3 ? "已复制" : "复制"}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                <code>{envTemplate}</code>
              </pre>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>请将模板中的占位符替换为您从 Giscus 配置页面获取的实际值。</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 步骤 4 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">步骤 4</Badge>
              <CardTitle className="text-lg">重启开发服务器</CardTitle>
            </div>
            <CardDescription>重启服务器以加载新的环境变量</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">配置完成后，重启您的开发服务器：</p>
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <code className="text-sm">npm run dev</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard("npm run dev", 4)} className="h-8">
                  {copiedStep === 4 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 配置说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">配置参数说明</CardTitle>
            <CardDescription>各个配置参数的详细说明</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">必需参数：</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_REPO</code> - 仓库名称
                    </li>
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_REPO_ID</code> - 仓库 ID
                    </li>
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_CATEGORY</code> - 讨论分类
                    </li>
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_CATEGORY_ID</code> - 分类 ID
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">可选参数：</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_MAPPING</code> - 页面映射方式
                    </li>
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_THEME</code> - 主题设置
                    </li>
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_LANG</code> - 语言设置
                    </li>
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">GISCUS_INPUT_POSITION</code> - 输入框位置
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
