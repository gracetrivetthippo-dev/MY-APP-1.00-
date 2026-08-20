# Royal Ballet Academy — Expo Architecture

A clean Expo + React Native foundation for the RBA life-planner/story game. It runs on iPhone, Android, and Expo web from one TypeScript codebase.

## Included

- Five-tab academy navigation plus nested story, focus, schedule, and relationship screens
- Persistent local state for student level, XP, coins, streak, stats, tasks, schedule, relationships, wardrobe, story, and session history
- Story scenes with dialogue, completion rewards, and sequential unlocking
- Expanded NPC/story pass with six detailed cast profiles, location routines, playable room events, branching dialogue choices, persistent consequence flags, relationship rewards, letters, rival/friend events, weekend scenes, and save migration that preserves prior progress
- Final Batch 1 school-year narrative: 24 additional September-to-June scenes, 48 new choices, term reviews, auditions, assessments, seasonal performances, a resolved academy mystery, two finale paths, an epilogue, spoiler-sealed locked cards, and a standalone editable `yearOneStory.ts` content file
- Final Batch 2 editable Artwork Assignment Portal: durable image import; NPC expression/state assignment; layered player avatar rendering; replaceable location backgrounds; independent dorm furniture and Toca-style tiny-object layers; percentage positioning, scale, depth, visibility, removal, and placeholder fallbacks
- Final Batch 3 daily-life engine: deterministic daily gifts, real-schedule-only agenda completion, weekday/weekend modes, date-safe streak updates, rotating NPC room presence, seasonal room ornament layers, academy atmosphere forecasts, balanced daily rewards, and configurable in-app reminder timing
- Version 1.0 release pass: JSON backup/restore, local diagnostics, guarded two-step reset, navigation audit, stale-placeholder cleanup, fixed Expo config plugins, version metadata, offline iOS bundle validation, and a device smoke-test checklist
- Layer-ready avatar wardrobe, inventory, equipping, purchasing, and date/condition locks
- Faceless Ballet Pose Studio with first position, fifth position, tendu, arabesque, attitude, and grand jeté art assets
- Persistent pose selection, twelve saved pose-and-outfit looks, and automatic ballet-practice pose cues
- Batch 1 Part 1 story-trigger engine with ALL/ANY conditions, event priority queue, optional-event dismissal, repeat/cooldown rules, visible lock reasons, and save migration
- Batch 1 Part 2 editable schedule with create/edit/delete/copy, multi-day recurrence, one-time events, date boundaries, pausing, notes, validation, and story-trigger controls
- Batch 1 Part 3 cumulative journal and study desk with templates, moods, privacy, favorites, tags, search, notebooks, pinned/highlighted notes, checklists, session reflections, and journal/note story triggers
- Consolidated system-art pass: decorated dorm journal, library study desk, Headmistress story desk, academy schedule hall, and studio progress record using existing RBA artwork
- Existing avatar/dorm composition: transparent saved-pose art layered into the furnished dorm on Today and Wardrobe while the explorable customization dorm remains empty
- Imported illustrated Avatar Library with six deduplicated source catalogs (face, hair, uniform, casual, formal, and details), zoomable viewing, persistent design notes, and editable asset registry
- Starter avatar portrait capsule with four transparent watercolor busts, accessible selection cards, persistent choice, and save-data migration while full-body ballet poses remain independently selectable
- Real weekly schedule seeded with Monday and Tuesday 7:00–8:30 PM ballet only
- Task completion connected to XP, coins, and development stats
- “Do It With Me” sessions for schoolwork, French, ballet practice, paper reading, and wellbeing
- Focus timer, real instructions, optional learning-resource launch, progress rewards, and session log
- Ornate cream/blush/gold design tokens and reusable paper-card components
- Campus directory ready to replace with watercolor room art and tappable hotspots
- Four wired environment backgrounds: Grand Hallway, Student Dormitory, Primary Studio, and Dormitory Common Room
- SCISSORS Batch 1 core-location set: campus map, entrance hall, main hallway, library, primary studio, practice studio, music wing, empty customizable dorm, and dorm hallway
- Full-screen reusable location route with room descriptions, activity actions, back navigation, and map/directory entry points
- The active dorm background is intentionally unfurnished so later furniture layers can be positioned independently
- SCISSORS Batch 2 supporting locations: conservatory, headmistress office, reflection room, health wing, bathrooms, laundry, costume atelier, dining hall, and grand theatre
- Real book library inside the Academy Library: import `.txt` and `.md` files, persist full text locally, display word counts, remember reading position, change reader font size, and remove shelf items
- SCISSORS Batch 3 exterior world: academy façade, front gates, main courtyard, Rose Court, formal gardens, outdoor practice garden, fountain courtyard, conservatory terrace, garden paths, path to town, locked town entrance, and lakeside
- Dedicated grounds hub with outdoor hotspots, gentle walk tracking, garden reading, outdoor practice, relationship access, and connected indoor/outdoor navigation

## Run it

1. Install Node.js if needed.
2. In this folder, run `npm install`.
3. Run `npx expo start`.
4. Install Expo Go on your phone and scan the QR code. iPhone and computer should be on the same Wi-Fi.

Use `npm run typecheck` to verify TypeScript.

## Architecture

```text
App.tsx                         Navigation and assembled screens
src/components/ui.tsx          Reusable ornate UI pieces
src/data/seed.ts               Demo content and learning activities
src/store/useAcademyStore.ts   Persistent game state and all mutations
src/theme.ts                    Colors, spacing, and radii
src/types.ts                    Shared data contracts
assets/locations/               Wired academy environment backgrounds
```

## Best next build order

1. Extract and align interchangeable face, hair, outfit, and accessory layers from approved final artwork.
2. Split `App.tsx` screens into individual files as each becomes more complex.
3. Add a proper task/schedule editor and notification permissions.
4. Add story-choice consequences and trigger rules.
5. Add cloud accounts only after the local vertical slice feels fun.

The seed content is intentionally editable and spoiler-light. The architecture supports a much larger story without putting the secrets directly on the main screens.
