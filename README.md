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

An adaptive word-recognition quiz across 22 languages, with English, Spanish, or Russian answer choices. It explores which words you recognize—not how fluently you speak.

[Take the quiz](https://sukiboo-multilingual-vocabulary-test.static.hf.space).

## Inspiration and goals

Inspired by the original [Multilingual Vocabulary Test](https://taketest.xyz/multilang-vocab). We wanted to keep the fun of discovering familiar words across languages, while adding:

- Adaptive questioning that spends more time on languages you recognize.
- A larger vocabulary pool and less repetition when playing again.
- Localized answers, optional romanization, and a clear “I don’t know” option.
- A mobile-friendly scorecard with per-language percentages and one multilingual index.

## Methodology

The pool contains **180 concepts per language**, all nouns, split into three provisional difficulty bands. Each question offers four translations or a skip.

1. **Explore:** five easy words per language.
2. **Refine:** five medium words for qualifying languages.
3. **Confirm:** ten further words—two easy, four medium, and four hard.

Each of the first two rounds independently requires at least **2 points** to advance: +1 correct, −1 incorrect, 0 skipped. Sessions are capped at 180 questions; stronger early results take priority when not all qualifying languages fit. Space is reserved for complete final rounds.

Questions alternate between languages without repeating a target word within a language. Replays prefer unseen words; this history resets on refresh.

**Per-language results** combine all stages: correct answers divided by all recorded questions, including skips. The main scorecard shows up to ten languages with at least ten recorded questions and two net points; other results remain in the details.

**The multilingual index** sums each tested language’s contribution:

```text
max(0, correct − incorrect / 3) / 20
```

One point represents a perfect 20-question run in one language. Partial runs contribute fractions; skips add nothing. This is a quiz-specific index, not a count of languages you know.

The guessing discount is approximate: adaptive selection and flooring negative contributions at zero can still reward luck. Vocabulary and difficulty need native-speaker review. Cognates, romanization, repeated play, language selection, and incomplete runs affect results. Neither the percentages nor the index are validated proficiency measures.
