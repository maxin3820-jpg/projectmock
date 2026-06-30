// Auto-generated types matching the Supabase schema
// Re-run: npx supabase gen types typescript --local > src/lib/supabase/types.ts

export type UserRole = "student" | "moderator" | "admin" | "super_admin";
export type UserStatus = "active" | "suspended" | "banned";
export type PlanType = "free" | "premium";
export type TestStatus = "draft" | "published" | "scheduled" | "archived";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type QuestionType = "mcq" | "multi_correct" | "true_false" | "image";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";
export type PaymentMethod = "jazzcash" | "easypaisa" | "bank_transfer" | "card";
export type AnnouncementType = "banner" | "popup" | "notification" | "maintenance";
export type AnnouncementTarget = "all" | "premium" | "free" | "selected_university";
export type AttemptStatus = "in_progress" | "completed" | "abandoned" | "timed_out";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          plan: PlanType;
          university_id: string | null;
          registration_number: string | null;
          last_login_at: string | null;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      universities: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          tagline: string | null;
          description: string | null;
          logo_url: string | null;
          banner_url: string | null;
          website_url: string | null;
          primary_color: string;
          accent_color: string;
          admission_year: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["universities"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["universities"]["Insert"]>;
      };
      subjects: {
        Row: {
          id: string;
          university_id: string | null;
          name: string;
          short_name: string | null;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subjects"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["subjects"]["Insert"]>;
      };
      mock_tests: {
        Row: {
          id: string;
          university_id: string | null;
          title: string;
          description: string | null;
          subject_id: string | null;
          status: TestStatus;
          is_premium: boolean;
          duration_minutes: number;
          total_questions: number;
          passing_marks: number;
          negative_marking: boolean;
          negative_marks_per_wrong: number;
          randomize_questions: boolean;
          shuffle_options: boolean;
          max_attempts: number;
          instructions: string | null;
          scheduled_at: string | null;
          published_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["mock_tests"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["mock_tests"]["Insert"]>;
      };
      questions: {
        Row: {
          id: string;
          subject_id: string | null;
          chapter_id: string | null;
          topic_id: string | null;
          question_text: string;
          question_type: QuestionType;
          difficulty: DifficultyLevel;
          image_url: string | null;
          explanation: string | null;
          tags: string[];
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["questions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
      };
      question_options: {
        Row: {
          id: string;
          question_id: string;
          option_text: string;
          is_correct: boolean;
          sort_order: number;
          image_url: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["question_options"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["question_options"]["Insert"]>;
      };
      test_attempts: {
        Row: {
          id: string;
          test_id: string;
          user_id: string;
          status: AttemptStatus;
          started_at: string;
          completed_at: string | null;
          time_taken_seconds: number | null;
          total_questions: number | null;
          attempted_questions: number;
          correct_answers: number;
          wrong_answers: number;
          skipped_questions: number;
          raw_score: number;
          final_score: number;
          percentage: number;
          is_passed: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["test_attempts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["test_attempts"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string | null;
          plan_id: string | null;
          subscription_id: string | null;
          coupon_id: string | null;
          amount: number;
          discount_amount: number;
          final_amount: number;
          method: PaymentMethod | null;
          status: PaymentStatus;
          transaction_ref: string | null;
          screenshot_url: string | null;
          notes: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: AnnouncementType;
          target: AnnouncementTarget;
          university_id: string | null;
          is_active: boolean;
          starts_at: string;
          ends_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["announcements"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
      premium_plans: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          duration_days: number;
          features: string[];
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["premium_plans"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["premium_plans"]["Insert"]>;
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string | null;
          plan_id: string | null;
          starts_at: string;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_subscriptions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["user_subscriptions"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["site_settings"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
      rankings: {
        Row: {
          id: string;
          user_id: string;
          university_id: string | null;
          total_tests: number;
          total_attempts: number;
          best_score: number;
          average_score: number;
          global_rank: number | null;
          university_rank: number | null;
          points: number;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rankings"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["rankings"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string | null;
          record_id: string | null;
          old_data: Record<string, unknown> | null;
          new_data: Record<string, unknown> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at">;
        Update: never;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string | null;
          type: string;
          is_read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          university: string | null;
          message: string;
          rating: number | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_resolved: boolean;
          reply: string | null;
          replied_by: string | null;
          replied_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
      };
      feedback: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          message: string;
          is_resolved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["feedback"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["feedback"]["Insert"]>;
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_percent: number | null;
          discount_amount: number | null;
          max_uses: number;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["coupons"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
      };
      chapters: {
        Row: {
          id: string;
          subject_id: string | null;
          name: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["chapters"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["chapters"]["Insert"]>;
      };
      topics: {
        Row: {
          id: string;
          chapter_id: string | null;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["topics"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["topics"]["Insert"]>;
      };
      test_questions: {
        Row: {
          id: string;
          test_id: string;
          question_id: string;
          marks: number;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["test_questions"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["test_questions"]["Insert"]>;
      };
      attempt_answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string | null;
          selected_options: string[];
          is_correct: boolean | null;
          marks_obtained: number;
          time_spent_seconds: number;
          answered_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attempt_answers"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["attempt_answers"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          excerpt: string | null;
          cover_image_url: string | null;
          tags: string[];
          is_published: boolean;
          author_id: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      get_user_role: { Args: Record<string, never>; Returns: string };
    };
    Enums: Record<string, never>;
  };
}
