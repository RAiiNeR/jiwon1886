import axios from "axios";

export interface MemberVo {
  num: number;
  name: string;
  ssn: string;
  id: string;
  pwd: string;
  phone: string;
  email: string;
  addr: string;
}
 
// 데이터 배열 생성
export const memberData = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/member`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error => " + error);
  }
};

// 데이터 배열 생성
export const incrementMemberData = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/member/increment`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error => " + error);
  }
};
