export default function Loading() {
  return (
    <div className="py-4 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="h-8 w-56 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
