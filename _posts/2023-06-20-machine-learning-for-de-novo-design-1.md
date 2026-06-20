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
