import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const categories = ['All', ...Array.from(new Set(products.map((product) => product.category || 'Other'))).sort()];
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => (product.category || 'Other') === selectedCategory);

  return (
    <section className="pb-20 pt-10">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Our store</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Browse every product</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Filter by category and explore fresh gear built for premium sound, cutting-edge wearables, and everyday tech.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selectedCategory === category ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20' : 'border border-white/10 bg-slate-900/80 text-slate-300 hover:bg-slate-900/95'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-14 text-center text-slate-400 shadow-xl shadow-slate-950/20">
            <Loader className="mx-auto mb-4 h-12 w-12 animate-spin text-cyan-400" />
            <p>Loading products for you...</p>
          </div>
        ) : error ? (
          <div className="rounded-[32px] border border-red-500/20 bg-slate-950/80 p-14 text-center text-slate-100 shadow-xl shadow-slate-950/20">
            <h3 className="mb-3 text-xl font-semibold">Unable to load products</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Showing {filteredProducts.length} products</p>
              </div>
              <p className="text-sm text-slate-500">Selected category: <span className="font-semibold text-slate-100">{selectedCategory}</span></p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-14 text-center text-slate-400 shadow-xl shadow-slate-950/20">
                <h3 className="mb-3 text-xl font-semibold text-white">No products found</h3>
                <p className="max-w-xl mx-auto text-sm text-slate-400">Try another category or come back later when we add more premium electronics.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
