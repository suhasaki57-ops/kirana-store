export default function CategoriesLoading() {
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
        <div className="mb-6 space-y-2">
          <div className="h-8 w-56 skeleton rounded-lg" />
          <div className="h-4 w-80 skeleton rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 skeleton rounded-2xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
