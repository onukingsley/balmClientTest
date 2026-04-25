import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Trash2, ArrowRight, Gift, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {cartStore, userStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";
import {useState} from "react";

export default function Cart() {



  const {cart,addCart,updateQuantity,removeCartItem,clearCart,totalPrice,setTotalPrice,isCartOpen,setIsCartOpen} = cartStore();

  const {user} = userStore()



  function updateCart(product,quantity){
    const payload = {
      'user_id' : user.id,
      'product_id': product.product_id,
      'quantity' : quantity
    }
    axiosClient.post('/updateCart',payload)
        .then(({data})=>{
          console.log(data)
          updateQuantity(product.product.id,quantity)
        })
  }

  function removeItem(product,cart){

    const payload = {
      'user_id' : user.id,
      'product_id': product,
    }
    console.log('this is product', payload)

    axiosClient.post('/deleteCart',payload)
        .then(({data})=>{
          console.log(data)
          removeCartItem(product)
        })
  }



  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = totalPrice >= 75 ? 0 : 5;
  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice + shipping - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'glow10') {
      setPromoApplied(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-32 h-32 rounded-full bg-nude-100 flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-nude-400" />
            </div>
            <h1 className="text-3xl font-serif text-nude-900 mb-4">Your Cart is Empty</h1>
            <p className="text-nude-600 mb-8">
              Discover our premium skincare collection and find your perfect routine.
            </p>
            <Link to="/products">
              <Button className="bg-nude-500 hover:bg-nude-600 text-white px-8 py-6">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <h1 className="text-3xl sm:text-4xl font-serif text-nude-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-nude-100 text-sm font-medium text-nude-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-nude-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Product */}
                      <div className="sm:col-span-6 flex gap-4">
                        <Link to={`/product/${item.id}`}>
                          <img
                              src={`${import.meta.env.VITE_API_URL}/storage/${item.product.product_image}`}
                              alt={item.product.product_image}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                        </Link>
                        <div className="flex-1">
                          <span className="text-xs text-nude-500 uppercase">{item.product.category.title}</span>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-medium text-nude-900 hover:text-nude-500 transition-colors">
                              {item.product.title}
                            </h3>
                          </Link>
                          <p className="text-nude-600 text-sm mt-1">₦{parseInt(item.product.price).toLocaleString()}</p>
                          <button
                            onClick={() => removeItem(item.product.id,item.id)}
                            className="text-rose-500 text-sm mt-2 hover:text-rose-700 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-2 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <button
                              onClick={() => {
                                if (parseInt(item.quantity) - 1 === 0){
                                  console.log('reached')
                                  console.log(item.product.id)
                                  removeItem(item.product.id,item.id)
                                  setTotalPrice()
                                }else {
                                  updateCart(item, parseInt(item.quantity) - 1)
                                }

                              }}
                              className="w-8 h-8 rounded-full bg-nude-100 flex items-center justify-center hover:bg-nude-200 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                              onClick={() => updateCart(item, parseInt(item.quantity) + 1)}
                            className="w-8 h-8 rounded-full bg-nude-100 flex items-center justify-center hover:bg-nude-200 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:col-span-2 text-center text-nude-600">
                        ₦{parseInt(item.product.price).toLocaleString()}
                      </div>

                      {/* Total */}
                      <div className="sm:col-span-2 text-right font-semibold text-nude-900">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/products">
                <Button variant="outline" className="border-nude-300 text-nude-700">
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-serif text-nude-900 mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-sm text-nude-600 mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="border-nude-200"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    className="border-nude-300 text-nude-700"
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-sage-600 text-sm mt-2">Promo code applied! 10% off</p>
                )}
                <p className="text-nude-400 text-xs mt-2">Try code: GLOW10</p>
              </div>

              <Separator className="bg-nude-200 mb-6" />

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-nude-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>
                    ₦{parseInt(totalPrice).toLocaleString()}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sage-600">
                    <span>Discount</span>
                    <span>-₦{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-nude-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-sage-600' : ''}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {totalPrice < 75 && (
                <div className="bg-sage-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-sage-700 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>Add ₦{(75 - totalPrice).toFixed(2)} more for free shipping!</span>
                  </div>
                </div>
              )}

              <Separator className="bg-nude-200 mb-6" />

              <div className="flex justify-between text-lg font-semibold text-nude-900 mb-6">
                <span>Total</span>
                <span>₦{finalTotal.toFixed(2)}</span>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-nude-500 hover:bg-nude-600 text-white py-6"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Payment Icons */}
              <div className="flex justify-center gap-4 mt-6">
                {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="w-12 h-8 bg-nude-100 rounded flex items-center justify-center text-xs text-nude-500"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
