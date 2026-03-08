'use client';

// FLUTTER EQUIV: A StatefulWidget — needs 'use client' because it handles
// user input (onSubmit). The parent Footer stays a Server Component; only
// THIS piece ships JavaScript to the browser.

export function NewsletterForm() {
  return (
    <form
      className="flex gap-2 w-full lg:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email address"
        className="input-base bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-primary h-11 min-w-0 flex-1 lg:w-72"
      />
      <button
        type="submit"
        className="h-11 px-5 bg-primary hover:bg-[#005bb5] text-white text-sm font-semibold rounded-[6px] transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
