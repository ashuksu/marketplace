export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto flex h-16 w-full max-w-6xl items-center justify-center px-6">
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Marketplace</p>
      </div>
    </footer>
  );
}
