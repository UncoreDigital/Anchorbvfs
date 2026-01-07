import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const Articles = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const articles = [
        {
            title: 'Appraising Your Business with Anchor Business Valuations & Financial Services’ Trisch Garthoeffner',
            date: 'Oct 4, 2020',
            type: 'Podcast',
            link: 'https://www.youtube.com/watch?v=jOH2ykV2Ojg&t=413s'
        },
        {
            title: 'Practicing Solo - Interview',
            date: 'Sep/Oct 2019',
            type: 'Article',
            link: 'https://www.dropbox.com/scl/fi/t0p2olpskik4qrud2u2td/NACVA_Garthoeffner-Interview.pdf?rlkey=xt3f41s3w5h9gchffihmucdm0&e=1&dl=0'
        },
        {
            title: 'The Aftermath of Divorce',
            date: 'Oct 18, 2019',
            type: 'Article',
            link: 'https://cmmonline.com/articles/the-aftermath-of-divorce'
        },
        {
            title: 'Determining Fair Market Value',
            date: 'Oct 8, 2017',
            type: 'Article',
            link: 'https://cmmonline.com/articles/determining-fair-market-value'
        },
        {
            title: '‘Collaborative’ Divorce Aims to Ease the Burden of Ending a Marriage',
            date: 'Feb 14, 2017',
            type: 'Story',
            link: 'https://news.wgcu.org/show/gulf-coast-life/2017-02-14/collaborative-divorce-aims-to-ease-the-burden-of-ending-a-marriage'
        },
        {
            title: 'Determining Fair Market Value',
            date: 'April 2013',
            type: 'Article',
            link: 'https://www.cmmagazine.cmmonline.com/publication/?i=699389&article_id=3969722&view=articleBrowser'
        },
    ];

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
