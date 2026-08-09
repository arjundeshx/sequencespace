---
layout: post
title: "Equivariant Neural Networks and Structural Biology"
date: 2026-08-09
category: research
description: "Ever wondered how equivariant neural networks are used in deep learning models such as AlphaFold and RFDiffusion? This post will provide a conceptual overview of equivariant neural networks and dive into how they are used in structural biology and computer-aided drug discovery efforts!"
tags: [structural biology, machine learning, biophysics]
author: Arjun Deshpande
math: true
---

## What is Equivariance?

Equivariance is when the output of a step or architecture changes by some operation by an equivalent amount when the input is altered by that same operation by an amount. For example, convolutions are translationally equivariant, because if an image is shifted over by some amount, then the result of the feature map is the same, except it is shifted over by an equivalent amount.

Equivariance is NOT the same thing as invariance, however, which is when a transformation to the input produces NO (rather than equivariant) change in the output.

## Why are Convolutions Translationally Equivariant?

Simple convolutions can be expressed mathematically as:

$$[f * k](x) = \sum_{y \in \mathbb{Z}^2} \sum_{i=1}^{I} f_i(y)k_i(x-y)$$

where f represents the input image, k represents the kernel and f * k represents the convolution operation; [f * k](x) is the value of the convolution output at some point x. This value is defined in a convolution as the sum across all positions y in the input image for the sum across all I channels of f_i(y), which represents the value of the input image at a certain channel, times k_i(x-y), which represents the value of the kernel (kernel weight) at that channel at a given offset x - y between the input and output positions. If y is close to x, you are reading the weight close to the center of the kernel (as x - y is close to zero), while if y is far from x, you are reading the weight towards the edge of the kernel.

With that mathematical definition of a convolution out of the way, we can begin to deconstruct why convolutions are translationally equivariant.

Supposing that $$T_a$$ translation by some value $$a$$, for the convolution to be translationally equivariant would the following:

$$[T_af * k] = T_a[f * k]$$

In other words, applying the translation to the input and then performing a convolution should yield the same result as performing the convolution first on the original image and then applying the translation on the output of the convolution step.

Let's try to follow the left side of the equation mathematically.

Define some translated image $$f'$$ such that $$f' = T_af$$ so that $$f'(y) = f(y - a)$$

Using our convolution formula from earlier, we realize that this means that:
$$[f' * k](x) = \sum_{y \in \mathbb{Z}^2} \sum_{i=1}^{I} f_i(y-a)k_i(x-y)$$

Let's now define some $$y'$$ where $$y' = y - a$$ (so $$y = y' + a$$). If we substitute in $$y'$$ to the earlier equation, we obtain:

$$[f' * k](x) = \sum_{y \in \mathbb{Z}^2} \sum_{i=1}^{I} f_i(y')k_i(x-y'-a)$$

You might notice that this is actually the exact same thing as [f * k](x-a), and since $$T_a[f * k] = [f * k](x-a)$$ we establish that convolutions are translationally equivariant!

## General Group Convolutional Networks (G-CNNs)


## SE(3) Equivariant Architectures 
