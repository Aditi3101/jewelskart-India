import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { isNumeric } from '../utils/urlUtils';
import TypePage from './TypePage';

const SEOTypeWrapper: React.FC = () => {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const [typeId, setTypeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!nameOrId) {
      setError(true);
      setLoading(false);
      return;
    }

    if (isNumeric(nameOrId)) {
      setTypeId(parseInt(nameOrId));
      setLoading(false);
    } else {
      fetch(`http://localhost:5000/api/type-id/${nameOrId}`)
        .then(res => res.json())
        .then(data => {
          if (data.type_id) {
            setTypeId(data.type_id);
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [nameOrId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (error || !typeId) return <Navigate to="/" replace />;

  return <TypePage typeId={typeId} />;
};

export default SEOTypeWrapper;