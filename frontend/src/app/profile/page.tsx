'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { User, MapPin, Lock, Plus, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

const passwordSchema = z.object({
  current: z.string().min(6, 'Minimum 6 characters'),
  newPass: z.string().min(8, 'Minimum 8 characters'),
  confirm: z.string(),
}).refine(d => d.newPass === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

const addressSchema = z.object({
  label: z.string().min(1, 'Label required'),
  name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  line1: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
});

type ProfileData  = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;
type AddressData  = z.infer<typeof addressSchema>;

interface Address extends AddressData { id: string; isDefault: boolean; }

const INIT_ADDRESSES: Address[] = [
  { id:'1', label:'Home', name:'Ramesh Kumar', phone:'9876543210', line1:'42, Gandhi Nagar Colony', city:'Mumbai', state:'Maharashtra', pincode:'400001', isDefault:true },
  { id:'2', label:'Office', name:'Ramesh Kumar', phone:'9876543210', line1:'Floor 3, TechPark Building, Andheri East', city:'Mumbai', state:'Maharashtra', pincode:'400069', isDefault:false },
];

type Tab = 'profile' | 'password' | 'addresses';

export default function ProfilePage() {
  const [tab, setTab]                 = useState<Tab>('profile');
  const [addresses, setAddresses]     = useState<Address[]>(INIT_ADDRESSES);
  const [addingAddr, setAddingAddr]   = useState(false);

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: 'Ramesh Kumar', phone: '9876543210' },
  });

  const pwForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const addrForm = useForm<AddressData>({ resolver: zodResolver(addressSchema) });

  const saveProfile = (data: ProfileData) => {
    toast.success('Profile updated successfully');
    console.log(data);
  };

  const changePassword = () => {
    toast.success('Password changed successfully');
    pwForm.reset();
  };

  const addAddress = (data: AddressData) => {
    const newAddr: Address = { ...data, id: Date.now().toString(), isDefault: false };
    setAddresses(p => [...p, newAddr]);
    setAddingAddr(false);
    addrForm.reset();
    toast.success('Address added successfully');
  };

  const deleteAddress = (id: string) => {
    setAddresses(p => p.filter(a => a.id !== id));
    toast.success('Address removed');
  };

  const setDefault = (id: string) => {
    setAddresses(p => p.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated');
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile',   label: 'My Profile',  icon: User    },
    { id: 'password',  label: 'Change Password', icon: Lock },
    { id: 'addresses', label: 'My Addresses', icon: MapPin  },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-4xl py-8">
        <h1 className="mb-6 text-2xl font-bold">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <aside className="md:col-span-1">
            <div className="rounded-xl border bg-white p-2 shadow-sm space-y-1">
              <div className="flex flex-col items-center py-4 border-b mb-2">
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
                  R
                </div>
                <p className="mt-2 font-semibold text-sm">Ramesh Kumar</p>
                <p className="text-xs text-muted-foreground">user@test.com</p>
              </div>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors ${tab === t.id ? 'bg-green-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <t.icon className="h-4 w-4 shrink-0" />
                  {t.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Profile */}
            {tab === 'profile' && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-5">Edit Profile</h2>
                <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input {...profileForm.register('name')}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                    {profileForm.formState.errors.name && (
                      <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <input value="user@test.com" disabled
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 text-muted-foreground cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <input {...profileForm.register('phone')}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                    {profileForm.formState.errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <button type="submit"
                    className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Password */}
            {tab === 'password' && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-5">Change Password</h2>
                <form onSubmit={pwForm.handleSubmit(changePassword)} className="space-y-4">
                  {(['current','newPass','confirm'] as const).map((field, idx) => (
                    <div key={field}>
                      <label className="text-sm font-medium">
                        {idx === 0 ? 'Current Password' : idx === 1 ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <input type="password" {...pwForm.register(field)}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                      {pwForm.formState.errors[field] && (
                        <p className="text-xs text-red-500 mt-1">{pwForm.formState.errors[field]?.message}</p>
                      )}
                    </div>
                  ))}
                  <button type="submit"
                    className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* Addresses */}
            {tab === 'addresses' && (
              <div className="space-y-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wide bg-gray-100 rounded px-2 py-0.5">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                              <CheckCircle className="h-3.5 w-3.5" /> Default
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-sm">{addr.name} | {addr.phone}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{addr.line1}, {addr.city} - {addr.pincode}, {addr.state}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!addr.isDefault && (
                          <button onClick={() => setDefault(addr.id)}
                            className="text-xs text-green-700 border border-green-300 rounded px-2 py-1 hover:bg-green-50">
                            Set Default
                          </button>
                        )}
                        <button onClick={() => deleteAddress(addr.id)}
                          className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {addingAddr ? (
                  <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <h3 className="font-semibold mb-4">Add New Address</h3>
                    <form onSubmit={addrForm.handleSubmit(addAddress)} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium">Label (Home/Office)</label>
                          <input {...addrForm.register('label')}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Home" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Full Name</label>
                          <input {...addrForm.register('name')}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Phone</label>
                          <input {...addrForm.register('phone')}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Pincode</label>
                          <input {...addrForm.register('pincode')}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Address Line</label>
                        <input {...addrForm.register('line1')}
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium">City</label>
                          <input {...addrForm.register('city')}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">State</label>
                          <input {...addrForm.register('state')}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit"
                          className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700">
                          Save Address
                        </button>
                        <button type="button" onClick={() => { setAddingAddr(false); addrForm.reset(); }}
                          className="flex-1 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button onClick={() => setAddingAddr(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-green-300 py-4 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors">
                    <Plus className="h-4 w-4" /> Add New Address
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
