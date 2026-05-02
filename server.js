const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data helper functions
const getProducts = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
const getCategories = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf8'));
const getBanners = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'banners.json'), 'utf8'));
const saveSubscription = (email) => {
  const subsPath = path.join(__dirname, 'data', 'subscriptions.json');
  const subs = JSON.parse(fs.readFileSync(subsPath, 'utf8'));
  if (!subs.includes(email)) {
    subs.push(email);
    fs.writeFileSync(subsPath, JSON.stringify(subs, null, 2));
    return true;
  }
  return false;
};

// API Routes
app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (email) {
    saveSubscription(email);
    res.json({ success: true, message: 'Subscribed successfully!' });
  } else {
    res.status(400).json({ success: false, message: 'Email is required.' });
  }
});

// Server-Side Injection for index.html
app.get(['/', '/index.html'], (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const $ = cheerio.load(html);

  // 1. Inject Products
  const products = getProducts();
  const $productGrid = $('.product-grid');
  $productGrid.empty();

  products.forEach(product => {
    const ratingHtml = Array(5).fill(0).map((_, i) => 
      `<ion-icon name="${i < product.rating ? 'star' : 'star-outline'}"></ion-icon>`
    ).join('');

    const badgeHtml = product.discount ? `<span class="absolute top-4 left-4 bg-[#5D4037] text-[#F5F5DC] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">${product.discount}</span>` : '';
    const delHtml = product.delPrice ? `<del class="text-xs text-gray-300 font-normal">$${product.delPrice.toFixed(2)}</del>` : '';

    const productImage = product.images ? product.images.default : (product.image || '');
    const hoverImage = product.images ? product.images.hover : (product.image || '');

    const productHtml = `
      <div class="product-card bg-[#F5F5DC] border border-[#D7CCC8] rounded-3xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">
          <div class="relative aspect-[4/5] overflow-hidden">
              <img src="${productImage}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <img src="${hoverImage}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover hover-img">
              ${badgeHtml}
              <div class="absolute -right-16 top-4 group-hover:right-4 transition-all duration-300 flex flex-col gap-2">
                  <button class="bg-[#F5F5DC]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#5D4037] hover:text-[#F5F5DC] transition-all transform hover:scale-110 active:scale-90"><ion-icon name="heart-outline"></ion-icon></button>
                  <button class="bg-[#F5F5DC]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#5D4037] hover:text-[#F5F5DC] transition-all transform hover:scale-110 active:scale-90"><ion-icon name="eye-outline"></ion-icon></button>
              </div>
          </div>
          <div class="p-4 sm:p-6 space-y-2">
              <p class="text-[10px] text-[#5D4037] font-black uppercase tracking-widest">${product.category}</p>
              <h3 class="font-bold text-gray-800 truncate text-sm sm:text-base">${product.name}</h3>
              <div class="flex items-center gap-1 text-yellow-400 text-[10px]">${ratingHtml}</div>
              <div class="flex items-center gap-2 font-black text-lg text-gray-900 mt-1">
                  <span>$${product.price.toFixed(2)}</span> ${delHtml}
              </div>
          </div>
      </div>
    `;
    $productGrid.append(productHtml);
  });

  // 2. Inject Categories
  const categories = getCategories();
  const $categoryContainer = $('.category-item-container');
  $categoryContainer.empty();

  categories.forEach(cat => {
    const catHtml = `
      <div class="min-w-[160px] md:min-w-[220px] snap-start bg-[#F5F5DC] border border-[#D7CCC8] p-4 rounded-2xl flex items-center gap-4 hover:shadow-xl hover:border-[#5D4037] transition-all cursor-pointer group">
          <div class="bg-[#D7CCC8] p-2.5 rounded-xl text-[#5D4037] text-xl group-hover:bg-[#5D4037] group-hover:text-[#F5F5DC] transition-colors duration-300 flex items-center justify-center">
              <img src="${cat.icon}" alt="${cat.name}" width="24" class="group-hover:brightness-0 group-hover:invert transition-all">
          </div>
          <div>
              <h3 class="font-bold text-xs md:text-sm truncate">${cat.name}</h3>
              <p class="text-[10px] text-gray-400">(${cat.amount} items)</p>
          </div>
      </div>
    `;
    $categoryContainer.append(catHtml);
  });
  // 3. Inject Fashion Banners
  const banners = getBanners();
  const fashionBanners = banners.filter(b => b.section === 'fashion');
  const $fashionSection = $('#fashion-section');
  if ($fashionSection.length > 0) {
    $fashionSection.empty();
    fashionBanners.forEach(banner => {
      const bannerHtml = `
          <div class="${banner.classes}" style="background-color: ${banner.bg_color}">
              <div class="w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
                  <img src="${banner.icon}" class="absolute bottom-4 left-4 w-12 opacity-80" alt="">
                  <h3 class="text-xl md:text-3xl font-black mb-2 leading-tight">${banner.title}</h3>
                  <p class="text-gray-600 text-sm mb-2">${banner.description}</p>
                  <p class="text-2xl font-black">${banner.price_info}</p>
                  <div class="flex gap-1.5 mt-6">
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div class="w-3 h-1.5 rounded-full bg-gray-800"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
              </div>
              <div class="w-1/2 h-full">
                  <img src="${banner.image}" alt="${banner.title}" class="w-full h-full object-cover">
              </div>
          </div>
      `;
      $fashionSection.append(bannerHtml);
    });
  }

  res.send($.html());
});

// Server-Side Injection for Fashion.html
app.get('/Fashion.html', (req, res) => {
  const fashionPath = path.join(__dirname, 'Fashion.html');
  let html = fs.readFileSync(fashionPath, 'utf8');
  const $ = cheerio.load(html);

  // Inject Banners
  const banners = getBanners();
  const $heroSlider = $('#hero-slider');
  $heroSlider.empty();

  banners.forEach(banner => {
    let bannerHtml = '';
    if (banner.type === 'standard') {
      bannerHtml = `
        <div class="${banner.classes}">
            <img src="${banner.image}" alt="${banner.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                <p class="text-sm font-light tracking-[0.3em] uppercase mb-1">${banner.subtitle}</p>
                <h2 class="text-3xl md:text-5xl font-serif tracking-tight">${banner.title}</h2>
            </div>
        </div>
      `;
    } else if (banner.type === 'featured') {
      bannerHtml = `
        <div class="${banner.classes}" style="background-color: ${banner.bg_color}">
            <div class="w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
                <img src="${banner.icon}" class="absolute bottom-4 left-4 w-12 opacity-80" alt="">
                <h3 class="text-xl md:text-3xl font-black mb-2 leading-tight">${banner.title}</h3>
                <p class="text-gray-600 text-sm mb-2">${banner.description}</p>
                <p class="text-2xl font-black">${banner.price_info}</p>
                <div class="flex gap-1.5 mt-6">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div class="w-3 h-1.5 rounded-full bg-gray-800"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                </div>
            </div>
            <div class="w-1/2 relative overflow-hidden">
                <img src="${banner.image}" alt="${banner.title}" class="w-full h-full object-cover">
                <img src="https://img.icons8.com/color/96/000000/leaves.png" class="absolute top-4 right-4 w-8 rotate-45" alt="">
            </div>
        </div>
      `;
    } else if (banner.type === 'featured_small') {
      bannerHtml = `
        <div class="${banner.classes}" style="background-color: ${banner.bg_color}">
            <div class="p-6 md:p-10 flex flex-col justify-center h-full relative">
                <img src="${banner.icon}" class="absolute bottom-4 left-4 w-12 opacity-80" alt="">
                <h3 class="text-xl md:text-3xl font-black mb-2 leading-tight">${banner.title}</h3>
                <p class="text-gray-600 text-sm mb-2">${banner.description}</p>
                <p class="text-2xl font-black">${banner.price_info}</p>
                <div class="absolute top-10 right-10 w-32 h-32 bg-yellow-200/50 rounded-full blur-2xl"></div>
            </div>
        </div>
      `;
    }
    $heroSlider.append(bannerHtml);
  });

  res.send($.html());
});

// Serve other static files
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
