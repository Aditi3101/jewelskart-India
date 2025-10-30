
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface MenuItem {
  id: number;
  name: string;
  path: string;
}

interface DropdownGroup {
  group_name: string;
  group_path: string;
  items: MenuItem[];
}

const NavBar: React.FC = () => {
  const [dropdownList, setDropdownList] = useState<DropdownGroup[]>([]);
  const [flatLinks, setFlatLinks] = useState<MenuItem[]>([]);

  useEffect(() => {
    axios
      .get("https://jewelskart-backend.onrender.com/api/navbar-grouped", {
        headers: {
          "x-api-key": "your_super_secret_api_key_123",
        },
      })
      .then((res) => {
        const data = res.data as {
          dropdownList: DropdownGroup[];
          flatLinks: MenuItem[];
        };
        setDropdownList(data.dropdownList || []);
        setFlatLinks(data.flatLinks || []);
      })
      .catch((err) => console.error("❌ Failed to fetch navbar:", err));
  }, []);

  return (
    <nav className="py-2 bg-white border-bottom">
      <div className="container d-flex flex-wrap justify-content-center">
        <ul className="nav me-auto justify-content-center w-100">
          {dropdownList.map((group, idx) => (
            <li className="nav-item dropdown" key={idx}>
              <a
                href="#"
                className="nav-link dropdown-toggle link-body-emphasis px-2"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                {group.group_name}
              </a>
              <ul className="dropdown-menu">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path} className="dropdown-item">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {flatLinks.map((item) => (
            <li className="nav-item" key={item.id}>
              <Link to={item.path} className="nav-link link-body-emphasis px-2">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
