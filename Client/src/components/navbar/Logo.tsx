
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center w-40">
      <span className="self-center text-xl font-semibold whitespace-nowrap"><img src='/logo2.jpg'/></span>
    </Link>
  );
};

export default Logo;
