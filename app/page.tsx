"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Search, Zap, Palette, Globe, Code } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { homepageConfig } from "@/config/homepage"

gsap.registerPlugin(ScrollTrigger)

const iconMap = {
  BookOpen,
  Search,
  Zap,
  Palette,
  Globe,
  Code,
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 英雄区域动画
    if (heroRef.current) {
      const tl = gsap.timeline()
      tl.fromTo(
        heroRef.current.querySelector("h1"),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      )
        .fromTo(
          heroRef.current.querySelector("p"),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5",
        )
        .fromTo(
          heroRef.current.querySelectorAll("button"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" },
          "-=0.3",
        )
    }

    // 特性卡片动画
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.querySelectorAll(".feature-card"),
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }

    // CTA区域动画
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6" />
            <span>文档系统</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/docs">
              <Button variant="ghost">文档</Button>
            </Link>
            <Link href="/docs">
              <Button>开始使用</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="py-20 px-4" ref={heroRef}>
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            {homepageConfig.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {homepageConfig.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={homepageConfig.hero.primaryButton.href}>
              <Button size="lg" className="text-lg px-8">
                {homepageConfig.hero.primaryButton.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={homepageConfig.hero.secondaryButton.href}>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                {homepageConfig.hero.secondaryButton.text}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 特性展示 */}
      <section className="py-20 px-4 bg-muted/30" ref={featuresRef}>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">强大的功能特性</h2>
            <p className="text-lg text-muted-foreground">为现代文档需求而设计的完整解决方案</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageConfig.features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
              return (
                <Card
                  key={index}
                  className="feature-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 示例展示 */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">{homepageConfig.examples.title}</h2>
            <p className="text-lg text-muted-foreground">{homepageConfig.examples.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  代码高亮
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                  <code className="language-javascript">{homepageConfig.examples.codeExample}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  数学公式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg text-center border">
                  <div className="text-2xl font-mono">{homepageConfig.examples.mathExample}</div>
                  <div className="text-sm text-muted-foreground mt-2">支持 LaTeX 数学公式渲染</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-20 px-4 bg-primary/5" ref={ctaRef}>
        <div className="container max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">{homepageConfig.cta.title}</h2>
          <p className="text-lg text-muted-foreground">{homepageConfig.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={homepageConfig.cta.buttonHref}>
              <Button size="lg" className="text-lg px-8">
                {homepageConfig.cta.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 px-4 border-t">
        <div className="container max-w-4xl mx-auto text-center text-muted-foreground">
          <p>{homepageConfig.footer.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
