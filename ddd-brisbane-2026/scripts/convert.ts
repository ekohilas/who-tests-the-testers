/**
 * One-off conversion of the reveal.js slides.md into Slidev's slides.md.
 *
 * Usage: bun scripts/convert.ts <reveal slides.md> <slidev slides.md>
 *
 * Only the structure is converted here: slide separators, speaker notes and
 * section markers. Reveal specific syntax inside a slide is left as is, to be
 * converted feature by feature afterwards.
 */

const HEADMATTER = `theme: apple-basic
title: "Who Tests the Testers? Making and Testing Pipelines"
author: Evan Kohilas
# https://sli.dev/features/drawing
drawings:
  persist: false
# force light by default
colorSchema: light
duration: 45min
# TODO: figure out why this needs to be 1920/2 to set the width to 1920
canvasWidth: 960
# for styling parts of text
mdc: true`;

// Matches index.html's data-separator, data-separator-vertical and
// data-separator-notes.
const HORIZONTAL_SEPARATOR = /^---\s*\n/m;
const VERTICAL_SEPARATOR = /^------\s*\n/m;
const NOTES_SEPARATOR = /\n\n/gim;

export type RevealSlide = {
  section: number;
  content: string;
  notes: string | null;
};

/**
 * Splits a slide the same way src/reveal.js-plugins/markdown/plugin.js does:
 * everything up to the last code fence is content, and of what follows,
 * everything after the first blank line is notes.
 */
function splitNotes(slide: string): { content: string; notes: string | null } {
  let fencedContent = "";
  let newContent = slide;
  if (slide.includes("```\n")) {
    const postFenceIndex = slide.lastIndexOf("```") + 3;
    fencedContent = slide.slice(0, postFenceIndex + 1);
    newContent = slide.slice(postFenceIndex);
  }

  const notesMatch = newContent.split(NOTES_SEPARATOR);
  if (notesMatch.length < 2) {
    return { content: fencedContent + newContent, notes: null };
  }
  return {
    content: fencedContent + notesMatch[0],
    notes: notesMatch.slice(1).join("\n\n").trim(),
  };
}

export function parseReveal(markdown: string): RevealSlide[] {
  return markdown.split(HORIZONTAL_SEPARATOR).flatMap((horizontal, index) =>
    horizontal.split(VERTICAL_SEPARATOR).map((slide) => ({
      section: index + 1,
      ...splitNotes(slide),
    })),
  );
}

function toSlidev(slides: RevealSlide[]): string {
  return slides
    .map((slide, index) => {
      const frontmatter: string[] = [];
      if (index === 0) {
        frontmatter.push(HEADMATTER);
      }
      if (index === 0 || slide.section !== slides[index - 1].section) {
        frontmatter.push(`section: ${slide.section}`);
      }

      const parts = [frontmatter.length ? `---\n${frontmatter.join("\n")}\n---` : "---"];
      const content = slide.content.replace(/^\n+|\s+$/g, "");
      if (content) {
        parts.push(content);
      }
      if (slide.notes !== null) {
        parts.push(`<!--\n${slide.notes}\n-->`);
      }
      return parts.join("\n\n");
    })
    .join("\n\n")
    .concat("\n");
}

if (import.meta.main) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error("Usage: bun scripts/convert.ts <reveal slides.md> <slidev slides.md>");
    process.exit(1);
  }
  const slides = parseReveal(await Bun.file(input).text());
  await Bun.write(output, toSlidev(slides));
  console.log(`Converted ${slides.length} slides.`);
}
