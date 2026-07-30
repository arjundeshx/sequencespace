---
layout: post
title: "Protein Origami: RFDiffusion Explained"
date: 2026-07-30
category: research
description: "An overview of the algorithms and machine learning techniques used by RFDiffusion, a model created by David Baker's lab at the University of Washington for de-novo protein design, co-recipient of the 2024 Nobel Prize in Chemistry. This post is the first of a two-part series covering the theory behind AlphaFold and RFDiffusion."
tags: [structural biology, machine learning]
author: Arjun Deshpande
math: true
---

This post wil be part of a larger series that I have flavorfully named "protein origami" which will focus on the use of machine learning techniques for both protein structure prediction (i.e AlphaFold) and de-novo protein design (i.e RFDiffusion; this is what this post will focus on). I chose to start with RFDiffusion and not the more popular AlphaFold, since I just think that RFDiffusion is a super underappreciated piece of technology that I thought was absolutely mind blowing when I first heard of it.

I would highly reccomned checking out ["David Baker's Nobel Prize Talk"](https://www.youtube.com/watch?v=KbDvQgsOI-E) if you are interested in a brief overview of the work and its impact (this is what first got me interested in de-novo protein design). If you would like to learn more, I would also reccomend checking out ["this video"](https://www.youtube.com/watch?v=wIHwHDt2NoI) by Joe Watson and David Juergens on the project, as well as the ["paper published on RFDiffusion in Nature"](https://www.nature.com/articles/s41586-023-06415-8)
