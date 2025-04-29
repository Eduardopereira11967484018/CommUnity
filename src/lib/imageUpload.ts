import axios from 'axios';
import { CloudinaryUploadResponse } from '../types';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'communities');

    const response = await axios.post<CloudinaryUploadResponse>(
      import.meta.env.VITE_CLOUDINARY_URL,
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};