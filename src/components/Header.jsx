import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  Search,
  User,
  Heart,
    Speech,
  X,
  ChevronDown,
  LogOut,
    ShoppingCart,
  Package,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {cartStore, userStore} from "@/store/store.jsx";

import Logo from '/src/assets/images/logo6.png'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/products' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];



export default function Header() {
  const {user,logoutUser} = userStore()

  const {setIsCartOpen,cart,addCart,updateQuantity,removeCartItem,clearCart,totalPrice,setTotalPrice} = cartStore()

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logoutUser();
    clearCart()
    navigate('/');
  };

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
          <Link to="/" className="flex pt-3 justify-center items-center gap-1">
            {/*<span className="text-xl lg:text-2xl font-serif font-semibold text-nude-800">Next of</span>
            <span className="text-xl lg:text-2xl font-serif font-light text-nude-500">Skin</span>*/}
            <img
                src= {Logo}
                alt="logo"
                className="w-20 h-20 object-cover bg-transparent"
            />

          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-nude-700 hover:text-nude-500 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nude-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            {/* Search */}
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-nude-700 hover:text-nude-500 hover:bg-nude-100"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-white">
                <SheetHeader>
                  <SheetTitle>Search Products</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500"
                      autoFocus
                    />
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-nude-700 hover:text-nude-500 hover:bg-nude-100"
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden sm:flex items-center gap-2 text-nude-700 hover:text-nude-500 hover:bg-nude-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-nude-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-nude-700">

                        {user?.image? <img className={'w-8 h-8 rounded-full object-cover'} src={`${import.meta.env.VITE_API_URL}/storage/${user.image}`} alt=""/>:user?.name?.charAt(0)}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={()=>navigate('/cart')}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account/complaint')}>
                    <Speech className="h-4 w-4 mr-2" />
                    Complaints
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user?.user_role === '0' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-nude-700 hover:text-nude-500 hover:bg-nude-100"
                onClick={() => navigate('/login')}
                /*onClick={() => alert("Coming Soon !!!!")}*/
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-nude-700 hover:text-nude-500 hover:bg-nude-100"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cart?.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-nude-500 text-white text-xs">
                  {cart?.length}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
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

              <SheetContent
                  side="left"
                  className="w-80 bg-white p-0"   // ← remove default padding
              >
                <div className="flex flex-col h-full max-h-screen overflow-hidden">

                  {/* Fixed Header */}
                  <div className="p-6 border-b border-nude-100">
                    <SheetHeader>
                      <SheetTitle className="text-left">

                        <img
                            src= {Logo}
                            alt="logo"
                            className="w-20 h-20 object-cover"
                        />
                        <span className="font-serif text-2xl text-nude-800">Next of </span>
                        <span className="font-serif text-2xl text-nude-500">Skin</span>

                      </SheetTitle>
                    </SheetHeader>
                  </div>

                  {/* Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <nav className="flex flex-col space-y-2">
                      {navLinks.map((link) => (
                          <Link
                              key={link.name}
                              to={link.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-lg font-medium text-nude-700 hover:text-nude-500 transition-colors py-3 border-b border-nude-100"
                          >
                            {link.name}
                          </Link>
                      ))}
                    </nav>

                    {user ? (
                        <div className="space-y-2">
                          <Link
                              to="/cart"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 py-3 text-nude-700 hover:text-nude-500"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            Cart
                          </Link>

                          <Link
                              to="/account/profile"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 py-3 text-nude-700 hover:text-nude-500"
                          >
                            <User className="h-5 w-5" />
                            Profile
                          </Link>

                          <Link
                              to="/account/orders"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 py-3 text-nude-700 hover:text-nude-500"
                          >
                            <Package className="h-5 w-5" />
                            My Orders
                          </Link>

                          <Link
                              to="/account/complaint"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 py-3 text-nude-700 hover:text-nude-500"
                          >
                            <Speech className="h-5 w-5" />
                            Complaints
                          </Link>

                          {user?.user_role === '0' && (
                              <Link
                                  to="/admin"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 py-3 text-nude-700 hover:text-nude-500"
                              >
                                <Settings className="h-5 w-5" />
                                Admin Dashboard
                              </Link>
                          )}

                          <button
                              onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                              }}
                              className="flex items-center gap-3 py-3 text-nude-700 hover:text-nude-500 w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            Logout
                          </button>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-4">
                          <Button
                              className="w-full bg-nude-500 hover:bg-nude-600 text-white"
                              onClick={() => {
                                navigate('/login');
                                /*alert("Coming Soon !!!!")*/
                                setIsMobileMenuOpen(false);
                              }}
                          >
                            Login
                          </Button>
                          <Button
                              variant="outline"
                              className="w-full border-nude-300 text-nude-700"
                              onClick={() => {
                                navigate('/register');
                                 /*alert("Coming Soon !!!!");*/
                                setIsMobileMenuOpen(false);
                              }}
                          >
                            Register
                          </Button>
                        </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
