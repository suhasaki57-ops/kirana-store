export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header skeleton */}
      <div className="h-16 border-b bg-white px-4 flex items-center justify-between">
        <div className="h-8 w-36 skeleton rounded-md" />
        <div className="hidden md:block h-9 w-96 skeleton rounded-md" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 skeleton rounded-md" />
          <div className="h-9 w-9 skeleton rounded-md" />
        </div>
      </div>

      {/* Main hero / section skeleton */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="h-64 w-full skeleton rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 skeleton rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
