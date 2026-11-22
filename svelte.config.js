import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        // Static site for GitHub Pages. BASE_PATH is '' for <user>.github.io
        // and '/<repo>' for project pages (set automatically by the deploy workflow).
        adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html' }),
        paths: {
            base: process.env.BASE_PATH ?? '',
        },
        alias: {
            $lib: "src/lib",
        },
    },
};

export default config;
