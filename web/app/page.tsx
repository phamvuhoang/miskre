export default function Home() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">MISKRE</h1>
      <p className="mb-6">Welcome to the MISKRE platform.</p>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/admin/new-seller" className="text-blue-600 hover:underline">Create New Seller</a></li>
            <li><a href="/admin" className="text-blue-600 hover:underline">Admin Panel</a></li>
          </ul>
        </div>
      </div>
    </main>
  );
}

