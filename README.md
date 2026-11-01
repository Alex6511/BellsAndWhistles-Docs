# Bells and Whistles documentation

Public documentation for the Bells and Whistles Railroader mod.

**Read the site:** <https://alex6511.github.io/BellsAndWhistles-Docs/>

This repository contains the documentation, small content-author examples, and the site build configuration. The mod implementation and its history are maintained separately in a private repository.

The pages currently describe the experimental 0.3.0 rework for Railroader 0.6.0. Publishing these docs does not mark that build as tested in a running game or publish mod binaries.

## Preview and check

Use Python 3.12 and run these commands from this repository:

```sh
python -m pip install -r requirements-docs.txt
python -m mkdocs serve
```

Open <http://127.0.0.1:8000/>. Before committing changes, run:

```sh
python -m mkdocs build --strict
```

Generated files go in `site/` and are ignored by Git.

## Publish

The Docs workflow builds pull requests without publishing them. Changes to the site on `main` build and deploy to GitHub Pages automatically. You can also run Docs manually from the Actions tab; only `main` deploys.

GitHub Pages uses **GitHub Actions** as its publishing source. The workflow needs no credentials for the private mod repository.

## Update the documentation

Edit the Markdown pages in `docs/` and navigation in `mkdocs.yml`. Keep examples beside the pages that explain them. See [Contributing to the documentation](docs/development.md).

When bringing in updates from the mod project, copy only the reviewed documentation and its examples. Do not copy the mod's source tree, binaries, Git history, local build settings, or internal work records.
