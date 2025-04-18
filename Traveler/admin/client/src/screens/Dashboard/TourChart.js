
export const chartOverView =[
    {
        title:"블랙리스트 회원 목록",
        subTitle1:"",
        subTitle2:"",
        linkText:"",
        showHeader:false,
        hideDownload:true,
        chartData:{
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    toolbar: {
                        show: false,
                    },
                },
                colors: ['#0d6efd','#ffd55d'],
                stroke: {
                    width: [0, 4]
                },        
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                // labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
                xaxis: {
                    // type: 'datetime'
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                
                yaxis: [{
                    title: {
                        text: 'Website Blog',
                    },
        
                }, {
                    opposite: true,
                    title: {
                        text: 'Social Media'
                    }
                }]
            },
            series: [{
                name: '테마별',
                type: 'column',
                data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
            }, {
                name: '성향별',
                type: 'line',
                data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
            }],
        }
    }
]