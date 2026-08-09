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

## What is Equivariance, And Why is it so Important?

Equivariance is when the output of a step or architecture changes by some operation by an equivalent amount when the input is altered by that same operation by an amount. For example, convolutions are translationally equivariant, because if an image is shifted over by some amount, then the result of the feature map is the same, except it is shifted over by an equivalent amount.

Equivariance is NOT the same thing as invariance, however, which is when a transformation to the input produces NO (rather than equivariant) change in the output.

Equivariant neural networks can be extremely helpful when we want to take advantage of **symmetries** in our data. For example, if we have an image classifier that is meant to identify images of animals, this property of translation equivariance possessed by convolutional neural networks might be helpful. For example, if a dog is in the top left corner of an image, versus if it is at the bottom right, it is still a dog, therefore we want the neural network to produce the same output with respect to translation symmetry (we might not want full invariance however, in case we want to localize what part of the image corresponds to the dog). In this case, a translationally equivariant architecture would generalize better and be more data efficient, as it would learn to recognize dogs translated from the positions that it encountered in its training dataset. 

A similar effect can be achieved through the practice of data augmentation, which essentially causes a model to "learn equivariance" although it might not be built into the architecture; for example, CNNs are not rotationally equivariant, but passing in data with random rotation augmentations applied could cause the network to learn to be equivariant despite not being truly equivariant. Research has demonstrated however, that in many cases, models that are truly equivariant perform better, are more efficient and are better able to take advantage of symmetries than those that learn equivariance through extensive image augmentation.

## Equivariance and Group Theory
To understand equivariance, we need to understand the mathematical definition of a group: a group is a pair $$(G, \cdot)$$ of a set $$G$$ and a binary operator $$\cdot$$. The binary operator is a rule for combining two elements of the set G that yields another element of G, formally written as $$\therefore G \cross G \rightarrow G$$. The elements of G for our purposes represent transformations (like different translations, or rotations by different amounts), and the binary operator represents a way to compose those different transformations in succession.

Groups must obey four axioms:
- Closure - output of composition/binary operator never leaves the group (always yields another element within the group)
- Associativity - operations are associative (order does not matter)
- Identity - an identity element exists, keeping all elements inside the group (i.e an element exists that produces no change, such as a zero degree rotation or a translation by zero)
- Inverse - every element of the group has an inverse element (if a 90 degree rotation exists in the group, so does a -90 degree rotation)

We usually define neural networks as equivariant with respect to a certain symmetry group (for example, the group that contains all translations).
Some useful shorthand for groups to know:
- T: all 2D translations
- p4: 90 degree rotations + translations in 2D
- SO(3): Special Orthogonal Group in 3D (includes 3D rotations)
- SE(3): Special Euclidean Group in 3D (includes 3D rotations + 3D translations)

## An Overview of the Applications of Equivariant Neural Networks in Biology 

### SE(3) Equivariance
Equivariance to 3D rotations and translations (termed SE(3), or Special Euclidean 3, equivariance) are important to tools in structural biology; in fact, it was an SE(3) equivariant transformer architecture that was responsible for the huge improvement of AlphaFold 2 upon AlphaFold 1 and earlier iterations. 

### G-CNNs
Group Convolutional Neural Networks (G-CNNs) are equivariant to a mathematically defined group (G), which can include not only translations, but other geometric operations such as certain rotations and reflections. These G-CNNs have proved to be higher performing and more data efficient when applied to biomedical imaging and histopathology tasks. 

### RC-CNNs
DNA double helices also have symmetry because of complementarity of strands! Some models that deal with DNA data are this RC (reverse-complement) equivariant.

Graph neural networks also often incorporate equivariance; this can be useful for models that deal with the chemical structures of drug molecules (often represented as graphs).

Before we go into more complex topics like SE(3) equivariance and its applications in AlphaFold 2, let's first take a deeper look at the mathematical basis of equivariance in convolutions.

## Why are Convolutions Translationally Equivariant?

Simple convolutions can be expressed mathematically as:

$$[f * k](x) = \sum_{y \in \mathbb{Z}^2} \sum_{i=1}^{I} f_i(y)k_i(x-y)$$

where f represents the input image, $$k$$ represents the kernel and $$f * k$$ represents the convolution operation; $$[f * k](x)$$ is the value of the convolution output at some point x. This value is defined in a convolution as the sum across all positions $$y$$ in the input image for the sum across all $$I$$ channels of $$f_i(y)$$, which represents the value of the input image at a certain channel, times $$k_i(x-y)$$, which represents the value of the kernel (kernel weight) at that channel at a given offset $$x - y$$ between the input and output positions. If $$y$$ is close to $$x$$, you are reading the weight close to the center of the kernel (as $$x - y$$ is close to zero), while if $$y$$ is far from $$x$$, you are reading the weight towards the edge of the kernel.

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
