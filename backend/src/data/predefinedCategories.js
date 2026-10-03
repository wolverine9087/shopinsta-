const names = [
  "Fashion", "Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes",
  "Sneakers", "Bags", "Jewelry", "Watches", "Accessories", "Beauty", "Skincare",
  "Makeup", "Hair Care", "Fragrances", "Personal Care", "Health & Wellness",
  "Food & Beverages", "Snacks & Sweets", "Coffee & Tea", "Groceries", "Home & Living",
  "Kitchen", "Home Appliances", "Garden & Outdoor", "Kitchen & Dining", "Furniture",
  "Home Decor", "Bedding", "Lighting", "Electronics", "Mobile Accessories",
  "Computers & Laptops", "Gaming", "Audio & Headphones", "Cameras & Photography",
  "Books", "Stationery", "Toys & Games", "Sports & Fitness", "Outdoor & Camping",
  "Pet Supplies", "Baby Products", "Automotive", "Tools & Hardware", "Office Supplies",
  "Art & Crafts", "Musical Instruments", "Travel & Luggage", "Gifts & Collections",
];

export const predefinedCategories = names.map((name, index) => ({ name, sortOrder: index + 1 }));
