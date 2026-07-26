'use client';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState } from '@/store';
import { saveSettings, StoreSettings } from '@/store/slices/settingsSlice';
import { SupabaseCard } from '@/components/admin/SupabaseCard';
import toast from 'react-hot-toast';
import { Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const dispatch  = useDispatch();
  const current   = useSelector((s: RootState) => s.settings.settings);

  const { register, handleSubmit, formState: { isSubmitting, isDirty } } =
    useForm<StoreSettings>({ defaultValues: current });

  const onSubmit = async (data: StoreSettings) => {
    await new Promise(r => setTimeout(r, 300));
    dispatch(saveSettings(data));
    toast.success('Settings saved and applied!', { icon: '✅' });
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store Settings</h1>
          <p className="text-sm text-muted-foreground">Changes are applied immediately across the store</p>
        </div>
        {isDirty && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Unsaved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Business Info */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            🏪 Business Information
          </h3>
          {[
            { label:'Store Name',    field:'storeName'    as const, placeholder:'Kirana Store' },
            { label:'Email',         field:'storeEmail'   as const, placeholder:'support@kiranastore.com' },
            { label:'Phone',         field:'storePhone'   as const, placeholder:'+91 98765 43210' },
            { label:'Store Address', field:'storeAddress' as const, placeholder:'42 Market Road, Mumbai' },
            { label:'GST Number',    field:'gst'          as const, placeholder:'27AABCU9603R1ZX' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                {...register(field)}
                placeholder={placeholder}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              />
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">🚚 Delivery Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Free Delivery Above (₹)</label>
              <input
                type="number"
                {...register('freeDeliveryAbove', { valueAsNumber: true })}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                {...register('standardDelivery', { valueAsNumber: true })}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            These values affect the delivery charge calculation at checkout in real time.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">💳 Payment Methods</h3>
          <div className="flex items-center gap-3 rounded-xl border-2 border-green-500 bg-green-50 p-4">
            <span className="text-xl">💵</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Cash on Delivery (COD)</p>
              <p className="text-xs text-muted-foreground">Customers pay when order arrives — currently the only payment method</p>
            </div>
            <span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-bold text-white">Active</span>
          </div>
        </div>

        {/* Supabase Database & Cloud Integration */}
        <SupabaseCard />

        {/* Save button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all active:scale-95"
        >
          {isSubmitting ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4" /> Save All Settings</>
          )}
        </button>
      </form>
    </div>
  );
}
