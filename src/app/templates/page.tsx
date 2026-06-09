"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TEMPLATES } from '@/data/templates';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';
type CategoryFilter = 'all' | 'Vintage' | 'Traditional' | 'Modern';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const categories: CategoryFilter[] = ['all', 'Vintage', 'Traditional', 'Modern'];

  // Filter and sort logic
  const filteredAndSortedTemplates = useMemo(() => {
    let result = [...TEMPLATES];

    // Filter by search query
    if (searchQuery.trim() !== '') {
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
            Premium Designs
          </span>
          <h1 className="text-4xl md:text-5xl font-whitespace text-luxury-dark tracking-wide font-semibold">
            Wedding Invitation Templates
          </h1>
          <div className="w-16 h-[2px] bg-gold-medium mx-auto mt-4 mb-6" />
          <p className="text-sm sm:text-base text-foreground/70 max-w-xl mx-auto leading-relaxed">
            Browse our curated collection of elegant, responsive, and animated digital invitations. Find the perfect aesthetic to invite your loved ones.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center mb-12 bg-white border border-gold-medium/10 p-6 rounded-2xl luxury-shadow">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gold-light/25 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-full py-3 pl-12 pr-6 text-sm outline-none transition-all placeholder:text-foreground/45 text-luxury-dark"
            />
          </div>

          {/* Filtering buttons & sorting */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Categories */}
            <div className="flex bg-gold-light/30 border border-gold-medium/15 p-1 rounded-full overflow-hidden">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-luxury-dark text-gold-light'
                      : 'text-foreground/60 hover:text-gold-dark'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 border border-gold-medium/20 hover:border-gold-medium/40 rounded-full px-4 py-2 bg-white transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5 text-foreground/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-semibold uppercase tracking-wider text-foreground/75 outline-none cursor-pointer pr-2"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredAndSortedTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {filteredAndSortedTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl border border-gold-medium/10 overflow-hidden luxury-shadow hover:shadow-2xl hover:shadow-gold-medium/15 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[16/9] overflow-hidden bg-luxury-cream border-b border-gold-medium/10">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-gold-dark text-white text-[10px] font-sansflex uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-gold-medium/20">
                    {template.category}
                  </div>
                  {/* Rating tag */}
                  <div className="absolute top-4 right-4 bg-white/95 text-luxury-dark text-[10px] font-sansflex tracking-wide font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-gold-medium text-gold-medium" />
                    <span>{template.rating}</span>
                    <span className="text-foreground/45">({template.reviewsCount})</span>
                  </div>
                </div>

                {/* Info details */}
                <div className="p-6 flex flex-col flex-grow text-left">
                  <h3 className="font-sansflex text-xl text-luxury-dark mb-2 tracking-wide font-semibold">
                    {template.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed font-sansflex mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Highlight Features list */}
                  <ul className="mb-6 space-y-1.5 border-t border-gold-medium/5 pt-4">
                    {template.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="text-xs text-foreground/60 flex items-center gap-2 font-sansflex">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-medium shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-gold-medium/10 pt-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-foreground/40 font-sansflex uppercase tracking-wider">Price</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-sansflex font-bold text-lg text-luxury-dark">₹{template.price}</span>
                        <span className="font-sansflex text-xs text-foreground/45 line-through">₹{template.originalPrice}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/templates/${template.slug}`}
                        className="text-xs uppercase tracking-wider font-semibold bg-luxury-dark hover:bg-gold-dark text-white px-4.5 py-2.5 rounded-full transition-colors font-sansflex border border-gold-medium/20"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gold-medium/10 rounded-2xl p-8 max-w-lg mx-auto">
            <SlidersHorizontal className="w-12 h-12 text-gold-medium/40 mx-auto mb-4" />
            <h3 className="font-sansflex text-lg font-semibold text-luxury-dark mb-2">No Templates Found</h3>
            <p className="text-sm text-foreground/60 mb-6">
              We couldn&apos;t find any templates matching your search criteria. Try modifying your search text or removing category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('featured');
              }}
              className="text-xs uppercase tracking-widest font-semibold bg-luxury-dark hover:bg-gold-dark text-white px-6 py-3 rounded-full transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
