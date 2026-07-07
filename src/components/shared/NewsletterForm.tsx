'use client';

/**
 * NewsletterForm — thin Client Component for the shop page trust strip.
 * Handles form submission. Keeps the parent page as a Server Component.
 */
export function NewsletterForm() {
  return (
    <form
      className="flex gap-2 max-w-md"
      aria-label="Newsletter signup"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire to Resend API route
      }}
    >
      <input
        type="email"
        required
        placeholder="EMAIL ADDRESS"
        aria-label="Your email address"
        className="flex-grow bg-[#1e1f23] border border-[#594045]/30 text-[#e3e2e7] px-6 py-4 font-body text-label-bold text-xs tracking-widest uppercase focus:ring-2 focus:ring-[#c41e5c] focus:outline-none placeholder:text-[#e1bec3]/50"
      />
      <button
        type="submit"
        className="bg-[#c41e5c] text-white px-8 py-4 font-body text-label-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all active:scale-95"
      >
        JOIN
      </button>
    </form>
  );
}
