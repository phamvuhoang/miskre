import Link from 'next/link';

type Props = {
  storeName?: string;
  subdomain?: string;
};

export function Header({ storeName, subdomain }: Props) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={subdomain ? `/${subdomain}` : '/'} className="text-xl font-bold">
          {storeName || 'MISKRE'}
        </Link>
        <nav className="flex space-x-6">
          <Link href={subdomain ? `/${subdomain}` : '/'} className="text-sm hover:text-zinc-600">
            Store
          </Link>
          <Link href="#" className="text-sm hover:text-zinc-600">
            About
          </Link>
          <Link href="#" className="text-sm hover:text-zinc-600">
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}
