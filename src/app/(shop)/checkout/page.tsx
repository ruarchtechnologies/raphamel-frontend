'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const schema = z.object({
  firstName:    z.string().min(1, 'Required'),
  lastName:     z.string().min(1, 'Required'),
  email:        z.string().email('Invalid email'),
  phone:        z.string().min(10, 'Valid phone required'),
  address:      z.string().min(5, 'Address required'),
  city:         z.string().min(1, 'City required'),
  state:        z.string().min(1, 'State required'),
});

type FormData = z.infer<typeof schema>;

const STATES = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

export default function CheckoutPage() {
  const { items, subtotal } = useCartStore();
  const shipping = subtotal() >= 50000 ? 0 : 2500;
  const total = subtotal() + shipping;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      toast.success('Order placed! Redirecting to payment…');
      // create order → initialise Paystack → open inline popup
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Button variant="primary" asChild><Link href="/products">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
              { label: 'Checkout' },
            ]}
          />
        </div>
      </div>

      {/* Progress steps */}
      <div className="border-b border-gray-100">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm">
            {['Shipping', 'Payment'].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={14} className="text-gray-300" />}
                <span className={i === 0 ? 'font-semibold text-primary' : 'text-gray-400'}>
                  {step}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            {/* Shipping form */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-[12px] border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
                  <Input label="Last Name"  error={errors.lastName?.message}  {...register('lastName')} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                  <Input label="Phone" type="tel"   error={errors.phone?.message} {...register('phone')} />
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-white rounded-[12px] border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Shipping Address</h2>
                <div className="space-y-4">
                  <Input label="Street Address" error={errors.address?.message} {...register('address')} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" error={errors.city?.message} {...register('city')} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                      <select
                        className="input-base"
                        {...register('state')}
                      >
                        <option value="">Select state</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment note */}
              <div className="bg-white rounded-[12px] border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">Payment</h2>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[8px]">
                  <Lock size={18} className="text-primary" />
                  <p className="text-sm text-gray-600">
                    You&apos;ll be redirected to <strong>Paystack</strong> to complete your payment securely.
                  </p>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
                Place Order & Pay {formatPrice(total)}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-green-500" />
                256-bit SSL encrypted checkout
              </div>
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-[12px] border border-gray-100 p-5 sticky top-28">
                <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>

                <ul className="space-y-3 mb-4">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                      <div className="relative w-12 h-14 flex-shrink-0 bg-gray-50 rounded-[6px] overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                        {item.variantName && <p className="text-[10px] text-gray-400">{item.variantName}</p>}
                      </div>
                      <p className="text-xs font-bold text-gray-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
