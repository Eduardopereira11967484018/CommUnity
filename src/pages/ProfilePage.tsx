import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { uploadImage } from '../lib/imageUpload';
import { Community } from '../types';
import { CommunityCard } from '../components/communities/CommunityCard';
import { User, Upload, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserCommunities = async () => {
      try {
        // Fetch communities created by the user
        const { data: createdData, error: createdError } = await supabase
          .from('communities')
          .select(`
            *,
            member_count:community_members(count)
          `)
          .eq('created_by', user.id);

        if (createdError) throw createdError;

        const createdCommunities = createdData.map(community => ({
          ...community,
          member_count: community.member_count[0].count
        }));

        setMyCommunities(createdCommunities);

        // Fetch communities joined by the user
        const { data: joinedData, error: joinedError } = await supabase
          .from('community_members')
          .select(`
            community_id,
            communities:communities(
              *,
              member_count:community_members(count)
            )
          `)
          .eq('user_id', user.id)
          .neq('communities.created_by', user.id);

        if (joinedError) throw joinedError;

        const joinedCommunitiesList = joinedData
          .map(item => ({
            ...item.communities,
            member_count: item.communities.member_count[0].count
          }))
          .filter(Boolean);

        setJoinedCommunities(joinedCommunitiesList);
      } catch (error) {
        console.error('Error fetching user communities:', error);
      }
    };

    fetchUserCommunities();
  }, [user, navigate]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setAvatar(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      let avatarUrl = user.avatar_url;

      // Upload avatar if changed
      if (avatar) {
        setIsUploading(true);
        avatarUrl = await uploadImage(avatar);
        setIsUploading(false);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Show success message or update local user state
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=random`}
                      alt={user.full_name || 'Profile'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 text-gray-600" />
                    <input
                      id="avatar-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {user.email}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={signOut}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="space-y-6">
                <div>
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    fullWidth
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading || isUploading}
                  disabled={isLoading || isUploading}
                >
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Communities You Created</h2>
        {myCommunities.length === 0 ? (
          <p className="text-gray-600">You haven't created any communities yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Communities You Joined</h2>
        {joinedCommunities.length === 0 ? (
          <p className="text-gray-600">You haven't joined any communities yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};