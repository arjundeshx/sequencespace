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

## SMILES, RNNs and Reinforcement Learning 
## SMILES and Embedding Molecules
**SMILES** (short for **s**implified **m**olecular **i**nput **l**ine **e**ntry **s**ystem) strings are a text-based representation of molecular structure; for example, the structure of tyrosine, pictured below, would be expressed with the text **`N[C@@H](CC1=CC=C(O)C=C1)C(O)=O`** in canonical SMILES.

![tyrosine_image]({{ '/assets/tyrosine.png' | prepend: site.baseurl }})

Here, letters represent atoms, numbers mark ringopening and ring-closing bonds (the number 1 appears twice; once in a ring-opening bond, and once in the bond that closes tyrosine's aromatic ring) and parentheses denote branches off of the main chain.

The paper employs a tokenization process on the model's vocabulary (SMILES strings from a large number of molecules from the ChEMBL database that comprise the model's training data); this produced **86 distinct tokens** where two-letter atoms (like Cl and Br) and bracketed groups (like nH, which represents an aromatic NH), count as one token.

Theese tokens were then one-hot encoded to embeddings (vectors with all zeros except for a 1 in the position corresponding to that token).

The paper trained its model on **the RDKit canonical SMILES of 1.5 million structures from ChEMBL**; molecules are essentially graphs, and SMILES traverses them in a sequential way, so there are often many different valid ways to represent the same molecule using SMILES by traversing the molecular graph in a different order. This adds additional complexity to the task that the model has to learn (would require the model to learn that differing representations can mean the same thing) - to avoid this problem, a **canonicalization algorithm** is used, which produces a single, deterministic, text-based representation from one molecule called the **canonical SMILES**.

## Generating SMILES strings using RNNs
RNNs are neural networks designed for sequences, and in this paper, they are used for next-token prediction given a SMILES string. Architectures like LSTMs and GRUs are typically used to avoid the exploding/vanishing gradient problem when working with RNNs (since backpropagation through time involves multiplying many gradient terms together); this paper uses GRUs for SMILES generation (3 layers, 1024 units each). An RNN can then be fed a start token **`GO`** and be used to generate a SMILES string, which ends when it predicts the next token to be the end-of-string **`EOS`** token.

Training of the RNN is chieved through **maximum likelihood estimation** which aims to maximize the likelihood that the model assigns to the corect token when predicting a probability distribution over what the next character is likely to be.

The RNN/GRU model produced by initial training is called the **Prior**. **94% of sequences produced by the Prior model in this study were valid molecular structures, and 90% of those were novel structures outside of the training set** demonstrating the capability of this method to predict novel molecular structures that remain valid. This means that the model has learned "chemical rules"; for example, it knows that once it opens an aromatic ring with a number, it "expects" to eventually close that ring with a matching number.

## Reinforcement Learning
Before we delve into how this paper uses RL, an overview of a few RL basics;
* An agent in some state **`s`** chooses an action **`a`** according to a **policy** **`π(a|s)`** receiving a reward **`r`** based on its action and state.
* The return **`G`** is the cumulative reward over an episode. The goal of RL is to learn a policy which maximizes the expected return.
* A task with a clear end-point, such as SMILES string generation, which terminates when a **`EOS`** token is sampled, is called an **episodic task**.

The authors chose to use policy-based RL because they wanted to learn *stochastic* policy, creating a diverse generative model that predicts a robust variety of compounds. The Prior (RNN) provided a pretrained policy that could be fine tuned, and episodes (the generation of one SMILES string) were short and easy to sample, reducing the downsides (high variance) that policy gradient methods usually suffer from.

## Fine Tuning the Prior with Reinforcement Learning and "Augmented Likelihood"
The first task attempted by Olivecrona et al. was generating valid molecules without sulfur. They defined a scoring function **`S(A)`** that rates how desirable a complete episode is (e.g. +1 if the generated molecule does not contain sulfur, -1 if it does). However, using naive [REINFORCE](https://www.geeksforgeeks.org/machine-learning/reinforce-algorithm/), the agent "cheats" and finds trivial solutions to this task, such as always outputting carbon (C); this satisfies the no-sulfur condition, but is chemically nonsensical.

To get around this problem, the authors defined **augmented likelihood**, a metric that combines the Prior's opinion of how "chemically sensible" a molecule is and the scoring function. The augmented likelihood is given by:

$$\log(P(A)_U) = \log(P(A)_{Prior}) + \sigma \cdot S(A)$$

where:
- $S(A)$ is the scoring function
- $\sigma$ is a coefficient
- $\log(P(A)_{Prior})$ is the **log probability that the original, frozen, Prior network assigns to generating exactly this sequence**

Since the RNN generates sequences token by token, the probability of a whole sequence is the product of the conditional probabilities of each token:

$$P(A)_{Prior} = \prod_t \pi_{Prior}(a_t \mid s_t)$$

Taking the log turns that product into a sum:

$$\log P(A)_{Prior} = \sum_t \log \pi_{Prior}(a_t \mid s_t)$$

The return is defined as the negative of the disagreement between the **agent's likelihood** for a sequence and the **augmented likelihood**:

$$G(A) = -\left[\log(P(A)_U) - \log(P(A)_{Agent})\right]^2$$

The agent is trained to minimize a loss given parameters theta where:

$$L(\Theta) = -G$$ 

This means that the agent shoudl generte good scoring sequences but with similar frequency to what the augmented "ideal" distribution suggests, discouraging it from converging to one single trivial sequence, preserving both the diversity and chemical validity captured by the prior.

## Task 2: Generating Analogous of Celecoxib
The authors then extended this method to a different, non-binary goal: generating compounds similar to a reference drug, Celecoxib.

### Molecular Fingerprints and Tanimoto/Jaccard Similarity
The authors compared molecules by converting them to **fingerprints** (binary vectors encoding the presence or absence of certain features e.g extended connectivity fingerprints/ECFPs or functional class fingerprints/FCFPs which you can read more about [here](https://medium.com/@musicalchemist/from-theory-to-code-a-deep-dive-into-molecular-extended-connectivity-fingerprints-ecfps-with-da1ed436925e)). The Jaccard/Tanimoto similarity is then used to quantify the similarity between the two fingerprints.

### Scoring Function
The scoring function for this task was defined as:

$$S(A) = -1 + 2 * min(J, k) / k$$

Which rewards similarity up to some similarity threshold k, at which point it saturates (this defines how similar you want generated molecules to be to Celecoxib).

This scoring function is inputted into the standard augmented likelihood formula to compute returns as done in the previous sulfur elimination task. The authors trained the agent with k=1 (maximal similarity to Celecoxib) and the Agent was able to converge to generating Celecoxib itself exactly within ~200 steps.

This was fairly easy, since Celecoxib itself and its analogues are already in the ChEMBL data used to train the prior. To test model robustness, the authors constructed a **reduced Prior** which is like a handicapped prior model that is trained on ChEMBL data with **all compounds similar to Celecoxib (Jaccard >0.5) removed from the dataset**. 

**Remarkably, the Agent still rediscovers Celecoxib** even though it has never seen anything like it during pretraining. This result shows that RL fine-tuning can push models into new regions of the chemical space that were not just memorized from the training distribution: truly novel ligands can be generated to satisfy a target.

Setting k=0.7 (lower than 1) was able to generate a diverse array of non-exact analogoues - this generation of similar compounds can be useful for actual drug discovery.

## Task 3: Generating Molecules That Are Active Against Dopamine Receptor DRD2



