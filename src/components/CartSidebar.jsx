import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Trash2, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {cartStore, userStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";

export default function CartSidebar() {

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


        axiosClient.post('/deleteCart',payload)
            .then(({data})=>{
                console.log(data)
                removeCartItem(product)
            })
    }



  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-white flex flex-col h-screen"
      >
        <SheetHeader className="space-y-2.5 pb-4 border-b border-nude-100">
          <SheetTitle className="flex items-center gap-2 text-nude-900">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 rounded-full bg-nude-100 flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-nude-400" />
            </div>
            <h3 className="text-xl font-serif text-nude-800 mb-2">Your cart is empty</h3>
            <p className="text-nude-500 max-w-xs mb-8">
              Discover our premium skincare collection and find your perfect routine.
            </p>
            <Button
              onClick={() => setIsCartOpen(false)}
              className="bg-nude-500 hover:bg-nude-600 text-white px-8"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="space-y-4 py-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-cream-50 p-4 rounded-xl"
                  >
                    {/* Image */}
                    <div className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-nude-100">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${item.product.product_image}`}
                        alt={item.product.product_image}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-nude-500 uppercase tracking-wider">
                            {item.product.category.title}
                          </p>
                          <h4 className="font-medium text-nude-900 truncate pr-2 text-sm">
                            {item.product.title}
                          </h4>
                          <p className="text-nude-600 text-sm mt-1">₦{parseInt(item.product.price).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id,item.id)}
                          className="text-nude-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
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
                            className="w-7 h-7 rounded-full bg-white border border-nude-200 flex items-center justify-center hover:bg-nude-100 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCart(item, parseInt(item.quantity) + 1)}
                            className="w-7 h-7 rounded-full bg-white border border-nude-200 flex items-center justify-center hover:bg-nude-100 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-nude-800">
                          ₦{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 pt-4 border-t border-nude-100">
              {/* Summary */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Subtotal</span>
                  <span className="font-medium">₦{totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Shipping</span>
                  <span className="font-medium text-sage-500">
                    {totalPrice >= 75 ? 'Free' : '$5.00'}
                  </span>
                </div>
                <Separator className="bg-nude-200" />
                <div className="flex justify-between">
                  <span className="font-medium text-nude-900">Total</span>
                  <span className="font-semibold text-lg text-nude-900">
                    ₦{(totalPrice >= 75 ? totalPrice : totalPrice + 5).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <Link to="/checkout" className="w-full" onClick={() => setIsCartOpen(false)}>
                <Button className="w-full bg-nude-500 hover:bg-nude-600 text-white py-6">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 border-nude-300 text-nude-700 hover:bg-nude-50"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="text-nude-500 hover:text-rose-500 hover:bg-rose-50"
                >
                  Clear
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
