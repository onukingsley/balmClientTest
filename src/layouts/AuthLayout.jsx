import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-nude-50 to-nude-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-nude-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-nude-300/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-serif font-semibold text-nude-800">Next of</span>
            <span className="text-3xl font-serif font-light text-nude-500">Skin</span>
          </Link>
          <p className="text-nude-500 mt-2">Premium Skincare Collection</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-nude-200 p-8">
          <Outlet />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-nude-600 hover:text-nude-800 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
