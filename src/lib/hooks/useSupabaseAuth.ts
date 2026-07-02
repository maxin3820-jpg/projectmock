"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // Start as true — never flicker to false until we have full data
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Wait for profile BEFORE setting loading = false
        const profileData = await fetchProfile(session.user.id);
        if (!mounted) return;
        setProfile(profileData);
      }

      // Only now is it safe to make redirect decisions
      setLoading(false);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Wait for profile before clearing loading
          setLoading(true);
          const profileData = await fetchProfile(session.user.id);
          if (!mounted) return;
          setProfile(profileData);
          setLoading(false);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  return { user, profile, session, loading, isAdmin };
}
