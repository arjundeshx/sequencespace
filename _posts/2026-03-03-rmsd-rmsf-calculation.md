---
layout: post
title: "Getting Started with MDTraj and MDAnalysis: Calculating RMSD and RMSF"
date: 2026-03-03
category: tutorial
description: "A practical introduction to generating RMSD and RMSF plots from molecular dynamics trajectories and performing alignment in a memory-efficient manner using the MDTraj and MDAnalysis Python libraries."
tags: [structural biology, python, molecular dynamics, biophysics, tutorial]
author: Arjun Deshpande
math: true
---

When analyzing large molecular dynamics (MD) trajectories, it can be difficult to make sense of the data. The easiest and simplest ways to get started analyzing and comparing the movement of proteins is by generating plots for root mean square deviation (RMSD) and per-residue root mean square fluctuation (RMSF).

**Prerequisites:** Python 3.9+, basic familiarity with NumPy/pandas, and a basic understanding of molecular dynamics trajectory and topology data.

## What is RMSD?

RMSD is a measure of the distance from a conformation of a biomolecule (e.g a protein) from a reference structure. RMSD calculations measure the three dimensional distance between reference atoms and atoms in a particular frame, aggregating the squares of distances across all atom pairs and obtaining the square root (eliminating any negative movements; RMSD is unsigned). **RMSD is useful in evaluating conformational changes in proteins throughout simulations;** different conformations typically appear as different plateaus on a RMSD vs. time graph.

## Memory Issues with MDTraj

By default, MDTraj loads in the entire trajectory to system RAM (when using function **`md.load()`**) - this is problematic for most systems are trajectories are often too large in size to be stored in the system memory. The **`md.iterload()`** method can be used to load trajectories in chunks to avoid filling out the memory.

## Code for RMSD Calculation
We begin by importing necessary libraries and defining paths for a MD trajectory and its associated topology.
```python
import mdtraj as md
import numpy as np
import matplotlib.pyplot as plt

example_trajectory = "/path/to/example_traj.dcd"
example_topology = "/path/to/example_top.psf"
```

Next, we build a compute RMSD function; the frame_interval_ps parameter defines the interval at which frames are appended to DCD file (used to convert frames to time); when running MD simulations with OpenMM, this parameter is specified when creating a DCDReporter object. 

This function computes RMSD for the alpha carbons of a protein (which are specified witht the **`.select()`** and **`.atom_slice()`** methods) - RMSD is computed with respect a reference structure, which in this case is set to the first frame of the DCD file. In order to eliminate the influence of global translation and rotation on RMSD **each frame must be aligned to the reference alpha carbons before RMSD is calculated**, which is achieved with the **`.superpose()`** method.

```python
def compute_rmsd(traj_file, top_file, frame_interval_ps=50.0, chunk_size=10):
    # load topology and reference, select alpha carbons
    top = md.load_topology(top_file)
    ca = top.select("protein and name CA")
    ref = md.load(traj_file, top=top_file, frame=0)
    ref_ca = ref.atom_slice(ca)

    # create chunk aggregators and counters
    rmsd_values = []
    time_values = []
    frame_counter = 0

    # load chunks of trajectory
    for chunk in md.iterload(traj_file, top=top_file, chunk=chunk_size):
         # select alpha carbons and align
         chunk = chunk.atom_slice(ca)
         chunk.superpose(ref_ca)

         # calculate RMSDs
         rmsd_chunk = md.rmsd(chunk, ref_ca)
         n = chunk.n_frames
         time_ps = np.arrange(frame_counter, frame_counter + n) * frame_interval_ps
         time_ns = time_ps / 1000.0

         # append RMSD and time values and 
         rmsd_values.append(rmsd_chunk)
         time_values.append(time_ns)
         frame_counter += n

    return np.concatenate(time_values), np.concatenate(rmsd_values)
```

Next, we call the compute_rmsd function to obtain coupled arrays of time (in nanoseconds) and RMSD: we then use matplotlib to produce a RMSD vs. time graph from these coupled arrays.

```python
time, rmsd = compute_rmsd(example_trajectory, example_topology)
plt.figure()
plt.plot(time, rmsd)
plt.xlabel("Time (ns)")
plt.ylabel("RMSD (Å)")
plt.title("RMSD vs. Time")

plt.tight_layout()
plt.savefig("rmsd_vs_time.png", dpi=300)
plt.close()
```

## What is RMSF?

RMSF is a measure of flexibility: it measures the average mobility or flexibility of an atom group (in this example, we will be using only alpha carbons to model the flexibility of residues); it is the time-average deviation atoms from a reference position; this approach is only appropriate when the flexibility of side chain atoms is not of interest; when side chain atoms are important, it may be helpful to calculate the average RMSF for all heavy atoms ina  residue.

RMSF is calculated using the following formula: $$\text{RMSF}(i) = \sqrt{\frac{1}{T} \sum_{t=1}^{T} \left\| r_i(t) - \langle r_i \rangle \right\|^2}$$ where $$T$$ is the total number of frames, $$r_i(t)$$ is the position of the alpha carbon of residue $$i$$ at time $$\(t\)$$, and $$\langle r_i \rangle$$ is its time-averaged position over the trajectory. As you can see, the reference from which deviation is calculated in RMSF is typically the **average of the entire trajectory** unlike in the last example in which we used the first frame as reference.

Like when calculating RMSD, the frames of the trajectory must first be aligned to the reference (average) structure.

## Memory Issues with MDAnalysis
While MDAnalysis does not load entire trajectories to memory, the **`perform_alignment()`** function stores the algined trajectory in memory by default. To avoid this, we set parameter in_memory=false and save the aligned trajectory to disk by specifying a temporary filename. We can later delete this temporary file.

# Code for Finding the Average Structure
```python
def find_avg(u):
    # compute avg structure of alpha carbons in a protein
    avg = align.AverageStructure(
    u, u,
    select="protein and name CA"),
    ref_frame=0).run()

    return avg.universe
```

# Aligning the Trajectory to Reference
Next, we create a function for aligning the trajectory to the average structure and writing the resulting aligned trajectory to a filename **`fname`**.

```python
def perform_alignment(u, avg, fname):
    align.AlignTraj(
    u, avg,
    select="protein and name CA",
    in_memory=False,
    filename=fname).run()
```

# Code for RMSF Computation
Finally, we make a function to calculate RMSF and utilize the functions that we have created thus far.

```python
def calculate_rmsf(fname, topo):
     # create a universe out of the aligned trajectory that has been written to disk
    aligned_traj = mda.Universe(topo, fname)
    c_alphas = aligned_traj.select_atoms("protein and name CA")
    R = rms.RMSF(c_alphas).run()
    return R

# creates example universe
u = mda.Universe(example_topology, example_trajectory)

# writes trajectory aligned to average to aligned_example.dcd
perform_alignment(u, find_avg(u), "aligned_example.dcd")

# uses calculate_rmsf on the aligned trajectory
rmsf_values = calculate_rmsf("aligned_example.dcd", example_topology)
```

We then obtain the residue IDs for each alpha carbon from the topology (parallel to the RMSF array) and plot our results by creating a per-residue alpha carbon RMSF graph.

```python
resids = u.select_atoms("protein and name CA").resids

plt.figure()
plt.plot(resids, rmsf_values)
plt.xlabel("Residue Number")
plt.ylabel("RMSF (Å)")
plt.title("Per-Residue Cα RMSF")

plt.tight_layout()
plt.savefig("per_residue_rmsf.png", dpi=300)
plt.close()
```

And that's it! Functional code for calculating RMSF and RMSD - I hope this tutorial was helpful and a bit easier to understand than parsing through the documentation for these packages.

---

*All code tested with MDTraj 1.11.1, MDAnalysis 2.9.0, Python 3.11.*
