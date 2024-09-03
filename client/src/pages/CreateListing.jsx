import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    videoUrl: '',
    balcony: false,
    outdoorKitchen: false,
    cableTv: false,
    tennisCourts: false,
    internet: false,
    sunRoom: false,
    concreteFlooring: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      try {
        const promises = Array.from(files).map(file => storeImage(file));
        const urls = await Promise.all(promises);
        setFormData(prevData => ({
          ...prevData,
          imageUrls: prevData.imageUrls.concat(urls),
        }));
        setUploading(false);
      } catch (err) {
        setImageUploadError('Image upload failed (2 MB max per image)');
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Image upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0] || null);
  };

  const handleRemoveVideo = () => {
    setFormData(prevData => ({
      ...prevData,
      videoUrl: '',
    }));
    setVideoFile(null);
  };
  
  const handleVideoSubmit = async () => {
    if (videoFile) {
      setUploading(true);
      setVideoUploadError(false);
      try {
        const downloadURL = await uploadVideo(videoFile);
        setFormData(prevData => ({
          ...prevData,
          videoUrl: downloadURL,
        }));
        setUploading(false);
      } catch (err) {
        setVideoUploadError('Video upload failed');
        setUploading(false);
      }
    }
  };

  const uploadVideo = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Video upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData(prevData => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (['sale', 'rent'].includes(id)) {
      setFormData(prevData => ({
        ...prevData,
        type: id,
      }));
    } else if (
      ['parking', 'furnished', 'balcony', 'outdoorKitchen', 'cableTv', 'tennisCourts', 'internet', 'sunRoom', 'concreteFlooring', 'offer'].includes(id)
    ) {
      setFormData(prevData => ({
        ...prevData,
        [id]: checked,
      }));
    } else if (['number', 'text', 'textarea'].includes(type)) {
      setFormData(prevData => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='balcony'
                className='w-5'
                onChange={handleChange}
                checked={formData.balcony}
              />
              <span>Balcony</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='outdoorKitchen'
                className='w-5'
                onChange={handleChange}
                checked={formData.outdoorKitchen}
              />
              <span>Outdoor Kitchen</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='cableTv'
                className='w-5'
                onChange={handleChange}
                checked={formData.cableTv}
              />
              <span>Cable TV</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='tennisCourts'
                className='w-5'
                onChange={handleChange}
                checked={formData.tennisCourts}
              />
              <span>Tennis Courts</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='internet'
                className='w-5'
                onChange={handleChange}
                checked={formData.internet}
              />
              <span>Internet</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sunRoom'
                className='w-5'
                onChange={handleChange}
                checked={formData.sunRoom}
              />
              <span>Sun Room</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='concreteFlooring'
                className='w-5'
                onChange={handleChange}
                checked={formData.concreteFlooring}
              />
              <span>Concrete Flooring</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
      
          <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          </div>
          <input
            type='file'
            id='imageUpload'
            className='border p-3 rounded-lg'
            accept='image/*'
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <button
            type='button'
            onClick={handleImageSubmit}
            className='bg-blue-500 text-white py-2 rounded-lg'
          >
            Upload Images
          </button>
          {imageUploadError && (
            <p className='text-red-500'>{imageUploadError}</p>
          )}
          <p className='font-semibold'>
            Video:
            <span className='font-normal text-gray-600 ml-2'>
              Video(Optional)
            </span>
          </p>
          <input
            type='file'
            id='videoUpload'
            className='border p-3 rounded-lg'
            accept='video/*'
            onChange={handleVideoChange}
          />
          <button
            type='button'
            onClick={handleVideoSubmit}
            className='bg-blue-500 text-white py-2 rounded-lg'
          >
            Upload Video
          </button>
          {videoUploadError && (
            <p className='text-red-500'>{videoUploadError}</p>
          )}
          {uploading && (
            <p className='text-blue-500'>Uploading...</p>
          )}
        </div>
        <div className='flex flex-col flex-1'>
          <div className='flex flex-wrap gap-4'>
            {formData.imageUrls.map((url, index) => (
              <div key={index} className='relative'>
                <img
                  src={url}
                  alt={`Uploaded preview ${index + 1}`}
                  className='w-32 h-32 object-cover'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full'
                >
                  X
                </button>
              </div>
            ))}
          </div>
          {formData.videoUrl && (
  <div className='relative'>
    <video controls className='mt-4 w-full'>
      <source src={formData.videoUrl} type='video/mp4' />
      Your browser does not support the video tag.
    </video>
    <button
      type='button'
      onClick={handleRemoveVideo}
      className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full'
    >
      X
    </button>
  </div>
)}
          {error && (
            <p className='text-red-500'>{error}</p>
          )}
          <button
            type='submit'
            className='bg-green-500 text-white py-2 rounded-lg mt-4'
          >
            {loading ? 'Loading...' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </main>
  );
}
