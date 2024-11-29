import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RequireAuth from '../comp/RequireAuth';

interface Gallery {
  id: number;
  writer: string;
  title: string;
  description: string;
  image_names: string[];
  gdate: string;
}

const GalleryList = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [title, setTitle] = useState('');
  const filePath = 'http://localhost:81/back/uploads/';

  // -----------------------------------------------
  // localStorage에 token 이 존재하지 않는다면 
  // 로그인 페이지로 이동 시킨다. ===========================> 컴포넌트로 변경한다.
  // const navigate = useNavigate();
  //   // 로그인 상태 확인 후 리다이렉트
  //   useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       alert('로그인이 필요합니다.');
  //       navigate('/back/login'); // 로그인 페이지로 리다이렉트
  //     }
  //   }, [navigate]) //<---navigate를 감지하고 있음
  // ----------------------------------------------------
// 타이틀이 변경되거나onChange , page를 클릭할 때 onClick
// [] 안에서 감지하고 있다가 해당 함수를 호출해서 서버의 데이트를 받아온다. 
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchGalleries(page, title);
  }, [page, title]);
  
  const fetchGalleries = (page: number, title: string) => {
    console.log("Axios 동작!!!!!!!!!");
    // 경로 수정http://192.168.0.42/
    axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/gallery`, {
      params: {
        page: page,  // 페이지 번호를 0부터 시작하도록 조정
        size,
        title,
      },
    }).then(response => {
        console.log(response.data.content);
        console.log("================");
        //console.log(response.data.total_pages);
        setGalleries(response.data.content);
        setTotalPages(response.data.total_pages);
      })
      .catch(error => {
        console.error('오류!', error);
      });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setPage(1); // 검색어가 변경되면 첫 페이지로 이동
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <RequireAuth>
    <div className="container mt-4">
      <h1 className="mb-4">갤러리 리스트</h1>
      <Link className="btn btn-primary mb-4" to="/back/galleryForm">등록</Link>
      <div className="mb-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="검색어를 입력하세요..." 
          value={title} 
          onChange={handleSearchChange} 
        />
      </div>
      <div className="row">
        {galleries.map((gallery) => (
          <div key={gallery.id} className="col-md-4">
            <div className="card mb-4">
              <Link to={`/back/gallery/${gallery.id}`}>
              {gallery.image_names[0]}
                <img src={filePath + gallery.image_names[0]}
                  className="card-img-top"
                  alt={gallery.title}
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150'}
                />
              </Link>
              <div className="card-body">
                <p>{gallery.id}</p>
                <h5 className="card-title">{gallery.title}</h5>
                <p className="card-text">{gallery.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${i + 1 === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
    </RequireAuth>
  );
}

export default GalleryList;
