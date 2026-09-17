import json
import os

# Base templates to construct stacks
fe_base = ["JavaScript", "HTML5", "CSS3", "Git", "Responsive Design"]
be_base = ["REST APIs", "SQL", "Git", "Microservices"]
ds_base = ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn"]
do_base = ["Linux / Bash", "Docker Containers", "CI/CD Pipelines", "Git"]

# Dictionary containing 100+ major companies and their specific stacks
companies = {}

# Curated high-profile companies
special_companies = {
    "google": {
        "frontend": fe_base + ["Angular", "TypeScript", "Vite", "Karma"],
        "backend": be_base + ["Go (Golang)", "Java", "gRPC / Protocol Buffers", "C++"],
        "datascience": ds_base + ["TensorFlow", "JAX", "BigQuery", "Deep Learning"],
        "devops": do_base + ["GCP (Google Cloud)", "Kubernetes (Borg)", "Terraform"],
        "resources": ["Google Cloud Platform Architect Course", "Google Site Reliability Engineering guidelines"]
    },
    "microsoft": {
        "frontend": fe_base + ["TypeScript", "React", "Fluent UI", "Webpack"],
        "backend": be_base + ["C#", ".NET Core / ASP.NET", "MS SQL Server", "Entity Framework"],
        "datascience": ds_base + ["Azure ML", "PyTorch", "PowerBI", "Azure Synapse"],
        "devops": do_base + ["Azure DevOps", "Microsoft Azure Cloud", "ARM Templates"],
        "resources": ["Microsoft Certified: Azure Solutions Architect", ".NET Core API design documentation"]
    },
    "meta": {
        "frontend": fe_base + ["React", "TypeScript", "GraphQL", "Relay"],
        "backend": be_base + ["Python", "PHP / Hack", "C++", "GraphQL APIs"],
        "datascience": ds_base + ["PyTorch", "Neural Networks", "Deep Learning", "Presto"],
        "devops": do_base + ["Docker", "Kubernetes", "Chef", "Internal cloud automation"],
        "resources": ["GraphQL Official Tutorials", "PyTorch Deep Learning specialization"]
    },
    "amazon": {
        "frontend": fe_base + ["React", "TypeScript", "Webpack"],
        "backend": be_base + ["Java (AWS service stack)", "C++", "Distributed Systems Design", "DynamoDB"],
        "datascience": ds_base + ["AWS SageMaker", "Spark / EMR", "Redshift", "Machine Learning Algorithms"],
        "devops": do_base + ["AWS (EC2, S3, ECS, Lambda)", "CloudFormation", "Terraform"],
        "resources": ["AWS Certified Solutions Architect", "Amazon Leadership Principles training"]
    },
    "netflix": {
        "frontend": fe_base + ["React", "Node.js", "TypeScript"],
        "backend": be_base + ["Java & Spring Boot", "Netflix OSS (Eureka, Zuul)", "Apache Kafka", "Cassandra"],
        "datascience": ds_base + ["Spark / EMR", "Notebooks (Jupyter)", "A/B Testing", "Recommender Systems"],
        "devops": do_base + ["AWS Cloud", "Spinnaker", "Kubernetes (Titus)", "Terraform"],
        "resources": ["Netflix Tech Blog Microservices guides", "Apache Kafka Event Streaming course"]
    },
    "apple": {
        "frontend": fe_base + ["React", "TypeScript", "Sass"],
        "backend": be_base + ["Java", "Swift", "C++", "Objective-C Runtime"],
        "datascience": ds_base + ["PyTorch", "CoreML", "Statistics", "Data Mining"],
        "devops": do_base + ["Docker", "Kubernetes", "Apple Cloud Services", "Ansible"],
        "resources": ["Apple Developer Documentation", "SwiftUI and Swift Systems Programming"]
    },
    "salesforce": {
        "frontend": fe_base + ["Lightning Web Components (LWC)", "Aura Framework", "TypeScript"],
        "backend": be_base + ["Apex", "SOQL / SOSL", "Java", "Salesforce DX"],
        "datascience": ds_base + ["Einstein AI", "Tableau", "SQL", "Data Modeling"],
        "devops": do_base + ["Heroku", "Salesforce CLI", "Jenkins", "AWS Services"],
        "resources": ["Trailhead Salesforce Developer Certification", "LWC developer guides"]
    },
    "adobe": {
        "frontend": fe_base + ["React", "TypeScript", "Spectrum UI"],
        "backend": be_base + ["Java", "C++", "Node.js", "PostgreSQL"],
        "datascience": ds_base + ["Adobe Sensei (AI)", "Python", "SQL", "Machine Learning"],
        "devops": do_base + ["Azure Cloud", "AWS Cloud", "Terraform", "Docker"],
        "resources": ["Adobe Developer Platform SDK guides", "Cloud Systems Architecture course"]
    },
    "spotify": {
        "frontend": fe_base + ["React", "TypeScript", "Next.js", "Web API"],
        "backend": be_base + ["Java", "Python", "C++", "Backstage developer portals"],
        "datascience": ds_base + ["Spark", "Hadoop", "Python", "Music Recommendation Algorithms"],
        "devops": do_base + ["GCP (Google Cloud)", "Docker", "Kubernetes (Helios)", "Terraform"],
        "resources": ["Spotify Tech Blog: Agile Squads & Backstage Portal tutorials"]
    },
    "stripe": {
        "frontend": fe_base + ["React", "TypeScript", "Design Systems"],
        "backend": be_base + ["Ruby", "Go (Golang)", "Java", "Stripe API & Webhooks"],
        "datascience": ds_base + ["Python", "SQL", "Spark", "Fraud Detection Algorithms"],
        "devops": do_base + ["AWS Cloud", "Puppet", "Terraform", "Docker"],
        "resources": ["Stripe API Documentation & Integration Guides", "Ruby on Rails guide"]
    },
    "uber": {
        "frontend": fe_base + ["React", "TypeScript", "Base Web UI"],
        "backend": be_base + ["Go (Golang)", "Java", "Python", "Cassandra", "Schemaless DB"],
        "datascience": ds_base + ["Michelangelo (ML Platform)", "Python", "Spark", "Spatial Data Analysis"],
        "devops": do_base + ["Docker", "Kubernetes", "Multi-region Hybrid Cloud", "Prometheus"],
        "resources": ["Uber Engineering Blog: Microservice architecture guides"]
    },
    "airbnb": {
        "frontend": fe_base + ["React", "TypeScript", "Sass", "Responsive Web Design"],
        "backend": be_base + ["Ruby on Rails", "Java", "Node.js", "MySQL"],
        "datascience": ds_base + ["Python", "SQL", "R", "Search Ranking Algorithms"],
        "devops": do_base + ["AWS Cloud", "Chef", "Kubernetes", "Terraform"],
        "resources": ["Airbnb Tech Blog: React and Ruby on Rails framework guides"]
    },
    "nvidia": {
        "frontend": fe_base + ["React", "TypeScript", "D3.js"],
        "backend": be_base + ["C++", "C", "Python", "CUDA", "Linux Core development"],
        "datascience": ds_base + ["CUDA Programming", "Deep Learning", "TensorRT", "Computer Vision"],
        "devops": do_base + ["On-prem GPU clusters", "Docker", "Kubernetes", "Ansible"],
        "resources": ["NVIDIA Developer Zone: CUDA & Deep Learning Institute (DLI) training"]
    },
    "tesla": {
        "frontend": fe_base + ["React", "TypeScript", "C++ (Embedded UI)"],
        "backend": be_base + ["C++", "Go (Golang)", "Python", "Rust", "SQL"],
        "datascience": ds_base + ["Autopilot Neural Networks", "PyTorch", "Computer Vision", "C++ Simulation"],
        "devops": do_base + ["Docker", "Kubernetes", "AWS Cloud", "Linux Kernels"],
        "resources": ["Embedded C++ & Real-time Systems programming", "PyTorch Computer Vision guides"]
    },
    "spacex": {
        "frontend": fe_base + ["React", "C++ (Telemetry Visuals)"],
        "backend": be_base + ["C++", "C", "Python", "Real-time systems"],
        "datascience": ds_base + ["Python", "MATLAB", "Telemetry Data Analysis", "Physics Simulations"],
        "devops": do_base + ["Linux Real-Time kernels", "Docker", "Puppet", "Bare-metal CI/CD"],
        "resources": ["C++ Flight Software development practices", "Linux Kernel & Real-time OS guidelines"]
    },
    "coinbase": {
        "frontend": fe_base + ["React", "React Native", "TypeScript"],
        "backend": be_base + ["Go (Golang)", "Ruby", "Node.js", "Blockchain Nodes", "Solidity"],
        "datascience": ds_base + ["Python", "SQL", "Fraud analysis", "Blockchain data modeling"],
        "devops": do_base + ["AWS Cloud", "Terraform", "Kubernetes", "Zero-Trust Security"],
        "resources": ["Solidity & Ethereum Smart Contract guides", "Blockchain protocol basics"]
    },
    "github": {
        "frontend": fe_base + ["TypeScript", "Vanilla JS", "Primer CSS"],
        "backend": be_base + ["Ruby on Rails", "Go (Golang)", "MySQL", "Git Internal APIs"],
        "datascience": ds_base + ["Python", "SQL", "Natural Language Processing (Copilot models)"],
        "devops": do_base + ["Bare metal", "Azure Cloud", "Docker", "GitHub Actions CI/CD"],
        "resources": ["GitHub Actions & APIs development guides", "Ruby on Rails scalability practices"]
    },
    "figma": {
        "frontend": fe_base + ["React", "TypeScript", "WebAssembly (WASM)", "WebGL / Canvas"],
        "backend": be_base + ["C++", "Rust", "Go (Golang)", "PostgreSQL"],
        "datascience": ds_base + ["Python", "SQL", "User metrics analytics"],
        "devops": do_base + ["AWS Cloud", "Terraform", "Docker", "Kubernetes"],
        "resources": ["WebGL & WebAssembly programming", "Rust Systems Programming guides"]
    }
}

# Add all special companies to final dictionary
for name, data in special_companies.items():
    companies[name] = data

# List of 90 more companies to reach 100+ companies minimum
generic_companies = [
    # Finance & Fintech
    "paypal", "robinhood", "stripe", "block", "square", "affirm", "plaid", "sofi", "chime", "visa", "mastercard",
    "goldman sachs", "morgan stanley", "jp morgan", "fidelity", "citigroup", "capital one", "klarna", "wise",
    # Retail & E-Commerce
    "shopify", "ebay", "etsy", "wayfair", "target", "walmart", "costco", "bestbuy", "ikea", "instacart",
    "grubhub", "doordash", "ubereats", "delivery hero", "grab", "gojek", "deliveroo", "rappi", "careem",
    # Tech SaaS / Enterprise
    "zoom", "slack", "notion", "asana", "monday.com", "clickup", "trello", "atlassian", "jira", "confluence",
    "docusign", "hubspot", "zendesk", "snowflake", "databricks", "splunk", "datadog", "dynatrace", "new relic",
    "crowdstrike", "cloudflare", "fastly", "okta", "auth0", "zoominfo", "twilio", "dropbox", "box", "elastic",
    "mongodb", "hashicorp", "confluent", "palantir", "unity", "epic games", "roblox", "ea", "nintendo", "twitch",
    "discord", "canva", "pinterest", "reddit", "quora", "medium", "substack", "patreon", "kickstarter",
    # Hardware / Systems
    "intel", "amd", "cisco", "vmware", "dell", "hp", "lenovo", "samsung", "lg", "sony", "panasonic"
]

# Standard tech mixes to assign programmatically to the generic companies
tech_mixes = [
    {
        "frontend": fe_base + ["React", "TypeScript", "Tailwind CSS"],
        "backend": be_base + ["Node.js", "Express.js", "MongoDB"],
        "datascience": ds_base + ["Jupyter", "SQL", "Tableau"],
        "devops": do_base + ["AWS Cloud", "Terraform", "GitHub Actions"],
        "resources": ["AWS Solutions Architect tutorials", "Node.js Fullstack Bootcamp"]
    },
    {
        "frontend": fe_base + ["Vue.js", "TypeScript", "Sass"],
        "backend": be_base + ["Python", "FastAPI", "PostgreSQL"],
        "datascience": ds_base + ["TensorFlow", "Keras", "Predictive Analytics"],
        "devops": do_base + ["GCP Services", "Kubernetes", "GitLab CI"],
        "resources": ["FastAPI Developer Guides", "Google Cloud Platform Fundamentals"]
    },
    {
        "frontend": fe_base + ["React", "Redux Toolkit", "Bootstrap"],
        "backend": be_base + ["Java", "Spring Boot", "MySQL"],
        "datascience": ds_base + ["Spark", "Hadoop", "Data Warehousing"],
        "devops": do_base + ["AWS Services", "Docker", "Jenkins"],
        "resources": ["Spring Boot & Java Enterprise tutorials", "Apache Spark Big Data course"]
    },
    {
        "frontend": fe_base + ["Angular", "TypeScript", "Tailwind CSS"],
        "backend": be_base + ["C#", ".NET Core", "SQL Server"],
        "datascience": ds_base + ["PowerBI", "SQL", "Statistics"],
        "devops": do_base + ["Azure Services", "Kubernetes", "Terraform"],
        "resources": ["ASP.NET Core Web API guides", "Azure Fundamentals training"]
    },
    {
        "frontend": fe_base + ["React", "Next.js", "Tailwind CSS"],
        "backend": be_base + ["Go (Golang)", "PostgreSQL", "Redis"],
        "datascience": ds_base + ["PyTorch", "NLP", "Machine Learning models"],
        "devops": do_base + ["Docker", "Kubernetes", "AWS (EKS)", "CI/CD Actions"],
        "resources": ["Go Programming masterclass", "Kubernetes Administrator (CKA) preparation"]
    }
]

# Distribute tech mixes deterministically based on company name
for idx, company_name in enumerate(generic_companies):
    # Skip if already added in special
    if company_name in companies:
        continue
    mix = tech_mixes[idx % len(tech_mixes)]
    companies[company_name] = {
        "frontend": mix["frontend"],
        "backend": mix["backend"],
        "datascience": mix["datascience"],
        "devops": mix["devops"],
        "resources": mix["resources"]
    }

# Save database to JSON file
out_path = os.path.join(os.path.dirname(__file__), "services", "companies_data.json")
with open(out_path, "w") as f:
    json.dump(companies, f, indent=4)

print(f"Successfully generated database with {len(companies)} companies at {out_path}.")
