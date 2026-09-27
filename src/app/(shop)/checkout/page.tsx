'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, MapPin, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { usePaystackSession } from '@/features/checkout/hooks/use-paystack-session';
import { useCart, useClearCart } from '@/features/cart/hooks/useCart';
import { useMe } from '@/features/auth/hooks/useAuth';
import { useAddresses } from '@/features/account/hooks/useAddresses';
import type { Address } from '@/features/account/hooks/useAddresses';
import { useFacility } from '@/features/account/hooks/useFacility';
import { CompleteFacilityGate } from '@/features/checkout/components/CompleteFacilityGate';
import {
  updateCartAddress,
  listShippingOptions,
  addShippingMethod,
  initializePaymentSession,
  getCartPaymentSessionStatus,
  completeCart,
} from '@/data/api/cart.api';
import { formatPrice } from '@/lib/utils';

// ── Form schema (contact only — address comes from saved account) ─────────────

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  email:     z.string().email('Invalid email'),
  phone:     z.string().min(10, 'Valid phone required'),
});

type FormData = z.infer<typeof schema>;

// ── Order summary sidebar ─────────────────────────────────────────────────────

function OrderSummary({
  items,
  subtotal,
  shippingTotal,
  shippingLabel,
  taxTotal,
  total,
}: {
  items: { id: string; title?: string; subtitle?: string; thumbnail?: string; quantity: number; unit_price?: number }[];
  subtotal: number;
  shippingTotal: number;
  shippingLabel: string;
  taxTotal: number;
  total: number;
}) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-100 p-5 sticky top-28">
      <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>

      <ul className="space-y-3 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative w-12 h-14 flex-shrink-0 flex-none">
              <div className="w-full h-full bg-gray-50 rounded-[6px] overflow-hidden">
                <Image
                  src={item.thumbnail ?? '/images/product-placeholder.png'}
                  alt={item.title ?? 'Product'}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                {item.title}
              </p>
              {item.subtitle && item.subtitle.trim().toLowerCase() !== (item.title ?? '').trim().toLowerCase() && (
                <p className="text-[10px] text-gray-400">{item.subtitle}</p>
              )}
            </div>
            <p className="text-xs font-bold text-gray-900 flex-shrink-0">
              {formatPrice((item.unit_price ?? 0) * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{shippingLabel}</span>
          <span className="font-medium">
            {shippingTotal === 0 ? 'Free' : formatPrice(shippingTotal)}
          </span>
        </div>
        {taxTotal > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>VAT</span>
            <span className="font-medium">{formatPrice(taxTotal)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router  = useRouter();
  const { data: me, isLoading: meLoading } = useMe();
  const { data: facility, isLoading: facilityLoading } = useFacility();
  const { data: cart, isLoading: cartLoading } = useCart();
  const clearCart = useClearCart();
  const { pay, isPaying } = usePaystackSession();

  const { data: addresses = [] } = useAddresses();

  const [mounted, setMounted]                       = useState(false);
  const [isContinuing, setIsContinuing]             = useState(false);
  const [shippingMethodName, setShippingMethodName] = useState('Shipping');
  const [pickerOpen, setPickerOpen]                 = useState(false);
  const [selectedAddress, setSelectedAddress]       = useState<Address | null>(null);

  // Once addresses load, default to the default-shipping one (or first)
  useEffect(() => {
    if (!addresses.length || selectedAddress) return;
    const def = addresses.find((a) => a.is_default_shipping) ?? addresses[0];
    setSelectedAddress(def);
  }, [addresses, selectedAddress]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!me) return;
    if (me.firstName) setValue('firstName', me.firstName);
    if (me.lastName)  setValue('lastName',  me.lastName);
    if (me.email)     setValue('email',     me.email);
    if (me.phone)     setValue('phone',     me.phone ?? '');
  }, [me, setValue]);

  // Pre-fetch shipping options to show the method name in the summary
  useEffect(() => {
    if (!cart?.id) return;
    listShippingOptions(cart.id)
      .then((opts) => {
        const first = (opts[0] as { name?: string } | undefined);
        if (first?.name) setShippingMethodName(first.name);
      })
      .catch(() => {});
  }, [cart?.id]);

  const items         = cart?.items ?? [];
  const subtotal      = items.reduce((sum, i) => sum + ((i as { unit_price?: number }).unit_price ?? 0) * i.quantity, 0);
  const shippingTotal = (cart as { shipping_total?: number })?.shipping_total ?? 0;
  const taxTotal      = (cart as { tax_total?: number })?.tax_total ?? 0;
  const cartTotal     = subtotal + shippingTotal + taxTotal;
  const hasAddress    = !!selectedAddress;

  // ── Single-step: use saved address → auto-select shipping → Paystack → complete ──

  async function onContinue(data: FormData) {
    if (!cart || !selectedAddress) return;
    setIsContinuing(true);

    // 1. Push selected address to cart
    try {
      await updateCartAddress(cart.id, data.email, {
        first_name:   data.firstName,
        last_name:    data.lastName,
        address_1:    selectedAddress.address_1  ?? '',
        city:         selectedAddress.city        ?? '',
        province:     selectedAddress.province    ?? '',
        country_code: 'ng',
        phone:        data.phone,
      });
    } catch {
      toast.error('Could not save shipping details. Please try again.');
      setIsContinuing(false);
      return;
    }

    // 2. Auto-select first available shipping option
    try {
      const options = await listShippingOptions(cart.id);
      if (options.length > 0) {
        const first = options[0] as { id: string; name?: string };
        await addShippingMethod(cart.id, first.id);
        if (first.name) setShippingMethodName(first.name);
      }
    } catch {
      // Shipping not configured — proceeding without
    }

    // 3. Initialize Medusa payment session → get Paystack access_code
    let accessCode: string | null = null;
    try {
      const session = await initializePaymentSession(cart.id);
      accessCode = session.accessCode;
      if (!accessCode) {
        throw new Error(
          'Payment setup incomplete — no access code returned. Please try again or contact support.'
        );
      }
    } catch (err) {
      setIsContinuing(false);
      toast.error(
        err instanceof Error ? err.message : 'Payment setup failed. Please try again.'
      );
      return;
    }

    setIsContinuing(false);

    // 4. Open Paystack popup
    const reference = await pay({
      amount:    cart.total ?? subtotal,
      email:     data.email,
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone,
      accessCode,
      metadata: {
        cart_id:  cart.id,
        address:  selectedAddress.address_1  ?? '',
        city:     selectedAddress.city        ?? '',
        state:    selectedAddress.province    ?? '',
      },
    });

    if (!reference) return; // user cancelled

    // 5. Complete the cart — poll up to 20 s if webhook hasn't arrived yet
    try {
      let result = await completeCart(cart.id);

      if (result.type !== 'order') {
        let authorized = false;
        const deadline = Date.now() + 20000;
        while (Date.now() < deadline) {
          const status = await getCartPaymentSessionStatus(cart.id);
          if (status === 'authorized') { authorized = true; break; }
          await new Promise((r) => setTimeout(r, 2500));
        }
        if (authorized) result = await completeCart(cart.id);
      }

      if (result.type !== 'order') {
        toast.error(
          `Payment received but order could not be confirmed. Your ref is ${reference} — email support@raphamel.com`
        );
        return;
      }

      clearCart();
      toast.success('Payment confirmed! Your order is being processed.');
      router.push(`/order-confirmation?ref=${reference}`);
    } catch {
      toast.error(
        `Order confirmation failed. Your payment ref is ${reference} — email support@raphamel.com`
      );
    }
  }

  // ── Approval guard ────────────────────────────────────────────────────────────

  if (!meLoading && me && me.verificationStatus !== 'approved') {
    return (
      <div className="container py-20 max-w-lg mx-auto text-center">
        <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8">
          {me.verificationStatus === 'rejected' ? (
            <>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 mb-4">
                <ShieldCheck className="h-7 w-7 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Account not approved</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your account application was not approved. You cannot place orders until this is resolved.
              </p>
              <Button variant="primary" asChild>
                <Link href="/account">View account status</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-50 mb-4">
                <ShieldCheck className="h-7 w-7 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Account under review</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your account is being reviewed by our team. You will be able to place orders once approved — usually within 1–2 business days.
              </p>
              <Button variant="primary" asChild>
                <Link href="/account">View account status</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Facility guard ────────────────────────────────────────────────────────────

  if (!meLoading && me && !facilityLoading && facility === null) {
    return <CompleteFacilityGate />;
  }

  // ── Empty cart guard ──────────────────────────────────────────────────────────

  if (!cartLoading && items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Button variant="primary" asChild>
          <Link href="/products">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

          {/* ── Left column ──────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">
            <form onSubmit={handleSubmit(onContinue)}>

              {/* Contact information */}
              <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
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

              {/* Shipping address — read-only, picker when multiple */}
              <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Shipping Address</h2>
                  {hasAddress && (
                    addresses.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => setPickerOpen(true)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Edit
                      </button>
                    ) : (
                      <Link
                        href="/account/addresses"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    )
                  )}
                </div>

                {hasAddress ? (
                  <div className="flex gap-3 p-4 bg-gray-50 rounded-[8px]">
                    <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700 space-y-0.5">
                      <p className="font-medium">
                        {selectedAddress!.first_name} {selectedAddress!.last_name}
                      </p>
                      {selectedAddress!.address_1 && (
                        <p className="text-gray-500">{selectedAddress!.address_1}</p>
                      )}
                      {(selectedAddress!.city || selectedAddress!.province) && (
                        <p className="text-gray-500">
                          {[selectedAddress!.city, selectedAddress!.province].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-[8px]">
                    <MapPin size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">No shipping address saved</p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Add a shipping address in your{' '}
                        <Link href="/account/addresses" className="underline font-semibold">
                          account settings
                        </Link>{' '}
                        to continue.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Address picker modal — shown when user has multiple addresses */}
              <Modal
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                title="Select Shipping Address"
                size="md"
              >
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => { setSelectedAddress(addr); setPickerOpen(false); }}
                        className={`w-full text-left flex items-start gap-3 p-4 rounded-[8px] border-2 transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <MapPin size={15} className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                        <div className="flex-1 text-sm text-gray-700 space-y-0.5">
                          <p className="font-semibold text-gray-900">
                            {addr.first_name} {addr.last_name}
                          </p>
                          {addr.address_1 && <p className="text-gray-500">{addr.address_1}</p>}
                          {(addr.city || addr.province) && (
                            <p className="text-gray-500">
                              {[addr.city, addr.province].filter(Boolean).join(', ')}
                            </p>
                          )}
                          {addr.is_default_shipping && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary mt-1">
                              Default
                            </span>
                          )}
                        </div>
                        {isSelected && <Check size={15} className="flex-shrink-0 text-primary mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </Modal>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isContinuing || isPaying}
                disabled={!hasAddress || isContinuing || isPaying}
              >
                {isContinuing
                  ? 'Setting up payment…'
                  : isPaying
                  ? 'Awaiting payment…'
                  : 'Continue to Payment'}
              </Button>

              <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mt-3">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-green-500" />
                  SSL encrypted
                </span>
                <span className="text-gray-300">·</span>
                <span>Powered by <span className="font-semibold text-gray-600">Paystack</span></span>
              </div>
            </form>
          </div>

          {/* ── Order summary sidebar ─────────────────────────────────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0 order-first lg:order-last">
            {(!mounted || cartLoading) ? (
              <div className="bg-white rounded-[12px] border border-gray-100 p-5 h-48 animate-pulse" />
            ) : (
              <OrderSummary
                items={items as Parameters<typeof OrderSummary>[0]['items']}
                subtotal={subtotal}
                shippingTotal={shippingTotal}
                shippingLabel={shippingMethodName}
                taxTotal={taxTotal}
                total={cartTotal}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
