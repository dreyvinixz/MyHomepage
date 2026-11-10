# Robots and indexing

The crawler policy is `public/robots.txt`; `ROBOTS.md` documents it for maintainers and is not itself a crawler directive. The current policy allows crawling. No sitemap or canonical host is declared because the final public domain has not yet been supplied.

When a domain is chosen, verify the live `/robots.txt`, configure the canonical URL and sitemap using the real domain, and confirm that `/updates`, `/privacy`, and article URLs serve the SPA entry point on the chosen host. Do not place private or sensitive information in `robots.txt`: it is public and does not enforce access control.
