# Contributing to the documentation

This site is maintained in the public [BellsAndWhistles-Docs repository](https://github.com/Alex6511/BellsAndWhistles-Docs). It contains the guides and their small content-author examples. The mod implementation is maintained separately.

You only need Python 3.12 to build these docs. A copy of Railroader or the mod's source code is not required.

## Preview your changes

Clone the documentation repository, open a terminal in its folder, and install the pinned dependencies:

```sh
python -m pip install -r requirements-docs.txt
```

Start the preview:

```sh
python -m mkdocs serve
```

Open <http://127.0.0.1:8000/>. The preview reloads when a page changes. Press Ctrl+C to stop it.

## Edit a page

Each page is a Markdown file in `docs/`. Navigation is defined in `mkdocs.yml`. Put new pages in the navigation, use relative links between pages, and keep downloadable examples beside the guide that explains them.

Preserve the distinction between behavior checked offline and behavior tested in a running game. The current guides describe the experimental 0.3.0 rework for Railroader 0.6.0.

## Check the site

Before committing, run:

```sh
python -m mkdocs build --strict
```

This checks the navigation and internal links, including section anchors. Any warning fails the build. Generated files go in `site/`, which Git ignores.

## Publish changes

Open a pull request in the documentation repository. The Docs workflow runs the strict build for review. Once the changes reach `main`, it builds and publishes the site to GitHub Pages.

You can also run Docs manually from the repository's Actions tab. A manual run publishes only from `main`; other branches only build.

GitHub Pages is configured to use **GitHub Actions** as its source. Deployment uses this repository's own workflow token and does not need access to the private mod repository.

## Bring in updated guides

Review documentation changes from the mod project, then copy only the relevant pages and their examples into this repository. Keep the site's public repository links and build configuration. Mod implementation files, binaries, private history, local settings and internal work records do not belong here.
