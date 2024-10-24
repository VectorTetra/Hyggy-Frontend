export interface Product {
  descriptionText: string;
  articleNum: string;
  descriptionImage: string;
  productName: string;
  rating: string;
  relatedArticles: { id: number; title: string; image: string }[];
  lastReviews: { name: string; rating: number; text: string }[];
  similarProducts: any[];
  specifications: { name: string; value: string }[];
}