// Admin login credentials for the grave-add gate.
//
// SECURITY CAVEAT: These values are bundled into the client-side JavaScript,
// so anyone who inspects the deployed site can read them. This login is a UI
// deterrent only — it hides the "Add" controls from casual visitors. It is NOT
// real access control: the Supabase table currently allows public writes via
// its row-level-security policy. To make grave creation truly admin-only, move
// auth to Supabase Auth and tighten the RLS INSERT policy server-side.
export const ADMIN_USERNAME = 'graveyard_admin';
export const ADMIN_PASSWORD = 'mianisbgeotag20';

// localStorage key used to remember an authenticated admin session.
export const AUTH_STORAGE_KEY = 'gg_admin_authed';
