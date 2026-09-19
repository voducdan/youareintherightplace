// Portfolio data, reconciled against VODUCDAN-SENIOR_DATA_ENGINEER.pdf
// Every claim here traces to a line in that CV. Where the CV is silent, this file is silent.

export const portfolioData = {
  personal: {
    name: 'Vo Duc Dan',
    title: 'Senior Data Engineer',
    email: 'voducdand99@gmail.com',
    phone: '0972184325',
    location: 'Binh Thanh district, Ho Chi Minh city',
    website: 'https://voducdan.github.io/youareintherightplace/',
    github: 'https://github.com/voducdan',
    language: 'Fluent in English',
    summary:
      'Senior Data Engineer, 5+ years building production data systems and the analytical products that sit on top of them. I turn ambiguous business requirements into architectures that hold under load — SQL, Python, dbt, ClickHouse, Airflow — and lately into data surfaces that LLM agents can query safely.',
  },

  // Headline numbers, all sourced from the CV. Rendered in the header strip.
  highlights: [
    { value: '5+', label: 'Years' },
    { value: '3,000+', label: 'DAGs operated' },
    { value: '< 15s', label: 'P90 DAG sync' },
    { value: '1d → 5m', label: 'Report freshness' },
    { value: '4', label: 'Certifications' },
  ],

  education: [
    {
      id: 'edu-1',
      institution: 'HCM University of Science',
      degree: 'Bachelor Information Technology',
      field: 'Information Technology',
      year: '8/2017 - 10/2021',
      status: 'success',
      details: 'Bachelor degree in Information Technology',
    },
  ],

  experience: [
    {
      id: 'exp-convincely',
      company: 'Convincely',
      position: 'Senior Data Engineer',
      duration: '7/2025 - now',
      status: 'running',
      responsibilities: [
        'Designed and built the ClickHouse analytics warehouse behind a customer experience and experimentation platform. Streamed events from Snowplow and Postgres through staging, identity resolution, and dimensional modeling. Owned the schema migration CI/CD pipeline (Atlas and golang-migrate on GitHub Actions)',
        'Architected and authored PickedQL, an AST-based SQL rewriting and semantic layer giving analysts, Metabase, and LLM agents safe self-serve access to ClickHouse. Authored the governing architecture decision record and the customer-facing documentation',
        'Engineered LLM and RAG data pipelines for an AI health insurance advisory product: chunked a policy document corpus into Meilisearch, and built deterministic extraction pipelines with strict JSON schemas, and verbatim-quote verification',
        'Developed on-demand agent skills for the AI advisory product, authored as progressive-disclosure playbooks loaded at runtime, validated through an eval suite with custom scorers and Langfuse experiments',
      ],
      technologies: ['ClickHouse', 'Postgres', 'AWS', 'Terraform', 'Metabase', 'Meilisearch', 'TypeScript', 'LLM/RAG'],
    },
    {
      id: 'exp-momo',
      company: 'MoMo',
      position: 'Data Engineer',
      duration: '7/2022 - 7/2025',
      status: 'success',
      responsibilities: [
        'Deploy and manage GCP and Kubernetes resources using Infrastructure as Code (Pulumi). Set up CI pipelines with GitLab Runner and Jenkins to test and sync DAG code from GitLab to Airflow, and to build Docker images for Spark ingestion jobs',
        'Operated and scaled Airflow on Kubernetes to serve over 3,000 DAGs. Guarantee DAG files are updated and reflected on the Airflow UI with a P90 latency of less than 15 seconds. Leverage Airflow features such as Pools, Queues, Priority Weights, and Cluster Policies to optimize resource utilization and isolate workloads across multiple teams',
        'Developed a tool to support batch ingestion from various data sources. Took part in all stages of the development lifecycle, including ideation, coding, and infrastructure setup. Implemented solutions such as Kubernetes Admission Control and secret management to monitor and secure data ingestion jobs, ensuring data security and access control',
        'Proposed and implemented a new solution to increase the report update frequency for critical requests by setting up ClickHouse Kafka Connect to stream data into ClickHouse. Leveraged ClickHouse features such as the ReplacingMergeTree engine, materialized views, and function combinators to perform pre-aggregation, significantly reducing the load on transformation processes and dashboard queries',
      ],
      technologies: ['GCP', 'Kubernetes', 'Spark', 'Airflow', 'ClickHouse'],
    },
    {
      id: 'exp-amanotes',
      company: 'Amanotes',
      position: 'Data Engineer',
      duration: '6/2021 - 7/2022',
      status: 'success',
      responsibilities: [
        'Investigated, built, and maintained advanced pipelines handling large volumes of gaming event data using distributed processing on Google Cloud. Designed and implemented a data lake on Google Cloud Storage to store raw event data at scale',
        'Designed the data model for each step of the ETL process, from raw to mart layer, to achieve the best pipeline performance and provide clean, useful datasets for the DA and DS teams. Applied DBT to transform raw Firebase event data into structured analytical models, and optimized legacy SQL to reduce Google BigQuery cost and data latency',
        'Architected ingestion pipelines to crawl and pull data from partner APIs and dashboards, including AppsFlyer, IronSource, and Mintegral, then transformed and loaded it into the data warehouse to enrich attribution, monetization, and product funnel analysis',
        'Built and updated Docker images for running Airflow on Google Cloud Composer, and built a CI/CD flow with Google Cloud Build to deploy DAG code automatically on every change',
        'Built a monitoring system with a dashboard surfacing failed Airflow tasks and Slack alerting to notify the team on failure. Maintained and delivered new features for the internal A/B testing web application',
        'Gathered business requirements from product owners and translated ambiguous stakeholder needs into technical specifications for game performance tracking, visualizing data on Metabase and Google Data Studio to give them the best insight into their products',
      ],
      technologies: ['Python', 'GCP', 'Airflow', 'DBT', 'Docker', 'Metabase'],
    },
    {
      id: 'exp-fpt',
      company: 'FPT Software',
      position: 'Data Engineer',
      duration: '1/2021 - 7/2021',
      status: 'success',
      responsibilities: [
        'Automated ETL processes for large-scale datasets, ensuring robust data availability for downstream analytics',
        'Designed scalable data models to support enterprise reporting and improve data quality across multiple business units',
        'Participated in building the infrastructure required for optimal extraction, transformation, and loading processes',
      ],
      technologies: ['Python', 'GCP', 'Airflow'],
    },
    {
      id: 'exp-acb',
      company: 'Asia Commercial Bank (ACB)',
      position: 'Data Engineer Collaborator',
      duration: '7/2020 - 1/2021',
      status: 'success',
      responsibilities: [
        'Maintained critical data infrastructure while implementing data lineage tools to identify table origins and resolve reporting discrepancies',
        'Applied technical solutions to complex financial data, ensuring data integrity and consistency in high-stakes environments',
        'Crawled and enriched internal data sources to support sophisticated financial analytical modeling',
      ],
      technologies: ['Spark', 'Hadoop', 'Python', 'SQL', 'Oracle'],
    },
  ],

  skills: {
    technical: {
      id: 'skill-technical',
      category: 'Technical',
      items: ['Spark', 'SQL', 'Data Modeling', 'ClickHouse', 'GCP', 'K8S', 'Docker', 'Airflow', 'Linux', 'Git'],
      proficiency: 90,
      status: 'success',
    },
    programming: {
      id: 'skill-prog',
      category: 'Programming',
      items: ['Python', 'Javascript', 'TypeScript', 'OOP', 'Data Structures and Algorithms'],
      proficiency: 95,
      status: 'success',
    },
    dataTools: {
      id: 'skill-data',
      category: 'Data Engineering',
      items: ['Apache Airflow', 'Apache Spark', 'Kafka', 'DBT', 'Hadoop', 'Snowplow'],
      proficiency: 90,
      status: 'success',
    },
    cloud: {
      id: 'skill-cloud',
      category: 'Cloud & Infrastructure',
      items: ['GCP', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'Pulumi'],
      proficiency: 85,
      status: 'success',
    },
    databases: {
      id: 'skill-db',
      category: 'Databases & Storage',
      items: ['ClickHouse', 'Postgres', 'Oracle', 'BigQuery', 'Meilisearch'],
      proficiency: 85,
      status: 'success',
    },
    ai: {
      id: 'skill-ai',
      category: 'LLM & Retrieval',
      items: ['RAG pipelines', 'Structured extraction', 'Eval suites', 'Langfuse', 'Agent skills'],
      proficiency: 80,
      status: 'running',
    },
  },

  certifications: [
    {
      id: 'cert-clickhouse',
      name: 'ClickHouse Certified Developer',
      issuer: 'ClickHouse',
      status: 'success',
    },
    {
      id: 'cert-hackerrank',
      name: 'HackerRank SQL (Advanced)',
      issuer: 'HackerRank',
      status: 'success',
    },
    {
      id: 'cert-gcp',
      name: 'GCP Professional Data Engineer',
      issuer: 'Google Cloud',
      status: 'success',
    },
    {
      id: 'cert-astronomer',
      name: 'DAG Authoring for Apache Airflow 3',
      issuer: 'Astronomer',
      status: 'success',
    },
  ],

  projects: [
    {
      id: 'proj-pickedql',
      title: 'PickedQL',
      description:
        'An AST-based SQL rewriting and semantic layer giving analysts, Metabase, and LLM agents safe self-serve access to ClickHouse, governed by an architecture decision record.',
      technologies: ['TypeScript', 'ClickHouse', 'Metabase', 'LLM agents'],
      status: 'success',
      company: 'Convincely',
    },
    {
      id: 'proj-ch-warehouse',
      title: 'ClickHouse Analytics Warehouse',
      description:
        'The warehouse behind a customer experience and experimentation platform: Snowplow and Postgres events streamed through staging, identity resolution, and dimensional modeling, with schema migrations shipped through CI/CD.',
      technologies: ['ClickHouse', 'Snowplow', 'Postgres', 'Atlas', 'GitHub Actions'],
      status: 'success',
      company: 'Convincely',
    },
    {
      id: 'proj-rag',
      title: 'LLM & RAG Advisory Pipelines',
      description:
        'Data pipelines for an AI health insurance advisory product: a policy document corpus chunked into Meilisearch, with deterministic extraction under strict JSON schemas and verbatim-quote verification.',
      technologies: ['Meilisearch', 'LLM/RAG', 'JSON Schema', 'Python'],
      status: 'success',
      company: 'Convincely',
    },
    {
      id: 'proj-agent-skills',
      title: 'On-Demand Agent Skills',
      description:
        'Progressive-disclosure playbooks loaded at runtime by the AI advisory product, validated through an eval suite with custom scorers and Langfuse experiments.',
      technologies: ['Langfuse', 'Eval suites', 'LLM agents'],
      status: 'success',
      company: 'Convincely',
    },
    {
      id: 'proj-airflow-k8s',
      title: 'Airflow on Kubernetes',
      description:
        'Operated and scaled Airflow on Kubernetes to serve over 3,000 DAGs, holding DAG-file reflection on the UI to a P90 latency under 15 seconds using Pools, Queues, Priority Weights, and Cluster Policies.',
      technologies: ['Airflow', 'Kubernetes', 'GitLab CI', 'Jenkins'],
      status: 'success',
      company: 'MoMo',
    },
    {
      id: 'proj-batch-ingestion',
      title: 'Spark Batch Ingestion Tool',
      description:
        'A tool supporting batch ingestion from many sources, taken from ideation through coding and infrastructure, secured with Kubernetes Admission Control and secret management.',
      technologies: ['Spark', 'Kubernetes', 'Python'],
      status: 'success',
      company: 'MoMo',
    },
    {
      id: 'proj-clickhouse-streaming',
      title: 'Real-Time Reporting',
      description:
        'Raised report update frequency for critical requests by streaming into ClickHouse via Kafka Connect, using ReplacingMergeTree, materialized views, and function combinators to pre-aggregate and cut load on transforms and dashboards.',
      technologies: ['ClickHouse', 'Kafka Connect', 'ReplacingMergeTree'],
      status: 'success',
      company: 'MoMo',
    },
    {
      id: 'proj-iac',
      title: 'Infrastructure as Code',
      description:
        'GCP and Kubernetes resources deployed and managed as code with Pulumi, with CI pipelines building Docker images for Spark ingestion jobs.',
      technologies: ['Pulumi', 'GCP', 'Kubernetes', 'Docker'],
      status: 'success',
      company: 'MoMo',
    },
    {
      id: 'proj-datalake',
      title: 'Game Event Data Lake',
      description:
        'A Google Cloud Storage data lake for raw gaming event data at scale, with a raw-to-mart model built in DBT over Firebase events and legacy SQL optimized to cut BigQuery cost and latency.',
      technologies: ['GCS', 'DBT', 'BigQuery', 'Firebase'],
      status: 'success',
      company: 'Amanotes',
    },
    {
      id: 'proj-attribution',
      title: 'Partner Attribution Ingestion',
      description:
        'Ingestion pipelines crawling AppsFlyer, IronSource, and Mintegral APIs and dashboards into the warehouse to enrich attribution, monetization, and product funnel analysis.',
      technologies: ['AppsFlyer', 'IronSource', 'Mintegral', 'Airflow'],
      status: 'success',
      company: 'Amanotes',
    },
    {
      id: 'proj-etl',
      title: 'Enterprise ETL Automation',
      description:
        'Automated ETL for large-scale datasets with scalable data models supporting enterprise reporting across multiple business units.',
      technologies: ['Python', 'GCP', 'Airflow'],
      status: 'success',
      company: 'FPT Software',
    },
    {
      id: 'proj-lineage',
      title: 'Data Lineage & Enrichment',
      description:
        'Data lineage tooling to trace table origins and resolve reporting discrepancies, plus crawling and enrichment of internal sources for financial analytical modeling.',
      technologies: ['Spark', 'Hadoop', 'Oracle', 'SQL'],
      status: 'success',
      company: 'Asia Commercial Bank',
    },
  ],

  // DAG layout. Columns run left to right: trigger, education, experience, projects, skills, certifications.
  // Each node carries org / period / metric so the card is readable without opening it.
  dagStructure: {
    tasks: [
      {
        id: 'king',
        title: 'Live as a King',
        type: 'start',
        status: 'success',
        dependencies: [],
        position: { x: 40, y: 140 },
        org: 'Trigger',
        period: 'schedule: @daily',
        metric: 'The ultimate goal',
        isGroup: false,
      },

      // ---- Education ----
      {
        id: 'group-education',
        title: 'Education',
        type: 'group',
        status: 'success',
        position: { x: 300, y: 80 },
        isGroup: true,
      },
      {
        id: 'edu-bachelor',
        title: 'BSc Information Technology',
        type: 'education',
        status: 'success',
        dependencies: ['king'],
        position: { x: 330, y: 140 },
        start: '2017-08',
        org: 'HCM University of Science',
        period: '2017 — 2021',
        metric: 'Bachelor Information Technology',
        group: 'group-education',
        details: {
          Institution: 'HCM University of Science',
          Degree: 'Bachelor Information Technology',
          Duration: '8/2017 - 10/2021',
        },
      },

      // ---- Experience ----
      {
        id: 'group-experience',
        title: 'Experience',
        type: 'group',
        status: 'running',
        position: { x: 650, y: 80 },
        isGroup: true,
      },
      {
        id: 'exp-convincely',
        title: 'Senior Data Engineer',
        type: 'experience',
        status: 'running',
        dependencies: ['edu-bachelor'],
        position: { x: 680, y: 140 },
        start: '2025-07',
        org: 'Convincely',
        period: '2025 — now',
        metric: 'ClickHouse warehouse · PickedQL · LLM/RAG',
        tags: ['ClickHouse', 'AWS', 'Terraform', 'LLM/RAG'],
        group: 'group-experience',
        details: { ref: 'exp-convincely' },
      },
      {
        id: 'exp-momo',
        title: 'Data Engineer',
        type: 'experience',
        status: 'success',
        dependencies: ['edu-bachelor'],
        position: { x: 680, y: 740 },
        start: '2022-07',
        org: 'MoMo',
        period: '2022 — 2025',
        metric: '3,000+ DAGs · P90 sync < 15s',
        tags: ['Airflow', 'K8s', 'Spark', 'ClickHouse'],
        group: 'group-experience',
        details: { ref: 'exp-momo' },
      },
      {
        id: 'exp-amanotes',
        title: 'Data Engineer',
        type: 'experience',
        status: 'success',
        dependencies: ['edu-bachelor'],
        position: { x: 680, y: 1340 },
        start: '2021-06',
        org: 'Amanotes',
        period: '2021 — 2022',
        metric: 'Game event data lake on GCS',
        tags: ['GCP', 'DBT', 'Airflow', 'BigQuery'],
        group: 'group-experience',
        details: { ref: 'exp-amanotes' },
      },
      {
        id: 'exp-fpt',
        title: 'Data Engineer',
        type: 'experience',
        status: 'success',
        dependencies: ['edu-bachelor'],
        position: { x: 680, y: 1640 },
        start: '2021-01',
        org: 'FPT Software',
        period: '2021',
        metric: 'Enterprise ETL automation',
        tags: ['Python', 'GCP', 'Airflow'],
        group: 'group-experience',
        details: { ref: 'exp-fpt' },
      },
      {
        id: 'exp-acb',
        title: 'Data Engineer Collaborator',
        type: 'experience',
        status: 'success',
        dependencies: ['edu-bachelor'],
        position: { x: 680, y: 1790 },
        start: '2020-07',
        org: 'Asia Commercial Bank',
        period: '2020 — 2021',
        metric: 'Data lineage for financial reporting',
        tags: ['Spark', 'Hadoop', 'Oracle'],
        group: 'group-experience',
        details: { ref: 'exp-acb' },
      },

      // ---- Projects ----
      {
        id: 'group-projects',
        title: 'Projects',
        type: 'group',
        status: 'success',
        position: { x: 1030, y: 80 },
        isGroup: true,
      },
      {
        id: 'proj-pickedql',
        title: 'PickedQL',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-convincely'],
        position: { x: 1060, y: 140 },
        start: '2025-07',
        org: 'Convincely',
        period: '2025',
        metric: 'AST SQL rewrite + semantic layer',
        tags: ['TypeScript', 'ClickHouse'],
        group: 'group-projects',
        details: { ref: 'proj-pickedql' },
      },
      {
        id: 'proj-ch-warehouse',
        title: 'ClickHouse Warehouse',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-convincely'],
        position: { x: 1060, y: 290 },
        start: '2025-07',
        org: 'Convincely',
        period: '2025',
        metric: 'Snowplow + Postgres → dimensions',
        tags: ['ClickHouse', 'Atlas'],
        group: 'group-projects',
        details: { ref: 'proj-ch-warehouse' },
      },
      {
        id: 'proj-rag',
        title: 'LLM & RAG Pipelines',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-convincely'],
        position: { x: 1060, y: 440 },
        start: '2025-07',
        org: 'Convincely',
        period: '2025',
        metric: 'Strict-JSON extraction, quote-verified',
        tags: ['Meilisearch', 'RAG'],
        group: 'group-projects',
        details: { ref: 'proj-rag' },
      },
      {
        id: 'proj-agent-skills',
        title: 'On-Demand Agent Skills',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-convincely'],
        position: { x: 1060, y: 590 },
        start: '2025-07',
        org: 'Convincely',
        period: '2025',
        metric: 'Eval suite + custom scorers',
        tags: ['Langfuse', 'Evals'],
        group: 'group-projects',
        details: { ref: 'proj-agent-skills' },
      },
      {
        id: 'proj-airflow-k8s',
        title: 'Airflow on Kubernetes',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-momo'],
        position: { x: 1060, y: 740 },
        start: '2022-07',
        org: 'MoMo',
        period: '2022 — 2025',
        metric: '3,000+ DAGs · P90 < 15s',
        tags: ['Airflow', 'K8s'],
        group: 'group-projects',
        details: { ref: 'proj-airflow-k8s' },
      },
      {
        id: 'proj-batch-ingestion',
        title: 'Spark Batch Ingestion',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-momo'],
        position: { x: 1060, y: 890 },
        start: '2022-07',
        org: 'MoMo',
        period: '2022 — 2025',
        metric: 'Admission Control + secret mgmt',
        tags: ['Spark', 'K8s'],
        group: 'group-projects',
        details: { ref: 'proj-batch-ingestion' },
      },
      {
        id: 'proj-clickhouse-streaming',
        title: 'Real-Time Reporting',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-momo'],
        position: { x: 1060, y: 1040 },
        start: '2022-07',
        org: 'MoMo',
        period: '2022 — 2025',
        metric: 'Kafka Connect → ClickHouse',
        tags: ['Kafka', 'ClickHouse'],
        group: 'group-projects',
        details: { ref: 'proj-clickhouse-streaming' },
      },
      {
        id: 'proj-iac',
        title: 'Infrastructure as Code',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-momo'],
        position: { x: 1060, y: 1190 },
        start: '2022-07',
        org: 'MoMo',
        period: '2022 — 2025',
        metric: 'Pulumi-managed GCP + K8s',
        tags: ['Pulumi', 'GCP'],
        group: 'group-projects',
        details: { ref: 'proj-iac' },
      },
      {
        id: 'proj-datalake',
        title: 'Game Event Data Lake',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-amanotes'],
        position: { x: 1060, y: 1340 },
        start: '2021-06',
        org: 'Amanotes',
        period: '2021 — 2022',
        metric: 'Raw → mart in DBT on BigQuery',
        tags: ['GCS', 'DBT'],
        group: 'group-projects',
        details: { ref: 'proj-datalake' },
      },
      {
        id: 'proj-attribution',
        title: 'Partner Attribution',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-amanotes'],
        position: { x: 1060, y: 1490 },
        start: '2021-06',
        org: 'Amanotes',
        period: '2021 — 2022',
        metric: 'AppsFlyer · IronSource · Mintegral',
        tags: ['Airflow', 'APIs'],
        group: 'group-projects',
        details: { ref: 'proj-attribution' },
      },
      {
        id: 'proj-etl',
        title: 'Enterprise ETL Automation',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-fpt'],
        position: { x: 1060, y: 1640 },
        start: '2021-01',
        org: 'FPT Software',
        period: '2021',
        metric: 'Multi-business-unit reporting',
        tags: ['Python', 'Airflow'],
        group: 'group-projects',
        details: { ref: 'proj-etl' },
      },
      {
        id: 'proj-lineage',
        title: 'Data Lineage & Enrichment',
        type: 'projects',
        status: 'success',
        dependencies: ['exp-acb'],
        position: { x: 1060, y: 1790 },
        start: '2020-07',
        org: 'Asia Commercial Bank',
        period: '2020 — 2021',
        metric: 'Table-origin tracing for reports',
        tags: ['Spark', 'Hadoop'],
        group: 'group-projects',
        details: { ref: 'proj-lineage' },
      },

      // ---- Skills ----
      {
        id: 'group-skills',
        title: 'Skills',
        type: 'group',
        status: 'success',
        position: { x: 1430, y: 80 },
        isGroup: true,
      },
      {
        id: 'skills-technical',
        title: 'Technical',
        type: 'skills',
        status: 'success',
        dependencies: ['proj-airflow-k8s'],
        position: { x: 1460, y: 740 },
        org: 'Stack',
        metric: 'Spark · SQL · ClickHouse · GCP · K8s',
        group: 'group-skills',
        details: { skillRef: 'technical' },
      },
      {
        id: 'skills-programming',
        title: 'Programming',
        type: 'skills',
        status: 'success',
        dependencies: ['proj-pickedql'],
        position: { x: 1460, y: 140 },
        org: 'Stack',
        metric: 'Python · JavaScript · TypeScript',
        group: 'group-skills',
        details: { skillRef: 'programming' },
      },
      {
        id: 'skills-data',
        title: 'Data Engineering',
        type: 'skills',
        status: 'success',
        dependencies: ['proj-datalake'],
        position: { x: 1460, y: 1340 },
        org: 'Stack',
        metric: 'Airflow · Spark · Kafka · DBT',
        group: 'group-skills',
        details: { skillRef: 'dataTools' },
      },
      {
        id: 'skills-cloud',
        title: 'Cloud & Infrastructure',
        type: 'skills',
        status: 'success',
        dependencies: ['proj-iac'],
        position: { x: 1460, y: 1190 },
        org: 'Stack',
        metric: 'GCP · AWS · K8s · Terraform · Pulumi',
        group: 'group-skills',
        details: { skillRef: 'cloud' },
      },
      {
        id: 'skills-db',
        title: 'Databases & Storage',
        type: 'skills',
        status: 'success',
        dependencies: ['proj-ch-warehouse'],
        position: { x: 1460, y: 290 },
        org: 'Stack',
        metric: 'ClickHouse · Postgres · BigQuery',
        group: 'group-skills',
        details: { skillRef: 'databases' },
      },
      {
        id: 'skills-ai',
        title: 'LLM & Retrieval',
        type: 'skills',
        status: 'running',
        dependencies: ['proj-rag'],
        position: { x: 1460, y: 440 },
        org: 'Stack',
        metric: 'RAG · structured extraction · evals',
        group: 'group-skills',
        details: { skillRef: 'ai' },
      },

      // ---- Certifications ----
      {
        id: 'group-certs',
        title: 'Certifications',
        type: 'group',
        status: 'success',
        position: { x: 1810, y: 80 },
        isGroup: true,
      },
      {
        id: 'cert-clickhouse',
        title: 'ClickHouse Certified Developer',
        type: 'certifications',
        status: 'success',
        dependencies: ['skills-db'],
        position: { x: 1840, y: 290 },
        org: 'ClickHouse',
        metric: 'Certified Developer',
        group: 'group-certs',
      },
      {
        id: 'cert-astronomer',
        title: 'DAG Authoring for Airflow 3',
        type: 'certifications',
        status: 'success',
        dependencies: ['skills-data'],
        position: { x: 1840, y: 1340 },
        org: 'Astronomer',
        metric: 'Certification',
        group: 'group-certs',
      },
      {
        id: 'cert-gcp',
        title: 'Professional Data Engineer',
        type: 'certifications',
        status: 'success',
        dependencies: ['skills-cloud'],
        position: { x: 1840, y: 1190 },
        org: 'Google Cloud',
        metric: 'Professional certification',
        group: 'group-certs',
      },
      {
        id: 'cert-hackerrank',
        title: 'SQL (Advanced)',
        type: 'certifications',
        status: 'success',
        dependencies: ['skills-technical'],
        position: { x: 1840, y: 740 },
        org: 'HackerRank',
        metric: 'Advanced certificate',
        group: 'group-certs',
      },
    ],
  },
}

// Helper functions for data manipulation
export const portfolioHelpers = {
  getTaskByType(type) {
    return portfolioData.dagStructure.tasks.find(task => task.type === type)
  },

  getSkillsProficiency() {
    const skills = portfolioData.skills
    const total = Object.values(skills).reduce((sum, skill) => sum + skill.proficiency, 0)
    return Math.round(total / Object.keys(skills).length)
  },

  // Counted from the first role on the CV (ACB, 7/2020) to today, so it never goes stale.
  getExperienceYears() {
    const careerStart = new Date('2020-07-01')
    const years = (Date.now() - careerStart) / (1000 * 60 * 60 * 24 * 365.25)
    return `${Math.floor(years)}+ years`
  },

  getProjectCount() {
    return portfolioData.projects.length
  },

  getExperienceById(id) {
    return portfolioData.experience.find(exp => exp.id === id)
  },

  getProjectById(id) {
    return portfolioData.projects.find(proj => proj.id === id)
  },

  // Convert portfolio data to Airflow-compatible format
  toAirflowTasks() {
    return portfolioData.dagStructure.tasks.map(task => ({
      task_id: task.id,
      task_type: task.type,
      status: task.status,
      dependencies: task.dependencies,
      metadata: this.getTaskMetadata(task.type),
    }))
  },

  getTaskMetadata(type) {
    switch (type) {
      case 'education':
        return portfolioData.education
      case 'experience':
        return portfolioData.experience
      case 'skills':
        return portfolioData.skills
      case 'projects':
        return portfolioData.projects
      case 'certifications':
        return portfolioData.certifications
      default:
        return {}
    }
  },
}
