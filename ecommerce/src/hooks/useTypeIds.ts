import { useState, useEffect } from 'react';

interface Category {
  catagory_id: number;
  catagory_name: string;
  type_name: string;
  type_id: number;
}

interface TypeIds {
  silverTypeId: number | null;
  bagTypeId: number | null;
  [key: string]: number | null;
}

export const useTypeIds = () => {
  const [typeIds, setTypeIds] = useState<TypeIds>({
    silverTypeId: null,
    bagTypeId: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        const silverType = data.find(cat => cat.type_name === "925 Sterling Silver");
        const bagType = data.find(cat => cat.type_name === "Bags");
        
        setTypeIds({
          silverTypeId: silverType?.type_id || null,
          bagTypeId: bagType?.type_id || null,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching type IDs:", err);
        setLoading(false);
      });
  }, []);

  return { typeIds, loading };
};