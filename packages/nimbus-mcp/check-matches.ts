import { getSearchIndex } from "./src/data-loader.js";

async function main() {
  const index = await getSearchIndex();
  const queries = ["color tokens", "onChange", "button", "Select", "spacing"];
  for (const q of queries) {
    const tokens = q.toLowerCase().split(/\s+/);
    let exact = 0;
    for (const e of index) {
      const fields = (
        e.title +
        " " +
        e.description +
        " " +
        e.tags.join(" ") +
        " " +
        (e.content || "")
      ).toLowerCase();
      if (tokens.every((t) => fields.includes(t))) exact++;
    }
    console.log(`${q}: ${exact} exact matches out of ${index.length}`);
  }
}
main().catch(console.error);
