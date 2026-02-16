# Frontend Setup Guide (Next.js)

## 1. Create Project
Run the following command to create the Next.js project:

```bash
npx create-next-app@latest frontend-web --typescript --tailwind --eslint
# Select 'Yes' for App Router, src directory (optional, but instructions assume root `app`), import alias (@/*)
```

## 2. Dependencies
Install Axios for API requests and Lucide for icons:

```bash
cd frontend-web
npm install axios lucide-react clsx tailwind-merge
```

## 3. Environment Variables
Create `.env.local` in `frontend-web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 4. Run Development Server

```bash
npm run dev
```
