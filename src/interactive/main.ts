import '@fontsource-variable/nunito/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './interactive.css';
import { mount } from 'svelte';
import Console from './Console.svelte';

const target: HTMLElement | null = document.getElementById('app');
if (target === null) {
  throw new Error('Missing #app mount point');
}

// The interactive page is served from the site root, so assets resolve from './'.
mount(Console, { target, props: { root: './' } });
