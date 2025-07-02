export interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number"
  strict: "0" | "1"
  reactionsEnabled: "0" | "1"
  emitMetadata: "0" | "1"
  inputPosition: "top" | "bottom"
  theme: string
  lang: string
}

export const defaultGiscusConfig: Partial<GiscusConfig> = {
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "zh-CN",
}

export function getGiscusConfig(): GiscusConfig | null {
  const requiredEnvVars = [
    "NEXT_PUBLIC_GISCUS_REPO",
    "NEXT_PUBLIC_GISCUS_REPO_ID",
    "NEXT_PUBLIC_GISCUS_CATEGORY",
    "NEXT_PUBLIC_GISCUS_CATEGORY_ID",
  ]

  // 检查必需的环境变量
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
  if (missingVars.length > 0) {
    console.warn("Missing required Giscus environment variables:", missingVars)
    return null
  }

  return {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO!,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID!,
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY!,
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!,
    mapping: (process.env.NEXT_PUBLIC_GISCUS_MAPPING as GiscusConfig["mapping"]) || defaultGiscusConfig.mapping!,
    strict: (process.env.NEXT_PUBLIC_GISCUS_STRICT as "0" | "1") || defaultGiscusConfig.strict!,
    reactionsEnabled:
      (process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED as "0" | "1") || defaultGiscusConfig.reactionsEnabled!,
    emitMetadata: (process.env.NEXT_PUBLIC_GISCUS_EMIT_METADATA as "0" | "1") || defaultGiscusConfig.emitMetadata!,
    inputPosition:
      (process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION as "top" | "bottom") || defaultGiscusConfig.inputPosition!,
    theme: process.env.NEXT_PUBLIC_GISCUS_THEME || defaultGiscusConfig.theme!,
    lang: process.env.NEXT_PUBLIC_GISCUS_LANG || defaultGiscusConfig.lang!,
  }
}
