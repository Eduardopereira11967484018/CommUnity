import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { uploadImage } from '../../lib/imageUpload';
import { Image, Upload } from 'lucide-react';

interface CommunityFormProps {
  onSubmit: (data: CommunityFormData) => Promise<void>;
  isLoading: boolean;
}

export interface CommunityFormData {
  name: string;
  description: string;
  image: File | null;
  imageUrl: string;
}

export const CommunityForm: React.FC<CommunityFormProps> = ({ onSubmit, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CommunityFormData>({
    defaultValues: {
      name: '',
      description: '',
      image: null,
      imageUrl: '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setValue('image', file);

    // Upload image to Cloudinary
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setValue('imageUrl', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onFormSubmit = async (data: CommunityFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Community Name"
          placeholder="Enter a name for your community"
          {...register('name', { required: 'Community name is required' })}
          error={errors.name?.message}
          fullWidth
        />

        <Textarea
          label="Description"
          placeholder="What is your community about?"
          {...register('description', { 
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' }
          })}
          error={errors.description?.message}
          rows={4}
          fullWidth
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Community Image
          </label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
            <div className="space-y-2 text-center">
              {imagePreview ? (
                <div className="relative w-full h-48 mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white bg-opacity-75"
                    onClick={() => {
                      setImagePreview(null);
                      setValue('image', null);
                      setValue('imageUrl', '');
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload an image</span>
                      <input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
          </div>
          {watch('imageUrl') && (
            <p className="mt-2 text-sm text-green-600">Image successfully uploaded!</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading || isUploading}
        disabled={isLoading || isUploading || !watch('imageUrl')}
      >
        <Upload className="mr-2 h-4 w-4" />
        Create Community
      </Button>
    </form>
  );
};