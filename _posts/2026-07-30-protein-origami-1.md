---
layout: post
title: "Protein Origami: Early Attempts at Protein Structure Prediction"
date: 2026-07-30
category: research
description: "This is the first post of a (really) exciting series on protein structure prediction and de-novo protein design using deep learning methods! We are going to start this series by covering the protein folding problem and some early attempts at solving it by breaking down the AlphaFold 1 paper. Subsequent posts will cover more sophisticated/modern models for protein folding that build off of this foundation, as well as models like RFDiffusion which are used in the de-novo generation of protein sequences that perform a certain functiom."
tags: [structural biology, machine learning]
author: Arjun Deshpande
math: true
---

This post will be the first of many (around 5-6 to be exact, I think) that will provide an overview of the recent developments in protein folding and de-novo protein generation. This post, the first of the series, will cover the earlier AlphaFold 1 model, an initial approach to tackling this problem that I have flavorfully chose to name "protein origami". When I first tried learning about how AlphaFold worked, it was super confusing! (and it was doubly confusing when I tried to tackle models like RFDiffusion), so hopefully this series of posts serves you well in demystifying this hugely important but rather dense area of research.

So, the paper that I will break down in this post to provide a foundation for the rest of our exploration will be "Improved Protein Structure Prediction Using Potentials From Deep Learning" by Senior et. al (AlphaFold 1), which I have linked ["here"](https://nature.com/articles/s41586-019-1923-7).




