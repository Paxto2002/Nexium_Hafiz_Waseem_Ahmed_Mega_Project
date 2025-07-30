# 👨‍🍳 Chef Paxto — AI-Powered Recipe Generator

**Chef Paxto** is your personal AI chef. Just enter the ingredients you have, and it instantly crafts a detailed, delicious recipe using **LLaMA 3 (70B)** via **GroqCloud**, orchestrated through **n8n** automation.

📌 It securely stores all your generated recipes, allowing you to revisit your culinary history anytime.

[🔗 Live Demo](https://chefpaxto.vercel.app/)

---

## ✨ Features

- 🍳 **Smart AI Recipe Generator** — Powered by LLaMA 3 (GroqCloud)
- 📝 **Dynamic Input** — Enter any ingredients, get a full recipe
- ⚙️ **Structured Output** — Title, ingredients, steps, tips (JSON-based)
- 🔐 **Magic Link Auth** — Secure login via Supabase
- 📦 **Supabase Storage** — User-specific recipe logging
- 📊 **User Dashboard** — View, manage, and relive your recipes
- 🧩 **n8n Automation** — Frontend → Groq → Supabase, fully automated
- 🌍 **Live & Deployed** — Hosted on Vercel + Railway

---

## 🛠️ Tech Stack

| Layer         | Tech Used                                                      |
| ------------- | -------------------------------------------------------------- |
| Frontend      | [Next.js 15](https://nextjs.org/), App Router                  |
| UI Styling    | [Tailwind CSS](https://tailwindcss.com/), ShadCN UI            |
| Auth & DB     | [Supabase](https://supabase.com/)                              |
| AI & Workflow | [GroqCloud](https://groq.com/), [n8n](https://n8n.io/)         |
| Hosting       | [Vercel](https://vercel.com/), [Railway](https://railway.app/) |

---

## 📁 Project Structure

grand-project/
├── app/
│ ├── api/recipe-webhook/route.js # Forwards data to n8n webhook
│ ├── dashboard/ # Authenticated recipe dashboard
│ ├── signin/ # Magic link login page
│ ├── signup/ # User signup
├── components/
│ ├── RecipeForm.jsx # Ingredient input form
│ ├── RecipeCard.jsx # Recipe card UI
│ ├── RecipeLoader.jsx # Animated loading component
├── lib/
│ ├── supabase/ # Supabase client setup & SSR helpers
│ └── mongodb/ # (Deprecated, no longer used)
├── utils/
│ └── auth/signInWithEmail.js
├── .env.local # Local environment variables
├── next.config.mjs # Next.js config
└── README.md

pgsql
Copy
Edit

---

## 🧬 Supabase Schema

**Table: `recipes`**

| Column           | Type                       | Description                      |
| ---------------- | -------------------------- | -------------------------------- |
| `id`             | BIGINT (Primary Key)       | Auto-generated recipe ID         |
| `user_id`        | UUID                       | Foreign key from `user_profiles` |
| `input`          | TEXT                       | Raw input text from the user     |
| `ai_title`       | TEXT                       | Generated recipe title           |
| `ai_ingredients` | TEXT                       | Generated ingredients list       |
| `ai_steps`       | TEXT                       | Step-by-step instructions        |
| `ai_tips`        | TEXT                       | Helpful tips or suggestions      |
| `created_at`     | TIMESTAMPTZ (Default: now) | Timestamp of recipe generation   |

---

## 🔁 n8n Automation Workflow

1. **Webhook Node** — Receives POST from frontend with `user_id` and `input`
2. **Code Node** — Generates a dynamic prompt for the AI
3. **HTTP Node** — Calls Groq LLaMA 3 API with prompt
4. **Transform Node** — Extracts structured JSON response
5. **Supabase Node** — Saves result into `recipes` table

> ✅ MongoDB was previously integrated, but has been **deprecated** for simplicity.

**Production Webhook URL:**
https://n8n-production-893d.up.railway.app/webhook/thechefpaxto

yaml
Copy
Edit

---

## 🚀 Deployment Instructions

### 🧩 Frontend (Vercel)

```bash
pnpm install
pnpm build
pnpm start
# Or use Vercel CLI
vercel deploy
🔁 Backend (n8n on Railway)
Clone your n8n config with Docker

Set your environment variables in Railway Dashboard

Make sure to enable CORS in Webhook node

Connect app/api/recipe-webhook/route.js to the webhook URL above

## ✨ Future Plans
🗣️ Voice-to-Text support

📸 Ingredient photo input (via OCR)

📊 Nutrition Facts (via AI)

🧠 AI memory to recall your favorite meals

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

## 🧑‍💻 Author

**Hafiz Waseem Ahmed (Paxto)**
[GitHub](https://github.com/Paxto2002) | [LinkedIn](https://www.linkedin.com/in/hafiz-waseem-ahmed-50a4b2347/)

## 📜 License
This project is open-source under the MIT License.

vbnet


---

Let me know if you’d like:

- A version for **investors or users** (less technical),
- A `CONTRIBUTING.md` guide,
- Or to turn this into a full **Docs site** with `Docusaurus` or `Next.js` documentation layout.

Would you like to commit this now and push to GitHub with a proper message?
```

✅ **Ready to commit this to GitHub?**  
Use the following commit message:

```bash
git add README.md
git commit -m "docs: update beautiful README with full project details"
git push origin main
```
