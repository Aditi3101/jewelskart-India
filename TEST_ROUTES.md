# Test SEO Routes

## Backend API Tests

Test these URLs in your browser or Postman:

### Type ID Lookup
- `http://localhost:5000/api/type-id/925-sterling-silver`
- `http://localhost:5000/api/type-id/bags`
- `http://localhost:5000/api/type-id/1` (should work for backward compatibility)

### Category ID Lookup  
- `http://localhost:5000/api/category-id/necklace`
- `http://localhost:5000/api/category-id/rings`
- `http://localhost:5000/api/category-id/317` (should work for backward compatibility)

### Product ID Lookup
- `http://localhost:5000/api/product-id/eternity-necklace`
- `http://localhost:5000/api/product-id/1153` (should work for backward compatibility)

## Frontend URL Tests

Test these URLs in your browser:

### Type Pages
- `http://localhost:5173/type/925-sterling-silver`
- `http://localhost:5173/type/bags`

### Category Pages
- `http://localhost:5173/products/category/necklace`
- `http://localhost:5173/products/category/rings`

### Product Pages
- `http://localhost:5173/product/eternity-necklace`

## Expected Behavior

1. **SEO URLs should work**: Name-based URLs should load the correct content
2. **ID URLs should still work**: Old ID-based URLs should continue working
3. **Navigation should use SEO URLs**: All links should generate name-based URLs
4. **Backend should fetch by ID**: Despite SEO URLs, backend should still query by ID for performance

## Troubleshooting

If routes don't work:
1. Check browser console for errors
2. Check network tab to see API calls
3. Verify backend is running on port 5000
4. Check that database has the expected data