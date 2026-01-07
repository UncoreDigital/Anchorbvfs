import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const Blog = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const featuredPost = {
    id: 1,
    title: 'The Future of Financial Technology: Trends to Watch in 2024',
    excerpt: 'Explore the latest fintech innovations reshaping the financial landscape, from AI-driven analytics to blockchain solutions transforming traditional banking.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    author: 'Michael Anderson',
    date: 'December 15, 2024',
    category: 'Technology',
  };

  const posts = [
    {
      id: 2,
      title: 'Strategic Tax Planning for Business Growth',
      excerpt: 'Learn how strategic tax planning can significantly impact your bottom line and support sustainable business growth.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      author: 'Emily Roberts',
      date: 'December 10, 2024',
      category: 'Tax Planning',
    },
    {
      id: 3,
      title: 'Investment Strategies for Uncertain Markets',
      excerpt: 'Discover proven investment strategies to navigate market volatility and protect your portfolio during uncertain times.',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop',
      author: 'David Chen',
      date: 'December 5, 2024',
      category: 'Investment',
    },
    {
      id: 4,
      title: 'Building Wealth: A Guide for High-Net-Worth Individuals',
      excerpt: 'Comprehensive strategies for wealth preservation and growth tailored for high-net-worth individuals and families.',
      image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=300&fit=crop',
      author: 'Lisa Thompson',
      date: 'November 28, 2024',
      category: 'Wealth Management',
    },
    {
      id: 5,
      title: 'Corporate Finance Best Practices for 2024',
      excerpt: 'Stay ahead with these corporate finance best practices designed to optimize capital structure and maximize shareholder value.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
      author: 'James Wilson',
      date: 'November 20, 2024',
      category: 'Corporate Finance',
    },
    {
      id: 6,
      title: 'M&A Trends: What to Expect This Year',
      excerpt: 'An analysis of current merger and acquisition trends and what they mean for businesses looking to grow through acquisition.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
      author: 'Sarah Mitchell',
      date: 'November 15, 2024',
      category: 'M&A',
    },
  ];

  const categories = ['All', 'Technology', 'Tax Planning', 'Investment', 'Wealth Management', 'Corporate Finance', 'M&A'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner 
        title="Blog & Insights" 
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog' }
        ]} 
      />

      {/* Featured Post */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Link to={`/blog/${featuredPost.id}`} className="group">
              <div className="grid lg:grid-cols-2 gap-8 items-center bg-muted rounded-2xl overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <span className="inline-block bg-accent text-primary px-4 py-1 rounded-full text-sm font-inter font-medium mb-4">
                    Featured
                  </span>
                  <h2 className="text-3xl font-playfair font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground font-inter leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground font-inter">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-5 py-2 rounded-full bg-muted text-foreground hover:bg-accent hover:text-primary transition-colors font-inter text-sm"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${post.id}`}>
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-inter font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-inter mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-playfair font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground font-inter text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent font-inter font-medium text-sm">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
