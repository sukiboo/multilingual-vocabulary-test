---
title: Multilingual Vocabulary Test
emoji: 🐈
colorFrom: green
colorTo: yellow
sdk: static
app_file: index.html
pinned: false
license: mit
---

# Multilingual Vocabulary Test

A dependency-free, adaptive written-vocabulary recognition quiz, inspired by https://taketest.xyz/multilang-vocab.

## Run

From this directory:

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. Use an HTTP server rather than opening `index.html` directly because the JavaScript uses ES modules. No install or build step is needed.

The version is **v0.7.0**. Change `CONFIG.version` in `src/data.js` to update both the header and scorecard.

## Hosting and deployment

- **Play:** https://sukiboo-multilingual-vocabulary-test.static.hf.space
- **Hugging Face Space:** https://huggingface.co/spaces/sukiboo/multilingual-vocabulary-test
- **Source:** https://github.com/sukiboo/multilingual-vocabulary-test

The README front matter configures a public **static** Space serving the root `index.html`. No Python server, Docker image, paid compute, or build step is required on Hugging Face.

`.github/workflows/sync-to-hf.yml` deploys every push to `main` and can also be run manually from GitHub Actions. It uses the official Hugging Face sync action to create the Space if needed and mirror the files, including deletions; `.git/` and `.github/` are excluded. GitHub is the source of truth: changes made directly on the Space can be overwritten by the next deployment. Deployments are serialized to avoid simultaneous uploads.

The workflow requires the GitHub repository Actions secret **`HF_TOKEN`**, containing a Hugging Face token with write access to the Space. Prefer a fine-grained token scoped to this Space. Configure it under **Settings → Secrets and variables → Actions**; never put the token in a committed file. No local `.env` file or application secrets are required to run the quiz. The workflow actions are pinned to commit hashes.

## Setup and controls

- **My language** offers three buttons: English, Español, and Русский. The selection controls the full interface and answer choices.
- **Languages to test** is a collapsed disclosure with an enabled-language count. Checked chips are included; unchecked chips are left out. Your language is automatically excluded, and other selections survive language switches.
- Optional Latin-letter readings for Greek, Russian, Ukrainian, Armenian, Georgian, and Japanese appear in parentheses beside the word. The word area reserves space to reduce layout shifts; long text can wrap.
- Click one of four bold translation buttons to submit and advance immediately. There is no Next button.
- The centered, amber **I don’t know :(** button (**No lo sé :(** in Spanish, **Не знаю :(** in Russian) advances and records an omission, separately from an incorrect answer.
- Routing scores and advancement thresholds are internal; no point rules appear on the question or transition screens.
- Keyboard: 1–4 to answer, 0 to skip. Focused buttons retain Enter/Space behavior. Repeated keydown events and double-click follow-up clicks are ignored.
- Finish early from a question or transition. The current unanswered question is not recorded, and the scorecard is marked partial.

The full selection targets **10–15 minutes**, with a ceiling of **180 questions**. This is a design estimate, not measured completion-time data. Smaller selections and sessions with little recognition can finish much sooner.

## Vocabulary

**180 concepts × 22 languages**, with 60 concepts in each provisional difficulty band—three times the previous pool. Each language has a translation for every concept; six non-Latin scripts also have complete romanizations. The loader rejects duplicate concept IDs, missing expansion data, empty terms, and mismatched column counts.

The 120 new concepts broaden everyday food, clothing, body parts, travel, and household vocabulary, alongside animals, plants, and tools in the harder pool. Examples include cheese, train, mountain, pocket, curtain, butterfly, otter, dragonfly, chisel, and spindle. Quiz length and scoring are unchanged.

Languages: English, Spanish, French, German, Italian, Portuguese, Dutch, Swedish, Polish, Russian, Ukrainian, Finnish, Greek, Armenian, Georgian, Japanese, **Czech, Romanian, Hungarian, Danish, Norwegian (Bokmål), and Turkish**.

`CONFIG.defaultLanguages` enables 11 core languages: English, Spanish, French, German, Italian, Portuguese, Swedish, Polish, Russian, Ukrainian, and Finnish. Excluding the selected user language leaves **10 default targets**.

Dutch, Greek, Japanese, Turkish, Armenian, Georgian, Czech, Romanian, Hungarian, Danish, and Norwegian remain available under **More languages**, unchecked by default. Enabling every language gives 21 targets after the reference language is excluded. The translations and difficulty labels are provisional and still need native-speaker review.

## Adaptive stages

| Stage | Allocation per language | Purpose |
| --- | --- | --- |
| Explore | Five easy words for every included language | Initial screening; at least 2 net points to qualify for Refine |
| Refine | Five medium words per admitted language | Harder follow-up; at least 2 net points in this stage to qualify for Confirm |
| Confirm | Ten new target words: two easy, four medium, four hard | Deeper sampling; contributes alongside the first two stages |

`CONFIG.scoring` assigns **+1 correct, −1 incorrect, 0 skipped**. Both five-question gates require a complete round with at least 2 points; scores do not carry between gates. Two correct and three skipped qualifies, four correct and one incorrect qualifies, but three correct and two incorrect does not. All-skipped, all-wrong, and zero-correct languages stop after Explore. Passing a screening gate is not itself evidence of proficiency.

Before Refine, the planner reserves **15 questions per admitted language**: five medium follow-ups plus a full ten-word final check. If too many languages pass the first gate, higher Explore scores take priority, then more correct answers, then a randomized session tie order. This budget-aware cutoff means some qualifying languages may not receive follow-ups. Every admitted language that subsequently passes Refine has room for a complete Confirm round. There is no fourth stage, and unused reservations are not recycled into second chances for eliminated languages. Final-check allocations are fixed before that round begins.

For the default 10 targets, Explore has **50 questions**. At most eight languages fit the reserved follow-up budget, giving at most **40 Refine + 80 Confirm questions**, or **170 total**. With all 21 targets enabled, at most five languages receive follow-ups (180 total). A single-language session has at most **20 questions**. `maximumQuestions()` includes the reservation constraint; the absolute cap remains 180. Fewer qualifying languages mean an earlier finish. Stage sizes are fixed at each transition, so progress does not jump as answers arrive.

Question order uses shuffled, balanced rounds: each active language gets one question before its next. Stages and difficulty bands are separate: Confirm mixes difficulties. Target-word spellings never repeat within a language during a run, including words shared by different concepts. Correct answers are only revealed in the final review.

**Try again** retains an in-memory history of target words shown in each language. Selection prefers unseen target-word spellings, then those last shown in the oldest run. Among equally recent candidates, it favors meanings less often used elsewhere in the current run, with randomized ties. With 60 concepts per band and at most seven easy, nine medium, and four hard targets per language per run, there is enough vocabulary for six full runs without repeating a target concept in the same language. Once a band is exhausted, older words return; repetition within the current language run is still prohibited.

This history includes words shown just before an early exit, even if unanswered. It does not track distractors or prohibit a meaning from appearing in another language. Distractors exclude concepts with the same target-language spelling or reference-language label as the correct answer, so ambiguous pairs such as Dutch root/carrot (`wortel`) do not appear as competing answers. Refreshing or opening a new tab clears the history; the larger pool still uses fresh random sampling, but no cross-refresh exclusion is guaranteed.

## Scorecard

The **My languages** card includes:

- Title and cat logo on the same row, with the logo on the right.
- One continuous **Multilingual score** (Russian: **Индекс полиглота**), displayed as a localized decimal, not a language-count ring.
- Up to **ten languages** with at least ten recorded questions and an aggregate routing score of at least 2. There are no zero-correct filler rows or rankings from Explore alone.
- Aggregate labels such as **80%, 16/20 correct**, combining **all stages**. Bar width is the same unrounded percentage, never relative to the strongest language.
- Skips are included in the percentage denominator but remain a separate outcome, not an incorrect answer. Thus 2 correct and 8 skipped is **20%, 2/10 correct**, not 100%.
- No confirmation labels, pass/fail badges, or counts of inconclusive languages.
- Question coverage, romanization setting, and quiz version.

The card is screenshot-friendly; there is no image-export or share action.

### Multilingual score

`src/assessment.js` sums a contribution from **every included language**, using all recorded stages, independently of the top-ten display filter:

```text
full_run = 5 + 5 + 10 = 20
contribution(language) = max(0, correct − incorrect / (option_count − 1)) / full_run
multilingual_score = sum(contribution(language))
```

With four options, an incorrect answer discounts one third of a correct answer. Before flooring or selection, uniform random guessing has an expected contribution of zero. A skip adds nothing and incurs no penalty. One point represents a perfect 20-question run in one language; partial recognition contributes fractions. The denominator remains 20 even for short runs, so two early lucky answers contribute only 0.1 points, never a whole language. A 16-correct, 4-incorrect full run contributes approximately 0.73. Scores are rounded only for display, to one decimal place using the UI locale.

This is an **uncalibrated quiz index**, not a confidence estimate, a count of known languages, or a fluency measurement. Adaptive selection, the per-language zero floor, and repeated meanings can still reward luck. Difficulty and words are not calibrated. Excluded languages do not count; early finishing and budget limits reduce opportunities to contribute, while adding languages adds opportunities. Scores are not directly comparable across selections, reading aids, or versions. The previous binomial confirmation calculation and statuses have been removed.

### Ranking and details

`CONFIG.ranking` requires at least **10 recorded questions** and **2 aggregate net routing points** (+1 correct, −1 incorrect, 0 skipped), with at most ten rows. The final round need not be complete. These are internal display criteria, not proficiency thresholds. Earlier answers are included rather than discarded. Shorter samples and results below the cutoff remain in details and still contribute to the multilingual index.

Rows are ordered by unrounded correct / recorded questions across all stages. Equal rates share a rank; more questions break display-order ties, then localized alphabetical order resolves remaining ties and the ten-row cutoff. A full bar means every recorded question was correct, with no skips; it does not imply fluency. Different sample sizes, difficulties, and words still prevent calibrated proficiency comparisons. Early exits retain a visible partial-result label.

The initially collapsed **Details & all languages** disclosure contains every included language, including screened-out and budget-limited languages, the methods, overall accuracy ring, outcome counts, stage summaries, question charts, and answer review. All ratios use recorded questions **including skips**, consistently with the main ranking. The current unanswered question on early exit is not recorded. Charts show actual planned question slots grouped by stage, with distinct correct, incorrect, skipped, and unasked styles. Stages without an allocation use a single dashed placeholder. Text labels accompany the graphics.

## Files

- `index.html`: static entry point, page shell, and header logo.
- `src/app.js`: setup, balanced scheduling, question selection, transitions, controls, and results.
- `src/styles.css`: responsive interface; no external fonts.
- `src/data.js`: central version, reference/default language lists, question budgets, routing/ranking/index settings, language metadata, and English/Spanish/Russian copy.
- `src/assessment.js`: internal routing scores, budget-reserving stage plans, maximum question counts, and the multilingual index.
- `src/vocabulary/index.js`: original concepts, all language columns for those concepts, and vocabulary assembly/validation.
- `src/vocabulary/extra.js`: the first 32 additional concepts and their translations/romanizations.
- `src/vocabulary/more.js`: 120 further concepts, with translations for all 22 languages and six romanization columns.
- `assets/logo.png`: production logo; unused design drafts are archived outside the repository.
- `.github/workflows/sync-to-hf.yml`: automatic static Space deployment.
- `LICENSE`: MIT license, preserved from the existing GitHub repository.

## Limitations and verification

This measures observed word recognition, not fluency, vocabulary size, speaking, listening, or grammar. All current items are nouns. Difficulty is not equally calibrated across languages; translations, romanizations, and distractors require review. Cognates, ambiguous meanings, repeated concepts, word choice, and reading aids can affect results. More sampling and a guessing discount do not replace a validated assessment. Budget-limited or weak signals remain unresolved rather than receiving invented proficiency levels.

All session state and repeat-avoidance history stay in memory. History stores only each target-word spelling’s most recent run number per language, not previous answers or scores. No backend, persistence, analytics, uploads, external requests, or accounts. Refreshing discards the session and history.

JavaScript syntax, the deployment workflow, and public asset availability have been checked. Automated quiz tests and browser verification have not been run.
