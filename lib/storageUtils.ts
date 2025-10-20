// Smart storage instructions based on product type and category

export function getStorageInstructions(category: string, productType?: string, name?: string): string {
  const lowerName = name?.toLowerCase() || '';
  
  // Dairy products
  if (category === 'dairy') {
    return 'Refrigerate at 4°C or below';
  }
  
  // Beverages
  if (category === 'beverages') {
    if (lowerName.includes('milk')) {
      return 'Refrigerate after opening';
    }
    return 'Store in cool, dry place';
  }
  
  // Snacks & Munchies
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
  
  // Medical & Healthcare
  if (category === 'medical') {
    return 'Store in cool, dry place away from sunlight';
  }
  
  // Ice Creams & Desserts
  if (category === 'ice-cream') {
    return 'Keep frozen at -18°C or below';
  }
  
  // Vegetables - Based on product type
  if (category === 'vegetables') {
    // Leafy vegetables
    if (productType === 'leafy-veg' || lowerName.includes('spinach') || lowerName.includes('coriander') || lowerName.includes('fenugreek')) {
      return 'Refrigerate in vegetable crisper';
    }
    
    // Bulb vegetables (onion, garlic)
    if (productType === 'bulb-veg' || lowerName.includes('onion') || lowerName.includes('garlic')) {
      return 'Store in cool, dry, well-ventilated place';
    }
    
    // Root vegetables (potato, carrot)
    if (productType === 'root-veg' || lowerName.includes('potato') || lowerName.includes('carrot')) {
      return 'Store in cool, dark, dry place';
    }
    
    // Tomatoes and soft vegetables
    if (productType === 'daily-veg' || lowerName.includes('tomato') || lowerName.includes('capsicum') || lowerName.includes('bell pepper')) {
      return 'Store in cool, dry place or refrigerator';
    }
    
    // Default for vegetables
    return 'Store in vegetable crisper or cool place';
  }
  
  // Fruits
  if (category === 'fruits') {
    // Tropical fruits (banana, mango, papaya)
    if (lowerName.includes('banana') || lowerName.includes('mango') || lowerName.includes('papaya')) {
      return 'Store at room temperature, away from sunlight';
    }
    
    // Citrus fruits
    if (lowerName.includes('orange') || lowerName.includes('lemon') || lowerName.includes('lime')) {
      return 'Store in cool place or refrigerator';
    }
    
    // Berries
    if (lowerName.includes('berry') || lowerName.includes('strawberry') || lowerName.includes('grape')) {
      return 'Refrigerate immediately, do not wash until use';
    }
    
    // Apples and pears
    if (lowerName.includes('apple') || lowerName.includes('pear')) {
      return 'Refrigerate for longer freshness';
    }
    
    // Default for fruits
    return 'Store in cool place, refrigerate if ripe';
  }
  
  // Default storage instruction
  return 'Store in cool, dry place';
}
