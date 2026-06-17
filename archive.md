---
layout: default
title: Archive
permalink: /archive/
---

<header class="archive-header">
  <div class="archive-header-inner">
    <h1 class="archive-title">All Posts</h1>
    <p class="archive-desc">{{ site.posts | size }} posts across research, tutorials, and commentary.</p>
  </div>
</header>

<div class="archive-list">
  {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
  {% for year_group in posts_by_year %}
  <div style="margin-bottom:0.5rem;">
    <span style="font-family:var(--mono);font-size:0.7rem;color:var(--meta);letter-spacing:0.1em;text-transform:uppercase;">{{ year_group.name }}</span>
  </div>
  {% for post in year_group.items %}
  {% assign cat = post.category | default: post.categories[0] %}
  <div class="archive-item">
    <span class="archive-date">
      {{ post.date | date: "%b %-d" }}<br>
      {% include tag.html category=cat %}
    </span>
    <div>
      <h2 class="archive-item-title">
        <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
      </h2>
      <div class="archive-item-meta">
        {% if post.description %}{{ post.description | truncate: 130 }}{% else %}{{ post.excerpt | strip_html | truncate: 130 }}{% endif %}
      </div>
    </div>
  </div>
  {% endfor %}
  {% endfor %}

  {% if site.posts.size == 0 %}
  <p style="color:var(--meta);font-family:var(--sans);">No posts yet. Check back soon!</p>
  {% endif %}
</div>
