import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Package, LogOut, Search, Phone, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
            <Package size={24} />
          </span>
          <span>HPhone</span>
        </Link>

        <button
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-slate-200 hover:bg-slate-900/90 sm:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`flex-1 items-center justify-between gap-6 transition-all sm:flex ${open ? 'block' : 'hidden'} sm:block`}>
          <div className="mb-4 flex flex-col gap-4 sm:mb-0 sm:flex-row sm:items-center">
            <Link to="/" className="text-sm font-medium uppercase tracking-[0.26em] text-slate-400 hover:text-white sm:text-base">Home</Link>
            <Link to="/products" className="text-sm font-medium uppercase tracking-[0.26em] text-slate-400 hover:text-white sm:text-base">Products</Link>
            <Link to="/cart" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900/95 sm:px-5">
              <ShoppingCart size={18} />
              Cart {cartItemsCount > 0 ? `(${cartItemsCount})` : ''}
            </Link>
            <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
              <Phone size={18} className="text-cyan-300" />
              <div className="text-left text-xs leading-4 text-slate-400">
                <p>Call us</p>
                <p className="font-semibold text-slate-200">(+123) 888 9999</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/15">
                    Admin
                  </Link>
                )}
                <span className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">Hi, {user.username}</span>
                <button
                  onClick={logout}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:brightness-110"
                >
                  <LogOut size={16} className="inline-block mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:brightness-110"
              >
                <User size={16} className="inline-block mr-2" />
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
