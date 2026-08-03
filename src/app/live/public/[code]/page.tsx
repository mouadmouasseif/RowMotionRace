import { PublicLiveView } from "@/components/live/PublicLiveView";

export default async function PublicLivePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PublicLiveView code={decodeURIComponent(code)} />;
}
