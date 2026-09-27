/** Practice categories (kept separate so pages can list them without loading every question). */
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
