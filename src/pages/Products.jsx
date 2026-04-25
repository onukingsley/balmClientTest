import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products, categories } from '../data/mockData';
import { Star, ShoppingBag, Heart, Filter, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import axiosClient from "@/service/axios_client.js";
import {cartStore, productStore, userStore} from "@/store/store.jsx";

export default function Products() {

  const {addCart} = cartStore()
  const {user,logoutUser} = userStore()
  const {product,category,brand,discountProduct,recommendedProduct,limitedProduct} = productStore()


  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const filterType = searchParams.get('filter') || '';



  function addToCart(product,quantity){
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



  const filteredProducts = useMemo(() => {
    let result = [...product];


    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    // Category filter
    if (categoryFilter) {
      result = result.filter((p) => p.category.title === categoryFilter);
      //console.log(result,'this is result')
    }
    if (brandFilter && result.length>0) {
      result = result.filter((p) => p.brand.title === brandFilter);
      //console.log(result,'this is result')
    }
    //console.log(result,'this is categoryfilter')

    // Filter type (new, sale, bestsellers)
    if (filterType === 'new') {
      result = result.filter((p) => p.status === 'Hot');
    } else if (filterType === 'sale') {
      result = result.filter((p) => p.status == 'Discount');
    } /*else if (filterType === 'bestsellers') {
      result = result.filter((p) => p.rating >= 4.8);
    }*/

    // Selected categories filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category.title));
    }
    if (selectedBrand.length > 0) {
      result = result.filter((p) => selectedBrand.includes(p.brand.title));
    }

    // Price range filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
     /* case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;*/
      default:
        break;
    }
    /*if (!result.length === 0 ){

    } else {
      return product
    }*/
    return result;


  }, [searchQuery,product, categoryFilter,brandFilter, filterType, selectedBrand,selectedCategories, priceRange, sortBy,searchParams]);

  console.log(filteredProducts,'this is the filtered product')
  const toggleCategory = (category) => {
    searchParams.set('category',category)
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toogleBrand = (brandtxt) => {
    searchParams.set('brand',brandtxt)
    setSelectedBrand((prev) =>
        prev.includes(brandtxt)
            ? prev.filter((c) => c !== brandtxt)
            : [...prev, brandtxt]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000000]);
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="font-medium text-nude-900 mb-4">Categories</h4>
        <div className="space-y-2">
          {category.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.title)}
                onChange={() => toggleCategory(category.title)}
                className="rounded border-nude-300 text-nude-500 focus:ring-nude-500"
              />
              <span className="text-nude-700 text-sm">{category.title}</span>
              <span className="text-nude-400 text-xs ml-auto">({category.product.length})</span>
            </label>
          ))}
        </div>


        <h4 className="font-medium text-nude-900 mb-4">Brands</h4>
        <div className="space-y-2">
          {brand.map((bra) => (
              <label key={bra.id} className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={selectedBrand.includes(bra.title)}
                    onChange={() => toogleBrand(bra.title)}
                    className="rounded border-nude-300 text-nude-500 focus:ring-nude-500"
                />
                <span className="text-nude-700 text-sm">{bra.title}</span>
                <span className="text-nude-400 text-xs ml-auto">({bra.product.length})</span>
              </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-nude-900 mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000000}
          step={5}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-nude-600">
          <span>₦{parseInt(priceRange[0]).toLocaleString()}</span>
          <span>₦{parseInt(priceRange[1]).toLocaleString()}</span>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-nude-300 text-nude-700"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-nude-200">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-nude-900 mb-2">
            {searchQuery ? `Search: "${searchQuery}"` : categoryFilter || 'All Products'}
          </h1>
          <p className="text-nude-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div
                className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              <h3 className="font-medium text-nude-900 mb-6">Filters</h3>

              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden border-nude-300">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-white">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-nude-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-nude-100 text-nude-800' : 'text-nude-400 hover:text-nude-600'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-nude-100 text-nude-800' : 'text-nude-400 hover:text-nude-600'
                  }`}
                >
                  <LayoutList className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-nude-600 text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 border-nude-300 text-nude-700"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden bg-nude-100 ${
                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                      }`}
                    >
                      <img
                          src={`${import.meta.env.VITE_API_URL}/storage/${product.product_image}`}
                          alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <Badge className="absolute top-3 left-3 bg-sage-500 text-white">New</Badge>
                      )}
                      {product.isSale && (
                        <Badge className="absolute top-3 left-3 bg-rose-500 text-white">Sale</Badge>
                      )}
                      <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-nude-100">
                        <Heart className="h-4 w-4 text-nude-600" />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <span className="text-xs text-nude-500 uppercase tracking-wider">
                        {product.category.title}
                      </span>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium text-nude-900 mt-1 mb-2 group-hover:text-nude-500 transition-colors">
                          {product.title}
                        </h3>
                      </Link>

                      {viewMode === 'list' && (
                        <p className="text-nude-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center gap-1 mb-3">
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

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-nude-800">₦{parseInt(product.price).toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-nude-400 line-through">
                             ₦{parseInt(product.originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product,1)}
                          className="bg-nude-500 hover:bg-nude-600 text-white"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
