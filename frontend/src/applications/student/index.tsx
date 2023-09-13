import React from 'react';
import LeftSidebar from './LeftSidebar.component';
import NewsFeedScreen from './NewsFeed.component';
import RightSidebar from './RightSidebar.component';

const StudentPage: React.FC = () => {
  return (
    <div className="w-auto h-auto grid grid-cols-7">
      <div className="col-span-2 w-full bg-green-300 justify-center mx-auto">
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
