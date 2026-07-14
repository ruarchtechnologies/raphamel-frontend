'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronRight, ChevronLeft, Truck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PaystackPayment } from '@/components/checkout/PaystackPayment';
import { usePaystackSession } from '@/features/checkout/hooks/use-paystack-session';
import { useCart, useClearCart } from '@/features/cart/hooks/useCart';
import { useMe } from '@/features/auth/hooks/useAuth';
import {
  updateCartAddress,
  listShippingOptions,
  addShippingMethod,
  initializePaymentSession,
  getCartPaymentSessionStatus,
  completeCart,
} from '@/data/api/cart.api';
import { formatPrice } from '@/lib/utils';

// ── Form schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  email:     z.string().email('Invalid email'),
  phone:     z.string().min(10, 'Valid phone required'),
  address:   z.string().min(5, 'Address required'),
  city:      z.string().min(1, 'City required'),
  state:     z.string().min(1, 'Select a state'),
});

type FormData = z.infer<typeof schema>;

const STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface ShippingOption {
  id: string;
  name?: string;
  amount?: number;
  price_type?: string;
}

type CheckoutStep = 'shipping' | 'payment';

// ── Order summary sidebar ─────────────────────────────────────────────────────

function OrderSummary({
  items,
  subtotal,
  shippingTotal,
  taxTotal,
  total,
}: {
  items: { id: string; title?: string; subtitle?: string; thumbnail?: string; quantity: number; unit_price?: number; subtotal?: number }[];
  subtotal: number;
  shippingTotal: number;
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
          <span>Shipping</span>
          <span className={shippingTotal === 0 ? 'text-gray-400 font-normal italic' : 'font-medium'}>
            {shippingTotal === 0 ? 'Calculated at checkout' : formatPrice(shippingTotal)}
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
  const { data: cart, isLoading: cartLoading } = useCart();
  const clearCart = useClearCart();
  const { pay, isPaying } = usePaystackSession();

  const [mounted, setMounted]                     = useState(false);
  const [step, setStep]                           = useState<CheckoutStep>('shipping');
  const [shippingOptions, setShippingOptions]     = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping]   = useState<string>('');
  const [isContinuing, setIsContinuing]           = useState(false);
  const [isInitializing, setIsInitializing]       = useState(false);
  const [savedFormData, setSavedFormData]         = useState<FormData | null>(null);
  const [addressMode, setAddressMode]             = useState<'saved' | 'new'>('saved');

  const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormData>({
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

  useEffect(() => {
    if (addressMode !== 'saved' || !me?.defaultAddress) return;
    const addr = me.defaultAddress;
    if (addr.address1) setValue('address', addr.address1);
    if (addr.city)     setValue('city',    addr.city);
    if (addr.province) setValue('state',   addr.province);
  }, [addressMode, me?.defaultAddress, setValue]);

  const items        = cart?.items ?? [];
  const subtotal     = items.reduce((sum, i) => sum + ((i as { unit_price?: number }).unit_price ?? 0) * i.quantity, 0);
  const shippingTotal = (cart as { shipping_total?: number })?.shipping_total ?? 0;
  const taxTotal     = (cart as { tax_total?: number })?.tax_total ?? 0;
  const cartTotal    = subtotal + shippingTotal + taxTotal;

  // ── Step 1: validate shipping form → update Medusa cart → fetch shipping options ──

  async function onContinue(data: FormData) {
    if (!cart) return;
    setIsContinuing(true);

    try {
      await updateCartAddress(cart.id, data.email, {
        first_name:   data.firstName,
        last_name:    data.lastName,
        address_1:    data.address,
        city:         data.city,
        province:     data.state,
        country_code: 'ng',
        phone:        data.phone,
      });
    } catch {
      toast.error('Could not save shipping details. Please try again.');
      setIsContinuing(false);
      return;
    }

    try {
      const options = await listShippingOptions(cart.id);
      setShippingOptions(options as ShippingOption[]);
      if (options.length > 0) setSelectedShipping((options[0] as ShippingOption).id);
    } catch {
      // Shipping options not configured — skipping
    }

    setSavedFormData(data);
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsContinuing(false);
  }

  // ── Step 2: add shipping method → Paystack popup → complete cart ──────────────

  async function onPlaceOrder() {
    if (!cart || !savedFormData) return;
    setIsInitializing(true);

    // 1. Add shipping method (optional — may not be configured)
    if (selectedShipping) {
      try {
        await addShippingMethod(cart.id, selectedShipping);
      } catch {
        // Shipping method not configured in backend — proceeding
      }
    }

    // 2. Initialize a Medusa payment session BEFORE opening Paystack.
    //    The Paystack plugin creates a transaction and returns an access_code.
    //    We must use that access_code to open the popup so Medusa's
    //    authorizePayment can verify the same reference after cart.complete().
    let accessCode: string | null = null;
    try {
      console.log('[checkout] initializing payment session for cart:', cart.id);
      const session = await initializePaymentSession(cart.id);
      accessCode = session.accessCode;
      console.log('[checkout] accessCode:', accessCode, '| authorizationUrl:', session.authorizationUrl);
      if (!accessCode) {
        throw new Error(
          'Payment setup incomplete — no access code was returned by the payment provider. ' +
          'Please try again or contact support.'
        );
      }
    } catch (err) {
      console.error('[checkout] initializePaymentSession failed:', err);
      setIsInitializing(false);
      toast.error(
        err instanceof Error
          ? err.message
          : 'Payment setup failed. Please try again.'
      );
      return;
    }

    setIsInitializing(false);
    // 3. Open Paystack popup using the access_code from the Medusa session
    console.log('[checkout] opening Paystack popup with accessCode:', accessCode);
    const reference = await pay({
      amount:    cart.total ?? subtotal,
      email:     savedFormData.email,
      firstName: savedFormData.firstName,
      lastName:  savedFormData.lastName,
      phone:     savedFormData.phone,
      accessCode,
      metadata: {
        cart_id: cart.id,
        address: savedFormData.address,
        city:    savedFormData.city,
        state:   savedFormData.state,
      },
    });

    console.log('[checkout] Paystack closed — reference:', reference);
    if (!reference) return; // user cancelled or popup closed

    // 4. Complete the cart. Medusa calls authorizePayment internally which may verify
    //    the transaction directly via Paystack's API. If the plugin is webhook-first
    //    and the session is still requires_more, we poll until the webhook arrives, then retry.
    try {
      let result = await completeCart(cart.id);
      console.log('[checkout] completeCart result:', JSON.stringify(result, null, 2));

      if (result.type !== 'order') {
        // Webhook hasn't arrived yet — poll for session to become authorized, then retry once.
        let authorized = false;
        const deadline = Date.now() + 20000; // wait up to 20 s
        while (Date.now() < deadline) {
          const status = await getCartPaymentSessionStatus(cart.id);
          console.log('[checkout] payment session status:', status);
          if (status === 'authorized') { authorized = true; break; }
          await new Promise((r) => setTimeout(r, 2500));
        }

        if (authorized) {
          result = await completeCart(cart.id);
          console.log('[checkout] completeCart (post-auth) result:', JSON.stringify(result, null, 2));
        }
      }

      if (result.type !== 'order') {
        console.error('[checkout] order confirmation failed:', result);
        toast.error(
          `Payment received but order could not be confirmed. ` +
          `Your ref is ${reference} — email support@raphamel.health`
        );
        return;
      }

      // 5. Clear cart + navigate to confirmation
      clearCart();
      toast.success('Payment confirmed! Your order is being processed.');
      router.push(`/order-confirmation?ref=${reference}`);
    } catch (err) {
      console.error('[checkout] error completing cart:', err);
      toast.error(
        `Order confirmation failed. ` +
        `Your payment ref is ${reference} — email support@raphamel.health`
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

            {/* ── STEP 1: Shipping form ──────────────────────────────────────── */}
            {step === 'shipping' && (
              <form onSubmit={handleSubmit(onContinue)}>
                {/* Contact */}
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

                {/* Shipping address */}
                <div className="bg-white rounded-[12px] border border-gray-100 p-6 mb-6">
                  <h2 className="text-base font-bold text-gray-900 mb-5">Shipping Address</h2>

                  {/* Saved vs new address toggle — only shown when a default address exists */}
                  {me?.defaultAddress && (
                    <div className="space-y-2 mb-5">
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-[8px] cursor-pointer transition-colors ${addressMode === 'saved' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="addressMode"
                          value="saved"
                          checked={addressMode === 'saved'}
                          onChange={() => setAddressMode('saved')}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium text-gray-800">Use saved address</span>
                      </label>
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-[8px] cursor-pointer transition-colors ${addressMode === 'new' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="addressMode"
                          value="new"
                          checked={addressMode === 'new'}
                          onChange={() => setAddressMode('new')}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium text-gray-800">Add a new address</span>
                      </label>
                    </div>
                  )}

                  {/* Saved address preview */}
                  {me?.defaultAddress && addressMode === 'saved' && (
                    <div className="p-4 bg-gray-50 rounded-[8px] text-sm text-gray-700 space-y-0.5">
                      <p className="font-medium">{me.defaultAddress.firstName} {me.defaultAddress.lastName}</p>
                      {me.defaultAddress.address1 && <p className="text-gray-500">{me.defaultAddress.address1}</p>}
                      {(me.defaultAddress.city || me.defaultAddress.province) && (
                        <p className="text-gray-500">
                          {[me.defaultAddress.city, me.defaultAddress.province].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Address form fields — visible when no saved address or user chose new */}
                  <div className={me?.defaultAddress && addressMode === 'saved' ? 'hidden' : 'space-y-4 mt-4'}>
                    <Input label="Street Address" error={errors.address?.message} {...register('address')} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" error={errors.city?.message} {...register('city')} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                        <select className="input-base" {...register('state')}>
                          <option value="">Select state</option>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && (
                          <p className="mt-1 text-xs text-rose-600">{errors.state.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isContinuing}
                  rightIcon={<ChevronRight size={16} />}
                >
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* ── STEP 2: Shipping options + Payment ────────────────────────── */}
            {step === 'payment' && savedFormData && (
              <div className="space-y-6">
                {/* Address summary */}
                <div className="bg-white rounded-[12px] border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900">Shipping To</h2>
                    <button
                      onClick={() => setStep('shipping')}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ChevronLeft size={14} /> Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {savedFormData.firstName} {savedFormData.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {savedFormData.address}, {savedFormData.city}, {savedFormData.state}
                  </p>
                  <p className="text-sm text-gray-500">{savedFormData.email} · {savedFormData.phone}</p>
                </div>

                {/* Shipping options */}
                {shippingOptions.length > 0 && (
                  <div className="bg-white rounded-[12px] border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Shipping Method</h2>
                    <div className="space-y-3">
                      {shippingOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-4 p-4 border-2 rounded-[8px] cursor-pointer transition-colors ${
                            selectedShipping === opt.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={selectedShipping === opt.id}
                            onChange={() => setSelectedShipping(opt.id)}
                            className="accent-primary"
                          />
                          <Truck size={16} className="text-gray-400 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {opt.name ?? 'Standard Delivery'}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {opt.amount != null && opt.amount > 0
                              ? formatPrice(opt.amount)
                              : 'Free'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment */}
                <div className="bg-white rounded-[12px] border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4">Payment</h2>
                  <PaystackPayment amount={cartTotal} />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isInitializing || isPaying}
                  disabled={isInitializing || isPaying || (shippingOptions.length > 0 && !selectedShipping)}
                  onClick={onPlaceOrder}
                >
                  {isInitializing
                    ? 'Setting up payment…'
                    : isPaying
                    ? 'Awaiting payment…'
                    : `Place Order & Pay ${formatPrice(cartTotal)}`}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={14} className="text-green-500" />
                  256-bit SSL encrypted checkout
                </div>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ─────────────────────────────────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            {(!mounted || cartLoading) ? (
              <div className="bg-white rounded-[12px] border border-gray-100 p-5 h-48 animate-pulse" />
            ) : (
              <OrderSummary
                items={items as Parameters<typeof OrderSummary>[0]['items']}
                subtotal={subtotal}
                shippingTotal={shippingTotal}
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
