import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-nude-100/90 via-nude-50/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 pt-20">
        <div className="max-w-2xl">
          <span className="inline-block text-sm font-medium text-nude-600 tracking-widest uppercase mb-4">
            New Collection 2025
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-medium text-nude-900 leading-tight mb-6">
            Elegance in
            <span className="block text-nude-500">Every Detail</span>
          </h1>
          <p className="text-lg sm:text-xl text-nude-700 mb-8 max-w-lg leading-relaxed">
            Discover our curated collection of timeless pieces designed for the modern minimalist. 
            Crafted with care, styled with purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-nude-500 hover:bg-nude-600 text-white px-8 py-6 text-base font-medium group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-nude-400 text-nude-700 hover:bg-nude-100 hover:border-nude-500 px-8 py-6 text-base font-medium"
            >
              View Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center">
        <span className="text-xs text-nude-600 tracking-widest uppercase mb-2">Scroll</span>
        <div className="w-px h-12 bg-nude-400 animate-pulse" />
      </div>
    </section>
  );
}
