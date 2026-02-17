import React from 'react';
import Helmet from 'react-helmet';
import { useForm } from '@inertiajs/react';
import Logo from '@/Shared/Logo';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SIDE_IMAGE_URL from '../../../images/alramz_tower.jpg';

// You can replace this with your own image path
 
export default () => {
  const { data, setData, errors, post, processing } = useForm({
    email: 'b.mansour@alramzre.com',
    password: 'secret',
    remember: true
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('login.attempt'));
  }

  return (
    <div className="min-h-screen flex bg-black">
      <Helmet title="Login" />
      {/* Left: Login Form */}
      <div className="flex flex-col justify-center w-full max-w-xl px-8 py-12 bg-black shadow-2xl md:w-1/2">
        <Logo
          className="block w-full max-w-xs mx-auto text-white fill-current"
          height={50}
        />
        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <h1 className="text-3xl font-bold text-center text-white">Welcome Back!</h1>
          <div className="w-24 mx-auto mt-6 border-b-2 border-white" />
          <TextInput
            className="mt-10"
            label="Email"
            name="email"
            type="email"
            errors={errors.email}
            value={data.email}
            onChange={e => setData('email', e.target.value)}
          />
          <TextInput
            className="mt-6"
            label="Password"
            name="password"
            type="password"
            errors={errors.password}
            value={data.password}
            onChange={e => setData('password', e.target.value)}
          />
          <label
            className="flex items-center mt-6 select-none"
            htmlFor="remember"
          >
            <input
              name="remember"
              id="remember"
              className="mr-1"
              type="checkbox"
              checked={data.remember}
              onChange={e => setData('remember', e.target.checked)}
            />
            <span className="text-sm text-white">Remember Me</span>
          </label>
          <div className="flex items-center justify-between mt-8">
            <a className="hover:underline text-sm text-white" tabIndex="-1" href="#reset-password">
              Forgot password?
            </a>
            <LoadingButton
              type="submit"
              loading={processing}
              className="px-6 py-3 rounded bg-white text-black text-sm font-bold whitespace-nowrap hover:bg-gray-200 focus:bg-gray-200"
            >
              Login
            </LoadingButton>
          </div>
        </form>
      </div>
      {/* Right: Image */}
      <div className="hidden md:flex flex-1 h-screen">
        <img
          src={SIDE_IMAGE_URL}
          alt="Welcome"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};
