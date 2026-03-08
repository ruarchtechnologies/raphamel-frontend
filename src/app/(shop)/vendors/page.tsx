import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Star, Package } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'All Vendors' };

const VENDORS = [
  { id: '1', name: 'TechGadgets NG', slug: 'techgadgets-ng', logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=200&fit=crop', products: 312, rating: 4.8, reviewCount: 2104, category: 'Electronics', verified: true, desc: 'Premium electronics and gadgets at best prices.' },
  { id: '2', name: 'Fashion House Lagos', slug: 'fashion-house-lagos', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=200&fit=crop', products: 841, rating: 4.6, reviewCount: 5812, category: 'Fashion', verified: true, desc: 'Designer fashion for the modern Nigerian.' },
  { id: '3', name: 'Scent Palace', slug: 'scent-palace', logo: 'https://images.unsplash.com/photo-1590156206657-aec9a01e8e24?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1527799820374-87d23739f01a?w=800&h=200&fit=crop', products: 156, rating: 4.9, reviewCount: 984, category: 'Beauty', verified: true, desc: 'Authentic fragrances and beauty products.' },
  { id: '4', name: 'SportsZone NG', slug: 'sportszone-ng', logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=200&fit=crop', products: 229, rating: 4.4, reviewCount: 1240, category: 'Sports', verified: false, desc: 'Sports equipment and fitness gear.' },
  { id: '5', name: 'HomeDecor Pro', slug: 'homedecor-pro', logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=200&fit=crop', products: 178, rating: 4.7, reviewCount: 768, category: 'Home', verified: true, desc: 'Transform your living space with quality decor.' },
  { id: '6', name: 'GamerZone NG', slug: 'gamerzone-ng', logo: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&h=200&fit=crop', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=200&fit=crop', products: 94, rating: 4.5, reviewCount: 512, category: 'Gaming', verified: true, desc: 'Gaming gear for serious gamers.' },
];

export default function VendorsPage() {
  return (
    <div className="page-enter">
      <div className="bg-gray-50 border-b border-gray-100 py-5">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Vendors' }]} />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">All Vendors</h1>
          <p className="text-sm text-gray-500 mt-1">{VENDORS.length} verified vendors across Nigeria</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {VENDORS.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.slug}`}
              className="bg-white rounded-[12px] border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Banner */}
              <div className="relative h-28 bg-gray-100 overflow-hidden">
                <Image
                  src={vendor.banner}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {vendor.verified && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="primary" className="text-[10px] gap-1">
                      <BadgeCheck size={10} /> Verified
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-4 pb-4">
                {/* Logo */}
                <div className="flex items-start gap-3 -mt-6 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white shadow-md flex-shrink-0">
                    <Image src={vendor.logo} alt={vendor.name} width={48} height={48} className="object-cover" />
                  </div>
                  <div className="mt-7">
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-gray-400">{vendor.category}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{vendor.desc}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-700">{vendor.rating}</span>
                    <span>({vendor.reviewCount.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package size={11} />
                    {vendor.products} products
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
