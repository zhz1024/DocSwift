"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  User,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Square,
} from "lucide-react"
import { aiService, type AIMessage } from "@/lib/ai"
import { StreamingText } from "@/components/streaming-text"
import { gsap } from "gsap"

interface AIAssistantProps {
  title: string
  content: string
  className?: string
}

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export function AIAssistant({ title, content, className }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [summary, setSummary] = useState<string>("")
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState<string>("")
  const [isSummaryStreaming, setIsSummaryStreaming] = useState(false)
  const [summaryAbortController, setSummaryAbortController] = useState<AbortController | null>(null)

  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [questionError, setQuestionError] = useState<string>("")
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const assistantRef = useRef<HTMLDivElement>(null)
  const conversationRef = useRef<HTMLDivElement>(null)

  // 检查AI服务是否可用
  const isAIEnabled = aiService.isEnabled()

  // 停止摘要生成
  const stopSummaryGeneration = () => {
    if (summaryAbortController) {
      summaryAbortController.abort()
      setSummaryAbortController(null)
      setIsLoadingSummary(false)
      setIsSummaryStreaming(false)
    }
  }

  // 流式生成摘要
  const generateSummaryStream = async () => {
    if (!isAIEnabled || (summary && !isSummaryStreaming)) return

    const controller = new AbortController()
    setSummaryAbortController(controller)
    setIsLoadingSummary(true)
    setIsSummaryStreaming(true)
    setSummaryError("")
    setSummary("") // 清空之前的摘要

    try {
      let streamedContent = ""

      for await (const chunk of aiService.generateSummaryStream(title, content)) {
        if (controller.signal.aborted) {
          break
        }

        streamedContent += chunk
        setSummary(streamedContent)
      }

      // 流式结束
      if (!controller.signal.aborted) {
        setIsSummaryStreaming(false)
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Failed to generate summary:", error)
        setSummaryError(error instanceof Error ? error.message : "生成摘要失败")
        setSummary("")
      }
    } finally {
      setSummaryAbortController(null)
      setIsLoadingSummary(false)
      setIsSummaryStreaming(false)
    }
  }

  // 重新生成摘要
  const regenerateSummary = () => {
    setSummary("")
    setSummaryError("")
    generateSummaryStream()
  }

  // 生成摘要
  const generateSummary = async () => {
    if (!isAIEnabled || summary) return

    setIsLoadingSummary(true)
    setSummaryError("")

    try {
      const generatedSummary = await aiService.generateSummary(title, content)
      setSummary(generatedSummary)
    } catch (error) {
      console.error("Failed to generate summary:", error)
      setSummaryError(error instanceof Error ? error.message : "生成摘要失败")
    } finally {
      setIsLoadingSummary(false)
    }
  }

  // 停止流式输出
  const stopStreaming = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsAsking(false)

      // 更新最后一条消息的流式状态
      setConversation((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.role === "assistant" ? { ...msg, isStreaming: false } : msg,
        ),
      )
    }
  }

  // 流式提问
  const askQuestionStream = async () => {
    if (!question.trim() || isAsking) return

    const controller = new AbortController()
    setAbortController(controller)
    setIsAsking(true)
    setQuestionError("")

    const userMessage: ConversationMessage = {
      role: "user",
      content: question,
      timestamp: new Date(),
    }

    // 添加用户消息
    setConversation((prev) => [...prev, userMessage])

    // 添加空的助手消息用于流式更新
    const assistantMessage: ConversationMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    }
    setConversation((prev) => [...prev, assistantMessage])

    setQuestion("")

    try {
      // 构建对话历史
      const conversationHistory: AIMessage[] = conversation.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      let streamedContent = ""

      for await (const chunk of aiService.askQuestionStream(title, content, question, conversationHistory)) {
        if (controller.signal.aborted) {
          break
        }

        streamedContent += chunk

        // 更新最后一条助手消息
        setConversation((prev) => {
          const newConversation = [...prev]
          const lastIndex = newConversation.length - 1
          if (newConversation[lastIndex]?.role === "assistant") {
            newConversation[lastIndex] = {
              ...newConversation[lastIndex],
              content: streamedContent,
              isStreaming: true,
            }
          }
          return newConversation
        })

        // 滚动到最新消息
        setTimeout(() => {
          if (conversationRef.current) {
            conversationRef.current.scrollTop = conversationRef.current.scrollHeight
          }
        }, 10)
      }

      // 流式结束，更新状态
      if (!controller.signal.aborted) {
        setConversation((prev) => {
          const newConversation = [...prev]
          const lastIndex = newConversation.length - 1
          if (newConversation[lastIndex]?.role === "assistant") {
            newConversation[lastIndex] = {
              ...newConversation[lastIndex],
              content: streamedContent || "无法回答问题",
              isStreaming: false,
            }
          }
          return newConversation
        })
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Failed to ask question:", error)
        setQuestionError(error instanceof Error ? error.message : "提问失败")

        // 移除失败的助手消息
        setConversation((prev) => prev.slice(0, -1))
      }
    } finally {
      setAbortController(null)
      setIsAsking(false)
    }
  }

  // 展开/收起动画
  useEffect(() => {
    if (assistantRef.current) {
      if (isExpanded) {
        gsap.fromTo(
          assistantRef.current.querySelector(".ai-content"),
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" },
        )
      }
    }
  }, [isExpanded])

  // 自动生成摘要
  useEffect(() => {
    if (isExpanded && !summary && !isLoadingSummary && !summaryError) {
      generateSummaryStream()
    }
  }, [isExpanded])

  if (!isAIEnabled) {
    return (
      <Card className={`border-dashed border-muted-foreground/30 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">AI 助手未配置</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-primary/20 bg-gradient-to-r from-primary/5 to-purple/5 ${className}`} ref={assistantRef}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg flex items-center gap-2">
                AI 助手
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  流式输出
                </Badge>
              </CardTitle>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="ai-content pt-0">
          <div className="space-y-4">
            {/* 摘要部分 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">文档摘要</h4>
                  {isSummaryStreaming && (
                    <Badge variant="outline" className="text-xs h-5">
                      <Sparkles className="h-3 w-3 mr-1" />
                      生成中...
                    </Badge>
                  )}
                </div>

                {/* 摘要控制按钮 */}
                <div className="flex items-center gap-1">
                  {summary && !isSummaryStreaming && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={regenerateSummary}
                      className="h-6 px-2 text-xs"
                      title="重新生成摘要"
                    >
                      <Sparkles className="h-3 w-3" />
                    </Button>
                  )}

                  {isSummaryStreaming && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={stopSummaryGeneration}
                      className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                      title="停止生成"
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {isLoadingSummary && !summary && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">正在生成摘要...</span>
                </div>
              )}

              {summaryError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm flex items-center justify-between">
                    <span>{summaryError}</span>
                    <Button variant="ghost" size="sm" onClick={regenerateSummary} className="h-6 px-2 text-xs ml-2">
                      重试
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {summary && (
                <div className="bg-muted/50 p-3 rounded-lg border">
                  <StreamingText
                    content={summary}
                    isStreaming={isSummaryStreaming}
                    className="text-sm"
                    speed={20} // 摘要使用稍快的打字速度
                  />
                </div>
              )}
            </div>

            {/* 对话部分 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium text-sm">智能问答</h4>
              </div>

              {/* 对话历史 */}
              {conversation.length > 0 && (
                <div
                  ref={conversationRef}
                  className="max-h-80 overflow-y-auto space-y-3 bg-background/50 p-3 rounded-lg border"
                >
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {message.role === "user" ? (
                            <User className="h-4 w-4 text-primary" />
                          ) : (
                            <Bot className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {message.role === "user" ? (
                            <p className="leading-relaxed">{message.content}</p>
                          ) : (
                            <StreamingText
                              content={message.content}
                              isStreaming={message.isStreaming || false}
                              className="leading-relaxed"
                            />
                          )}
                          <div className="text-xs opacity-70 mt-2 flex items-center justify-between">
                            <span>
                              {message.timestamp.toLocaleTimeString("zh-CN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.role === "assistant" && message.isStreaming && (
                              <Badge variant="outline" className="text-xs h-4">
                                输出中...
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 提问输入 */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="向 AI 提问关于这篇文档的问题..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (isAsking) {
                          stopStreaming()
                        } else {
                          askQuestionStream()
                        }
                      }
                    }}
                    disabled={isAsking && !abortController}
                    className="flex-1"
                  />
                  <Button
                    onClick={isAsking ? stopStreaming : askQuestionStream}
                    disabled={!isAsking && !question.trim()}
                    size="sm"
                    className="px-3"
                    variant={isAsking ? "destructive" : "default"}
                  >
                    {isAsking ? (
                      <>
                        <Square className="h-4 w-4" />
                      </>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {questionError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{questionError}</AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>💡 提示：支持 Markdown 格式回复，包括代码、表格、数学公式等</div>
                  <div>⚡ 流式输出：实时显示 AI 回复内容，按 Enter 发送，再次点击可停止输出</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
