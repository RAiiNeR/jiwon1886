import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import RequireAuth from '../comp/RequireAuth';

const GalleryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <RequireAuth>
      <div>
        <h3>Detail페이지</h3>
        <p>{id}</p>
      </div>
    </RequireAuth>
  )
}

export default GalleryDetail