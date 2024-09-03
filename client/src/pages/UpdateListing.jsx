import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null); // State for video file
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
    videoUrl: '', // State for video URL
    balcony: false,
    outdoorKitchen: false,
    cableTv: false,
    tennisCourts: false,
    internet: false,
    sunRoom: false,
    concreteFlooring: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState(false); // State for video upload error
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
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
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
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
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0] || null);
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

  const handleRemoveVideo = () => {
    setFormData(prevData => ({
      ...prevData,
      videoUrl: '',
    }));
    setVideoFile(null);
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

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
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
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          {/* Input Fields */}
          <label className='block'>
            <span className='text-gray-700'>Name</span>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={handleChange}
              required
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Description</span>
            <textarea
              id='description'
              value={formData.description}
              onChange={handleChange}
              required
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Address</span>
            <input
              type='text'
              id='address'
              value={formData.address}
              onChange={handleChange}
              required
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Type</span>
            <select
              id='type'
              value={formData.type}
              onChange={handleChange}
              required
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
            >
              <option value='rent'>Rent</option>
              <option value='sale'>Sale</option>
            </select>
          </label>
          <label className='block'>
            <span className='text-gray-700'>Bedrooms</span>
            <input
              type='number'
              id='bedrooms'
              value={formData.bedrooms}
              onChange={handleChange}
              required
              min='1'
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Bathrooms</span>
            <input
              type='number'
              id='bathrooms'
              value={formData.bathrooms}
              onChange={handleChange}
              required
              min='1'
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Regular Price</span>
            <input
              type='number'
              id='regularPrice'
              value={formData.regularPrice}
              onChange={handleChange}
              required
              min='0'
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
            />
          </label>
          {formData.type === 'rent' && (
           <span className='ml-2'>$/Month</span>
          )}
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='offer'
              checked={formData.offer}
              onChange={handleChange}
            />
           <span className='ml-2'>Offer</span>
          </label>
          {formData.offer && (
            <label className='flex items-center'>
              <input
                type='number'
                id='discountPrice'
                value={formData.discountPrice}
                onChange={handleChange}
                min='0'
                className='form-checkbox'
              />
            <span className='ml-2'>$/Month</span>
            </label>
          )}
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='furnished'
              checked={formData.furnished}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Furnished</span>
          </label>
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='balcony'
              checked={formData.balcony}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Balcony</span>
          </label>
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='outdoorKitchen'
              checked={formData.outdoorKitchen}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Outdoor Kitchen</span>
          </label>
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='cableTv'
              checked={formData.cableTv}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Cable TV</span>
          </label>
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='tennisCourts'
              checked={formData.tennisCourts}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Tennis Courts</span>
          </label>
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='internet'
              checked={formData.internet}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Internet</span>
          </label>
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='sunRoom'
              checked={formData.sunRoom}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Sun Room</span>
          </label>
          <label className='flex items-center'>
            <input
              type='checkbox'
              id='concreteFlooring'
              checked={formData.concreteFlooring}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2'>Concrete Flooring</span>
          </label>
        </div>

        <div className='flex flex-col gap-4 flex-1'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              Upload up to 6 images
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              multiple
              accept='image/*'
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index + 1}`}
                  className='w-20 h-20 object-cover'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 border border-red-700 rounded uppercase hover:shadow-lg'
                >
                  Delete
                </button>
              </div>
            ))}
          <div className='border-b' />

          <p className='font-semibold'>
            Video:
            <span className='font-normal text-gray-600 ml-2'>Optional</span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={handleVideoChange}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='video'
              accept='video/*'
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleVideoSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {videoUploadError && videoUploadError}
          </p>
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
    <button
          type='submit'
          disabled={loading}
          className='mt-4 bg-green-500 text-white p-2 rounded'
        >
          {loading ? 'Updating...' : 'Update Listing'}
        </button>
        {error && <p className='text-red-500'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
