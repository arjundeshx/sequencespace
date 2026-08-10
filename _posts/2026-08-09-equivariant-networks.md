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
To understand equivariance, we need to understand the mathematical definition of a group: a group is a pair $$(G, \cdot)$$ of a set $$G$$ and a binary operator $$\cdot$$. The binary operator is a rule for combining two elements of the set G that yields another element of G, formally written as $$\therefore G \times G \rightarrow G$$. The elements of G for our purposes represent transformations (like different translations, or rotations by different amounts), and the binary operator represents a way to compose those different transformations in succession.

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

where $$f$$ represents the input image, $$k$$ represents the kernel and $$f * k$$ represents the convolution operation; $$[f * k](x)$$ is the value of the convolution output at some point x. This value is defined in a convolution as the sum across all positions $$y$$ in the input image for the sum across all $$I$$ channels of $$f_i(y)$$, which represents the value of the input image at a certain channel, times $$k_i(x-y)$$, which represents the value of the kernel (kernel weight) at that channel at a given offset $$x - y$$ between the input and output positions. If $$y$$ is close to $$x$$, you are reading the weight close to the center of the kernel (as $$x - y$$ is close to zero), while if $$y$$ is far from $$x$$, you are reading the weight towards the edge of the kernel.

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

## Group Convolutional Networks (G-CNNs)

G-CNNs use a more general formula for any group, g, that corresponds to any set of transformations (instead of just having translations, represented by x (the output position, also how much the kernel is translated by) in our earlier basic CNN formula, we use g, which represents any group of transformations). For example, g could represent rotations (which are typically expressed in matrix form). Here, kernels are not only being translated but transformed by the actions in the group.

This yields a more general group convolution formula that is equivariant to transformations belonging to the group g.

$$[f * k](g) = \sum_{y \in \mathbb{Z}^2} \sum_i f_i(y)k_i(g^{-1}(y))

Here, the inverse transformation applied to y (which is the input position) to find an offset analogous to x-y in the formula for the simple CNN. $$g^{-1}(y)$$ is really just asking, if I undo the transformation applied to the kernel on a pixel, where does the pixel line up relative to the kernel's own reference frame? Really weird to wrap your mind around, I know.

To get a better picture of what's actually going on here, let's take the example of the group g = p4 (2D translations and 90 degree rotations). A group convolution equivariant to this group would not only pass a kernel over the entire image, it would pass a 90 degree rotated version, a 180 degree rotated version and a 210 degree rotated version as well. This would generate four 2D maps together in the group space. This stack of 2D maps is now equivariant to translation and 90 degree rotation! If the input is translated, the output on each of the four 2D maps will get translated as well (as in a vanilla CNN), but if we have a 90 degree rotation, all that happens is the four different 2D maps get re-labeled/cyclically shifted around the rotation channel (which has dimension length of 4 in this case). This way, if you were trying to detect an object in the image that was rotated 90 degrees, you would still have the same four feature maps (although in a different, equivariant order) as output, meaning that the model does not have to re-learn to account for rotation!

The combination of different groups (like translation and rotation) is called a semi-direct product; the SE(2), standard euclidean group in 2D, is the semi-direct product of 2D translation and 2D rotation. SE(2) group convolutions are often referred to as "lifting layers" since they lift 2D inputs into 3D feature maps with a rotation dimension; these rotationally equivariant operations are useful in medical imaging tasks, where segmentation and classification targets are often rotated randomly.

While these 3D feature maps are rotation equivariant, in medical imaging tasks, the 3D maps are often compressed to 2D by applying a max pooling operation across the rotation dimension, $$\theta$$, which makes the final 2D map **rotation invariant** (which, for aforementioned reasons, can be a very helpful property).

Note that these groups are currently discrete, and as you can imagine, the rotation dimension would increase indefinitely as we approach groups that define continuous transformations (i.e something like continuous rotation). Steerable CNNs (paper linked [here](https://arxiv.org/pdf/1612.08498)), developed by Taco Cohen and Max Welling, get around this problem and allow for continuous transformations, but that isn't something we'll discuss in too much depth here. Steerable CNNs allow us to be truly equivariant to continuous spaces like SE(2) without discretizing into small pieces or increasing computational cost for accuracy (discretized group convolutions are only exact for the transformations in the group; i.e p4 is only exact for 90 degree rotations, and p8 for 45 degree rotations, and so on, thus they only provide an approximate solution).

There is just so, so much more theory that goes into equivariant neural networks (including things like harmonic networks, 3D steerable CNNs, capsule networks, etc.), and I advise you to learn more about them if you're interested, I will provide some resources that I thought were interesting at the end of this blog post.

Let's put the theory aside for now though, and approach the applications of equivariant neural networks in structural biology (namely, in AlphaFold 2) using the fundamental understanding of equivariance that we've just developed.

## Equivariance in AF2
Proteins do not have a single correct orientation (protein folding cares about the relative positions of atoms with respect to each other, not their absolute position). A protein can be globally rotated or translated in a coordinate system and yet be the same thing functionally - any model that predicts 3D protein structure must respect this invariance.

AlphaFold2 achieves this by implementing a mechanism called **Invariant Point Attention (IPA)** in its structure module. IPA gives every residue its own local 3D reference frame, a position and orientation in space. Residues then attend to each other using geometric quantities like distance and relative orientations between these reference frames rather than raw coordinates. This makes the attention mechanism invariant to global rotation and translation, it also makes the coordinate updates the network produces SE(3) equivariant (they rotate and shift correctly with the frame). The advantage to this is that AlphaFold2 doesn't have to waste model capacity learning that proteins and their rotated/translated copies are equivalent, leaving more of the architecture to focus on patterns with real structural and chemical relevance.

## Equivariance in RFDiffusion

RFDiffusion generates new protein structures using a diffusion model, denoising a random 3D structure until it arrives at a valid protein backbone. Its architecture too builds upon the same frame based mechanism used by AlphaFold2 and its counterpart RoseTTAFold.

At every denoising step, the nework looks at a noisy 3D structure and predicts how to update that noisy structure so that it gets closer to a realistic protein backbone (as a diffusion model would). If the noisy structure is rotated, the predicted denoising or "cleanup" step should rotate correspondingly with it. If this wasn't the case, the model would need to treat every possible orientation of the exact same noisy structure distinctly, making each rotated and translated structure a totally distinct problem to solve. Without SE(3) equivariance, the denoiser would need to learn how to cleanup every rotated copy of every training example, as there is no way to know in advance which orientation a given noisy input will happen to be in.

SE(3) equivariance allows the model to extrapolate the cleaning step from one noisy structure to all of its SE(3) equivalents, produced by applying rotations and translations, dramatically reducing the effective size of he learning problem and helping the model generalize really well from limited structural data to produce novel, sensible protein designs.

So evidently, equivariance plays a huge role in machine learning methods for molecular and structural biology, and through our exploration of SE(3) equivariance in structure-based models (both for structure prediction, like AF2, and de-novo generation, like RFDiffusion), maybe you can start to see why. Equivariance is also hugely important to models dealing with molecules being represented as graphs, and de-novo generative models used for drug design (I came across equivariant neural networks recently when I was reading a paper on a diffusion model for the generation of PROTAC linkers!).

It is impossible to cover all of the technical detail associated with equivariant neural networks in a single blog post (and all of the numerous applications in mol bio), but I will have future posts that do a deep dive into models like RFDiffusion, RoseTTAFold and the different iterations of AlphaFold. For now, however, I would like to recommend a few resources that I found helpful.

## Additional Resources 
- [DeepFindr's video series on equivariant neural networks](https://www.youtube.com/watch?v=2bP_KuBrXSc&t=1s) (DeepFindr in general is super awesome for learning machine learning stuff - he's helped me out a ton)
- Relevant chapters from [Deep Learning for Molecules and Materials](https://dmol.pub/index.html)

