---
title: "头部目录切换按钮"
description: "了解如何使用位于头部导航栏的目录切换功能"
tags: ["目录", "导航", "头部", "切换"]
category: "功能特性"
categoryId: 2
postId: 7
order: 7
date: "2024-01-08"
author: "UI 团队"
---

# 头部目录切换按钮

目录切换按钮现在已经集成到头部导航栏中，位于暗黑模式切换按钮的右侧，提供更加统一和便捷的用户体验。

## 🎯 新的位置设计

### 📍 按钮位置
- **头部导航栏**：位于页面顶部的固定导航栏中
- **右侧区域**：在暗黑模式按钮的右边
- **统一样式**：与其他头部按钮保持一致的设计风格

### 🎨 视觉设计
- **图标指示**：📋 (显示) / ❌ (隐藏)
- **悬停效果**：与主题切换按钮相同的悬停样式
- **无障碍支持**：包含屏幕阅读器友好的文本

## 🔧 技术实现

### 全局状态管理

使用自定义的状态管理器来同步目录的显示状态：

\`\`\`typescript
class TocStateManager {
  private listeners: Set<(isVisible: boolean) => void> = new Set()
  private _isVisible: boolean = true

  get isVisible() {
    return this._isVisible
  }

  setVisible(visible: boolean) {
    this._isVisible = visible
    this.listeners.forEach(listener => listener(visible))
  }

  subscribe(listener: (isVisible: boolean) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}
\`\`\`

### 组件分离

将切换按钮独立为单独的组件：

\`\`\`typescript
// components/toc-toggle.tsx
export function TocToggle() {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const unsubscribe = tocStateManager.subscribe(setIsVisible)
    return unsubscribe
  }, [])

  const toggleVisibility = () => {
    tocStateManager.setVisible(!isVisible)
  }

  return (
    <Button onClick={toggleVisibility} variant="ghost" size="sm">
      {isVisible ? <X /> : <List />}
    </Button>
  )
}
\`\`\`

### 头部布局集成

在文档布局中集成切换按钮：

\`\`\`typescript
// app/docs/layout.tsx
<div className="flex flex-1 items-center justify-end space-x-2">
  <ThemeToggle />
  <TocToggle /> {/* 新增的目录切换按钮 */}
</div>
\`\`\`

## 🎛️ 交互逻辑

### 状态同步

1. **按钮状态**：头部按钮的图标实时反映目录的显示状态
2. **目录面板**：目录面板的显示/隐藏与按钮状态同步
3. **响应式适配**：在不同屏幕尺寸下自动调整行为

### 用户操作流程

\`\`\`
用户点击头部目录按钮
    ↓
全局状态管理器更新状态
    ↓
目录面板响应状态变化
    ↓
按钮图标更新为新状态
\`\`\`

## 📱 响应式行为

### 桌面端 (≥1280px)
- **默认状态**：目录默认显示
- **按钮功能**：点击切换目录显示/隐藏
- **布局调整**：主内容区域自动调整右边距

### 移动端 (<1280px)
- **默认状态**：目录默认隐藏
- **按钮功能**：点击显示目录，再次点击或点击遮罩层隐藏
- **全屏覆盖**：目录以全屏方式覆盖内容

## 🎨 设计一致性

### 按钮样式统一

\`\`\`typescript
// 与主题切换按钮保持一致的样式
<Button
  variant="ghost"
  size="sm"
  className="h-8 w-8 px-0"
>
  {/* 图标内容 */}
</Button>
\`\`\`

### 图标设计

- **显示状态**：使用 List 图标 (📋)
- **隐藏状态**：使用 X 图标 (❌)
- **尺寸统一**：与主题切换按钮的图标尺寸一致

## 🚀 用户体验提升

### 便捷性

1. **易于发现**：按钮位于固定的头部位置，始终可见
2. **操作一致**：与其他头部功能按钮的操作方式一致
3. **状态清晰**：图标明确表示当前的目录状态

### 可访问性

1. **键盘导航**：支持 Tab 键导航到按钮
2. **屏幕阅读器**：包含 \`sr-only\` 文本描述
3. **触摸友好**：在移动设备上有合适的触摸目标大小

### 视觉反馈

1. **即时响应**：点击后立即更新图标状态
2. **平滑动画**：目录面板的显示/隐藏有平滑过渡
3. **状态指示**：图标清晰表示当前操作结果

## 🔄 与其他功能的协调

### 与侧边栏的区别

- **侧边栏切换**：控制左侧的文档导航
- **目录切换**：控制右侧的章节目录
- **独立操作**：两个功能互不影响

### 与主题切换的协调

- **位置关系**：目录按钮在主题按钮右侧
- **样式一致**：使用相同的按钮样式和尺寸
- **间距统一**：按钮间距与其他头部元素保持一致

## 📊 性能优化

### 状态管理

- **轻量级**：使用简单的观察者模式，无额外依赖
- **内存友好**：自动清理事件监听器，避免内存泄漏
- **响应迅速**：状态变化立即同步到所有订阅者

### 渲染优化

- **按需渲染**：只在必要时重新渲染组件
- **状态缓存**：避免不必要的状态计算
- **事件优化**：使用防抖处理频繁的状态变化

## 🎯 未来改进

### 短期计划

1. **键盘快捷键**：添加快捷键支持 (如 Ctrl+T)
2. **状态持久化**：记住用户的目录显示偏好
3. **动画优化**：更流畅的按钮状态切换动画

### 长期计划

1. **智能显示**：根据文档长度自动决定是否显示目录
2. **个性化设置**：允许用户自定义目录的默认状态
3. **手势支持**：在移动端添加手势控制

通过将目录切换按钮集成到头部导航栏，我们提供了更加统一和便捷的用户体验，同时保持了良好的设计一致性和可访问性。
