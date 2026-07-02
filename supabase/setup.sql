-- ================================================================
-- NED University Mock Test Platform — FULL SETUP SQL
-- Paste this ENTIRE file into Supabase SQL Editor and click RUN
-- ================================================================

-- Step 1: Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Step 2: Enums
do $$ begin
  create type user_role as enum ('student','moderator','admin','super_admin');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type user_status as enum ('active','suspended','banned');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type plan_type as enum ('free','premium');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type test_status as enum ('draft','published','scheduled','archived');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type difficulty_level as enum ('easy','medium','hard');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type question_type as enum ('mcq','multi_correct','true_false','image');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type payment_status as enum ('pending','success','failed','refunded');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type payment_method as enum ('jazzcash','easypaisa','bank_transfer','card');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type announcement_type as enum ('banner','popup','notification','maintenance');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type announcement_target as enum ('all','premium','free','selected_university');
  exception when duplicate_object then null;
end $$;
do $$ begin
  create type attempt_status as enum ('in_progress','completed','abandoned','timed_out');
  exception when duplicate_object then null;
end $$;

-- Step 3: Profiles
create table if not exists public.profiles (
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
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

-- Step 4: Universities
create table if not exists public.universities (
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
insert into public.universities (name,short_name,tagline,description,website_url,primary_color,accent_color,admission_year,is_active)
values ('NED University','NEDUET','Excellence in Engineering & Technology',
'Prepare for your university entrance exams with our comprehensive mock test platform.',
'https://www.neduet.edu.pk','#1e3a5f','#f59e0b',2025,true)
on conflict do nothing;

-- Step 5: Subjects
create table if not exists public.subjects (
  id uuid primary key default uuid_generate_v4(),
  university_id uuid references public.universities(id) on delete cascade,
  name text not null,
  short_name text,
  description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_subjects_university on public.subjects(university_id);
insert into public.subjects (name,short_name,sort_order) values
  ('Mathematics','MATH',1),('Physics','PHY',2),
  ('Chemistry','CHEM',3),('English','ENG',4),('Intelligence','IQ',5)
on conflict do nothing;

-- Step 6: Chapters & Topics
create table if not exists public.chapters (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references public.subjects(id) on delete cascade,
  name text not null, description text, sort_order int default 0,
  is_active boolean default true, created_at timestamptz default now()
);
create table if not exists public.topics (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid references public.chapters(id) on delete cascade,
  name text not null, sort_order int default 0, created_at timestamptz default now()
);

-- Step 7: Mock Tests
create table if not exists public.mock_tests (
  id uuid primary key default uuid_generate_v4(),
  university_id uuid references public.universities(id) on delete cascade,
  title text not null, description text,
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
  max_attempts int default 0,
  instructions text, scheduled_at timestamptz, published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_mock_tests_status on public.mock_tests(status);

-- Seed mock tests
insert into public.mock_tests (title,description,status,is_premium,duration_minutes,total_questions,passing_marks,negative_marking,randomize_questions)
values
  ('Free Mock Test','Mathematics & Physics — 30 questions','published',false,45,30,50,false,true),
  ('Premium Mock Test 1','Full Syllabus Set A','published',true,120,100,60,true,true),
  ('Premium Mock Test 2','Full Syllabus Set B','published',true,120,100,60,true,false),
  ('Premium Mock Test 3','Full Syllabus Set C','draft',true,120,100,60,true,true)
on conflict do nothing;

-- Step 8: Questions & Options
create table if not exists public.questions (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references public.subjects(id),
  chapter_id uuid references public.chapters(id),
  topic_id uuid references public.topics(id),
  question_text text not null,
  question_type question_type not null default 'mcq',
  difficulty difficulty_level default 'medium',
  image_url text, explanation text,
  tags text[] default '{}', is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references public.questions(id) on delete cascade,
  option_text text not null, is_correct boolean default false,
  sort_order int default 0, image_url text
);
create table if not exists public.test_questions (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references public.mock_tests(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  marks int default 1, sort_order int default 0,
  unique(test_id,question_id)
);

-- Step 9: Attempts & Answers
create table if not exists public.test_attempts (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references public.mock_tests(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status attempt_status default 'in_progress',
  started_at timestamptz default now(), completed_at timestamptz,
  time_taken_seconds int, total_questions int,
  attempted_questions int default 0, correct_answers int default 0,
  wrong_answers int default 0, skipped_questions int default 0,
  raw_score numeric(6,2) default 0, final_score numeric(6,2) default 0,
  percentage numeric(5,2) default 0, is_passed boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_attempts_user on public.test_attempts(user_id);
create index if not exists idx_attempts_test on public.test_attempts(test_id);

create table if not exists public.attempt_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid references public.test_attempts(id) on delete cascade,
  question_id uuid references public.questions(id),
  selected_options uuid[] default '{}', is_correct boolean,
  marks_obtained numeric(4,2) default 0,
  time_spent_seconds int default 0, answered_at timestamptz default now()
);

-- Step 10: Rankings
create table if not exists public.rankings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  university_id uuid references public.universities(id),
  total_tests int default 0, total_attempts int default 0,
  best_score numeric(5,2) default 0, average_score numeric(5,2) default 0,
  global_rank int, university_rank int, points int default 0,
  updated_at timestamptz default now()
);

-- Step 11: Premium Plans
create table if not exists public.premium_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null, description text,
  price numeric(10,2) not null, duration_days int not null,
  features text[] default '{}', is_active boolean default true,
  sort_order int default 0, created_at timestamptz default now()
);
insert into public.premium_plans (name,description,price,duration_days,features,sort_order)
values ('Premium Plan','Full access to all mock tests for admission season',999.00,180,
  ARRAY['All 3 Premium Mock Tests','100 questions per test','Detailed explanations',
        'Performance analytics','Unlimited attempts','PDF reports','Priority support'],1)
on conflict do nothing;

-- Step 12: Subscriptions, Payments, Coupons
create table if not exists public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan_id uuid references public.premium_plans(id),
  starts_at timestamptz default now(), expires_at timestamptz,
  is_active boolean default true, created_at timestamptz default now()
);
create table if not exists public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  discount_percent int, discount_amount numeric(10,2),
  max_uses int default 0, used_count int default 0,
  valid_from timestamptz default now(), valid_until timestamptz,
  is_active boolean default true, created_at timestamptz default now()
);
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  plan_id uuid references public.premium_plans(id),
  subscription_id uuid references public.user_subscriptions(id),
  coupon_id uuid references public.coupons(id),
  amount numeric(10,2) not null, discount_amount numeric(10,2) default 0,
  final_amount numeric(10,2) not null, method payment_method,
  status payment_status default 'pending',
  transaction_ref text, screenshot_url text, notes text,
  verified_by uuid references public.profiles(id), verified_at timestamptz,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

-- Step 13: Announcements, Notifications, Testimonials
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null, message text not null,
  type announcement_type default 'banner',
  target announcement_target default 'all',
  university_id uuid references public.universities(id),
  is_active boolean default true,
  starts_at timestamptz default now(), ends_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
insert into public.announcements (title,message,type,target,is_active)
values ('Welcome to NED Mock Test Platform!',
  'Start with our free mock test — no signup required. Upgrade for full access.',
  'banner','all',true)
on conflict do nothing;

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null, message text, type text default 'in_app',
  is_read boolean default false, link text, created_at timestamptz default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id,is_read);

create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  name text not null, university text, message text not null,
  rating int check (rating between 1 and 5),
  is_approved boolean default false, created_at timestamptz default now()
);

-- Step 14: Blog, Contact, Feedback
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null, slug text not null unique,
  content text, excerpt text, cover_image_url text,
  tags text[] default '{}', is_published boolean default false,
  author_id uuid references public.profiles(id),
  published_at timestamptz, created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null, email text not null, subject text, message text not null,
  is_resolved boolean default false, reply text,
  replied_by uuid references public.profiles(id), replied_at timestamptz,
  created_at timestamptz default now()
);
create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  type text not null, message text not null,
  is_resolved boolean default false, created_at timestamptz default now()
);

-- Step 15: Site Settings
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique, value text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz default now()
);
insert into public.site_settings (key,value) values
  ('site_name','NED University Mock Test Platform'),
  ('logo_text','NED'),('primary_color','#1e3a5f'),
  ('accent_color','#f59e0b'),('maintenance_mode','false'),
  ('google_analytics_id',''),('contact_email','support@nedmocktest.edu.pk')
on conflict (key) do nothing;

-- Step 16: Audit Logs
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  action text not null, table_name text, record_id uuid,
  old_data jsonb, new_data jsonb, ip_address text, user_agent text,
  created_at timestamptz default now()
);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);

-- ================================================================
-- Step 17: Functions & Triggers
-- ================================================================

-- Auto updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create or replace trigger trg_profiles_updated before update on public.profiles for each row execute function update_updated_at();
create or replace trigger trg_universities_updated before update on public.universities for each row execute function update_updated_at();
create or replace trigger trg_mock_tests_updated before update on public.mock_tests for each row execute function update_updated_at();
create or replace trigger trg_questions_updated before update on public.questions for each row execute function update_updated_at();
create or replace trigger trg_payments_updated before update on public.payments for each row execute function update_updated_at();
create or replace trigger trg_announcements_updated before update on public.announcements for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id,email,full_name,role)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update ranking after attempt
create or replace function public.update_ranking_after_attempt()
returns trigger as $$
begin
  if new.status = 'completed' then
    insert into public.rankings (user_id,total_tests,total_attempts,best_score,average_score)
    values (new.user_id,1,1,new.percentage,new.percentage)
    on conflict (user_id) do update set
      total_attempts = rankings.total_attempts + 1,
      total_tests = (select count(distinct test_id) from public.test_attempts where user_id=new.user_id and status='completed'),
      best_score = greatest(rankings.best_score,new.percentage),
      average_score = (select avg(percentage) from public.test_attempts where user_id=new.user_id and status='completed'),
      updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_update_ranking on public.test_attempts;
create trigger trg_update_ranking
  after insert or update on public.test_attempts
  for each row execute function public.update_ranking_after_attempt();

-- Helper: is_admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin','super_admin')
  );
$$ language sql security definer stable;

-- ================================================================
-- Step 18: Row Level Security
-- ================================================================
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

-- Drop existing policies to avoid conflicts
do $$ declare r record;
begin
  for r in select schemaname,tablename,policyname from pg_policies where schemaname='public'
  loop
    execute format('drop policy if exists %I on %I.%I',r.policyname,r.schemaname,r.tablename);
  end loop;
end $$;

-- RLS Policies
create policy "own_profile_select" on public.profiles for select using (auth.uid()=id or public.is_admin());
create policy "own_profile_update" on public.profiles for update using (auth.uid()=id or public.is_admin());
create policy "admin_profile_delete" on public.profiles for delete using (public.is_admin());

create policy "public_universities" on public.universities for select using (is_active=true);
create policy "admin_universities" on public.universities for all using (public.is_admin());

create policy "public_subjects" on public.subjects for select using (is_active=true);
create policy "admin_subjects" on public.subjects for all using (public.is_admin());

create policy "public_chapters" on public.chapters for select using (is_active=true);
create policy "admin_chapters" on public.chapters for all using (public.is_admin());

create policy "public_topics" on public.topics for select using (true);
create policy "admin_topics" on public.topics for all using (public.is_admin());

create policy "public_tests" on public.mock_tests for select using (status='published');
create policy "admin_tests" on public.mock_tests for all using (public.is_admin());

create policy "public_questions" on public.questions for select using (is_active=true);
create policy "admin_questions" on public.questions for all using (public.is_admin());

create policy "public_options" on public.question_options for select using (true);
create policy "admin_options" on public.question_options for all using (public.is_admin());

create policy "public_test_questions" on public.test_questions for select using (true);
create policy "admin_test_questions" on public.test_questions for all using (public.is_admin());

create policy "own_attempts_select" on public.test_attempts for select using (auth.uid()=user_id or public.is_admin());
create policy "own_attempts_insert" on public.test_attempts for insert with check (auth.uid()=user_id);
create policy "own_attempts_update" on public.test_attempts for update using (auth.uid()=user_id);

create policy "own_answers" on public.attempt_answers for all using (
  exists (select 1 from public.test_attempts where id=attempt_id and user_id=auth.uid())
  or public.is_admin()
);

create policy "public_rankings" on public.rankings for select using (true);
create policy "admin_rankings" on public.rankings for all using (public.is_admin());

create policy "public_plans" on public.premium_plans for select using (is_active=true);
create policy "admin_plans" on public.premium_plans for all using (public.is_admin());

create policy "own_subscriptions" on public.user_subscriptions for select using (auth.uid()=user_id or public.is_admin());
create policy "admin_subscriptions" on public.user_subscriptions for all using (public.is_admin());

create policy "own_payments_select" on public.payments for select using (auth.uid()=user_id or public.is_admin());
create policy "own_payments_insert" on public.payments for insert with check (auth.uid()=user_id);
create policy "admin_payments" on public.payments for all using (public.is_admin());

create policy "public_announcements" on public.announcements for select using (is_active=true);
create policy "admin_announcements" on public.announcements for all using (public.is_admin());

create policy "own_notifications" on public.notifications for select using (auth.uid()=user_id);
create policy "own_notifications_update" on public.notifications for update using (auth.uid()=user_id);
create policy "admin_notifications" on public.notifications for all using (public.is_admin());

create policy "public_testimonials" on public.testimonials for select using (is_approved=true);
create policy "insert_testimonials" on public.testimonials for insert with check (auth.uid()=user_id);
create policy "admin_testimonials" on public.testimonials for all using (public.is_admin());

create policy "public_blog" on public.blog_posts for select using (is_published=true);
create policy "admin_blog" on public.blog_posts for all using (public.is_admin());

create policy "insert_contact" on public.contact_messages for insert with check (true);
create policy "admin_contact" on public.contact_messages for all using (public.is_admin());

create policy "insert_feedback" on public.feedback for insert with check (true);
create policy "admin_feedback" on public.feedback for all using (public.is_admin());

create policy "public_settings" on public.site_settings for select using (true);
create policy "admin_settings" on public.site_settings for all using (public.is_admin());

create policy "admin_audit" on public.audit_logs for select using (public.is_admin());
create policy "insert_audit" on public.audit_logs for insert with check (true);

create policy "public_coupons" on public.coupons for select using (is_active=true);
create policy "admin_coupons" on public.coupons for all using (public.is_admin());

-- ================================================================
-- Step 19: Storage Buckets
-- ================================================================
insert into storage.buckets (id,name,public) values
  ('avatars','avatars',true),
  ('logos','logos',true),
  ('question-images','question-images',true),
  ('blog-images','blog-images',true),
  ('documents','documents',false)
on conflict (id) do nothing;

-- Storage policies
create policy "public_avatars" on storage.objects for select using (bucket_id='avatars');
create policy "auth_upload_avatar" on storage.objects for insert with check (bucket_id='avatars' and auth.role()='authenticated');
create policy "own_avatar_update" on storage.objects for update using (bucket_id='avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "public_logos" on storage.objects for select using (bucket_id='logos');
create policy "admin_logos" on storage.objects for all using (bucket_id='logos' and public.is_admin());

create policy "public_question_images" on storage.objects for select using (bucket_id='question-images');
create policy "admin_question_images" on storage.objects for all using (bucket_id='question-images' and public.is_admin());

create policy "public_blog_images" on storage.objects for select using (bucket_id='blog-images');
create policy "admin_blog_images" on storage.objects for all using (bucket_id='blog-images' and public.is_admin());

create policy "admin_documents" on storage.objects for all using (bucket_id='documents' and public.is_admin());

-- ================================================================
-- Step 20: Create Admin User
-- ================================================================
-- After running this SQL, go to:
-- Supabase Dashboard → Authentication → Users → Add User
-- Email: maxin3820@gmail.com
-- Password: admin12345
-- Then run this to set admin role (replace the email if different):

-- UPDATE public.profiles SET role = 'admin' WHERE email = 'maxin3820@gmail.com';

-- ================================================================
-- DONE! All tables, RLS policies, triggers, and seed data created.
-- ================================================================
