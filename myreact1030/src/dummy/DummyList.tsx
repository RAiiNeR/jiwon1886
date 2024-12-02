import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './DummyCss.css'
import { Link } from 'react-router-dom';
import { postList } from './DummyFile';

interface DummyData {
  num: number;
  title: string;
  writer: string;
  bdate: string;
  state: string;
}
const DummyList: React.FC = () => {
  const [dummyData, setDummyData] = useState<DummyData[]>([]);
  const [dataList, setDataList] = useState([]);
  const [count, setCount] = useState(1);

  useEffect(()=>{
    setDummyData(postList);
  },[])

  // function makePagination(listCnt:any, pageRange:any, thisPage:any) {
  //   const lastPage = ((listCnt - 1) / pageRange) + 1;
  //   const startRange = pageRange * ((thisPage - 1) / pageRange) + 1;
  //   const endRange =
  //     startRange + pageRange - 1 < lastPage
  //       ? startRange + pageRange - 1
  //       : lastPage;
  //   const startIdx = (thisPage - 1) * pageRange;
  //   const lastIdx = startIdx + pageRange - 1;
  //   const showStartBtn = pageRange < thisPage;
  //   const showEndBtn = endRange !== lastPage;
  //   const pageNotFound = thisPage <= 0 || thisPage > lastPage;
  //   return {
  //     startRange,
  //     endRange,
  //     lastPage,
  //     startIdx,
  //     lastIdx,
  //     showStartBtn,
  //     showEndBtn,
  //     pageNotFound
  //   };
  // }


  // useEffect(() => {
  //   setDummyData([...dummyData, { num: count, title: `제목${count}`, writer: `테스형${count}`, bdate: `날짜${count}`, state: `상태${count}` }])
  //   if (count < 10) setCount(count + 1)

  // }, [count])

  useEffect(() => {
    setCount(count + 1)
  }, []);

  const formDate = (date: string) => {
    const bdate = new Date(date);
    return bdate.toLocaleDateString() + ' ' + bdate.toLocaleTimeString();
  };

  return (
    <div className='container'>
      <h2>더미 샘플</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>상태</th>
          </tr>
        </thead>

        <tbody>
          {dummyData.map((item, index) => (
            <tr key={item.num}>
              <td>{item.num}</td>
              <td><Link to={`/dummy/${item.num}`}>{item.title}</Link></td>
              <td>{item.writer}</td>
              {/* <td>{formDate(item.bdate)}</td> */}
              <td>{item.bdate}</td>
              <td>{item.state}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지 표시 */}
      <div className='btn-page'>
        <nav>
          <ul className='pagination'>
            <li>

            </li>
            <li></li>
            <li></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default DummyList