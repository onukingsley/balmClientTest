import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'New Arrivals', href: '/products?filter=new' },
    { name: 'Best Sellers', href: '/products?filter=bestsellers' },
    { name: 'Sale', href: '/products?filter=sale' },
  ],
  help: [
    { name: 'FAQ', href: '#' },
    { name: 'Shipping Info', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Track Order', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '/#about' },
    { name: 'Our Story', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Contact', href: '/#contact' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const benefits = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $75' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: CreditCard, title: 'Gift Cards', description: 'Give the gift of glow' },
];

export default function Footer() {
  return (
    <footer className="bg-nude-900 text-nude-100">
      {/* Benefits Bar */}
      <div className="border-b border-nude-800">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nude-800 flex items-center justify-center">
                  <benefit.icon className="h-5 w-5 text-nude-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-nude-200">{benefit.title}</h4>
                  <p className="text-nude-500 text-xs">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-serif font-semibold text-white">Next of</span>
              <span className="text-3xl font-serif font-light text-nude-400">Skin</span>
            </Link>
            <p className="text-nude-400 mb-6 max-w-sm leading-relaxed">
              Premium skincare crafted with nature's finest ingredients. 
              Discover your best skin with our scientifically-backed formulas.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-nude-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">123 Glow Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-nude-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-nude-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@nextofskin.com</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-medium text-white mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-nude-400 hover:text-nude-200 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-6">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-nude-400 hover:text-nude-200 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-nude-400 hover:text-nude-200 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-nude-800">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-nude-500 text-sm">
              © 2025 Next of Skin. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-nude-800 flex items-center justify-center text-nude-400 hover:bg-nude-700 hover:text-nude-200 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <Link to="#" className="text-nude-500 hover:text-nude-300 text-sm">
                Privacy Policy
              </Link>
              <Link to="#" className="text-nude-500 hover:text-nude-300 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
