'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name:    z.string().min(2, 'Name is required'),
  email:   z.string().email('Enter a valid email'),
  phone:   z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type Form = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = (_data: Form) => {
    setSubmitted(true);
    toast.success('Your message has been sent!');
  };

  const info = [
    { icon: Phone, title: 'Phone', lines: ['+91 98765 43210', 'Mon–Sat, 9am–7pm'] },
    { icon: Mail, title: 'Email', lines: ['support@kiranastore.com', 'We reply within 24 hours'] },
    { icon: MapPin, title: 'Address', lines: ['42 Market Road, Andheri West', 'Mumbai, Maharashtra 400058'] },
    { icon: Clock, title: 'Business Hours', lines: ['Mon–Sat: 9:00am – 7:00pm', 'Sunday: 10:00am – 4:00pm'] },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-green-700 py-10 text-center text-white">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-green-100">We are here to help you with your grocery needs</p>
        </div>

        <div className="container py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Info cards */}
            <div className="space-y-4">
              {info.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex gap-4 rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Icon className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    {lines.map(l => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <h2 className="text-xl font-bold">Message Sent!</h2>
                  <p className="text-muted-foreground">Thank you for reaching out. We will get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-5">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Your Name *</label>
                        <input {...register('name')} placeholder="Ramesh Kumar"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email Address *</label>
                        <input {...register('email')} placeholder="you@example.com"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Phone Number *</label>
                        <input {...register('phone')} placeholder="9876543210"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Subject *</label>
                        <input {...register('subject')} placeholder="Order query, Delivery, etc."
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message *</label>
                      <textarea {...register('message')} rows={5} placeholder="Type your message here..."
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                      {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                    </div>
                    <button type="submit"
                      className="w-full rounded-lg bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors">
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
