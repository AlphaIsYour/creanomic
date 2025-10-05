export const MapSkeleton = () => (
  <div className="animate-pulse h-[500px] lg:h-[calc(100vh-220px)] rounded-lg overflow-hidden bg-gray-200 relative">
    <div
      className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
      style={{ animation: "shimmer 1.5s infinite" }}
    />
  </div>
);
