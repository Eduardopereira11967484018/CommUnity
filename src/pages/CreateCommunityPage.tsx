import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityForm, CommunityFormData } from '../components/communities/CommunityForm';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const CreateCommunityPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: CommunityFormData) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const { data: communityData, error } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          image_url: data.imageUrl,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add the creator as the first member
      await supabase.from('community_members').insert({
        community_id: communityData.id,
        user_id: user.id,
      });

      navigate(`/communities/${communityData.id}`);
    } catch (error) {
      console.error('Error creating community:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Community</h1>
        <CommunityForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};