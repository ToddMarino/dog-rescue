import { useForm } from 'react-hook-form';

const CreateDog = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log('Form Submitted: ', data);

  return (
    <div>
      <h2>Dog Profile</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-4 max-w-md mx-auto'
      >
        {/* Name */}
        <div className='form-control flex flex-col'>
          <label htmlFor='name' className='label'>
            <span className='label-text'>Name</span>
          </label>
          <input
            type='text'
            id='name'
            className='input input-bordered w-full'
            {...register('name', { required: 'A dog name is required' })}
          />
          {errors.name && (
            <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
          )}
        </div>
        {/* Gender */}
        {/* Will need to fetch data */}
        <div className='form-control flex flex-col'>
          <label htmlFor='gender' className='label'>
            <span className='label-text'>Gender</span>
          </label>
          <select name='gender' id='gender'>
            <option value=''>choose gender</option>
            <option value='1'>Male</option>
            <option value='2'>Female</option>
            <option value='3'>Unknown</option>
          </select>
          {errors.name && (
            <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateDog;
