import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/OrgChart.css';

// 조직도 렌더링을 위한 컴포넌트
const OrgChart: React.FC<{ person: any }> = ({ person }) => {

    const navigate = useNavigate(); 
  
   // 민원 접수 절차 페이지로 이동
    const goToComplaintPage = () => {
      navigate('/noorigun/complaintProcese'); 
    };
  
    return (
      <div className={`orgNode ${'root' + person.root}`}>
        <div className="orgPerson"> {/* 구성원 정보(이미지, 이름, 직위) */}
          {person.image ? (
            <img className="orgPhoto" src={person.image} alt={person.name} />
          ) : null}
          <h3 className="orgName">{person.name}</h3> {/* 구성원 이름 */}
          <p className="orgPosition">{person.position}</p> {/* 구성원 직위 */}
        </div>
        {person.children && person.children.length > 0 && (
          <div className="orgChildren">
            {person.children.map((child: any, index: number) => (
              <OrgChart key={index} person={child} />
            ))}
          </div>
        )}
        {/* Complaint 페이지로 넘어가는 버튼 : person의 root 값이 '1'인 경우에만 버튼 표시 */}
        {
          person.root === '1' && (
            <button className="actionButton" onClick={goToComplaintPage}>
              민원 접수 절차 안내
            </button>
          )
        }
      </div>
    );
  }

export default OrgChart;