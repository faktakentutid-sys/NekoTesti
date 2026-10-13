export interface Testimonial {
  id: string;
  name: string;
  isAnonymous: boolean;
  avatarType: 'preset' | 'custom';
  avatarUrl: string;
  presetAvatarId?: string;
  rating: number; // 1 to 5
  comment: string;
  orderItem?: string; // Produk atau jasa yang diorder
  date: string; // ISO string
  verified: boolean;
  likes: number;
  tags: string[];
  isPinned?: boolean;
  permissionToPostContent?: boolean | null; // Opsional: apakah bersedia karya/pesanan diunggah ke konten medsos
  ownerReply?: {
    text: string;
    date: string;
  };
}

export interface StoreProfile {
  name: string;
  tagline: string;
  category: string;
  logoUrl: string;
  phoneOrWa?: string;
  bannerGradient: string;
  customBannerUrl?: string; // Foto banner yang dapat diatur oleh pemilik
}

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'most_helpful';
export type FilterRating = 'all' | 5 | 4 | 3 | 2 | 1;
