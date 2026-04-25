import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {states} from "@/data/mockData.js";
import axiosClient from "@/service/axios_client.js";
import {userStore} from "@/store/store.jsx";



export default function Register() {

  const {setUser} = userStore()


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone,
      address: formData.address,
      /*city: formData.city,
      state: formData.state,*/
      image: formData.image,
    }



    axiosClient.post("/register", payload,{
      headers: {
        "Content-Type": "multipart/form-data",
      }})
        .then((data) => {
          console.log(data)
          setUser(data.data.user,data.data.token)
          if (data.status == 200) {
            navigate('/');
          } else {
            setError(data.data.message);
          }

          setIsLoading(false);
        }).catch((e) => {
      console.log(e)
      setError(e)
      setIsLoading(false)

    })

  }

  return (
    <div>
      <h2 className="text-2xl font-serif text-nude-900 text-center mb-2">Create Account</h2>
      <p className="text-nude-500 text-center text-sm mb-6">
        Join us for exclusive offers and personalized skincare
      </p>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-nude-100 flex items-center justify-center overflow-hidden border-2 border-nude-200">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-nude-400" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-nude-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-nude-600 transition-colors">
              <Camera className="h-4 w-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full pl-12 pr-4 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-1">Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              className="w-full pl-12 pr-4 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            />
          </div>
        </div>

        {/* City & State */}
       {/* <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-nude-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              className="w-full px-4 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-nude-700 mb-1">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            >
              <option value="">Select</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>*/}

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full pl-12 pr-12 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-nude-400 hover:text-nude-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full pl-12 pr-12 py-3 bg-nude-50 border border-nude-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nude-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-nude-400 hover:text-nude-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-nude-500 hover:bg-nude-600 text-white py-6 mt-2"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-nude-600 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-nude-500 hover:text-nude-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
