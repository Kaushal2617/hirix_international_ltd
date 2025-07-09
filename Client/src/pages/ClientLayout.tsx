import React from 'react';
import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';

const ClientLayout = ({ categories }) => {
  return (
    <>
      <Navbar categories={categories} />
      <Outlet />
    </>
  );
};

export default ClientLayout; 