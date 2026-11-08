export function sectionNumbers(sections: (string | false | undefined | null)[]) {
  return Object.fromEntries(sections.filter(Boolean).map((section, index) => [section, String(index + 1).padStart(2, '0')]));
}
