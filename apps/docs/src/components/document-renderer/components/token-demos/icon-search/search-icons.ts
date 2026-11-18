/**
 * Word-based icon search over the icon metadata (export name, keyword tags,
 * categories and popularity).
 *
 * Every word of the query has to match the icon: a word of its export name, a
 * keyword tag, or a category. This keeps the result count meaningful, so the
 * counts in the category list and the keyword list can be trusted. Matches in
 * the name rank above matches in a tag, and popularity breaks ties.
 *
 * Kept free of React and of path aliases so it runs in the plain Node test
 * project (`search-icons.spec.ts`).
 */

/** The metadata of one icon that the search reads. */
export interface SearchableIcon {
  name: string;
  tags: string[];
  categories: string[];
  popularity: number;
}

/** One search hit. */
export interface IconMatch {
  name: string;
  /**
   * The keyword tag that made the icon match, when the name alone does not
   * contain every word of the query. Shown on the icon card, so a reader can
   * see why `Delete` is a result for "trash". Null for name matches.
   */
  matchedTag: string | null;
}

interface IndexedIcon {
  name: string;
  lowerName: string;
  nameWords: string[];
  tags: string[];
  tagWords: string[][];
  categoryWords: string[];
  popularityBoost: number;
}

/** A prepared list of icons, sorted by popularity (most used first). */
export type IconIndex = IndexedIcon[];

// Points for the best match of one query word. Name matches score above tag
// matches, so `Delete` comes before an icon that only has the tag "delete".
const NAME_WORD = 10;
const NAME_WORD_START = 7;
const NAME_PART = 5;
const TAG = 6;
const TAG_WORD = 5;
const TAG_WORD_START = 3;
const CATEGORY = 2;
/** Extra points when the query is the whole name, e.g. "shopping cart". */
const WHOLE_NAME = 20;
/** Extra points when a query of several words is one tag, e.g. "add user". */
const WHOLE_TAG = 4;
/** Weight of `log10(popularity)`; enough to order icons with equal points. */
const POPULARITY_WEIGHT = 0.6;

/** Lower-case words of a text: "Add user!" -> ["add", "user"]. */
export const toWords = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/**
 * Splits an export name into lower-case words: "ShoppingCartCheckout" ->
 * ["shopping", "cart", "checkout"], "Svg10k" -> ["10", "k"]. Icons whose name
 * starts with a digit are exported with an `Svg` prefix, which is not a word.
 */
export const splitIconName = (name: string): string[] =>
  toWords(
    name
      .replace(/^Svg(?=\d)/, "")
      .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .replace(/(\d)([A-Za-z])/g, "$1 $2")
  );

/** The word and its singular form, so "users" also finds the tag "user". */
const wordForms = (word: string): string[] => {
  const forms = [word];
  if (word.length > 3 && word.endsWith("es")) forms.push(word.slice(0, -2));
  if (word.length > 3 && word.endsWith("s")) forms.push(word.slice(0, -1));
  return forms;
};

/** Prepares the icons for searching. Build once per icon list. */
export const createIconIndex = (icons: SearchableIcon[]): IconIndex =>
  [...icons]
    .sort((a, b) => b.popularity - a.popularity)
    .map((icon) => {
      const tags = icon.tags.map((tag) => tag.toLowerCase());
      return {
        name: icon.name,
        lowerName: icon.name.toLowerCase(),
        nameWords: splitIconName(icon.name),
        tags,
        tagWords: tags.map(toWords),
        categoryWords: icon.categories.flatMap(toWords),
        popularityBoost:
          Math.log10(1 + Math.max(0, icon.popularity)) * POPULARITY_WEIGHT,
      };
    });

interface WordMatch {
  /** Best points for this word, 0 when the icon does not match it. */
  score: number;
  /** True when the word is part of the export name. */
  inName: boolean;
  /** The tag with the best tag match, if any. */
  tag: string | null;
}

const matchWord = (icon: IndexedIcon, word: string): WordMatch => {
  let nameScore = 0;
  let tagScore = 0;
  let tag: string | null = null;
  let categoryScore = 0;

  for (const form of wordForms(word)) {
    for (const nameWord of icon.nameWords) {
      if (nameWord === form) nameScore = Math.max(nameScore, NAME_WORD);
      else if (nameWord.startsWith(form))
        nameScore = Math.max(nameScore, NAME_WORD_START);
    }
    if (form.length >= 3 && icon.lowerName.includes(form)) {
      nameScore = Math.max(nameScore, NAME_PART);
    }

    icon.tags.forEach((candidate, i) => {
      const words = icon.tagWords[i];
      const score =
        candidate === form
          ? TAG
          : words.includes(form)
            ? TAG_WORD
            : words.some((w) => w.startsWith(form))
              ? TAG_WORD_START
              : 0;
      if (score > tagScore) {
        tagScore = score;
        tag = icon.tags[i];
      }
    });

    if (icon.categoryWords.includes(form)) categoryScore = CATEGORY;
  }

  return {
    score: Math.max(nameScore, tagScore, categoryScore),
    inName: nameScore > 0,
    tag,
  };
};

/**
 * Searches the index. An empty query returns every icon, most used first.
 * The result is ranked, best match first.
 */
export const searchIcons = (index: IconIndex, query: string): IconMatch[] => {
  const words = toWords(query);
  if (words.length === 0) {
    return index.map((icon) => ({ name: icon.name, matchedTag: null }));
  }
  const phrase = words.join(" ");

  const hits: { match: IconMatch; score: number }[] = [];
  for (const icon of index) {
    let score = 0;
    let allInName = true;
    let tag: string | null = null;
    let matchesAll = true;

    for (const word of words) {
      const result = matchWord(icon, word);
      if (result.score === 0) {
        matchesAll = false;
        break;
      }
      score += result.score;
      if (!result.inName) {
        allInName = false;
        tag ??= result.tag;
      }
    }
    if (!matchesAll) continue;

    if (icon.nameWords.join(" ") === phrase) {
      score += WHOLE_NAME;
    } else if (words.length > 1 && icon.tags.includes(phrase)) {
      score += WHOLE_TAG;
      tag = phrase;
    }

    hits.push({
      match: { name: icon.name, matchedTag: allInName ? null : tag },
      score: score + icon.popularityBoost,
    });
  }

  // `index` is sorted by popularity and the sort is stable, so equal scores
  // keep that order.
  return hits.sort((a, b) => b.score - a.score).map((hit) => hit.match);
};
