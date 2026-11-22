<script lang="ts">
  import { base } from '$app/paths';
  import { site } from '$lib/config';

  export let size = 96;

  const initials = site.fullName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase('tr-TR');

  let failed = false;
  $: src = site.contact.photo ? `${base}/${site.contact.photo.replace(/^\//, '')}` : '';
</script>

{#if src && !failed}
  <img
    {src}
    alt={site.fullName}
    class="rounded-full object-cover shadow-md"
    style="width:{size}px;height:{size}px"
    on:error={() => (failed = true)}
  />
{:else}
  <div
    class="rounded-full shadow-md flex items-center justify-center text-white font-semibold select-none"
    style="width:{size}px;height:{size}px;font-size:{size * 0.38}px;background:linear-gradient(135deg,#7c3aed,#2563eb 55%,#0d9488)"
    aria-label={site.fullName}
  >
    {initials}
  </div>
{/if}
