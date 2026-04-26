import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Recycle,
  RemoveFormatting,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Users,
    BookCheck,
  Book,
  LogOut,
  Menu,
  X,
  ChevronRight, LogsIcon, Loader2,
} from 'lucide-react';
import {useEffect, useState} from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  adminComplaintStore,
  AdminOrderStore,
  adminRefund,
  AdminUserStore, loadingStore,
  productStore,
  userStore
} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";
import Logo from "@/assets/images/logo6.png";
import echo from "@/echo.js";
import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner.js";



const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Pending Orders', href: '/admin/pending-orders', icon: ShoppingBag },
  { name: 'Confirmed Orders', href: '/admin/confirmed-orders', icon: BookCheck },
  { name: 'Delivered Orders', href: '/admin/delivered-orders', icon: CheckCircle },
  { name: 'Cancelled Orders', href: '/admin/cancelled', icon: RemoveFormatting },
  { name: 'Awaiting Refund', href: '/admin/awaitingRefund', icon: Recycle },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Category', href: '/admin/category', icon: LogsIcon },
  { name: 'Brand', href: '/admin/brand', icon: Book  },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Complaints', href: '/admin/complaints', icon: MessageSquare },
  { name: 'User Management', href: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const { logoutUser, user } = userStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {addAdminOrders,updateCancelOrder,setAdminOrders,setTotalRevenue,setAwaitingRefund, setAdminCancelledOrders, setAdminDeliveredOrders, setAdminPendingOrders} = AdminOrderStore()
  const {setUsers} = AdminUserStore()
  const {setRefund} = adminRefund()
  const {setProduct,setCategory,setBrand} = productStore()
  const {setUserComplaint,setUserPendingComplaint} = adminComplaintStore()

  const {isLoading, setIsLoading} = loadingStore()

  const showToast = (title,message) => {
    /*toast.success(message, {
        duration: 2000,
    })*/
    toast.success(title, {
      description: message,
      duration: 10000,
    })
  }
  const showRedToast = (title,message) => {
    /*toast.success(message, {
        duration: 2000,
    })*/
    toast.error(title, {
      description: message,
      duration: 10000,
    })
  }


  useEffect(() => {
    // Connection debugging
    echo.connector.pusher.connection.bind('connected', () => {
      console.log('✅ Connected to Reverb');
    });

    echo.connector.pusher.connection.bind('error', (error) => {
      console.error('Connection error:', error);
    });

    // Subscribe to channel and listen for events
    const channel = echo.channel('ord');

    channel.listen('OrderPlaced', (data) => {
      console.log('New order received:', data.order[0]);

      showToast("New Order!!",`User ${data.order[0].user_id} just ordered. orderId: ${data.order[0].invoice_number}`)
      addAdminOrders(data.order,data.order[0].invoice_number)
      //alert(`User ${data.order.user_id} just ordered. orderId: ${data.order.invoice_number}`)
    });

    echo.channel('ordCancel')
        .listen('OrderCanelled',(data)=>{
          console.log('New order received:', data.order[0]);
          updateCancelOrder(data.order[0].invoice_number)
          showToast("OrderCancelled!!",`User ${data.order[0].user_id} has requested orderId: ${data.order[0].invoice_number} to be Cancelled`)
        })

    // Cleanup on unmount
    return () => {
      echo.leaveChannel('ord');
    };
  }, []);


  /*useEffect(()=>{
    setIsLoading(true)
    axiosClient.get('/getOverallAdmin')
        .then(({data})=>{

          if (user){
            setAdminOrders(data.data.orders)
            setAdminPendingOrders(data.data.pendingOrder)
            setAdminDeliveredOrders(data.data.deliveredOrder)
            setAdminCancelledOrders(data.data.cancelledOrder)

            setUsers(data.data.userManagement)
            setUserComplaint(data.data.allComplaint)
            setUserPendingComplaint(data.data.pendingComplaint)
            setRefund(data.data.awaitingRefund)
            console.log(data.data.totalRevenue)
            setTotalRevenue(data.data.totalRevenue)
            setAwaitingRefund(data.data.awaitingRefund)
            setProduct(data.data.products)
            setCategory(data.data.category)
            setBrand(data.data.brand)

            console.log(data.data.brand)
            setIsLoading(false)


          }


    }).catch((e)=> {
      console.log(e)
      setIsLoading(false)
    })
  },[user])*/



  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };




  if (isLoading) {
    return (
        <div className="flex flex-col items-center h-screen justify-center py-20">
          <img
              src= {Logo}
              alt="logo"
              className="w-[200px] h-[200px] object-cover bg-transparent"
          />
          <Loader2 className="h-12 w-12 text-nude-300 mb-4 animate-spin" />
          <p className="text-nude-600">Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-nude-200 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-nude-200">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-semibold text-nude-800">Next of</span>
            <span className="text-2xl font-serif font-light text-nude-500">Skin</span>
          </Link>
          <p className="text-xs text-nude-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-nude-100 text-nude-800'
                    : 'text-nude-600 hover:bg-nude-50 hover:text-nude-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.name}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-nude-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-nude-200 flex items-center justify-center">
              <span className="text-nude-700 font-medium">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-nude-800 truncate">{user?.name}</p>
              <p className="text-xs text-nude-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-nude-300 text-nude-700 hover:bg-nude-100"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-nude-200 z-50">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-semibold text-nude-800">Next of</span>
            <span className="text-xl font-serif font-light text-nude-500">Skin</span>
          </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-72 bg-white p-0 flex flex-col h-full max-h-screen overflow-hidden"
            >
              {/* Fixed Header */}
              <div className="p-6 border-b border-nude-200 flex-shrink-0">
                <span className="text-2xl font-serif font-semibold text-nude-800">Next of</span>
                <span className="text-2xl font-serif font-light text-nude-500">Skin</span>
                <p className="text-xs text-nude-500 mt-1">Admin Panel</p>
              </div>

              {/* Scrollable Navigation Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;

                  return (
                      <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                  ? 'bg-nude-100 text-nude-800'
                                  : 'text-nude-600 hover:bg-nude-50 hover:text-nude-800'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                  );
                })}
              </div>

              {/* Fixed Footer (Logout Button) */}
              <div className="p-4 border-t border-nude-200 flex-shrink-0">
                <Button
                    variant="outline"
                    className="w-full border-nude-300 text-nude-700 hover:bg-nude-100"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <Toaster position='top-right'/>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
