import { Section } from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Play, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { newsItems } from "@/lib/news-data";
import { Button } from "@/components/ui/button";

export default function News() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    { id: "M3fcCTqsGBA", title: "KFCS Featured on News", platform: "youtube" },
  ];

  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">News & Updates</h1>
        <p className="text-lg opacity-90">Stay informed about your cooperative.</p>
      </div>

      <Section>
        {/* Video Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-2">Featured Videos</h2>
          <p className="text-muted-foreground mb-8 text-lg">Watch KFCS in the media</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {videos.map((video) => (
              <div 
                key={video.id}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedVideo(video.id)}
                data-testid={`card-video-${video.id}`}
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-full">
                      <Play className="w-8 h-8 text-primary fill-primary" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors" data-testid={`text-video-title-${video.id}`}>
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div 
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
              data-testid="modal-video"
            >
              <div 
                className="bg-black rounded-xl overflow-hidden max-w-4xl w-full aspect-video"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="KFCS Featured Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* News Section */}
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary mb-2">Latest News</h2>
          <p className="text-muted-foreground mb-8 text-lg">Stories from our community</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} asChild>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden border-border" data-testid={`card-news-${item.id}`}>
                  <div className="aspect-video bg-muted overflow-hidden relative">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-news-title-${item.id}`}>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {item.excerpt}
                    </p>
                    <span className="text-secondary font-bold text-sm mt-4 inline-block">Read More &rarr;</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
