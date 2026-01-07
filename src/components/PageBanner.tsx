import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageBannerProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

const PageBanner = ({ title, breadcrumbs }: PageBannerProps) => {
  return (
    <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
      {/* Background overlay with pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/70" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
        >
          {title}
        </motion.h1>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ol className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 w-fit">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-white/80 hover:text-gold transition-colors text-sm font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white text-sm font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
              </li>
            ))}
          </ol>
        </motion.nav>
      </div>
    </section>
  );
};

export default PageBanner;
