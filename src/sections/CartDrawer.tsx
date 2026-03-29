import { Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-nude-50 flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 text-nude-900">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-nude-200 flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-nude-400" />
            </div>
            <h3 className="text-lg font-medium text-nude-800 mb-2">Your cart is empty</h3>
            <p className="text-nude-500 text-sm max-w-xs mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button
              onClick={() => setIsCartOpen(false)}
              className="bg-nude-500 hover:bg-nude-600 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white p-4 rounded-lg"
                  >
                    {/* Image */}
                    <div className="w-20 h-24 flex-shrink-0 rounded-md overflow-hidden bg-nude-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-nude-500 uppercase tracking-wider">
                            {item.category}
                          </p>
                          <h4 className="font-medium text-nude-900 truncate pr-2">
                            {item.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-nude-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-nude-100 flex items-center justify-center hover:bg-nude-200 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-nude-100 flex items-center justify-center hover:bg-nude-200 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-nude-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 pt-4 border-t border-nude-200">
              {/* Summary */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <Separator className="bg-nude-200" />
                <div className="flex justify-between">
                  <span className="font-medium text-nude-900">Total</span>
                  <span className="font-semibold text-lg text-nude-900">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <Button className="w-full bg-nude-500 hover:bg-nude-600 text-white py-6">
                Proceed to Checkout
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 border-nude-300 text-nude-700 hover:bg-nude-100"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="text-nude-500 hover:text-red-500 hover:bg-red-50"
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
