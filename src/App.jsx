import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import DeliveryAddress from './pages/DeliveryAddress';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Account Pages
import Profile from './pages/account/Profile';
import Orders from './pages/account/Orders';
import OrderDetail from './pages/account/OrderDetail';
import Complaint from './pages/account/Complaint';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import PendingOrders from './pages/admin/PendingOrders';
import DeliveredOrders from './pages/admin/DeliveredOrders';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import Reports from './pages/admin/Reports';
import AdminComplaints from './pages/admin/Complaints';
import UserManagement from './pages/admin/UserManagement';
import Cancelled from "@/pages/admin/Cancelled.jsx";
import AwaitingRefund from "@/pages/admin/AwaitingRefund.jsx";
import Category from "@/pages/admin/Category.jsx";
import AddCategory from "@/pages/admin/AddCategory.jsx";
import EditCategory from "@/pages/admin/EditCategory.jsx";
import Brand from "@/pages/admin/Brand.jsx";
import AddBrand from "@/pages/admin/AddBrand.jsx";
import EditBrand from "@/pages/admin/EditBrand.jsx";

function App() {
  return (


        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Main Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />

              {/*todo: checkoutPage*/}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/delivery-address" element={<DeliveryAddress />} />
              
              {/* Account Routes */}
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/orders" element={<Orders />} />
              <Route path="/account/orders/:id" element={<OrderDetail />} />

              {/*todo*/}
              <Route path="/account/complaint" element={<Complaint />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/pending-orders" element={<PendingOrders />} />
              <Route path="/admin/delivered-orders" element={<DeliveredOrders />} />
              <Route path="/admin/cancelled" element={<Cancelled />} />
              <Route path="/admin/awaitingRefund" element={<AwaitingRefund />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/add" element={<AddProduct />} />
              <Route path="/admin/products/edit/:id" element={<EditProduct />} />

              {/*category*/}
              <Route path="/admin/category" element={<Category />} />
              <Route path="/admin/category/add" element={<AddCategory />} />
              <Route path="/admin/category/edit/:id" element={<EditCategory />} />

              <Route path="/admin/brand" element={<Brand />} />
              <Route path="/admin/brand/add" element={<AddBrand />} />
              <Route path="/admin/brand/edit/:id" element={<EditBrand />} />

              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
          </Routes>
        </Router>

  );
}

export default App;
