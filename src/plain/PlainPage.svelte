<script lang="ts">
  import { categories, entriesByCategory } from '../data/catalog';
  import { awards, education, experience, languages, otherSkills, profile, socials, technologies } from '../data/profile';
  import type { Category, Entry } from '../data/types';
  import { isExternal } from '../lib/assets';
  import PlainEntry from './PlainEntry.svelte';

  interface Props {
    /** Path from this page back to the site root ('../' when served from /plain/). */
    root: string;
  }

  let { root }: Props = $props();

  const HIGHLIGHT_IDS: readonly string[] = ['rendering-research', 'sword-and-sail', 'fresh-stacker', 'hedgehog2d'];
  const projectCategories: readonly Category[] = categories.filter((c: Category): boolean => c.id !== 'profile');
  const allEntries: readonly Entry[] = projectCategories.flatMap((c: Category): readonly Entry[] => entriesByCategory[c.id]);
  const highlights: readonly Entry[] = HIGHLIGHT_IDS.map((id: string): Entry | undefined =>
    allEntries.find((e: Entry): boolean => e.id === id),
  ).filter((e: Entry | undefined): e is Entry => e !== undefined);
</script>

<a class="skip" href="#projects">Skip to projects</a>

<header class="top">
  <div class="wrap top-inner">
    <a class="brand" href="#top" aria-label="Back to top">{profile.short}</a>
    <nav aria-label="Sections">
      <a href="#projects">Projects</a>
      <a href="#experience">Experience</a>
      <a href="#skills">Skills</a>
      <a href="#awards">Awards</a>
      <a href="#contact">Contact</a>
    </nav>
    <a class="mode-link" href={root} title="Switch to the interactive, game-console style version">
      <span aria-hidden="true">✦</span> Interactive mode
    </a>
  </div>
</header>

<main id="top" class="wrap">
  <section class="hero" aria-labelledby="name">
    <p class="eyebrow">{profile.role} · {profile.location}</p>
    <h1 id="name">{profile.name}</h1>
    <p class="lede">{profile.tagline}</p>
    {#each profile.about as paragraph (paragraph)}
      <p class="about">{paragraph}</p>
    {/each}
    <ul class="social">
      {#each socials as social (social.href)}
        <li>
          <a
            href={social.href}
            target={isExternal(social.href) ? '_blank' : undefined}
            rel={isExternal(social.href) ? 'noopener noreferrer' : undefined}>{social.label}</a
          >
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="highlights-title" class="block">
    <h2 id="highlights-title">Highlights</h2>
    <div class="cards">
      {#each highlights as entry (entry.id)}
        <a class="card" href={`#${entry.id}`} style:--accent={entry.accent}>
          <span class="card-status">{entry.status}</span>
          <strong>{entry.title}</strong>
          <span class="card-line">{entry.tagline}</span>
          <span class="card-role">{entry.role}</span>
        </a>
      {/each}
    </div>
  </section>

  <section id="projects" aria-labelledby="projects-title" class="block">
    <h2 id="projects-title">Projects</h2>
    {#each projectCategories as category (category.id)}
      <div class="group" id={`cat-${category.id}`} style:--accent={category.accent}>
        <h3>{category.label} <span>{category.blurb}</span></h3>
        {#each entriesByCategory[category.id] as entry (entry.id)}
          <PlainEntry {entry} {root} />
        {/each}
      </div>
    {/each}
  </section>

  <section id="experience" aria-labelledby="experience-title" class="block">
    <h2 id="experience-title">Experience</h2>
    {#each experience as job (job.org + job.period)}
      <div class="job">
        <div class="job-head">
          <h3>{job.title} <span>· {job.org}</span></h3>
          <p>{job.period} · {job.place}</p>
        </div>
        <ul class="points">
          {#each job.points as point (point)}
            <li>{point}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>

  <section id="skills" aria-labelledby="skills-title" class="block">
    <h2 id="skills-title">Skills &amp; Education</h2>
    <dl class="defs">
      <dt>Languages</dt>
      <dd>
        <ul class="chips">{#each languages as item (item)}<li>{item}</li>{/each}</ul>
      </dd>
      <dt>Engines &amp; tech</dt>
      <dd>
        <ul class="chips">{#each technologies as item (item)}<li>{item}</li>{/each}</ul>
      </dd>
      <dt>Also</dt>
      <dd>
        <ul class="chips">{#each otherSkills as item (item)}<li>{item}</li>{/each}</ul>
      </dd>
      <dt>Education</dt>
      <dd>
        <ul class="plainlist">{#each education as item (item)}<li>{item}</li>{/each}</ul>
      </dd>
    </dl>
  </section>

  <section id="awards" aria-labelledby="awards-title" class="block">
    <h2 id="awards-title">Awards</h2>
    <ul class="awards">
      {#each awards as award (award.title)}
        <li>
          <strong>{award.title}</strong>
          <span>{award.issuer}</span>
          <time>{award.date}</time>
        </li>
      {/each}
    </ul>
  </section>

  <section id="contact" aria-labelledby="contact-title" class="block">
    <h2 id="contact-title">Contact</h2>
    <p>
      Email is the fastest way to reach me:
      <a href={`mailto:${profile.email}`}>{profile.email}</a>
    </p>
  </section>
</main>

<footer class="foot">
  <div class="wrap">
    <p>
      © {profile.name}. Prefer something more playful? <a href={root}>Open the interactive version</a>.
    </p>
  </div>
</footer>
