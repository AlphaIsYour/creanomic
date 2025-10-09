export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      {/* Minimalist Cover Skeleton */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-white border-b border-gray-200 animate-pulse">
        <div className="absolute top-6 right-6 flex gap-2">
          <div className="w-10 h-10 bg-white/50 rounded-lg" />
          <div className="w-32 h-10 bg-white/50 rounded-lg" />
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Skeleton */}
            <div className="w-32 h-32 rounded-2xl bg-gray-200 flex-shrink-0" />

            {/* User Info Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-48" />
              <div className="flex gap-2">
                <div className="h-7 bg-gray-200 rounded-lg w-24" />
                <div className="h-7 bg-gray-200 rounded-lg w-32" />
              </div>
              <div className="h-16 bg-gray-100 rounded-lg w-full" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto" />
                <div className="h-6 bg-gray-200 rounded w-16 mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="border-b border-gray-200 bg-gray-50/50 p-4 flex gap-4">
            <div className="h-10 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-100 rounded w-32" />
            <div className="h-10 bg-gray-100 rounded w-28" />
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="h-5 bg-gray-200 rounded w-32" />
            <div className="h-24 bg-gray-100 rounded" />
            <div className="h-5 bg-gray-200 rounded w-48" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-7 bg-gray-100 rounded-lg w-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
