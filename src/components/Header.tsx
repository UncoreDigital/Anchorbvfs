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
      { name: "Meet The Owner", href: "/about" },
      { name: "Team Member", href: "/team" },
      { name: "Staff", href: "/staff" },
    ],
  },
  {
    name: "Services",
    href: "/#services",
    hasDropdown: true,
    dropdownItems: [
      { name: "IRC Section 409A Valuation", href: "/services/409a-valuation" },
      { name: "Business Valuation", href: "/services/business-valuation" },
      {
        name: "Healthcare Valuations",
        href: "/services/healthcare-valuations",
      },
      {
        name: "Mergers & Acquisitions",
        href: "/services/mergers-acquisitions",
      },
      { name: "Litigation Support", href: "/services/litigation-support" },
      { name: "Estate & Gift Tax", href: "/services/estate-gift-tax" },
      { name: "Shareholder Disputes", href: "/services/shareholder-disputes" },
      { name: "Quality of Earnings", href: "/services/quality-of-earnings" },
      { name: "Lending Valuations", href: "/services/lending-valuations" },
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
      { name: "FAQ", href: "/faq" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdowns, setMobileOpenDropdowns] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useBodyScrollLock(isMobileMenuOpen);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileOpenDropdowns([]);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const toggleMobileDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileOpenDropdowns((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const renderNavLink = (
    href: string,
    children: React.ReactNode,
    className: string,
    onClick?: () => void
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md shadow-elegant py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="Anchor Business Valuations Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
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
                `flex items-center gap-1 px-4 py-2 font-inter text-sm font-medium transition-colors ${
                  isScrolled || !isHomePage
                    ? "text-foreground hover:text-accent"
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                }`,
                () => handleNavClick()
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
                          onClick={handleNavClick}
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex items-center gap-4"
        >
          <Link to="/contact">
            <Button variant="cta" size="lg">
              Get In Touch
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 -mr-2 ${
            isScrolled || !isHomePage
              ? "text-primary"
              : "text-primary-foreground"
          }`}
        >
          {isMobileMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden overflow-y-auto"
            >
              <div className="w-full px-4 sm:px-6 py-5 flex items-center justify-between border-b border-border">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/assets/logo.png"
                    alt="Anchor Business Valuations Logo"
                    className="h-10 w-auto object-contain"
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
        document.body
      )}
    </header>
  );
};

export default Header;
