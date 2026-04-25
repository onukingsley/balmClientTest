import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import axiosClient from "@/service/axios_client.js";
import {cartStore, complaintStore, loadingStore, orderStore, productStore, userStore} from "@/store/store.jsx";
import {complaints} from "@/data/mockData.js";
import {useEffect} from "react";
import {Package,Loader2} from "lucide-react";
import Logo from "@/assets/images/logo6.png";
import echo from "@/echo.js";
import {Toaster} from "@/components/ui/sonner.js"
import {toast}  from "sonner";


export default function MainLayout() {

    const {setProduct,setBrand,setCategory,setLimitedProduct,setDiscountProduct,recommendedProduct,product,brand, category,discountProduct,setRecommendedProduct} = productStore()
    const {user} = userStore()
    const {setCart,setTotalPrice} = cartStore()
    const {updateConfirmedOrder,updateProcessingOrder,setOrders,setPendingOrders,setCancelledOrders,setDeliveredOrders} = orderStore()
    const {setComplaint} = complaintStore()
    const {setIsLoading,isLoading} = loadingStore()



    const showToast = (title,message) => {
        /*toast.success(message, {
            duration: 2000,
        })*/
        toast.success(title, {
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
        console.log(`ordConfirmed${user.id}`)
        // Subscribe to channel and listen for events
        const channel = echo.channel(`ordConfirmed${user.id}`);


        channel.listen('OrderConfirmed', (data) => {
            console.log('New order received:', data);
            updateConfirmedOrder(data.order[0].invoice_number)
            showToast("Order Confirmed!!",`Your Order with orderId: ${data.order[0].invoice_number} has been confirmed`)
           //alert(`User ${data.order.user_id} just ordered. orderId: ${data.order.invoice_number}`)
        });

        // Cleanup on unmount
        return () => {
            echo.leaveChannel('ord');
        };
    }, []);


  /*  useEffect(() => {
        // Add connection debugging
        echo.connector.pusher.connection.bind('connected', () => {
            console.log('✅ Connected to Reverb');
        });

        echo.connector.pusher.connection.bind('disconnected', () => {
            console.log('❌ Disconnected from Reverb');
        });

        echo.connector.pusher.connection.bind('error', (error) => {
            console.error('Connection error:', error);
        });

        echo.connector.pusher.connection.bind('state_change', (states) => {
            console.log('Connection state:', states.current);
        });

        // Subscribe to channel and listen for event
        const channel = echo.channel("ord");

        // Listen with the full event class name (without the leading dot)
        channel.listen('.App\\Events\\OrderPlaced', (e) => {
            console.log("New Order Placed:", e);
            console.log("Message:", e.message);
            alert('yo')
            // Access your data via e.message since you're passing message in constructor
        });

        // Alternative: Try with dot notation (sometimes required)
         // channel.listen('.App\\Events\\OrderPlaced', (e) => {
        //     console.log("New Order Placed:", e);
        // });

        // Log successful subscription
        channel.subscribed(() => {
            console.log('✅ Successfully subscribed to "ord" channel');
        });

        // Cleanup
        return () => {
            echo.leaveChannel("ord");
        };
    }, []);*/

    /* useEffect(()=>{
         setIsLoading(true)
         axiosClient.get('/getProduct')
             .then(({data})=>{
                 setProduct(data.product)
                 setCategory(data.category)
                 setBrand(data.brand)

                 setDiscountProduct()
                 setRecommendedProduct()
                 setLimitedProduct()

                 setIsLoading(false)

             })

         if (user){
             setIsLoading(true)
             axiosClient.get(`/getOverallIndex?user_id=${user.id}`)
                 .then(({data})=>{


                     setCart(data.data.cart)
                     setOrders(data.data.order)
                     setCancelledOrders(data.data.cancelledOrder)
                     setPendingOrders(data.data.PendingOrder)
                     setDeliveredOrders(data.data.Delivered)
                     setComplaint(data.data.complaint)
                     setTotalPrice()

                     setIsLoading(false)

                 }).catch((e)=> {
                 console.log(e)
                 setIsLoading(false)
             })
         }

     },[user])*/

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
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Header />
      <main className="flex-grow">
          <Toaster position={'top-right'}/>
          <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
