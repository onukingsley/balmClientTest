import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/mockData';
import { ArrowLeft, Package, Truck, Check, MapPin, CreditCard, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {orderStore} from "@/store/store.jsx";
import {useEffect, useState} from "react";

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-sage-100 text-sage-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: Package },
 /* { key: 'shipped', label: 'Shipped', icon: Truck },*/
  { key: 'delivered', label: 'Delivered', icon: Check },
];

export default function OrderDetail() {

  const {orders} = orderStore()
  const [order, setOrder] = useState({})


  const { id } = useParams();
  const navigate = useNavigate();

/*
  const order =  Object.keys(orders).find((key) => key === id);
*/


  useEffect(()=>{
    const ord = Object.keys(orders).find((key) => key === id);

    if (ord){
      const foundOrd = {[ord]:orders[ord]}
      setOrder(foundOrd)

      console.log(foundOrd)
    }

  },[orders])



  if (Object.keys(order).length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 text-center">
        <h1 className="text-2xl font-serif text-nude-900">Order not found</h1>
        <Link to="/account/orders" className="text-nude-500 hover:text-nude-700 mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }
  else{
    const currentStepIndex = statusSteps.findIndex((s) => s.key === order[id][0].status);

    return (

        <div className="min-h-screen bg-cream-50 pt-24 pb-20">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-nude-600 hover:text-nude-800 mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Orders
            </button>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-serif text-nude-900">{id}</h1>
                  {/*<Badge className={statusColors[order[id][0]['status']]}>
                {statusLabels[order[id][0].status]}
              </Badge>*/}
                </div>
                <p className="text-nude-600">
                  Ordered on {new Date(order[id][0].created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                </p>
              </div>
              <Link to="/account/complaint">
                <Button variant="outline" className="border-nude-300 text-nude-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Need Help?
                </Button>
              </Link>
            </div>

            {/* Progress */}
            {order[id][0].status !== 'cancelled' && (
                <div className="bg-white rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                          <div key={step.key} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                      isCompleted
                                          ? 'bg-nude-500 text-white'
                                          : 'bg-nude-100 text-nude-400'
                                  } ${isCurrent ? 'ring-4 ring-nude-200' : ''}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <span
                                  className={`text-sm ${
                                      isCompleted ? 'text-nude-900' : 'text-nude-400'
                                  }`}
                              >
                        {step.label}
                      </span>
                            </div>
                            {index < statusSteps.length - 1 && (
                                <div
                                    className={`w-16 sm:w-24 h-1 mx-2 ${
                                        index < currentStepIndex ? 'bg-nude-500' : 'bg-nude-100'
                                    }`}
                                />
                            )}
                          </div>
                      );
                    })}
                  </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-serif text-nude-900 mb-6">Order Items</h2>
                  <div className="space-y-6">
                    {order[id]?.map((item, index) => {
                      return (
                          <div key={index} className="flex gap-4">
                            <div className="w-24 h-24 bg-nude-100 rounded-xl overflow-hidden flex-shrink-0">

                                  <img
                                      src={`${import.meta.env.VITE_API_URL}/storage/${item.product.product_image}`}
                                      alt={item.product.product_image}
                                      className="w-full h-full object-cover"
                                  />
                              ) {/*: (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-8 w-8 text-nude-400" />
                                  </div>
                              )}*/}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-nude-900">{item.product.title}</h3>
                              <p className="text-nude-500 text-sm mt-1">Quantity: {item.quantity}</p>
                              <p className="font-semibold text-nude-800 mt-2">
                                ₦{(item.product.price * item.quantity)?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-serif text-nude-900 mb-4">Shipping Address</h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-nude-500 mt-1" />
                    <div>
                      <p className="text-nude-900">{order[id][0].delivery_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-serif text-nude-900 mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-nude-600">
                      <span>Subtotal</span>
                      <span>₦{parseInt(order[id][0].total_price)?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-nude-600">
                      <span>Shipping</span>
                      <span className="text-sage-600">₦{(parseInt(order[id][0].total_price) * 0.00008)?.toFixed(2)}</span>
                    </div>
                    {/*<div className="flex justify-between text-nude-600">
                      <span>Tax</span>
                      <span>${(order.total * 0.08)?.toFixed(2)}</span>
                    </div>*/}
                  </div>

                  <Separator className="bg-nude-200 mb-6" />

                  <div className="flex justify-between text-lg font-semibold text-nude-900 mb-6">
                    <span>Total</span>
                    <span>₦{(parseInt(order[id][0].total_price) * 1.08)?.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-xl">
                    <CreditCard className="h-5 w-5 text-nude-500" />
                    <div>
                      <p className="text-sm text-nude-900">{order.paymentMethod}</p>
                      <p className="text-xs text-nude-500">Payment completed</p>
                    </div>
                  </div>

                  {order.status === 'delivered' && (
                      <Link to="/account/complaint">
                        <Button variant="outline" className="w-full mt-4 border-nude-300 text-nude-700">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Report an Issue
                        </Button>
                      </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }


}
