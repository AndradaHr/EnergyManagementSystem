import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CarouselSection from './CarouselSection';

const User = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <CarouselSection/>

    </div>
  );
};

export default User;
