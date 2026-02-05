export function AnimatedGradientOrbs() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Orb 1 - Mustard */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 motion-safe:animate-pulse"
        style={{
          background:
            "radial-gradient(circle, #ECCB45 0%, transparent 70%)",
        }}
      />

      {/* Orb 2 - Cream */}
      <div
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 motion-safe:animate-pulse"
        style={{
          background: "radial-gradient(circle, #FFFCF2 0%, transparent 70%)",
        }}
      />

      {/* Orb 3 - Mustard accent */}
      <div
        className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-15 motion-safe:animate-pulse"
        style={{
          background:
            "radial-gradient(circle, #ECCB45 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
