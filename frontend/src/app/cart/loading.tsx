export default function CartLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="h-16 border-b bg-white px-4 flex items-center justify-between">
        <div className="h-8 w-36 skeleton rounded-md" />
        <div className="hidden md:block h-9 w-96 skeleton rounded-md" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 skeleton rounded-md" />
          <div className="h-9 w-9 skeleton rounded-md" />
        </div>
      </div>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="h-8 w-48 skeleton rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 skeleton rounded-xl" />
            ))}
          </div>
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </main>
    </div>
  );
}
