import os
import re

# Directory containing the HTML files
directory = "/Users/shashankshetty/Documents/HostelMart-main"

# Target files to update
files_to_update = [
    "2 wheel.html",
    "Appliances.html",
    "Auto.html",
    "Beauty.html",
    "Books.html",
    "Fashion.html",
    "Food.html",
    "Home.html",
    "Men's.html",
    "Minutes.html",
    "Sports.html",
    "WeddingStore.html"
]

# Snippets to replace
# 1. Standard Top Utility Nav Travel block
old_travel_block = """                <div
                    class="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                    <ion-icon name="airplane" class="text-[#8D6E63] text-xl"></ion-icon>
                    <span class="font-bold text-[#5D4037] text-sm italic">Travel</span>
                </div>"""

new_travel_block = """                <a href="Travel.html"
                    class="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors no-underline">
                    <ion-icon name="airplane" class="text-[#8D6E63] text-xl"></ion-icon>
                    <span class="font-bold text-[#5D4037] text-sm italic">Travel</span>
                </a>
                <a href="Footwear.html"
                    class="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors no-underline">
                    <ion-icon name="footsteps-outline" class="text-[#8D6E63] text-xl"></ion-icon>
                    <span class="font-bold text-[#5D4037] text-sm italic">Footwear</span>
                </a>"""

# 2. Men's.html specific Top Utility Nav Travel block
old_travel_block_mens = """            <div class="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap">
                <svg class="w-5 h-5 text-[#8D6E63]" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                <span class="font-bold text-[#5D4037] text-sm italic">Travel</span>
            </div>"""

new_travel_block_mens = """            <a href="Travel.html" class="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors no-underline whitespace-nowrap">
                <ion-icon name="airplane" class="text-[#8D6E63] text-xl"></ion-icon>
                <span class="font-bold text-[#5D4037] text-sm italic">Travel</span>
            </a>
            <a href="Footwear.html" class="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors no-underline whitespace-nowrap">
                <ion-icon name="footsteps-outline" class="text-[#8D6E63] text-xl"></ion-icon>
                <span class="font-bold text-[#5D4037] text-sm italic">Footwear</span>
            </a>"""

# 3. mega-fashion block replacement (Slippers -> Footwear.html, Bags -> Travel.html)
# Let's search specifically for the subcategory Slippers & Bags items under id="mega-fashion"
old_fashion_block_regex = r'(<div\s+id="mega-fashion"[^>]*>[\s\S]*?)<a\s+href="Fashion\.html"\s+class="subcategory-item">\s*<div\s+class="subcategory-icon">\s*<ion-icon\s+name="footsteps-outline">\s*</ion-icon>\s*</div>\s*<span\s+class="subcategory-name">\s*Slippers\s*</span>\s*</a>([\s\S]*?)<a\s+href="Fashion\.html"\s+class="subcategory-item">\s*<div\s+class="subcategory-icon">\s*<ion-icon\s+name="briefcase-outline">\s*</ion-icon>\s*</div>\s*<span\s+class="subcategory-name">\s*Bags\s*</span>\s*</a>'

new_fashion_block_replacement = r'\1<a href="Footwear.html" class="subcategory-item">\n                                        <div class="subcategory-icon"><ion-icon name="footsteps-outline"></ion-icon>\n                                        </div>\n                                        <span class="subcategory-name">Footwear & Slippers</span>\n                                    </a>\2<a href="Travel.html" class="subcategory-item">\n                                        <div class="subcategory-icon"><ion-icon name="briefcase-outline"></ion-icon>\n                                        </div>\n                                        <span class="subcategory-name">Bags & Luggage</span>\n                                    </a>'

for filename in files_to_update:
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename}: not found")
        continue

    print(f"Processing {filename}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # Replace top utility nav travel block
    if old_travel_block in content:
        content = content.replace(old_travel_block, new_travel_block)
        modified = True
        print(f"  -> Replaced old_travel_block")
    elif old_travel_block_mens in content:
        content = content.replace(old_travel_block_mens, new_travel_block_mens)
        modified = True
        print(f"  -> Replaced old_travel_block_mens")
    else:
        # Let's try flexible whitespace matching
        # Normalized match for standard travel block
        travel_pat = r'<div\s+class="bg-gray-100\s+px-4\s+py-2\s+rounded-lg\s+flex\s+items-center\s+gap-2\s+cursor-pointer\s+hover:bg-gray-200\s+transition-colors">\s*<ion-icon\s+name="airplane"\s+class="text-\[#8D6E63\]\s+text-xl"></ion-icon>\s*<span\s+class="font-bold\s+text-\[#5D4037\]\s+text-sm\s+italic">Travel</span>\s*</div>'
        if re.search(travel_pat, content):
            content = re.sub(travel_pat, new_travel_block, content)
            modified = True
            print(f"  -> Replaced old_travel_block via regex")

    # Replace mega-fashion items
    if re.search(old_fashion_block_regex, content):
        content = re.sub(old_fashion_block_regex, new_fashion_block_replacement, content)
        modified = True
        print(f"  -> Replaced mega-fashion block items")

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  -> Saved changes to {filename}")
    else:
        print(f"  -> No modifications made to {filename}")
