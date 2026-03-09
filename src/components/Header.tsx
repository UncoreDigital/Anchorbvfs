import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    hasDropdown: false,
  },
  {
    name: "About Us",
    href: "/#about",
    hasDropdown: true,
    dropdownItems: [
      { name: "Meet the Founder", href: "/about" },
      { name: "Meet the Team", href: "/staff" },
    ],
  },
  {
    name: "Services",
    href: "/#services",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "IRC Section 409A Valuation",
        href: "/services/irc-section-409a-valuation",
      },
      {
        name: "Healthcare Valuations",
        href: "/services/healthcare-valuations",
      },
      {
        name: "Estate & Gift Tax Valuations",
        href: "/services/estate-gift-tax-valuations",
      },
      {
        name: "Matrimonial Valuation & Litigation Support",
        href: "/services/matrimonial-valuation-litigation-support",
      },
      {
        name: "Damages & Lost Profit Claims",
        href: "/services/damages-lost-profit-claims",
      },
      {
        name: "Fair Value Measurement",
        href: "/services/fair-value-measurement",
      },
      {
        name: "Shareholder Disputes (“Business Divorce”)",
        href: "/services/shareholder-disputes-business-divorce",
      },
      {
        name: "Quality of Earnings Report",
        href: "/services/quality-of-earnings-report",
      },
      {
        name: "Valuations for Underwriting/Lending Purposes",
        href: "/services/valuations-for-underwriting-lending-purposes",
      },
      {
        name: "Buy-Side Transactional Valuations",
        href: "/services/buy-side-transactional-valuations",
      },
    ],
  },
  {
    name: "Industry Expertise",
    href: "/industry-expertise",
    hasDropdown: false,
  },
  {
    name: "Resources",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { name: "Events", href: "/events" },
      { name: "Blogs", href: "/blog" },
      { name: "Articles & Podcasts", href: "/articles" },
      { name: "FAQs", href: "/faqs" },
    ],
  },
  { name: "Testimonials", href: "/#testimonials" },
  // { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdowns, setMobileOpenDropdowns] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useBodyScrollLock(isMobileMenuOpen);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");

      const scrollToElement = (delay: number = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, delay);
          return true;
        }
        return false;
      };

      // Try immediately
      if (scrollToElement(100)) {
        // Run a second scroll after header collapse animation finishes
        scrollToElement(400);
      } else {
        const checkInterval = setInterval(() => {
          if (scrollToElement(100)) {
            scrollToElement(400);
            clearInterval(checkInterval);
          }
        }, 100);

        // Timeout after 2 seconds
        const timeout = setTimeout(() => clearInterval(checkInterval), 2000);
        return () => {
          clearInterval(checkInterval);
          clearTimeout(timeout);
        };
      }
    } else {
      // If no hash, scroll to top on route change
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  const handleNavClick = (href?: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileOpenDropdowns([]);

    if (href?.includes("#")) {
      const elementId = href.split("#")[1];
      const element = document.getElementById(elementId);
      if (element) {
        // First scroll attempt
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 5);

        // Second scroll attempt after the header collapsing animation completes
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  };

  const toggleMobileDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileOpenDropdowns((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const renderNavLink = (
    href: string,
    children: React.ReactNode,
    className: string,
    onClick?: () => void,
  ) => {
    const isExternal = href.startsWith("http");
    const isHashLink = href.includes("#");

    if (isExternal) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }

    if (isHashLink && !href.startsWith("/")) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }

    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-elegant"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="container-wide flex flex-col">
        {/* Expandable Top Section */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
              className="order-2 md:order-1 flex flex-col md:flex-row items-center justify-center gap-3 lg:gap-6 overflow-hidden pt-2 md:pt-3 pb-0"
            >
              <Link to="/" className="shrink-0 hidden md:block">
                <img
                  src="/assets/logo-top.png"
                  alt="Anchor Business Valuations Logo"
                  className="h-28 md:h-16 lg:h-28 w-auto object-contain cursor-pointer"
                />
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                exit={{ opacity: 0 }}
                className="font-playfair font-bold text-navy text-center md:text-left leading-tight text-[11px] sm:text-[13px] md:text-xl lg:text-2xl whitespace-nowrap md:whitespace-normal pt-1 pb-0 md:py-0 tracking-tight md:tracking-normal"
              >
                Certified Business Valuation Services and{" "}
                <br className="hidden md:block" /> Merger & Acquisition
                Consulting
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Nav Bar */}
        <div
          className={`order-1 md:order-2 flex items-center justify-between w-full transition-all duration-300 ${isScrolled ? "py-0" : "pb-0 md:pb-0"}`}
        >
          {/* Mobile Top Logo & Desktop Navbar Logo */}
          <div className="w-[160px] md:w-[150px] lg:w-48 flex items-center h-16 md:h-16 lg:h-20">
            <Link to="/" className="shrink-0 block">
              <img
                src="/assets/logo.png"
                alt="Anchor Business Valuations Logo"
                className={`h-16 sm:h-16 md:h-12 lg:h-16 w-auto object-contain cursor-pointer transition-all duration-500 origin-left ${
                  !isScrolled
                    ? "md:opacity-0 md:-translate-y-4 md:pointer-events-none"
                    : "md:opacity-100 md:translate-y-0"
                }`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
                onMouseEnter={() =>
                  item.hasDropdown && setActiveDropdown(item.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {renderNavLink(
                  item.href,
                  <>
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </>,
                  "flex items-center gap-1 px-2 lg:px-3 py-2 font-inter text-sm lg:text-base font-medium transition-colors text-foreground hover:text-accent whitespace-nowrap shrink-0",
                  () => handleNavClick(item.href),
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-0 min-w-[200px] bg-background border border-border rounded-md shadow-xl overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {item.dropdownItems?.map((dropItem) => (
                          <Link
                            key={dropItem.name}
                            to={dropItem.href}
                            onClick={() => handleNavClick(dropItem.href)}
                            className="block px-5 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors font-inter"
                          >
                            {dropItem.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center justify-end w-[120px] md:w-48 lg:w-56 gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex items-center"
            >
              <Link to="/contact">
                <Button variant="cta" size="lg">
                  Get In Touch
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden justify-end flex-1 items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -mr-2 text-primary hover:bg-muted/50 rounded-md transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-white flex flex-col lg:hidden overflow-y-auto"
            >
              <div className="w-full px-4 sm:px-6 py-5 flex items-center justify-between border-b border-border">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/assets/logo-bw.png"
                    alt="Anchor Business Valuations Logo"
                    className="h-12 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <nav className="flex-1 container-wide py-8 flex flex-col gap-6">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="border-b border-border/40 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.href}
                        onClick={(e) => {
                          if (item.hasDropdown) {
                            e.preventDefault();
                            toggleMobileDropdown(item.name, e);
                          } else {
                            setIsMobileMenuOpen(false);
                            setMobileOpenDropdowns([]);
                            handleNavClick(item.href);
                          }
                        }}
                        className="flex-1 py-2 font-playfair text-xl font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.hasDropdown && (
                        <button
                          onClick={(e) => toggleMobileDropdown(item.name, e)}
                          className="p-2 text-muted-foreground hover:text-accent transition-colors"
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${
                              mobileOpenDropdowns.includes(item.name)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {item.hasDropdown &&
                        item.dropdownItems &&
                        mobileOpenDropdowns.includes(item.name) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 mt-2 flex flex-col gap-3">
                              {item.dropdownItems.map((dropItem) => (
                                <Link
                                  key={dropItem.name}
                                  to={dropItem.href}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setMobileOpenDropdowns([]);
                                    handleNavClick(dropItem.href);
                                  }}
                                  className="block py-2 text-base text-muted-foreground hover:text-accent transition-colors font-inter"
                                >
                                  {dropItem.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="mt-8">
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="cta"
                      size="lg"
                      className="w-full justify-center text-lg py-6"
                    >
                      Get In Touch
                      <ArrowUpRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  );
};

export default Header;
