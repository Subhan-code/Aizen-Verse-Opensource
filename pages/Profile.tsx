import React from 'react';
import { Theme } from '../types';

interface ProfileProps {
  theme?: Theme;
}

const Profile: React.FC<ProfileProps> = ({ theme = 'dark' }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-dela text-3xl md:text-4xl">Profile</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className={`glass rounded-2xl p-6`}>
          <h2 className="font-dela text-xl mb-4">User Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  src="https://picsum.photos/100/100?random=user" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-dela text-lg">Anime Fan</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Member since Jan 2023</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span>anime@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Watched</span>
                <span>127 anime</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Favorites</span>
                <span>24 anime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Watch History */}
        <div className={`glass rounded-2xl p-6 lg:col-span-2`}>
          <h2 className="font-dela text-xl mb-4">Recently Watched</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="w-16 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/100/150?random=${item}`} 
                    alt="Anime" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-dela">Demon Slayer: Kimetsu no Yaiba</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Episode 12 • 2 hours ago</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={`glass rounded-2xl p-6 lg:col-span-3`}>
          <h2 className="font-dela text-xl mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Watched', value: '127', unit: 'anime' },
              { label: 'Hours Watched', value: '842', unit: 'hours' },
              { label: 'Favorites', value: '24', unit: 'anime' },
              { label: 'Completion Rate', value: '78', unit: '%' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-black/5 dark:bg-white/5">
                <div className="text-2xl font-dela">{stat.value}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">{stat.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;