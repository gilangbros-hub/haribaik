/// <reference types="astro/client" />

import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient | null;
      adminUser: { id: string; email: string } | null;
    }
  }
}
