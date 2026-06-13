import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import logo from '../../craftofy_logo.png';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

function Login({ onLogin }) {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: (values, { setFieldError }) => {
      const users = JSON.parse(localStorage.getItem('craftofy_users') || '[]');
      const user = users.find(u => u.email === values.email && u.password === values.password);
      if (!user) { setFieldError('password', 'Incorrect email or password'); return; }
      const sessionUser = { name: user.name, email: user.email, phone: user.phone };
      localStorage.setItem('craftofy_user', JSON.stringify(sessionUser));
      onLogin(sessionUser);
      navigate('/profile');
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-7">
          <img src={logo} alt="Craftofy" className="w-16 h-16 object-contain mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your Craftofy account</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
          {[
            { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', autoComplete: 'current-password' },
          ].map(({ name, label, type, placeholder, autoComplete }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
              <input type={type} name={name} autoComplete={autoComplete} value={formik.values[name]}
                onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder={placeholder}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${formik.touched[name] && formik.errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
              />
              {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>}
            </div>
          ))}
          <button type="submit" disabled={formik.isSubmitting} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition mt-1">
            {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center text-xs text-gray-400"><span className="bg-white px-3">New to Craftofy?</span></div>
        </div>
        <Link to="/signup" className="block w-full text-center border-2 border-green-700 text-green-700 font-bold py-2.5 rounded-xl hover:bg-green-50 transition text-sm">Create Free Account</Link>
      </div>
    </div>
  );
}

export default Login;
