export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  icon?: string;
}

export interface Concept {
  id: string;
  module_id: string;
  title: string;
  description: string;
  order_index: number;
  prerequisites: string[];
}

export interface Lesson {
  id: string;
  concept_id: string;
  title: string;
  content: string;
  reading_time_mins: number;
  order_index: number;
}

export interface Question {
  id: string;
  concept_id: string;
  type: 'mcq' | 'reasoning' | 'scenario';
  prompt: string;
  options: string[];
  correct_answer?: string;
  explanation: string;
}

export interface LearnerMastery {
  id: string;
  user_id: string;
  concept_id: string;
  score: number;
  level: 'beginner' | 'developing' | 'proficient' | 'mastered';
  last_assessed_at: string;
}

export interface EvaluationResult {
  concept: string;
  score: number;
  confidence: number;
  understanding_level: string;
  correct_points: string[];
  missing_points: string[];
  misconceptions: Array<{ statement: string; explanation: string }>;
  feedback: string;
  recommended_action: string;
}