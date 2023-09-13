import React from 'react';

const LeftSidebar: React.FC = () => {
  return (
    <div className="w-4/5 mx-auto mt-6 pb-6 h-fit flex flex-col bg-[#50a6e4] rounded-xl">
      <img
        src="https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/273877541_4799385830176329_4891712365804515546_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=1b51e3&_nc_ohc=EDDvDSGG2gsAX88T2W5&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfBnypi4b8yffb3ARBVZAFQN0Es0LctmOKEPaZrLZCQ1kA&oe=65046731"
        className="w-20 h-20 rounded-full mx-auto mt-6 my-3"
      />
      <h1 className='mx-auto font-semibold text-xl text-white'>Lê Chí Hùng</h1>
      <h1 className='mx-auto text-lg text-white'>MSSV: 19521382</h1>
      <h1 className='mx-auto text-lg text-white'>Khoa: Công nghệ thông tin</h1>
      <h1 className='mx-auto text-lg text-white'>Lớp: 19CTT3</h1>
      <h1 className='mx-auto text-lg text-white'>Chuyên ngành: Kỹ thuật phần mềm</h1>
      <h1 className='mx-auto text-lg text-white'>Điểm trung bình: 3.5</h1>  
    </div>
  );
};

export default LeftSidebar;
