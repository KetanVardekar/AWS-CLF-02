/**
 * CLF-C02 content outline, from the official AWS exam guide:
 * https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html
 */

export interface Task {
  id: string;
  title: string;
  knowledge: string[];
  skills: string[];
}

export interface Domain {
  id: number;
  name: string;
  weight: number;
  /** Practice categories (see categories.ts) that cover this domain */
  categories: string[];
  tasks: Task[];
}

export const GUIDE_URL = 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html';

export const EXAM_FACTS: { label: string; value: string }[] = [
  { label: 'Questions', value: '65 (50 scored + 15 unscored)' },
  { label: 'Time', value: '90 minutes' },
  { label: 'Passing score', value: '700 / 1000' },
  { label: 'Question types', value: 'Multiple choice (1 correct of 4) and multiple response (2+ correct of 5+)' },
  { label: 'Scoring', value: 'Pass/fail overall; no penalty for guessing; unanswered = wrong' },
  { label: 'Cost', value: '100 USD (check the AWS site for your country)' },
];

export const OUT_OF_SCOPE = ['Coding', 'Designing cloud architecture', 'Troubleshooting', 'Implementation', 'Load and performance testing'];

export const DOMAINS: Domain[] = [
  {
    id: 1,
    name: 'Cloud Concepts',
    weight: 24,
    categories: ['concepts'],
    tasks: [
      {
        id: '1.1',
        title: 'Define the benefits of the AWS Cloud',
        knowledge: ['Value proposition of the AWS Cloud'],
        skills: [
          'Benefits of global infrastructure (speed of deployment, global reach)',
          'Advantages of high availability, elasticity, and agility',
        ],
      },
      {
        id: '1.2',
        title: 'Identify design principles of the AWS Cloud',
        knowledge: ['AWS Well-Architected Framework'],
        skills: [
          'The six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, sustainability',
          'Differences between the pillars',
        ],
      },
      {
        id: '1.3',
        title: 'Understand the benefits of and strategies for migration to the AWS Cloud',
        knowledge: ['Cloud adoption strategies', 'Resources to support the cloud migration journey'],
        skills: [
          'Components of the AWS Cloud Adoption Framework (AWS CAF): reduced business risk, improved ESG performance, increased revenue, increased operational efficiency',
          'Appropriate migration strategies (for example, database replication)',
        ],
      },
      {
        id: '1.4',
        title: 'Understand concepts of cloud economics',
        knowledge: ['Aspects of cloud economics', 'Cost savings of moving to the cloud'],
        skills: [
          'Fixed costs compared with variable costs',
          'Costs associated with on-premises environments',
          'Licensing strategies: Bring Your Own License (BYOL) vs included licenses',
          'Rightsizing',
          'Benefits of automation',
          'Economies of scale',
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Security and Compliance',
    weight: 30,
    categories: ['security'],
    tasks: [
      {
        id: '2.1',
        title: 'Understand the AWS shared responsibility model',
        knowledge: ['AWS shared responsibility model'],
        skills: [
          'Components of the shared responsibility model',
          'Customer responsibilities, AWS responsibilities, and shared responsibilities',
          'How responsibilities shift depending on the service (Amazon RDS, AWS Lambda, Amazon EC2)',
        ],
      },
      {
        id: '2.2',
        title: 'Understand AWS Cloud security, governance, and compliance concepts',
        knowledge: [
          'AWS compliance and governance concepts',
          'Benefits of cloud security (for example, encryption)',
          'Where to capture and locate security logs',
        ],
        skills: [
          'Where to find compliance information (AWS Artifact)',
          'Compliance needs across geographic locations and industries',
          'How customers secure resources (Amazon Inspector, AWS Security Hub, Amazon GuardDuty, AWS Shield)',
          'Encryption options: in transit and at rest',
          'Governance and compliance services: monitoring with CloudWatch; auditing with CloudTrail and AWS Config; access reports',
          'Compliance requirements that vary among AWS services',
        ],
      },
      {
        id: '2.3',
        title: 'Identify AWS access management capabilities',
        knowledge: [
          'Identity and access management (AWS IAM)',
          'Protecting the AWS root user account',
          'Principle of least privilege',
          'AWS IAM Identity Center',
        ],
        skills: [
          'Access keys, password policies, and credential storage (AWS Secrets Manager, AWS Systems Manager)',
          'Authentication methods: MFA, IAM Identity Center, cross-account IAM roles',
          'Groups, users, custom policies, and managed policies with least privilege',
          'Tasks only the root user can perform, and how to protect the root user',
          'Types of identity management (for example, federated)',
        ],
      },
      {
        id: '2.4',
        title: 'Identify components and resources for security',
        knowledge: ['Security capabilities AWS provides', 'Security documentation AWS provides'],
        skills: [
          'Security services: AWS WAF, AWS Firewall Manager, AWS Shield, Amazon GuardDuty',
          'Third-party security products in AWS Marketplace',
          'Where to find security information: AWS Knowledge Center, AWS Security Center, AWS Security Blog',
          'Using AWS Trusted Advisor to identify security issues',
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Cloud Technology and Services',
    weight: 34,
    categories: ['management', 'infra', 'compute', 'databases', 'migration', 'networking', 'storage', 'other'],
    tasks: [
      {
        id: '3.1',
        title: 'Define methods of deploying and operating in the AWS Cloud',
        knowledge: ['Ways of provisioning and operating in the AWS Cloud', 'Ways to access AWS services', 'Cloud deployment models'],
        skills: [
          'Programmatic access (APIs, SDKs, CLI) vs AWS Management Console vs infrastructure as code (IaC)',
          'One-time operations vs repeatable processes',
          'Deployment models: cloud, hybrid, on-premises',
        ],
      },
      {
        id: '3.2',
        title: 'Define the AWS global infrastructure',
        knowledge: ['Regions, Availability Zones, and edge locations', 'High availability', 'Use of multiple Regions', 'Benefits of edge locations'],
        skills: [
          'Relationships among Regions, Availability Zones, and edge locations',
          'High availability with multiple Availability Zones (AZs share no single point of failure)',
          'When to use multiple Regions: disaster recovery, business continuity, low latency, data sovereignty',
        ],
      },
      {
        id: '3.3',
        title: 'Identify AWS compute services',
        knowledge: ['AWS compute services'],
        skills: [
          'EC2 instance types (compute optimized, storage optimized, …)',
          'Container options: Amazon ECS, Amazon EKS',
          'Serverless compute: AWS Fargate, AWS Lambda',
          'Auto scaling provides elasticity',
          'Purposes of load balancers',
        ],
      },
      {
        id: '3.4',
        title: 'Identify AWS database services',
        knowledge: ['AWS database services', 'Database migration'],
        skills: [
          'EC2-hosted databases vs AWS managed databases',
          'Relational: Amazon RDS, Amazon Aurora',
          'NoSQL: Amazon DynamoDB',
          'In-memory: Amazon ElastiCache',
          'Migration tools: AWS DMS, AWS Schema Conversion Tool (SCT)',
        ],
      },
      {
        id: '3.5',
        title: 'Identify AWS network services',
        knowledge: ['AWS network services'],
        skills: [
          'VPC components: subnets, gateways',
          'VPC security: network ACLs, security groups, Amazon Inspector',
          'Purpose of Amazon Route 53',
          'Connectivity to AWS: AWS VPN, AWS Direct Connect',
        ],
      },
      {
        id: '3.6',
        title: 'Identify AWS storage services',
        knowledge: ['AWS storage services'],
        skills: [
          'Uses for object storage and the Amazon S3 storage classes',
          'Block storage: Amazon EBS, instance store',
          'File services: Amazon EFS, Amazon FSx',
          'Cached file systems: AWS Storage Gateway',
          'Lifecycle policies and AWS Backup use cases',
        ],
      },
      {
        id: '3.7',
        title: 'Identify AWS AI/ML services and analytics services',
        knowledge: ['AWS AI/ML services', 'AWS analytics services'],
        skills: [
          'AI/ML services and their tasks (Amazon SageMaker AI, Amazon Lex, …)',
          'Analytics: Amazon Athena, Amazon Kinesis, AWS Glue, Amazon Quick Sight',
        ],
      },
      {
        id: '3.8',
        title: 'Identify services from other in-scope AWS service categories',
        knowledge: [
          'Application integration: Amazon EventBridge, Amazon SNS, Amazon SQS',
          'Business applications: Amazon Connect, Amazon SES',
          'Customer enablement: AWS Support',
          'Developer tools: AWS CodeBuild, AWS CodePipeline, AWS X-Ray',
          'End-user computing: Amazon AppStream 2.0, Amazon WorkSpaces, WorkSpaces Secure Browser',
          'Frontend web and mobile: AWS Amplify',
          'IoT: AWS IoT Core',
        ],
        skills: [
          'Choosing a service to deliver messages, alerts, and notifications',
          'Choosing services for business application needs and business support',
          'Tools to develop, deploy, and troubleshoot applications',
          'Services that stream virtual desktops to end users',
          'Services to build frontend/mobile apps and manage IoT devices',
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Billing, Pricing, and Support',
    weight: 12,
    categories: ['billing', 'support'],
    tasks: [
      {
        id: '4.1',
        title: 'Compare AWS pricing models',
        knowledge: [
          'Compute purchasing options: On-Demand, Reserved Instances, Spot Instances, Savings Plans, Dedicated Hosts, Dedicated Instances, Capacity Reservations',
          'Storage options and tiers',
        ],
        skills: [
          'When to use each compute purchasing option',
          'Reserved Instance flexibility and behavior in AWS Organizations',
          'Incoming vs outgoing data transfer costs (between Regions, within a Region)',
          'Pricing for storage options and tiers',
        ],
      },
      {
        id: '4.2',
        title: 'Understand resources for billing, budget, and cost management',
        knowledge: ['Billing support and information', 'Pricing information for AWS services', 'AWS Organizations', 'AWS cost allocation tags'],
        skills: [
          'Uses of AWS Budgets and AWS Cost Explorer',
          'Uses of AWS Pricing Calculator',
          'AWS Organizations consolidated billing and cost allocation',
          'Cost allocation tags and billing reports (AWS Cost and Usage Report)',
        ],
      },
      {
        id: '4.3',
        title: 'Identify AWS technical resources and AWS Support options',
        knowledge: ['Documentation on official AWS websites', 'AWS Support plans', 'AWS Partner Network (ISVs, system integrators)', 'AWS Support Center'],
        skills: [
          'Locating whitepapers, blogs, and documentation',
          'Technical resources: AWS Prescriptive Guidance, AWS Knowledge Center, AWS re:Post',
          'Support options: customer service and communities, Basic Support, AWS Business Support+, AWS Enterprise Support, AWS Unified Operations',
          'Trusted Advisor, AWS Health Dashboard, and AWS Health API for monitoring and cost optimization',
          'AWS Trust and Safety team for reporting abuse',
          'AWS Partners and Marketplace, and the benefits of being a partner',
          'Technical assistance: AWS Professional Services, AWS solutions architects',
        ],
      },
    ],
  },
];
