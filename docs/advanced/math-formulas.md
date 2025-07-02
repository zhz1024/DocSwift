---
title: "数学公式指南"
description: "学习如何在文档中使用 LaTeX 数学公式"
tags: ["数学", "LaTeX", "高级"]
category: "高级功能"
order: 2
date: "2024-01-02"
author: "数学团队"
---

# 数学公式指南

本文档展示如何在文档系统中使用 LaTeX 数学公式。

## 基础语法

### 行内公式

使用单个美元符号包围公式：`$公式$`

示例：爱因斯坦质能方程 $E = mc^2$，其中 $c$ 是光速。

### 块级公式

使用双美元符号包围公式：`$$公式$$`

示例：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 常用数学符号

### 希腊字母

- 小写：$\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta$
- 大写：$\Alpha, \Beta, \Gamma, \Delta, \Epsilon, \Zeta, \Eta, \Theta$

### 运算符

- 加减乘除：$a + b - c \times d \div e$
- 分数：$\frac{a}{b}$，$\frac{x^2 + 2x + 1}{x + 1}$
- 根号：$\sqrt{x}$，$\sqrt[n]{x}$
- 指数：$x^2$，$e^{i\pi}$
- 下标：$x_1$，$a_{i,j}$

### 求和与积分

求和：
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

积分：
$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

多重积分：
$$
\iint_D f(x,y) \, dx \, dy
$$

### 极限

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
$$

## 矩阵

### 基本矩阵

$$
A = \begin{pmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{pmatrix}
$$

### 行列式

$$
\det(A) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
$$

### 方程组

$$
\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}
$$

## 物理公式示例

### 薛定谔方程

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$

### 麦克斯韦方程组

$$
\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{align}
$$

### 洛伦兹变换

$$
\begin{pmatrix}
ct' \\
x' \\
y' \\
z'
\end{pmatrix} = \begin{pmatrix}
\gamma & -\gamma\beta & 0 & 0 \\
-\gamma\beta & \gamma & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix} \begin{pmatrix}
ct \\
x \\
y \\
z
\end{pmatrix}
$$

其中 $\gamma = \frac{1}{\sqrt{1-\beta^2}}$，$\beta = \frac{v}{c}$。

## 统计学公式

### 正态分布

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

### 贝叶斯定理

$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$

### 中心极限定理

当 $n \to \infty$ 时：

$$
\frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} N(0,1)
$$

## 编号公式

可以为重要公式添加编号：

$$
E = mc^2 \tag{1}
$$

$$
F = ma \tag{2}
$$

引用公式时可以使用：根据公式 (1) 和 (2)...

## 注意事项

1. 确保公式语法正确，错误的语法会导致渲染失败
2. 复杂公式建议使用块级显示
3. 在公式中使用中文时，建议使用 `\text{中文}` 包围
4. 大型公式可以考虑分行显示以提高可读性

示例：

$$
\text{当} \quad x \to 0 \quad \text{时，} \quad \frac{\sin x}{x} \to 1
$$
\`\`\`

最后更新package.json添加所需依赖：
