import React from "react";

const Header = ({ user }) => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">
        Bienvenido, {user.name}
      </h1>
      <div className="text-sm text-gray-500">Tu salud mental es importante</div>
    </header>
  );
};

export default Header;
