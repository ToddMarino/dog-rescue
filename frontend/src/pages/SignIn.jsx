import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import api from '../api/axios';


const SignIn = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const { login } = useAuth();

  const onSubmit = async (data) => {
    const res = await api.post('/auth/login', data);
    login(res.data.token);
    navigate('/');
  }

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
          {...register('email', { required: 'Email is required' })}
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
          type='password'
          id='password'
          className=' input input-bordered w-full'
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>
        )}
      </div>

      <button className="btn btn-primary w-full">Sign In</button>
    </form>
  );
};

export default SignIn;
