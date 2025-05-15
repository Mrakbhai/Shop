import React from 'react';
import { Link } from 'wouter';
import { useTheme } from '@/lib/themeContext';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`theme-transition bg-background pt-16 pb-8 border-t border-border`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-montserrat text-2xl font-bold text-primary">PrintOn</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Create and shop custom t-shirts designed by a global community of independent artists.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-inter font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men" className="hover:text-primary transition-colors">
                  Men's T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=women" className="hover:text-primary transition-colors">
                  Women's T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids" className="hover:text-primary transition-colors">
                  Kids T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=bestsellers" className="hover:text-primary transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=new" className="hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-inter font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-primary transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-inter font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-primary transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-primary transition-colors">
                  For Creators
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-primary transition-colors">
                  Artist Partnership
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/accessibility" className="hover:text-primary transition-colors">
                Accessibility
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PrintOn. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;