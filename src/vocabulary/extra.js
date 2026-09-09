export const EXTRA_BANDS = [
  ['easy', ['dog', 'fish', 'tree', 'milk', 'apple', 'road', 'rain', 'eye', 'fire', 'sea']],
  ['medium', ['shoulder', 'elbow', 'knee', 'towel', 'ceiling', 'needle', 'ladder', 'shore', 'candle', 'basket', 'pillow', 'rope']],
  ['hard', ['nettle', 'buckle', 'shovel', 'moss', 'walnut', 'sparrow', 'kettle', 'funnel', 'wreath', 'pliers']],
];

// Columns follow EXTRA_BANDS; these entries are provisional, not reviewed assessment items.
export const EXTRA_WORDS = {
  en: 'dog|fish|tree|milk|apple|road|rain|eye|fire|sea|shoulder|elbow|knee|towel|ceiling|needle|ladder|shore|candle|basket|pillow|rope|nettle|buckle|shovel|moss|walnut|sparrow|kettle|funnel|wreath|pliers',
  es: 'perro|pez|árbol|leche|manzana|carretera|lluvia|ojo|fuego|mar|hombro|codo|rodilla|toalla|techo|aguja|escalera de mano|orilla|vela|cesta|almohada|cuerda|ortiga|hebilla|pala|musgo|nuez|gorrión|hervidor|embudo|guirnalda|alicates',
  fr: 'chien|poisson|arbre|lait|pomme|route|pluie|œil|feu|mer|épaule|coude|genou|serviette|plafond|aiguille|échelle|rive|bougie|panier|oreiller|corde|ortie|boucle|pelle|mousse|noix|moineau|bouilloire|entonnoir|couronne|pince',
  de: 'Hund|Fisch|Baum|Milch|Apfel|Straße|Regen|Auge|Feuer|Meer|Schulter|Ellenbogen|Knie|Handtuch|Zimmerdecke|Nadel|Leiter|Ufer|Kerze|Korb|Kopfkissen|Seil|Brennnessel|Schnalle|Schaufel|Moos|Walnuss|Spatz|Wasserkessel|Trichter|Kranz|Zange',
  it: 'cane|pesce|albero|latte|mela|strada|pioggia|occhio|fuoco|mare|spalla|gomito|ginocchio|asciugamano|soffitto|ago|scala a pioli|riva|candela|cesto|cuscino|corda|ortica|fibbia|pala|muschio|noce|passero|bollitore|imbuto|ghirlanda|pinze',
  pt: 'cachorro|peixe|árvore|leite|maçã|estrada|chuva|olho|fogo|mar|ombro|cotovelo|joelho|toalha|teto|agulha|escada de mão|margem|vela|cesto|travesseiro|corda|urtiga|fivela|pá|musgo|noz|pardal|chaleira|funil|guirlanda|alicate',
  nl: 'hond|vis|boom|melk|appel|weg|regen|oog|vuur|zee|schouder|elleboog|knie|handdoek|plafond|naald|ladder|oever|kaars|mand|hoofdkussen|touw|brandnetel|gesp|schop|mos|walnoot|mus|waterketel|trechter|krans|tang',
  sv: 'hund|fisk|träd|mjölk|äpple|väg|regn|öga|eld|hav|axel|armbåge|knä|handduk|innertak|nål|stege|strand|ljus|korg|kudde|rep|nässla|spänne|spade|mossa|valnöt|sparv|vattenkokare|tratt|krans|tång',
  pl: 'pies|ryba|drzewo|mleko|jabłko|droga|deszcz|oko|ogień|morze|bark|łokieć|kolano|ręcznik|sufit|igła|drabina|brzeg|świeca|kosz|poduszka|lina|pokrzywa|sprzączka|łopata|mech|orzech włoski|wróbel|czajnik|lejek|wieniec|szczypce',
  ru: 'собака|рыба|дерево|молоко|яблоко|дорога|дождь|глаз|огонь|море|плечо|локоть|колено|полотенце|потолок|игла|лестница|берег|свеча|корзина|подушка|верёвка|крапива|пряжка|лопата|мох|грецкий орех|воробей|чайник|воронка|венок|плоскогубцы',
  uk: 'собака|риба|дерево|молоко|яблуко|дорога|дощ|око|вогонь|море|плече|лікоть|коліно|рушник|стеля|голка|драбина|берег|свічка|кошик|подушка|мотузка|кропива|пряжка|лопата|мох|волоський горіх|горобець|чайник|лійка|вінок|плоскогубці',
  fi: 'koira|kala|puu|maito|omena|tie|sade|silmä|tuli|meri|olkapää|kyynärpää|polvi|pyyhe|katto|neula|tikkaat|ranta|kynttilä|kori|tyyny|köysi|nokkonen|solki|lapio|sammal|saksanpähkinä|varpunen|vedenkeitin|suppilo|seppele|pihdit',
  el: 'σκύλος|ψάρι|δέντρο|γάλα|μήλο|δρόμος|βροχή|μάτι|φωτιά|θάλασσα|ώμος|αγκώνας|γόνατο|πετσέτα|ταβάνι|βελόνα|σκάλα|όχθη|κερί|καλάθι|μαξιλάρι|σκοινί|τσουκνίδα|αγκράφα|φτυάρι|βρύα|καρύδι|σπουργίτι|βραστήρας|χωνί|στεφάνι|πένσα',
  hy: 'շուն|ձուկ|ծառ|կաթ|խնձոր|ճանապարհ|անձրև|աչք|կրակ|ծով|ուս|արմունկ|ծունկ|սրբիչ|առաստաղ|ասեղ|սանդուղք|ափ|մոմ|զամբյուղ|բարձ|պարան|եղինջ|ճարմանդ|թիակ|մամուռ|ընկույզ|ճնճղուկ|թեյնիկ|ձագար|պսակ|տափակաբերան աքցան',
  ka: 'ძაღლი|თევზი|ხე|რძე|ვაშლი|გზა|წვიმა|თვალი|ცეცხლი|ზღვა|მხარი|იდაყვი|მუხლი|პირსახოცი|ჭერი|ნემსი|კიბე|ნაპირი|სანთელი|კალათა|ბალიში|თოკი|ჭინჭარი|ბალთა|ნიჩაბი|ხავსი|კაკალი|ბეღურა|ჩაიდანი|ძაბრი|გვირგვინი|ბრტყელტუჩა',
  ja: '犬|魚|木|牛乳|りんご|道|雨|目|火|海|肩|肘|膝|タオル|天井|針|はしご|岸|ろうそく|かご|枕|縄|イラクサ|バックル|シャベル|苔|くるみ|スズメ|やかん|じょうご|花輪|ペンチ',
  cs: 'pes|ryba|strom|mléko|jablko|silnice|déšť|oko|oheň|moře|rameno|loket|koleno|ručník|strop|jehla|žebřík|břeh|svíčka|koš|polštář|lano|kopřiva|přezka|lopata|mech|vlašský ořech|vrabec|konvice|trychtýř|věnec|kleště',
  ro: 'câine|pește|copac|lapte|măr|drum|ploaie|ochi|foc|mare|umăr|cot|genunchi|prosop|tavan|ac|scară|mal|lumânare|coș|pernă|frânghie|urzică|cataramă|lopată|mușchi|nucă|vrabie|ceainic|pâlnie|cunună|clește',
  hu: 'kutya|hal|fa|tej|alma|út|eső|szem|tűz|tenger|váll|könyök|térd|törölköző|mennyezet|tű|létra|part|gyertya|kosár|párna|kötél|csalán|csat|lapát|moha|dió|veréb|vízforraló|tölcsér|koszorú|fogó',
  da: 'hund|fisk|træ|mælk|æble|vej|regn|øje|ild|hav|skulder|albue|knæ|håndklæde|loft|nål|stige|bred|stearinlys|kurv|hovedpude|reb|brændenælde|spænde|skovl|mos|valnød|spurv|kedel|tragt|krans|tang',
  no: 'hund|fisk|tre|melk|eple|vei|regn|øye|ild|hav|skulder|albue|kne|håndkle|tak|nål|stige|bredd|stearinlys|kurv|hodepute|tau|brennesle|spenne|spade|mose|valnøtt|spurv|vannkoker|trakt|krans|tang',
  tr: 'köpek|balık|ağaç|süt|elma|yol|yağmur|göz|ateş|deniz|omuz|dirsek|diz|havlu|tavan|iğne|merdiven|kıyı|mum|sepet|yastık|ip|ısırgan|toka|kürek|kara yosunu|ceviz|serçe|su ısıtıcısı|huni|çelenk|pense',
};

export const EXTRA_ROMANIZATIONS = {
  ru: 'sobaka|ryba|derevo|moloko|yabloko|doroga|dozhd|glaz|ogon|more|plecho|lokot|koleno|polotentse|potolok|igla|lestnitsa|bereg|svecha|korzina|podushka|veryovka|krapiva|pryazhka|lopata|mokh|gretskiy orekh|vorobey|chaynik|voronka|venok|ploskogubtsy',
  uk: 'sobaka|ryba|derevo|moloko|yabluko|doroha|doshch|oko|vohon|more|pleche|likot|kolino|rushnyk|stelya|holka|drabyna|bereh|svichka|koshyk|podushka|motuzka|kropyva|pryazhka|lopata|mokh|voloskyi horikh|horobets|chainyk|liika|vinok|ploskohubtsi',
  el: 'skýlos|psári|déntro|gála|mílo|drómos|vrochí|máti|fotiá|thálassa|ómos|agkónas|gónato|petséta|taváni|velóna|skála|óchthi|kerí|kaláthi|maxilári|skoiní|tsouknída|agkráfa|ftyári|vrýa|karýdi|spourgíti|vrastíras|choní|stefáni|pénsa',
  hy: 'shun|dzuk|tsar|kat|khndzor|chanaparh|andzrev|achk|krak|tsov|us|armunk|tsunk|srbich|arastagh|asegh|sandughk|ap|mom|zambyugh|bardz|paran|yeghinj|charmand|tiak|mamur|enkuyz|chnchghuk|teynik|dzagar|psak|tapakaberan aktsan',
  ka: 'dzaghli|tevzi|khe|rdze|vashli|gza|tsvima|tvali|tsetskhli|zghva|mkhari|idaqvi|mukhli|pirsakhotsi|cheri|nemsi|kibe|napiri|santeli|kalata|balishi|toki|chinchari|balta|nichabi|khavsi|kakali|beghura|chaidani|dzabri|gvirgvini|brtqeltucha',
  ja: 'inu|sakana|ki|gyūnyū|ringo|michi|ame|me|hi|umi|kata|hiji|hiza|taoru|tenjō|hari|hashigo|kishi|rōsoku|kago|makura|nawa|irakusa|bakkuru|shaberu|koke|kurumi|suzume|yakan|jōgo|hanawa|penchi',
};
