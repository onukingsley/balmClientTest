import { ShoppingBag, Star, Heart } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FeaturedProducts() {
  const { addToCart } = useCart();

  return (
    <section id="products" className="py-20 lg:py-32 bg-nude-50">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
            Our Selection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3 mb-4">
            Featured Products
          </h2>
          <p className="text-nude-600 max-w-2xl mx-auto text-lg">
            Handpicked pieces that embody our commitment to quality, sustainability, and timeless style.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-nude-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-nude-500 text-white text-xs">New</Badge>
                  )}
                  {product.isSale && (
                    <Badge className="bg-nude-700 text-white text-xs">Sale</Badge>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-nude-100">
                  <Heart className="h-4 w-4 text-nude-600" />
                </button>

                {/* Quick Add Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-nude-500 hover:bg-nude-600 text-white"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <span className="text-xs text-nude-500 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="font-medium text-nude-900 mt-1 mb-2 group-hover:text-nude-500 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-nude-800">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-nude-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-nude-400 text-nude-400" />
                    <span className="text-xs text-nude-600">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-nude-400 text-nude-700 hover:bg-nude-100 hover:border-nude-500 px-8"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
