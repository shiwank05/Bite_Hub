const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');

dotenv.config();

const foods = [
  // Burgers
  { name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato & cheese', price: 199, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', available: true },
  { name: 'Chicken Burger', description: 'Crispy fried chicken with mayo & pickles', price: 179, category: 'Burgers', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', available: true },
  { name: 'Double Smash Burger', description: 'Double beef patty with special sauce', price: 249, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', available: true },

  // Pizza
  { name: 'Margherita Pizza', description: 'Classic tomato sauce with mozzarella & basil', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', available: true },
  { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni & extra cheese', price: 349, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', available: true },
  { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with grilled chicken', price: 379, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', available: true },

  // Pasta
  { name: 'Spaghetti Bolognese', description: 'Classic meat sauce with spaghetti', price: 249, category: 'Pasta', image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400', available: true },
  { name: 'Penne Arrabbiata', description: 'Spicy tomato sauce with penne', price: 219, category: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', available: true },
  { name: 'Creamy Alfredo', description: 'Rich creamy white sauce with fettuccine', price: 269, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', available: true },

  // Sides
  { name: 'French Fries', description: 'Crispy golden fries with seasoning', price: 99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', available: true },
  { name: 'Onion Rings', description: 'Crispy battered onion rings', price: 119, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', available: true },
  { name: 'Coleslaw', description: 'Fresh creamy coleslaw', price: 79, category: 'Sides', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=400', available: true },

  // Drinks
  { name: 'Coca Cola', description: 'Chilled classic Coke 330ml', price: 59, category: 'Drinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', available: true },
  { name: 'Mango Shake', description: 'Fresh mango blended with milk', price: 129, category: 'Drinks', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', available: true },
  { name: 'Lemonade', description: 'Fresh squeezed lemonade with mint', price: 99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', available: true },

  // Desserts
  { name: 'Chocolate Brownie', description: 'Warm fudgy brownie with ice cream', price: 149, category: 'Desserts', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', available: true },
  { name: 'Cheesecake', description: 'Creamy New York style cheesecake', price: 169, category: 'Desserts', image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400', available: true },
  { name: 'Ice Cream Sundae', description: 'Three scoops with toppings & cherry', price: 139, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', available: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing food data
    await Food.deleteMany({});
    console.log('🗑️  Cleared existing food data');

    // Insert new food data
    await Food.insertMany(foods);
    console.log('🌱 Food data seeded successfully!');
    console.log(`✅ ${foods.length} food items added to database`);

    mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();