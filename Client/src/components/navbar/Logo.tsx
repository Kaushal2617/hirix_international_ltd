
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center w-40">
      <span className="self-center text-xl font-semibold whitespace-nowrap"><img src='/src/Assets/WhatsApp Image 2025-04-04 at 18.25.43.jpeg'/></span>
    </Link>
  );
};

export default Logo;
