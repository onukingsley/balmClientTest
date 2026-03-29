import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';

export default function Categories() {
  return (
    <section id="categories" className="py-20 lg:py-32 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
              Browse By
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3">
              Categories
            </h2>
          </div>
          <p className="text-nude-600 max-w-md mt-4 lg:mt-0 lg:text-right">
            Explore our carefully curated categories designed to suit every style and occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href="#"
              className={`group relative overflow-hidden rounded-lg aspect-[3/4] ${
                index === 0 ? 'sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-nude-900/70 via-nude-900/20 to-transparent transition-opacity group-hover:opacity-90" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-nude-200 text-sm mb-2">
                  {category.itemCount} items
                </span>
                <h3 className={`font-serif text-white group-hover:text-nude-200 transition-colors ${
                  index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                }`}>
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-nude-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
