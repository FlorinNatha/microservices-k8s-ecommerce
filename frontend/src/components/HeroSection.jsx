import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Cpu, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950/90 py-20 sm:py-24">
      <div className="container relative z-10 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-glow shadow-cyan-500/10">
            Premium audio tech — designed for creators and gamers
          </span>

          <div className="max-w-xl space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400 sm:text-base">Wireless audio & smart accessories</p>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Elevate your setup with the latest high-fidelity sound.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Discover exclusive electronics curated for modern homes, studios, and mobile life — where style meets performance.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-sky-400"
            >
              Shop the collection
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
            <a className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-100 hover:bg-slate-900/95" href="#featured">
              View featured deals
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-100 shadow-xl shadow-slate-950/20">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                <Headphones size={24} />
              </span>
              <p className="mt-4 text-sm tracking-[0.3em] text-slate-400">HEADPHONES</p>
              <p className="mt-2 text-lg font-semibold text-white">Active noise cancellation</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-100 shadow-xl shadow-slate-950/20">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
                <Cpu size={24} />
              </span>
              <p className="mt-4 text-sm tracking-[0.3em] text-slate-400">GAMING</p>
              <p className="mt-2 text-lg font-semibold text-white">Precision controllers</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-100 shadow-xl shadow-slate-950/20">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                <Zap size={24} />
              </span>
              <p className="mt-4 text-sm tracking-[0.3em] text-slate-400">WEARABLES</p>
              <p className="mt-2 text-lg font-semibold text-white">Smart comfort gear</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/10 bg-slate-900/50 shadow-2xl shadow-slate-950/30 backdrop-blur-xl group">
          <div className="absolute inset-x-0 top-0 h-40 bg-hero-glow opacity-80 blur-3xl" />
          <img 
            src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80" 
            alt="Premium Headphones" 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ minHeight: '600px' }}
          />
          <div className="absolute bottom-6 left-6 right-6 grid gap-4 sm:bottom-8 sm:left-8 sm:right-8">
            <div className="rounded-[28px] bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Limited edition</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Apex Studio Pro</h2>
                </div>
                <span className="rounded-3xl bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">Best seller</span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/90 p-4 text-slate-200 shadow-inner shadow-slate-950/20">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Battery life</p>
                  <p className="mt-2 text-xl font-semibold text-white">30+ hrs</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-4 text-slate-200 shadow-inner shadow-slate-950/20">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fast charge</p>
                  <p className="mt-2 text-xl font-semibold text-white">15 min boost</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
