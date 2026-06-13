import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import logo from '../../craftofy_logo.png';

const schema = Yup.object({
  name: Yup.string().min(2, 'Name too short').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number').required('Mobile number is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
});

function Field({ name, label, type = 'text', placeholder, autoComplete, formik }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <input type={type} name={name} autoComplete={autoComplete} value={formik.values[name]}
        onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${formik.touched[name] && formik.errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
      />
      {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>}
    </div>
  );
}

function Signup({ onLogin }) {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', password: '', confirm: '' },
    validationSchema: schema,
    onSubmit: (values, { setFieldError }) => {
      const users = JSON.parse(localStorage.getItem('craftofy_users') || '[]');
      if (users.find(u => u.email === values.email)) { setFieldError('email', 'This email is already registered'); return; }
      const newUser = { name: values.name, email: values.email, phone: values.phone };
      users.push({ ...newUser, password: values.password });
      localStorage.setItem('craftofy_users', JSON.stringify(users));
      localStorage.setItem('craftofy_user', JSON.stringify(newUser));
      onLogin(newUser);
      navigate('/profile');
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Craftofy" className="w-14 h-14 object-contain mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Craftofy — free forever</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field name="name" label="Full Name" placeholder="Ramesh Sharma" autoComplete="name" formik={formik} />
          <Field name="email" label="Email Address" type="email" placeholder="you@example.com" autoComplete="email" formik={formik} />
          <Field name="phone" label="Mobile Number" placeholder="9876543210" autoComplete="tel" formik={formik} />
          <Field name="password" label="Password" type="password" placeholder="Min. 6 characters" autoComplete="new-password" formik={formik} />
          <Field name="confirm" label="Confirm Password" type="password" placeholder="Re-enter password" autoComplete="new-password" formik={formik} />
          <button type="submit" disabled={formik.isSubmitting} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition mt-1">
            {formik.isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account? <Link to="/login" className="text-green-700 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
