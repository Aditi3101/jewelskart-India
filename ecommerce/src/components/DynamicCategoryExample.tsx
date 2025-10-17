import React from 'react';
import CategoryCard from './CategoryCard';
import { useTypeIds } from '../hooks/useTypeIds';

const DynamicCategoryExample: React.FC = () => {
  const { typeIds, loading } = useTypeIds();

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div>
      {/* Example 1: Sterling Silver categories in grid layout */}
      {typeIds.silverTypeId && (
        <CategoryCard 
          typeId={typeIds.silverTypeId} 
          title="Sterling Silver Collection" 
          layout="grid" 
          maxItems={4} 
        />
      )}

      {/* Example 2: Bag categories in horizontal layout */}
      {typeIds.bagTypeId && (
        <CategoryCard 
          typeId={typeIds.bagTypeId} 
          title="Bag Collection" 
          layout="horizontal" 
          maxItems={6} 
        />
      )}

      {/* Example 3: You can also use specific type IDs directly if you know them */}
      <CategoryCard 
        typeId={1} 
        title="Type 1 Categories" 
        layout="grid" 
        maxItems={8} 
      />
    </div>
  );
};

export default DynamicCategoryExample;