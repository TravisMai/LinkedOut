import React from 'react';

const RightSidebar: React.FC = () => {
  return (
    <div className="w-4/5 mx-auto my-6 pb-6 h-fit flex flex-col rounded-xl border-2 items-center bg-white">
      <div className='w-full border-b-2 flex justify-evenly'>
        <p className="font-semibold text-xl text-black my-4">
          Connected company
        </p>
      </div>
      <div className="w-10/12 pt-4">
        <ul className="w-full text-gray-600">
          {Array(16)
            .fill(0)
            .map((_, idx) => (
              <li
                key={idx}
                className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200"
              >
                <div>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={`https://random.imagecdn.app/200/${200 + idx}`}
                    alt="user"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">NABuoi</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
