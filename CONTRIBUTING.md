# Contributing

Prerequisite: **Node.js ≥ 22**.

```bash
git clone https://github.com/roslove44/brand-artisan.git
cd brand-artisan
npm install
```

## Commands

```bash
npm run dev             # render server over the repo's templates
npm run build           # renders the whole templates/ tree into out/
npm run pdf -- <dir>    # assembles a folder of slides into a PDF (LinkedIn document post)
npm run check           # typecheck + tests, what the CI runs
npm run test:consumer   # packs, installs into a blank project and renders a visual there
npm run test:generator  # generates a project from the tarballs and renders it end to end
```

The last two are the publication safety net: they exercise the engine from
`node_modules` and the skeleton from the tarball, where the packaging errors no
unit test ever sees actually live. The CI runs the whole suite on Linux and
Windows, Node 22 and 24, and really renders every template in the repo: a
broken visual fails at run time, not at typecheck.

## The two packages

The repo publishes two npm packages, always at the same version:

- **`brand-artisan`** (root): the engine and its CLI.
- **`create-brand-artisan`** (`create/`): the generator and its skeleton,
  Calame demo brand included.

Bump both `package.json` together; `test:generator` refuses to start if they
diverge.

The skills (`skills/`) travel in neither package: each AI agent stores its own
copies elsewhere, and `npx skills` knows their folders better than we do. To
work on them, load them from your working copy rather than from `main`: under
Claude Code, `/plugin marketplace add ./` then
`/plugin install brand-artisan@brand-artisan`.

## Publishing

Publication is automatic. Bump both `package.json`, commit, then push a tag:

```bash
git tag v0.1.0 && git push origin v0.1.0
```

`.github/workflows/release.yml` does the rest: it refuses if the tag does not
point at a commit on `main` or does not carry the version of both packages,
replays the full suite, then publishes the engine before the generator.

**The trigger is the tag, not the GitHub release**, and that is deliberate: on
`on: release`, the page would be the trigger, hence public before a single test
has run, and a failed publication would leave a release announcing a version
absent from npm. Here the page is created last, so it only exists once npm has
received the packages, and a failure leaves nothing but a tag to delete.

**The dist-tag is derived from the version**, it is not chosen: a version
carrying a prerelease suffix (`0.1.0-rc.2`) goes to `next`, a stable version to
`latest`. Since npm slaps `latest` on any version published without `--tag`,
this computation is what keeps a prerelease from becoming the default version.

**No npm token exists in this repo.** Authentication goes through
[trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC): GitHub
proves the workflow's identity, npm issues a token valid for the duration of
the publication, and the **provenance attestation is signed by default** (the
`--provenance` flag is therefore unnecessary). The configuration was set up
once per package:

```bash
npm trust github brand-artisan        --repo roslove44/brand-artisan --file release.yml --allow-publish
npm trust github create-brand-artisan --repo roslove44/brand-artisan --file release.yml --allow-publish
```

Two consequences not to discover on release day: **renaming `release.yml`
breaks publication**, the file name being part of the trust contract; and the
job must run on **Node 24**, since Node 22 ships an npm older than the 11.5.1
that trusted publishing requires.

## Conventions

- The repo's working rules (per-project guidelines, template contract, visual
  standards) live in [`CLAUDE.md`](CLAUDE.md). Evolving the engine implies
  updating the skills (`skills/`) in mirror, within the same change. `npm test`
  validates them (`test/skills.test.ts`): it is their only safety net, since
  they are published outside the packages.
- Commits in English, [Conventional Commits](https://www.conventionalcommits.org/)
  format: `feat(scope): …`, `fix(scope): …`.
- The repo's reference brand is `calame` (`brands/`, `templates/`, `tools/`):
  the full journey of a brand, from guidelines to visuals. It is **fictional**,
  hence reusable, unlike a real brand.
- **Calame exists twice**, at the root and in `create/template/`, because an
  npm package cannot reference files outside its own folder. `test/calame.test.ts`
  compares the shared files by hash: any divergence fails. The extra visuals
  (`banner`, `card`) stay at the root, the generated skeleton keeping its single
  OG image.
