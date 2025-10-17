
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<any[]>("http://localhost:5000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (catName: string) => {
    navigate(`/products/${encodeURIComponent(catName)}`);
  };

  return (
    <div className="row">
      {categories.map((cat) => (
        <div className="col-md-3" key={cat.catagory_id} style={{ marginBottom: "50px" }}>
          <div
            className="card card-span text-white"
            onClick={() => handleClick(cat.catagory_name)}
            style={{ cursor: "pointer" }}
          >
            <img
              className="card-img"
              src={`http://localhost:5000/uploads/${cat.image}`}
              style={{ height: "300px" }}
              alt={cat.catagory_name}
            />
            <div className="card-img-overlay bg-dark-gradient" style={{ height: "300px" }}>
              <div className="p-5 p-md-2 p-xl-5">
                <h3 className="text-light" style={{ marginTop: "140px" }}>{cat.catagory_name}</h3>
                <p className="text-light fs-1 fw-bold">Shop Now</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
