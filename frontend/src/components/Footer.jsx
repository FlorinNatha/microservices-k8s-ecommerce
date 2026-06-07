import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Globe, MessageCircle, Camera, Video, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 pt-16 pb-8">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-100">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                <Package size={24} />
              </span>
              <span>HPhone</span>
            </Link>
            <p className="text-sm leading-6 text-slate-400">
              Premium audio and tech gear designed for creators, gamers, and audiophiles. Elevate your sound experience today.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-cyan-400"><Globe size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-cyan-400"><MessageCircle size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-cyan-400"><Camera size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-cyan-400"><Video size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">Shop</h3>
            <ul className="mt-6 space-y-4">
              <li><Link to="/products" className="text-sm text-slate-400 hover:text-cyan-400">All Products</Link></li>
              <li><Link to="/products?category=Headphones" className="text-sm text-slate-400 hover:text-cyan-400">Headphones</Link></li>
              <li><Link to="/products?category=Earbuds" className="text-sm text-slate-400 hover:text-cyan-400">Earbuds</Link></li>
              <li><Link to="/products?category=Accessories" className="text-sm text-slate-400 hover:text-cyan-400">Accessories</Link></li>
              <li><Link to="/products?category=Gaming" className="text-sm text-slate-400 hover:text-cyan-400">Gaming</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">Support</h3>
            <ul className="mt-6 space-y-4">
              <li><a href="#" className="text-sm text-slate-400 hover:text-cyan-400">Contact Us</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-cyan-400">FAQs</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-cyan-400">Shipping Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-cyan-400">Returns & Exchanges</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-cyan-400">Warranty</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">Newsletter</h3>
            <p className="mt-6 text-sm leading-6 text-slate-400">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="mt-4 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  required
                />
              </div>
              <button type="submit" className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">© 2026 HPhone. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
