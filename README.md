# Smart Bookmarks

A modern **bookmark manager web app** built with **Next.js 16**, **Supabase**, and **Tailwind CSS**.
Users can securely log in with Google, save useful links, and manage bookmarks in real time.

---

# 🚀 Features

* 🔐 Google OAuth authentication
* ➕ Add, view, and delete bookmarks
* ⚡ Realtime bookmark updates (no refresh needed)
* 🎨 Clean responsive UI with Tailwind CSS
* ☁️ Live deployment on Vercel

---

# 🛠️ Tech Stack

**Frontend**

* Next.js 16 (App Router)
* React
* Tailwind CSS

**Backend / Database**

* Supabase (Auth + Postgres + Realtime)

**Deployment**

* Vercel

---

# 📂 Project Structure

```
app/
 ├── auth/
 │    └── callback/route.ts   # Handles Google OAuth session
 ├── dashboard/page.tsx       # Main bookmark dashboard
 ├── page.tsx                 # Login screen


```

---

# ⚙️ Environment Variables

Create a **.env.local** file in the root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# 🧩 Supabase Setup

### 1️⃣ Create table

Table name: **bookmarks**

Columns:

* `id` → uuid (primary key, default: uuid_generate_v4())
* `title` → text
* `url` → text
* `user_id` → uuid (references auth.users)
* `created_at` → timestamp (default: now())

---







# 🧠 Future Improvements

* ✏️ Edit bookmarks
* 🏷️ Add tags & categories
* 🔍 Search and filter
* 📱 Mobile PWA support

---

# 👩‍💻 Author

**Swati Savarna**

If you like this project, consider giving it a ⭐ on GitHub!

