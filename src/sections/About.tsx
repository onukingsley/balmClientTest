import { Check, Leaf, Heart, Award } from 'lucide-react';

const values = [
  {
    icon: Leaf,
    title: 'Sustainable',
    description: 'Eco-friendly materials and ethical production practices.',
  },
  {
    icon: Heart,
    title: 'Handcrafted',
    description: 'Each piece is carefully crafted with attention to detail.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Only the finest materials sourced from trusted suppliers.',
  },
];

const features = [
  'Ethically sourced materials',
  'Sustainable packaging',
  'Carbon-neutral shipping',
  'Fair trade certified',
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-nude-50">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&auto=format&fit=crop&q=80"
                alt="About Nude & Co"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <p className="font-serif text-2xl text-nude-800 mb-2">10+</p>
              <p className="text-nude-600 text-sm">Years of crafting timeless pieces with passion and precision</p>
            </div>
            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-nude-300 rounded-lg -z-10" />
          </div>

          {/* Content Side */}
          <div>
            <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3 mb-6">
              Crafted with Care,
              <span className="block text-nude-500">Designed for You</span>
            </h2>
            <p className="text-nude-600 text-lg leading-relaxed mb-8">
              At Nude & Co, we believe in the beauty of simplicity. Our journey began with a simple 
              mission: to create timeless pieces that transcend trends and celebrate individuality. 
              Every item in our collection is thoughtfully designed and ethically produced.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-nude-200 flex items-center justify-center">
                    <Check className="h-3 w-3 text-nude-600" />
                  </div>
                  <span className="text-nude-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {values.map((value) => (
                <div key={value.title} className="text-center sm:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-nude-200 mb-3">
                    <value.icon className="h-5 w-5 text-nude-600" />
                  </div>
                  <h4 className="font-medium text-nude-900 mb-1">{value.title}</h4>
                  <p className="text-nude-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
