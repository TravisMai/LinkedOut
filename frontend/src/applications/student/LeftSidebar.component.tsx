import React from 'react';

const LeftSidebar: React.FC = () => {
  return (
    <div className="w-4/5 mx-auto mt-6 pb-6 h-fit min-h-[500px] flex flex-col rounded-xl space-y-2">
      <div className='flex flex-col bg-white rounded-lg '>
        <div className='flex flex-col'>
          <img
            src="https://source.unsplash.com/random?wallpapers"
            className="w-full h-24 rounded-t-lg"
          />
          <img
            src="https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/273877541_4799385830176329_4891712365804515546_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=1b51e3&_nc_ohc=EDDvDSGG2gsAX88T2W5&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfBnypi4b8yffb3ARBVZAFQN0Es0LctmOKEPaZrLZCQ1kA&oe=65046731"
            className=" w-1/3 h-1/3 rounded-full mx-auto my-3 -mt-16 border-2 border-white"
          />
        </div>
        <h1 className='mx-auto font-semibold text-2xl text-black pb-5'>Lê Chí Hùng</h1>
      </div>
      <div className='w-full border-b-4 bg-white rounded-lg border-[#f3f2f0] flex flex-col items-center justify-center py-6'>
        <h1 className='mx-auto text-lg text-black'>MSSV: 19521382</h1>
        <h1 className='mx-auto text-lg text-black'>Khoa: Công nghệ thông tin</h1>
        <h1 className='mx-auto text-lg text-black'>Lớp: 19CTT3</h1>
        <h1 className='mx-auto text-lg text-black'>Chuyên ngành: Kỹ thuật phần mềm</h1>
        <h1 className='mx-auto text-lg text-black'>Điểm trung bình: 3.5</h1>
      </div>
    </div>
  );
};

export default LeftSidebar;
