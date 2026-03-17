export interface User {
  id: number;
  email: string;
  name: string;
  coins: number;
  referral_code: string;
  is_admin: boolean;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export const CATEGORIES = ['All', 'Music', 'Gaming', 'News', 'Learning'];

export const MOCK_VIDEOS: Video[] = [
  { id: '1', title: 'Top 10 Coding Tips', thumbnail: 'https://picsum.photos/seed/coding/400/225', duration: '12:45', category: 'Learning' },
  { id: '2', title: 'New Gaming Setup 2024', thumbnail: 'https://picsum.photos/seed/gaming/400/225', duration: '08:20', category: 'Gaming' },
  { id: '3', title: 'Relaxing Lo-Fi Beats', thumbnail: 'https://picsum.photos/seed/music/400/225', duration: '60:00', category: 'Music' },
  { id: '4', title: 'World News Today', thumbnail: 'https://picsum.photos/seed/news/400/225', duration: '05:30', category: 'News' },
  { id: '5', title: 'Advanced React Patterns', thumbnail: 'https://picsum.photos/seed/react/400/225', duration: '25:15', category: 'Learning' },
];
