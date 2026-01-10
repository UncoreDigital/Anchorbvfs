import { 
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/#services" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "Business Valuation", href: "/services/business-valuation" },
  { name: "Litigation Support", href: "/services/litigation-support" },
  { name: "Mergers & Acquisitions", href: "/services/mergers-acquisitions" },
  { name: "409A Valuation", href: "/services/409a-valuation" },
];

const Footer = () => {
  return (
    <footer id="contact" className="bg-primary pt-20 pb-8">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-6">
              <img
                src="/assets/logo.png"
                alt="Anchor Business Valuations"
                className="h-12 w-auto object-contain bg-white/10 rounded-lg p-1"
              />
            </a>
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
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
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
                  <a
                    href={link.href}
                    className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-primary-foreground mb-6">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors duration-300"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
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
                <span className="text-primary-foreground/60 font-inter text-sm max-w-[200px]">
                  365 Fifth Avenue, Naples, FL 34102, United States
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href="tel:+12399193092"
                  className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors"
                >
                  239.919.3092
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href="mailto:Info@AnchorBVFS.com"
                  className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors"
                >
                  Info@AnchorBVFS.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/40 font-inter text-sm">
              © {new Date().getFullYear()} Anchor Business Valuations. All
              rights reserved.
              <br />
              <a href="https://uncore-digital.com/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 font-inter text-sm hover:text-gold transition-colors">
                Powered by Uncore Digital
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
