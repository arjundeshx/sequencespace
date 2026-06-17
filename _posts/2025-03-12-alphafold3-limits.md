---
layout: post
title: "AlphaFold 3 and the Limits of Structure Prediction"
date: 2025-03-12
category: research
description: "The latest AlphaFold release can now model nucleic acids and small molecules alongside proteins — but what does this mean for the field, and what can't it do?"
tags: [protein-folding, deep-learning, alphafold, structural-biology]
author: Your Name
---

When DeepMind released AlphaFold 2 in 2020, the structural biology community reacted with something between awe and existential crisis. A decades-old grand challenge — predicting protein 3D structure from amino acid sequence — had been, more or less, solved. The 2024 Nobel Prize in Chemistry made it official.

AlphaFold 3 (AF3) changes the question. Instead of asking *what shape does this protein fold into?*, it starts to ask: *how do biomolecules interact with each other?*

## What's new in AF3

The key architectural change is the move from a protein-only model to a **joint structure prediction model** that handles:

- Proteins
- DNA and RNA (single and double-stranded)
- Small molecules (ligands)
- Ions

This matters enormously. Drug discovery, for instance, fundamentally depends on protein-ligand interactions. Understanding gene regulation requires reasoning about protein-DNA binding. AF3 makes progress on all of these in a single forward pass.

The model uses a diffusion-based architecture rather than the invariant point attention (IPA) mechanism of AF2. Briefly: rather than predicting atomic coordinates directly, AF3 generates structures by learning to denoise random atomic configurations — the same class of approach that powers image generators like Stable Diffusion.

## What the numbers say

On the PoseBusters benchmark (protein-ligand docking), AF3 achieves ~76% success rate — substantially better than previous methods. On RNA structure prediction, it outperforms dedicated RNA-folding tools on most benchmarks.

The gains on antibody-antigen complexes are more modest and noisier. This is likely because such interfaces are inherently more flexible and the training data is sparser.

## What it still can't do

Here's the important caveat: **AF3 predicts static structures**. Proteins are not static. Conformational dynamics — the way a protein breathes, fluctuates, and switches between states — is central to function. Allosteric regulation, intrinsically disordered regions, and binding-induced conformational changes all live outside what a single-state prediction can capture.

There's also the question of **training data leakage**. The PDB is large but not infinite, and state-of-the-art models trained on it face real questions about whether benchmark performance reflects generalization or memorization of structurally similar entries.

> The model is excellent at interpolation within the space of known structures. Extrapolation to genuinely novel folds remains an open question.

## Implications for comp bio practice

Practically speaking, AF3 makes sense to reach for when:

1. You need a **first-pass structural model** of a protein complex or protein-ligand system
2. You're doing **hypothesis generation** before running MD simulations
3. You want to understand **which residues are at an interface** for mutagenesis design

It's less useful when you need to reason about protein dynamics, when you're studying IDPs, or when you need confidence estimates beyond what pLDDT provides (which is trained on structural agreement, not functional relevance).

## The bigger picture

AF3 represents a second phase in the AI-for-biology story. The first phase was about demonstrating that biological problems could be solved by ML at all. The second is about expanding scope: from single proteins to complexes, from structure to function, from isolated molecules to cellular context.

The remaining frontier is dynamics. Several groups are working on equivariant diffusion models that can sample conformational ensembles rather than point estimates. That's probably the next major capability jump — and it's not as far away as you might think.

---

*Jumping et al., "Accurate structure prediction of biomolecular interactions with AlphaFold 3", Nature 2024.* Full paper [here](https://www.nature.com/articles/s41586-024-07487-w).
