import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { useGlobalData } from '../context/GlobalDataContext';

const CreateDog = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    breeds,
    genders,
    intakeTypes,
    approvalTypes,
    behaviorTags,
    locationTypes,
    roleTypes,
    sizes,
    states,
    statuses,
    isLoading,
    error,
  } = useGlobalData();

  const onSubmit = (data) => console.log('Form Submitted: ', data);

  if (isLoading) return <p>Loading reference data ...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Dog Profile</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 max-w-md mx-auto'
      >
        <div className='flex flex-col gap-4 md:flex-row'>
          {/* Intake Date */}
          <div className='form-control flex flex-col flex-1'>
            <label htmlFor='intakeDate' className='label'>
              <span className='label-text'>Intake Date</span>
            </label>
            <input
              type='date'
              name='intakeDate'
              id='intakeDate'
              className='p-2 input input-bordered'
              {...register('intakeDate', {
                required: 'Intake Date is required',
              })}
            />
          </div>
          {/* Intake Type */}
          <div className='form-control flex flex-col flex-1'>
            <label htmlFor='intakeType'>
              <span className='label-text'>Intake Type</span>
            </label>
            <select
              name='intakeType'
              id='intakeType'
              className='input'
              {...register('intakeType', {
                required: 'Please choose an intake type',
              })}
            >
              <option value=''>Choose a value</option>
              <option value='1'>Stray</option>
              <option value='2'>Surrender</option>
              <option value='3'>Adoption Return</option>
              <option value='4'>Agency Transfer</option>
              <option value='5'>Other</option>
            </select>
            {errors.intakeType && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.intakeType.message}
              </p>
            )}
          </div>
        </div>
        {/* Microchip Number */}
        <div className='form-control flex flex-col'>
          <label htmlFor='microchip' className='label'>
            <span className='label-text'>Microchip Number</span>
          </label>
          <input
            type='text'
            name='microchipNumber'
            id='microchipNumber'
            placeholder='e.g., 977000123456789'
            className='input input-bordered w-full'
          />
        </div>

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
        {/* Dog Breed */}
        {/* Select Input */}
        <div className='form-control flex flex-col'>
          <label htmlFor='breeds' className='label'>
            <span className='label-text'>Breeds</span>
          </label>
          <Controller
            name='breeds'
            control={control}
            rules={{ required: 'At least one breed is required' }}
            render={({ field }) => (
              <Select
                {...field}
                options={breeds}
                isMulti
                placeholder="Select or type one or more breeds"
                className='text-black'
              />
            )}
          />
        </div>
        {/* Gender */}
        {/* Will need to fetch data */}
        <div className='form-control flex flex-col'>
          <label htmlFor='gender' className='label'>
            <span className='label-text'>Gender</span>
          </label>
          <select
            name='gender'
            id='gender'
            className='input'
            {...register('gender', { required: 'A gender is required' })}
          >
            <option value=''>choose a gender</option>
            <option value='1'>Male</option>
            <option value='2'>Female</option>
            <option value='3'>Unknown</option>
          </select>
          {errors.name && (
            <p className='text-red-500 text-sm mt-1'>{errors.gender.message}</p>
          )}
        </div>
        {/* submit & reset button */}
        <div className='flex gap-3'>
          <button
            type='submit'
            className='bg-green-400 px-3 py-2 rounded-md text-slate-800 font-medium cursor-pointer flex-1 hover:bg-green-300 hover:text-slate-600'
          >
            Submit
          </button>
          <button
            type='button'
            className='bg-red-400 px-3 py-2 rounded-md text-slate-800 font-medium cursor-pointer flex-1 hover:bg-red-300 hover:text-slate-600'
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDog;
