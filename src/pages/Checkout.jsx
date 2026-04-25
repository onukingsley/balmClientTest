import {useEffect, useState} from 'react';
import { useNavigate, Link,useSearchParams } from 'react-router-dom';
import { CreditCard, Truck, Shield, Check,X, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {cartStore, userStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";

export default function Checkout() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams()

  const reference = searchParams.get('reference')
  const order_id = searchParams.get('tnxId')
  const status = searchParams.get('status')



  const {cart,clearCart,totalPrice} = cartStore();
  const {user} = userStore()


  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderFailed, setOrderFailed] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name.split(' ')[0]||'',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email ||'',
    phone: user?.phone_number ||'',
    address: user?.address ||'',
    city: '',
    state: '',
    zip: '',
  });



  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });

  const shipping = totalPrice >= 75 ? 0 : 5;
  const tax = parseInt(totalPrice * 0.015)+100;
  const finalTotal = totalPrice + shipping + tax;


  useEffect(()=>{
    if (status==='success'){
      setOrderId(order_id)
      setOrderComplete(true)
    }else if (status==='failed'){
      setOrderId(order_id)
      setOrderFailed(true)
    }
  },[])


  const handleShippingSubmit = (e) => {
    e.preventDefault();
    axiosClient.post("/initiatePayment",{
      'email': shippingInfo.email,
      'amount' : totalPrice,
      'address': shippingInfo.address
    })
        .then(({data})=>{
          console.log(data)
          window.location.href = data.data.authorization_url
        }).catch(e=>console.log(e,'Error occurred while initiating Payment'))
    /*setStep(2);*/
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

/*  if (cart.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }*/

  if (orderFailed == true) {
    return (
        <div className="min-h-screen bg-cream-50 pt-32 pb-20">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-24 h-24 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-8">
                <X className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-serif text-nude-900 mb-4">Order Failed!</h1>
              <p className="text-nude-600 mb-8">
                Sorry we could not Process your order at the moment. Please contact our Team
              </p>
              <div className="bg-white rounded-2xl p-6 mb-8">
                <p className="text-sm text-nude-500 mb-2">Email Address</p>
                {/*
              <p className="text-xl font-semibold text-nude-900">#ORD-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
*/}
                <p className="text-xl font-semibold text-nude-900">nextofSkin@rocketmail.mail</p>
              </div>
              <div className="flex gap-4 justify-center">
                {/*<Link to="/account/orders">
                  <Button className="bg-nude-500 hover:bg-nude-600 text-white">
                    View My Orders
                  </Button>
                </Link>*/}
                <Link to="/products">
                  <Button variant="outline" className="border-nude-300 text-nude-700">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
    );
  }



  if (orderComplete) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-8">
              <Check className="h-12 w-12 text-sage-500" />
            </div>
            <h1 className="text-3xl font-serif text-nude-900 mb-4">Order Confirmed!</h1>
            <p className="text-nude-600 mb-8">
              Thank you for your purchase. Your order has been placed successfully.
              You will receive a confirmation email shortly.
            </p>
            <div className="bg-white rounded-2xl p-6 mb-8">
              <p className="text-sm text-nude-500 mb-2">Order Number</p>
{/*
              <p className="text-xl font-semibold text-nude-900">#ORD-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
*/}
              <p className="text-xl font-semibold text-nude-900">#ORD-{orderId}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link to="/account/orders">
                <Button className="bg-nude-500 hover:bg-nude-600 text-white">
                  View My Orders
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="border-nude-300 text-nude-700">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-nude-500 mb-8">
          <Link to="/cart" className="hover:text-nude-700">Cart</Link>
          <ChevronRight className="h-4 w-4" />
          <span className={step === 1 ? 'text-nude-900 font-medium' : ''}>Shipping</span>
          <ChevronRight className="h-4 w-4" />
          <span className={step === 2 ? 'text-nude-900 font-medium' : ''}>Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-serif text-nude-900 mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">First Name</label>
                      <Input
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className="border-nude-200"
                        required
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">Last Name</label>
                      <Input
                        disabled={true}
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className="border-nude-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">Email</label>
                      <Input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="border-nude-200"
                        required
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">Phone</label>
                      <Input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="border-nude-200"
                        required
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-nude-700 mb-2 block">Address</label>
                    <Input
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="border-nude-200"
                      required
                    />
                  </div>

                 {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">City</label>
                      <Input
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="border-nude-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">State</label>
                      <Input
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="border-nude-200"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-sm text-nude-700 mb-2 block">ZIP Code</label>
                      <Input
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                        className="border-nude-200"
                        required
                      />
                    </div>
                  </div>*/}

                  <Button
                    type="submit"
                    className="w-full bg-nude-500 hover:bg-nude-600 text-white py-6"
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-serif text-nude-900 mb-6">Payment Information</h2>

                {/* Saved Shipping Info */}
                <div className="bg-nude-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-nude-900">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </p>
                      <p className="text-nude-600 text-sm">{shippingInfo.address}</p>
                      <p className="text-nude-600 text-sm">
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-nude-500"
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm text-nude-700 mb-2 block">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
                      <Input
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="border-nude-200 pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-nude-700 mb-2 block">Name on Card</label>
                    <Input
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                      className="border-nude-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">Expiry Date</label>
                      <Input
                        value={paymentInfo.expiry}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="border-nude-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-nude-700 mb-2 block">CVV</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
                        <Input
                          type="password"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          placeholder="123"
                          className="border-nude-200 pl-12"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-sage-50 rounded-xl">
                    <Shield className="h-6 w-6 text-sage-500" />
                    <div>
                      <p className="font-medium text-sage-800">Secure Payment</p>
                      <p className="text-sage-600 text-sm">Your payment information is encrypted</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-nude-500 hover:bg-nude-600 text-white py-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₦${finalTotal.toFixed(2)}`}
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-serif text-nude-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${item.product.product_image}`}
                        alt={item.product.product_image}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-nude-900 text-sm">{item.product.title}</p>
                      <p className="text-nude-500 text-sm">Qty: {item.quantity}</p>
                      <p className="text-nude-800 text-sm">₦{parseInt(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-nude-200 mb-6" />

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-nude-600">
                  <span>Subtotal</span>
                  <span>₦{parseInt(totalPrice)?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-nude-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-sage-600' : ''}>
                    {shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-nude-600">
                  <span>Tax</span>
                  <span>₦{parseInt(tax).toLocaleString()}</span>
                </div>
              </div>

              <Separator className="bg-nude-200 mb-6" />

              <div className="flex justify-between text-lg font-semibold text-nude-900">
                <span>Total</span>
                <span>₦{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
