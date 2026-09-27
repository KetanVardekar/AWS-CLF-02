import type { ExamQuestion } from './types';
import { EXAMS } from './exams';
import categoryMap from './question-categories.json';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: 'billing', name: 'Billing & Pricing', emoji: '💰', blurb: 'Pricing models, Cost Explorer, Budgets, Pricing Calculator, consolidated billing' },
  { id: 'support', name: 'Support & Partners', emoji: '🎧', blurb: 'Support plans, TAM, AWS Partner Network, Marketplace, Professional Services' },
  { id: 'security', name: 'Security & Compliance', emoji: '🔐', blurb: 'Shared responsibility, IAM, encryption, Shield, WAF, GuardDuty, Artifact' },
  { id: 'concepts', name: 'Cloud Concepts', emoji: '☁️', blurb: 'Cloud benefits, deployment models, Well-Architected, CAF, migration strategies' },
  { id: 'infra', name: 'Global Infrastructure', emoji: '🌎', blurb: 'Regions, Availability Zones, edge locations, Local Zones, Outposts' },
  { id: 'compute', name: 'Compute', emoji: '💻', blurb: 'EC2, Lambda, containers, Elastic Beanstalk, Auto Scaling, load balancing' },
  { id: 'storage', name: 'Storage', emoji: '💾', blurb: 'S3 and storage classes, EBS, EFS, Glacier, Storage Gateway, Backup' },
  { id: 'databases', name: 'Databases', emoji: '🗄️', blurb: 'RDS, Aurora, DynamoDB, Redshift, ElastiCache, Neptune' },
  { id: 'networking', name: 'Networking & Content Delivery', emoji: '🌐', blurb: 'VPC, subnets, gateways, Route 53, CloudFront, Direct Connect, VPN' },
  { id: 'management', name: 'Management & Monitoring', emoji: '📊', blurb: 'CloudWatch, CloudTrail, Config, CloudFormation, Trusted Advisor, Organizations' },
  { id: 'migration', name: 'Migration & Transfer', emoji: '🚚', blurb: 'Snow family, DataSync, DMS, Application Migration Service' },
  { id: 'other', name: 'Analytics, AI & Other', emoji: '🤖', blurb: 'Athena, Kinesis, Glue, SageMaker, SQS/SNS, developer tools' },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Stable id from the question text, so regenerating exams.json keeps categories. */
export function questionKey(q: ExamQuestion): string {
  const text = norm(q.question) + '|' + norm(q.options.join('|'));
  let h = 0x811c9dc5;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

const MAP = categoryMap as Record<string, string>;

/** Unique questions per category (the same question can appear in several exams). */
export const QUESTIONS_BY_CATEGORY: Record<string, ExamQuestion[]> = (() => {
  const out: Record<string, ExamQuestion[]> = Object.fromEntries(CATEGORIES.map((c) => [c.id, []]));
  const seen = new Set<string>();
  for (const exam of EXAMS) {
    for (const q of exam.questions) {
      const key = questionKey(q);
      if (seen.has(key)) continue;
      seen.add(key);
      out[MAP[key] ?? 'other'].push(q);
    }
  }
  return out;
})();
