import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold">
          Marketplace
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>

          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Products
          </Link>
        </nav>
      </div>
    </header>
  );
}
