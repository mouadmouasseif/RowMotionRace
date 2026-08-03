import { PublicLiveView } from "@/components/live/PublicLiveView";

export default async function PublicLivePage({ params }: { params: Promise<{ competitionCode: string }> }) {
  const { competitionCode } = await params;
  return <PublicLiveView code={decodeURIComponent(competitionCode)} />;
}
