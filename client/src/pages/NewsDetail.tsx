import { Section } from "@/components/Section";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";

export default function NewsDetail() {
  const [match, params] = useRoute("/news/:id");
  const newsId = params?.id;

  const { data: newsItem, isLoading } = useQuery({
    queryKey: ["news", newsId],
    queryFn: async () => {
      const response = await fetch(`/api/news/${newsId}`);
      if (!response.ok) throw new Error("Failed to fetch news");
      return response.json();
    },
    enabled: !!newsId,
  });

  if (!match) return null;

  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-white">
        <div className="container mx-auto px-6">
          <Link href="/news" asChild>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
            </Button>
          </Link>
        </div>
      </div>

      <Section>
        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {newsItem?.image && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full h-96 object-cover"
                  data-testid="img-news-detail"
                />
              </div>
            )}

            <div className="mb-6">
              <h1 className="text-5xl font-serif font-bold text-primary mb-4" data-testid="text-news-detail-title">
                {newsItem?.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{newsItem?.publishedAt && format(new Date(newsItem.publishedAt), "MMMM d, yyyy")}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg" data-testid="text-news-detail-content">
                {newsItem?.content}
              </p>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
