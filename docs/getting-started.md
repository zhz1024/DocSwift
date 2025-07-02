---
title: "快速开始"
description: "了解如何快速开始使用我们的文档系统"
tags: ["指南", "入门"]
category: "入门指南"
categoryId: 1
postId: 1
order: 1
date: "2024-01-01"
author: "文档团队"
---

# 快速开始

欢迎使用我们的现代化文档系统！本指南将帮助您了解如何使用和贡献文档内容。

## 主要特性

我们的文档系统包含以下功能：

### 基础功能

- **Markdown 支持**：使用 Markdown 格式编写文档
- **YAML 前置信息**：为文档添加元数据
- **标签系统**：使用标签组织内容
- **分类管理**：将相关文档分组

### 高级功能

- **智能搜索**：快速找到您需要的内容
- **响应式设计**：在所有设备上完美工作
- **LaTeX 支持**：渲染数学公式
- **代码高亮**：语法高亮显示代码
- **暗黑模式**：保护您的眼睛

### 导航功能

- **目录导航**：右侧自动生成的目录
- **文档导航**：上一篇/下一篇文档跳转
- **分类排序**：支持分类ID和文档ID排序

## 编写文档

创建新文档的步骤：

### 步骤一：创建文件

1. 在 `docs` 目录中创建 `.md` 文件
2. 在顶部添加 YAML 前置信息
3. 使用 Markdown 编写内容
4. 部署以查看更改

### 步骤二：配置元数据

\`\`\`yaml
---
title: "我的文档"
description: "简要描述"
tags: ["示例", "指南"]
category: "示例"
categoryId: 1
postId: 1
order: 1
author: "作者姓名"
---
\`\`\`

### 步骤三：编写内容

使用标准的 Markdown 语法编写您的内容。

## 数学公式支持

我们支持 LaTeX 数学公式渲染：

### 行内公式

爱因斯坦质能方程：$E = mc^2$

### 块级公式

高斯积分：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### 复杂公式

薛定谔方程：

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$

## 代码高亮

支持多种编程语言的语法高亮：

### JavaScript 示例

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Python 示例

```python
def quick_sort(arr):
    if len(arr) &lt;= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x &lt; pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
