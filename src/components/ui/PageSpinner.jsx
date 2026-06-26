// src/components/ui/PageSpinner.jsx
// Full-page loading spinner used as the Suspense fallback for lazy-loaded routes.

export default function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated ring */}
        <div
          className="w-10 h-10 rounded-full border-[3px] animate-spin"
          style={{
            borderColor: 'var(--color-outline-variant)',
            borderTopColor: 'var(--color-primary)',
          }}
        />
        <span
          className="text-sm tracking-wide"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Loading…
        </span>
      </div>
    </div>
  );
}
