import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosClient from "@/service/axios_client.js";
import {userStore} from "@/store/store.jsx";

export default function Login() {

  const {setUser} = userStore()


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');


    axiosClient.post('/login',{email:formData.email, password:formData.password})
        .then((data)=>{
          console.log(data)
          if (data.status === 200) {
            setUser(data.data.user,data.data.token)
            if (data.data.user_role === '0') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          } else {
            setError(data.data.message);
          }
          setIsLoading(false);

        }).catch((e)=>{
          console.log(e.status)
          if (e.status == 402){
            setError("Deactivated User");
          }else {
            setError("Invalid User Credential");
          }

          setIsLoading(false)})



  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-nude-900 text-center mb-2">Welcome Back</h2>
      <p className="text-nude-500 text-center text-sm mb-8">
        Sign in to access your account and orders
      </p>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-2">
            Email Address
          </label>
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nude-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-nude-600">
            <input type="checkbox" className="rounded border-nude-300 text-nude-500 focus:ring-nude-500" />
            Remember me
          </label>
          <Link to="#" className="text-nude-500 hover:text-nude-700">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-nude-500 hover:bg-nude-600 text-white py-6"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Demo Credentials */}
      {/*<div className="mt-6 p-4 bg-nude-50 rounded-lg">
        <p className="text-xs text-nude-600 font-medium mb-2">Demo Credentials:</p>
        <div className="text-xs text-nude-500 space-y-1">
          <p><span className="font-medium">Admin:</span> admin@nextofskin.com / admin123</p>
          <p><span className="font-medium">User:</span> john@example.com / user123</p>
        </div>
      </div>*/}

      {/* Register Link */}
      <p className="mt-6 text-center text-nude-600 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-nude-500 hover:text-nude-700 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
