export const orgData = {
    name: "군수",
    position: "황보도연",
    image: "images/orgchart/1.jpg",
    root: '1',
    children: [
      {
        name: "본부",
        root: '2',
        children: [
          { name: "감사담당관", position: "전준영", image: "images/orgchart/2.jpg", root: '3' },
          { name: "기획예산담당관", position: "최의진", image: "images/orgchart/3.jpg", root: '3' }
        ]
      },
      {
        name: "문화 복지국",
        root: '2',
        children: [
          { name: "홍보담당관", position: "민다빈", image: "images/orgchart/4.jpg", root: '3' },
          { name: "안전복지정책관", position: "장지원", image: "images/orgchart/5.jpg", root: '3' },
          { name: "민원토지관", position: "이승환", image: "images/orgchart/6.jpg", root: '3' }
        ]
      },
      {
        name: "경제국",
        root: '2',
        children: [
          { name: "일자리경제관", position: "조유경", image: "images/orgchart/7.png", root: '3' },
          { name: "정원산림관", position: "이학수", image: "images/orgchart/8.jpg", root: '3' }
        ]
      }
    ]
  };