export const runtime = 'edge';

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Star, Package, MapPin, Globe, Mail } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { ProductCardData } from '@/components/products/ProductCard';

const VENDOR = {
  id: '1',
  name: 'TechGadgets NG',
  slug: 'techgadgets-ng',
  logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop',
  banner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=300&fit=crop',
  description: 'We are Nigeria\'s leading electronics retailer, offering premium gadgets, smartphones, laptops, and accessories at competitive prices. All products come with manufacturer warranty.',
  rating: 4.8,
  reviewCount: 2104,
  products: 312,
  verified: true,
  location: 'Lagos, Nigeria',
  website: 'https://techgadgets.ng',
  email: 'support@techgadgets.ng',
  joinedDate: 'January 2023',
};

const PRODUCTS: ProductCardData[] = [
  { id: '1', slug: 'wireless-headphones-pro', name: 'Wireless Noise-Cancelling Headphones Pro', price: 45000, compareAtPrice: 65000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop', rating: 4.5, reviewCount: 312, vendorName: 'TechGadgets NG' },
  { id: '4', slug: 'smartwatch-series-7', name: 'Smart Watch Series 7', price: 78000, compareAtPrice: 95000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', rating: 4.6, reviewCount: 431 },
  { id: '6', slug: 'bluetooth-speaker', name: 'Portable Bluetooth Speaker', price: 18500, compareAtPrice: 25000, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=500&fit=crop', rating: 4.2, reviewCount: 88 },
  { id: '8', slug: 'gaming-keyboard', name: 'RGB Mechanical Gaming Keyboard', price: 32000, compareAtPrice: 42000, image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400&h=500&fit=crop', rating: 4.7, reviewCount: 284 },
];

export default function VendorStorePage({ params }: { params: { slug: string } }) {
  return (
    <div className="page-enter">
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        <Image
          src={VENDOR.banner}
          alt={VENDOR.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="container">
        {/* Store header card */}
        <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm -mt-12 relative z-10 p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden flex-shrink-0 -mt-10 sm:-mt-0 bg-white">
              <Image src={VENDOR.logo} alt={VENDOR.name} width={80} height={80} className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{VENDOR.name}</h1>
                {VENDOR.verified && (
                  <Badge variant="primary" className="gap-1">
                    <BadgeCheck size={11} /> Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <strong className="text-gray-700">{VENDOR.rating}</strong>
                  ({VENDOR.reviewCount.toLocaleString()} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Package size={13} /> {VENDOR.products} products
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {VENDOR.location}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4 max-w-2xl leading-relaxed">
            {VENDOR.description}
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Vendors', href: '/vendors' },
              { label: VENDOR.name },
            ]}
          />
        </div>

        {/* Products */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Products from {VENDOR.name}
        </h2>
        <ProductGrid
          products={PRODUCTS}
          total={PRODUCTS.length}
          columns={4}
          showToolbar
        />

        <div className="pb-12" />
      </div>
    </div>
  );
}
