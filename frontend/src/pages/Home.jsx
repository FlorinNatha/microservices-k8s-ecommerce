import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Loader, Truck, RefreshCw, Phone, ShieldCheck } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const categoryCards = [
  { title: 'Noise Cancelling', subtitle: 'Headphones & earbuds', accent: 'from-cyan-500 to-sky-500', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { title: 'Smart Wearables', subtitle: 'Latest fitness tech', accent: 'from-violet-500 to-fuchsia-500', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { title: 'Portable Audio', subtitle: 'Speakers & DACs', accent: 'from-emerald-500 to-lime-400', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="pb-16">
      <HeroSection />

      <section className="container relative -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-4 rounded-3xl bg-slate-900/80 p-5">
            <Truck className="h-8 w-8 text-cyan-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fast delivery</p>
              <p className="font-semibold text-slate-100">Free shipping over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-slate-900/80 p-5">
            <RefreshCw className="h-8 w-8 text-sky-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Flexible returns</p>
              <p className="font-semibold text-slate-100">30-day easy exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-slate-900/80 p-5">
            <Phone className="h-8 w-8 text-violet-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Customer care</p>
              <p className="font-semibold text-slate-100">24/7 premium support</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-slate-900/80 p-5">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Secure checkout</p>
              <p className="font-semibold text-slate-100">Advanced encryption</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Explore categories</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Curated premium collections</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover the latest audio, wearable, and mobile products tailored for modern lifestyles.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {categoryCards.map((card) => (
            <div key={card.title} className="group overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/90 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
              </div>
              <div className="p-6 pt-2">
                <div className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${card.accent}`} />
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{card.subtitle}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-100">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Featured products</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-100">Shop the best-sellers</h2>
          </div>
          <button className="rounded-full border border-cyan-400/20 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/10">View collection</button>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-10 text-center text-slate-400 shadow-xl shadow-slate-950/20">
            <Loader className="mx-auto mb-4 h-12 w-12 animate-spin text-cyan-400" />
            <p>Loading the latest electronics now...</p>
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-500/20 bg-slate-950/80 p-10 text-center text-slate-100 shadow-xl shadow-slate-950/20">
            <h3 className="mb-2 text-xl font-semibold">Oops! Something went wrong.</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
