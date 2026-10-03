export default function Loader({ label = "Loading your good finds…" }) {
  return (
    <div className="grid min-h-48 place-items-center text-center">
      <div>
        <span
          className="
            mx-auto
            mb-3
            block
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-[#dfe3d8]
            border-t-[#52664f]
          "
          aria-hidden="true"
        />

        <p className="text-xs text-[#777970]">
          {label}
        </p>
      </div>
    </div>
  );
}
