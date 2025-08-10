interface FooterProps {
  seller?: { name?: string; colors?: { primary?: string; secondary?: string } } | null;
}

export function Footer({ seller }: FooterProps = {}) {
  const footerStyle = {
    backgroundColor: 'var(--seller-secondary, #ffffff)',
    borderTopColor: 'rgba(var(--seller-primary-rgb, 17,24,39), 0.12)'
  } as React.CSSProperties;

  const headingStyle = {
    color: 'var(--seller-primary, #111827)'
  } as React.CSSProperties;

  return (
    <footer className="border-t bg-zinc-50 mt-12" style={footerStyle}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2" style={headingStyle}>Support</h3>
            <div className="space-y-1 text-zinc-600">
              <div>Size Chart</div>
              <div>Shipping & Returns</div>
              <div>Contact Us</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={headingStyle}>Policies</h3>
            <div className="space-y-1 text-zinc-600">
              <div>Return Policy</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={headingStyle}>Connect</h3>
            <div className="space-y-1 text-zinc-600">
              <div>Instagram</div>
              <div>YouTube</div>
              <div>Email Updates</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-500">
          {seller?.name ? (
            <>© 2025 {seller.name} • Powered by MISKRЕ</>
          ) : (
            <>© 2025 MISKRЕ. All rights reserved.</>
          )}
        </div>
      </div>
    </footer>
  );
}
