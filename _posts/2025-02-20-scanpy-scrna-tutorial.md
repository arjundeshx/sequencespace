---
layout: post
title: "Getting Started with Scanpy: Single-Cell RNA-seq Analysis in Python"
date: 2025-02-20
category: tutorial
description: "A practical introduction to analyzing single-cell RNA sequencing data using Scanpy — covering QC, normalization, dimensionality reduction, and clustering from scratch."
tags: [scrna-seq, python, scanpy, single-cell, tutorial]
author: Your Name
---

Single-cell RNA sequencing (scRNA-seq) has transformed how we study gene expression. Instead of averaging signal across millions of cells, we can now measure what individual cells are doing — resolving cell types, developmental trajectories, and rare populations that bulk RNA-seq would miss entirely.

This tutorial walks through a complete scRNA-seq analysis workflow using [Scanpy](https://scanpy.readthedocs.io/), the Python ecosystem's standard library for this. We'll go from a raw count matrix to annotated clusters.

**Prerequisites:** Python 3.9+, basic familiarity with NumPy/pandas, and a conceptual sense of what RNA-seq is.

## Setup

```bash
pip install scanpy[leiden] matplotlib seaborn
```

```python
import scanpy as sc
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

sc.settings.verbosity = 3       # show progress
sc.settings.figdir = './figures/'
sc.logging.print_header()
```

## Loading data

Scanpy works with `AnnData` objects — a data structure that stores a cells × genes count matrix alongside metadata. Most pipelines (Cell Ranger, STARsolo, Alevin) output in formats Scanpy can read directly.

```python
# Load a 10x Genomics output directory
adata = sc.read_10x_mtx(
    './data/filtered_feature_bc_matrix/',
    var_names='gene_symbols',
    cache=True
)
adata.var_names_make_unique()

print(adata)
# AnnData object with n_obs × n_vars = 8381 × 33694
```

For this tutorial, we'll use the classic PBMC 3k dataset (peripheral blood mononuclear cells), which Scanpy can download automatically:

```python
adata = sc.datasets.pbmc3k()
```

## Quality control

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
