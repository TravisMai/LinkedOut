import React from 'react';
import LeftSidebar from './LeftSidebar.component';
import NewsFeedScreen from './NewsFeed.component';
import RightSidebar from './RightSidebar.component';

const StudentPage: React.FC = () => {
  return (
    <div className="w-auto h-fit flex-col lg:grid grid-cols-7 bg-[#f3f2f0]">
      <div className="lg:col-span-2 h-full">
        <LeftSidebar />
      </div>
      <div className="mx-auto w-[80%] lg:w-full lg:col-span-3 h-full">
        <NewsFeedScreen />
      </div>
      <div className="hidden col-span-2 lg:flex justify-end pr-2">
        <RightSidebar />
      </div>
    </div>
  );
};

export default StudentPage;
