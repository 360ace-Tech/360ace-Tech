---
title: Short-lived Container Images
date: 2023-10-30
categories: [containers]
tags: [tools, containers]
author: ade
image:
  path: /blogs/img/container-images.png
  alt: Container Images
---
# Short-lived Container Images

Containerization has revolutionized software development and deployment, offering portability, scalability, and efficiency. The concept of short-lived container images has emerged, promoting the use of images with a limited lifespan. One notable goto tool in this space is [ttl.sh](https://ttl.sh/), a platform that facilitates the management of time-to-live (TTL) for container images serving as an anonymous ephemeral container image registry.

In scenarios where quick demos are needed or there is the need to reduce the complexity of authenticating to a registry or worrying about security complexities, this will come handy.

## Using [ttl.sh](https://ttl.sh/)

1. Tag the image with ttl.sh, a UUID, & time limit (i.e. :2h)

2. Push the image

3. Pull the image (before it expires)

Image tags provide the time limit. The default and max is 24 hours (valid time tags :5m, :1600s, :4h, :1d)

## Example

Using this is as simple as it can get. Take for an example a Dockerfile as below;

```Dockerfile
# Dockerfile
FROM busybox
RUN echo "Hello world" > /tmp/hello_world.txt
CMD ["cat", "/tmp/hello_world.txt"]
```

To build, push and run using ttl.sh you would use the following commands:

```bash
IMAGE_NAME=busybox-simple
docker build --tag ttl.sh/${IMAGE_NAME}:1m .
docker push ttl.sh/${IMAGE_NAME}:1m
```

## Scenario Usage

This usage of short-lived images is useful in scenarios where you want to quickly spin up a container for testing or debugging purposes inside a CICD pipeline without having to authenticate and push to a private repository.
Example github action workflow

```yaml
# ci-kind.yaml - source https://github.com/adekoyadapo/k8s-kind-github-action
on:
  push:
    branches:
      - main

jobs:
  Deploy-to-cluster:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Set Up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Build Docker Image
      run: |
        docker build -t ttl.sh/hello-world:5m .
        docker push ttl.sh/hello-world:5m

    - name: Create k8s Kind Cluster
      uses: helm/kind-action@v1.8.0
      with:
        version: v0.20.0
        config: cluster.yml
        cluster_name: static

    - name: Apply Kubernetes Manifest
      run: |
        kubectl apply -f pod.yml
        kubectl wait --for=condition=Ready pods --all

    - name: Check Pod NodePort
      id: check-nodeport
      run: |
        nodeport=$(kubectl get svc hello-world-service -o jsonpath='{.spec.ports[0].nodePort}')
        echo "The Hello World pod is accessible at NodePort: $nodeport"
        echo "nodeport=$nodeport >> $GITHUB_OUTPUT"
  
    - name: Check App with curl
      run: |
        nodeport="${{ steps.check-nodeport.outputs.nodeport }}"
        curl http://localhost:${nodeport}
```

This simple workflow from the [repo](https://github.com/adekoyadapo/k8s-kind-github-action) is an example where the container image in a simple kind cluster as part of a CI workflow.

For someone like me that leverage on quick demos, this has been an added advantage in a while now. You can visit this [repo](https://github.com/adekoyadapo/k8s-kind-github-action) to see how it works in a pipeline
