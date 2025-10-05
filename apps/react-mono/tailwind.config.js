const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const shared = require('../../packages/styles/src/lib/tailwind/tailwind.preset.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [shared],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
