import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { isExists } from 'date-fns';
import { AppDispatch } from './store';


const Naverlogin = () => {
  const { token } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    window.addEventListener('unload', () => {
      window.opener.postMessage({}, '*');
    })
    if(token){
      localStorage.setItem('token', token);
    }
    window.close();
  }, [])

  return (
    <div style={{ background: 'white', width: '100vw', height: '100vh' }}>
    </div>
  )
}

export default Naverlogin