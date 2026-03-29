import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Search, User, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Shop', href: '#products' },
  { name: 'Categories', href: '#categories' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#newsletter' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2">
            <span className="text-2xl lg:text-3xl font-serif font-semibold text-nude-800 tracking-tight">
              NUDE
            </span>
            <span className="text-2xl lg:text-3xl font-serif font-light text-nude-500">
              &CO
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-nude-700 hover:text-nude-500 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nude-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-nude-700 hover:text-nude-500 hover:bg-nude-100"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-nude-700 hover:text-nude-500 hover:bg-nude-100"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-nude-700 hover:text-nude-500 hover:bg-nude-100"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-nude-700 hover:text-nude-500 hover:bg-nude-100"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-nude-500 text-white text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-nude-700 hover:text-nude-500 hover:bg-nude-100"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 bg-nude-50">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <span className="font-serif text-2xl text-nude-800">NUDE</span>
                    <span className="font-serif text-2xl text-nude-500">&CO</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-nude-700 hover:text-nude-500 transition-colors py-2 border-b border-nude-200"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
