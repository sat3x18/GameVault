import { GameItem } from '../types';

export const gameItems: GameItem[] = [
  {
    id: '1',
    title: 'Valorant Account - EU',
    price: 45,
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'High-tier Valorant account with exclusive skins and competitive rank. EU region, all champions unlocked.',
    category: 'Accounts',
    inStock: true
  },
  {
    id: '2',
    title: 'CS2 Prime Account',
    price: 32,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Counter-Strike 2 Prime account with excellent trust factor and clean history. Ready for competitive play.',
    category: 'Accounts',
    inStock: true
  },
  {
    id: '3',
    title: 'League of Legends - Level 30',
    price: 28,
    image: 'https://images.pexels.com/photos/7915236/pexels-photo-7915236.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fresh Level 30 LoL account with all champions and premium skins. Perfect for ranked play.',
    category: 'Accounts',
    inStock: true
  },
  {
    id: '4',
    title: 'Steam Gift Card - $50',
    price: 47,
    image: 'https://images.pexels.com/photos/5029857/pexels-photo-5029857.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Digital Steam wallet code delivered instantly. Perfect for purchasing games and in-game content.',
    category: 'Gift Cards',
    inStock: true
  },
  {
    id: '5',
    title: 'Apex Legends Coaching - 2 Hours',
    price: 35,
    image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional coaching session with a Master-tier player. Improve your gameplay and ranking.',
    category: 'Services',
    inStock: true
  },
  {
    id: '6',
    title: 'Discord Nitro - 1 Month',
    price: 9,
    image: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Discord Nitro subscription with enhanced features, custom emojis, and server boosts.',
    category: 'Subscriptions',
    inStock: false
  }
];