import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/signup', {
        email: data.email,
        password: data.password,
        confirmedPassword: data.confirmPassword,
      });

      navigate('/signin');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 max-w-md mx-auto'
    >
      {/* Email */}
      <div className='form-control flex flex-col'>
        <label htmlFor='email' className='label'>
          <span className='label-text'>Email</span>
        </label>

        <input
          type='email'
          id='email'
          className=' input input-bordered w-full'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Invalid email format',
            },
          })}
        />
        {errors.email && (
          <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className='form-control flex flex-col'>
        <label htmlFor='password' className='label'>
          <span className='label-text'>Password</span>
        </label>
        <input
          type={showPassword ? "text" : "password" }
          id='password'
          className=' input input-bordered w-full'
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className='form-control flex flex-col'>
        <label htmlFor='confirmPassword' className='label'>
          <span className='label-text'>Confirm Password</span>
        </label>
        <input
          type={showPassword ? "text" : "password" }
          id='confirmPassword'
          className=' input input-bordered w-full'
          {...register('confirmPassword', {
            required: 'Password is required',
            validate: (value) => {
              // eslint-disable-next-line react-hooks/incompatible-library
              return value === watch('password') || 'Passwords do not match';
            },
          })}
        />
        {errors.confirmPassword && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Show Password Checkbox */}
      <label className="label cursor-pointer mt-1">
        <span className="label-text">Show Password</span>
        <input
          type='checkbox'
          className='checkbox ml-2'
          onChange={() => setShowPassword(!showPassword)}
        ></input>
      </label>

      <button className='btn btn-primary w-full'>Sign Up</button>
    </form>
  );
};

export default SignUp;
