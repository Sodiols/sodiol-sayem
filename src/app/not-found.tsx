import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] text-slate-950 flex items-center justify-center px-6">
      <section className="max-w-xl text-center space-y-5">
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">404</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Page not found</h1>
        <p className="text-slate-600 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex bg-black text-white px-6 py-3 font-medium hover:bg-zinc-800 transition-colors"
        >
          Back to portfolio
        </Link>
      </section>
    </main>
  );
}
