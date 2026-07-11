import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="min-h-[60vh]">
      <Container className="py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">404</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">Page not found</h1>
          <p className="mt-4 text-ink-muted">
            The page may have moved during the Tiny Bitty revamp. Try the catalogue, bundles, or
            contact page.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-pill bg-brand-green px-5 text-sm font-semibold text-white"
            >
              Back to home
            </Link>
            <Link
              href="/cookies"
              className="inline-flex min-h-11 items-center rounded-pill border border-brand-green px-5 text-sm font-semibold text-brand-green"
            >
              Browse cookies
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-pill border border-brand-green px-5 text-sm font-semibold text-brand-green"
            >
              Contact Tiny Bitty
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
