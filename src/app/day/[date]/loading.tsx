export default function Loading() {
  return (
    <div className="py-4 px-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <div className="h-6 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
