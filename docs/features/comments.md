---
title: "评论系统"
description: "了解如何使用和配置 Giscus 评论系统"
tags: ["功能", "评论", "Giscus"]
category: "功能特性"
order: 3
date: "2024-01-04"
author: "开发团队"
---

# 评论系统

我们的文档系统集成了 Giscus 评论系统，基于 GitHub Discussions 提供强大的评论功能。

## 主要特性

### 🔐 GitHub 登录
- 使用 GitHub 账号登录
- 安全可靠的身份验证
- 支持 GitHub 用户头像和信息

### 💬 丰富的评论功能
- 支持 Markdown 格式
- 表情符号反应
- 嵌套回复
- 实时更新

### 🎨 主题适配
- 自动适配明暗主题
- 与文档系统风格一致
- 响应式设计

### 🌐 多语言支持
- 支持中文界面
- 可配置其他语言

## 配置说明

评论系统通过环境变量进行配置，支持以下参数：

### 必需配置

\`\`\`env
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
\`\`\`

### 可选配置

\`\`\`env
NEXT_PUBLIC_GISCUS_MAPPING=pathname
NEXT_PUBLIC_GISCUS_STRICT=0
NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED=1
NEXT_PUBLIC_GISCUS_EMIT_METADATA=0
NEXT_PUBLIC_GISCUS_INPUT_POSITION=bottom
NEXT_PUBLIC_GISCUS_THEME=preferred_color_scheme
NEXT_PUBLIC_GISCUS_LANG=zh-CN
\`\`\`

## 快速开始

1. **准备 GitHub 仓库**
   - 确保仓库是公开的
   - 启用 Discussions 功能
   - 安装 Giscus 应用

2. **获取配置参数**
   - 访问 [giscus.app](https://giscus.app/zh-CN)
   - 输入仓库信息
   - 复制生成的配置参数

3. **配置环境变量**
   - 创建 `.env.local` 文件
   - 添加必需的环境变量
   - 重启开发服务器

4. **验证配置**
   - 访问任意文档页面
   - 查看页面底部的评论区域
   - 测试登录和评论功能

## 使用技巧

### 管理评论
- 作为仓库管理员，您可以在 GitHub Discussions 中管理所有评论
- 可以删除不当评论、锁定讨论等
- 支持设置讨论分类和标签

### 自定义主题
- 支持多种预设主题
- 可以设置跟随系统主题
- 支持自定义 CSS（高级用法）

### 页面映射
- `pathname`: 根据页面路径映射（推荐）
- `url`: 根据完整 URL 映射
- `title`: 根据页面标题映射
- `og:title`: 根据 Open Graph 标题映射

## 故障排除

### 评论不显示
1. 检查环境变量是否正确配置
2. 确认仓库是公开的且已启用 Discussions
3. 验证 Giscus 应用是否已安装

### 主题不匹配
1. 检查 `NEXT_PUBLIC_GISCUS_THEME` 设置
2. 确认主题切换功能正常工作
3. 清除浏览器缓存重试

### 权限问题
1. 确认用户已登录 GitHub
2. 检查仓库的 Discussions 权限设置
3. 验证 Giscus 应用权限

## 高级配置

### 自定义样式
可以通过 CSS 变量自定义评论区域的样式：

\`\`\`css
.giscus {
  --color-primary: your-primary-color;
  --color-primary-contrast: your-contrast-color;
}
\`\`\`

### 事件监听
可以监听 Giscus 的事件来实现自定义功能：

\`\`\`javascript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://giscus.app') return;
  // 处理 Giscus 事件
});
\`\`\`

## 最佳实践

1. **选择合适的讨论分类**：为不同类型的文档创建不同的讨论分类
2. **设置清晰的社区规则**：在仓库中添加行为准则
3. **定期维护**：及时回复用户评论，维护良好的社区氛围
4. **备份重要讨论**：定期导出重要的讨论内容

通过合理配置和使用 Giscus 评论系统，您可以为文档创建一个活跃的社区讨论环境。
