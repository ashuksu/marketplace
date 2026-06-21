import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/button';

export function HomeHero() {
  return (
    <section>
      <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium">Marketplace</p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Find products from independent sellers.
            </h1>

            <p className="text-muted-foreground text-lg">
              Browse products, compare options and find what you need.
            </p>
          </div>

          <Link href="/products" className={buttonVariants()}>
            Browse products
          </Link>
        </div>
      </div>
    </section>
  );
}
