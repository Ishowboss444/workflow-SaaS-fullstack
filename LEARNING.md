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

## `catch` in Express must always answer

**Concept: promise rejection**

An `async` function that throws becomes a *rejected promise*. Express 5 catches
it, but only if you `await` the call. If you swallow the error with `catch` and
return nothing, **the request never ends**. The user sees a spinner forever.

```js
// BAD - request hangs
} catch (err) {
  console.log(err);
}

// GOOD - always answers
} catch (err) {
  console.error(err);
  return this.res.status(500).json({ message: 'something went wrong' });
}
```

Always pair `catch` with a response. Always `return` it.

**Common mistake:** writing `next()` after sending a 500 error. `next()` means
"keep going to the next handler" — so it sends the error page *and* runs the real
route. Return instead.

## `<Transition>` needs `v-if` or `v-show`

`<Transition>` is for when something appears or disappears. Vue needs to know
what to watch, so the element inside must have `v-if` or `v-show`. Without it the
transition can never close and the element stays on screen.

## `defineModel()` needs a type too

`defineModel()` creates a prop for you. ESLint cannot see its type, so it says
the prop has no type. Write it:

```js
const model = defineModel({ type: [String, Number], default: '' });
const name = defineModel('name', { type: String, default: '' });
```

## Lint counts can lie

Read the rules before you trust the number. 132 problems sounded terrible, but 111
were 3 config-only rules. The real count was 24, and only 3 were true bugs.
Always group by rule first, then look at each one.

## The build is your proof

`npx vite build` tells you if the code is really fine. `npm run dev` can hide
problems because it does not build everything at once. Run the build before
saying "it works".