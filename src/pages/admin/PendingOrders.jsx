import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../../data/mockData';
import { Search, Filter, Package, Truck, Check, X, Eye } from 'lucide-react';
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
import {AdminOrderStore, orderStore} from "@/store/store.jsx";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.js";
import axiosClient from "@/service/axios_client.js";

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
};

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
};

export default function PendingOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {adminOrders,updateProcessingOrder,adminPendingOrders} = AdminOrderStore()

  const [filteredOrder, setFilteredOrder] = useState(orders)


  useEffect(()=>{
    let ord = adminPendingOrders

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

      setFilteredOrder(adminPendingOrders)


    }else {
      setFilteredOrder(ord)
    }

  },[searchQuery,statusFilter,adminPendingOrders])




 /* const filteredOrders = pendingOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });*/

  const handleStatusUpdate = (orderId) => {
    // In a real app, this would update the order status
      console.log(orderId)

      axiosClient.post('/updateOrder',{order_id: orderId, status: 'delivered'})
          .then(({data})=>{
            console.log(data, 'updated order')
            updateProcessingOrder(orderId)
          })

  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-nude-900">Pending Orders</h1>
          <p className="text-nude-600 mt-1">Manage and track active orders</p>
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
        {/*<select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-nude-200 rounded-lg bg-white text-nude-700 focus:outline-none focus:ring-2 focus:ring-nude-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
        </select>*/}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">


        {Object.keys(filteredOrder).length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-nude-300 mx-auto mb-4" />
            <p className="text-nude-600">No pending orders found</p>
          </div>
        )
        : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-nude-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Items</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-nude-700">Date</th>
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
                            <Badge className={statusColors[filteredOrder[key][0]?.status]}>
                              {statusLabels[filteredOrder[key][0]?.status]}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-nude-600">
                            {new Date(filteredOrder[key][0]?.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
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

                                <DialogContent className="bg-white w-[95vw] max-w-lg sm:max-w-xl mx-auto max-h-[90vh] overflow-hidden p-0 flex flex-col rounded-2xl">

                                  {/* Header - Fixed */}
                                  <DialogHeader className="px-6 py-5 border-b border-nude-100 flex-shrink-0">
                                    <DialogTitle className="text-xl font-semibold text-nude-900">
                                      Order Details - {key}
                                    </DialogTitle>
                                  </DialogHeader>

                                  {/* Scrollable Content Area */}
                                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    <div className="space-y-6">

                                      {/* Items Section */}
                                      <div>
                                        <p className="text-sm text-nude-500 mb-3 font-medium">Items</p>
                                        {filteredOrder[key]?.length > 0 ? (
                                            filteredOrder[key].map((item, idx) => (
                                                <div key={idx} className="flex justify-between py-3 border-b border-nude-100 last:border-b-0">
                                                  <span className="text-nude-700">{item.product?.title}</span>
                                                  <span className="text-nude-600 font-medium">x{item.quantity}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-nude-400 italic">No items found</p>
                                        )}
                                      </div>

                                      {/* Delivery Address */}
                                      <div className="border-t border-nude-100 pt-4">
                                        <p className="text-sm text-nude-500 mb-2">Delivery Address</p>
                                        <p className="text-nude-700 leading-relaxed">
                                          {filteredOrder[key]?.[0]?.delivery_address || "No address provided"}
                                        </p>
                                      </div>

                                      {/* Payment Method */}
                                      <div className="border-t border-nude-100 pt-4">
                                        <p className="text-sm text-nude-500 mb-2">Payment Method</p>
                                        <p className="text-nude-700">Paystack</p>
                                      </div>

                                      {/* User Details */}
                                      <div className="border-t border-nude-100 pt-4">
                                        <p className="text-sm text-nude-500 mb-3">Customer Details</p>
                                        <div className="space-y-3 text-sm">
                                          <div className="flex gap-x-3">
                                            <span className="text-nude-600 w-28">Customer:</span>
                                            <span className="text-nude-700">{filteredOrder[key]?.[0]?.user?.name}</span>
                                          </div>
                                          <div className="flex gap-x-3">
                                            <span className="text-nude-600 w-28">Email Address:</span>
                                            <span className="text-nude-700">{filteredOrder[key]?.[0]?.user?.email}</span>
                                          </div>
                                          <div className="flex gap-x-3">
                                            <span className="text-nude-600 w-28">Contact:</span>
                                            <span className="text-nude-700">{filteredOrder[key]?.[0]?.user?.phone_number}</span>
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                  </div>


                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedOrder(filteredOrder[key])}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white max-w-lg">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                                  </AlertDialogHeader>

                                  <AlertDialogDescription>

                                      Confirm this order has been delivered


                                  </AlertDialogDescription>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      No
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={()=>{handleStatusUpdate(key)}}>
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>

                                </AlertDialogContent>
                              </AlertDialog>



                             {/* {filteredOrder[key][0]?.status === 'processing' && (
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStatusUpdate(key, 'processing')}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Package className="h-4 w-4" />
                                  </Button>
                              )}*/}

                              {/* {order.status === 'processing' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'shipped')}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}

                      {order.status === 'shipped' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          className="text-sage-600 hover:text-sage-700 hover:bg-sage-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}*/}
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )

        }
      </div>
    </div>
  );
}
