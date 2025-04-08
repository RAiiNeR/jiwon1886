import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { parseJwt } from "./jwtUtils";

const Header: React.FC = () => {
  const [decodeToken, setDecodeToken] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if(token){
      setDecodeToken(parseJwt(token))
    }
  },[])

  if(!decodeToken){
    return <></>
  }

  return (
    <div className="header">
      <nav className="navbar py-4">
        <div className="container-xxl justify-content-end">
          <div className="h-right d-flex align-items-center me-3">
            <Dropdown className="dropdown user-profile ms-2 ms-sm-3 d-flex align-items-center">
              <div className="u-info me-2">
                <p className="mb-0 text-end line-height-sm "><span className="font-weight-bold">{decodeToken.name}</span></p>
                <small>{decodeToken.role}</small>
              </div>
              <Dropdown.Toggle as="a" className="nav-link dropdown-toggle pulse p-0">
                <img className="avatar lg rounded-circle img-thumbnail" src={`${process.env.REACT_APP_FILES_URL}/img/manager/${decodeToken.img}`} alt="profile" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                <div className="card border-0 w280">
                  <div className="card-body pb-0">
                    <div className="d-flex py-1">
                      <img className="avatar rounded-circle" src={`${process.env.REACT_APP_FILES_URL}/img/manager/${decodeToken.img}`} alt="profile" />
                      <div className="flex-fill ms-3">
                        <p className="mb-0"><span className="font-weight-bold">{decodeToken.name}</span></p>
                        <small className="">{decodeToken.email}</small>
                      </div>
                    </div>

                    <div><hr className="dropdown-divider border-dark" /></div>
                  </div>
                  <div className="list-group m-2 ">
                    <Link to="tasks" className="list-group-item list-group-item-action border-0 "><i className="icofont-tasks fs-5 me-3"></i>My Task</Link>
                    <Link to="members" className="list-group-item list-group-item-action border-0 "><i className="icofont-ui-user-group fs-6 me-3"></i>members</Link>
                    <Link to={`${process.env.REACT_APP_BASE_URL}/login/login`} className="list-group-item list-group-item-action border-0 "><i className="icofont-logout fs-6 me-3"></i>Signout</Link>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>


          <button className="navbar-toggler p-0 border-0 menu-toggle order-3"
            onClick={() => {
              var side = document.getElementById("mainSideMenu");
              if (side) {
                if (side.classList.contains("open")) {
                  side.classList.remove("open")
                } else {
                  side.classList.add("open")
                }
              }
            }}
          >
            <span className="fa fa-bars"></span>
          </button>

        </div>
      </nav>
    </div>
  )
}


export default Header;  