import { useRoute } from "wouter";
import { newsItems } from "@/lib/news-data";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsDetail() {
  const [, params] = useRoute("/news/:id");
  const id = params?.id ? parseInt(params.id) : null;
  const article = newsItems.find((item) => item.id === id);

  if (!article) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link href="/news">
          <Button variant="link">Back to News</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="py-12">
        <Link href="/news">
          <Button variant="ghost" className="mb-8 hover:bg-pink-50 text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </Link>

        <motion.div
          initial={ { opacity: 0, y: 20 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.5 } }
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>{article.date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="rounded-2xl overflow-hidden shadow-2xl mb-12">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>

          <div className="prose prose-lg max-w-none prose-pink">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium italic border-l-4 border-pink-200 pl-6">
              {article.excerpt}
            </p>
            <div className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
