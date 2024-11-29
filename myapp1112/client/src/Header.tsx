import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {

  return (
<header>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ICT STUDY</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/back/memo/new">메모장</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/myapp1112/signup">회원가입</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/back/gallery">Gallery</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/back/gallery/new">Gallery 등록</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  )
}

export default Header