Supabase migration
==================

This project has been migrated to use Supabase for data and auth. Follow these steps to configure and run locally:

1. Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

2. Create a Supabase project and add the following environment variables to your Vite env (e.g. `.env.local`):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Create the necessary tables in Supabase (basic names used in the app):
- `machines` (fields: id (PK), name, model, current_hm, is_in_use, last_pm_type, last_pm_hm, next_pm_type, next_pm_due_hm)
- `supplies` (fields: id, name, stock, unit)
- `maintenance` (fields: id, machine_id, machine_name, type, description, hm_done_at, created_at)
- Optional `profiles` table to store `username` and `role` for authenticated users (id must match auth user id)

4. Start the dev server:

```bash
npm run dev
```

Notes:
- The app treats the login `username` as an email for Supabase auth (`signInWithPassword`). If you prefer a different flow, adapt `src/hooks/useAuth.ts`.
- If your tables have different column names, adapt the hooks or SQL accordingly.
