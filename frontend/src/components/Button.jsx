const variants = {
  dark: "bg-[#293c33] text-white hover:bg-[#405a4b]",
  light: "border border-[#293c33] text-[#293c33] hover:bg-[#293c33] hover:text-white",
  soft: "bg-[#eff0e9] text-[#293c33] hover:bg-[#e4e8df]",
  danger: "bg-[#a84d42] text-white hover:bg-[#913e35]",
};

export default function Button({
  children,
  variant = "dark",
  className = "",
  ...props
}) {
  const variantClass = variants[variant] || variants.dark;

  return (
    <button
      className={`
        inline-flex
        min-h-11
        items-center
        justify-center
        gap-2
        rounded-sm
        px-5
        py-2.5
        text-xs
        font-semibold
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
