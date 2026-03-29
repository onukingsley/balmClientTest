import {useEffect, useState} from 'react';
import { orders } from '../../data/mockData';
import { Search, Package, Check, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {AdminOrderStore} from "@/store/store.jsx";

export default function DeliveredOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);


  const {adminOrders,adminDeliveredOrders, totalRevenue} = AdminOrderStore()

  const [filteredOrder, setFilteredOrder] = useState(orders)



  useEffect(()=>{
    let ord = adminDeliveredOrders

    /*if (statusFilter === "all"){
      ord = pendingOrders
    } if (statusFilter === "processing"){
      ord = pendingOrders;
    } if (statusFilter === "delivered"){
      ord = deliveredOrders;
    } if (statusFilter === "cancelled"){
      ord = cancelledOrders
    }*/

    let filteredArray = {}
    if (searchQuery){
      Object.keys(ord).map((key)=>{

        let rer = key.toLowerCase().includes(searchQuery.toLowerCase())
        if (rer){
          filteredArray = {...filteredArray ,[key] : adminOrders[key]}
        }
        ord = filteredArray

      })


    }

    console.log(ord)

    if (!ord){

      setFilteredOrder(adminDeliveredOrders)


    }else {
      setFilteredOrder(ord)
    }

  },[searchQuery,adminDeliveredOrders])







  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-nude-900">Delivered Orders</h1>
          <p className="text-nude-600 mt-1">View completed orders and revenue</p>
        </div>
        <div className="bg-nude-100 rounded-xl px-6 py-3">
          <p className="text-sm text-nude-600">Total Revenue</p>
          <p className="text-2xl font-semibold text-nude-900">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="pl-12 border-nude-200"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-nude-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Items</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Order Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Delivered Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nude-100">
            {Object.keys(filteredOrder).map((key) => (
                <tr key={key} className="hover:bg-cream-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-nude-900">{key}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-nude-400" />
                      <span className="text-nude-700">{filteredOrder[key]?.length} item(s)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-nude-900">₦{parseInt(filteredOrder[key][0]?.total_price).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-sage-100 text-sage-700">
                      <Check className="h-3 w-3 mr-1" />
                      Delivered
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-nude-600">
                    {new Date(filteredOrder[key][0]?.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-nude-600">
                    {filteredOrder[key][0]?.deliveryDate
                      ? new Date(filteredOrder[key][0]?.deliveryDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(filteredOrder[key])}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent
                          className={`
      bg-white 
      w-[95vw]                  /* Force near full width on mobile */
      max-w-lg                  /* Cap on larger screens */
      sm:w-full 
      mx-auto 
      max-h-[92vh] 
      overflow-hidden 
      p-0 
      flex flex-col
      rounded-2xl
      shadow-xl
      z-50                      /* Ensure it's above everything */
    `}
                      >
                        {/* Fixed Header */}
                        <DialogHeader className="px-5 py-4 border-b border-nude-100 flex-shrink-0 bg-white">
                          <DialogTitle className="text-lg font-semibold text-nude-900">
                            Order Details - {key}
                          </DialogTitle>
                        </DialogHeader>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
                          {/* Your existing content goes here */}
                          <div className="space-y-6">
                            {/* Items */}
                            <div>
                              <p className="text-sm font-medium text-nude-500 mb-3">Items</p>
                              {filteredOrder[key]?.length > 0 ? (
                                  filteredOrder[key].map((item, idx) => (
                                      <div key={idx} className="flex justify-between py-3 border-b border-nude-100 last:border-b-0">
                                        <span className="text-nude-700 pr-4">{item.product?.title}</span>
                                        <span className="text-nude-600 font-medium">x{item.quantity}</span>
                                      </div>
                                  ))
                              ) : (
                                  <p className="text-nude-400">No items found</p>
                              )}
                            </div>

                            {/* Price */}
                            <div className="border-t border-nude-100 pt-4">
                              <div className="flex justify-between">
                                <span className="text-nude-600">Subtotal</span>
                                <span className="font-semibold text-nude-900">
              ₦{parseInt(filteredOrder[key]?.[0]?.total_price || 0).toLocaleString()}
            </span>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="border-t border-nude-100 pt-4">
                              <p className="text-sm text-nude-500 mb-2">Shipping Address</p>
                              <p className="text-nude-700 leading-relaxed">
                                {filteredOrder[key]?.[0]?.delivery_address || "No address provided"}
                              </p>
                            </div>

                            {/* User Details */}
                            <div className="border-t border-nude-100 pt-4">
                              <p className="text-sm text-nude-500 mb-3">Customer Details</p>
                              <div className="space-y-2 text-sm">
                                <div className="flex gap-x-3">
                                  <span className="text-nude-600 w-20">Name:</span>
                                  <span className="text-nude-700">{filteredOrder[key]?.[0]?.user?.name}</span>
                                </div>
                                <div className="flex gap-x-3">
                                  <span className="text-nude-600 w-20">Email:</span>
                                  <span className="text-nude-700">{filteredOrder[key]?.[0]?.user?.email}</span>
                                </div>
                                <div className="flex gap-x-3">
                                  <span className="text-nude-600 w-20">Phone:</span>
                                  <span className="text-nude-700">{filteredOrder[key]?.[0]?.user?.phone_number}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrder.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-nude-300 mx-auto mb-4" />
            <p className="text-nude-600">No delivered orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
