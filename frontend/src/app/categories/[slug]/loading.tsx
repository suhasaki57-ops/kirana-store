export default function CategoryDetailLoading() {
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

      <main className="flex-1">
        {/* Banner skeleton */}
        <div className="h-44 w-full skeleton rounded-none mb-6" />

        <div className="container max-w-6xl mx-auto px-4 py-4 space-y-4">
          <div className="h-14 skeleton rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
