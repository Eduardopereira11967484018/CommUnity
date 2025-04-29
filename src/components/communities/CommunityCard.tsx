import React from 'react';
import { Link } from 'react-router-dom';
import { Community } from '../../types';
import { Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommunityCardProps {
  community: Community;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <Link to={`/communities/${community.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <img
            src={community.image_url || 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg'}
            alt={community.name}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">{community.name}</h3>
        </div>
        
        <div className="p-4">
          <p className="text-gray-600 line-clamp-2 h-12 mb-3">{community.description}</p>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>{community.member_count} member{community.member_count !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-gray-400">
              Created {formatDistanceToNow(new Date(community.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};