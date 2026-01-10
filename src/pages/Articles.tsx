import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Articles = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['articles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('published_at', { ascending: false });

            if (error) throw error;
            // Map published_at to date for compatibility if needed, but we use same semantics
            return data.map(item => ({
                ...item,
                date: item.published_at // Map for UI compatibility
            }));
        }
    });

    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <PageBanner
                title="Articles & Podcasts"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Resources', href: '#' },
                    { label: 'Articles & Podcasts' }
                ]}
            />

            <section className="section-padding bg-background">
                <div className="container-wide">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid gap-6">
                            {articles.map((article, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card p-6 rounded-xl border border-border hover:shadow-elegant transition-all duration-300 group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-accent" />
                                                    {article.date}
                                                </span>
                                                <span className="w-1 h-1 bg-border rounded-full" />
                                                <span className="text-accent font-medium uppercase text-xs tracking-wider">
                                                    {article.type}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-playfair font-bold text-primary group-hover:text-gold transition-colors">
                                                {article.title}
                                            </h3>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <a
                                                href={article.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 hover:bg-gold hover:text-primary rounded-lg transition-all duration-300 font-medium text-sm"
                                            >
                                                Read More
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Articles;
