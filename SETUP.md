# Setup Guide

## 1. PostgreSQL

### Local (development)
```bash
# Create the database
createdb duc_than_site

# Run the migration
psql duc_than_site -f scripts/migrate.sql
```

### NeonDB (production)
Create a project at neon.tech, copy the connection string, then:
```bash
psql $DATABASE_URL -f scripts/migrate.sql
```

---

## 2. Environment variables

Edit `.env.local` — fill in every value:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/duc_than_site

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

ADMIN_EMAIL=thantienduc@gmail.com
ADMIN_PASSWORD_HASH=<see below>

ADMIN_SECRET_PATH=<pick something obscure, e.g. ghost-protocol>
```

### Generate password hash
```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('yourpassword', 12))"
```
Paste the output as `ADMIN_PASSWORD_HASH`.

---

## 3. Seed existing posts
```bash
npm run seed
```

---

## 4. Run
```bash
npm run dev   # dev server at http://localhost:3000
npm run build # production build
npm start     # production server
```

---

## Admin access

Navigate to:
```
http://localhost:3000/<ADMIN_SECRET_PATH>
```
This sets a short-lived cookie and redirects you to the login form.  
Direct access to `/admin` without this path redirects to the homepage.

---

## File structure

```
app/
  page.tsx              ← main single-page site
  blog/
    page.tsx            ← /blog  (journal listing)
    [slug]/page.tsx     ← /blog/[slug]  (individual post)
  admin/
    page.tsx            ← /admin  (dashboard)
    new/page.tsx        ← /admin/new  (create post)
    [id]/edit/page.tsx  ← /admin/[id]/edit
    login/page.tsx      ← /admin/login  (reached via secret path)
  api/posts/            ← REST API (CRUD)

lib/
  db.ts                 ← PostgreSQL client
  auth.ts               ← NextAuth config

scripts/
  migrate.sql           ← DB schema
  seed.ts               ← seed the 3 original posts
```
