import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityCard } from '../components/communities/CommunityCard';
import { supabase } from '../lib/supabase';
import { Community } from '../types';
import { PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GeminiChat } from '../components/gemini/GeminiChat';

export const HomePage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data, error } = await supabase
          .from('communities')
          .select(`
            *,
            member_count:community_members(count)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const communitiesWithCount = data.map(community => ({
          ...community,
          member_count: community.member_count[0].count
        }));

        setCommunities(communitiesWithCount);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();

    // Set up real-time subscription
    const subscription = supabase
      .channel('public:communities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'communities' }, fetchCommunities)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Communities</h1>
          <p className="mt-2 text-gray-600">Find and join communities that match your interests</p>
        </div>
        
        {user && (
          <Link 
            to="/create" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Community
          </Link>
        )}
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search communities..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredCommunities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No communities found</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery 
              ? `No communities match "${searchQuery}"`
              : "There are no communities yet. Be the first to create one!"}
          </p>
          {user && !searchQuery && (
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Community
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Assistance?</h2>
        <GeminiChat />
      </div>
    </div>
  );
};