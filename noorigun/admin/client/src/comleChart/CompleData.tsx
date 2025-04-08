import axios from "axios";
 
// 데이터 배열 생성
export const compleChart = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/comple/chart`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error => " + error);
  }
};

// 데이터 배열 생성
export const compleChartByDept = async (dept:string) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/comple/chart/${dept}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error => " + error);
  }
};
