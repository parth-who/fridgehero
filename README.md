# 🍳 Fridge Hero

> **Turn 3 ingredients into a Michelin-star recipe — powered by AI**

![Fridge Hero Banner](icon-512.png)

---

## ✨ What is Fridge Hero?

Fridge Hero is an AI-powered recipe generator. You enter **3 ingredients** you have at home, pick your preferences, and the app instantly generates a detailed step-by-step recipe — including nutrition info, cook time, and difficulty level.

No more staring at the fridge wondering what to cook. 🙌

---

## 🚀 Live Demo

> 🌐 [fridge-hero.onrender.com](https://fridge-hero.onrender.com)

---

## 📱 Install as App (PWA)

Fridge Hero works as a **Progressive Web App** — no App Store needed!

| Device | How to Install |
|---|---|
| **Android** | Open in Chrome → "Add to Home Screen" banner appears automatically |
| **iPhone** | Open in Safari → Share button → "Add to Home Screen" |
| **Desktop** | Open in Chrome → Click ⊕ icon in address bar |

---

## 🎯 Features

- 🥕 **3-ingredient recipe generation** using Google Gemini AI
- 🥗 **Dietary restrictions** — Vegetarian, Vegan, Gluten-Free, Keto, Dairy-Free, Nut-Free
- 🌍 **7 cuisine styles** — Italian, Indian, Japanese, Mexican, Mediterranean, Chinese, Thai
- 🍽️ **Meal type** — Breakfast, Lunch, Dinner, Snack, Dessert
- ⏱️ **Cook time filter** — 15 min, 30 min, 1 hour, Any
- 👥 **Adjustable servings** — 1 to 12 people
- 📊 **Nutrition info** — Calories, Protein, Carbs, Fat per serving
- 🔖 **Save recipes** — saves locally, persists after refresh
- 📋 **Copy recipe** — copies full recipe as plain text
- 🖨️ **Print recipe** — clean print layout
- 🔄 **Regenerate** — try another recipe with same ingredients
- 📱 **PWA** — installable as a real app from the browser

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js + Express |
| AI | Google Gemini 1.5 Flash API |
| Hosting | Render.com |
| PWA | Service Worker + Web App Manifest |

---

## 📁 Project Structure

```
fridge-hero/
├── index.html          # Main UI
├── style.css           # All styles
├── script.js           # Frontend logic
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline support)
├── icon-192.png        # App icon (small)
├── icon-512.png        # App icon (large)
└── backend/
    ├── server.js       # Express server + Gemini proxy
    ├── package.json    # Dependencies
    └── .env            # API key (never committed)
```

---

## ⚙️ Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/YOURUSERNAME/fridge-hero.git
cd fridge-hero
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Add your API key
Create a file `backend/.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```
Get a free key at 👉 [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 4. Start the server
```bash
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 🌐 Deploy on Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set these:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variable:
   - `GEMINI_API_KEY` = your key
6. Click **Deploy** — live in 3 minutes ✅

---

## 🔐 Security

- API key is stored in `backend/.env` — never in frontend code
- `.env` is in `.gitignore` — never pushed to GitHub
- Frontend calls `/api/recipe` on your own backend
- Backend proxies the request to Gemini — key never exposed to browser

---

## 📸 Screenshots

| Input | Recipe Output |
|---|---|
| Enter 3 ingredients + preferences | Get step-by-step recipe with nutrition |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Made by

**Parth** — built with ❤️ and a lot of leftover ingredients 🍳

---

> ⭐ If you like this project, give it a star on GitHub!
