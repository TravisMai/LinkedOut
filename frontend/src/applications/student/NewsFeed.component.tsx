import React from 'react';
import ContentCard from './ContentCard.component';


const NewsFeed: React.FC = () => {
  return (
    <div className="mt-6 w-full h-fit flex flex-col space-y-3 pb-10">
      <ContentCard/>
      <ContentCard/>
      <ContentCard/>
      <ContentCard/>
      <ContentCard/>
      <ContentCard/>
      <ContentCard/>
      <ContentCard/>
      <ContentCard/>
    </div>
  );
};

export default NewsFeed;
