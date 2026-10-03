export const products = [
  { _id: 'p1', name: 'Everyday Canvas Tote', brand: 'STUDIO NO. 8', category: 'Accessories', price: 38, stock: 18, image: 'photo-1590874103328-eac38a683ce7', description: 'Your everywhere bag, made from sturdy natural canvas with an easy, roomy shape.' },
  { _id: 'p2', name: 'Cloud Knit Cardigan', brand: 'THE SLOW LABEL', category: 'Clothing', price: 84, stock: 9, image: 'photo-1434389677669-e08b4cac3105', description: 'A soft, relaxed knit for slow mornings and cooler evenings.' },
  { _id: 'p3', name: 'Sunday Ceramic Set', brand: 'FORM & FIELD', category: 'Home', price: 46, stock: 12, image: 'photo-1490312278390-ab64016e0aa9', description: 'Hand-finished ceramic pieces that make your everyday table feel special.' },
  { _id: 'p4', name: 'The Essential Sneaker', brand: 'COMMON GROUND', category: 'Shoes', price: 96, stock: 7, image: 'photo-1542291026-7eec264c27ff', description: 'An easy everyday sneaker with a considered shape and comfortable fit.' },
  { _id: 'p5', name: 'Sculpted Gold Hoops', brand: 'AUREL STUDIO', category: 'Accessories', price: 32, stock: 25, image: 'photo-1535632066927-ab7c9ab60908', description: 'Lightweight sculpted hoops with a warm brushed gold finish.' },
  { _id: 'p6', name: 'Linen Weekend Shirt', brand: 'THE SLOW LABEL', category: 'Clothing', price: 68, stock: 14, image: 'photo-1598033129183-c4f50c736f10', description: 'Breathable linen with a relaxed fit, made for all the little plans.' },
  { _id: 'p7', name: 'Soft Form Lamp', brand: 'FORM & FIELD', category: 'Home', price: 112, stock: 5, image: 'photo-1507473885765-e6ed057f782c', description: 'A gentle, sculptural light for a softer corner of your home.' },
  { _id: 'p8', name: 'Retro Runner', brand: 'COMMON GROUND', category: 'Shoes', price: 89, stock: 11, image: 'photo-1542291026-7eec264c27ff', description: 'A retro-inspired runner that goes with pretty much everything.' },
]

export const categories = [
  'All finds', 'Fashion', "Men's Clothing", "Women's Clothing", "Kids' Clothing", 'Shoes', 'Sneakers', 'Bags', 'Jewelry', 'Watches', 'Accessories', 'Beauty', 'Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Personal Care', 'Health & Wellness', 'Food & Beverages', 'Snacks & Sweets', 'Coffee & Tea', 'Groceries', 'Home & Living', 'Kitchen', 'Home Appliances', 'Garden & Outdoor', 'Kitchen & Dining', 'Furniture', 'Home Decor', 'Bedding', 'Lighting', 'Electronics', 'Mobile Accessories', 'Computers & Laptops', 'Gaming', 'Audio & Headphones', 'Cameras & Photography', 'Books', 'Stationery', 'Toys & Games', 'Sports & Fitness', 'Outdoor & Camping', 'Pet Supplies', 'Baby Products', 'Automotive', 'Tools & Hardware', 'Office Supplies', 'Art & Crafts', 'Musical Instruments', 'Travel & Luggage', 'Gifts & Collections'
]
export const imageUrl = (image, width = 700) => image?.startsWith('http') ? image : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`
