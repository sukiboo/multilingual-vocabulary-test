import { EXTRA_BANDS, EXTRA_WORDS, EXTRA_ROMANIZATIONS } from './extra.js';
import { MORE_BANDS, MORE_WORDS, MORE_ROMANIZATIONS } from './more.js';

const BANDS = [
  ['easy', ['water', 'house', 'sun', 'cat', 'bread', 'night', 'book', 'hand', 'flower', 'door']],
  ['medium', ['bridge', 'spoon', 'cloud', 'key', 'island', 'mirror', 'root', 'feather']],
  ['hard', ['thistle', 'hedgehog', 'anvil', 'thimble', 'acorn', 'icicle', 'ladle', 'sieve', 'hinge', 'fern']],
  ...EXTRA_BANDS,
  ...MORE_BANDS,
];

// Base columns follow the first three BANDS; extra columns are appended below. Native-speaker review is still needed.
const WORDS = {
  en: 'water|house|sun|cat|bread|night|book|hand|flower|door|bridge|spoon|cloud|key|island|mirror|root|feather|thistle|hedgehog|anvil|thimble|acorn|icicle|ladle|sieve|hinge|fern',
  es: 'agua|casa|sol|gato|pan|noche|libro|mano|flor|puerta|puente|cuchara|nube|llave|isla|espejo|raíz|pluma|cardo|erizo|yunque|dedal|bellota|carámbano|cucharón|tamiz|bisagra|helecho',
  fr: 'eau|maison|soleil|chat|pain|nuit|livre|main|fleur|porte|pont|cuillère|nuage|clé|île|miroir|racine|plume|chardon|hérisson|enclume|dé à coudre|gland|stalactite de glace|louche|tamis|charnière|fougère',
  de: 'Wasser|Haus|Sonne|Katze|Brot|Nacht|Buch|Hand|Blume|Tür|Brücke|Löffel|Wolke|Schlüssel|Insel|Spiegel|Wurzel|Feder|Distel|Igel|Amboss|Fingerhut|Eichel|Eiszapfen|Schöpfkelle|Sieb|Scharnier|Farn',
  it: 'acqua|casa|sole|gatto|pane|notte|libro|mano|fiore|porta|ponte|cucchiaio|nuvola|chiave|isola|specchio|radice|piuma|cardo|riccio|incudine|ditale|ghianda|ghiacciolo|mestolo|setaccio|cerniera|felce',
  pt: 'água|casa|sol|gato|pão|noite|livro|mão|flor|porta|ponte|colher|nuvem|chave|ilha|espelho|raiz|pena|cardo|ouriço|bigorna|dedal|bolota|estalactite de gelo|concha|peneira|dobradiça|samambaia',
  nl: 'water|huis|zon|kat|brood|nacht|boek|hand|bloem|deur|brug|lepel|wolk|sleutel|eiland|spiegel|wortel|veer|distel|egel|aambeeld|vingerhoed|eikel|ijspegel|soeplepel|zeef|scharnier|varen',
  sv: 'vatten|hus|sol|katt|bröd|natt|bok|hand|blomma|dörr|bro|sked|moln|nyckel|ö|spegel|rot|fjäder|tistel|igelkott|städ|fingerborg|ekollon|istapp|soppslev|sil|gångjärn|ormbunke',
  pl: 'woda|dom|słońce|kot|chleb|noc|książka|ręka|kwiat|drzwi|most|łyżka|chmura|klucz|wyspa|lustro|korzeń|pióro|oset|jeż|kowadło|naparstek|żołądź|sopel|chochla|sito|zawias|paproć',
  ru: 'вода|дом|солнце|кот|хлеб|ночь|книга|рука|цветок|дверь|мост|ложка|облако|ключ|остров|зеркало|корень|перо|чертополох|ёж|наковальня|напёрсток|жёлудь|сосулька|половник|сито|петля|папоротник',
  uk: 'вода|дім|сонце|кіт|хліб|ніч|книга|рука|квітка|двері|міст|ложка|хмара|ключ|острів|дзеркало|корінь|перо|будяк|їжак|ковадло|наперсток|жолудь|бурулька|ополоник|сито|завіса|папороть',
  fi: 'vesi|talo|aurinko|kissa|leipä|yö|kirja|käsi|kukka|ovi|silta|lusikka|pilvi|avain|saari|peili|juuri|höyhen|ohdake|siili|alasin|sormustin|terho|jääpuikko|kauha|seula|sarana|saniainen',
  el: 'νερό|σπίτι|ήλιος|γάτα|ψωμί|νύχτα|βιβλίο|χέρι|λουλούδι|πόρτα|γέφυρα|κουτάλι|σύννεφο|κλειδί|νησί|καθρέφτης|ρίζα|φτερό|γαϊδουράγκαθο|σκαντζόχοιρος|αμόνι|δαχτυλήθρα|βελανίδι|σταλακτίτης πάγου|κουτάλα|κόσκινο|μεντεσές|φτέρη',
  hy: 'ջուր|տուն|արև|կատու|հաց|գիշեր|գիրք|ձեռք|ծաղիկ|դուռ|կամուրջ|գդալ|ամպ|բանալի|կղզի|հայելի|արմատ|փետուր|տատասկ|ոզնի|սալ|մատնոց|կաղին|սառցալեզվակ|շերեփ|մաղ|ծխնի|պտեր',
  ka: 'წყალი|სახლი|მზე|კატა|პური|ღამე|წიგნი|ხელი|ყვავილი|კარი|ხიდი|კოვზი|ღრუბელი|გასაღები|კუნძული|სარკე|ფესვი|ბუმბული|ნარი|ზღარბი|გრდემლი|სათითე|რკო|ლოლუა|ჩამჩა|საცერი|ანჯამა|გვიმრა',
  ja: '水|家|太陽|猫|パン|夜|本|手|花|ドア|橋|スプーン|雲|鍵|島|鏡|根|羽|アザミ|ハリネズミ|金床|指ぬき|どんぐり|つらら|おたま|ふるい|蝶番|シダ',
  cs: 'voda|dům|slunce|kočka|chléb|noc|kniha|ruka|květina|dveře|most|lžíce|mrak|klíč|ostrov|zrcadlo|kořen|pero|bodlák|ježek|kovadlina|náprstek|žalud|rampouch|naběračka|síto|pant|kapradina',
  ro: 'apă|casă|soare|pisică|pâine|noapte|carte|mână|floare|ușă|pod|lingură|nor|cheie|insulă|oglindă|rădăcină|pană|ciulin|arici|nicovală|degetar|ghindă|țurțure|polonic|sită|balama|ferigă',
  hu: 'víz|ház|nap|macska|kenyér|éjszaka|könyv|kéz|virág|ajtó|híd|kanál|felhő|kulcs|sziget|tükör|gyökér|toll|bogáncs|sündisznó|üllő|gyűszű|makk|jégcsap|merőkanál|szita|zsanér|páfrány',
  da: 'vand|hus|sol|kat|brød|nat|bog|hånd|blomst|dør|bro|ske|sky|nøgle|ø|spejl|rod|fjer|tidsel|pindsvin|ambolt|fingerbøl|agern|istap|øse|si|hængsel|bregne',
  no: 'vann|hus|sol|katt|brød|natt|bok|hånd|blomst|dør|bro|skje|sky|nøkkel|øy|speil|rot|fjær|tistel|pinnsvin|ambolt|fingerbøl|eikenøtt|istapp|øse|sil|hengsel|bregne',
  tr: 'su|ev|güneş|kedi|ekmek|gece|kitap|el|çiçek|kapı|köprü|kaşık|bulut|anahtar|ada|ayna|kök|tüy|devedikeni|kirpi|örs|yüksük|meşe palamudu|buz saçağı|kepçe|elek|menteşe|eğrelti otu',
};

const ROMANIZATIONS = {
  ru: 'voda|dom|solntse|kot|khleb|noch|kniga|ruka|tsvetok|dver|most|lozhka|oblako|klyuch|ostrov|zerkalo|koren|pero|chertopolokh|yozh|nakovalnya|napyorstok|zhyolud|sosulka|polovnik|sito|petlya|paporotnik',
  uk: 'voda|dim|sontse|kit|khlib|nich|knyha|ruka|kvitka|dveri|mist|lozhka|khmara|klyuch|ostriv|dzerkalo|korin|pero|budyak|yizhak|kovadlo|naperstok|zholud|burulka|opolonyk|syto|zavisa|paporot',
  el: 'neró|spíti|ílios|gáta|psomí|nýchta|vivlío|chéri|louloúdi|pórta|géfyra|koutáli|sýnnefo|kleidí|nisí|kathréftis|ríza|fteró|gaïdourágkatho|skantzóchoiros|amóni|dachtylíthra|velanídi|stalaktítis págou|koutála|kóskino|mentesés|ftéri',
  hy: 'jur|tun|arev|katu|hats|gisher|girk|dzerk|tsaghik|dur|kamurj|gdal|amp|banali|kghzi|hayeli|armat|petur|tatask|vozni|sal|matnots|kaghin|sartsalezvak|sherep|magh|tskhni|pter',
  ka: 'tsqali|sakhli|mze|kata|puri|ghame|tsigni|kheli|qvavili|kari|khidi|kovzi|ghrubeli|gasaghebi|kundzuli|sarke|pesvi|bumbuli|nari|zgharbi|grdemli|satite|rko|lolua|chamcha|satseri|anjama|gvimra',
  ja: 'mizu|ie|taiyō|neko|pan|yoru|hon|te|hana|doa|hashi|supūn|kumo|kagi|shima|kagami|ne|hane|azami|harinezumi|kanatoko|yubinuki|donguri|tsurara|otama|furui|chōtsugai|shida',
};

export const CONCEPTS = BANDS.flatMap(([band, ids]) => ids.map((id) => ({ id, band })));
const conceptIds = new Set();
for (const { id } of CONCEPTS) {
  if (conceptIds.has(id)) throw new Error(`Duplicate vocabulary concept: ${id}`);
  conceptIds.add(id);
}
for (const [language, words] of Object.entries(WORDS)) {
  if (!EXTRA_WORDS[language] || !MORE_WORDS[language] || (ROMANIZATIONS[language] && (!EXTRA_ROMANIZATIONS[language] || !MORE_ROMANIZATIONS[language]))) {
    throw new Error(`Missing expanded vocabulary for ${language}`);
  }
  const terms = `${words}|${EXTRA_WORDS[language]}|${MORE_WORDS[language]}`.split('|');
  const latin = ROMANIZATIONS[language] ? `${ROMANIZATIONS[language]}|${EXTRA_ROMANIZATIONS[language]}|${MORE_ROMANIZATIONS[language]}`.split('|') : null;
  if (terms.length !== CONCEPTS.length || terms.some((term) => !term.trim()) || (latin && (latin.length !== terms.length || latin.some((term) => !term.trim())))) {
    throw new Error(`Vocabulary column count mismatch for ${language}`);
  }
  CONCEPTS.forEach((concept, index) => {
    concept[language] = terms[index];
    if (latin) concept[`${language}Latin`] = latin[index];
  });
}
