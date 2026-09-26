export type TopicId =
  | 'cloud-concepts' | 'global-infra' | 'iam-security' | 'shared-responsibility'
  | 'compute' | 'ec2-pricing' | 'scaling-lb' | 'storage' | 'databases'
  | 'networking' | 'route53-cloudfront' | 'monitoring' | 'migration'
  | 'serverless' | 'containers' | 'integration' | 'analytics' | 'ai-ml'
  | 'organizations' | 'billing' | 'support' | 'well-architected'
  | 'high-availability' | 'scalability' | 'reliability' | 'disaster-recovery';

export interface Topic {
  id: TopicId;
  name: string;
  emoji: string;
  /** CSS color (hex) used to tint topic cards and chips */
  color: string;
  blurb: string;
}

/** One trigger mapping: Keyword → Think of → Meaning */
export interface KeywordEntry {
  id: string;
  topic: TopicId;
  /** The exam wording / trigger phrase */
  keyword: string;
  /** The AWS service or concept to think of */
  thinkOf: string;
  /** One-line answer / meaning */
  meaning: string;
  /** Short "why" for the keyword popup */
  why?: string;
  /** Memory hook, e.g. "Private subnet → NAT → Internet" */
  hook?: string;
  /** Services commonly confused with this one */
  confuseWith?: string[];
  /** Explanation of the trap */
  trap?: string;
  /** Extra search terms / synonyms */
  synonyms?: string[];
  /** Include on the Final Master Sheet / Trap Detector */
  master?: boolean;
  examTrap?: boolean;
}

/** A practice exam converted from the source markdown by scripts/build-exams.mjs */
export interface ExamQuestion {
  question: string;
  options: string[];
  /** Indexes into options; more than one means multiple response */
  answer: number[];
  /** Optional reference link from the source */
  link: string;
  /** Optional one-line "why" shown after answering */
  explanation?: string;
}

export interface Exam {
  id: number;
  title: string;
  questions: ExamQuestion[];
}
