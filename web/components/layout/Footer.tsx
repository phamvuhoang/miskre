export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <div className="space-y-1 text-zinc-600">
              <div>Size Chart</div>
              <div>Shipping & Returns</div>
              <div>Contact Us</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Policies</h3>
            <div className="space-y-1 text-zinc-600">
              <div>Return Policy</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <div className="space-y-1 text-zinc-600">
              <div>Instagram</div>
              <div>YouTube</div>
              <div>Email Updates</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-500">
          © 2025 MISKRE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
