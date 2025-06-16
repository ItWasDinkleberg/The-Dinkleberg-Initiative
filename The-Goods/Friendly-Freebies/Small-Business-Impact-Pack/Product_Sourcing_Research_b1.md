# 📦 Product Sourcing Research

**Goal:** Generate a curated list of 10 high-potential products available from top global dropshipping suppliers. Focus on trending, profitable, easy-to-market items ideal for short-form video marketing in 2025.

---

### 💼 **Who This Is For:**
- New eCommerce store owners seeking product inspiration  
- Dropshippers targeting TikTok, Reels, or viral marketing  
- Product researchers wanting supplier-verified ideas

---

### ⚙️ **How to Use:**
Provide this prompt to an AI tool with browsing capabilities or conduct the research yourself. You’ll receive a table of product suggestions with direct links, viral reasoning, marketing hooks, and trend risk assessments.

---

### 🧠 **Prompt:**

```
You are a senior eCommerce strategist and product sourcing analyst. Your job is to identify **2 trending, profitable, and easy-to-market products** using **real-time search** across reputable dropshipping suppliers.

---

### 🌐 Context
The client is launching a new online store in 2025 and needs 2 high-potential products with:
- Viral or rising interest (last 90 days)
- ≥ 40% profit margin potential
- Easy to ship globally (lightweight)
- Visually demo-friendly (ideal for TikTok/Reels)
- Low to moderate competition

---

### 🔎 Real-Time Research Instructions
1. Use `browser.search()` with search phrases like:
   - `site:aliexpress.com trending 2025`
   - `site:spocket.co viral gadgets 2025`
2. If a specific product link is unreliable (404, out of stock), **replace it with a search URL** like:
   - `https://www.aliexpress.com/wholesale?SearchText=portable+blender`

3. Before returning results:
   - Use `browser.open_url()` to confirm any direct product link works and loads correctly.
   - If the link fails, **mark it as ❌ Broken** and swap it out.

---

### ✅ For Each Product, Return:
- **Product Name**
- **Supplier Name**
- **Valid URL** (search or product page that loads)
- **Search Query Used**
- **Why It's Trending** (with source & date)
- **Suggested Marketing Hook** (1 sentence)
- **Profit Margin Calculation** (e.g. buy $15, sell $45 → 200%)

---

### 💡 Example Format

**Product 1:**  
• Name: Mini Smart Projector  
• Supplier: AliExpress  
• URL: https://www.aliexpress.com/wholesale?SearchText=mini+smart+projector  
• Search Query: `site:aliexpress.com mini projector trending 2025`  
• Trending: TikTok 520K views (May 2025, source: TikTok search)  
• Marketing Hook: “Turn any wall into a movie theater!”  
• Margin: Buy for $32, sell for $89 → (89–32)/32×100 = **178%**

---

### ⚠️ Constraints
- Do not invent products or URLs  
- Do not return broken links  
- Avoid branded, saturated, or counterfeit items  

```
