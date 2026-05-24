const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const connectDB = require('./lib/mongodb');
const Product = require('./models/Product');

async function cleanup() {
  try {
    await connectDB();
    
    const result = await Product.deleteMany({
      category: "Electronics & Tech",
      subcategory: "Mobiles"
    });
    
    console.log(`🗑️ ${result.deletedCount} smartphone products deleted successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();
