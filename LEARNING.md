# LEARNING

## SCSS `@use` path — use the alias, not `../`

**Concept: path alias**

A relative path (`../`) counts folders from the file. From
`src/views/managerDash/jobs/` you must write `../../../assets/...` — three
`..` — to reach `src/assets/`. That breaks when you move the file.

An alias is a short name for a folder. `vite.config.js` sets:

```js
'@': fileURLToPath(new URL('./src', import.meta.url))
```

So from any file, any depth, `@/assets/scss/variables` always points to
`src/assets/scss/variables`.

**Rule for this project:** in SCSS always use `@use '@/assets/scss/variables'`.

**Common mistake:** copying a `<style>` block from another file that is one
folder deeper or shallower, and keeping its `../` path. The build then fails with
`Can't find stylesheet to import`. Fix: change `../` to `@/`.

## `devDependencies` — tools you use while building

`dependencies` = code your app needs to run in production.
`devDependencies` = tools only you use while writing code (ESLint, Vite, Sass).

They ship together in one `node_modules` folder, but npm marks the second group
so it can skip them on a server. That is why `@eslint/js` belongs there.

## ESLint: a config file loads the rules

`eslint.config.js` (flat config, ESLint 9+) is a list, not an object.
Each item says: which files it applies to, which parser, which rules.
It imports packages to get rules: `@eslint/js` for base JavaScript,
`eslint-plugin-vue` for `.vue` files, `eslint-config-prettier` last so it can
turn off formatting rules that fight Prettier.

If one import is missing, ESLint cannot start at all:
`Cannot find package '@eslint/js'`.

## `no-undef` needs to know where the code runs

ESLint does not know the names your environment gives you. `console`,
`localStorage`, `fetch` are browser names. Node gives `process`.
Without this list, ESLint says "not defined" for correct code.
You set it in the config with `languageOptions.globals`.

## The build is your proof

`npx vite build` tells you if the code is really fine. `npm run dev` can hide
problems because it does not build everything at once. Run the build before
saying "it works".