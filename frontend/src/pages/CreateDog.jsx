import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { useGlobalData } from '../context/GlobalDataContext';
import { getSignedUploadUrl, uploadFileToR2 } from '../api/photos';

const CreateDog = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      behaviorTags: [],
    },
  });

  const {
    breeds,
    genders,
    intakeTypes,
    behaviorTags,
    locationTypes,
    sizes,
    statuses,
    isLoading,
    error,
  } = useGlobalData();

  const handlePhotoupload = async (file) => {
    const { uploadUrl, finalUrl } = await getSignedUploadUrl(file);

    await uploadFileToR2(uploadUrl, file);

    return finalUrl;
  };

  const onSubmit = async (data) => {
    try {
      // 1) get the file from the file input
      const file = data.photoFile;
      let photoUrl = null;

      // 2) If a file was selected, upload it to R2
      if (file && file.length > 0) {
        const selectedFile = file[0];

        // A. ask the backend for signed URL
        const { uploadUrl, finalUrl } = await getSignedUploadUrl(selectedFile);

        // B. upload file directly to R2
        await uploadFileToR2(uploadUrl, selectedFile);

        // C. store final public URL
        photoUrl = finalUrl;
      }

      // 3) Normalize & Build the dog payload
      const dogPayload = {
        // input fields
        name: data.name,
        microchip_number: data.microchipNumber || null,
        date_of_birth: data.dob || null,
        weight: data.weight ? Number(data.weight) : null,
        intake_notes: data.intake_notes || null,
        medical_notes: data.medical_notes || null,
        foster_notes: data.foster_notes || null,
        utd_shots: data.utd_shots || false,
        fixed: data.fixed || false,

        // select fields
        gender_id: data.gender?.value || null,
        size_id: data.size?.value || null,
        status_id: data.statuses?.value || null,
        intake_type_id: data.intakeTypes?.value || null,
        current_location_id: data.loocationTypes?.value || null,

        // breeds
        breeds: data.breeds?.map(b => b.value) || [],

        // behavior tags
        behaviorTags: data.behaviorTags.map(t => t.value) || [],

        // photo
      };

      // 4) Send to the backend
      await fetch('http://localhost:5000/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dogPayload),
      });

      console.log('Dog created successfully: ', dogPayload);
    } catch (err) {
      console.error('Error creating dog: ', err);
    }
  };

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
          <div className='form-control flex flex-col flex-1 gap-1'>
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
          <div className='form-control flex flex-col flex-1 gap-1'>
            <label htmlFor='intakeTypes' className='label'>
              <span className='label-text'>Intake Type</span>
            </label>
            <Controller
              name='intakeTypes'
              control={control}
              rules={{ required: 'One type must be selected' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={intakeTypes}
                  className='text-black'
                />
              )}
            />
          </div>
        </div>

        <div className='flex flex-col gap-4 md:flex-row'>
          {/* Current Location */}
          <div className='form-control flex flex-col flex-1 gap-1'>
            <label htmlFor='locationTypes' className='label'>
              <span className='label-text'>Location Type</span>
            </label>
            <Controller
              name='locationTypes'
              control={control}
              rules={{ required: 'One type must be selected' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={locationTypes}
                  className='text-black'
                />
              )}
            />
          </div>
          {/* Current Status */}
          <div className='form-control flex flex-col flex-1 gap-1'>
            <label htmlFor='statuses' className='label'>
              <span className='label-text'>Status</span>
            </label>
            <Controller
              name='statuses'
              control={control}
              rules={{ required: 'One type must be selected' }}
              render={({ field }) => (
                <Select {...field} options={statuses} className='text-black' />
              )}
            />
          </div>
        </div>

        {/* Microchip Number */}
        <div className='form-control flex flex-col gap-1'>
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
        <div className='form-control flex flex-col gap-1'>
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
        <div className='form-control flex flex-col gap-1'>
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
                placeholder='Select or type one or more breeds'
                className='text-black'
              />
            )}
          />
        </div>

        {/* Gender */}
        <div className='form-control flex flex-col gap-1'>
          <label htmlFor='gender' className='label'>
            <span className='label-text'>Gender</span>
          </label>
          <Controller
            name='gender'
            control={control}
            rules={{ required: 'A gender is required' }}
            render={({ field }) => (
              <Select {...field} options={genders} className='text-black' />
            )}
          />
        </div>

        <div className='form-control flex gap-20'>
          {/* UTD Shots */}
          <div>
            <label htmlFor='utd_Shots' className='label'>
              <span className='label-text'>UTD Shots</span>
            </label>
            <Controller
              name='utd_shots'
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className='checkbox'
                  />
                  Yes
                </label>
              )}
            />
          </div>
          {/* Fixed */}
          <div>
            <label htmlFor='fixed' className='label'>
              <span className='label-text'>Fixed</span>
            </label>
            <Controller
              name='fixed'
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className='checkbox'
                  />
                  Yes
                </label>
              )}
            />
          </div>
        </div>

        <div className='flex flex-col gap-4 md:flex-row'>
          {/* Size */}
          <div className='form-control flex flex-col flex-1 gap-1'>
            <label htmlFor='size' className='label'>
              <span className='label-text'>Size</span>
            </label>
            <Controller
              name='size'
              control={control}
              rules={{ required: 'A size is required' }}
              render={({ field }) => (
                <Select {...field} options={sizes} className='text-black' />
              )}
            />
          </div>
          {/* Weight */}
          <div className='form-control flex flex-col flex-1 gap-1'>
            <label htmlFor='weight' className='label'>
              <span className='label-text'>Weight in Pounds</span>
            </label>
            <input
              type='number'
              min='1'
              max='200'
              name='weight'
              id='weight'
              className='input'
            />
          </div>
        </div>

        {/* DOB */}
        <div className='form-control flex flex-col gap-1'>
          <label htmlFor='dob' className='label'>
            <span className='label-text'>Date of Birth</span>
          </label>
          <input
            type='date'
            name='dob'
            id='dob'
            className='p-2 input input-bordered'
          />
        </div>

        {/* Behaviors */}
        <div className='form-control flex flex-col gap-1'>
          <label htmlFor='behaviorTags' className='label'>
            <span className='label-text'>Behaviors</span>
          </label>
          <Controller
            name='behaviorTags'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={behaviorTags}
                isMulti
                placeholder='Select known behavior tags'
                className='text-black'
              />
            )}
          />
        </div>

        {/* Intake Notes */}
        <div className='form-control flex flex-col gap-1'>
          <label htmlFor='intake_notes' className='label'>
            <span className='label-text'>Intake Notes</span>
          </label>
          <textarea
            name='intake_notes'
            id='intake_notes'
            className='input p-2 w-full h-max'
            rows={5}
          />
        </div>

        {/* Medical Notes */}
        <div className='form-control flex flex-col gap-1'>
          <label htmlFor='medical_notes' className='label'>
            <span className='label-text'>Medical Notes</span>
          </label>
          <textarea
            name='medical_notes'
            id='medical_notes'
            className='input p-2 w-full h-max'
            rows={5}
          />
        </div>

        {/* Foster Notes */}
        <div className='form-control flex flex-col gap-1'>
          <label htmlFor='foster_notes' className='label'>
            <span className='label-text'>Foster Notes</span>
          </label>
          <textarea
            name='foster_notes'
            id='foster_notes'
            className='input p-2 w-full h-max'
            rows={5}
          />
        </div>

        {/* Photo Upload */}
        <div className='form-control flex flex-col gap-1'>
          <label htmlFor='photoUpload' className='label'>
            <span className='label-text'>Upload Photo</span>
          </label>
          <input
            type='file'
            name='photoUpload'
            id='photoUpload'
            accept='image/*'
            {...register('photoFile')}
            className='cursor-pointer p-2 border text-sm rounded block w-full'
          />
          <p className='text-sm'>Photos must be jpg, jpeg, or png only</p>
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
