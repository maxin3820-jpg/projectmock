-- ============================================================
-- NED University Mock Test Platform — Supabase Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('student', 'moderator', 'admin', 'super_admin');
create type user_status as enum ('active', 'suspended', 'banned');
create type plan_type as enum ('free', 'premium');
create type test_status as enum ('draft', 'published', 'scheduled', 'archived');
create type difficulty_level as enum ('easy', 'medium', 'hard');
create type question_type as enum ('mcq', 'multi_correct', 'true_false', 'image');
create type payment_status as enum ('pending', 'success', 'failed', 'refunded');
create type payment_method as enum ('jazzcash', 'easypaisa', 'bank_transfer', 'card');
create type announcement_type as enum ('banner', 'popup', 'notification', 'maintenance');
create type announcement_target as enum ('all', 'premium', 'free', 'selected_university');
create type notification_type as enum ('push', 'email', 'in_app');
create type attempt_status as enum ('in_progress', 'completed', 'abandoned', 'timed_out');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'student',
  status user_status not null default 'active',
  plan plan_type not null default 'free',
  university_id uuid,
  registration_number text,
  last_login_at timestamptz,
  email_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_email on public.profiles(email);
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_university on public.profiles(university_id);

-- ============================================================
-- UNIVERSITIES
-- ============================================================
create table public.universities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  short_name text not null,
  tagline text,
  description text,
  logo_url text,
  banner_url text,
  website_url text,
  primary_color text default '#1e3a5f',
  accent_color text default '#f59e0b',
  admission_year int,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into public.universities (name, short_name, tagline, description, website_url, primary_color, accent_color, admission_year, is_active)
values ('NED University', 'NEDUET', 'Excellence in Engineering & Technology',
  'Prepare for your university entrance exams with our comprehensive mock test platform.',
  'https://www.neduet.edu.pk', '#1e3a5f', '#f59e0b', 2025, true);

-- ============================================================
-- SUBJECTS
-- ============================================================
create table public.subjects (
  id uuid primary key default uuid_generate_v4(),
  university_id uuid references public.universities(id) on delete cascade,
  name text not null,
  short_name text,
  description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_subjects_university on public.subjects(university_id);

insert into public.subjects (name, short_name, sort_order) values
  ('Mathematics', 'MATH', 1),
  ('Physics', 'PHY', 2),
  ('Chemistry', 'CHEM', 3),
  ('English', 'ENG', 4),
  ('Intelligence', 'IQ', 5);

-- ============================================================
-- CHAPTERS
-- ============================================================
create table public.chapters (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references public.subjects(id) on delete cascade,
  name text not null,
  description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_chapters_subject on public.chapters(subject_id);

-- ============================================================
-- TOPICS
-- ============================================================
create table public.topics (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid references public.chapters(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- MOCK TESTS
-- ============================================================
create table public.mock_tests (
  id uuid primary key default uuid_generate_v4(),
  university_id uuid references public.universities(id) on delete cascade,
  title text not null,
  description text,
  subject_id uuid references public.subjects(id),
  status test_status default 'draft',
  is_premium boolean default false,
  duration_minutes int not null default 60,
  total_questions int not null default 50,
  passing_marks int default 50,
  negative_marking boolean default false,
  negative_marks_per_wrong numeric(4,2) default 0.25,
  randomize_questions boolean default true,
  shuffle_options boolean default true,
  max_attempts int default 0, -- 0 = unlimited
  instructions text,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_mock_tests_university on public.mock_tests(university_id);
create index idx_mock_tests_status on public.mock_tests(status);
create index idx_mock_tests_premium on public.mock_tests(is_premium);

-- ============================================================
-- QUESTIONS
-- ============================================================
create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references public.subjects(id),
  chapter_id uuid references public.chapters(id),
  topic_id uuid references public.topics(id),
  question_text text not null,
  question_type question_type not null default 'mcq',
  difficulty difficulty_level default 'medium',
  image_url text,
  explanation text,
  tags text[] default '{}',
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_questions_subject on public.questions(subject_id);
create index idx_questions_difficulty on public.questions(difficulty);
create index idx_questions_type on public.questions(question_type);

-- ============================================================
-- QUESTION OPTIONS
-- ============================================================
create table public.question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean default false,
  sort_order int default 0,
  image_url text
);

create index idx_options_question on public.question_options(question_id);

-- ============================================================
-- TEST QUESTIONS (many-to-many)
-- ============================================================
create table public.test_questions (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references public.mock_tests(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  marks int default 1,
  sort_order int default 0,
  unique(test_id, question_id)
);

create index idx_test_questions_test on public.test_questions(test_id);

-- ============================================================
-- TEST ATTEMPTS
-- ============================================================
create table public.test_attempts (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references public.mock_tests(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status attempt_status default 'in_progress',
  started_at timestamptz default now(),
  completed_at timestamptz,
  time_taken_seconds int,
  total_questions int,
  attempted_questions int default 0,
  correct_answers int default 0,
  wrong_answers int default 0,
  skipped_questions int default 0,
  raw_score numeric(6,2) default 0,
  final_score numeric(6,2) default 0,
  percentage numeric(5,2) default 0,
  is_passed boolean default false,
  created_at timestamptz default now()
);

create index idx_attempts_user on public.test_attempts(user_id);
create index idx_attempts_test on public.test_attempts(test_id);
create index idx_attempts_status on public.test_attempts(status);

-- ============================================================
-- ATTEMPT ANSWERS
-- ============================================================
create table public.attempt_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid references public.test_attempts(id) on delete cascade,
  question_id uuid references public.questions(id),
  selected_options uuid[] default '{}',
  is_correct boolean,
  marks_obtained numeric(4,2) default 0,
  time_spent_seconds int default 0,
  answered_at timestamptz default now()
);

create index idx_answers_attempt on public.attempt_answers(attempt_id);

-- ============================================================
-- RANKINGS
-- ============================================================
create table public.rankings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  university_id uuid references public.universities(id),
  total_tests int default 0,
  total_attempts int default 0,
  best_score numeric(5,2) default 0,
  average_score numeric(5,2) default 0,
  global_rank int,
  university_rank int,
  points int default 0,
  updated_at timestamptz default now()
);

create index idx_rankings_global on public.rankings(global_rank);
create index idx_rankings_university on public.rankings(university_rank, university_id);

-- ============================================================
-- PREMIUM PLANS
-- ============================================================
create table public.premium_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_days int not null,
  features text[] default '{}',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

insert into public.premium_plans (name, description, price, duration_days, features, sort_order) values
  ('Premium Plan', 'Full access to all mock tests for admission season', 999.00, 180,
   ARRAY['All 3 Premium Mock Tests', '100 questions per test', 'Detailed explanations', 'Performance analytics', 'Unlimited attempts', 'PDF reports', 'Priority support'],
   1);

-- ============================================================
-- USER SUBSCRIPTIONS
-- ============================================================
create table public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan_id uuid references public.premium_plans(id),
  starts_at timestamptz default now(),
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_subscriptions_user on public.user_subscriptions(user_id);
create index idx_subscriptions_active on public.user_subscriptions(is_active, expires_at);

-- ============================================================
-- COUPONS
-- ============================================================
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  discount_percent int,
  discount_amount numeric(10,2),
  max_uses int default 0, -- 0 = unlimited
  used_count int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  plan_id uuid references public.premium_plans(id),
  subscription_id uuid references public.user_subscriptions(id),
  coupon_id uuid references public.coupons(id),
  amount numeric(10,2) not null,
  discount_amount numeric(10,2) default 0,
  final_amount numeric(10,2) not null,
  method payment_method,
  status payment_status default 'pending',
  transaction_ref text,
  screenshot_url text,
  notes text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_payments_user on public.payments(user_id);
create index idx_payments_status on public.payments(status);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
create table public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  message text not null,
  type announcement_type default 'banner',
  target announcement_target default 'all',
  university_id uuid references public.universities(id),
  is_active boolean default true,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  type notification_type default 'in_app',
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

create index idx_notifications_user on public.notifications(user_id, is_read);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  name text not null,
  university text,
  message text not null,
  rating int check (rating between 1 and 5),
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  cover_image_url text,
  tags text[] default '{}',
  is_published boolean default false,
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_resolved boolean default false,
  reply text,
  replied_by uuid references public.profiles(id),
  replied_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- FEEDBACK
-- ============================================================
create table public.feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  type text not null, -- 'suggestion', 'bug', 'other'
  message text not null,
  is_resolved boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
create table public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz default now()
);

insert into public.site_settings (key, value) values
  ('site_name', 'NED University Mock Test Platform'),
  ('logo_text', 'NED'),
  ('primary_color', '#1e3a5f'),
  ('accent_color', '#f59e0b'),
  ('maintenance_mode', 'false'),
  ('google_analytics_id', ''),
  ('contact_email', 'support@nedmocktest.edu.pk');

-- ============================================================
-- AUDIT LOGS
-- ============================================================
create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  action text not null,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

create index idx_audit_user on public.audit_logs(user_id);
create index idx_audit_created on public.audit_logs(created_at desc);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on public.profiles for each row execute function update_updated_at();
create trigger trg_universities_updated before update on public.universities for each row execute function update_updated_at();
create trigger trg_mock_tests_updated before update on public.mock_tests for each row execute function update_updated_at();
create trigger trg_questions_updated before update on public.questions for each row execute function update_updated_at();
create trigger trg_payments_updated before update on public.payments for each row execute function update_updated_at();
create trigger trg_announcements_updated before update on public.announcements for each row execute function update_updated_at();
create trigger trg_blog_updated before update on public.blog_posts for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'student'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update ranking after attempt
create or replace function public.update_ranking_after_attempt()
returns trigger as $$
begin
  if new.status = 'completed' then
    insert into public.rankings (user_id, total_tests, total_attempts, best_score, average_score)
    values (new.user_id, 1, 1, new.percentage, new.percentage)
    on conflict (user_id) do update set
      total_attempts = rankings.total_attempts + 1,
      total_tests = (select count(distinct test_id) from public.test_attempts where user_id = new.user_id and status = 'completed'),
      best_score = greatest(rankings.best_score, new.percentage),
      average_score = (select avg(percentage) from public.test_attempts where user_id = new.user_id and status = 'completed'),
      updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_update_ranking
  after insert or update on public.test_attempts
  for each row execute function public.update_ranking_after_attempt();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.topics enable row level security;
alter table public.mock_tests enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.rankings enable row level security;
alter table public.premium_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.coupons enable row level security;
alter table public.payments enable row level security;
alter table public.announcements enable row level security;
alter table public.notifications enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.feedback enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Helper function: check if user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'super_admin')
  );
$$ language sql security definer stable;

-- Helper: get user role
create or replace function public.get_user_role()
returns text as $$
  select role::text from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- PROFILES
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (public.is_admin());
create policy "Admins can update all profiles" on public.profiles for update using (public.is_admin());
create policy "Admins can delete profiles" on public.profiles for delete using (public.is_admin());

-- UNIVERSITIES
create policy "Anyone can view active universities" on public.universities for select using (is_active = true);
create policy "Admins manage universities" on public.universities for all using (public.is_admin());

-- SUBJECTS
create policy "Anyone can view active subjects" on public.subjects for select using (is_active = true);
create policy "Admins manage subjects" on public.subjects for all using (public.is_admin());

-- CHAPTERS
create policy "Anyone can view active chapters" on public.chapters for select using (is_active = true);
create policy "Admins manage chapters" on public.chapters for all using (public.is_admin());

-- TOPICS
create policy "Anyone can view topics" on public.topics for select using (true);
create policy "Admins manage topics" on public.topics for all using (public.is_admin());

-- MOCK TESTS
create policy "Anyone can view published tests" on public.mock_tests for select using (status = 'published');
create policy "Admins manage all tests" on public.mock_tests for all using (public.is_admin());

-- QUESTIONS
create policy "Students can view active questions" on public.questions for select using (is_active = true);
create policy "Admins manage questions" on public.questions for all using (public.is_admin());

-- QUESTION OPTIONS
create policy "Anyone can view options" on public.question_options for select using (true);
create policy "Admins manage options" on public.question_options for all using (public.is_admin());

-- TEST QUESTIONS
create policy "Anyone can view test questions" on public.test_questions for select using (true);
create policy "Admins manage test questions" on public.test_questions for all using (public.is_admin());

-- TEST ATTEMPTS
create policy "Users can view own attempts" on public.test_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own attempts" on public.test_attempts for insert with check (auth.uid() = user_id);
create policy "Users can update own attempts" on public.test_attempts for update using (auth.uid() = user_id);
create policy "Admins view all attempts" on public.test_attempts for select using (public.is_admin());

-- ATTEMPT ANSWERS
create policy "Users can manage own answers" on public.attempt_answers for all using (
  exists (select 1 from public.test_attempts where id = attempt_id and user_id = auth.uid())
);
create policy "Admins view all answers" on public.attempt_answers for select using (public.is_admin());

-- RANKINGS
create policy "Anyone can view rankings" on public.rankings for select using (true);
create policy "System can update rankings" on public.rankings for all using (public.is_admin());

-- PREMIUM PLANS
create policy "Anyone can view active plans" on public.premium_plans for select using (is_active = true);
create policy "Admins manage plans" on public.premium_plans for all using (public.is_admin());

-- USER SUBSCRIPTIONS
create policy "Users can view own subscriptions" on public.user_subscriptions for select using (auth.uid() = user_id);
create policy "Admins manage subscriptions" on public.user_subscriptions for all using (public.is_admin());

-- PAYMENTS
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Users can insert payments" on public.payments for insert with check (auth.uid() = user_id);
create policy "Admins manage all payments" on public.payments for all using (public.is_admin());

-- ANNOUNCEMENTS
create policy "Anyone can view active announcements" on public.announcements for select using (is_active = true);
create policy "Admins manage announcements" on public.announcements for all using (public.is_admin());

-- NOTIFICATIONS
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Admins manage notifications" on public.notifications for all using (public.is_admin());

-- TESTIMONIALS
create policy "Anyone can view approved testimonials" on public.testimonials for select using (is_approved = true);
create policy "Users can insert testimonials" on public.testimonials for insert with check (auth.uid() = user_id);
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin());

-- BLOG POSTS
create policy "Anyone can view published posts" on public.blog_posts for select using (is_published = true);
create policy "Admins manage blog" on public.blog_posts for all using (public.is_admin());

-- CONTACT MESSAGES
create policy "Anyone can insert messages" on public.contact_messages for insert with check (true);
create policy "Admins manage messages" on public.contact_messages for all using (public.is_admin());

-- FEEDBACK
create policy "Users can insert feedback" on public.feedback for insert with check (true);
create policy "Admins manage feedback" on public.feedback for all using (public.is_admin());

-- SITE SETTINGS
create policy "Anyone can view settings" on public.site_settings for select using (true);
create policy "Admins manage settings" on public.site_settings for all using (public.is_admin());

-- AUDIT LOGS
create policy "Admins view audit logs" on public.audit_logs for select using (public.is_admin());
create policy "System can insert audit logs" on public.audit_logs for insert with check (true);

-- COUPONS
create policy "Admins manage coupons" on public.coupons for all using (public.is_admin());
create policy "Anyone can view active coupons" on public.coupons for select using (is_active = true);

-- ============================================================
-- STORAGE BUCKETS (run after schema)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('logos', 'logos', true);
-- insert into storage.buckets (id, name, public) values ('question-images', 'question-images', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
-- insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true);
