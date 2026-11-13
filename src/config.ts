/** Project links in one place, so a rename or a new branch is a one line change. */
const base = "https://github.com/ferupin/tokuten";

export const repo = {
  home: base,
  author: "https://github.com/ferupin",
  issuesChoose: `${base}/issues/new/choose`,
  bug: `${base}/issues/new?template=bug_report.yml`,
  idea: `${base}/issues/new?template=feature_request.yml`,
  guide: `${base}/blob/master/CONTRIBUTING.md`,
} as const;

/** Public address of the deployed app, used for link previews. */
export const siteUrl = "https://tokuten-snowy.vercel.app";
