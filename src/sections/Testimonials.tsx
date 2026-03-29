import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/products';

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-nude-600 max-w-2xl mx-auto text-lg">
            Real stories from real customers who have experienced the Nude & Co difference.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative bg-nude-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-8 w-8 text-nude-300" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'fill-nude-400 text-nude-400'
                        : 'text-nude-300'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-nude-700 leading-relaxed mb-8">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-nude-900">{testimonial.name}</h4>
                  <p className="text-nude-500 text-sm">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '10K+', label: 'Products Sold' },
            { value: '4.9', label: 'Average Rating' },
            { value: '98%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-serif font-medium text-nude-800 mb-2">
                {stat.value}
              </p>
              <p className="text-nude-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
