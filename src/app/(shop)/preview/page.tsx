'use client';

import { ProductCard, type ProductCardData } from '@/components/products/ProductCard';

const MOCK: ProductCardData[] = [
  {
    id: '1',
    slug: 'sterile-gauze-pads',
    name: 'Sterile Gauze Pads',
    price: 2500,
    image: '/images/product-placeholder.png',
    stock: 99,
    variantId: 'v1',
  },
  {
    id: '2',
    slug: 'surgical-gloves-nitrile',
    name: 'Nitrile Surgical Gloves — Box of 100',
    price: 8500,
    compareAtPrice: 11000,
    image: '/images/product-placeholder.png',
    stock: 12,
    variantId: 'v2',
  },
  {
    id: '3',
    slug: 'digital-thermometer',
    name: 'Digital Infrared Thermometer',
    price: 14500,
    image: '/images/product-placeholder.png',
    stock: 0,
    variantId: 'v3',
  },
  {
    id: '4',
    slug: 'iv-set-pack',
    name: 'IV Administration Set — Multi-Variant Pack',
    price: 3200,
    image: '/images/product-placeholder.png',
    stock: 200,
    variantId: 'v4',
    showFromPrefix: true,
  },
  {
    id: '5',
    slug: 'blood-pressure-monitor-aneroid-professional-grade',
    name: 'Aneroid Blood Pressure Monitor Professional Grade Long Name That Truncates',
    price: 47000,
    image: '/images/product-placeholder.png',
    stock: 5,
    variantId: 'v5',
  },
  {
    id: '6',
    slug: 'stethoscope-dual-head',
    name: 'Dual-Head Stethoscope',
    price: 12000,
    compareAtPrice: 15500,
    image: '/images/product-placeholder.png',
    stock: 30,
    variantId: 'v6',
    showFromPrefix: true,
  },
];

export default function CardPreviewPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Product Card Preview</h1>
          <p className="text-sm text-gray-500 mt-1">
            States: normal · sale · out-of-stock · from-price · long name · sale+from
          </p>
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Grid (4-col)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {MOCK.map((p, i) => (
            <ProductCard key={p.id} product={p} layout="grid" index={i} />
          ))}
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">List layout</h2>
        <div className="max-w-xl space-y-2">
          {MOCK.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} layout="list" index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
