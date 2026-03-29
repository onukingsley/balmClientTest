import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Edit2, Package, Heart, MessageSquare, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {cartStore, userStore} from "@/store/store.jsx";
import axiosClient from "@/service/axios_client.js";

export default function Profile() {
/*
  const { user, updateProfile, logout } = userStore();
*/
  const { user, updateUser, logoutUser } = userStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
  });
  const [previewImage, setPreviewImage] = useState(user?.avatar || null);

  const navigate = useNavigate();
  const {clearCart} = cartStore()

  useEffect(()=>{
      setPreviewImage(user.image)
  },[user])


  const handleLogout = () => {
    logoutUser();
    clearCart()
    navigate('/');
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {

    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      address: formData.address,
      /*city: formData.city,
      state: formData.state,*/
      image: formData.image,
      user_id: user.id
    }

    axiosClient.post("/updateProfile",payload,{
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((data)=>{
        updateUser(data.data.user)

      if (data.status == 200) {
        alert('Profile Updated Successfully')
      } else {
       alert(data.data.message);
      }
      setIsEditing(false);

    }).catch((e) => {
      console.log(e)

      setIsEditing(false);

    })



  };

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/account/orders' },
    { icon: Heart, label: 'Wishlist', href: '#' },
    { icon: MessageSquare, label: 'Complaints', href: '/account/complaint' },
  ];

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <h1 className="text-3xl font-serif text-nude-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-nude-200 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img                         src={`${import.meta.env.VITE_API_URL}/storage/${previewImage}`}
                                                   alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-medium text-nude-700">
                        {user?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-nude-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-nude-600 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h2 className="font-medium text-nude-900">{user?.name}</h2>
                  <p className="text-nude-500 text-sm">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg text-nude-700 hover:bg-nude-50 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-nude-900">Personal Information</h2>
                <Button
                  variant="outline"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="border-nude-300 text-nude-700"
                >
                  {isEditing ? (
                    'Save Changes'
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-nude-600 mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="pl-12 border-nude-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-nude-600 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-12 border-nude-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-nude-600 mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-12 border-nude-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-nude-600 mb-2 block">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      className="pl-12 border-nude-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-nude-600 mb-2 block">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!isEditing}
                    className="border-nude-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-nude-600 mb-2 block">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    disabled={!isEditing}
                    className="border-nude-200"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-nude-100">
                <h3 className="text-lg font-serif text-nude-900 mb-4">Account Settings</h3>
                <div className="flex flex-wrap gap-4">
                  <Link to="/delivery-address">
                    <Button variant="outline" className="border-nude-300 text-nude-700">
                      Manage Addresses
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-nude-300 text-nude-700">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
