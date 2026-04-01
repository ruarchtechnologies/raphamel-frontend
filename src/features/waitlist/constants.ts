import { ShieldCheck, Package, Building2 } from 'lucide-react';

export const AVATARS = [
  'https://images.unsplash.com/photo-1605369473971-c5e417ac3220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaWdlcmlhbiUyMGRvY3RvciUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjk4MjcyNnww&ixlib=rb-4.1.0&q=80&w=200',
  'https://images.unsplash.com/photo-1655720357761-f18ea9e5e7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcGhhcm1hY2lzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3Mjk4MjcyNnww&ixlib=rb-4.1.0&q=80&w=200',
  'https://images.unsplash.com/photo-1762237798212-bcc000c00891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGFkbWluaXN0cmF0b3IlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI5ODI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=200',
  'https://images.unsplash.com/photo-1694787590597-ba49c7cdc2cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwaGVhbHRoY2FyZSUyMHByb2N1cmVtZW50JTIwb2ZmaWNlciUyMGhvc3BpdGFsfGVufDF8fHx8MTc3Mjk4MjcyNXww&ixlib=rb-4.1.0&q=80&w=200',
];

export const VALUE_CARDS = [
  {
    number: '01',
    title: 'NAFDAC-Verified Products',
    description: 'Every product we carry is NAFDAC-registered and quality-checked to meet Nigerian pharmaceutical standards.',
    icon: ShieldCheck,
    color: {
      bg: 'rgba(0, 113, 220, 0.06)',
      border: 'rgba(0, 113, 220, 0.15)',
      icon: '#0071DC',
      number: 'rgba(0, 113, 220, 0.1)',
    },
  },
  {
    number: '02',
    title: '15,000+ Medical Products',
    description: 'From consumables to diagnostics, find everything your facility needs in one place.',
    icon: Package,
    color: {
      bg: 'rgba(250, 204, 21, 0.06)',
      border: 'rgba(250, 204, 21, 0.15)',
      icon: '#FACC15',
      number: 'rgba(250, 204, 21, 0.1)',
    },
  },
  {
    number: '03',
    title: 'Built for Healthcare Facilities',
    description: 'Procurement tools designed specifically for Nigerian hospitals, clinics, and pharmacies.',
    icon: Building2,
    color: {
      bg: 'rgba(34, 197, 94, 0.06)',
      border: 'rgba(34, 197, 94, 0.15)',
      icon: '#22C55E',
      number: 'rgba(34, 197, 94, 0.1)',
    },
  },
];

export const BUYER_STEPS = [
  { number: 1, title: 'Create Your Account', description: 'Register as a healthcare facility with your business details.' },
  { number: 2, title: 'Browse Our Catalog', description: 'Search 15,000+ NAFDAC-verified medical products across all categories.' },
  { number: 3, title: 'Review & Order', description: 'View transparent pricing and place your order directly with Raphamel.' },
  { number: 4, title: 'Track Delivery', description: 'Monitor your shipment in real-time with delivery confirmations.' },
  { number: 5, title: 'Manage Invoices', description: 'Access order history, invoices, and automated compliance reports.' },
];

export const SUPPLIER_STEPS = [
  { number: 1, title: 'Apply & Verify', description: 'Submit your NAFDAC license and business documents for verification.' },
  { number: 2, title: 'List Your Products', description: 'Upload your catalog with pricing, stock levels, and product details.' },
  { number: 3, title: 'Receive Orders', description: 'Get instant notifications when healthcare facilities place orders.' },
  { number: 4, title: 'Fulfill & Ship', description: 'Process orders with integrated logistics and tracking.' },
  { number: 5, title: 'Get Paid Securely', description: 'Receive payments through our secure escrow system.' },
];

export const STATS = [
  { value: '15K+', label: 'Products', yellow: false },
  { value: '800+', label: 'Facilities', yellow: true },
  { value: '1,200+', label: 'Waitlist', yellow: false },
];
