import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const blogPosts = [
  {
    id: '1',
    title: 'The Future of Financial Technology: Trends to Watch in 2024',
    content: `
      <p>The financial technology landscape continues to evolve at an unprecedented pace. As we navigate through 2024, several key trends are reshaping how businesses and individuals interact with financial services.</p>
      
      <h3>Artificial Intelligence and Machine Learning</h3>
      <p>AI-driven analytics are revolutionizing decision-making processes in finance. From risk assessment to fraud detection, machine learning algorithms are providing insights that were previously impossible to obtain. Financial institutions are leveraging these technologies to offer more personalized services and improve operational efficiency.</p>
      
      <h3>Blockchain and Decentralized Finance</h3>
      <p>Blockchain technology continues to mature, with applications extending beyond cryptocurrencies. Smart contracts, decentralized lending platforms, and tokenization of assets are creating new opportunities for both institutions and individuals. The transparency and security offered by blockchain are addressing long-standing challenges in the financial sector.</p>
      
      <h3>Open Banking and API Integration</h3>
      <p>The open banking movement is gaining momentum globally. APIs are enabling seamless integration between traditional banks and fintech startups, creating a more connected and competitive financial ecosystem. This trend is driving innovation and giving consumers more control over their financial data.</p>
      
      <h3>Sustainable Finance</h3>
      <p>ESG (Environmental, Social, and Governance) considerations are becoming central to investment decisions. Fintech solutions are emerging to help measure, track, and report on sustainability metrics, making it easier for investors to align their portfolios with their values.</p>
      
      <h3>Conclusion</h3>
      <p>The convergence of these trends is creating a financial landscape that is more accessible, efficient, and innovative than ever before. Businesses that embrace these changes will be well-positioned to thrive in the evolving financial ecosystem.</p>
    `,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    author: 'Michael Anderson',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    date: 'December 15, 2024',
    category: 'Technology',
    tags: ['Fintech', 'AI', 'Blockchain', 'Innovation'],
  },
  {
    id: '2',
    title: 'Strategic Tax Planning for Business Growth',
    content: `
      <p>Effective tax planning is essential for sustainable business growth. Understanding how to optimize your tax position can significantly impact your bottom line and free up resources for investment and expansion.</p>
      
      <h3>Understanding Your Tax Obligations</h3>
      <p>The first step in strategic tax planning is understanding your current tax obligations and identifying opportunities for optimization. This includes analyzing your business structure, revenue sources, and eligible deductions.</p>
      
      <h3>Key Strategies</h3>
      <p>Several strategies can help reduce your tax burden legally: timing of income and expenses, maximizing deductions, utilizing tax credits, and choosing the right business entity structure. Each of these requires careful analysis and planning.</p>
      
      <h3>Looking Ahead</h3>
      <p>Tax laws are constantly changing. Staying informed about legislative changes and working with experienced tax professionals can help you adapt your strategies and maintain optimal tax efficiency.</p>
    `,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
    author: 'Emily Roberts',
    authorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    date: 'December 10, 2024',
    category: 'Tax Planning',
    tags: ['Tax', 'Business', 'Planning', 'Growth'],
  },
];

const BlogPost = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const post = blogPosts.find(p => p.id === id) || blogPosts[0];

  const relatedPosts = blogPosts.filter(p => p.id !== id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title={post.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title }
        ]}
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover rounded-xl mb-8"
              />

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-inter mb-8">
                <span className="flex items-center gap-2">
                  <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
              </div>

              <div
                className="prose prose-lg max-w-none font-inter text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.article>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
