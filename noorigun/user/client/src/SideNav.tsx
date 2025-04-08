import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface SideNavData {
    title: string;
    list: Array<{ link: string, text: string, now?: boolean }>;
}

const SideNav: React.FC<{ sideNavData: SideNavData }> = ({ sideNavData: data }) => {

    const [barPosition, setBarPosition] = useState(0);

    const handleScroll = () => {
        const position = window.scrollY - 120 < 0 ? 0 : window.scrollY - 120;
        setBarPosition(position);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    return (
        <div>
            <div className="p-3 pt-3 float-start side-nav"  style={{ top: barPosition }}>
                <nav>
                    <ul className="border rounded-3 list-unstyled p-3 text-center">
                        <li className="fs-4 side-nav-title">{data.title}</li>
                        <li>
                            <hr />
                        </li>
                        <li>
                            <ul className="text-start fs-5">
                                {
                                    data.list.map((item, i) => (
                                        <li key={i}>
                                            <Link to={item.link} className={item.now ? 'text-decoration-underline' : ''}>
                                                {item.text}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default SideNav