import type { Topic } from './types';

export const TOPICS: Topic[] = [
  { id: 'cloud-concepts', name: 'Cloud Concepts', emoji: '☁️', color: '#38BDF8', blurb: 'Cloud benefits, service models, deployment models, and CAF.' },
  { id: 'global-infra', name: 'AWS Global Infrastructure', emoji: '🌎', color: '#22C55E', blurb: 'Regions, Availability Zones, edge locations, and hybrid options.' },
  { id: 'iam-security', name: 'IAM & Security', emoji: '🔐', color: '#EF4444', blurb: 'Identity, access control, threat detection, and encryption services.' },
  { id: 'shared-responsibility', name: 'Shared Responsibility Model', emoji: '🛡️', color: '#F97316', blurb: 'Who secures what: AWS versus the customer.' },
  { id: 'compute', name: 'EC2 & Compute', emoji: '💻', color: '#F59E0B', blurb: 'Virtual servers, tenancy options, images, and simple compute.' },
  { id: 'ec2-pricing', name: 'EC2 Pricing', emoji: '💰', color: '#EAB308', blurb: 'On-Demand, Reserved, Spot, Savings Plans, and Dedicated options.' },
  { id: 'scaling-lb', name: 'Auto Scaling & Load Balancing', emoji: '📈', color: '#84CC16', blurb: 'Auto Scaling groups and ALB, NLB, GWLB load balancers.' },
  { id: 'storage', name: 'S3 & Storage', emoji: '💾', color: '#10B981', blurb: 'Object, block, file, archive, and hybrid storage.' },
  { id: 'databases', name: 'Databases', emoji: '🗄️', color: '#14B8A6', blurb: 'Relational, NoSQL, caching, graph, and data warehouse.' },
  { id: 'networking', name: 'Networking & VPC', emoji: '🌐', color: '#06B6D4', blurb: 'VPCs, subnets, gateways, firewalls, and hybrid connectivity.' },
  { id: 'route53-cloudfront', name: 'Route 53 & CloudFront', emoji: '🚦', color: '#0EA5E9', blurb: 'DNS, traffic routing, and global content delivery.' },
  { id: 'monitoring', name: 'Monitoring & Management', emoji: '📊', color: '#3B82F6', blurb: 'Metrics, auditing, configuration tracking, and operations tooling.' },
  { id: 'migration', name: 'Migration & Data Transfer', emoji: '🚚', color: '#6366F1', blurb: 'Moving servers, databases, and data into AWS.' },
  { id: 'serverless', name: 'Serverless', emoji: '⚡', color: '#FACC15', blurb: 'Run apps without provisioning or managing servers.' },
  { id: 'containers', name: 'Containers', emoji: '📦', color: '#8B5CF6', blurb: 'ECS, EKS, Fargate, ECR, and App Runner.' },
  { id: 'integration', name: 'Application Integration', emoji: '🔗', color: '#A855F7', blurb: 'Queues, notifications, events, workflows, and APIs.' },
  { id: 'analytics', name: 'Analytics', emoji: '📈', color: '#D946EF', blurb: 'Query, stream, transform, and visualize data.' },
  { id: 'ai-ml', name: 'AI/ML', emoji: '🤖', color: '#EC4899', blurb: 'Managed AI services, SageMaker, and generative AI.' },
  { id: 'organizations', name: 'AWS Organizations', emoji: '🏢', color: '#F43F5E', blurb: 'Multi-account management, SCPs, and consolidated billing.' },
  { id: 'billing', name: 'Billing & Cost Management', emoji: '💵', color: '#65A30D', blurb: 'Estimate, track, analyze, and control AWS costs.' },
  { id: 'support', name: 'AWS Support Plans', emoji: '🎧', color: '#0D9488', blurb: 'Support tiers, response times, TAMs, and help resources.' },
  { id: 'well-architected', name: 'Well-Architected Framework', emoji: '🏗️', color: '#C2410C', blurb: 'Six pillars for building good cloud architectures.' },
  { id: 'high-availability', name: 'High Availability', emoji: '🟢', color: '#16A34A', blurb: 'Minimize downtime by spreading across AZs.' },
  { id: 'scalability', name: 'Scalability & Elasticity', emoji: '📈', color: '#2563EB', blurb: 'Grow with demand and shrink automatically when idle.' },
  { id: 'reliability', name: 'Reliability & Fault Tolerance', emoji: '🛡️', color: '#7C3AED', blurb: 'Recover from failures and keep running through them.' },
  { id: 'disaster-recovery', name: 'Disaster Recovery', emoji: '🚨', color: '#DC2626', blurb: 'DR strategies, RPO, and RTO.' },
];

export const topicById = Object.fromEntries(TOPICS.map(t => [t.id, t])) as Record<Topic['id'], Topic>;

/**
 * Where each cheat-sheet topic sits in the official CLF-C02 syllabus
 * (domain + task statements, see syllabus.ts). Order here = display order.
 */
export const TOPIC_SYLLABUS: { topic: Topic['id']; domain: 1 | 2 | 3 | 4; tasks: string[] }[] = [
  { topic: 'cloud-concepts', domain: 1, tasks: ['1.1', '1.4'] },
  { topic: 'high-availability', domain: 1, tasks: ['1.1'] },
  { topic: 'scalability', domain: 1, tasks: ['1.1'] },
  { topic: 'well-architected', domain: 1, tasks: ['1.2'] },
  { topic: 'reliability', domain: 1, tasks: ['1.2'] },
  { topic: 'shared-responsibility', domain: 2, tasks: ['2.1'] },
  { topic: 'iam-security', domain: 2, tasks: ['2.2', '2.3', '2.4'] },
  { topic: 'monitoring', domain: 3, tasks: ['3.1', '2.2'] },
  { topic: 'global-infra', domain: 3, tasks: ['3.2'] },
  { topic: 'disaster-recovery', domain: 3, tasks: ['3.2'] },
  { topic: 'compute', domain: 3, tasks: ['3.3'] },
  { topic: 'scaling-lb', domain: 3, tasks: ['3.3'] },
  { topic: 'serverless', domain: 3, tasks: ['3.3'] },
  { topic: 'containers', domain: 3, tasks: ['3.3'] },
  { topic: 'databases', domain: 3, tasks: ['3.4'] },
  { topic: 'migration', domain: 3, tasks: ['3.4', '1.3'] },
  { topic: 'networking', domain: 3, tasks: ['3.5'] },
  { topic: 'route53-cloudfront', domain: 3, tasks: ['3.5'] },
  { topic: 'storage', domain: 3, tasks: ['3.6'] },
  { topic: 'analytics', domain: 3, tasks: ['3.7'] },
  { topic: 'ai-ml', domain: 3, tasks: ['3.7'] },
  { topic: 'integration', domain: 3, tasks: ['3.8'] },
  { topic: 'ec2-pricing', domain: 4, tasks: ['4.1'] },
  { topic: 'billing', domain: 4, tasks: ['4.2'] },
  { topic: 'organizations', domain: 4, tasks: ['4.2'] },
  { topic: 'support', domain: 4, tasks: ['4.3'] },
];
