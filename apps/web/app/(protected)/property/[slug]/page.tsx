import PropertyDetail from '@/modules/property/property-detail';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PropertyDetail id={slug} />;
}
