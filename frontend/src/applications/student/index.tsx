import React from 'react';
import LeftSidebar from './LeftSidebar.component';
import NewsFeedScreen from './NewsFeed.component';
import RightSidebar from './RightSidebar.component';

const StudentPage: React.FC = () => {
  return (
    <div className="w-auto h-fit grid grid-cols-7 bg-[#f3f2f0]">
      <div className="col-span-2 h-full">
        <LeftSidebar />
      </div>
      <div className="col-span-3 h-full">
        
        <NewsFeedScreen />
      </div>
      <div className="col-span-2 flex justify-end pr-2">
        <RightSidebar />
      </div>
    </div>
  );
};

export default StudentPage;
