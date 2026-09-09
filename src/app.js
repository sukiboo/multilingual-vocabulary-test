import { CONFIG, LANGUAGES, CONCEPTS, COPY } from './data.js';
import { answerScore, maximumQuestions, planStage, multilingualScore } from './assessment.js';

const app = document.querySelector('#app');
const footer = document.querySelector('#footer');
const settings = { reference: 'en', selected: new Set(CONFIG.defaultLanguages), romanization: true };
const questionHistory = Object.fromEntries(Object.keys(LANGUAGES).map((code) => [code, new Map()]));
let runNumber = 0;
let session = null;
let screen = 'setup';

const text = () => COPY[settings.reference];
const languageName = (code) => text().languageNames[code];
const unit = (key, count) => text().units[key][new Intl.PluralRules(settings.reference).select(count)];
const shuffled = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
const targetLanguages = () => Object.keys(LANGUAGES).filter((code) => code !== settings.reference && settings.selected.has(code));
const tally = (records) => ({
  correct: records.filter((record) => record.correct).length,
  incorrect: records.filter((record) => record.answer !== null && !record.correct).length,
  skipped: records.filter((record) => record.answer === null).length,
  answered: records.filter((record) => record.answer !== null).length,
});

function durationEstimate(count) {
  if (!count) return '';
  const questions = maximumQuestions(count);
  return text().short.replace('{min}', Math.ceil(questions * CONFIG.timing.minSecondsPerQuestion / 60))
    .replace('{max}', Math.ceil(questions * CONFIG.timing.maxSecondsPerQuestion / 60));
}

function updateChrome() {
  document.documentElement.lang = settings.reference;
  document.title = text().appName;
  document.querySelector('.version').textContent = `v${CONFIG.version}`;
  footer.textContent = text().footer;
}

function focusHeading() {
  app.querySelector('h1, h2')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderSetup() {
  screen = 'setup';
  updateChrome();
  const t = text();
  app.innerHTML = `
    <div class="setup-layout">
      <section class="intro">
        <p class="eyebrow"><span class="spark">✳</span> ${t.eyebrow}</p>
        <h1 tabindex="-1">${t.title}</h1>
        <p class="intro-copy">${t.intro}</p>
        <div class="feature-list"><span id="time-estimate">${durationEstimate(targetLanguages().length)}</span><span id="question-budget">${t.adaptive.replace('{count}', maximumQuestions(targetLanguages().length))}</span></div>
      </section>
      <section class="setup-card" aria-labelledby="reference-label">
        <p class="field-label" id="reference-label">${t.reference}</p>
        <div class="reference-options" role="group" aria-labelledby="reference-label">${CONFIG.referenceLanguages.map((code) => `<button type="button" class="reference-button" data-reference="${code}" lang="${code}" aria-pressed="${settings.reference === code}">${LANGUAGES[code].native}</button>`).join('')}</div>
        <details class="language-selection"><summary>${t.native}<span id="language-count">${targetLanguages().length}</span></summary><fieldset><legend class="sr-only">${t.native}</legend><p class="field-hint" id="language-hint">${t.nativeHint}</p>
          ${[CONFIG.defaultLanguages, Object.keys(LANGUAGES).filter((code) => !CONFIG.defaultLanguages.includes(code))].map((codes, index) => `${index ? `<p class="field-hint more-languages">${t.moreLanguages}</p>` : ''}<div class="language-chips">${codes.map((code) => `
            <label class="language-chip"><input type="checkbox" value="${code}" ${code !== settings.reference && settings.selected.has(code) ? 'checked' : ''} ${code === settings.reference ? 'disabled' : ''} aria-describedby="language-hint" aria-label="${languageName(code)}"><span lang="${code}" title="${languageName(code)}">${LANGUAGES[code].native}</span></label>`).join('')}</div>`).join('')}
        </fieldset></details>
        <label class="toggle-row"><strong>${t.scripts}</strong><input id="romanization" type="checkbox" ${settings.romanization ? 'checked' : ''}></label>
        <button class="primary wide" id="start" ${targetLanguages().length ? '' : 'disabled'}>${t.start}<span aria-hidden="true">↗</span></button>
        <p class="setup-note" id="setup-note" role="status">${targetLanguages().length ? '' : t.empty}</p>
      </section>
    </div>`;
  app.querySelectorAll('.reference-button').forEach((button) => button.addEventListener('click', () => {
    if (settings.reference === button.dataset.reference) return;
    settings.reference = button.dataset.reference;
    renderSetup();
    app.querySelector(`[data-reference="${settings.reference}"]`).focus();
  }));
  app.querySelectorAll('.language-chip input').forEach((input) => input.addEventListener('change', () => {
    if (input.checked) settings.selected.add(input.value);
    else settings.selected.delete(input.value);
    const count = targetLanguages().length;
    document.querySelector('#start').disabled = !count;
    document.querySelector('#setup-note').textContent = count ? '' : t.empty;
    document.querySelector('#question-budget').textContent = t.adaptive.replace('{count}', maximumQuestions(count));
    document.querySelector('#time-estimate').textContent = durationEstimate(count);
    document.querySelector('#language-count').textContent = count;
  }));
  document.querySelector('#romanization').addEventListener('change', (event) => { settings.romanization = event.target.checked; });
  document.querySelector('#start').addEventListener('click', startSession);
}

function startSession() {
  const languages = targetLanguages();
  if (!languages.length) return;
  runNumber++;
  session = {
    languages, queue: [], records: [], current: null, stageIndex: 0,
    tieOrder: shuffled(languages), stageLanguages: [], stageSize: 0, plans: {}, completed: false,
    used: Object.fromEntries(languages.map((code) => [code, new Set()])),
    conceptCounts: new Map(), maxQuestions: maximumQuestions(languages.length),
  };
  beginStage(0);
  showNextQuestion();
}

function beginStage(index) {
  const stage = CONFIG.stages[index];
  const plan = planStage(index, session.languages, session.records, session.tieOrder);
  session.plans[stage.id] = plan;
  session.stageIndex = index;
  session.stageLanguages = Object.keys(plan);
  session.queue = [];
  const remaining = Object.fromEntries(Object.entries(plan).map(([language, bands]) => [language, shuffled(bands)]));
  while (Object.values(remaining).some((bands) => bands.length)) {
    for (const language of shuffled(session.stageLanguages)) {
      const band = remaining[language].shift();
      if (band) session.queue.push({ language, band });
    }
  }
  session.stageSize = session.queue.length;
  session.current = null;
}

function chooseQuestion({ language, band }) {
  const phase = CONFIG.stages[session.stageIndex].id;
  const history = questionHistory[language];
  const candidates = shuffled(CONCEPTS.filter((concept) => concept.band === band && !session.used[language].has(concept[language])));
  candidates.sort((a, b) => (history.get(a[language]) || 0) - (history.get(b[language]) || 0)
    || (session.conceptCounts.get(a.id) || 0) - (session.conceptCounts.get(b.id) || 0));
  const concept = candidates[0];
  if (!concept) throw new Error(`No unused ${band} vocabulary for ${language}`);
  const distractors = shuffled(CONCEPTS.filter((item) => item.id !== concept.id && item.band === band
    && item[language] !== concept[language] && item[settings.reference] !== concept[settings.reference])).slice(0, CONFIG.optionCount - 1);
  history.set(concept[language], runNumber);
  session.used[language].add(concept[language]);
  session.conceptCounts.set(concept.id, (session.conceptCounts.get(concept.id) || 0) + 1);
  return { language, phase, concept, options: shuffled([concept, ...distractors]) };
}

function stageSteps() {
  const t = text();
  return `<ol class="stage-steps" aria-label="${t.stage}">${CONFIG.stages.map((stage, index) => `<li class="${index === session.stageIndex ? 'active' : index < session.stageIndex ? 'complete' : ''}" ${index === session.stageIndex ? 'aria-current="step"' : ''}><span>${index < session.stageIndex ? '✓' : index + 1}</span><div>${t[stage.id]}</div></li>`).join('')}</ol>`;
}

function showNextQuestion() {
  const next = session.queue.shift();
  if (!next) {
    const nextIndex = session.stageIndex + 1;
    if (!CONFIG.stages[nextIndex]) {
      session.completed = true;
      return renderResults();
    }
    beginStage(nextIndex);
    if (!session.stageSize) {
      session.completed = true;
      return renderResults();
    }
    return renderTransition();
  }
  session.current = chooseQuestion(next);
  renderQuestion();
}

function renderTransition() {
  screen = 'transition';
  const t = text();
  const stage = CONFIG.stages[session.stageIndex];
  app.innerHTML = `<section class="test-shell transition-shell">
    ${stageSteps()}
    <div class="transition-card"><p class="eyebrow">${t.stage} ${session.stageIndex + 1} / ${CONFIG.stages.length} · ${t[stage.id]}</p>
      <h1 tabindex="-1">${session.stageIndex === CONFIG.stages.length - 1 ? t.confirmationTitle : t.transitionTitle}</h1><p>${session.stageIndex === CONFIG.stages.length - 1 ? t.confirmationBody : t.transitionBody}</p>
      <div class="transition-stats"><strong>${session.stageSize} <span>${unit('questions', session.stageSize)}</span></strong><strong>${session.stageLanguages.length} <span>${unit('languages', session.stageLanguages.length)}</span></strong></div>
      <div class="shortlist">${session.stageLanguages.map((code) => `<span>${languageName(code)}</span>`).join('')}</div>
      <div class="question-actions"><button class="text-button" id="exit">${t.exit} ↗</button><button class="primary" id="continue">${t.continue}<span aria-hidden="true">→</span></button></div>
    </div></section>`;
  document.querySelector('#continue').addEventListener('click', showNextQuestion);
  document.querySelector('#exit').addEventListener('click', renderResults);
  focusHeading();
}

function renderQuestion() {
  screen = 'question';
  const t = text();
  const { language, phase, concept, options } = session.current;
  const number = session.records.length + 1;
  const stageNumber = session.stageSize - session.queue.length;
  const latin = settings.romanization ? concept[`${language}Latin`] : null;
  app.innerHTML = `
    <section class="test-shell">
      <div class="question-progress">
        <div class="stage-progress-label"><span>${t[phase]} · ${stageNumber} / ${session.stageSize}</span><span>${session.stageLanguages.length} ${unit('languages', session.stageLanguages.length)}</span></div>
        <div class="progress-track" role="progressbar" aria-label="${t[phase]}" aria-valuemin="0" aria-valuemax="${session.stageSize}" aria-valuenow="${stageNumber - 1}"><div style="width:${(stageNumber - 1) / session.stageSize * 100}%"></div></div>
      </div>
      <div class="question-card">
        <div class="language-heading"><h1 tabindex="-1">${languageName(language)}</h1><span lang="${language}">${LANGUAGES[language].native}</span></div>
        <div class="word-display"><p class="foreign-word" lang="${language}">${concept[language]}${latin ? ` <span class="romanization" lang="${language}-Latn">(${latin})</span>` : ''}</p></div>
        <div class="answers" role="group" aria-label="${t.meaning}">${options.map((option, index) => `<button class="answer" data-option="${option.id}"><span class="answer-key" aria-hidden="true">${index + 1}</span><span>${option[settings.reference]}</span></button>`).join('')}</div>
      </div>
      <div class="question-actions answer-actions"><button class="skip-button" id="skip">${t.skip}</button></div>
      <div class="question-navigation">
        <div class="test-topline"><span>${t.question} ${String(number).padStart(2, '0')} <span class="muted">/ ${t.upTo} ${session.maxQuestions}</span></span><button class="text-button" id="exit">${t.exit} ↗</button></div>
        ${stageSteps()}
      </div>
      <p class="keyboard-hint">${t.shortcut}</p>
    </section>`;
  app.querySelectorAll('.answer, #skip').forEach((button) => button.addEventListener('click', (event) => {
    if (event.detail > 1) return;
    submitAnswer(button.dataset.option ?? null);
  }));
  document.querySelector('#exit').addEventListener('click', () => {
    if (window.confirm(t.exitConfirm)) renderResults();
  });
  focusHeading();
}

function submitAnswer(answer) {
  if (screen !== 'question') return;
  session.records.push({ ...session.current, answer, correct: answer === session.current.concept.id });
  showNextQuestion();
}

function languageChart(language) {
  const t = text();
  const records = session.records.filter((record) => record.language === language);
  const stats = tally(records);
  return `<article class="language-result"><div class="language-result-name"><h3>${languageName(language)}</h3><p>${t.familyNames[LANGUAGES[language].family]}</p></div>
    <div class="language-chart">${CONFIG.stages.map((stage) => {
      const items = records.filter((record) => record.phase === stage.id);
      const counts = tally(items);
      const label = `${t[stage.id]}: ${counts.correct} ${t.correct}, ${counts.incorrect} ${t.incorrect}, ${counts.skipped} ${t.skippedLabel}`;
      const slots = session.plans[stage.id]?.[language]?.length || 1;
      return `<div class="chart-group" role="img" aria-label="${items.length ? label : `${t[stage.id]}: ${t.notReached}`}" title="${items.length ? label : t.notReached}" style="grid-template-columns:repeat(${Math.min(slots, CONFIG.charts.columnsPerStage)},minmax(0,1fr))">${Array.from({ length: slots }, (_, index) => {
        const item = items[index];
        const outcome = !item ? 'unasked' : item.answer === null ? 'skipped' : item.correct ? 'correct' : 'incorrect';
        return `<span class="chart-segment ${outcome}" aria-hidden="true">${!item ? '' : item.answer === null ? '–' : item.correct ? '✓' : '×'}</span>`;
      }).join('')}</div>`;
    }).join('')}</div>
    <div class="language-stats"><strong>${stats.correct}<span> / ${records.length}</span></strong><span>${records.length ? `${stats.skipped} ${t.skippedLabel}` : t.unassessed}</span></div></article>`;
}

function rankedLanguages() {
  const ranked = session.languages.map((language) => {
    const records = session.records.filter((record) => record.language === language);
    const stats = tally(records);
    return { language, ...stats, total: records.length, score: answerScore(records), accuracy: records.length ? stats.correct / records.length : 0 };
  }).filter((item) => item.total >= CONFIG.ranking.minimumQuestions && item.score >= CONFIG.ranking.minimumScore)
    .sort((a, b) => b.accuracy - a.accuracy || b.total - a.total || languageName(a.language).localeCompare(languageName(b.language), settings.reference));
  ranked.forEach((item, index) => {
    const previous = ranked[index - 1];
    item.rank = previous && item.accuracy === previous.accuracy ? previous.rank : index + 1;
  });
  return ranked.slice(0, CONFIG.ranking.maxLanguages);
}

function renderResults() {
  screen = 'results';
  const t = text();
  const records = session.records;
  const stats = tally(records);
  const accuracy = records.length ? Math.round(stats.correct / records.length * 100) : null;
  const alphabetical = [...session.languages].sort((a, b) => languageName(a).localeCompare(languageName(b), settings.reference));
  const ranked = rankedLanguages();
  const explored = new Set(records.map((record) => record.language)).size;
  const score = multilingualScore(records, session.languages).toLocaleString(settings.reference, {
    minimumFractionDigits: CONFIG.multilingual.fractionDigits, maximumFractionDigits: CONFIG.multilingual.fractionDigits,
  });
  app.innerHTML = `
    <section class="results-shell">
      <article class="ranking-card" aria-labelledby="ranking-title">
        <div class="ranking-header"><h1 id="ranking-title" tabindex="-1">${ranked.length ? t.resultsTitle : t.rankingEmptyTitle}</h1><img class="ranking-logo" src="assets/logo.png" width="1075" height="240" alt="ну допустим мяу" lang="ru"></div>
        <div class="multilingual-score" role="group" aria-labelledby="multilingual-title"><strong>${score}</strong><div><h2 id="multilingual-title">${t.multilingualTitle}</h2><p>${t.multilingualUnit}</p>${session.completed ? '' : `<span class="partial-result">${t.partial}</span>`}</div></div>
        ${ranked.length ? `<ol class="ranking-list">${ranked.map((item) => {
            const width = item.accuracy * 100;
            const result = `${Math.round(width)}%, ${item.correct}/${item.total} ${t.correct}`;
            return `<li class="ranking-row" value="${item.rank}"><span class="ranking-number" aria-hidden="true">${String(item.rank).padStart(2, '0')}</span>
              <div class="ranking-language"><div class="ranking-row-heading"><h2>${languageName(item.language)}</h2><span>${result}</span></div>
                <div class="ranking-bar" role="img" aria-label="${languageName(item.language)} · ${t.rankingBar}: ${Math.round(width)}%, ${item.correct}/${item.total}"><span style="width:${width}%"></span></div>
              </div></li>`;
          }).join('')}</ol>` : `<p class="ranking-empty">${session.completed ? t.rankingEmpty : t.rankingIncomplete}</p>`}
        <div class="ranking-footer"><span>${explored} ${unit('languages', explored)} · ${records.length} ${unit('questions', records.length)}</span><span>${settings.romanization ? t.scriptOn : t.scriptOff} · v${CONFIG.version}</span></div>
      </article>
      <details class="results-details"><summary>${t.rankingDetails}<span class="disclosure-icon" aria-hidden="true"></span></summary><div class="results-details-content">
      <aside class="method-note"><h2>${t.metricTitle}</h2><p>${t.metricBody}</p></aside>
      <aside class="method-note"><h2>${t.rankingMethod}</h2><p>${t.rankingMethodBody}</p></aside>
      <div class="score-overview"><div class="score-ring ${accuracy === null ? 'empty' : ''}" style="--accuracy:${accuracy ?? 0}%" role="img" aria-label="${accuracy === null ? t.noAnswers : `${t.accuracy}: ${accuracy}%`}"><div><strong>${accuracy === null ? '—' : `${accuracy}<small>%</small>`}</strong><span>${stats.correct} / ${records.length} ${t.correct}</span></div></div>
        <div class="score-details"><h2>${accuracy === null ? t.noAnswers : t.accuracy}</h2><div class="score-counts"><span><i class="legend-dot correct"></i><strong>${stats.correct}</strong> ${t.correct}</span><span><i class="legend-dot incorrect"></i><strong>${stats.incorrect}</strong> ${t.incorrect}</span><span><i class="legend-dot skipped"></i><strong>${stats.skipped}</strong> ${t.skippedLabel}</span></div><p>${t.shown.replace('{count}', records.length)} · ${settings.romanization ? t.scriptOn : t.scriptOff}</p></div>
      </div>
      <h2 class="stage-results-heading">${t.stageBreakdown}</h2>
      <div class="stage-results">${CONFIG.stages.map((stage, index) => {
        const items = records.filter((record) => record.phase === stage.id);
        const counts = tally(items);
        const languageCount = new Set(items.map((record) => record.language)).size;
        return `<article class="stage-result ${items.length ? '' : 'not-reached'}"><span class="stage-result-number">${t.stage} 0${index + 1}</span><h3>${t[stage.id]}</h3><strong>${counts.correct}<span> / ${items.length} ${t.correct}</span></strong><p>${items.length ? `${languageCount} ${unit('languages', languageCount)} · ${counts.skipped} ${t.skippedLabel}` : t.notReached}</p></article>`;
      }).join('')}</div>
      <div class="results-heading"><h2>${t.breakdown}</h2><span class="script-note">${t.correct} / ${t.questionTotal}</span></div>
      <p class="chart-hint">${t.chartHint}</p>
      <div class="chart-legend"><span><i class="legend-dot correct"></i>${t.correct}</span><span><i class="legend-dot incorrect"></i>${t.incorrect}</span><span><i class="legend-dot skipped"></i>${t.skippedLabel}</span><span><i class="legend-dot unasked"></i>${t.notAsked}</span></div>
      <div class="language-results"><div class="chart-column-headings"><span></span><div>${CONFIG.stages.map((stage) => `<span>${t[stage.id]}</span>`).join('')}</div><span></span></div>${alphabetical.map(languageChart).join('')}</div>
      <p class="results-caveat">${t.caveat}</p>
      ${records.length ? `<details class="review"><summary>${t.review}<span aria-hidden="true">+</span></summary><div>${records.map((record) => {
        const answer = CONCEPTS.find((concept) => concept.id === record.answer);
        return `<div class="review-row"><div><span class="review-language">${languageName(record.language)} · ${t[record.phase]} · ${t[`${record.concept.band}Level`]}</span><strong lang="${record.language}">${record.concept[record.language]}</strong></div><div><span>${t.rightAnswer}: <strong>${record.concept[settings.reference]}</strong></span><span class="${record.correct ? 'correct-text' : ''}">${t.yourAnswer}: ${answer ? answer[settings.reference] : t.unknown}${record.correct ? ' ✓' : ''}</span></div></div>`;
      }).join('')}</div></details>` : ''}
      <aside class="method-note"><h2>${t.method}</h2><p>${t.methodBody}</p></aside>
      </div></details>
      <button class="primary" id="restart">${t.restart}<span aria-hidden="true">↗</span></button>
    </section>`;
  document.querySelector('#restart').addEventListener('click', () => { session = null; renderSetup(); focusHeading(); });
  focusHeading();
}

document.addEventListener('keydown', (event) => {
  if (screen !== 'question' || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
  const index = Number(event.key) - 1;
  if (/^[1-4]$/.test(event.key)) {
    event.preventDefault();
    submitAnswer(session.current.options[index].id);
  } else if (event.key === '0') {
    event.preventDefault();
    submitAnswer(null);
  }
});

renderSetup();
