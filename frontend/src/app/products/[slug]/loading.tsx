export default function ProductDetailLoading() {
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

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border shadow-sm">
          {/* Gallery placeholder */}
          <div className="space-y-4">
            <div className="aspect-square w-full skeleton rounded-xl" />
            <div className="flex gap-2">
              <div className="h-16 w-16 skeleton rounded-lg" />
              <div className="h-16 w-16 skeleton rounded-lg" />
              <div className="h-16 w-16 skeleton rounded-lg" />
            </div>
          </div>

          {/* Details placeholder */}
          <div className="space-y-4">
            <div className="h-4 w-32 skeleton rounded-md" />
            <div className="h-8 w-3/4 skeleton rounded-lg" />
            <div className="h-6 w-24 skeleton rounded-md" />
            <div className="h-10 w-40 skeleton rounded-lg" />
            <div className="h-24 w-full skeleton rounded-lg" />
            <div className="flex gap-4">
              <div className="h-12 flex-1 skeleton rounded-xl" />
              <div className="h-12 w-12 skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
