// Generate expiry date based on product category
export function generateExpiryDate(category: string, productName: string): Date {
  const today = new Date();
  let daysToAdd: number;

  const name = productName.toLowerCase();
  
  if (category === 'dairy' || name.includes('milk') || name.includes('curd') || name.includes('paneer')) {
    daysToAdd = Math.floor(Math.random() * 7) + 3; // 3-10 days
  } else if (category === 'vegetables' || category === 'fruits') {
    daysToAdd = Math.floor(Math.random() * 5) + 2; // 2-7 days
  } else if (category === 'bread' || name.includes('bread')) {
    daysToAdd = Math.floor(Math.random() * 3) + 2; // 2-5 days
  } else {
    daysToAdd = Math.floor(Math.random() * 180) + 30; // 30-210 days for packaged goods
  }

  const expiryDate = new Date(today);
  expiryDate.setDate(today.getDate() + daysToAdd);
  return expiryDate;
}

// Calculate days until expiry
export function getDaysUntilExpiry(expiryDate: Date): number {
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Generate unique product ID
export function generateProductId(): string {
  return 'PROD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Generate batch number
export function generateBatchNumber(): string {
  return 'BATCH-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Format date
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Get storage instructions based on product
export function getStorageInstructions(category: string, productName: string, productType?: string): string {
  const name = productName.toLowerCase();
  
  // Dairy products
  if (category === 'dairy' || name.includes('curd') || name.includes('cheese') || name.includes('paneer')) {
    return 'Refrigerate at 4°C or below';
  }
  
  // Beverages
  if (category === 'beverages') {
    if (name.includes('milk')) {
      return 'Refrigerate after opening';
    }
    return 'Store in cool, dry place';
  }
  
  // Snacks
  if (category === 'snacks') {
    return 'Store in cool, dry place. Keep sealed';
  }
  
  // Atta, Rice & Dal
  if (category === 'atta-rice-dal') {
    return 'Store in airtight container in cool, dry place';
  }
  
  // Masala & Dry Fruits
  if (category === 'masala') {
    return 'Store in airtight container away from moisture';
  }
  
  // Medical
  if (category === 'medical') {
    return 'Store in cool, dry place away from sunlight';
  }
  
  // Ice Cream
  if (category === 'ice-cream') {
    return 'Keep frozen at -18°C or below';
  }
  
  // Vegetables - Smart detection
  if (category === 'vegetables') {
    // Leafy vegetables
    if (name.includes('spinach') || name.includes('coriander') || name.includes('fenugreek')) {
      return 'Refrigerate in vegetable crisper';
    }
    
    // Onions and garlic
    if (name.includes('onion') || name.includes('garlic')) {
      return 'Store in cool, dry, well-ventilated place';
    }
    
    // Potatoes and root vegetables
    if (name.includes('potato') || name.includes('carrot') || name.includes('radish')) {
      return 'Store in cool, dark, dry place';
    }
    
    // Tomatoes
    if (name.includes('tomato')) {
      return 'Store in cool, dry place or refrigerator';
    }
    
    return 'Store in vegetable crisper or cool place';
  }
  
  // Fruits
  if (category === 'fruits') {
    if (name.includes('banana') || name.includes('mango') || name.includes('papaya')) {
      return 'Store at room temperature, away from sunlight';
    }
    
    if (name.includes('apple') || name.includes('grape') || name.includes('berry')) {
      return 'Refrigerate for longer freshness';
    }
    
    return 'Store in cool place, refrigerate if ripe';
  }
  
  // Bread
  if (name.includes('bread')) {
    return 'Store in cool, dry place, away from sunlight';
  }
  
  return 'Store in cool, dry place';
}

// Format currency
export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
