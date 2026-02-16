export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 md:py-8">
      <div className="flex flex-col items-center gap-3 md:gap-6 py-4 px-4">
        <div className="w-full max-w-2xl">
          <div className="h-8 w-56 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
          <div className="h-4 w-80 bg-gray-100 rounded mx-auto mb-4" />
          <div className="w-full bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="h-64 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
