import Avatar7 from "../../assets/images/xs/avatar7.jpg";
import Avatar8 from "../../assets/images/xs/avatar8.jpg";




export const PayListData = {
 
  title: "Leaders List",
  columns: [
   
    {
      name: "출발지",
      selector: (row) => row.departure,
      sortable: true
    },
    {
      name: "출발시간",
      selector: (row) => row.departureoftime,
      sortable: true
    },
    {
      name: "도착지",
      selector: (row) => row.destination,
      sortable: true
    },
    {
      name: "도착시간",
      selector: (row) => row.destinationoftime,
      sortable: true
    },
    {
      name: "좌석번호",
      selector: (row) => row.sitnum,
      sortable: true
    },
   

  ],
  rows: [
    {
      num: "테스형",
      // image: Avatar1,
      departure:"동서울",
      departureoftime:"06:00",
      destination: "강원도 강릉",
      destinationoftime: "18/03/21",
      // pay: "5만원",
      membernum:"2",
      sitnum:"좌석",
      assignedstaff: [Avatar7, Avatar8],
      status: "출발예정",
    },
  

  ]
}


