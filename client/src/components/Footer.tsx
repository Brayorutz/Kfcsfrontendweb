import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-primary">
              KFCS<span className="text-secondary">.</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering farmers through dairy excellence since 1964. We are committed to quality, sustainability, and community growth.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/production" className="hover:text-primary transition-colors">Our Products</Link></li>
              <li><Link href="/investors" className="hover:text-primary transition-colors">Investor Relations</Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">News & Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-secondary" />
                <span>Kabianga Centre,<br />Kericho County, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" />
                <span>info@kabiangafcs.co.ke</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Stay Connected</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Subscribe to our newsletter for updates.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground mb-6">
            <p>&copy; {new Date().getFullYear()} Kabianga Farmers Cooperative Society. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/csr" className="hover:text-foreground">CSR & Community</Link>
              <Link href="/sustainability" className="hover:text-foreground">Sustainability</Link>
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
