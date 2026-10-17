# weblinks

My web links: https://tedlaz.github.io/weblinks/

To add a link, open `links.js` and add a line `{t: "Title", u: "https://..."}` to the right section (optionally `n: "note"`).
A new category is a new `{id, title, sections}` entry and shows up in the menu as `index.html#id`. A `group` on a section starts a new sub-heading.
Dead links are checked every Monday by `.github/workflows/links.yml` (opens an issue).
