
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
    .get(`https://jewelskart-backend.onrender.com/api/search?query=${searchTerm || ''}`)
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
                  src={`https://jewelskart-backend.onrender.com/uploads/${product.fileToUpload}`}
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
