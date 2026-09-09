import { CONFIG } from './data.js';

export const answerScore = (records) => records.reduce((sum, record) => sum + CONFIG.scoring[record.answer === null ? 'skipped' : record.correct ? 'correct' : 'incorrect'], 0);

export function maximumQuestions(count) {
  const screening = count * CONFIG.stages[0].questionsPerLanguage;
  const followup = CONFIG.stages[1].questionsPerLanguage + CONFIG.adaptive.confirmationBands.length;
  const slots = Math.min(count, Math.floor((CONFIG.maxQuestions - screening) / followup));
  return screening + slots * followup;
}

export function planStage(index, languages, records, tieOrder) {
  const stage = CONFIG.stages[index];
  if (index === 0) {
    return Object.fromEntries(languages.map((language) => [language, Array(stage.questionsPerLanguage).fill('easy')]));
  }
  const previous = CONFIG.stages[index - 1];
  const minimum = index === 1 ? CONFIG.adaptive.minimumScreenScore : CONFIG.adaptive.minimumFollowupScore;
  const candidates = languages.map((language) => {
    const items = records.filter((record) => record.language === language && record.phase === previous.id);
    return { language, count: items.length, score: answerScore(items), hits: items.filter((record) => record.correct).length };
  }).filter((item) => item.count === previous.questionsPerLanguage && item.score >= minimum)
    .sort((a, b) => b.score - a.score || b.hits - a.hits || tieOrder.indexOf(a.language) - tieOrder.indexOf(b.language));
  const bands = index === 1 ? Array(stage.questionsPerLanguage).fill('medium') : CONFIG.adaptive.confirmationBands;
  // Reserve a complete final check for every language admitted to Refine.
  const allocation = bands.length + (index === 1 ? CONFIG.adaptive.confirmationBands.length : 0);
  const slots = Math.max(0, Math.floor((CONFIG.maxQuestions - records.length) / allocation));
  return Object.fromEntries(candidates.slice(0, slots).map(({ language }) => [language, [...bands]]));
}

export function multilingualScore(records, languages) {
  const fullRun = CONFIG.stages.reduce((sum, stage) => sum + stage.questionsPerLanguage, 0);
  return languages.reduce((sum, language) => {
    const items = records.filter((record) => record.language === language);
    const correct = items.filter((record) => record.correct).length;
    const incorrect = items.filter((record) => record.answer !== null && !record.correct).length;
    return sum + Math.max(0, correct - incorrect / (CONFIG.optionCount - 1)) / fullRun;
  }, 0);
}
