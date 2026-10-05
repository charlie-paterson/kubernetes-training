# Highly Available Kubernetes Application

A production-style Kubernetes deployment demonstrating **high availability, container orchestration, automated CI/CD, scaling, health checks, persistence, and failure recovery**.

---

## 🏗️ Architecture

```text
                         GitHub
                           │
                           │ Push to main
                           ▼
                  GitHub Actions
                  Self-Hosted Runner
                           │
              ┌────────────┴────────────┐
              │                         │
        Docker Build               Helm Deploy
              │                         │
              ▼                         ▼
             GHCR                  Kubernetes
                                        │
                                  ┌─────┴─────┐
                                  │  Ingress  │
                                  └─────┬─────┘
                                        │
                                Kubernetes Service
                                        │
                         ┌──────────────┼──────────────┐
                         ▼              ▼              ▼
                      Pod 1          Pod 2          Pod 3
                      Node 1         Node 2         Node 3
```

---

## 🛠️ Tech Stack

### DevOps & Containerization

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=git,github,ansible,docker,kubernetes&perline=5" />
  </a>
</p>

### Programming

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=javascript,nodejs&perline=5" />
  </a>
</p>

### Infrastructure & Platforms

* Kubernetes
* Minikube
* Helm
* Docker
* GitHub Actions
* GitHub Container Registry
* Linux
* WSL2

### Monitoring & Scaling

* Kubernetes Metrics Server
* Horizontal Pod Autoscaler (HPA)
* Pod Disruption Budget (PDB)
* Kubernetes health probes

---

## 🚀 Features

### High Availability

* 3-node Kubernetes cluster
* 3 application replicas
* Pod anti-affinity
* Rolling updates
* `maxUnavailable: 0`
* Pod Disruption Budget
* Kubernetes self-healing
* Node failure testing

### Health Checks

The application exposes:

| Endpoint  | Purpose                 |
| --------- | ----------------------- |
| `/`       | Application response    |
| `/health` | Liveness/startup health |
| `/ready`  | Readiness check         |

Kubernetes uses these endpoints for:

* Startup probes
* Readiness probes
* Liveness probes

---

## 📈 Horizontal Pod Autoscaling

The application uses a Kubernetes HPA based on CPU utilization.

```text
Minimum replicas: 3
Maximum replicas: 10
CPU target: 70%
```

During load testing, the application successfully scaled:

```text
3 → 6 → 8 replicas
```

This demonstrates Kubernetes automatically scaling the application in response to increased CPU utilization.

---

## 💾 Persistent Storage

The Helm chart supports persistent storage using a Kubernetes `PersistentVolumeClaim`.

Persistence is optional:

```yaml
persistence:
  enabled: false
```

Persistent storage was tested separately by:

1. Writing data to the mounted volume.
2. Deleting the application pod.
3. Allowing Kubernetes to recreate the pod.
4. Verifying the data remained available.

For the multi-node HA deployment, persistence is disabled because the Minikube storage class uses `ReadWriteOnce` storage and the application itself is stateless.

---

## 🌐 Ingress

The application is exposed through an NGINX Ingress controller.

```text
http://ha-app.local
```

Traffic flows through:

```text
Ingress
   ↓
Service
   ↓
Application Pods
```

---

## ⎈ Helm

The application is packaged as a Helm chart.

```text
helm/
└── ha-app/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment.yaml
        ├── service.yaml
        ├── ingress.yaml
        ├── hpa.yaml
        ├── pdb.yaml
        ├── pvc.yaml
        └── _helpers.tpl
```

Helm provides configurable deployment parameters including:

* Replica count
* Container image
* Application version
* Resource requests and limits
* Ingress configuration
* Persistence

---

## 🔄 CI/CD

Every push to `main` triggers the GitHub Actions pipeline.

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Checkout
   │
   ├── Docker Login
   │
   ├── Build Docker Image
   │
   ├── Push Image → GHCR
   │
   ├── Helm Upgrade
   │
   └── Verify Deployment
```

Docker images are tagged using the Git commit SHA:

```text
ghcr.io/charlie-paterson/ha-app:<commit-sha>
```

This provides immutable image versions and makes deployments traceable to source code commits.

---

## 🖥️ Self-Hosted Runner

The CI/CD pipeline uses a GitHub Actions **self-hosted runner** running inside WSL2.

The runner has access to:

* Docker
* kubectl
* Helm
* Minikube

```text
GitHub
   │
   ▼
Self-Hosted Runner
   │
   ├── Docker
   ├── Helm
   └── kubectl
          │
          ▼
   Kubernetes Cluster
```

---

## 💥 Failure Testing

High availability was tested by deliberately draining one of the Kubernetes worker nodes.

```bash
kubectl cordon ha-cluster-m02

kubectl drain ha-cluster-m02 \
  --ignore-daemonsets \
  --delete-emptydir-data
```

Kubernetes detected the disruption and recreated the affected application pod on another healthy node.

The deployment returned to the desired replica count without manually creating a replacement pod.

The node was then restored:

```bash
kubectl uncordon ha-cluster-m02
```

### Result

```text
Node 2
  ↓
Pod evicted
  ↓
Deployment detects missing replica
  ↓
Replacement pod scheduled
  ↓
3 replicas restored
```

---

## 📦 Project Structure

```text
kubernetes-training/
│
├── app/
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── helm/
│   └── ha-app/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── ingress.yaml
│           ├── hpa.yaml
│           ├── pdb.yaml
│           ├── pvc.yaml
│           └── _helpers.tpl
│
└── .github/
    └── workflows/
        └── ci-cd.yml
```

---

## ⚙️ Prerequisites

* Git
* Docker
* kubectl
* Helm
* Minikube
* Linux / WSL2

---

## 🚀 Running Locally

### Start the 3-node cluster

```bash
minikube start \
  --profile ha-cluster \
  --nodes 3 \
  --driver docker
```

Verify the nodes:

```bash
kubectl get nodes
```

---

## ⎈ Deploy with Helm

```bash
helm upgrade --install ha-app ./helm/ha-app \
  --set image.repository=ghcr.io/charlie-paterson/ha-app \
  --set image.tag=<IMAGE_TAG> \
  --wait
```

Check the pods:

```bash
kubectl get pods -o wide
```

Check the service:

```bash
kubectl get service
```

Check the ingress:

```bash
kubectl get ingress
```

---

## 🔍 Useful Kubernetes Commands

### Nodes

```bash
kubectl get nodes -o wide
```

### Pods

```bash
kubectl get pods -o wide
```

### Deployment

```bash
kubectl get deployment
```

### HPA

```bash
kubectl get hpa
```

### PDB

```bash
kubectl get pdb
```

### Ingress

```bash
kubectl get ingress
```

### Resource Usage

```bash
kubectl top pods
kubectl top nodes
```

### Rollout Status

```bash
kubectl rollout status deployment/ha-app
```

### Rollout History

```bash
kubectl rollout history deployment/ha-app
```

---

## 🧠 Kubernetes Concepts Demonstrated

* Kubernetes Deployments
* ReplicaSets
* Services
* Ingress
* Helm
* PersistentVolumeClaims
* Readiness probes
* Liveness probes
* Startup probes
* Resource requests and limits
* Horizontal Pod Autoscaling
* Pod Disruption Budgets
* Pod anti-affinity
* Rolling updates
* Self-healing
* Node draining
* Multi-node clusters
* Container image management
* GitHub Actions
* Self-hosted runners

---

## 📚 Lessons Learned

### Stateless applications simplify HA

Because the application does not require persistent state, replicas can be distributed across multiple Kubernetes nodes.

### `ReadWriteOnce` storage is not automatically highly available

A `ReadWriteOnce` volume is not a suitable shared storage solution for an application that needs to operate across multiple nodes.

### Kubernetes self-healing

Deployments continuously work toward their desired state. When a pod is disrupted, Kubernetes automatically attempts to restore the configured replica count.

### Pod anti-affinity

Pod anti-affinity allows replicas to be distributed across different nodes, reducing the impact of a single-node failure.

### Health probes

Readiness, liveness, and startup probes allow Kubernetes to distinguish between:

* A starting application
* A healthy application
* An unhealthy application

---

## 🔮 Future Improvements

* [ ] Automated application tests
* [ ] Helm linting in CI
* [ ] Container vulnerability scanning
* [ ] Kubernetes Secrets management
* [ ] Prometheus monitoring
* [ ] Grafana dashboards
* [ ] NetworkPolicies
* [ ] Production-grade persistent storage
* [ ] Argo CD / GitOps
* [ ] OpenShift deployment
* [ ] Blue/green deployments
* [ ] Canary deployments

---

## 🎯 Project Goal

The goal of this project is to develop practical experience with **Kubernetes, high availability, containerization, infrastructure automation, and CI/CD**.

Rather than simply deploying a container, the project demonstrates how Kubernetes features work together to create a resilient application platform.
