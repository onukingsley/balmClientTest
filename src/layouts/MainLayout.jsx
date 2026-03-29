import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import axiosClient from "@/service/axios_client.js";
import {cartStore, complaintStore, orderStore, productStore, userStore} from "@/store/store.jsx";
import {complaints} from "@/data/mockData.js";
import {useEffect} from "react";

export default function MainLayout() {

    const {setProduct,setBrand,setCategory,setLimitedProduct,setDiscountProduct,recommendedProduct,product,brand, category,discountProduct,setRecommendedProduct} = productStore()
    const {user} = userStore()
    const {setCart,setTotalPrice} = cartStore()
    const {setOrders,setPendingOrders,setCancelledOrders,setDeliveredOrders} = orderStore()
    const {setComplaint} = complaintStore()



    useEffect(()=>{
        axiosClient.get('/getProduct')
            .then(({data})=>{
                setProduct(data.product)
                setCategory(data.category)
                setBrand(data.brand)

                setDiscountProduct()
                setRecommendedProduct()
                setLimitedProduct()


            })

        if (user){
            axiosClient.get(`/getOverallIndex?user_id=${user.id}`)
                .then(({data})=>{

                    setCart(data.data.cart)
                    setOrders(data.data.order)
                    setCancelledOrders(data.data.cancelledOrder)
                    setPendingOrders(data.data.PendingOrder)
                    setDeliveredOrders(data.data.Delivered)
                    setComplaint(data.data.complaint)
                    setTotalPrice()


                }).catch(e=>console.log(e))
        }

    },[user])



  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
