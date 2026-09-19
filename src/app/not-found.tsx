import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/button';

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-16 py-32">
      <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <div className="container mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-muted-foreground text-xl font-bold">404</p>

          <h1 className="mt-2 text-3xl font-semibold">Product not found</h1>

          <p className="text-muted-foreground mt-3 max-w-md">
            The product you are looking for does not exist.
          </p>

          <Link href="/" className={buttonVariants({ className: 'mt-6' })}>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
