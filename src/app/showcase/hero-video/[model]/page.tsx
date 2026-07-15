import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShowcaseModelPage from "@/components/showcase/ShowcaseModelPage";
import { SHOWCASE_MODELS, getShowcaseModel } from "@/lib/showcase";
import { getAbsoluteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ model: string }>;
};

export async function generateStaticParams() {
  return SHOWCASE_MODELS.map((model) => ({ model: model.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  const showcase = getShowcaseModel(model);
  if (!showcase) return {};

  return {
    title: `${showcase.name} Video Showcase`,
    description: showcase.description,
    alternates: { canonical: getAbsoluteUrl(`/showcase/hero-video/${showcase.slug}`) },
    robots: { index: false, follow: false },
  };
}

export default async function ShowcaseModelRoute({ params }: Props) {
  const { model } = await params;
  const showcase = getShowcaseModel(model);
  if (!showcase) notFound();

  return <ShowcaseModelPage model={showcase} />;
}

