// URL utility functions for SEO-friendly URLs

export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[/\\&+]/g, ' ') // Convert slashes, backslashes, & and + to spaces
    .replace(/[^\w\s-]/g, '') // Remove other special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const slugToName = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
};

// Type definitions for API responses
export interface TypeData {
  type_id: number;
  type_name: string;
  path?: string;
}

export interface CategoryData {
  catagory_id: number;
  catagory_name: string;
  type_name: string;
  image: string;
  type_id: number;
}

export interface ProductData {
  p_id: number;
  p_name: string;
  p_price: number;
  p_code: string;
  catagory_name: string;
  fileToUpload: string;
}