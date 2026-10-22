# Sunda modern invitation

The shared invitation component is used by the public homepage, personal guest links, and authenticated admin draft preview. Their data loading, publication rules, RSVP endpoint, calendar download, and music controls remain in place.

Visual reference: https://bahagianyakita.ai.id/ — inspected on 22 October 2026. The redesign retains the vertical invitation flow and dark green identity, adds ivory stationery, aged gold detailing, and a fixed scenic introduction on wide screens. The opening cover uses an edge-to-edge, full-height couple photo with a pine gradient concentrated behind the names and controls; the upper photo stays clear.

## Assets

- `public/images/priangan-landscape.webp`: original AI-generated Priangan-inspired landscape, compressed to WebP (~395 KiB). Generated with the built-in imagegen tool; no API fallback. Used for the desktop scene and decorative fallbacks when photos are absent.
- `public/images/jasmine-branch.svg`: original vector jasmine branch; subtly animated on the cover.
- `public/images/cloud-pattern.svg`: original repeating cloud ornament inspired by Cirebon batik, rather than a reproduction of a historical pattern.
- `public/favicon.svg`: matching pine-and-gold floral mark.
- `public/images/couple-preview.webp`: existing published cover photo from the reference site, used only by the local design preview. Public/personal invitations continue using their configured uploaded cover photo.

The decorative assets do not depict the couple. Uploaded wedding photos take precedence in the existing media slots. All decorative images have empty alternative text or are CSS backgrounds.

### Final generation prompt

Use case: illustration-story. Asset type: background illustration for a modern Sundanese wedding invitation website. Create a sophisticated hand-painted gouache and fine ink landscape of the Priangan highlands in West Java, layers of lush deep forest-green mountains, delicate mist, gently curved terraced rice paddies, a tiny traditional Sundanese wooden saung with a simple pitched roof tucked at the lower right, banana foliage and graceful bamboo framing the lower edges, a few ivory jasmine flowers in the foreground. Wide landscape, approximately 3:2. Antique ivory parchment sky in the upper half with ample empty space, muted sage and pine greens, restrained aged gold accents, rich tactile paper grain, editorial botanical engraving meets modern heritage illustration, serene romantic morning. Layered scenic depth, refined high-end wedding stationery aesthetic. No people, no lettering, no text, no watermark, no borders. This is a scenic decorative artwork, not a photograph or a website mockup.

## Local review

Run `npm ci`, then `npm run dev` and visit `/design/preview`. This route uses sample content and returns 404 in production. The real invitation continues to require published Supabase content. No sample content is substituted for a missing publication.

Cover content animates on arrival; branches sway gently; sections reveal on intersection. The page remains readable without JavaScript. `prefers-reduced-motion: reduce` disables animation and smooth scrolling. The open button scrolls to and focuses the invitation body and reveals the section navigation.

## Verification

- `npm test`: 27 existing tests passed.
- `npm run check`: no errors or warnings.
- `npm run build`: successful with the Vercel adapter (local Node 25; deployment runtime Node 24).
- Playwright Chromium review: 1440px desktop; 390px, 320px, and 768px layouts without horizontal overflow; image loading; hidden empty gallery; open-button focus transfer; event and RSVP anchors; section reveals; reduced-motion behavior; readable content with JavaScript disabled.
- Review screenshots and smoke-check scripts are saved locally under ignored `output/playwright/`.

Hosted Supabase content, actual uploaded photos/audio, and a live RSVP submission need an environment configured with the project's credentials. No deployment was performed.
