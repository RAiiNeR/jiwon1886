import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
//이 인터페이스는 json구조와 같아야 한다
interface Upboard{
  num:number;
  title:string;
  writer:string;
  content:string;
  imgn:string;
  hit:number;
  reip:string;
  date:string;
}

const UpboardListOri: React.FC = () => {
  const [board, setBoard] = useState<Upboard[]>([]);
  const imageBasePath = 'http://192.168.0.90/myictstudy/resources/imgfile/'; // 이미지 기본 경로
  //const imageBasePath = 'http://192.168.0.90/myictstudy/resources/imgfile/'; // 이미지 기본 경로
  useEffect(() => {
    // 서버에서 목록을 가져오는 함수
    const fetchUpboardList = async () => {
      try {
        const response = await axios.get('http://192.168.0.90/myictstudy/upboard/list');
        setBoard(response.data);
      } catch (error) {
        console.error("Error fetching upboard list", error);
      }
    };

    fetchUpboardList();
  }, [])

  const formDate = (date:string)=>{
    const bdate = new Date(date);
    return bdate.toLocaleDateString()+' '+bdate.toLocaleTimeString();
  };

  return (
    <div>
      {/* <h2>리스트 페이지</h2> */}
      {/* <Link to="/upboard/new" className='btn btn-primary mb-3'>입력</Link> */}
      <div className="container mt-4">
        <h2 className="mb-4">Upboard List</h2>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th className="text-center align-middle">Num</th>
              <th className="text-center align-middle">Title</th>
              <th className="text-center align-middle">Writer</th>
              <th className="text-center align-middle">Image</th>
              <th className="text-center align-middle">Hit</th>
              <th className="text-center align-middle">Date</th>
            </tr>
          </thead>
          <tbody>
          {board.map((item,index)=>(
            <tr key={index}>
              <td className="text-center align-middle">{item.num}</td>
              <td className="text-center align-middle">
                <Link to={`/upboard/${item.num}`}>{item.title}</Link>
              </td>
              <td className="text-center align-middle">{item.writer}</td>
              <td className="text-center align-middle">
              {item.imgn ? (
                <img 
                  src={`${imageBasePath}${item.imgn}`}
                  alt={item.title} 
                  style={{ width: '80px', height: 'auto' }} 
                  className="img-thumbnail"
                />
              ) : (
                'No Image'
              )}
              </td>
              <td className="text-center align-middle">{item.hit}</td>
              <td className="text-center align-middle">{formDate(item.date)}</td>
            </tr>
          ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={6} className="text-center">
                <Link to="/upboard/new" className="btn btn-primary mb-3">Add New Post</Link>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default UpboardListOri