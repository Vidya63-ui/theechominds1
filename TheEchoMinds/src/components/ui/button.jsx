import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({ className, variant = "default", type = "button", ...props }) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-white text-black hover:bg-white/90",
    outline: "border border-zinc-700 text-white hover:bg-white/10",
  };

  return (
    <button
      type={type}
      className={cn(base, "rounded-md px-4 py-2", variants[variant] ?? variants.default, className)}
      {...props}
    />
  );
}

