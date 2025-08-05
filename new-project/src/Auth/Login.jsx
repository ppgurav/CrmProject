// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import {
//   Menu,
//   Eye,
//   EyeOff,
// } from 'lucide-react';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// const Login = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   // Mutation
//   const loginMutation = useMutation({
//     mutationFn: async (data) => {
//       const res = await fetch(`${BASE_URL}/api/users/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || 'Login failed');
//       }

//       return res.json();
//     },
//     onSuccess: (data) => {
//       // Save token or user info if needed
//       localStorage.setItem('token', data.token);
//       navigate('/customers');
//     },
//     onError: (error) => {
//       alert(error.message);
//     },
//   });

//   const onSubmit = (data) => {
//     loginMutation.mutate(data);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
//       <div className="min-h-screen flex">
//         {/* Left Side - Decorative */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 relative overflow-hidden">
//           <div className="absolute inset-0">
//             <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-bounce"></div>
//             <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-300/15 rounded-full blur-2xl animate-pulse delay-2000"></div>
//           </div>
//           <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
//             <div className="mb-8">
//               <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
//                 <Menu className="w-10 h-10" />
//               </div>
//               <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
//               <p className="text-xl text-white/80 leading-relaxed">
//                 Sign in to access your dashboard and manage your projects with our powerful tools.
//               </p>
//             </div>
//             <div className="flex items-center justify-center space-x-8 mt-12">
//               <div className="text-center">
//                 <div className="text-3xl font-bold">10K+</div>
//                 <div className="text-white/70">Active Users</div>
//               </div>
//               <div className="w-px h-12 bg-white/30"></div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold">99.9%</div>
//                 <div className="text-white/70">Uptime</div>
//               </div>
//               <div className="w-px h-12 bg-white/30"></div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold">24/7</div>
//                 <div className="text-white/70">Support</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//           <div className="w-full max-w-md">
//             {/* Mobile Logo */}
//             <div className="lg:hidden text-center mb-8">
//               <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <Menu className="w-8 h-8 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
//             </div>

//             <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 border border-gray-100">
//               <div className="hidden lg:block text-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
//                 <p className="text-gray-600">Enter your credentials to access your account</p>
//               </div>

//               <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     id="email"
//                     {...register('email')}
//                     className="peer w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 placeholder-transparent bg-gray-50 focus:bg-white"
//                     placeholder="Email address"
//                   />
//                   <label
//                     htmlFor="email"
//                     className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white"
//                   >
//                     Email address
//                   </label>
//                   {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
//                 </div>

//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     {...register('password')}
//                     className="peer w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 placeholder-transparent bg-gray-50 focus:bg-white"
//                     placeholder="Password"
//                   />
//                   <label
//                     htmlFor="password"
//                     className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white"
//                   >
//                     Password
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                   {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
//                     />
//                     <span className="ml-2 text-sm text-gray-600">Remember me</span>
//                   </label>
//                   <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
//                     Forgot password?
//                   </a>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loginMutation.isLoading}
//                   className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
//                 >
//                   {loginMutation.isLoading ? 'Signing in...' : 'Sign In'}
//                 </button>
//               </form>
//             </div>

//             <div className="text-center mt-8 text-sm text-gray-500">
//               <p>&copy; 2024 Your Company. All rights reserved.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Menu, Eye, EyeOff } from 'lucide-react';


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    const validEmail = 'admin@technfest.com';
    const validPassword = 'Admin@17854';

    if (data.email === validEmail && data.password === validPassword) {

      navigate('/leadform'); // ✅ Navigate to the lead page
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="min-h-screen flex">
        {/* Left Side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-300/15 rounded-full blur-2xl animate-pulse delay-2000"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Menu className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Sign in to access your dashboard and manage your projects with our powerful tools.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-white/70">Active Users</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-white/70">Uptime</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/70">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Menu className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 border border-gray-100">
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Enter your credentials to access your account</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    defaultValue="admin@technfest.com"
                    {...register('email')}
                    className="peer w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 placeholder-transparent bg-gray-50 focus:bg-white"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white"
                  >
                    Email address
                  </label>
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    defaultValue="Admin@17854"
                    {...register('password')}
                    className="peer w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 placeholder-transparent bg-gray-50 focus:bg-white"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 peer-focus:bg-white"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </button>
              </form>
            </div>

            <div className="text-center mt-8 text-sm text-gray-500">
              <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
