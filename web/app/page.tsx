import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">MISKRЕ</div>
          <nav className="flex items-center space-x-6">
            <Link href="#features" className="text-sm hover:text-zinc-600">Features</Link>
            <Link href="#how-it-works" className="text-sm hover:text-zinc-600">How It Works</Link>
            <Link href="/admin/new-seller" className="text-sm hover:text-zinc-600">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-red-50/30"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              72-Hour Store Launch • Zero Upfront Cost
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-zinc-900 animate-slide-up">
              Your Fight Store,
              <br />
              <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Zero Hassle
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              MISKRЕ builds and operates lightweight e-commerce stores for fighters, coaches, and gyms.
              Sell branded gear with zero upfront costs. We handle everything—you just promote.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/admin/new-seller">
                <Button size="lg" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                  Launch Your Store
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 hover:bg-zinc-50 transition-all duration-200">
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-zinc-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div>
                <div className="text-3xl font-bold text-zinc-900">72hrs</div>
                <div className="text-sm text-zinc-600">Launch Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-zinc-900">$0</div>
                <div className="text-sm text-zinc-600">Upfront Cost</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-zinc-900">30%</div>
                <div className="text-sm text-zinc-600">Your Share</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Fighters</h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Everything you need to sell premium gear to your community, without the complexity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group border-0 shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">72-Hour Launch</h3>
              <p className="text-zinc-600 leading-relaxed">From intake to live store in just 3 days. We handle design, setup, and product creation.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group border-0 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">Zero Upfront Cost</h3>
              <p className="text-zinc-600 leading-relaxed">No setup fees, no inventory costs. Earn 30% on every sale with monthly payouts.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group border-0 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">Full Service</h3>
              <p className="text-zinc-600 leading-relaxed">We handle production, fulfillment, customer support, and returns. You focus on fighting.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group border-0 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">Your Brand</h3>
              <p className="text-zinc-600 leading-relaxed">Custom domain, your logo, your colors. Professional stores that reflect your fighting spirit.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group border-0 shadow-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 4 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">Real-Time Dashboard</h3>
              <p className="text-zinc-600 leading-relaxed">Track sales, orders, and payouts in real-time. Download monthly statements and promotional assets.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group border-0 shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">Community Focused</h3>
              <p className="text-zinc-600 leading-relaxed">Built for fighters, coaches, and gyms. Premium gear that your community actually wants to wear.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              From application to earning in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">Apply</h3>
              <p className="text-zinc-600 leading-relaxed">
                Fill out our 10-minute intake form with your name, logo, colors, and brand phrases.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-transparent -translate-x-8"></div>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">We Build</h3>
              <p className="text-zinc-600 leading-relaxed">
                Our team creates 5-8 premium SKUs and launches your store in 72 hours.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-transparent -translate-x-8"></div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900">You Earn</h3>
              <p className="text-zinc-600 leading-relaxed">
                Promote your store and earn 30% on every sale. Monthly payouts, zero hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Launch Your Store?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
              Join fighters, coaches, and gyms already earning with MISKRЕ. Zero upfront cost, maximum impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/admin/new-seller">
                <Button size="lg" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                  Get Started Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-zinc-900 transition-all duration-200">
                Schedule a Call
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-zinc-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No setup fees
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                72-hour launch
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                30% commission
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">MISKRЕ</div>
              <p className="text-zinc-600 text-sm">
                Built for fighters, coaches, and their communities. Premium gear, zero hassle.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/admin/new-seller" className="hover:text-zinc-900">Get Started</Link></li>
                <li><Link href="#features" className="hover:text-zinc-900">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-zinc-900">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="#" className="hover:text-zinc-900">Help Center</Link></li>
                <li><Link href="#" className="hover:text-zinc-900">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-zinc-900">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="#" className="hover:text-zinc-900">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-zinc-900">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-zinc-900">Returns</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-200 mt-8 pt-8 text-center text-sm text-zinc-600">
            © 2024 MISKRЕ. Built for fighters, coaches, and their communities.
          </div>
        </div>
      </footer>
    </div>
  );
}

