export interface AIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface AIStreamResponse {
  choices: Array<{
    delta: {
      content?: string
      role?: string
    }
    finish_reason?: string
  }>
}

export interface AIResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class AIService {
  private apiUrl: string
  private apiKey: string
  private model: string
  private enabled: boolean

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "https://api.openai.com/v1/chat/completions"
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || ""
    this.model = process.env.NEXT_PUBLIC_AI_MODEL || "gpt-3.5-turbo"
    this.enabled = process.env.NEXT_PUBLIC_AI_ENABLED === "true"
  }

  isEnabled(): boolean {
    return this.enabled && !!this.apiKey
  }

  async generateSummary(title: string, content: string): Promise<string> {
    // 收集流式输出的完整内容
    let fullContent = ""
    for await (const chunk of this.generateSummaryStream(title, content)) {
      fullContent += chunk
    }
    return fullContent || "无法生成摘要"
  }

  async *generateSummaryStream(title: string, content: string): AsyncGenerator<string, void, unknown> {
    if (!this.isEnabled()) {
      throw new Error("AI service is not enabled or configured")
    }

    const messages: AIMessage[] = [
      {
        role: "system",
        content: `你是一个专业的文档助手。请为用户提供简洁、准确的文档摘要。摘要应该：
1. 突出文档的核心内容和要点
2. 使用Markdown格式，包括：
   - 使用 **粗体** 强调重点
   - 使用 \`代码\` 标记技术术语
   - 使用列表组织信息
3. 长度控制在150-300字之间
4. 使用中文回复
5. 保持客观和专业的语调`,
      },
      {
        role: "user",
        content: `请为以下文档生成摘要：

标题：${title}

内容：
${content.slice(0, 3000)}`, // 限制内容长度避免超出token限制
      },
    ]

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 800,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: true, // 启用流式输出
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
        )
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Failed to get response reader")
      }

      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine === "" || trimmedLine === "data: [DONE]") continue

            if (trimmedLine.startsWith("data: ")) {
              try {
                const jsonStr = trimmedLine.slice(6)
                const data: AIStreamResponse = JSON.parse(jsonStr)
                const content = data.choices[0]?.delta?.content

                if (content) {
                  yield content
                }

                if (data.choices[0]?.finish_reason) {
                  return
                }
              } catch (parseError) {
                console.warn("Failed to parse SSE data:", parseError)
                continue
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      console.error("AI stream summary generation failed:", error)
      throw error
    }
  }

  async *askQuestionStream(
    title: string,
    content: string,
    question: string,
    conversationHistory: AIMessage[] = [],
  ): AsyncGenerator<string, void, unknown> {
    if (!this.isEnabled()) {
      throw new Error("AI service is not enabled or configured")
    }

    const systemMessage: AIMessage = {
      role: "system",
      content: `你是一个专业的文档助手。基于提供的文档内容回答用户问题。请：
1. 基于文档内容提供准确的答案
2. 如果问题超出文档范围，请明确说明
3. 使用Markdown格式回复，包括：
   - 使用 **粗体** 强调重点
   - 使用 \`代码\` 标记技术术语
   - 使用列表组织信息
   - 使用代码块展示示例
4. 使用中文回复
5. 保持友好和专业的语调

文档标题：${title}
文档内容：
${content.slice(0, 2000)}`,
    }

    const messages: AIMessage[] = [
      systemMessage,
      ...conversationHistory,
      {
        role: "user",
        content: question,
      },
    ]

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: true, // 启用流式输出
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
        )
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Failed to get response reader")
      }

      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine === "" || trimmedLine === "data: [DONE]") continue

            if (trimmedLine.startsWith("data: ")) {
              try {
                const jsonStr = trimmedLine.slice(6)
                const data: AIStreamResponse = JSON.parse(jsonStr)
                const content = data.choices[0]?.delta?.content

                if (content) {
                  yield content
                }

                if (data.choices[0]?.finish_reason) {
                  return
                }
              } catch (parseError) {
                console.warn("Failed to parse SSE data:", parseError)
                continue
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      console.error("AI stream question answering failed:", error)
      throw error
    }
  }

  async askQuestion(
    title: string,
    content: string,
    question: string,
    conversationHistory: AIMessage[] = [],
  ): Promise<string> {
    // 收集流式输出的完整内容
    let fullContent = ""
    for await (const chunk of this.askQuestionStream(title, content, question, conversationHistory)) {
      fullContent += chunk
    }
    return fullContent || "无法回答问题"
  }

  private async makeRequest(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`AI API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    return response.json()
  }
}

export const aiService = new AIService()
