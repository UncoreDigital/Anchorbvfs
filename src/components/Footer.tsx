import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Industry Expertise", href: "/industry-expertise" },
  { name: "Contact", href: "/contact" },
];


const Footer = () => {
  const handleNavClick = (href: string) => {
    if (href.includes("#")) {
      const elementId = href.split("#")[1];
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 10);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <footer id="contact" className="bg-primary pt-20 pb-8">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
          {/* Brand Column */}
          <div>
            <Link to="/" onClick={() => handleNavClick("/")} className="flex items-center gap-2 mb-6">
              <img
                src="/assets/footer/Logo.png"
                alt="Anchor Business Valuations"
                className="h-96 w-auto object-contain bg-white/1 rounded-lg p-1"
              />
            </Link>
            <p className="text-primary-foreground/60 font-inter text-sm leading-relaxed mb-6">
              Anchor Business Valuations & Financial Services, LLC is a premier
              business valuation and consulting firm serving clients with
              integrity and expertise.
            </p>
            <div className="flex gap-3">
              {[
                {
                  Icon: Linkedin,
                  href: "https://www.linkedin.com/company/anchor-business-valuations-financial-services-llc/about/",
                },
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/anchor_business_valuations/",
                },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-primary-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-primary-foreground mb-6">
              Our Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/#services"
                  onClick={() => handleNavClick("/#services")}
                  className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors duration-300"
                >
                  What We Offer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-primary-foreground mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-primary-foreground/60 font-inter text-sm max-w-[300px] flex flex-col gap-3">
                  <p>
                    <strong>Naples:</strong><br />
                    365 Fifth Avenue South, Suite 200, Naples, FL 34102
                  </p>
                  <p>
                    <strong>Maryland:</strong><br />
                    12 W Church St, <br />Frederick, MD 21701
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <span className="flex flex-col gap-1">
                  <a
                    href="tel:+12399193092"
                    className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors"
                  >
                    Office: (239) 919-3092
                  </a>
                  <a
                    href="tel:+13126329144"
                    className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors"
                  >
                    Cell: (312) 632-9144
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href="mailto:info@anchorbv.com"
                  className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors"
                >
                  info@anchorbv.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/40 font-inter text-sm">
              © 2026 Anchor Business Valuations. All rights reserved. | Powered
              by{" "}
              <a
                href="https://uncoredigital.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Uncore Digital
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
