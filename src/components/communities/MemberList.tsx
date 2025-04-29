import React from 'react';
import { CommunityMember } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface MemberListProps {
  members: CommunityMember[];
  isLoading: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({ members, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No members yet. Be the first to join!</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {members.map((member) => (
        <li key={member.id} className="py-4 flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={member.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.full_name || member.user.email)}&background=random`}
            alt={member.user.full_name || member.user.email}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {member.user.full_name || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              Joined {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};