---
layout: post
title: "RMSD and RMSF Calculation with MDTraj and MDAnalysis"
date: 2026-03-03
category: tutorial
description: "A practical introduction to generating RMSD and RMSF plots from molecular dynamics trajectories and performing alignment in a memory-efficient manner using the MDTraj and MDAnalysis Python libraries."
tags: [structural biology, python, molecular dynamics, biophysics, tutorial]
author: Arjun Deshpande 
---

When analyzing large molecular dynamics (MD) trajectories, it can be difficult to make sense of the data. The easiest and simplest ways to get started analyzing and comparing the movement of proteins is by generating plots for root mean square deviation (RMSD) and per-residue root mean square fluctuation (RMSF).

**Prerequisites:** Python 3.9+, basic familiarity with NumPy/pandas, and a basic understanding of molecular dynamics trajectory and topology data.

# RMSD vs. Time Plot Generation with MDTraj

## What is RMSD?

RMSD is a measure of the distance from a conformation of a biomolecule (e.g a protein) from a reference structure. RMSD calculations measure the three dimensional distance between reference atoms and atoms in a particular frame, aggregating the squares of distances across all atom pairs and obtaining the square root (eliminating any negative movements; RMSD is unsigned). **RMSD is useful in evaluating conformational changes in proteins throughout simulations;** different conformations typically appear as different plateaus on a RMSD vs. time graph.

## Memory Issues with MDTraj

By default, MDTraj loads in the entire trajectory to system RAM (when using function md.load()) - this is problematic for most systems are trajectories are often too large in size to be stored in the system memory. The md.iterload() method can be used to load trajectories in chunks to avoid filling out the memory.

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

This function computes RMSD for the alpha carbons of a protein (which are specified witht the .select() and .atom_slice() methods) - RMSD is computed with respect a reference structure, which in this case is set to the first frame of the DCD file. In order to eliminate the influence of global translation and rotation on RMSD **each frame must be aligned to the reference alpha carbons before RMSD is calculated**, which is achieved with the .superpose() method.

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

# Calculating Per-Residue RMSF with MDAnalysis

Raw data contains empty droplets, dead cells, and doublets. We filter these out using three metrics:

- **`n_genes_by_counts`** — number of genes detected per cell (low = empty or dead)
- **`total_counts`** — total UMI count per cell
- **`pct_counts_mt`** — percentage of counts from mitochondrial genes (high = apoptotic cell)

```python
# Mark mitochondrial genes
adata.var['mt'] = adata.var_names.str.startswith('MT-')

# Calculate QC metrics
sc.pp.calculate_qc_metrics(
    adata,
    qc_vars=['mt'],
    percent_top=None,
    log1p=False,
    inplace=True
)

# Visualize distributions
sc.pl.violin(adata, ['n_genes_by_counts', 'total_counts', 'pct_counts_mt'],
             jitter=0.4, multi_panel=True)
```

Filter based on what you see (adjust thresholds for your data):

```python
adata = adata[adata.obs.n_genes_by_counts > 200, :]
adata = adata[adata.obs.n_genes_by_counts < 2500, :]
adata = adata[adata.obs.pct_counts_mt < 5, :]
```

## Normalization

Single-cell counts are confounded by sequencing depth — a cell with 10k UMIs will appear to express everything at higher levels than one with 2k UMIs, even if the underlying biology is identical. We normalize:

```python
# Normalize to 10,000 counts per cell (library-size normalization)
sc.pp.normalize_total(adata, target_sum=1e4)

# Log-transform: log(x + 1)
sc.pp.log1p(adata)

# Save the normalized matrix before feature selection
adata.raw = adata
```

The log transformation stabilizes variance and pulls the distribution closer to normal — a requirement for many downstream statistical methods.

## Feature selection

We don't need all 33k genes. We select **highly variable genes (HVGs)** — those with more variation across cells than we'd expect by chance — to focus on informative signal:

```python
sc.pp.highly_variable_genes(adata, min_mean=0.0125, max_mean=3, min_disp=0.5)

print(f"Number of HVGs: {adata.var.highly_variable.sum()}")
# Number of HVGs: 1838

sc.pl.highly_variable_genes(adata)

# Subset to HVGs for PCA
adata = adata[:, adata.var.highly_variable]
```

## Dimensionality reduction

### PCA

scRNA-seq data lives in ~20,000-dimensional space. We reduce it first with PCA:

```python
sc.pp.regress_out(adata, ['total_counts', 'pct_counts_mt'])
sc.pp.scale(adata, max_value=10)

sc.tl.pca(adata, svd_solver='arpack')
sc.pl.pca_variance_ratio(adata, log=True)
```

### UMAP

PCA captures the top linear axes of variation. For visualization, UMAP (Uniform Manifold Approximation and Projection) gives a 2D embedding that preserves local structure:

```python
sc.pp.neighbors(adata, n_neighbors=10, n_pcs=40)
sc.tl.umap(adata)
sc.pl.umap(adata, color=['CST3', 'NKG7', 'PPBP'])  # marker genes
```

## Clustering

We use the Leiden algorithm (a refined version of Louvain) on the neighbor graph:

```python
sc.tl.leiden(adata, resolution=0.5)
sc.pl.umap(adata, color=['leiden'], legend_loc='on data')
```

## Finding marker genes

For each cluster, find genes that are highly expressed there but not in other clusters:

```python
sc.tl.rank_genes_groups(adata, 'leiden', method='wilcoxon')
sc.pl.rank_genes_groups(adata, n_genes=10, sharey=False)
```

This gives you a ranked list per cluster. You can then cross-reference with known cell-type markers (e.g., `CD3D` for T cells, `MS4A1` for B cells, `CST3` for monocytes) to assign biological identities.

## Saving your work

```python
adata.write('pbmc3k_analyzed.h5ad')

# Load later with:
# adata = sc.read('pbmc3k_analyzed.h5ad')
```

## Next steps

From here, the natural directions are:

- **Trajectory analysis** with PAGA or Monocle3 — ordering cells along developmental paths
- **Doublet detection** with Scrublet or DoubletFinder before QC
- **Batch correction** with Harmony or scVI for multi-sample studies
- **Differential expression** between conditions using pseudo-bulk methods (DESeq2 via PyDESeq2)

The Scanpy documentation has excellent tutorials on each of these. The [single-cell best practices book](https://www.sc-best-practices.org/) (Theis lab) is also indispensable.

---

*All code tested with Scanpy 1.10, AnnData 0.10, Python 3.11.*
