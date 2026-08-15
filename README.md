# 🚀 PromptCraft Studio

> A production-style AI web application deployed using a complete DevOps and Kubernetes workflow.

PromptCraft Studio is a modern AI-powered web studio designed to help users create, manage, and work with prompts through an intuitive web interface.

The project demonstrates an end-to-end DevOps implementation including containerization, CI/CD, infrastructure provisioning, configuration management, Kubernetes orchestration, monitoring, dashboards, and alerting.

---

## ✨ Features

- 🤖 AI-powered Prompt Studio
- 🎨 Modern responsive web interface
- 🐳 Dockerized application
- 🔄 Jenkins CI/CD pipeline
- ☸️ Kubernetes deployment
- ⚖️ Kubernetes service load balancing
- 🌐 Traefik Ingress
- ☁️ AWS EC2 infrastructure
- 🏗️ Terraform infrastructure provisioning
- ⚙️ Ansible configuration management
- 📊 Prometheus monitoring
- 📈 Grafana dashboards
- 🚨 Alertmanager email notifications
- ❤️ Kubernetes health monitoring
- 📦 GitHub-based source control

---

# 🏗️ DevOps Architecture

```text
                        ┌────────────────────┐
                        │      Developer     │
                        │      Git Push       │
                        └─────────┬──────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │      GitHub        │
                        │   Source Control   │
                        └─────────┬──────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │      Jenkins       │
                        │     CI / CD        │
                        └─────────┬──────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
          ┌─────────────────┐         ┌─────────────────┐
          │      Docker     │         │      Tests      │
          │ Build & Push    │         │   Validation   │
          └────────┬────────┘         └─────────────────┘
                   │
                   ▼
          ┌─────────────────────┐
          │       AWS EC2       │
          │      Ubuntu         │
          └──────────┬──────────┘
                     │
                     ▼
             ┌───────────────┐
             │   Kubernetes  │
             │    Cluster    │
             └───────┬───────┘
                     │
          ┌──────────┴───────────┐
          ▼                      ▼
 ┌─────────────────┐    ┌─────────────────┐
 │ PromptCraft Pod │    │ PromptCraft Pod │
 │      Replica    │    │      Replica    │
 └────────┬────────┘    └────────┬────────┘
          │                      │
          └──────────┬───────────┘
                     ▼
             ┌───────────────┐
             │    Service    │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │    Traefik    │
             │    Ingress    │
             └───────┬───────┘
                     │
                     ▼
                  🌐 User

        ┌───────────────────────────────┐
        │        Monitoring Stack       │
        │                               │
        │ Prometheus → Grafana           │
        │       │                       │
        │       ▼                       │
        │  Alertmanager → Email         │
        └───────────────────────────────┘
