import React from 'react';
import Navbar from '../../shared/limb/navbar';
import MainContentContainer from '../../shared/layout/mainLayout';

interface IProps {
  children?: React.ReactNode;
}

const StudentPageLayout: React.FC<IProps> = (props) => {
  const { children } = props;
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <MainContentContainer>{children}</MainContentContainer>
    </div>
  );
};
export default StudentPageLayout;