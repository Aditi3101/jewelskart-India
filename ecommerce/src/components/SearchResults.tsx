// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";

// interface Product {
//   p_id: number;
//   p_name: string;
//   p_price: number;
//   p_code: string;
//   catagory_name: string;
//   collection_name: string;
//   small_description: string;
//   fileToUpload: string;
//   image1: string;
// }

// const SearchResults: React.FC = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const query = queryParams.get("query") || "";
//   const [results, setResults] = useState<Product[]>([]);

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const res = await axios.get<Product[]>(
//           `http://localhost:5000/search?query=${encodeURIComponent(query)}`,
//           {
//             headers: {
//               "x-api-key": "your_super_secret_api_key_123",
//             },
//           }
//         );
//         setResults(res.data);
//       } catch (error) {
//         console.error("Search error:", error);
//       }
//     };

//     if (query) fetchResults();
//   }, [query]);

//   return (
//     <div className="container mt-4">
//       <h4>Search Results for: "{query}"</h4>
//       {results.length > 0 ? (
//         <div className="row">
//           {results.map((product) => (
//             <div className="col-md-3 mb-4" key={product.p_id}>
//               <div className="card h-100">
//                 <img
//                   src={`http://localhost:5000/uploads/${product.fileToUpload || product.image1}`}
//                   alt={product.p_name}
//                   className="card-img-top"
//                   style={{ height: "200px", objectFit: "cover" }}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{product.p_name}</h5>
//                   <p className="card-text mb-1">₹{product.p_price}</p>
//                   <p className="text-muted mb-1">{product.catagory_name} / {product.collection_name}</p>
//                   <p className="small">{product.small_description}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No results found.</p>
//       )}
//     </div>
//   );
// };

// export default SearchResults;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TopNavBar from './TopNavBar';
import ResponsiveNavBarWrapper from './esponsiveNavBarWrapper';
import Footer from './Footer';

const SearchResults: React.FC = () => {
  const { searchTerm } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  axios
    .get(`http://localhost:5000/api/search?query=${searchTerm || ''}`)
    .then((res) => {
      setResults(res.data || []);
      setError(null);
    })
    .catch(() => setError("Error fetching search results"))
    .finally(() => setLoading(false));
}, [searchTerm]);


  const handleClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Search Results for “{searchTerm}”</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {results.map((product) => (
              <div
                key={product.p_id}
                onClick={() => handleClick(product.p_id)}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  padding: '15px',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  textAlign: 'center',
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${product.fileToUpload}`}
                  alt={product.p_name}
                  style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                />
                <h4 style={{ marginTop: '10px', fontWeight: '600' }}>{product.p_name}</h4>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>Rs. {product.p_price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
