import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Make navbar solid when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Is home page (needs transparent bg at top)
  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome ? 'bg-[#4a1c40]/95 backdrop-blur-md shadow-lg' : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 ${navBg}`}>
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold tracking-widest text-white uppercase">
          HPHONE
        </Link>

        {/* Center: Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold uppercase tracking-wider text-white hover:text-pink-300 transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-semibold uppercase tracking-wider text-white hover:text-pink-300 transition-colors">Shop</Link>
          <Link to="/products?category=Headphones" className="text-sm font-semibold uppercase tracking-wider text-white hover:text-pink-300 transition-colors">Pages</Link>
          <Link to="/products?category=Earbuds" className="text-sm font-semibold uppercase tracking-wider text-white hover:text-pink-300 transition-colors">Blog</Link>
          <a href="#" className="text-sm font-semibold uppercase tracking-wider text-white hover:text-pink-300 transition-colors">Contact</a>
        </nav>

        {/* Right: Icons & Auth */}
        <div className="hidden lg:flex items-center gap-6 text-white">
          <button className="hover:text-pink-300 transition-colors">
            <Search size={20} />
          </button>
          
          <Link to="/cart" className="relative hover:text-pink-300 transition-colors flex items-center">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-white text-purple-900 rounded-full h-4 w-4 flex items-center justify-center">
              {cartItemsCount}
            </span>
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-white/20">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition flex items-center gap-1">
                    <Shield size={14} /> Admin
                  </Link>
                )}
                <button onClick={logout} className="text-xs font-bold uppercase tracking-wider bg-pink-500 hover:bg-pink-400 px-4 py-1.5 rounded-full transition text-white">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition flex items-center gap-1">
                <User size={14} /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#4a1c40] border-b border-white/10 shadow-xl py-4 px-6 flex flex-col gap-4">
          <Link to="/" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wider text-white">Home</Link>
          <Link to="/products" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wider text-white">Shop</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wider text-white flex items-center justify-between">
            Cart <span className="bg-white text-purple-900 rounded-full px-2 py-0.5 text-xs">{cartItemsCount}</span>
          </Link>
          <hr className="border-white/10" />
          {user ? (
            <div className="flex justify-between items-center">
              {user.role === 'admin' && <Link to="/admin" className="text-sm text-pink-300 font-bold uppercase">Admin</Link>}
              <button onClick={() => { logout(); setOpen(false); }} className="text-sm text-white font-bold uppercase">Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-white font-bold uppercase">Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
