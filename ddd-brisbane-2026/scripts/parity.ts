/**
 * Checks that the Slidev slides.md has the same content as the reveal.js deck
 * it was converted from: slide order, sections, backgrounds, text, images,
 * clicks, code (with highlighted lines) and speaker notes.
 *
 * Usage: bun scripts/parity.ts [reveal slides.md] [slidev slides.md]
 */

import { existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { parse } from "@slidev/parser";
import MarkdownIt from "markdown-it";

type Code = { lang: string; highlight: string; body: string };

type Slide = {
  section: number;
  background: string | null;
  text: string;
  images: string[];
  clicks: number;
  code: Code[];
  notes: string | null;
};

const markdown = new MarkdownIt({ html: true });

const CODE_BLOCK = /^```([^\n]*)\n([\s\S]*?)^```$/gm;

/** Reduces markdown to its visible text, ignoring markup. */
function visibleText(content: string): string {
  return markdown
    .render(content)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function imageNames(content: string): string[] {
  const html = markdown.render(content);
  return [...html.matchAll(/<(?:img|video)[^>]*\ssrc="([^"]+)"/g)].map(([, src]) => basename(src));
}

function extractCode(content: string, parseInfo: (info: string) => Omit<Code, "body">): {
  code: Code[];
  rest: string;
} {
  const code: Code[] = [];
  const rest = content.replace(CODE_BLOCK, (_, info: string, body: string) => {
    code.push({ ...parseInfo(info), body });
    return "";
  });
  return { code, rest };
}

/** Normalises a highlight range so that no highlight and all lines match. */
function normaliseHighlight(range: string | undefined): string {
  return !range || range === "*" || range === "all" ? "*" : range.replace(/\s/g, "");
}

// Mirrors index.html's separators and src/reveal.js-plugins/markdown/plugin.js.
function parseReveal(source: string): Slide[] {
  return source.split(/^---\s*\n/m).flatMap((horizontal, index) =>
    horizontal.split(/^------\s*\n/m).map((slide) => {
      let fencedContent = "";
      let newContent = slide;
      if (slide.includes("```\n")) {
        const postFenceIndex = slide.lastIndexOf("```") + 3;
        fencedContent = slide.slice(0, postFenceIndex + 1);
        newContent = slide.slice(postFenceIndex);
      }
      const notesMatch = newContent.split(/\n\n/gim);
      const notes = notesMatch.length >= 2 ? notesMatch.slice(1).join("\n\n").trim() : null;
      const content = fencedContent + notesMatch[0];

      const background = content.match(/data-background-(?:image|video)="([^"]+)"/)?.[1] ?? null;
      const { code, rest } = extractCode(content, (info) => {
        const [, lang, range] = info.match(/^\s*(\w+)\s*(?:\[([^\]]*)\])?\s*$/)!;
        return { lang, highlight: normaliseHighlight(range) };
      });

      return {
        section: index + 1,
        background: background && basename(background),
        text: visibleText(rest),
        images: imageNames(rest),
        clicks: (rest.match(/class="fragment"/g) ?? []).length,
        code,
        notes,
      };
    }),
  );
}

const MAGIC_MOVE = /^````md magic-move\n([\s\S]*?)^````$/m;

/**
 * Expands a magic move slide back into one slide per step, with the notes
 * split on their [click] markers.
 */
function expandMagicMove(section: number, content: string, note: string | undefined): Slide[] | null {
  const magicMove = content.match(MAGIC_MOVE);
  if (!magicMove) {
    return null;
  }
  const { code } = extractCode(magicMove[1], (info) => {
    const [, lang, range] = info.match(/^(\w+)(?: \{([^}]*)\})?$/)!;
    return { lang, highlight: normaliseHighlight(range) };
  });
  const notes = (note ?? "").split(/^\[click\]$/m).map((step) => step.trim());
  if (notes.length !== code.length) {
    throw new Error(`magic move has ${code.length} steps but ${notes.length} notes`);
  }
  const rest = content.replace(MAGIC_MOVE, "");
  return code.map((step, index) => ({
    section,
    background: null,
    text: visibleText(rest),
    images: imageNames(rest),
    clicks: 0,
    code: [step],
    notes: notes[index],
  }));
}

async function parseSlidev(path: string): Promise<Slide[]> {
  const { slides } = await parse(await Bun.file(path).text(), path);
  let section = 0;
  return slides.flatMap(({ frontmatter, content, note }) => {
    section = frontmatter.section ?? section;
    const steps = expandMagicMove(section, content, note);
    if (steps) {
      return steps;
    }

    const withoutStyles = content.replace(/<style>[\s\S]*?<\/style>/g, "");
    const { code, rest } = extractCode(withoutStyles, (info) => {
      const [, lang, range] = info.match(/^(\w+)(?: \{([^}]*)\})?(?:\{.*\})?$/)!;
      return { lang, highlight: normaliseHighlight(range) };
    });
    const images = imageNames(rest);
    const video = rest.match(/<video[^>]*\ssrc="([^"]+)"/)?.[1];

    return {
      section,
      background: frontmatter.image ? basename(frontmatter.image) : video ? basename(video) : null,
      text: visibleText(rest),
      images: images.filter((image) => !video || image !== basename(video)),
      clicks:
        (rest.match(/\sv-click[\s>]/g) ?? []).length +
        [...rest.matchAll(/<v-clicks>([\s\S]*?)<\/v-clicks>/g)].reduce(
          (count, [, list]) => count + (list.match(/^>? ?[*-] /gm) ?? []).length,
          0,
        ),
      code,
      notes: note?.trim() ?? null,
    };
  });
}

const [revealPath = "../ddd-melbourne-2026/slides.md", slidevPath = "slides.md"] = process.argv.slice(2);
const reveal = parseReveal(await Bun.file(revealPath).text());
const slidev = await parseSlidev(slidevPath);

/**
 * Slides that intentionally differ from the reveal.js deck. Each entry finds
 * exactly one reveal.js slide by its background and overrides only the listed
 * fields with what the Slidev slide should have instead; every other field is
 * still compared as usual.
 */
const INTENTIONAL_DIFFERENCES: { revealBackground: string; expected: Partial<Slide> }[] = [
  // Brisbane uses the general thanks slide from the PyCon US 2025 deck
  // instead of thanking the DDD Melbourne sponsors.
  {
    revealBackground: "ddd_sponsors.png",
    expected: {
      background: "hearts.svg",
      notes:
        "Thank you to my friends, and family for supporting me, the open source contributors, and finally to you, for listening!",
    },
  },
];

const failures: string[] = [];
for (const { revealBackground, expected } of INTENTIONAL_DIFFERENCES) {
  const matches = reveal.filter((slide) => slide.background === revealBackground);
  if (matches.length !== 1) {
    failures.push(
      `intentional difference: expected one reveal.js slide with background ${revealBackground}, found ${matches.length}`,
    );
    continue;
  }
  Object.assign(matches[0], expected);
}
if (reveal.length !== slidev.length) {
  failures.push(`slide count: reveal.js has ${reveal.length}, slidev has ${slidev.length}`);
}
for (let index = 0; index < Math.min(reveal.length, slidev.length); index++) {
  for (const key of Object.keys(reveal[index]) as (keyof Slide)[]) {
    const expected = JSON.stringify(reveal[index][key]);
    const actual = JSON.stringify(slidev[index][key]);
    if (expected !== actual) {
      failures.push(`slide ${index + 1} ${key}:\n  reveal.js: ${expected}\n  slidev:    ${actual}`);
    }
  }
}

const publicDir = join(dirname(slidevPath), "public", "images");
for (const [index, slide] of slidev.entries()) {
  for (const image of [slide.background, ...slide.images]) {
    if (image && !existsSync(join(publicDir, image))) {
      failures.push(`slide ${index + 1}: missing public/images/${image}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\n${failures.length} difference(s) found.`);
  process.exit(1);
}
console.log(`All ${slidev.length} slides match ${revealPath}.`);
