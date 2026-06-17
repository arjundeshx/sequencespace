---
layout: post
title: "Who Owns the Genome? Open Data, Commercial Interests, and the Future of Genomic Science"
date: 2025-01-08
category: commentary
description: "As genomic databases grow and commercial applications proliferate, the question of who controls biological data — and on whose terms — has never been more urgent."
tags: [data-policy, genomics, open-science, bioethics, industry]
author: Your Name
---

In the spring of 2023, 23andMe quietly updated its terms of service to allow aggregated genetic data to be used in pharmaceutical research partnerships. Around the same time, the UK Biobank renewed its commercial licensing framework, prompting a fresh round of debate about whether participants who donated biological samples understood what they were signing up for.

These aren't isolated incidents. They're symptoms of a structural tension that's been building for two decades, and that computational biologists sit right in the middle of: the collision between the open-science ideals that shaped genomics and the commercial realities that now fund a significant chunk of it.

## The genomic data landscape

Let's take stock of where things stand. The major genomic databases fall roughly into three categories:

**Publicly funded, open access.** The European Nucleotide Archive (ENA), NCBI's GenBank, and the Sequence Read Archive (SRA) hold petabytes of sequence data deposited as a condition of publication. Anyone can download a bacterial genome or a bulk RNA-seq dataset without restrictions. This infrastructure, funded mostly by NIH, Wellcome, and EMBL, is what makes computational biology possible as a field.

**Publicly funded, restricted access.** dbGaP, the UK Biobank, and the All of Us Research Program hold sensitive human genomic data with associated phenotypes. Access requires institutional approval, data use agreements, and varying restrictions on commercial use. The friction is intentional — these involve identifiable human data — but it creates real barriers for smaller research groups.

**Proprietary databases.** Regeneron's GnomAD contributions come with strings. 23andMe's 14 million genomes are a commercial asset. Genomics England and various pharma biobanks operate under frameworks where participating companies have data access privileges that academic researchers don't.

## The open-access tension

Here's the crux of the issue: genomic science was built on a norm of rapid, open data sharing. The Bermuda Principles (1996) established that human genome sequence data should be deposited publicly within 24 hours of generation. This was revolutionary. It's why the Human Genome Project succeeded as a genuinely public resource rather than a proprietary asset.

But that norm was established before genomic data became a trillion-dollar industry. Moderna, BioNTech, and countless drug companies now depend on reference databases that were built on the principle of open contribution. The question of whether they're giving enough back — in data, in revenue, in access to the medicines they develop — is genuinely contested.

The standard defense is that companies contribute data (they do, selectively), fund sequencing (they do, strategically), and that commercial development ultimately serves patients (sometimes). The critique is that the terms of contribution are increasingly asymmetric: publicly funded science provides the foundational datasets and algorithms, while commercial entities extract the value without proportionate return.

## The consent problem

Underneath all of this is a harder question: what did research participants actually agree to?

When someone joins the UK Biobank or 23andMe, they sign a consent form. But those forms are written in present tense, for a world that existed at signing. They cannot anticipate what will be computationally possible with that data in ten years. Researchers have demonstrated that ostensibly anonymized genomic data can be re-identified with public genealogy databases. The person who thought they were contributing to academic research on heart disease is now, potentially, part of a commercial drug discovery pipeline.

This isn't a small problem. A substantial fraction of genetic research involves data from people who were never asked — whose genomes are derivable from relatives who did participate. Indigenous communities have documented extensive harms from genomic data collected under the banner of research that was then used in ways that conflicted with their values and governance structures.

> The consent problem in genomics is not primarily about form design. It's about the fact that biological data has an indefinite shelf life and we are not good at imagining futures.

## What should we do about it

I want to be honest that I don't think there are clean answers here. Some things seem directionally right to me:

**Reciprocity frameworks.** If commercial entities profit substantially from public genomic infrastructure, there should be structured mechanisms for return — whether through data contribution requirements, licensing fees that fund public databases, or access agreements for medicines derived from those datasets.

**Dynamic consent.** Several groups are building infrastructure for consent that participants can update over time, that specifies downstream uses, and that allows withdrawal of data as practices change. This is harder than it sounds technically and socially, but it's the right direction.

**Community governance.** For data from specific populations — particularly historically marginalized ones — governance should involve those communities, not just institutions that recruited them. CARE principles (Collective Benefit, Authority to Control, Responsibility, Ethics) offer a framework, and several projects are starting to operationalize it.

**Regulatory clarity.** The patchwork of data protection laws (GDPR, HIPAA, various state laws) was not designed for genomic data. We need clearer rules about re-identification risk, secondary use, and what "de-identified" actually means when it can be re-identified.

## The comp bio position

Computational biologists are not passive observers of this landscape. We are the people who build the tools that make re-identification possible, who design the algorithms that pharmaceutical companies use, who train on public databases and publish methods that then get commercialized.

That puts us in a position of both complicity and potential influence. Choices about where we publish, how we license our tools, what datasets we validate on, and what policy conversations we participate in — these aren't politically neutral technical decisions.

I don't think there's a clean answer to who owns the genome. But I think we should be asking the question more explicitly, and more often, than we currently do.

---

*Further reading: Yudell et al. on the troubled concept of race in genomics; Garrison et al. on CARE Principles; Joly et al. on GDPR and genomic data.*
