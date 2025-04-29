import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Community, CommunityMember } from '../types';
import { Button } from '../components/ui/Button';
import { MemberList } from '../components/communities/MemberList';
import { GeminiChat } from '../components/gemini/GeminiChat';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, UserPlus, UserMinus, ArrowLeft, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export const CommunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('communities')
          .select(`
            *,
            member_count:community_members(count)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        setCommunity({
          ...data,
          member_count: data.member_count[0].count
        });

        // Fetch members
        const { data: membersData, error: membersError } = await supabase
          .from('community_members')
          .select(`
            *,
            user:profiles(*)
          `)
          .eq('community_id', id);

        if (membersError) throw membersError;

        setMembers(membersData);

        // Check if user is a member
        if (user) {
          setIsMember(
            membersData.some((member) => member.user_id === user.id)
          );
        }
      } catch (error) {
        console.error('Error fetching community:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();

    // Set up real-time subscription for members
    const subscription = supabase
      .channel(`community_members:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_members', filter: `community_id=eq.${id}` }, 
        () => {
          fetchCommunity();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id, user]);

  const handleJoin = async () => {
    if (!user || !community) return;
    
    setIsJoining(true);
    try {
      const { error } = await supabase.from('community_members').insert({
        community_id: community.id,
        user_id: user.id,
      });

      if (error) throw error;
      setIsMember(true);
    } catch (error) {
      console.error('Error joining community:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!user || !community) return;
    
    setIsLeaving(true);
    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', community.id)
        .eq('user_id', user.id);

      if (error) throw error;
      setIsMember(false);
    } catch (error) {
      console.error('Error leaving community:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Not Found</h1>
        <p className="text-gray-600 mb-8">The community you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button variant="primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Communities
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with Community Image */}
      <div className="relative h-64 sm:h-80 md:h-96">
        <img
          src={community.image_url || 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg'}
          alt={community.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{community.name}</h1>
            <div className="flex flex-wrap items-center text-white/90 text-sm space-x-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{community.member_count} member{community.member_count !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created on {format(new Date(community.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all communities
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Community</h2>
              <p className="text-gray-700 whitespace-pre-line">{community.description}</p>
            </div>

            {/* Chat Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Community Chat</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {showChat ? 'Hide Chat' : 'Show Chat'}
                </Button>
              </div>
              {showChat && (
                <GeminiChat communityId={community.id} isMember={isMember} />
              )}
            </div>
          </div>
          
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Join this community</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isMember 
                    ? "You're already a member of this community."
                    : "Join this community to participate in discussions and stay updated."}
                </p>
                
                {user ? (
                  isMember ? (
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleLeave}
                      isLoading={isLeaving}
                    >
                      <UserMinus className="h-5 w-5 mr-2" />
                      Leave Community
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      onClick={handleJoin}
                      isLoading={isJoining}
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Join Community
                    </Button>
                  )
                ) : (
                  <Link to="/login">
                    <Button fullWidth>
                      Sign in to Join
                    </Button>
                  </Link>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Members
                </h3>
                <MemberList members={members} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};