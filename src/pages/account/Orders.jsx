import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Package, ChevronRight, Search, RecycleIcon,  Filter, Trash2} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {orderStore, userStore} from "@/store/store.jsx";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.js";
import axiosClient from "@/service/axios_client.js";
import {Alert} from "@/components/ui/alert.js";

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


export default function Orders() {

  const {orders,updateProcessingOrder,pendingOrders,cancelledOrders,deliveredOrders,setSelectedOrder} = orderStore()
  const {user} = userStore()



  const [filteredOrder, setFilteredOrder] = useState(orders)




  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accountRefund, setAccountRefund] = useState('');
  const [bankName, setBankName] = useState('');


  useEffect(()=>{

    let ord

    if (statusFilter === "all"){
      ord = orders
    } if (statusFilter === "processing"){
      ord = pendingOrders;
    } if (statusFilter === "delivered"){
      ord = deliveredOrders;
    } if (statusFilter === "cancelled"){
      ord = cancelledOrders
    }

    let filteredArray = {}
    if (searchQuery){
      Object.keys(ord).map((key)=>{

        let rer = key.toLowerCase().includes(searchQuery.toLowerCase())
        if (rer){
          filteredArray = {...filteredArray ,[key] : orders[key]}
        }
        ord = filteredArray

        })


    }


    if (!ord){

        setFilteredOrder(orders)


    }else {
      setFilteredOrder(ord)
    }

  },[searchQuery,statusFilter,orders])

  useEffect( ()=>{
    const userDetails = async ()=>{
      const response =  await axiosClient.get('/user')

      console.log(response.data.account_number)
      if (response.data.account_number){
        const account = response.data.account_number?.split(',')
        console.log(account)
        setBankName(account[1])
        setAccountRefund(account[0])
      }

    }

    userDetails()

  },[])

  function updateCancelOrder(key) {

    /*if (bankName == "" && accountRefund == ""){
      alert('Please enter an account details and Bank Name')
      return
    }*/


    const payLoad = {
      invoice_number : key,
      status: 'cancelled',
      account:  `${accountRefund}, ${bankName}`,
      user_id: user.id
    }
    axiosClient.post('/cancelOrder',payLoad)
        .then(({data})=>{
          console.log(data)
          updateProcessingOrder(key)
        })
  }


/*
  const filteredOrders = Object.keys(orders).filter((key) => {
   console.log(key)
    const matchesSearch =
      key.includes(searchQuery.toLowerCase())
      /!*order.some((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));*!/
    const matchesStatus = statusFilter === 'all' || orders[key][0]?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
*/


  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <h1 className="text-3xl font-serif text-nude-900 mb-8">My Orders</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders Id"
              className="pl-12 border-nude-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-nude-200 rounded-lg bg-white text-nude-700 focus:outline-none focus:ring-2 focus:ring-nude-500"
          >
            <option value="all">All Status</option>
            {/*<option value="pending">Pending</option>*/}
            <option value="processing">Processing</option>
           {/* <option value="shipped">Shipped</option>*/}
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        { Object.keys(filteredOrder)?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Package className="h-16 w-16 text-nude-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-nude-900 mb-2">No orders found</h3>
            <p className="text-nude-600 mb-6">You haven't placed any orders yet.</p>
            <Link to="/products">
              <Button className="bg-nude-500 hover:bg-nude-600 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(filteredOrder)?.map((key) => (
              <div
                onClick={()=>{setSelectedOrder(key)}}
                className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-soft transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                          key={key}
                          to={`/account/orders/${key}`}
                          onClick={()=>{setSelectedOrder(key)}}
                      >

                        <h3 className="font-medium text-nude-900">{key}</h3>

                      </Link>

                      <Badge className={statusColors[filteredOrder[key][0].status]}>
                        {statusLabels[filteredOrder[key][0].status]}
                      </Badge>
                    </div>
                    <p className="text-nude-500 text-sm">
                      Ordered on {new Date(filteredOrder[key][0].created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-nude-900">₦{parseInt(filteredOrder[key][0].total_price).toLocaleString()}</p>
                    <p className="text-nude-500 text-sm">{filteredOrder[key].length} item(s)</p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex gap-4 overflow-auto pb-2">
                  {!filteredOrder[key].length == 0 && filteredOrder[key].map((item, index) => (
                    <div key={index} className="flex-shrink-0 flex items-center gap-3 bg-cream-50 rounded-lg p-3">
                      <div className="w-12 h-12 bg-nude-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-nude-400" />
                        <img
                            src={`${import.meta.env.VITE_API_URL}/storage/${item.product.product_image}`}
                            alt={item.product.product_image}
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-nude-900 text-sm">{item.product.title}</p>
                        <p className="text-nude-500 text-xs">Qty: {item.quantity}</p>
                        <p className="text-nude-500 text-xs">Price: {item.product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  {filteredOrder[key][0].refund == '1' &&
                      <button
                          onClick={()=>{}}
                          className="text-white  rounded-lg bg-nude-400 gap-x-2 flex items-center justify-center hover:text-rose-500 transition-colors p-1"
                      >
                        Awaiting Refund  <RecycleIcon className="h-4 w-4" />
                      </button>
                  }



                  {
                    filteredOrder[key][0].status == 'processing' &&
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                              onClick={()=>{}}
                              className="text-white  rounded-lg bg-red-500 gap-x-2 flex items-center justify-center hover:text-rose-500 transition-colors p-1"
                          >
                            Cancel Order  <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                          </AlertDialogHeader>

                          <AlertDialogDescription>

                            Confirm Order to be Cancelled
                            <div>
                              <label className="text-sm text-nude-700 mb-2 block">Account Number *</label>
                              <Input
                                  value={accountRefund}
                                  onChange={(e) => setAccountRefund( e.target.value )}
                                  placeholder="Enter Account to be credited"
                                  className="border-nude-200"
                                  required
                              />
                            </div>
                            <div>
                              <label className="text-sm text-nude-700 mb-2 block">Bank Name *</label>
                              <Input
                                  value={bankName}
                                  onChange={(e) => setBankName( e.target.value )}
                                  placeholder="Enter Bank Name eg- kuda"
                                  className="border-nude-200"
                                  required
                              />
                            </div>


                          </AlertDialogDescription>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              No
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={()=>{updateCancelOrder(key)}}>
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>

                        </AlertDialogContent>
                      </AlertDialog>
                  }

                  <span className="text-nude-500 text-sm flex items-center gap-1">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
