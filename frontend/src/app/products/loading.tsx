export default function ProductsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header frame */}
      <div className="h-16 border-b bg-white px-4 flex items-center justify-between">
        <div className="h-8 w-36 skeleton rounded-md" />
        <div className="hidden md:block h-9 w-96 skeleton rounded-md" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 skeleton rounded-md" />
          <div className="h-9 w-9 skeleton rounded-md" />
        </div>
      </div>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 space-y-2">
          <div className="h-8 w-64 skeleton rounded-lg" />
          <div className="h-4 w-96 skeleton rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filter sidebar skeleton */}
          <div className="hidden lg:block space-y-4 rounded-xl border bg-white p-4">
            <div className="h-6 w-32 skeleton rounded-md" />
            <div className="h-40 skeleton rounded-lg" />
            <div className="h-24 skeleton rounded-lg" />
          </div>

          {/* Product grid skeleton */}
          <div className="lg:col-span-3 space-y-4">
            <div className="h-12 skeleton rounded-xl" />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 skeleton rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
