import React from 'react';
import Navbar from '../../applications/student/navbar.component';
import MainContentContainer from './mainLayout';

interface IProps {
  children?: React.ReactNode;
}

const UserPageLayout: React.FC<IProps> = (props) => {
  const { children } = props;
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <MainContentContainer>{children}</MainContentContainer>
    </div>
  );
};
export default UserPageLayout;