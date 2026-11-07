import { render as renderComponent } from 'svelte/server';
import PlainPage from './PlainPage.svelte';

/** Renders the plain page to an HTML string. The plain page lives at /plain/, so its root is '../'. */
export function render(): string {
  return renderComponent(PlainPage, { props: { root: '../' } }).body;
}
