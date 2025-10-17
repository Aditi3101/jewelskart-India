import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createSlug } from "../utils/urlUtils";

interface Type {
  type_id: number;
  type_name: string;
  path: string;
}

const TypeNavBar: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);

  useEffect(() => {
    fetch('https://jewelskart-backend.onrender.com/api/types')
      .then((res) => res.json())
      .then((data) => {
        console.log("Types data:", data);
        setTypes(data);
      })
      .catch((err) => console.error("❌ Failed to fetch types:", err));
  }, []);

  console.log("Current types:", types);

  return (
    <nav className="py-2 bg-white border-bottom">
      <div className="container d-flex flex-wrap justify-content-center">
        <ul className="nav me-auto justify-content-center w-100">
          {types.length === 0 ? (
            <li className="nav-item">
              <span className="nav-link px-2">Loading...</span>
            </li>
          ) : (
            types.map((type) => (
              <li className="nav-item" key={type.type_id}>
                <Link 
                  to={`/type/${createSlug(type.type_name)}`} 
                  className="nav-link link-body-emphasis px-2"
                >
                  {type.type_name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  );
};

export default TypeNavBar;