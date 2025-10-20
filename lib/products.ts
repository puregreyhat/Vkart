import { Product } from './store';

// Helper function to calculate arrival and expiry dates
function getExpiryData(daysUntilExpiry: number, arrivalDaysAgo: number = 0) {
  const today = new Date();
  const arrivalDate = new Date(today);
  arrivalDate.setDate(today.getDate() - arrivalDaysAgo);
  
  const expiryDate = new Date(arrivalDate);
  expiryDate.setDate(arrivalDate.getDate() + daysUntilExpiry);
  
  const remainingDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    arrivalDate: arrivalDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    daysUntilExpiry: remainingDays,
  };
}

export const products: Product[] = [
  // Vegetables & Fruits (10 products)
  {
    id: 'veg-1',
    name: 'Tomato - Hybrid',
    price: 18,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '500 g',
    productType: 'daily-veg',
    ...getExpiryData(7, 1), // Arrived yesterday, expires in 7 days
  },
  {
    id: 'veg-2',
    name: 'Onion',
    price: 25,
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '1 kg',
    productType: 'bulb-veg',
    ...getExpiryData(21, 3), // Arrived 3 days ago, expires in 21 days
  },
  {
    id: 'veg-3',
    name: 'Potato',
    price: 20,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '1 kg',
    productType: 'root-veg',
    ...getExpiryData(30, 2), // Arrived 2 days ago, expires in 30 days
  },
  {
    id: 'veg-4',
    name: 'Capsicum - Green',
    price: 40,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '500 g',
    productType: 'exotic-veg',
    ...getExpiryData(7, 1), // Arrived yesterday, expires in 7 days
  },
  {
    id: 'veg-5',
    name: 'Carrot',
    price: 22,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '500 g',
    productType: 'root-veg',
    ...getExpiryData(14, 0), // Arrived today, expires in 14 days
  },
  {
    id: 'veg-6',
    name: 'Banana - Robusta',
    price: 45,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '6 pieces',
    productType: 'fruit',
    ...getExpiryData(7, 1), // Arrived yesterday, expires in 7 days
  },
  {
    id: 'veg-7',
    name: 'Apple - Royal Gala',
    price: 125,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '4 pieces',
    productType: 'fruit',
    ...getExpiryData(10, 2), // Arrived 2 days ago, expires in 10 days
  },
  {
    id: 'veg-8',
    name: 'Carrot - Orange',
    price: 28,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '500 g',
    productType: 'root-veg',
    ...getExpiryData(14, 1), // Arrived yesterday, expires in 14 days
  },
  {
    id: 'veg-9',
    name: 'Coriander Leaves',
    price: 15,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/cc8401ed-66f1-4d31-9e89-d5eace0a9665.png',
    category: 'vegetables',
    weight: '100 g',
    productType: 'green-leafy',
    ...getExpiryData(3, 0), // Arrived today, expires in 3 days
  },
  {
    id: 'veg-10',
    name: 'Lemon',
    price: 35,
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop',
    category: 'vegetables',
    weight: '250 g',
    productType: 'fruit',
    ...getExpiryData(10, 0), // Arrived today, expires in 10 days
  },

  // Dairy & Breakfast (10 products)
  {
    id: 'dairy-1',
    name: 'Gokul Full Cream Milk',
    price: 37,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/bc94259c-f293-4289-abc5-f4cb0da63270.png',
    category: 'dairy',
    weight: '500 ml',
    productType: 'milk',
    ...getExpiryData(1, 0), // Arrived today, expires in 1 day
  },
  {
    id: 'dairy-2',
    name: 'Chitale Pasteurised Cow Milk',
    price: 29,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/b1f58476-0f18-4d25-a523-d2f29ebcb2c7.png',
    category: 'dairy',
    weight: '500 ml',
    productType: 'milk',
    ...getExpiryData(1, 0), // Arrived today, expires in 1 day
  },
  {
    id: 'dairy-3',
    name: 'Amul Masti Pouch Curd',
    price: 35,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/3af56c86-9a93-4d0c-a8d5-cf38493e4120.png',
    category: 'dairy',
    weight: '500 ml',
    productType: 'curd',
    ...getExpiryData(7, 0), // Arrived today, expires in 7 days
  },
  {
    id: 'dairy-4',
    name: 'Chitale Full Cream Milk',
    price: 37,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/da/cms-assets/cms/product/172ff149-60a1-4e57-968a-f252dc0ba6a6.png',
    category: 'dairy',
    weight: '500 ml',
    productType: 'milk',
    ...getExpiryData(1, 0), // Arrived today, expires in 1 day
  },
  {
    id: 'dairy-5',
    name: 'Salted Butter',
    price: 60,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '100 g',
    productType: 'butter-cheese',
    ...getExpiryData(30, 5), // Arrived 5 days ago, expires in 30 days
  },
  {
    id: 'dairy-6',
    name: 'Fresh Curd',
    price: 30,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '400 g',
    productType: 'curd',
    ...getExpiryData(7, 1), // Arrived yesterday, expires in 7 days
  },
  {
    id: 'dairy-7',
    name: 'Yogurt Cup',
    price: 30,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '400 g',
    productType: 'curd',
    ...getExpiryData(7, 0), // Arrived today, expires in 7 days
  },
  {
    id: 'dairy-8',
    name: 'White Bread',
    price: 45,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '450 g',
    productType: 'bread',
    ...getExpiryData(3, 0), // Arrived today, expires in 3 days
  },
  {
    id: 'dairy-9',
    name: 'White Eggs',
    price: 98,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '12 pieces',
    productType: 'other',
    ...getExpiryData(14, 2), // Arrived 2 days ago, expires in 14 days
  },
  {
    id: 'dairy-10',
    name: 'Cheese Slices',
    price: 130,
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '200 g',
    productType: 'butter-cheese',
    ...getExpiryData(45, 10), // Arrived 10 days ago, expires in 45 days
  },
  {
    id: 'dairy-11',
    name: 'Full Cream Milk',
    price: 31,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '500 ml',
    productType: 'milk',
    ...getExpiryData(1, 0), // Arrived today, expires in 1 day
  },
  {
    id: 'dairy-12',
    name: 'Brown Bread',
    price: 48,
    image: 'https://images.unsplash.com/photo-1608198399988-770a8f1f9c3c?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '400 g',
    productType: 'bread',
    ...getExpiryData(5, 1), // Arrived yesterday, expires in 5 days
  },
  {
    id: 'dairy-13',
    name: 'Fresh Cream',
    price: 60,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    category: 'dairy',
    weight: '250 ml',
    productType: 'other',
    ...getExpiryData(10, 3), // Arrived 3 days ago, expires in 10 days
  },

  // Snacks & Munchies (10 products)
  {
    id: 'snack-1',
    name: 'Potato Chips - Masala',
    price: 20,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '52 g',
    productType: 'snack',
    ...getExpiryData(180, 30), // Arrived 30 days ago, expires in 180 days
  },
  {
    id: 'snack-2',
    name: 'Crunchy Snacks Mix',
    price: 20,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '95 g',
    productType: 'snack',
    ...getExpiryData(180, 20), // Arrived 20 days ago, expires in 180 days
  },
  {
    id: 'snack-3',
    name: 'Indian Namkeen Mix',
    price: 50,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '200 g',
    productType: 'snack',
    ...getExpiryData(180, 15), // Arrived 15 days ago, expires in 180 days
  },
  {
    id: 'snack-4',
    name: 'Tortilla Chips',
    price: 20,
    image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '72.5 g',
    productType: 'snack',
    ...getExpiryData(180, 25), // Arrived 25 days ago, expires in 180 days
  },
  {
    id: 'snack-5',
    name: 'Butter Biscuits',
    price: 10,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '100 g',
    productType: 'snack',
    ...getExpiryData(180, 40), // Arrived 40 days ago, expires in 180 days
  },
  {
    id: 'snack-6',
    name: 'Chocolate Chip Cookies',
    price: 35,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '216 g',
    productType: 'snack',
    ...getExpiryData(180, 35), // Arrived 35 days ago, expires in 180 days
  },
  {
    id: 'snack-7',
    name: 'Cream Biscuits',
    price: 30,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '150 g',
    productType: 'snack',
    ...getExpiryData(180, 28), // Arrived 28 days ago, expires in 180 days
  },
  {
    id: 'snack-8',
    name: 'Instant Noodles - Masala',
    price: 14,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '70 g',
    productType: 'snack',
    ...getExpiryData(180, 45), // Arrived 45 days ago, expires in 180 days
  },
  {
    id: 'snack-9',
    name: 'Chocolate Sandwich Cookies',
    price: 40,
    image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '225 g',
    productType: 'snack',
    ...getExpiryData(180, 50), // Arrived 50 days ago, expires in 180 days
  },
  {
    id: 'snack-10',
    name: 'Veggie Snack Sticks',
    price: 20,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    category: 'snacks',
    weight: '56 g',
    productType: 'snack',
    ...getExpiryData(180, 60), // Arrived 60 days ago, expires in 180 days
  },

  // Cold Drinks & Juices (10 products)
  {
    id: 'drink-1',
    name: 'Cola Soft Drink',
    price: 40,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '750 ml',
    productType: 'juice-drink',
    ...getExpiryData(90, 20), // Arrived 20 days ago, expires in 90 days
  },
  {
    id: 'drink-2',
    name: 'Carbonated Drink',
    price: 40,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '750 ml',
    productType: 'juice-drink',
    ...getExpiryData(90, 25), // Arrived 25 days ago, expires in 90 days
  },
  {
    id: 'drink-3',
    name: 'Lemon Lime Soda',
    price: 40,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '750 ml',
    productType: 'juice-drink',
    ...getExpiryData(90, 15), // Arrived 15 days ago, expires in 90 days
  },
  {
    id: 'drink-4',
    name: 'Mixed Fruit Juice',
    price: 115,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '1 L',
    productType: 'juice-drink',
    ...getExpiryData(60, 10), // Arrived 10 days ago, expires in 60 days
  },
  {
    id: 'drink-5',
    name: 'Orange Juice',
    price: 115,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '1 L',
    productType: 'juice-drink',
    ...getExpiryData(60, 12), // Arrived 12 days ago, expires in 60 days
  },
  {
    id: 'drink-6',
    name: 'Mango Juice',
    price: 40,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '750 ml',
    productType: 'juice-drink',
    ...getExpiryData(60, 8), // Arrived 8 days ago, expires in 60 days
  },
  {
    id: 'drink-7',
    name: 'Mineral Water',
    price: 20,
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '1 L',
    productType: 'juice-drink',
    ...getExpiryData(365, 100), // Arrived 100 days ago, expires in 365 days
  },
  {
    id: 'drink-8',
    name: 'Energy Drink',
    price: 125,
    image: 'https://images.unsplash.com/photo-1622543925917-763c34f1f86e?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '250 ml',
    productType: 'juice-drink',
    ...getExpiryData(90, 30), // Arrived 30 days ago, expires in 90 days
  },
  {
    id: 'drink-9',
    name: 'Pulpy Orange Drink',
    price: 40,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '400 ml',
    productType: 'juice-drink',
    ...getExpiryData(60, 5), // Arrived 5 days ago, expires in 60 days
  },
  {
    id: 'drink-10',
    name: 'Traditional Indian Drink',
    price: 35,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop',
    category: 'drinks',
    weight: '250 ml',
    productType: 'juice-drink',
    ...getExpiryData(60, 7), // Arrived 7 days ago, expires in 60 days
  },

  // Atta, Rice & Dal (10 products)
  {
    id: 'atta-1',
    name: 'Aashirvaad Whole Wheat Atta',
    price: 275,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/e7bddd47-28d5-4dc7-a194-d0cbdfdb4c19.png',
    category: 'atta',
    weight: '5 kg',
    productType: 'grain',
    ...getExpiryData(365, 60), // Arrived 60 days ago, expires in 365 days (1 year)
  },
  {
    id: 'atta-2',
    name: 'Tata Sampann Unpolished Moong Dal',
    price: 140,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=480,h=480/da/cms-assets/cms/product/0ce5607f-7bf9-44f0-95ea-076a188e55d8.jpg',
    category: 'atta',
    weight: '1 kg',
    productType: 'dal',
    ...getExpiryData(730, 90), // Arrived 90 days ago, expires in 730 days (2 years)
  },
  {
    id: 'atta-3',
    name: 'Fortune Chakki Fresh Atta',
    price: 220,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/a319c1c2-adc4-4e08-98a2-f2034ec34ebf.png',
    category: 'atta',
    weight: '5 kg',
    productType: 'grain',
    ...getExpiryData(365, 45), // Arrived 45 days ago, expires in 365 days (1 year)
  },
  {
    id: 'atta-4',
    name: 'Pillsbury Chakki Fresh Atta',
    price: 216,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/9fb7b8e1-fab2-4ddb-a52e-c83825a8bb30.png',
    category: 'atta',
    weight: '5 kg',
    productType: 'grain',
    ...getExpiryData(365, 50), // Arrived 50 days ago, expires in 365 days (1 year)
  },
  {
    id: 'atta-5',
    name: 'Nature Fresh Sampoorn Chakki Atta',
    price: 214,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/6650cacf-5347-4108-a653-4355531be4fa.png',
    category: 'atta',
    weight: '5 kg',
    productType: 'grain',
    ...getExpiryData(365, 55), // Arrived 55 days ago, expires in 365 days (1 year)
  },
  {
    id: 'atta-6',
    name: 'India Gate Basmati Rice',
    price: 205,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/13832155-9a8a-4e5b-976f-23b173097a3b.png',
    category: 'atta',
    weight: '1 kg',
    productType: 'grain',
    ...getExpiryData(730, 120), // Arrived 120 days ago, expires in 730 days (2 years)
  },
  {
    id: 'atta-7',
    name: 'Tata Sampann Unpolished Toor Dal',
    price: 165,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/10e2287b-b293-43c4-8570-ff9eb409b1eb.png',
    category: 'atta',
    weight: '1 kg',
    productType: 'dal',
    ...getExpiryData(730, 100), // Arrived 100 days ago, expires in 730 days (2 years)
  },
  {
    id: 'atta-8',
    name: 'Daawat Rozana Super Basmati Rice',
    price: 195,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/cd8921c4-f3f1-4ece-aeb4-72862280f98e.png',
    category: 'atta',
    weight: '1 kg',
    productType: 'grain',
    ...getExpiryData(730, 110), // Arrived 110 days ago, expires in 730 days (2 years)
  },
  {
    id: 'atta-9',
    name: 'Tata Sampann Unpolished Chana Dal',
    price: 155,
    image:'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/72b6d382-30b8-4aff-984d-9b4a4b6252e4.png',
    category: 'atta',
    weight: '1 kg',
    productType: 'dal',
    ...getExpiryData(730, 95), // Arrived 95 days ago, expires in 730 days (2 years)
  },
  {
    id: 'atta-10',
    name: 'Kohinoor Super Value Basmati Rice',
    price: 190,
    image:'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/31066437-6daa-4b47-9347-a16afd2b2710.png',
    category: 'atta',
    weight: '1 kg',
    productType: 'grain',
    ...getExpiryData(730, 105), // Arrived 105 days ago, expires in 730 days (2 years)
  },

  // Masala & Dry Fruits (10 products)
  {
    id: 'masala-1',
    name: 'Garam Masala',
    price: 90,
    image: 'https://images.unsplash.com/photo-1596040033229-a0b44cdc5c3e?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '100 g',
    productType: 'masala',
    ...getExpiryData(365, 80), // Arrived 80 days ago, expires in 365 days
  },
  {
    id: 'masala-2',
    name: 'Chana Masala Spice Mix',
    price: 88,
    image: 'https://images.unsplash.com/photo-1596040033229-a0b44cdc5c3e?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '100 g',
    productType: 'masala',
    ...getExpiryData(365, 75), // Arrived 75 days ago, expires in 365 days
  },
  {
    id: 'masala-3',
    name: 'Turmeric Powder',
    price: 45,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '100 g',
    productType: 'masala',
    ...getExpiryData(365, 70), // Arrived 70 days ago, expires in 365 days
  },
  {
    id: 'masala-4',
    name: 'Cumin Seeds',
    price: 70,
    image: 'https://images.unsplash.com/photo-1596040033229-a0b44cdc5c3e?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '100 g',
    productType: 'masala',
    ...getExpiryData(365, 85), // Arrived 85 days ago, expires in 365 days
  },
  {
    id: 'masala-5',
    name: 'Premium Almonds',
    price: 189,
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '200 g',
    productType: 'dry-fruit',
    ...getExpiryData(180, 40), // Arrived 40 days ago, expires in 180 days
  },
  {
    id: 'masala-6',
    name: 'Cashew Nuts',
    price: 225,
    image: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '200 g',
    productType: 'dry-fruit',
    ...getExpiryData(180, 35), // Arrived 35 days ago, expires in 180 days
  },
  {
    id: 'masala-7',
    name: 'Red Chilli Powder',
    price: 80,
    image: 'https://images.unsplash.com/photo-1583487733130-0c84d2a6e8cc?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '100 g',
    productType: 'masala',
    ...getExpiryData(365, 90), // Arrived 90 days ago, expires in 365 days
  },
  {
    id: 'masala-8',
    name: 'Coriander Powder',
    price: 42,
    image: 'https://images.unsplash.com/photo-1596040033229-a0b44cdc5c3e?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '100 g',
    productType: 'masala',
    ...getExpiryData(365, 65), // Arrived 65 days ago, expires in 365 days
  },
  {
    id: 'masala-9',
    name: 'Golden Raisins',
    price: 125,
    image: 'https://images.unsplash.com/photo-1577003833154-3d9d9ecc6a0f?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '250 g',
    productType: 'dry-fruit',
    ...getExpiryData(180, 50), // Arrived 50 days ago, expires in 180 days
  },
  {
    id: 'masala-10',
    name: 'Black Pepper Powder',
    price: 95,
    image: 'https://images.unsplash.com/photo-1607538259842-2e790d11d286?w=400&h=400&fit=crop',
    category: 'masala',
    weight: '100 g',
    productType: 'masala',
    ...getExpiryData(365, 95), // Arrived 95 days ago, expires in 365 days
  },

  // Medical & Healthcare (10 products)
  {
    id: 'med-1',
    name: 'Dettol Antiseptic Liquid',
    price: 145,
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/28e22703-546d-4db7-a48a-6011c455a24d.png',
    category: 'medical',
    weight: '500 ml',
    productType: 'medical-equipment',
    ...getExpiryData(730, 120), // Arrived 120 days ago, expires in 730 days (2 years)
  },
  {
    id: 'med-2',
    name: 'Paracetamol Tablets 500mg',
    price: 25,
    image: 'https://assets.sayacare.in/api/images/product_image/large_image/23/74/Paracetamol-500-mg-Tablet_1.webp',
    category: 'medical',
    weight: '15 tablets',
    productType: 'medicine',
    ...getExpiryData(730, 180), // Arrived 180 days ago, expires in 730 days (2 years)
  },
  {
    id: 'med-3',
    name: 'Stickoband Adhesive Bandages',
    price: 85,
    image: 'https://m.media-amazon.com/images/I/51ZaxsZMdEL._SY879_.jpg',
    category: 'medical',
    weight: '100 strips',
    productType: 'medical-equipment',
    ...getExpiryData(1095, 200), // Arrived 200 days ago, expires in 1095 days (3 years)
  },
  {
    id: 'med-4',
    name: 'Durex Air Ultra Thin Condom',
    price: 299,
    image: 'https://m.media-amazon.com/images/I/61j6dW3rnUL._SX679_PIbundle-10,TopRight,0,0_AA679SH20_.jpg',
    category: 'medical',
    weight: '10 pieces',
    productType: 'hygiene',
    ...getExpiryData(1095, 100), // Arrived 100 days ago, expires in 1095 days (3 years)
  },
  {
    id: 'med-5',
    name: 'Tata Digital Thermometer',
    price: 199,
    image: 'https://m.media-amazon.com/images/I/516JfirlzTL._SX522_.jpg',
    category: 'medical',
    weight: '1 unit',
    productType: 'medical-equipment',
    ...getExpiryData(1825, 50), // Arrived 50 days ago, expires in 1825 days (5 years)
  },
  {
    id: 'med-6',
    name: 'Betadine Antiseptic Solution',
    price: 95,
    image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/k6esilwkexujhgoc0j7m.jpg',
    category: 'medical',
    weight: '100 ml',
    productType: 'medical-equipment',
    ...getExpiryData(730, 90), // Arrived 90 days ago, expires in 730 days (2 years)
  },
  {
    id: 'med-7',
    name: 'Cotton Wool Roll',
    price: 45,
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/6/427924287/CY/YM/XJ/201761525/absorbent-cotton-wool-roll-1000x1000.jpg',
    category: 'medical',
    weight: '100 g',
    productType: 'medical-equipment',
    ...getExpiryData(1095, 150), // Arrived 150 days ago, expires in 1095 days (3 years)
  },
  {
    id: 'med-8',
    name: 'Skore Chocolate Skin-Friendly Water-Based Lubricant',
    price: 65,
    image: 'https://skorecondoms.com/cdn/shop/products/NOV2022-SK-Lubes-Chocolate-Amazon-Slides-V2-a.jpg?v=1708666645',
    category: 'medical',
    weight: '60 g',
    productType: 'medicine',
    ...getExpiryData(730, 160), // Arrived 160 days ago, expires in 730 days (2 years)
  },
  {
    id: 'med-9',
    name: 'Vicks VapoRub',
    price: 125,
    image: 'https://onemg.gumlet.io/l_watermark_346,w_690,h_700/a_ignore,w_690,h_700,c_pad,q_auto,f_auto/2db8736fa89249f98af3f1d270288692.jpg',
    category: 'medical',
    weight: '50 ml',
    productType: 'medicine',
    ...getExpiryData(1095, 130), // Arrived 130 days ago, expires in 1095 days (3 years)
  },
  {
    id: 'med-10',
    name: 'Hand Sanitizer 70% Alcohol',
    price: 75,
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop',
    category: 'medical',
    weight: '250 ml',
    productType: 'hygiene',
    ...getExpiryData(730, 110), // Arrived 110 days ago, expires in 730 days (2 years)
  },
];

export const categories = [
  { id: 'vegetables', name: 'Vegetables & Fruits', icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&q=80' },
  { id: 'dairy', name: 'Dairy & Breakfast', icon: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&q=80' },
  { id: 'snacks', name: 'Snacks & Munchies', icon: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80' },
  { id: 'drinks', name: 'Cold Drinks & Juices', icon: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&q=80' },
  { id: 'atta', name: 'Atta, Rice & Dal', icon: 'https://img.clevup.in/424458/Ata_rice__dal-1747832408392.webp?width=384&format=webp' },
  { id: 'masala', name: 'Masala & Dry Fruits', icon: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRn_XrUchW07rTWqUpNAlWb9upcQzf1ipsaQJZuVTVpbXxwUjMZJXUHOUSKgF3rc-ofa6S1MY6TWRpyYcBxbv9HOCkDPy4M2wI0svZjFqr45GlRBjQQ3Ec-Ng' },
  { id: 'medical', name: 'Medical & Healthcare', icon: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop&q=80' },
  { id: 'ice', name: 'Ice Creams & Desserts', icon: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=400&fit=crop&q=80' },
];
