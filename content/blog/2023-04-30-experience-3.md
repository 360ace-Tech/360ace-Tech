---
title: The Cloud Experience - Experience III
date: 2023-05-30
categories: [cloud, articles]
tags: [cloud, architecture, IaC]
author: ade
image:
  path: /blogs/img/iac.png
  alt: Infrastructure as Code
---

# Leveraging Infrastructure as Code (IaC) for Cloud Infrastructure Management

In the ever-evolving landscape of cloud infrastructure management, Infrastructure as Code (IaC) has emerged as a game-changing approach. By using IaC, organizations can define and manage their cloud infrastructure using code, enabling automation, consistency, and scalability across multiple cloud providers. In this article, I am going to explore the benefits of IaC and showcases examples of how tools like [`Terraform`](https://www.terraform.io/), [`Pulumi`](https://www.pulumi.com/), and [`Crossplane`](https://www.crossplane.io/) can help manage resources in Google Cloud, AWS, and Azure by creating a simple cloud storage.

## My experience

In my early days as a network engineer, I had to configure multiple devices like routers and switches with the intent to install them across various sites and locations. The tedious effort of having the core configurations as text based templates and changing the crucial values such as hostname and management IPs for the individual device became a monotonous task.

To reduce the effort and time, I resulted to configuring out-of-band management only and ensured the device reachability over the network, then with bash script, loop through the configuration and connect via ssh and deploy the configuration. This was later improved with python scripting and centralized management tools like [Cisco Prime](https://www.cisco.com/c/en_ca/products/cloud-systems-management/prime-infrastructure/index.html) and open source tools like [rancid](https://shrubbery.net/rancid/) and [oxidize](https://github.com/ytti/oxidized)

With on-premise system administration and day-to-day operations involving setting up bare-metals or virtual machines, virtual networking setup and more, a combination of IaC tools and desired state configuration (DSC) [^1] tools have been the goto to get things up and running.
Combining both tools have been a suitable step for successfully infrastructure deployment and management over the years.

>
**DSC vs IaC**<br />
**Scope**: DSC primarily focuses on configuring individual machines, while IaC manages the entire infrastructure stack, including networks, servers, and services.<br />
**Configuration vs. Provisioning**: DSC focuses on configuration management and ensuring desired state, while IaC encompasses both provisioning and configuration of infrastructure resources.<br />
**Tooling**: DSC is often associated with tools like PowerShell DSC, Ansible, Chef, Puppet, Dockerfile and Saltstack, while IaC is supported by various tools like Terraform, CloudFormation, ARM templates, Pulumi, Crossplane and Google Deployment Manager.

## Advantages of Infrastructure as Code

1. Automation: With IaC, infrastructure provisioning and management can be automated, reducing manual effort and potential human errors. Infrastructure changes can be easily and reliably replicated across development, staging, and production environments.
2. Consistency and Standardization: IaC enables the creation of reusable code modules and templates, promoting consistency and standardization across infrastructure deployments. By defining infrastructure as code, organizations can ensure that best practices, security policies, and compliance requirements are consistently applied.
3. Scalability and Flexibility: IaC tools allow for easy scaling of infrastructure resources. By defining the desired state of the infrastructure in code, organizations can effortlessly scale up or down as needed, accommodating changes in demand without manual intervention.
4. Multi-Cloud Support: IaC tools like `Terraform`, `Pulumi`, and `Crossplane` provide support for multiple cloud providers, including Google Cloud, AWS, and Azure. This flexibility allows organizations to adopt a multi-cloud or hybrid cloud strategy while maintaining a unified infrastructure management approach.

## Examples of IaC with Cloud Providers

- Creating Cloud Storage with Terraform:
  - Using Terraform, the following code snippet provisions a Google Cloud Storage bucket:
  
```hcl
resource "google_storage_bucket" "example_bucket" {
  name     = "example-bucket"
  location = "us-central1"
}
```

- Deploying Resources with Pulumi:
  - Using Pulumi, the following TypeScript code deploys an AWS S3 bucket:
  
```typescript
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("example-bucket", {
  acl: "private",
});
```

- Managing Resources with Crossplane:
  - Crossplane extends Kubernetes to manage cloud infrastructure. The following YAML snippet creates an Azure Blob Storage container using a Crossplane Azure Provider:

```yaml
apiVersion: storage.azure.crossplane.io/v1alpha3
kind: BlobContainer
metadata:
  name: example-container
spec:
  azureProviderRef:
    name: example-provider
  resourceGroupName: my-resource-group
  storageAccountName: my-storage-account
```

## Conclusion

Infrastructure as Code (IaC) revolutionizes cloud infrastructure management by providing automation, consistency, and scalability. These tools can empower organizations to define and manage their infrastructure using code, simplifying the provisioning and configuration process.

With IaC, organizations can achieve greater agility, reduce errors, and efficiently manage resources across multiple cloud providers like Google Cloud, AWS, and Azure. Embracing IaC is a key step towards modernizing cloud infrastructure management practices and driving digital transformation in the cloud era.

I have leveraged IaC tools to quickly setup PoC environments for quick presentations, create multiple cloud environments, updating environments by integrating with DevOps tools for version control [^2] and CICD [^3] well that is an entirely different adventure.

[^1]: [DSC](https://www.upguard.com/blog/configuration-management-tools)
[^2]: [version control](https://www.atlassian.com/git/tutorials/what-is-version-control#:~:text=Version%20control%2C%20also%20known%20as,to%20source%20code%20over%20time.)
[^3]: [CICD](https://www.redhat.com/en/topics/devops/what-is-ci-cd#:~:text=CI%2FCD%20is%20a%20method,continuous%20delivery%2C%20and%20continuous%20deployment.)
