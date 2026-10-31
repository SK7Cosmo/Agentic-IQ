#!/usr/bin/env node
/**
 * Agentic IQ — Demo Account Provisioning Script
 * 
 * Creates demo student and teacher accounts via Supabase Admin API.
 * Run this ONCE after setting up your Supabase project.
 * 
 * Usage:
 *   node scripts/setup-demo-accounts.mjs
 * 
 * Requires environment variables from .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load .env.local manually (node doesn't auto-load it)
const envContent = readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=').map(s => s.trim()))
    .filter(([k, v]) => k && v)
);

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Admin client uses service role key — NEVER expose this to the browser
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_ACCOUNTS = [
  {
    email: 'student@agenticiq.demo',
    password: 'AgenticIQ_Student2026!',
    full_name: 'Alex Rivera',
    role: 'student',
  },
  {
    email: 'teacher@agenticiq.demo',
    password: 'AgenticIQ_Teacher2026!',
    full_name: 'Dr. Evelyn Reed',
    role: 'teacher',
  },
];

async function provisionDemoAccounts() {
  console.log('🚀 Agentic IQ — Demo Account Provisioning\n');

  for (const account of DEMO_ACCOUNTS) {
    console.log(`📧 Processing: ${account.email}`);

    // Create or retrieve user via admin API
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(u => u.email === account.email);

    let userId;

    if (existing) {
      console.log(`   ↳ User already exists (${existing.id})`);
      userId = existing.id;

      // Update password to match documented demo credentials
      await supabase.auth.admin.updateUserById(existing.id, {
        password: account.password,
      });
    } else {
      const { data: created, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`   ❌ Failed to create user: ${error.message}`);
        continue;
      }

      userId = created.user.id;
      console.log(`   ↳ Created user (${userId})`);
    }

    // Upsert profile
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: userId,
        email: account.email,
        full_name: account.full_name,
        role: account.role,
      },
      { onConflict: 'id' }
    );

    if (profileError) {
      console.error(`   ❌ Profile upsert failed: ${profileError.message}`);
    } else {
      console.log(`   ✅ Profile set: ${account.full_name} (${account.role})`);
    }

    // Seed demo mastery data for the student
    if (account.role === 'student') {
      await seedStudentMastery(userId);
    }
  }

  // Setup teacher class
  await setupTeacherClass();

  console.log('\n✅ Demo provisioning complete!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Student: student@agenticiq.demo / AgenticIQ_Student2026!');
  console.log('   Teacher: teacher@agenticiq.demo / AgenticIQ_Teacher2026!');
}

async function seedStudentMastery(studentId) {
  console.log('\n   📊 Seeding demo mastery data...');

  // Fetch all concepts
  const { data: concepts } = await supabase
    .from('concepts')
    .select('id, title')
    .order('order_index');

  if (!concepts?.length) {
    console.log('   ⚠️  No concepts found. Run seed.sql first.');
    return;
  }

  // Realistic mastery distribution for demo
  const masteryDistribution = [
    { titleFragment: 'token', score: 88, level: 'mastered' },
    { titleFragment: 'context window', score: 75, level: 'proficient' },
    { titleFragment: 'attention', score: 62, level: 'proficient' },
    { titleFragment: 'prompt', score: 55, level: 'developing' },
    { titleFragment: 'hallucination', score: 45, level: 'developing' },
    { titleFragment: 'ai agent', score: 35, level: 'developing' },
    { titleFragment: 'llm vs', score: 30, level: 'developing' },
    { titleFragment: 'tools and tool', score: 20, level: 'beginner' },
    { titleFragment: 'autonomy', score: 10, level: 'beginner' },
    { titleFragment: 'execution loop', score: 5, level: 'beginner' },
  ];

  for (const concept of concepts) {
    const matchedDist = masteryDistribution.find(d =>
      concept.title.toLowerCase().includes(d.titleFragment.toLowerCase())
    );

    if (matchedDist) {
      await supabase.from('learner_mastery').upsert(
        {
          user_id: studentId,
          concept_id: concept.id,
          score: matchedDist.score,
          level: matchedDist.level,
          last_assessed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,concept_id' }
      );
    }
  }

  // Seed assessment results for the demo misconception scenario
  const agentConcept = concepts.find(c =>
    c.title.toLowerCase().includes('llm vs')
  );

  if (agentConcept) {
    await supabase.from('assessment_results').upsert(
      {
        user_id: studentId,
        concept_title: 'LLM vs AI Agent',
        question_prompt: 'Why does an AI agent need tools and the ability to make decisions?',
        user_response: 'An AI agent is simply an LLM with access to the internet.',
        score: 30,
        evaluation: {
          concept: 'LLM vs AI Agent',
          score: 30,
          understanding_level: 'developing',
          misconceptions: [
            {
              statement: 'An AI agent is simply an LLM with access to the internet.',
              explanation: 'Tool access alone does not make a system an agent. Agentic behavior requires goal-directed execution, decision-making, and context-based action selection.',
            },
          ],
          feedback: 'You identified tool access but missed the goal-directed decision-making aspect.',
          recommended_action: 'Review Agent Execution Loop and Decision-Making concepts.',
        },
        assessed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: 'id' }
    );
  }

  // Seed revision schedule
  if (agentConcept) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    await supabase.from('revision_schedule').insert({
      user_id: studentId,
      concept_id: agentConcept.id,
      due_date: dueDate.toISOString(),
      interval_days: 1,
      status: 'pending',
    }).then(() => null).catch(() => null); // Ignore duplicate errors
  }

  console.log('   ✅ Mastery data seeded successfully');
}

async function setupTeacherClass() {
  console.log('\n🏫 Setting up teacher class...');

  const { data: teacher } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'teacher@agenticiq.demo')
    .single();

  if (!teacher) {
    console.log('   ⚠️  Teacher profile not found. Skipping class setup.');
    return;
  }

  // Create class
  const { data: existingClass } = await supabase
    .from('classes')
    .select('id')
    .eq('teacher_id', teacher.id)
    .single();

  let classId = existingClass?.id;

  if (!classId) {
    const { data: newClass } = await supabase
      .from('classes')
      .insert({
        teacher_id: teacher.id,
        name: 'AI & Agentic Systems — Cohort 2026',
        description: 'Advanced curriculum covering LLMs, agent architectures, orchestration, and production deployment.',
      })
      .select('id')
      .single();
    classId = newClass?.id;
  }

  // Add student to class
  if (classId) {
    const { data: student } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'student@agenticiq.demo')
      .single();

    if (student) {
      await supabase.from('class_members').upsert(
        { class_id: classId, student_id: student.id },
        { onConflict: 'class_id,student_id' }
      );
      console.log('   ✅ Student added to class');
    }
  }
}

provisionDemoAccounts().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
