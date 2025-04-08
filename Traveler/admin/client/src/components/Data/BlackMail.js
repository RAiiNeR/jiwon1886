export const BlackListMember = {
  title: "BlackListMember",
  columns: [
    {
      name: "#",
      selector: row => <span className={row.txtClass}>{row.ticketid}</span>,
      sortable: true
    },
    {
      name: "HOLIDAY DAY",
      selector: row => <span className={row.txtClass}>{row.Holidayday}</span>,
      sortable: true
    },
    {
      name: "HOLIDAY DATE",
      selector: row => <span className={row.txtClass}>{row.holidaydate}</span>,
      sortable: true
    },
    {
      name: "HOLIDAY NAME",
      selector: row => <span className={row.txtClass}>{row.holidayname}</span>,
      sortable: true
    },
    {
      name: "ACTION",
      selector: () => { },
      sortable: true,
      cell: () => <div className="btn-group" role="group" aria-label="Basic outlined example">
        <button type="button" className="btn btn-outline-secondary"><i className="icofont-edit text-success"></i></button>
        <button type="button" className="btn btn-outline-secondary deleterow"><i className="icofont-ui-delete text-danger"></i></button>
      </div>
    }

  ],
  rows: [
    {
      ticketid: "01",
      Holidayday: "Tuesday",
      holidaydate: "testuser01@example.com",
      holidayname: "테스형",
      txtClass: 'text-danger',
      mailcheck: '1월 26일'
    },
    {
      ticketid: "02",
      Holidayday: "Friday",
      holidaydate: "randomguy99@email.com",
      holidayname: "김경민",
      txtClass: 'text-danger',
      mailcheck: '4월 2일'
    },
    {
      ticketid: "03",
      Holidayday: "Monday",
      holidaydate: "helloworld@fakemail.com",
      holidayname: "지나은",
      txtClass: 'text-danger',
      mailcheck: '4월 30일'
    },
    {
      ticketid: "04",
      Holidayday: "Wednesday",
      holidaydate: "sampleuser123@myemail.com",
      holidayname: "김채린",
      txtClass: 'text-success',
      mailcheck: '4월 15일'
    },
    {
      ticketid: "05",
      Holidayday: "Wednesday",
      holidaydate: "demoaccount@mockmail.com",
      holidayname: "이정우",
      mailcheck: '8월 22일'
    },
    {
      ticketid: "06",
      Holidayday: "Monday",
      holidaydate: "john.doe@testmail.com",
      holidayname: "김풍달",
      mailcheck: '9월 30일'
    },
    {
      ticketid: "07",
      Holidayday: "Tuesday",
      holidaydate: "jane.smith@placeholder.com",
      holidayname: "최재성",
      mailcheck: '10월 2일'
    },
    {
      ticketid: "08",
      Holidayday: "Wednesday",
      holidaydate: "dummyemail007@tempmail.net",
      holidayname: "정윤호",
      mailcheck: '11월 7일'
    },
    {
      ticketid: "09",
      Holidayday: "Tuesday	",
      holidaydate: "fakeuser88@trial.com",
      holidayname: "김진헌",
      mailcheck: '12월 25일'
    },
    {
      ticketid: "10",
      Holidayday: "Tuesday	",
      holidaydate: "guestaccount@sample.org",
      holidayname: "정효진",
      mailcheck: '1월 25일'
    }
  ]
}