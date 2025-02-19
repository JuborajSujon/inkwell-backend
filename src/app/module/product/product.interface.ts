export type TProduct = {
  name: string;
  brand: string;
  price: number;
  category:
    | 'Writing'
    | 'Office Supplies'
    | 'Art Supplies'
    | 'Educational'
    | 'Technology';
  model: string;
  photo: string;
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
