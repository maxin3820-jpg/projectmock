"use client";
import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

export function useAdminData() {
  const supabase = createClient();

  // ── Users ──────────────────────────────────────────────────
  const getUsers = useCallback(async (page = 1, pageSize = 20, search = "", filter = "all") => {
    let query = supabase.from("profiles").select("*", { count: "exact" });
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    if (filter === "premium") query = query.eq("plan", "premium");
    else if (filter === "free") query = query.eq("plan", "free");
    else if (["active", "suspended", "banned"].includes(filter)) query = query.eq("status", filter as Tables["profiles"]["Row"]["status"]);
    query = query.order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    return query;
  }, [supabase]);

  const updateUser = useCallback(async (id: string, data: Tables["profiles"]["Update"]) => {
    const { error } = await supabase.from("profiles").update(data).eq("id", id);
    if (!error) await logAudit("update_user", "profiles", id, data);
    return { error };
  }, [supabase]);

  const deleteUser = useCallback(async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (!error) await logAudit("delete_user", "profiles", id);
    return { error };
  }, [supabase]);

  // ── Tests ──────────────────────────────────────────────────
  const getTests = useCallback(async () => {
    return supabase.from("mock_tests").select("*, subjects(name)").order("created_at", { ascending: false });
  }, [supabase]);

  const createTest = useCallback(async (data: Tables["mock_tests"]["Insert"]) => {
    const { data: result, error } = await supabase.from("mock_tests").insert(data).select().single();
    if (!error) await logAudit("create_test", "mock_tests", result?.id, data);
    return { data: result, error };
  }, [supabase]);

  const updateTest = useCallback(async (id: string, data: Tables["mock_tests"]["Update"]) => {
    const { error } = await supabase.from("mock_tests").update(data).eq("id", id);
    if (!error) await logAudit("update_test", "mock_tests", id, data);
    return { error };
  }, [supabase]);

  const deleteTest = useCallback(async (id: string) => {
    const { error } = await supabase.from("mock_tests").delete().eq("id", id);
    if (!error) await logAudit("delete_test", "mock_tests", id);
    return { error };
  }, [supabase]);

  // ── Questions ──────────────────────────────────────────────
  const getQuestions = useCallback(async (page = 1, pageSize = 20, search = "", subject = "all", difficulty = "all") => {
    let query = supabase.from("questions").select("*, question_options(*), subjects(name), chapters(name)", { count: "exact" });
    if (search) query = query.ilike("question_text", `%${search}%`);
    if (subject !== "all") query = query.eq("subject_id", subject);
    if (difficulty !== "all") query = query.eq("difficulty", difficulty as Tables["questions"]["Row"]["difficulty"]);
    query = query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
    return query;
  }, [supabase]);

  const createQuestion = useCallback(async (
    questionData: Tables["questions"]["Insert"],
    options: Tables["question_options"]["Insert"][]
  ) => {
    const { data: q, error } = await supabase.from("questions").insert(questionData).select().single();
    if (error || !q) return { error };
    const { error: optError } = await supabase.from("question_options").insert(
      options.map((o, i) => ({ ...o, question_id: q.id, sort_order: i }))
    );
    if (!optError) await logAudit("create_question", "questions", q.id, questionData);
    return { data: q, error: optError };
  }, [supabase]);

  const updateQuestion = useCallback(async (
    id: string,
    questionData: Tables["questions"]["Update"],
    options?: Tables["question_options"]["Insert"][]
  ) => {
    const { error } = await supabase.from("questions").update(questionData).eq("id", id);
    if (!error && options) {
      await supabase.from("question_options").delete().eq("question_id", id);
      await supabase.from("question_options").insert(
        options.map((o, i) => ({ ...o, question_id: id, sort_order: i }))
      );
    }
    if (!error) await logAudit("update_question", "questions", id, questionData);
    return { error };
  }, [supabase]);

  const deleteQuestion = useCallback(async (id: string) => {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (!error) await logAudit("delete_question", "questions", id);
    return { error };
  }, [supabase]);

  // ── Payments ───────────────────────────────────────────────
  const getPayments = useCallback(async (status = "all") => {
    let query = supabase.from("payments").select("*, profiles(full_name, email), premium_plans(name)").order("created_at", { ascending: false });
    if (status !== "all") query = query.eq("status", status as Tables["payments"]["Row"]["status"]);
    return query;
  }, [supabase]);

  const updatePayment = useCallback(async (id: string, data: Tables["payments"]["Update"]) => {
    const { error } = await supabase.from("payments").update(data).eq("id", id);
    if (!error && data.status === "success") {
      // Activate subscription
      const { data: payment } = await supabase.from("payments").select("user_id, plan_id").eq("id", id).single();
      if (payment?.user_id && payment?.plan_id) {
        const { data: plan } = await supabase.from("premium_plans").select("duration_days").eq("id", payment.plan_id).single();
        if (plan) {
          const expires = new Date();
          expires.setDate(expires.getDate() + plan.duration_days);
          await supabase.from("user_subscriptions").insert({ user_id: payment.user_id, plan_id: payment.plan_id, expires_at: expires.toISOString(), is_active: true });
          await supabase.from("profiles").update({ plan: "premium" }).eq("id", payment.user_id);
        }
      }
    }
    if (!error) await logAudit("update_payment", "payments", id, data);
    return { error };
  }, [supabase]);

  // ── Announcements ──────────────────────────────────────────
  const getAnnouncements = useCallback(async () => {
    return supabase.from("announcements").select("*").order("created_at", { ascending: false });
  }, [supabase]);

  const createAnnouncement = useCallback(async (data: Tables["announcements"]["Insert"]) => {
    const { data: result, error } = await supabase.from("announcements").insert(data).select().single();
    return { data: result, error };
  }, [supabase]);

  const updateAnnouncement = useCallback(async (id: string, data: Tables["announcements"]["Update"]) => {
    const { error } = await supabase.from("announcements").update(data).eq("id", id);
    return { error };
  }, [supabase]);

  const deleteAnnouncement = useCallback(async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    return { error };
  }, [supabase]);

  // ── Settings ───────────────────────────────────────────────
  const getSettings = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("*");
    const map: Record<string, string> = {};
    data?.forEach(s => { map[s.key] = s.value ?? ""; });
    return map;
  }, [supabase]);

  const updateSetting = useCallback(async (key: string, value: string) => {
    const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    return { error };
  }, [supabase]);

  // ── Universities ───────────────────────────────────────────
  const getUniversities = useCallback(async () => {
    return supabase.from("universities").select("*").order("name");
  }, [supabase]);

  const createUniversity = useCallback(async (data: Tables["universities"]["Insert"]) => {
    const { data: result, error } = await supabase.from("universities").insert(data).select().single();
    return { data: result, error };
  }, [supabase]);

  const updateUniversity = useCallback(async (id: string, data: Tables["universities"]["Update"]) => {
    const { error } = await supabase.from("universities").update(data).eq("id", id);
    return { error };
  }, [supabase]);

  const deleteUniversity = useCallback(async (id: string) => {
    const { error } = await supabase.from("universities").delete().eq("id", id);
    return { error };
  }, [supabase]);

  // ── Subjects ───────────────────────────────────────────────
  const getSubjects = useCallback(async () => {
    return supabase.from("subjects").select("*").order("sort_order");
  }, [supabase]);

  // ── Stats ──────────────────────────────────────────────────
  const getDashboardStats = useCallback(async () => {
    const [users, tests, questions, payments, attempts, premium] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("mock_tests").select("id", { count: "exact", head: true }),
      supabase.from("questions").select("id", { count: "exact", head: true }),
      supabase.from("payments").select("final_amount").eq("status", "success"),
      supabase.from("test_attempts").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "premium"),
    ]);
    const revenue = payments.data?.reduce((s, p) => s + (p.final_amount ?? 0), 0) ?? 0;
    return {
      totalUsers: users.count ?? 0,
      totalTests: tests.count ?? 0,
      totalQuestions: questions.count ?? 0,
      totalRevenue: revenue,
      totalAttempts: attempts.count ?? 0,
      premiumUsers: premium.count ?? 0,
    };
  }, [supabase]);

  // ── Audit Log ──────────────────────────────────────────────
  const logAudit = async (action: string, table: string, id?: string, data?: unknown) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("audit_logs").insert({
      user_id: user.id, action, table_name: table,
      record_id: id as string | undefined,
      new_data: data as Record<string, unknown> | undefined,
    });
  };

  // ── File Upload ────────────────────────────────────────────
  const uploadFile = useCallback(async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) return { url: null, error };
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicUrl, error: null };
  }, [supabase]);

  return {
    getUsers, updateUser, deleteUser,
    getTests, createTest, updateTest, deleteTest,
    getQuestions, createQuestion, updateQuestion, deleteQuestion,
    getPayments, updatePayment,
    getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
    getSettings, updateSetting,
    getUniversities, createUniversity, updateUniversity, deleteUniversity,
    getSubjects,
    getDashboardStats,
    uploadFile,
  };
}
