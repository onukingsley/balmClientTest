import { Link } from 'react-router-dom';
import { products, categories, testimonials } from '../data/mockData';
import { ArrowRight, Star, ShoppingBag, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {cartStore, productStore, userStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";

export default function Home() {

  const {user,logoutUser} = userStore()
  const {product,category,brand,discountProduct,recommendedProduct,limitedProduct} = productStore()




  const {addCart,setTotalPrice} = cartStore()

  const featuredProducts = product.slice(0, 4);
  const featuredCategory = category.slice(0, 6);

  console.log(featuredCategory,'this is category')

  const newArrivals = recommendedProduct.slice(0, 3);
  const saleProducts = discountProduct.slice(0, 3);

  function addToCart(product,quantity){
    console.log(product)
    const payload = {
      'user_id' : user.id,
      'product_id': product.id,
      'quantity' : quantity
    }
    axiosClient.post('/addCart',payload)
        .then(({data})=>{
            console.log(data)
            addCart(product)


        })
  }




  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&auto=format&fit=crop&q=80"
            alt="Skincare Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream-50/95 via-cream-50/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 pt-20">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-nude-200 text-nude-800 hover:bg-nude-200">
              New Collection 2025
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-medium text-nude-900 leading-tight mb-6">
              Discover Your
              <span className="block text-nude-500">Natural Glow</span>
            </h1>
            <p className="text-lg sm:text-xl text-nude-700 mb-8 max-w-lg leading-relaxed">
              Premium skincare crafted with nature's finest ingredients.
              Science-backed formulas for radiant, healthy skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-nude-500 hover:bg-nude-600 text-white px-8 py-6 text-base font-medium group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/products?filter=new">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-nude-400 text-nude-700 hover:bg-nude-100 hover:border-nude-500 px-8 py-6 text-base font-medium"
                >
                  New Arrivals
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 mt-12">
              {['Cruelty Free', 'Natural Ingredients', 'Dermatologist Tested'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-nude-600">
                  <Check className="h-5 w-5 text-sage-500" />
                  <span className="text-sm">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
              Browse By
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3">
              Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategory.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.title}`}
                className={`group relative overflow-hidden rounded-2xl aspect-square ${
                  index === 0 ? 'col-span-2 row-span-2 lg:col-span-1 lg:row-span-1' : ''
                }`}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/storage/${category.category_image}`}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nude-900/70 via-nude-900/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="text-nude-200 text-sm mb-1">{category.product.length} products</span>
                  <h3 className="font-serif text-xl text-white group-hover:text-nude-200 transition-colors">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-32 bg-cream-50">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
                Best Sellers
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3">
                Featured Products
              </h2>
            </div>
            <Link to="/products" className="mt-4 lg:mt-0">
              <Button variant="outline" className="border-nude-400 text-nude-700">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 hover-lift"
              >
                <div className="relative aspect-square overflow-hidden bg-nude-100">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/storage/${product.product_image}`}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.status === "Hot" && (
                    <Badge className="absolute top-3 left-3 bg-sage-500 text-white">hot</Badge>
                  )}
                  {product.status === "Discount" && (
                    <Badge className="absolute top-3 left-3 bg-rose-500 text-white">Sale</Badge>
                  )}
                  <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-nude-100">
                    <Heart className="h-4 w-4 text-nude-600" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button
                      onClick={() => addToCart(product,1)}
                      className="w-full bg-nude-500 hover:bg-nude-600 text-white"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs text-nude-500 uppercase tracking-wider">{product.category.title}</span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-nude-900 mt-1 mb-2 group-hover:text-nude-500 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-nude-400 text-nude-400'
                            : 'text-nude-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-nude-500 ml-1">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-nude-800">₦{parseInt(product.price).toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-nude-400 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals & Sale */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* New Arrivals */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif text-nude-900">New Arrivals</h3>
                <Link to="/products?filter=new" className="text-nude-500 hover:text-nude-700 text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {newArrivals.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 bg-cream-50 rounded-xl group">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${product.product_image}`}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <span className="text-xs text-nude-500 uppercase">{product.category.title}</span>
                      <Link to={`/product/${product.id}`}>
                        <h4 className="font-medium text-nude-900 group-hover:text-nude-500 transition-colors">
                          {product.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-nude-400 text-nude-400" />
                        <span className="text-xs text-nude-500">{product.rating}</span>
                      </div>
                      <p className="font-semibold text-nude-800 mt-2">₦{parseInt(product.price).toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => addToCart(product,1)}
                      className="self-center text-nude-500 hover:text-nude-700 hover:bg-nude-100"
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* On Sale */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif text-nude-900">On Sale</h3>
                <Link to="/products?filter=sale" className="text-nude-500 hover:text-nude-700 text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {saleProducts.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 bg-rose-50 rounded-xl group">
                    <div className="relative">
                      <img
                          src={`${import.meta.env.VITE_API_URL}/storage/${product.product_image}`}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <Badge className="absolute -top-2 -left-2 bg-rose-500 text-white text-xs">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-nude-500 uppercase">{product.category.title}</span>
                      <Link to={`/product/${product.id}`}>
                        <h4 className="font-medium text-nude-900 group-hover:text-nude-500 transition-colors">
                          {product.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-nude-400 text-nude-400" />
                        <span className="text-xs text-nude-500">{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="font-semibold text-rose-600">₦{parseInt(product.price).toLocaleString()}</p>
{/*
                        <p className="text-sm text-nude-400 line-through">₦{product.originalPrice}</p>
*/}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => addToCart(product,1)}
                      className="self-center text-nude-500 hover:text-nude-700 hover:bg-nude-100"
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-32 bg-nude-100">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&auto=format&fit=crop&q=80"
                  alt="About Next of Skin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-soft max-w-xs">
                <p className="font-serif text-3xl text-nude-800 mb-1">10+</p>
                <p className="text-nude-600 text-sm">Years of crafting premium skincare</p>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3 mb-6">
                Science Meets
                <span className="block text-nude-500">Nature</span>
              </h2>
              <p className="text-nude-700 text-lg leading-relaxed mb-6">
                At Next of Skin, we believe in the power of nature enhanced by science.
                Our formulations combine the finest natural ingredients with cutting-edge
                dermatological research to deliver visible results.
              </p>
              <p className="text-nude-600 leading-relaxed mb-8">
                Every product is cruelty-free, sustainably sourced, and rigorously tested
                to ensure the highest quality standards. Your skin deserves nothing less.
              </p>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '100%', label: 'Cruelty Free' },
                  { value: '4.9', label: 'Average Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl lg:text-3xl font-serif font-medium text-nude-800 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-nude-600 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-cream-50 rounded-2xl p-8 hover:shadow-soft transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'fill-nude-400 text-nude-400' : 'text-nude-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-nude-700 leading-relaxed mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-nude-900">{testimonial.name}</h4>
                    <p className="text-nude-500 text-sm">{testimonial.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="py-20 lg:py-32 bg-nude-900">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-white mb-4">
              Join the Glow Club
            </h2>
            <p className="text-nude-300 mb-8">
              Subscribe for exclusive offers, skincare tips, and early access to new products.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-nude-800 border border-nude-700 rounded-xl text-white placeholder:text-nude-500 focus:outline-none focus:ring-2 focus:ring-nude-500"
              />
              <Button className="bg-nude-500 hover:bg-nude-400 text-white px-8 py-4">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
