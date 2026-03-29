import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section id="newsletter" className="py-20 lg:py-32 bg-nude-100">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-medium text-nude-500 tracking-widest uppercase">
            Stay Connected
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-nude-900 mt-3 mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-nude-600 text-lg mb-10 max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, early access to new collections, 
            and styling tips delivered straight to your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-6 bg-white border-nude-200 focus:border-nude-500 focus:ring-nude-500 rounded-lg"
                disabled={isSubmitted}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className={`h-14 px-8 transition-all duration-300 ${
                isSubmitted
                  ? 'bg-green-500 hover:bg-green-500'
                  : 'bg-nude-500 hover:bg-nude-600'
              } text-white`}
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-nude-500 text-sm mt-6">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
