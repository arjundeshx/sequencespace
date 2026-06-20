---
layout: post
title: "Machine Learning for De Novo Molecular Design: RL-based SMILES Generation"
date: 2026-03-03
category: research
description: "This post is the first of three in a series covering different approaches within generative drug design using machine learning. This post will focus on advances in SMILES-based methods."
tags: [structural biology, machine learning, biophysics]
author: Arjun Deshpande
math: true
---

This post will focus on breaking down the SMILES-based RL strategy used by Olivecrona et. al in the paper ["Molecular De-Novo Design through Deep Reinforcement Learning"](https://arxiv.org/abs/1704.07555); it is the first in a series of posts that will explore different machine learning strategies that are being used by researchers for generation of compounds and the search of chemical space for promising drug candidates: future posts will cover latent space based approaches such as ChemVAE and structure/pocket-conditioned 3D generative models (diffusion/equivariant GNNs).

## The Drug Design Problem
A new drug candidate must satisfy a large number of criteria: not only must it have favorable bioactivity and affinity for its arget, but it must also be favorable in terms of its drug metabolism and pharamacokinetic (DMPK) profile, toxicity and synthetic accessibility. The chemical space of possible compounds is incredibly vast - **the goal of de novo computer-aided drug discovery (CADD) is to search this chemical space and pinpoint promising leads for testing**. 

Olivecrona et. al's paper outlines three historical approaches to this problem:
* Structure-based de novo design: these methods algorithmically "grow" a molecule inside a target binding pocket so that it fits geometrically. The issue with this approach is that resulting molecules are often hard to synthesize (low synthetic accessibility) or have poor DMPK properties.
* Ligand-based/rule-based deisgn: These approaches build a large virtual library of candidate compoudns using known chemical compounds or exprt-crafted transformation rules and then use machine learning to filter the library to a few lead compounds. The problem with this approach is that the results are constrained by the rigid rules used for the generation of the compounds in the virtual library, limiting the robustness of predicted compounds.
* Inverse QSAR: QSAR (Quantitative Structure-Activity Relationship) normally predicts properties from a structure. Inverse QSAR attempts the reverse task, starting from a desired property and finding the structures that land there using a QSAR model; this can be difficult because you need a representation of molecules that works well *both* property prediction and translating back into a real structure.

## Olivecrona et. al's Approach
Olivecrona et. al's work proposed a fourth approach: they used a recurrent neural network (RNN) for generation of molecules through SMILES strings, and fine tuned pre-trained RNNs using reinforcement learning motivated by similar work in other fields.

## Background: SMILES, RNNs and Reinforcement Learning 
## SMILES and Embedding Molecules
**SMILES** (short for **s**implified **m**olecular **i**nput **l**ine **e**ntry **s**ystem) strings are a text-based representation of molecular structure; for example, the structure of tyrosine, pictured below, would be expressed with the formula **`N[C@@H](CC1=CC=C(O)C=C1)C(O)=O`** in canonical SMILES.

![tyrosine_image]({{ '/assets/tyrosine.png' | prepend: site.baseurl }})

Here, letters represent atoms, numbers mark ringopening and ring-closing bonds (the number 1 appears twice; once in a ring-opening bond, and once in the bond that closes tyrosine's aromatic ring) and parentheses denote branches off of the main chain.

The paper employs a tokenization process on the model's vocabulary (SMILES strings from a large number of molecules from the ChEMBL database that comprise the model's training data); this produced **86 distinct tokens** where two-letter atoms (like Cl and Br) and bracketed groups (like nH, which represents an aromatic NH), count as one token.

Theese tokens were then one-hot encoded to embeddings (vectors with all zeros except for a 1 in the position corresponding to that token).

## Generating SMILES strings using RNNs

