import React, { useState } from 'react';
import axios from 'axios';

const EventForm = () => {

const [like,setlike]=useState([0]);
const [formData, setFormData] = useState({
    name: '',
    institution: '',
    venue:'',
    date: '',
    time: '',
    isFree: true,
    price: 0,
    description: '',
    clubName: '', 
    performer: '', 
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Append images
    images.forEach(image => {
      submitData.append('images', image);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/events/create`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ text: 'Event created successfully!', type: 'success' });
      
   
      setFormData({
        name: '',
        institution: '',
        venue:'',
        date: '',
        time: '',
        isFree: true,
        price: 0,
        description: '',
        clubName: '', 
        performer: '', 

      });
      setImages([]);
      setPreviewImages([]);

    } catch (error) {
      console.error('Error creating event:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to create event. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isFree') {
      setFormData({
        ...formData,
        [name]: checked,
        price: checked ? 0 : formData.price
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (selectedFiles.length > 3) {
        setMessage({ text: 'You can only upload up to 3 images', type: 'error' });
        return;
      }
      
      setImages(selectedFiles);
      
      // Create preview URLs
      const imagePreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(imagePreviews);
      
      setMessage({ text: '', type: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event name"
            />
          </div>
         


          {/* Club Name */}
<div className="md:col-span-2">
  <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
    Club Name *
  </label>
  <input
    type="text"
    id="clubName"
    name="clubName"
    value={formData.clubName}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter club name"
  />
</div>

{/* Performer Name */}
<div className="md:col-span-2">
  <label htmlFor="performer" className="block text-sm font-medium text-gray-700 mb-1">
    Performer Name (Optional)
  </label>
  <input
    type="text"
    id="performer"
    name="performer"
    value={formData.performer}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter performer name"
  />
</div>

          {/* Institution */}
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
              Institution *
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter institution name"
            />
          </div>

           {/* venue*/}
           <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
             venue *
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter institution name"
            />
          </div>

          
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time (HH:MM) *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="14:30"
            />
          </div>
          
          {/* Price Options */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="isFree"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                This is a free event
              </label>
            </div>
            
            {!formData.isFree && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (in ₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
          ></textarea>
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Images * (Max 3)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          
          {/* Image Previews */}
          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
                    onClick={() => {
                      setPreviewImages(previewImages.filter((_, i) => i !== index));
                      setImages(images.filter((_, i) => i !== index));
                    }}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;