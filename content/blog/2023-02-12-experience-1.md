---
title: The Cloud Experience - Experience I
date: 2023-02-12
categories: [cloud,cloud-technology]
tags: [cloud, architecture, articles]
author: ade
---

# Cloud Infrastructure Architecture - Experience I

## Introduction

There are several key lessons that can be learned from cloud infrastructure architecture, and over the years it has been a huge achievement towards setting up businesses for success on their infrastructure modernization journey.
This is going to be a series of experience that have been employed, which might consist of [_gotchas_] that you only get to see when implementing some of these designs and business cases.
The key lessons can be summarized into 5 main categories, but they vary based on the scenario that the business is in at that very point.

1. **Scalability:** Cloud infrastructure architecture is designed to be highly scalable, meaning it can accommodate changing demand without disruption to the system. This is achieved through the use of elastic resources that can be added or removed as needed.
2. **Flexibility:** Cloud infrastructure architecture is highly flexible, allowing for customization and configuration to meet the specific needs of different applications and workloads.
3. **Reliability:** Cloud infrastructure architecture is built with high availability and fault tolerance in mind, minimizing downtime and ensuring business continuity.
4. **Security:** Cloud infrastructure architecture includes multiple layers of security, such as firewalls, encryption, and identity and access management, to protect against unauthorized access and data breaches.
5. **Cost Optimization:** Cloud infrastructure architecture is designed to optimize costs by leveraging resources only when needed and avoiding over-provisioning. This allows for a more efficient use of resources and a reduction in overall costs.

>Overall, the key lesson from cloud infrastructure architecture is that it offers a highly efficient, flexible, and scalable solution for managing IT resources. By leveraging cloud infrastructure architecture, organizations can improve their operations, increase their agility, and drive innovation.

## Early architectural adoption

One of the early projects I was involved in around 2015 which entails setting up an externally accessible Active directory on an IaaS platform so that remote users can still authenticate, receive security polices and or connect to cloud based server farm and web application servers, was filled with a lot of irregular architectural designs with little to no proper planning due to the urgency of the project.

![Hybrid Active Directory](../../blogs/img/hybrid-AD.png)
_Hybrid AD setup_

### Limitations

In a nutshell a lot was wrong in this project, looking at it years later and just to summarize a few -

#### Technology

In recent times, this architecture can be simplified with Federated Identity and **Managed Active Directory** services - <u>highly available, scalable managed Microsoft Active Directory</u> which are now offered by most cloud providers. As the number of users grew with the previous design, the need to add more domain controllers became paramount, adding to the operational overhead.

#### Foundational Architecture

Over the years, I have found the need to leverage on a proper cloud foundation architecture, which entails setting up basic, security, networking and policies before deploying resources into the cloud platform.
With the above setup, one major security issue was the exposing of the Domain controllers to the internet, though a lot was put into locking it down to certain IPs, but early cloud services did not have an SDN - [_software defined networking_](https://en.wikipedia.org/wiki/Software-defined_networking) and made network isolation a little difficult to achieve unlike today.
Also, the use of VM based software VPN like [softether](https://www.softether.org/), [strongswan](https://www.strongswan.org/), was the only way to implement site-to-site VPN connections and believe me when I say it was not a walk in the park to set up with Cisco ASA devices. There were the usual bugs, tunnel timeouts that occur on regular basis and sometimes the bandwidth was not sufficient enough, and it just breaks the connection.

### The future

Some of the limitations mentioned are a thing of the past with most providers, you can depend on foundational blueprints, sample architectures and cloud adoption strategies provided by most cloud providers. A typical example is the [AWS well-architected framework](https://aws.amazon.com/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate&wa-lens-whitepapers.sort-order=desc&wa-guidance-whitepapers.sort-by=item.additionalFields.sortDate&wa-guidance-whitepapers.sort-order=desc) which details how to build secure, high-performing, resilient, and efficient infrastructure for a variety of applications and workloads.

## Summary

This is going to be in series with more highlights into the best practices adopted, mistakes made, and corrective measure put in place over the years of deploying cloud workloads.<br />
Majority of the cloud service providers actually have provided robust documentations that I have really leveraged on in many consultancy activities and implementation projects I have been part of and believe me they are really helpful.<br />
More insightful information will be shared on this journey, so stay tuned...
