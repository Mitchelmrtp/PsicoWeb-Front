import React from 'react';

const AuthSidebar = () => {
  return (
    <div className="bg-[#3f4799] text-white flex flex-col h-full relative overflow-hidden">
      {/* Logo and title - centered */}
      <div className="relative z-10 flex justify-center items-center pt-16 pb-6">
        <div className="flex items-center">
          <img
            src="/assets/logo-white.png"
            alt="PsycoWeb"
            className="h-6 mr-2"
          />
          <span className="text-2xl font-medium">PsycoWeb</span>
        </div>
      </div>

      {/* Curved overlay */}
      <div className="absolute top-[25%] left-0 right-0 bottom-0 bg-[#e8eefb] rounded-tl-[180px]" />

      {/* Search indicator */}
      <div className="relative z-10 px-6 mt-6">
        <div className="bg-[rgba(32,36,80,0.7)] rounded-lg p-3 flex items-center">
          <div className="rounded-full bg-white p-1 mr-3 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium text-sm">Psicólogos cualificados</div>
            <div className="text-xs opacity-70">El mejor trato posible</div>
          </div>
        </div>
      </div>

      {/* Image container */}
      <div className="flex-grow relative z-10 mt-4">
        <img
          src="/assets/psychologist.webp"
          alt="Psychologist"
          className="object-cover h-full w-full"
          style={{ objectPosition: "center" }}
        />
      </div>
        
      {/* Reservation banner */}
      <div className="absolute bottom-12 left-5 right-5 z-20">
        <div className="bg-[#333333] bg-opacity-80 rounded-lg p-3 flex items-center">
          <div className="bg-transparent mr-3 flex-shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M16 2V6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 2V6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M3 10H21" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Reseva una cita</div>
            <div className="text-xs opacity-70">Videollamada/Chat</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;