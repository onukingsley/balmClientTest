import {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/mockData';
import { Star, ShoppingBag, Heart, Check, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosClient from "@/service/axios_client.js";
import {cartStore, productStore, userStore} from "@/store/store.jsx";

export default function ProductDetail() {

  const {addCart,updateQuantity,cart} = cartStore()
  const {user,logoutUser} = userStore()
  const  {product} = productStore()


  function incrementCart(product){
    const cartProduct = cart.find((item)=>{
      return item.product_id === product.id
    })
    console.log(cartProduct,'this is the CartProduct')
    const payload = {
      'user_id' : user.id,
      'product_id': product.id,
      'quantity' : parseInt(cartProduct.quantity) + 1
    }



    console.log(payload,'this is payload')
    axiosClient.post('/updateCart',payload)
        .then(({data})=>{
          console.log(data)
          updateQuantity(product.id,parseInt(cartProduct.quantity) + 1)
        })
  }


  function decrementCart(product){
    const cartProduct = cart.find((item)=>{
        return item.product_id === product.id
    })
    console.log(cartProduct,'this is the CartProduct')
    const payload = {
      'user_id' : user.id,
      'product_id': product.id,
      'quantity' : parseInt(cartProduct.quantity) - 1
    }



    console.log(payload,'this is payload')
    axiosClient.post('/updateCart',payload)
        .then(({data})=>{
          console.log(data)
          updateQuantity(product.id,parseInt(cartProduct.quantity) - 1)
        })
  }


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



  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [prod,setProd] = useState()
  const prods = product.find((p) => p.id === parseInt(id));
  useEffect(()=>{
    console.log(id)

    setProd(prods)
    const cartProduct = cart.find((item)=>{
      return item.product_id === prods.id
    })
    if (cartProduct){
      console.log(cartProduct)
      setQuantity(cartProduct.quantity)

    }

  },[cart,id,prods])





  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 text-center">
        <h1 className="text-2xl font-serif text-nude-900">Product not found</h1>
        <Link to="/products" className="text-nude-500 hover:text-nude-700 mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const relatedProducts = product
    .filter((p) => p.category.id == prod?.category.id && p.id !== prod.id)
    .slice(0, 4);

  console.log(prod, relatedProducts)

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-nude-200">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-4">
          <div className="flex items-center gap-2 text-sm text-nude-500">
            <Link to="/" className="hover:text-nude-700">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/products" className="hover:text-nude-700">Products</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-nude-900">{prod?.title}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-nude-100 mb-4">
              <img
                  src={`${import.meta.env.VITE_API_URL}/storage/${prod?.product_image}`}
                alt={prod?.title}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-sage-500 text-white text-sm px-3 py-1">
                  New
                </Badge>
              )}
              {product.isSale && (
                <Badge className="absolute top-4 left-4 bg-rose-500 text-white text-sm px-3 py-1">
                  Sale
                </Badge>
              )}
            </div>
            {/*<div className="flex gap-3">
              {product.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-nude-500' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>*/}
          </div>

          {/* Info */}
          <div>
            <span className="text-sm text-nude-500 uppercase tracking-wider">{prod?.category.title}</span>
            <h1 className="text-3xl sm:text-4xl font-serif text-nude-900 mt-2 mb-4">{prod?.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-nude-400 text-nude-400'
                        : 'text-nude-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-nude-600">{prod?.rating}</span>
              <span className="text-nude-400">({prod?.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-semibold text-nude-800">${prod?.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-nude-400 line-through">${prod?.originalPrice}</span>
                  <Badge className="bg-rose-500 text-white">
                    Save ${prod?.originalPrice - prod?.price}
                  </Badge>
                </>
              )}
            </div>

            <p className="text-nude-700 leading-relaxed mb-8">{prod?.description}</p>

            {/* Size */}
            <div className="mb-6">
              <span className="text-sm font-medium text-nude-700">Size: {prod?.size}</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-nude-700">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                    onClick={() => {
                      console.log(prod?.quantity,'this is the quantitiy be4 minus')
                      if (parseInt(quantity) - 1 === 0 ){
                        setQuantity(1)
                      }else{
                        setQuantity(parseInt(quantity)-1)
                        decrementCart(prod)
                      }



                    }}
                  className="w-10 h-10 rounded-full bg-nude-100 flex items-center justify-center hover:bg-nude-200 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                    onClick={() => {
                      setQuantity(parseInt(quantity)+1)

                      incrementCart(prod)

                    }}
                  className="w-10 h-10 rounded-full bg-nude-100 flex items-center justify-center hover:bg-nude-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={() => addToCart(prod, quantity)}
                className="flex-1 bg-nude-500 hover:bg-nude-600 text-white py-6"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-nude-300 text-nude-700 hover:bg-nude-100 px-6"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl">
              {[
                { icon: Truck, text: 'Free Shipping over $75' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: RotateCcw, text: '30-Day Returns' },
              ].map((benefit) => (
                <div key={benefit.text} className="text-center">
                  <benefit.icon className="h-6 w-6 mx-auto text-nude-500 mb-2" />
                  <span className="text-xs text-nude-600">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="bg-white border border-nude-200 p-1">
              <TabsTrigger value="description" className="data-[state=active]:bg-nude-100">
                Description
              </TabsTrigger>
              <TabsTrigger value="ingredients" className="data-[state=active]:bg-nude-100">
                Ingredients
              </TabsTrigger>
              <TabsTrigger value="howToUse" className="data-[state=active]:bg-nude-100">
                How to Use
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-nude-100">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 bg-white rounded-2xl p-8">
              <h3 className="text-xl font-serif text-nude-900 mb-4">Product Description</h3>
              <p className="text-nude-700 leading-relaxed">{prod?.description}</p>
            </TabsContent>

           {/* <TabsContent value="ingredients" className="mt-6 bg-white rounded-2xl p-8">
              <h3 className="text-xl font-serif text-nude-900 mb-4">Key Ingredients</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-sage-500" />
                    <span className="text-nude-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>*/}

            <TabsContent value="howToUse" className="mt-6 bg-white rounded-2xl p-8">
              <h3 className="text-xl font-serif text-nude-900 mb-4">How to Use</h3>
              <p className="text-nude-700 leading-relaxed">{product.howToUse}</p>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 bg-white rounded-2xl p-8">
              <h3 className="text-xl font-serif text-nude-900 mb-4">Customer Reviews</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-serif text-nude-900">{product.rating}</div>
                <div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-nude-400 text-nude-400'
                            : 'text-nude-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-nude-500 text-sm">Based on {product.reviews} reviews</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-serif text-nude-900 mb-8">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-soft transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-nude-100">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${related?.product_image}`}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-nude-500 uppercase">{related.category.title}</span>
                    <h4 className="font-medium text-nude-900 mt-1 group-hover:text-nude-500 transition-colors">
                      {related.title}
                    </h4>
                    <p className="font-semibold text-nude-800 mt-2">${related.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
