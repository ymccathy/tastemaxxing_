export function StarRating({ rating, max = 5, size = "sm" }: { rating: number; max?: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  return (
    <span className={`${sizes[size]} tracking-tight`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? "#FF746C" : "#3f3f3f" }}>
          ★
        </span>
      ))}
    </span>
  );
}
