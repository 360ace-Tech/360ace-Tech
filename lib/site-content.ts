export const company = {
  name: '360ace.Tech',
  tagline: 'Cloud Native Engineers & Reliability Partners',
  summary:
    'We accelerate product teams with cloud native architectures, DevOps automation, and platform excellence tailored for regulated, high-growth businesses.',
  contactEmail: '360ace@360ace.tech',
};

export const heroContent = {
  eyebrow: 'Cloud Native. AI ready. Human centred.',
  title: 'Build resilient GLOBAL digital products that scale with confidence.',
  description:
    'We help ambitious teams design, ship, and operate modern software and AI workloads with battle-tested DevOps, site reliability, and platform engineering practices.',
  primaryCta: { label: 'Book a discovery call', href: '#contact' },
  secondaryCta: { label: 'Explore our playbooks', href: '#services' },
  stats: [
    { label: 'Cloud launches', value: '80+' },
    { label: 'Avg. release cadence boost', value: '4×' },
    { label: 'Availability target achieved', value: '99.95%' },
  ],
};

export const services = [
  {
    name: 'Cloud Strategy & Architecture',
    summary:
      'Assess, design, and optimise cloud foundations that unlock innovation without sacrificing governance.',
    outcomes: [
      'Platform assessments, roadmaps, and ROI modelling',
      'Landing zones, security baselines, and network architectures',
      'FinOps guardrails with right-sized infrastructure blueprints',
    ],
  },
  {
    name: 'Platform Engineering & DevOps',
    summary:
      'Modernise delivery with golden paths, GitOps, and automated quality gates tuned to your stack.',
    outcomes: [
      'CI/CD pipelines, IaC modules, and compliance-as-code',
      'Developer portals, templates, and paved paths',
      'Observability, chaos testing, and SLO-driven operations',
    ],
  },
  {
    name: 'Site Reliability & Managed Ops',
    summary:
      'Operate critical workloads with proactive reliability engineering and shared on-call ownership.',
    outcomes: [
      'SRE onboarding, playbooks, and platform health dashboards',
      '24/7 monitoring, incident response, and blameless reviews',
      'Cost, performance, and resilience optimisation sprints',
    ],
  },
  {
    name: 'AI & Data Platform Enablement',
    summary:
      'Prepare your teams for intelligent products with secure data pipelines, feature stores, and ML operations.',
    outcomes: [
      'Modern data lakehouse and governance architectures',
      'Real-time streaming and event-driven integrations',
      'MLOps workflows with automated evaluation and rollout',
    ],
  },
];

export const process = [
  {
    id: '01',
    title: 'Plan',
    heading: 'Discover what matters most',
    description:
      'We co-create the vision, map dependencies, and align success measures so every sprint delivers business value.',
  },
  {
    id: '02',
    title: 'Design',
    heading: 'Blueprint cloud-native experiences',
    description:
      'Product, platform, and security leaders collaborate on service blueprints, architecture decision records, and experience maps.',
  },
  {
    id: '03',
    title: 'Build',
    heading: 'Ship with proven engineering playbooks',
    description:
      'Our multi-disciplinary squads pair with your teams to deliver reusable infrastructure, composable UIs, and automated quality gates.',
  },
  {
    id: '04',
    title: 'Run',
    heading: 'Operate, learn, and scale reliably',
    description:
      'Shared SRE ceremonies, real-time observability, and resilience testing keep platforms healthy long after launch.',
  },
];

export const differentiators = [
  {
    title: 'Reliability you can measure',
    description:
      'SLOs, error budgets, and actionable observability drive decisions. We commit to availability and recovery targets that align with your SLAs.',
  },
  {
    title: 'Paved paths for developer velocity',
    description:
      'Golden paths, reusable templates, and GitOps-based delivery reduce lead time and cognitive load so teams ship faster with confidence.',
  },
  {
    title: 'Security and compliance by design',
    description:
      'Landing zones, policy-as-code, and automated controls meet regulatory needs (SOC2, ISO 27001, PCI, HIPAA) without slowing delivery.',
  },
];

export const testimonials = [
  {
    quote:
      '360ace.Tech gave us the platform foundations, delivery rituals, and observability we needed to scale confidently across three regions.',
    name: 'Amelia Lawson',
    role: 'CTO, Fintech expansion stealth',
  },
  {
    quote:
      'Their SRE playbooks halved our mean time to recovery while unlocking faster product iteration with guardrails in place.',
    name: 'Marcus Adeyemi',
    role: 'Head of Engineering, Cloud Commerce',
  },
];

export const callToAction = {
  headline: 'Ready to modernise your platform?',
  copy:
    'Let’s explore how cloud native tooling, AI-ready architectures, and reliable operations can unlock your next growth chapter.',
  primaryCta: { label: 'Schedule strategy session', href: '/contact' },
  secondaryCta: { label: 'Download compatibility check', href: '/downloads/compatibility-check' },
};

// Footer content used inside the mobile menu overlay. Edit here to update the
// labels and links shown at the bottom of the menu.
export const menuFooter = {
  // Resources list shown in the menu footer
  resources: [
    { label: 'insights', href: '/#insights' },
    { label: 'blogs', href: '/blog' },
  ],
  stack: 'Terraform · Cloud · AI · DevOps · SRE',
  links: [
    { label: 'privacy', href: '/legal/privacy' },
    { label: 'terms', href: '/legal/terms' },
    { label: 'close', href: '#' },
  ],
};

// Legal page templates (edit text here)
export const legalPrivacy = {
  title: 'Privacy Policy',
  lastUpdated: 'July 11, 2026',
  intro:
    'This Privacy Policy explains how 360ace.Tech collects, uses, discloses, retains, and protects personal information when you visit our website, contact us, or discuss cloud, platform engineering, DevOps, SRE, AI, and reliability services with us.',
  sections: [
    {
      heading: 'Who We Are and Scope',
      body: [
        '360ace.Tech is responsible for the personal information it handles through this website and related business communications. This Policy does not replace any privacy, security, confidentiality, data processing, or professional services terms in a signed agreement with a client.',
        'This website is intended for business visitors, prospects, clients, partners, and job or collaboration inquiries. It is not directed to children, and we do not knowingly collect personal information from children.',
      ],
    },
    {
      heading: 'Personal Information We Collect',
      body: [
        'Information you provide directly, such as your name, business email address, phone number, company, role, message content, project details, and preferences when you submit a form, email us, book a call, or otherwise communicate with us.',
        'Website and device information, such as IP address, approximate location, browser and device details, referring pages, pages viewed, timestamps, and interaction data collected through server logs, security tools, cookies, and analytics.',
        'Business and engagement information, such as discovery notes, requirements, architecture context, technical constraints, procurement details, invoices, and support communications shared during scoping or delivery.',
        'Security and anti-abuse information, including Cloudflare Turnstile signals, form timing, spam-prevention data, and logs used to protect the website and contact channels.',
      ],
    },
    {
      heading: 'How We Use Information',
      body: [
        'To respond to inquiries, schedule calls, prepare proposals, and communicate about services you requested or expressed interest in.',
        'To operate, secure, debug, measure, and improve the website, forms, analytics, and communications.',
        'To scope, deliver, manage, invoice, and support client engagements under the applicable agreement.',
        'To prevent spam, abuse, fraud, security incidents, and unauthorized access.',
        'To comply with legal, accounting, tax, regulatory, insurance, and dispute-resolution obligations, and to enforce our agreements and website terms.',
      ],
    },
    {
      heading: 'Legal Bases and Consent',
      body: [
        'Where applicable law requires a legal basis, we rely on one or more of the following: your consent, performance of a contract or steps before entering a contract, our legitimate interests in operating and securing a business website and responding to business inquiries, and compliance with legal obligations.',
        'Where consent is required, you may withdraw it at any time, subject to legal or contractual limits. Withdrawing consent does not affect processing that occurred before withdrawal.',
      ],
    },
    {
      heading: 'Cookies, Analytics, and Security Tools',
      body: [
        'We use cookies, local storage, pixels, server logs, and similar technologies for site operation, security, analytics, and preference management. Your browser or device settings may let you block or delete some of these technologies, but parts of the site may not work as intended.',
        'Our website may use providers such as Google Analytics for usage measurement, Cloudflare Turnstile for spam and bot prevention, MailerSend for contact-form email delivery, hosting/CDN providers, and other operational vendors. These providers process information for us or as described in their own terms and policies.',
        'We do not sell personal information. We do not share personal information for cross-context behavioural advertising as that term is commonly used under California privacy law.',
      ],
    },
    {
      heading: 'When We Disclose Information',
      body: [
        'We may disclose information to service providers, professional advisors, payment or accounting providers, security and hosting vendors, analytics providers, and communication tools that help us run our business.',
        'We may disclose information if required by law, court order, regulatory request, or to protect rights, safety, security, and the integrity of our services.',
        'If 360ace.Tech is involved in a merger, acquisition, financing, restructuring, or sale of assets, information may be disclosed as part of that transaction subject to appropriate safeguards.',
      ],
    },
    {
      heading: 'Retention and Safeguards',
      body: [
        'We retain personal information only as long as reasonably necessary for the purposes described in this Policy, for the period required by an applicable contract, or as needed for legal, tax, accounting, security, backup, or dispute purposes.',
        'We use administrative, technical, and organizational safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, and disclosure. No internet or storage system is completely secure, so we cannot guarantee absolute security.',
      ],
    },
    {
      heading: 'International Processing',
      body: [
        'We may process and store information in Canada, the United States, and other countries where we or our service providers operate. Those countries may have privacy laws different from those in your jurisdiction.',
        'When required, we use contractual, technical, and organizational measures intended to protect personal information transferred across borders.',
      ],
    },
    {
      heading: 'Your Rights and Choices',
      body: [
        'Depending on where you live, you may have rights to access, correct, update, delete, restrict, object to, or receive a copy of your personal information. You may also have the right to withdraw consent or complain to a privacy regulator.',
        'California, Colorado, Connecticut, Virginia, Utah, Oregon, Texas, Montana, Delaware, Iowa, Nebraska, New Hampshire, New Jersey, Tennessee, Minnesota, Maryland, Indiana, Kentucky, Rhode Island, and other U.S. state residents may have specific privacy rights if an applicable state law applies to us. We will respond to verifiable requests as required by applicable law.',
        'EU, UK, and similar-region visitors may have rights under applicable data protection laws, including rights to information, access, correction, deletion, restriction, objection, portability, and complaint to a supervisory authority.',
        'To exercise rights, contact us at 360ace@360ace.tech. We may need to verify your identity and may decline or limit a request where permitted or required by law.',
      ],
    },
    {
      heading: 'Updates and Contact',
      body: [
        'We may update this Policy from time to time. Material updates will be reflected by changing the Last updated date and, where appropriate, by providing additional notice.',
        'For privacy questions or requests, contact 360ace.Tech at 360ace@360ace.tech or through the contact section of our site.',
      ],
    },
  ],
};

export const legalTerms = {
  title: 'Terms of Service',
  lastUpdated: 'July 11, 2026',
  intro:
    'These Terms of Service govern your use of the 360ace.Tech website. Separate written agreements, proposals, statements of work, master services agreements, data processing terms, or order forms govern any paid professional services unless they expressly say otherwise.',
  sections: [
    {
      heading: 'Acceptance and Website Use',
      body: [
        'By accessing or using this website, you agree to these Terms. If you do not agree, do not use the website.',
        'You may use the website only for lawful business or informational purposes. You must not interfere with the website, attempt unauthorized access, scrape at unreasonable volume, introduce malware, bypass security controls, or use the site in a way that harms us, other users, or our service providers.',
      ],
    },
    {
      heading: 'Information Only; No Professional Advice',
      body: [
        'Website content is provided for general information about cloud, platform engineering, DevOps, SRE, AI, and reliability services. It is not legal, financial, security, compliance, or other professional advice.',
        'You are responsible for evaluating whether information on the site is appropriate for your circumstances before relying on it.',
      ],
    },
    {
      heading: 'Professional Services',
      body: [
        'Discussions, discovery calls, proposals, estimates, and website materials do not create a services engagement unless and until the parties sign or otherwise accept a written agreement.',
        'If there is a conflict between these Terms and a signed agreement for services, the signed agreement controls for the services covered by that agreement.',
      ],
    },
    {
      heading: 'Intellectual Property',
      body: [
        'The website, branding, copy, graphics, code, design, downloads, and other materials we publish are owned by 360ace.Tech or its licensors and are protected by intellectual property laws.',
        'You may view and use website content for internal evaluation of our services. You may not copy, modify, distribute, sell, or create derivative works from our site materials except as allowed by law or with our written permission.',
        'Client deliverables, pre-existing materials, open-source components, feedback, and work product created under a services agreement are governed by that agreement.',
      ],
    },
    {
      heading: 'Confidentiality and Submitted Materials',
      body: [
        'Do not submit confidential, regulated, sensitive, production credentials, secrets, or proprietary technical materials through public website forms. Use approved project channels once an engagement is in place.',
        'Information submitted through the website is handled under our Privacy Policy. Confidentiality obligations for client materials apply only as stated in a signed agreement or other written commitment.',
      ],
    },
    {
      heading: 'Third-Party Services and Links',
      body: [
        'The website may use or link to third-party services, including analytics, hosting, security, email, scheduling, downloads, and external resources. We are not responsible for third-party websites, services, terms, policies, or content.',
      ],
    },
    {
      heading: 'Availability and Changes',
      body: [
        'We may update, suspend, restrict, or discontinue any part of the website at any time without notice. We do not guarantee that the website will be uninterrupted, error-free, secure, or available in every location.',
      ],
    },
    {
      heading: 'Disclaimers and Limitation of Liability',
      body: [
        'The website is provided on an as-is and as-available basis. To the maximum extent permitted by law, we disclaim all warranties, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, and availability.',
        'To the maximum extent permitted by law, 360ace.Tech will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost revenue, lost data, business interruption, or loss of goodwill arising from or related to website use.',
        'Nothing in these Terms limits liability that cannot be limited under applicable law.',
      ],
    },
    {
      heading: 'Indemnity',
      body: [
        'You agree to defend, indemnify, and hold harmless 360ace.Tech from claims, damages, liabilities, costs, and expenses arising from your misuse of the website, violation of these Terms, or violation of applicable law or third-party rights.',
      ],
    },
    {
      heading: 'Governing Law and Disputes',
      body: [
        'Unless a written agreement says otherwise or applicable law requires a different rule, these Terms and disputes relating to the website are governed by the laws of the Province of Alberta and the federal laws of Canada applicable there, without regard to conflict-of-law rules.',
        'The parties will first try to resolve disputes informally and in good faith. If a dispute cannot be resolved, it may be brought in the courts with jurisdiction under applicable law.',
      ],
    },
    {
      heading: 'Changes',
      body: [
        'We may update these Terms from time to time. Material changes will be reflected by updating the Last updated date. Continued use of the website after an update means you accept the updated Terms.',
      ],
    },
    {
      heading: 'Contact',
      body: [
        'Questions about these Terms may be sent to 360ace@360ace.tech or through the contact section of our site.',
      ],
    },
  ],
};
