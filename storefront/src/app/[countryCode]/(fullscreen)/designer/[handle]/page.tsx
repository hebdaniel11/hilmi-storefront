import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/products"
import ProductDesignerTemplate from "@modules/designer/templates"

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return {
    title: `Customize ${product.title} | Hilmi`,
    description: `Customize your own ${product.title}.`,
  }
}

export default async function DesignerPage({ params }: Props) {
  const { product } = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductDesignerTemplate product={product} />
}
