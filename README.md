# Sequence Space — Computational Biology Blog

A clean, fast Jekyll blog for computational biology writing. Three content types: research breakdowns, coding tutorials, and societal commentary.

## Quick Start (local preview)

```bash
# 1. Install Ruby dependencies
bundle install

# 2. Serve locally (auto-reloads on save)
bundle exec jekyll serve

# 3. Open http://localhost:4000
```

## Writing a New Post

Create a file in `_posts/` with this filename format:

```
_posts/YYYY-MM-DD-your-post-slug.md
```

Every post needs a **front matter block** at the top:

```yaml
---
layout: post
title: "Your Post Title Here"
date: 2025-04-01
category: research      # research | tutorial | commentary
description: "A one-sentence summary shown in cards and SEO."
tags: [protein-folding, python, scrna-seq]   # optional
author: Your Name                             # optional
math: true    # optional — enables MathJax for equations
---

Your Markdown content starts here...
```

That's it. Save the file and push — the site rebuilds automatically on GitHub Pages.

### Categories

| Category | Use for |
|---|---|
| `research` | Paper breakdowns, new findings, methods |
| `tutorial` | Step-by-step coding guides |
| `commentary` | Opinion, ethics, policy, societal impact |

### Markdown features

**Code blocks** with syntax highlighting:
````markdown
```python
import scanpy as sc
adata = sc.read_10x_mtx('./data/')
```
````

**Math equations** (add `math: true` to front matter, then):
```markdown
Inline: $E = mc^2$
Block:
$$\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}$$
```

**Blockquotes:**
```markdown
> This is a callout quote styled with an amber left border.
```

**Images:**
```markdown
![Alt text]({{ '/assets/images/my-figure.png' | relative_url }})
```

Or with a caption:
```html
<figure>
  <img src="{{ '/assets/images/fig1.png' | relative_url }}" alt="UMAP of PBMC clusters">
  <figcaption>Figure 1: UMAP embedding colored by Leiden cluster assignment.</figcaption>
</figure>
```

## Deployment to GitHub Pages

1. Create a new GitHub repo (e.g., `sequence-space`)
2. Push this code to the `main` branch
3. In repo Settings → Pages → Source: select **GitHub Actions**
4. The `.github/workflows/deploy.yml` handles everything automatically

Your site will be live at `https://yourusername.github.io/sequence-space/`

### Custom domain

To use a custom domain (e.g., `sequencespace.bio`):
1. Add a `CNAME` file to the repo root containing your domain
2. Configure DNS with your registrar (CNAME to `yourusername.github.io`)
3. Enable HTTPS in repo Settings → Pages

## Customization

### Site settings (`_config.yml`)

```yaml
title: "Your Blog Title"
tagline: "Your tagline here"
author:
  name: "Your Name"
  github: "yourgithub"
  twitter: "yourhandle"
url: "https://yourusername.github.io"
baseurl: ""  # or "/repo-name" if not at root
```

### Colors & fonts (`assets/css/main.css`)

The top of the CSS file has CSS custom properties (variables) you can tweak:
```css
:root {
  --teal:  #3EB8A0;  /* accent color */
  --amber: #E8A44A;  /* secondary accent */
  --slate: #1C2333;  /* nav/hero background */
}
```

## File structure

```
_posts/          ← Your posts go here (Markdown)
_layouts/
  default.html   ← Base HTML shell
  post.html      ← Individual post layout
  category.html  ← Research/Tutorials/Commentary archives
  page.html      ← About and static pages
_includes/
  nav.html       ← Navigation bar
  footer.html    ← Footer
  tag.html       ← Category badge component
  post_card.html ← Card used in grids
assets/
  css/main.css   ← All styles
  js/main.js     ← Minimal JS
index.html       ← Homepage
research.md      ← /research/ page
tutorials.md     ← /tutorials/ page
commentary.md    ← /commentary/ page
about.md         ← /about/ page
_config.yml      ← Jekyll config
```
