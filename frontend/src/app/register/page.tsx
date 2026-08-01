'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Eye, EyeOff, Store, ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number is mandatory (min 10 digits)'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      let userRole = role === 'seller' ? 'admin' : 'user';
      let user = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: userRole,
      };
      let token = 'mock-jwt-token';
      let refreshToken = 'mock-refresh-token';

      try {
        const response = await api.post('/auth/register', { ...data, role: userRole });
        if (response.data?.data?.user) {
          user = response.data.data.user;
          token = response.data.data.token;
          refreshToken = response.data.data.refreshToken;
        }
      } catch {
        // Fallback for mock mode
      }

      dispatch(setCredentials({ user, token, refreshToken }));
      toast.success(`Account created as ${role === 'seller' ? 'Seller' : 'Buyer'}!`);

      if (role === 'seller' || userRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 py-12 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Select account type and sign up to get started
          </p>
        </div>

        {/* Buyer vs Seller Option Selector */}
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              role === 'buyer'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              role === 'seller'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Store className="h-4 w-4" />
            Seller
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-xl border bg-background px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address *</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-xl border bg-background px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500 font-bold">(Mandatory) *</span>
            </label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="tel"
                {...register('phone')}
                className="w-full rounded-xl border bg-background px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+91 98765 43210"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full rounded-xl border bg-background px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-md hover:bg-green-700 disabled:opacity-50 transition-all active:scale-98"
          >
            {isLoading ? 'Creating account...' : `Create Account as ${role === 'seller' ? 'Seller' : 'Buyer'}`}
          </button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-green-700 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
