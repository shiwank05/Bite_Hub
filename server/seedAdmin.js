const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bitehub.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'BiteHub Admin',
      email: 'admin@bitehub.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created!');
    console.log('📧 Email: admin@bitehub.com');
    console.log('🔑 Password: admin123');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedAdmin();