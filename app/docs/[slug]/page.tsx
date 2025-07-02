import { notFound } from "next/navigation"
import { getDocBySlug, getAllDocs, getAdjacentDocs } from "@/lib/docs"
import { DocContent } from "@/components/doc-content"

interface DocPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const docs = await getAllDocs()
    return docs.map((doc) => ({
      slug: doc.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export async function generateMetadata({ params }: DocPageProps) {
  try {
    const doc = await getDocBySlug(params.slug)

    if (!doc) {
      return {
        title: "Document Not Found",
      }
    }

    return {
      title: doc.meta.title,
      description: doc.meta.description,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Document Not Found",
    }
  }
}

export default async function DocPage({ params }: DocPageProps) {
  try {
    const doc = await getDocBySlug(params.slug)

    if (!doc) {
      notFound()
    }

    // 获取相邻文档
    const { previousDoc, nextDoc } = await getAdjacentDocs(doc)

    return <DocContent doc={doc} previousDoc={previousDoc} nextDoc={nextDoc} />
  } catch (error) {
    console.error("Error loading document:", error)
    notFound()
  }
}
