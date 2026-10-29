export const ERA = {
  "2024": { label: "Сегодня", year: 2024, lifeAdj: 0, note: "актуальные данные" },
  "1990": { label: "Прошлое", year: 1990, lifeAdj: -6, note: "ниже медицина и доходы" },
  "2080": { label: "Будущее", year: 2080, lifeAdj: +7, note: "прогноз ООН" }
};

// Упрощённые, но правдоподобные веса рождаемости (тыс. рождений в год, ~140 млн всего)
// Сумма ~ 135 млн — близко к реальности 2023. Процент = births / total
export const COUNTRIES = [
  { id:'IN', name:'Индия', flag:'🇮🇳', region:'Южная Азия', births:23000, pop:1428000, lifeM:69, lifeF:71, gdp:7200, urban:35, lang:'hi' },
  { id:'CN', name:'Китай', flag:'🇨🇳', region:'Восточная Азия', births:9000, pop:1425000, lifeM:75, lifeF:80, gdp:21000, urban:64, lang:'zh' },
  { id:'NG', name:'Нигерия', flag:'🇳🇬', region:'Африка', births:7700, pop:223000, lifeM:53, lifeF:55, gdp:5400, urban:52, lang:'en' },
  { id:'PK', name:'Пакистан', flag:'🇵🇰', region:'Южная Азия', births:6500, pop:235000, lifeM:65, lifeF:67, gdp:5700, urban:37, lang:'ur' },
  { id:'ID', name:'Индонезия', flag:'🇮🇩', region:'Юго-Восточная Азия', births:4400, pop:277000, lifeM:69, lifeF:73, gdp:13500, urban:57, lang:'id' },
  { id:'BD', name:'Бангладеш', flag:'🇧🇩', region:'Южная Азия', births:3100, pop:172000, lifeM:71, lifeF:74, gdp:7600, urban:39, lang:'bn' },
  { id:'ET', name:'Эфиопия', flag:'🇪🇹', region:'Африка', births:4000, pop:126000, lifeM:64, lifeF:68, gdp:2800, urban:22, lang:'am' },
  { id:'US', name:'США', flag:'🇺🇸', region:'Северная Америка', births:3600, pop:340000, lifeM:73, lifeF:79, gdp:65000, urban:83, lang:'en' },
  { id:'BR', name:'Бразилия', flag:'🇧🇷', region:'Южная Америка', births:2700, pop:215000, lifeM:71, lifeF:79, gdp:16000, urban:87, lang:'pt' },
  { id:'CD', name:'ДР Конго', flag:'🇨🇩', region:'Африка', births:3800, pop:102000, lifeM:59, lifeF:62, gdp:1300, urban:46, lang:'fr' },
  { id:'PH', name:'Филиппины', flag:'🇵🇭', region:'Юго-Восточная Азия', births:2500, pop:117000, lifeM:68, lifeF:72, gdp:10000, urban:47, lang:'tl' },
  { id:'EG', name:'Египет', flag:'🇪🇬', region:'Ближний Восток', births:2600, pop:105000, lifeM:69, lifeF:73, gdp:14000, urban:43, lang:'ar' },
  { id:'MX', name:'Мексика', flag:'🇲🇽', region:'Северная Америка', births:2000, pop:128000, lifeM:70, lifeF:77, gdp:21000, urban:81, lang:'es' },
  { id:'RU', name:'Россия', flag:'🇷🇺', region:'Европа', births:1400, pop:144000, lifeM:64, lifeF:74, gdp:30000, urban:74, lang:'ru' },
  { id:'VN', name:'Вьетнам', flag:'🇻🇳', region:'Юго-Восточная Азия', births:1500, pop:100000, lifeM:71, lifeF:76, gdp:13000, urban:39, lang:'vi' },
  { id:'IR', name:'Иран', flag:'🇮🇷', region:'Ближний Восток', births:1400, pop:89000, lifeM:74, lifeF:76, gdp:15000, urban:76, lang:'fa' },
  { id:'TR', name:'Турция', flag:'🇹🇷', region:'Ближний Восток', births:1200, pop:85000, lifeM:74, lifeF:80, gdp:32000, urban:77, lang:'tr' },
  { id:'TH', name:'Таиланд', flag:'🇹🇭', region:'Юго-Восточная Азия', births:600, pop:72000, lifeM:73, lifeF:80, gdp:16000, urban:52, lang:'th' },
  { id:'ZA', name:'ЮАР', flag:'🇿🇦', region:'Африка', births:1200, pop:60000, lifeM:60, lifeF:66, gdp:14500, urban:68, lang:'en' },
  { id:'TZ', name:'Танзания', flag:'🇹🇿', region:'Африка', births:2200, pop:65000, lifeM:63, lifeF:67, gdp:2800, urban:36, lang:'sw' },
  { id:'KE', name:'Кения', flag:'🇰🇪', region:'Африка', births:1500, pop:55000, lifeM:61, lifeF:66, gdp:5200, urban:29, lang:'sw' },
  { id:'UG', name:'Уганда', flag:'🇺🇬', region:'Африка', births:1700, pop:48000, lifeM:62, lifeF:66, gdp:2600, urban:26, lang:'en' },
  { id:'MM', name:'Мьянма', flag:'🇲🇲', region:'Юго-Восточная Азия', births:900, pop:54000, lifeM:64, lifeF:69, gdp:4800, urban:31, lang:'my' },
  { id:'GB', name:'Великобритания', flag:'🇬🇧', region:'Европа', births:700, pop:68000, lifeM:80, lifeF:84, gdp:50000, urban:84, lang:'en' },
  { id:'DE', name:'Германия', flag:'🇩🇪', region:'Европа', births:700, pop:84000, lifeM:79, lifeF:84, gdp:56000, urban:77, lang:'de' },
  { id:'FR', name:'Франция', flag:'🇫🇷', region:'Европа', births:680, pop:68000, lifeM:80, lifeF:85, gdp:52000, urban:81, lang:'fr' },
  { id:'IT', name:'Италия', flag:'🇮🇹', region:'Европа', births:400, pop:59000, lifeM:81, lifeF:85, gdp:46000, urban:71, lang:'it' },
  { id:'ES', name:'Испания', flag:'🇪🇸', region:'Европа', births:330, pop:47000, lifeM:81, lifeF:86, gdp:42000, urban:81, lang:'es' },
  { id:'PL', name:'Польша', flag:'🇵🇱', region:'Европа', births:300, pop:41000, lifeM:73, lifeF:81, gdp:36000, urban:60, lang:'pl' },
  { id:'UA', name:'Украина', flag:'🇺🇦', region:'Европа', births:200, pop:41000, lifeM:66, lifeF:76, gdp:14000, urban:69, lang:'uk' },
  { id:'JP', name:'Япония', flag:'🇯🇵', region:'Восточная Азия', births:750, pop:124000, lifeM:81, lifeF:87, gdp:44000, urban:92, lang:'ja' },
  { id:'KR', name:'Южная Корея', flag:'🇰🇷', region:'Восточная Азия', births:250, pop:52000, lifeM:81, lifeF:86, gdp:48000, urban:81, lang:'ko' },
  { id:'CA', name:'Канада', flag:'🇨🇦', region:'Северная Америка', births:360, pop:39000, lifeM:80, lifeF:84, gdp:52000, urban:81, lang:'en' },
  { id:'AU', name:'Австралия', flag:'🇦🇺', region:'Океания', births:300, pop:26000, lifeM:81, lifeF:85, gdp:55000, urban:86, lang:'en' },
  { id:'AR', name:'Аргентина', flag:'🇦🇷', region:'Южная Америка', births:600, pop:45000, lifeM:73, lifeF:79, gdp:22000, urban:92, lang:'es' },
  { id:'CO', name:'Колумбия', flag:'🇨🇴', region:'Южная Америка', births:700, pop:52000, lifeM:74, lifeF:81, gdp:16000, urban:82, lang:'es' },
  { id:'PE', name:'Перу', flag:'🇵🇪', region:'Южная Америка', births:550, pop:34000, lifeM:73, lifeF:78, gdp:14000, urban:79, lang:'es' },
  { id:'VE', name:'Венесуэла', flag:'🇻🇪', region:'Южная Америка', births:500, pop:28000, lifeM:70, lifeF:78, gdp:7000, urban:88, lang:'es' },
  { id:'CL', name:'Чили', flag:'🇨🇱', region:'Южная Америка', births:200, pop:19000, lifeM:78, lifeF:84, gdp:26000, urban:88, lang:'es' },
  { id:'KZ', name:'Казахстан', flag:'🇰🇿', region:'Центральная Азия', births:400, pop:19000, lifeM:68, lifeF:76, gdp:26000, urban:58, lang:'kk' },
  { id:'UZ', name:'Узбекистан', flag:'🇺🇿', region:'Центральная Азия', births:900, pop:35000, lifeM:69, lifeF:74, gdp:8500, urban:51, lang:'uz' },
  { id:'AF', name:'Афганистан', flag:'🇦🇫', region:'Южная Азия', births:1500, pop:42000, lifeM:61, lifeF:64, gdp:1800, urban:26, lang:'fa' },
  { id:'IQ', name:'Ирак', flag:'🇮🇶', region:'Ближний Восток', births:1100, pop:45000, lifeM:69, lifeF:73, gdp:11000, urban:71, lang:'ar' },
  { id:'SY', name:'Сирия', flag:'🇸🇾', region:'Ближний Восток', births:500, pop:23000, lifeM:69, lifeF:75, gdp:2900, urban:55, lang:'ar' },
  { id:'YE', name:'Йемен', flag:'🇾🇪', region:'Ближний Восток', births:1000, pop:34000, lifeM:64, lifeF:68, gdp:1800, urban:38, lang:'ar' },
  { id:'SA', name:'Саудовская Аравия', flag:'🇸🇦', region:'Ближний Восток', births:600, pop:36000, lifeM:75, lifeF:78, gdp:55000, urban:84, lang:'ar' },
  { id:'MA', name:'Марокко', flag:'🇲🇦', region:'Африка', births:600, pop:37000, lifeM:74, lifeF:77, gdp:8500, urban:64, lang:'ar' },
  { id:'DZ', name:'Алжир', flag:'🇩🇿', region:'Африка', births:1000, pop:45000, lifeM:76, lifeF:78, gdp:11800, urban:74, lang:'ar' },
  { id:'SD', name:'Судан', flag:'🇸🇩', region:'Африка', births:1400, pop:48000, lifeM:63, lifeF:67, gdp:3700, urban:35, lang:'ar' },
  { id:'GH', name:'Гана', flag:'🇬🇭', region:'Африка', births:900, pop:33000, lifeM:63, lifeF:66, gdp:5900, urban:59, lang:'en' },
  { id:'MZ', name:'Мозамбик', flag:'🇲🇿', region:'Африка', births:1100, pop:33000, lifeM:58, lifeF:64, gdp:1400, urban:37, lang:'pt' },
  { id:'ZM', name:'Замбия', flag:'🇿🇲', region:'Африка', births:700, pop:20000, lifeM:61, lifeF:66, gdp:3400, urban:45, lang:'en' },
  { id:'RW', name:'Руанда', flag:'🇷🇼', region:'Африка', births:400, pop:14000, lifeM:66, lifeF:70, gdp:2600, urban:17, lang:'rw' },
  { id:'NE', name:'Нигер', flag:'🇳🇪', region:'Африка', births:1100, pop:27000, lifeM:61, lifeF:64, gdp:1300, urban:17, lang:'fr' },
  { id:'ML', name:'Мали', flag:'🇲🇱', region:'Африка', births:800, pop:23000, lifeM:58, lifeF:60, gdp:2400, urban:45, lang:'fr' },
  { id:'BF', name:'Буркина-Фасо', flag:'🇧🇫', region:'Африка', births:800, pop:23000, lifeM:59, lifeF:62, gdp:2300, urban:31, lang:'fr' },
  { id:'SN', name:'Сенегал', flag:'🇸🇳', region:'Африка', births:600, pop:17000, lifeM:66, lifeF:70, gdp:3600, urban:49, lang:'fr' },
  { id:'AO', name:'Ангола', flag:'🇦🇴', region:'Африка', births:1300, pop:37000, lifeM:61, lifeF:66, gdp:6700, urban:67, lang:'pt' },
  { id:'CM', name:'Камерун', flag:'🇨🇲', region:'Африка', births:900, pop:28000, lifeM:58, lifeF:61, gdp:3800, urban:58, lang:'fr' },
  { id:'SE', name:'Швеция', flag:'🇸🇪', region:'Европа', births:110, pop:10000, lifeM:81, lifeF:85, gdp:56000, urban:88, lang:'sv' },
  { id:'NO', name:'Норвегия', flag:'🇳🇴', region:'Европа', births:50, pop:5500, lifeM:81, lifeF:84, gdp:65000, urban:83, lang:'no' },
  { id:'CH', name:'Швейцария', flag:'🇨🇭', region:'Европа', births:80, pop:8800, lifeM:82, lifeF:86, gdp:78000, urban:74, lang:'de' },
  { id:'NL', name:'Нидерланды', flag:'🇳🇱', region:'Европа', births:170, pop:18000, lifeM:80, lifeF:84, gdp:60000, urban:93, lang:'nl' },
  { id:'BE', name:'Бельгия', flag:'🇧🇪', region:'Европа', births:120, pop:12000, lifeM:80, lifeF:84, gdp:55000, urban:98, lang:'nl' },
  { id:'NZ', name:'Новая Зеландия', flag:'🇳🇿', region:'Океания', births:60, pop:5000, lifeM:81, lifeF:84, gdp:45000, urban:87, lang:'en' },
  { id:'SG', name:'Сингапур', flag:'🇸🇬', region:'Юго-Восточная Азия', births:35, pop:5900, lifeM:81, lifeF:86, gdp:105000, urban:100, lang:'en' },
  { id:'AE', name:'ОАЭ', flag:'🇦🇪', region:'Ближний Восток', births:90, pop:9500, lifeM:77, lifeF:80, gdp:70000, urban:87, lang:'ar' },
  { id:'IL', name:'Израиль', flag:'🇮🇱', region:'Ближний Восток', births:180, pop:9000, lifeM:81, lifeF:85, gdp:49000, urban:93, lang:'he' },
  { id:'GR', name:'Греция', flag:'🇬🇷', region:'Европа', births:70, pop:10000, lifeM:80, lifeF:85, gdp:31000, urban:80, lang:'el' },
  { id:'PT', name:'Португалия', flag:'🇵🇹', region:'Европа', births:80, pop:10000, lifeM:79, lifeF:85, gdp:35000, urban:67, lang:'pt' },
  { id:'IE', name:'Ирландия', flag:'🇮🇪', region:'Европа', births:60, pop:5000, lifeM:80, lifeF:84, gdp:110000, urban:64, lang:'en' },
  { id:'CZ', name:'Чехия', flag:'🇨🇿', region:'Европа', births:100, pop:10000, lifeM:76, lifeF:82, gdp:42000, urban:74, lang:'cs' },
  { id:'RO', name:'Румыния', flag:'🇷🇴', region:'Европа', births:180, pop:19000, lifeM:71, lifeF:79, gdp:33000, urban:54, lang:'ro' },
  { id:'BY', name:'Беларусь', flag:'🇧🇾', region:'Европа', births:80, pop:9500, lifeM:65, lifeF:77, gdp:20000, urban:79, lang:'be' },
  { id:'HU', name:'Венгрия', flag:'🇭🇺', region:'Европа', births:90, pop:9600, lifeM:71, lifeF:79, gdp:36000, urban:72, lang:'hu' },
  { id:'NP', name:'Непал', flag:'🇳🇵', region:'Южная Азия', births:600, pop:30000, lifeM:69, lifeF:72, gdp:4100, urban:21, lang:'ne' },
  { id:'LK', name:'Шри-Ланка', flag:'🇱🇰', region:'Южная Азия', births:300, pop:22000, lifeM:74, lifeF:80, gdp:13500, urban:19, lang:'si' },
  { id:'KH', name:'Камбоджа', flag:'🇰🇭', region:'Юго-Восточная Азия', births:350, pop:17000, lifeM:68, lifeF:72, gdp:4800, urban:24, lang:'km' },
  { id:'LA', name:'Лаос', flag:'🇱🇦', region:'Юго-Восточная Азия', births:150, pop:7500, lifeM:67, lifeF:70, gdp:8000, urban:36, lang:'lo' },
  { id:'MN', name:'Монголия', flag:'🇲🇳', region:'Восточная Азия', births:70, pop:3300, lifeM:66, lifeF:73, gdp:13000, urban:69, lang:'mn' },
  { id:'TJ', name:'Таджикистан', flag:'🇹🇯', region:'Центральная Азия', births:250, pop:10000, lifeM:69, lifeF:73, gdp:4300, urban:28, lang:'tg' },
  { id:'KG', name:'Кыргызстан', flag:'🇰🇬', region:'Центральная Азия', births:150, pop:6700, lifeM:67, lifeF:75, gdp:5800, urban:37, lang:'ky' },
  { id:'AZ', name:'Азербайджан', flag:'🇦🇿', region:'Ближний Восток', births:130, pop:10000, lifeM:68, lifeF:74, gdp:17000, urban:56, lang:'az' },
  { id:'AM', name:'Армения', flag:'🇦🇲', region:'Ближний Восток', births:35, pop:2800, lifeM:71, lifeF:78, gdp:15000, urban:63, lang:'hy' },
  { id:'GE', name:'Грузия', flag:'🇬🇪', region:'Ближний Восток', births:40, pop:3700, lifeM:68, lifeF:78, gdp:18000, urban:59, lang:'ka' },
  { id:'JO', name:'Иордания', flag:'🇯🇴', region:'Ближний Восток', births:200, pop:11000, lifeM:74, lifeF:76, gdp:11000, urban:92, lang:'ar' },
  { id:'LB', name:'Ливан', flag:'🇱🇧', region:'Ближний Восток', births:80, pop:5500, lifeM:75, lifeF:78, gdp:10000, urban:89, lang:'ar' },
  { id:'CU', name:'Куба', flag:'🇨🇺', region:'Северная Америка', births:100, pop:11000, lifeM:72, lifeF:78, gdp:11000, urban:77, lang:'es' },
  { id:'DO', name:'Доминикана', flag:'🇩🇴', region:'Северная Америка', births:200, pop:11000, lifeM:71, lifeF:77, gdp:19000, urban:83, lang:'es' },
  { id:'GT', name:'Гватемала', flag:'🇬🇹', region:'Северная Америка', births:400, pop:18000, lifeM:69, lifeF:75, gdp:14000, urban:52, lang:'es' },
  { id:'HN', name:'Гондурас', flag:'🇭🇳', region:'Северная Америка', births:200, pop:10000, lifeM:73, lifeF:77, gdp:6500, urban:58, lang:'es' },
  { id:'SV', name:'Сальвадор', flag:'🇸🇻', region:'Северная Америка', births:100, pop:6400, lifeM:69, lifeF:78, gdp:10000, urban:74, lang:'es' },
  { id:'NI', name:'Никарагуа', flag:'🇳🇮', region:'Северная Америка', births:130, pop:6800, lifeM:72, lifeF:77, gdp:6500, urban:59, lang:'es' },
  { id:'CR', name:'Коста-Рика', flag:'🇨🇷', region:'Северная Америка', births:60, pop:5200, lifeM:78, lifeF:83, gdp:24000, urban:82, lang:'es' },
  { id:'PA', name:'Панама', flag:'🇵🇦', region:'Северная Америка', births:70, pop:4400, lifeM:76, lifeF:82, gdp:31000, urban:69, lang:'es' },
  { id:'BO', name:'Боливия', flag:'🇧🇴', region:'Южная Америка', births:250, pop:12000, lifeM:66, lifeF:72, gdp:9600, urban:70, lang:'es' },
  { id:'PY', name:'Парагвай', flag:'🇵🇾', region:'Южная Америка', births:130, pop:6800, lifeM:70, lifeF:76, gdp:14000, urban:62, lang:'es' },
  { id:'UY', name:'Уругвай', flag:'🇺🇾', region:'Южная Америка', births:40, pop:3400, lifeM:73, lifeF:81, gdp:24000, urban:95, lang:'es' },
  { id:'EC', name:'Эквадор', flag:'🇪🇨', region:'Южная Америка', births:300, pop:18000, lifeM:74, lifeF:79, gdp:12000, urban:64, lang:'es' },
  { id:'HT', name:'Гаити', flag:'🇭🇹', region:'Северная Америка', births:250, pop:11000, lifeM:62, lifeF:66, gdp:3200, urban:58, lang:'ht' },
  { id:'JM', name:'Ямайка', flag:'🇯🇲', region:'Северная Америка', births:40, pop:2800, lifeM:72, lifeF:77, gdp:10000, urban:56, lang:'en' },
  { id:'FI', name:'Финляндия', flag:'🇫🇮', region:'Европа', births:45, pop:5500, lifeM:79, lifeF:85, gdp:52000, urban:86, lang:'fi' },
  { id:'DK', name:'Дания', flag:'🇩🇰', region:'Европа', births:60, pop:5900, lifeM:80, lifeF:83, gdp:62000, urban:88, lang:'da' },
  { id:'IS', name:'Исландия', flag:'🇮🇸', region:'Европа', births:4, pop:380, lifeM:81, lifeF:84, gdp:62000, urban:94, lang:'is' },
  { id:'HR', name:'Хорватия', flag:'🇭🇷', region:'Европа', births:35, pop:3800, lifeM:75, lifeF:81, gdp:34000, urban:57, lang:'hr' },
  { id:'RS', name:'Сербия', flag:'🇷🇸', region:'Европа', births:60, pop:6600, lifeM:72, lifeF:78, gdp:21000, urban:56, lang:'sr' },
  { id:'BG', name:'Болгария', flag:'🇧🇬', region:'Европа', births:55, pop:6800, lifeM:71, lifeF:79, gdp:26000, urban:76, lang:'bg' },
];

// Имена по регионам
export const NAMES = {
  "Южная Азия": { m: ["Аарав","Вихаан","Мохаммед","Ахмед","Рахул","Имран","Санджай"], f: ["Аарья","Дия","Фатима","Прија","Аиша","Сания","Лакшми"] },
  "Восточная Азия": { m: ["Хироши","Минь","Вэй","Кента","Джун"], f: ["Юки","Мэй","Харука","Линь","Суми"] },
  "Юго-Восточная Азия": { m: ["Ади","Буди","Тхан","Анурат"], f: ["Сари","Май","Лили","Нари"] },
  "Ближний Восток": { m: ["Омар","Али","Юсуф","Ахмад","Халид"], f: ["Лейла","Нур","Сара","Ясмин","Мариам"] },
  "Африка": { m: ["Кофи","Амара","Джозеф","Ибрагим","Самуэль"], f: ["Амина","Зара","Аша","Нанси","Мари"] },
  "Северная Америка": { m: ["Джеймс","Карлос","Майкл","Хосе","Давид"], f: ["Мария","Эмили","София","Изабелла","Валерия"] },
  "Южная Америка": { m: ["Сантьяго","Матео","Габриэль","Лукас","Диего"], f: ["София","Изабелла","Валентина","Камила","Лусия"] },
  "Европа": { m: ["Александр","Иван","Марк","Лука","Артём","Даниил"], f: ["София","Анна","Мария","Елена","Полина","Алиса"] },
  "Океания": { m: ["Оливер","Джек","Ноа","Чарли"], f: ["Оливия","Шарлотта","Амелия","Миа"] },
  "Центральная Азия": { m: ["Азамат","Нурлан","Тимур","Рустам"], f: ["Айжан","Дильназ","Малика","Сезим"] },
};
export const SURNAMES = ["Каримов","Смит","Гарсия","Ким","Ахмед","Патель","Иванов","Ли","Соуза","Ндиай","Мюллер"," Росси","Танака","Оливиера"];

export const CITY_TYPES = [
  { id:'village', label:'деревня', label2:'село' },
  { id:'town', label:'городок', label2:'малый город' },
  { id:'city', label:'город', label2:'мегаполис' }
];

// События — короткие истории. effects в диапазоне -18..+18
// age: [min,max]
export const EVENTS = [
  // 0-4
  { id:'birth', age:[0,0], icon:'👶', title:'Ты родилась', text:'Твоя семья держит тебя на руках. За окном — их мир: шумный или тихий, богатый или голодный. Им уже страшно и радостно.', choices:[
    { text:'Сжать кулачок', effects:{happiness:2, relations:2}, log:'Ты сжала кулачок — и все засмеялись.' },
    { text:'Открыть глаза', effects:{happiness:1, relations:1}, log:'Ты открыла глаза — мир расплывчатый, но тёплый.' }
  ]},
  { id:'first_word', age:[1,2], icon:'🍼', title:'Первое слово', text:'Ты пробуешь звуки. Мама склоняется ближе, папа снимает на старый телефон.', choices:[
    { text:'Сказать «мама»', effects:{relations:5, happiness:3}, log:'Ты сказала «мама» — и дом наполнился криком радости.' },
    { text:'Сказать «дай»', effects:{happiness:2, money:1}, log:'Ты сказала «дай» — все засмеялись, тебе дали печенье.' }
  ]},
  { id:'illness_baby', age:[0,4], icon:'🌡️', title:'Температура', text:'Ночь, жар. В селе нет аптеки, в городе — очередь. У семьи мало денег на врача.', choices:[
    { text:'Терпеть и ждать', effects:{health:-6, relations:1}, log:'Жар спал сам, но ты потеряла неделю — и вес.' },
    { text:'Идти к доктору 2 часа', effects:{health:4, money:-6, relations:2}, log:'Врач помог, но семья влезла в долги.' }
  ]},
  { id:'sibling', age:[2,5], icon:'🧸', title:'Брат или сестра', text:'Мама беременна снова. В доме тесно, но будет с кем играть.', choices:[
    { text:'Радоваться', effects:{relations:6, happiness:4, money:-3}, log:'У тебя появилась сестра. Ты стала старшей.' },
    { text:'Ревновать', effects:{happiness:-4, relations:-2}, log:'Ты ревновала — но потом привыкла делить.' }
  ]},
  // 4-10
  { id:'school_start', age:[5,8], icon:'🎒', title:'Первый класс', text:'Парта велика, ранец тяжёл. Учитель спрашивает, кем хочешь стать. Одноклассники — из разных семей.', choices:[
    { text:'Учиться старательно', effects:{happiness:-1, money:2, relations:1}, log:'Ты стала лучшей ученицей. Родители гордятся.' },
    { text:'Дружить со всеми', effects:{relations:6, happiness:4, money:-1}, log:'Ты нашла лучших друзей — учеба чуть просела.' }
  ]},
  { id:'work_child', age:[7,12], icon:'🧹', title:'Помогать семье', text:'После школы тебя просят помогать: в поле, на рынке, с малышами. Устаёшь, но семья держится на этом.', choices:[
    { text:'Помогать каждый день', effects:{relations:5, money:4, health:-2, happiness:-2}, log:'Ты стала опорой семьи — детство короче.' },
    { text:'Просить оставить школу', effects:{money: -2, happiness:3, relations:-1, health:1}, log:'Ты выпросила время на уроки — семья поняла.' }
  ]},
  { id:'friendship', age:[6,11], icon:'🪁', title:'Детская дружба', text:'Соседский ребёнок зовёт играть каждый день. Вы строите шалаш из веток и мечтаете уехать в столицу.', choices:[
    { text:'Хранить дружбу', effects:{relations:7, happiness:5}, flag:'friend_child', log:'Ваша дружба закрепилась на годы.' },
    { text:'Держаться отстранённо', effects:{relations:-3, happiness:-1}, log:'Вы отдалились — каждый сам по себе.' }
  ]},
  { id:'move_city', age:[8,13], icon:'🚌', title:'Переезд', text:'Семье предлагают работу в городе. Там школа лучше, но нет бабушки, двора и твоих друзей.', choices:[
    { text:'Переехать', effects:{money:5, relations:-4, happiness:-2, health:2}, flag:'moved_city', log:'Вы переехали в город — всё заново.' },
    { text:'Остаться', effects:{relations:4, happiness:2, money:-2}, log:'Вы остались — стабильно, но без перспектив.' }
  ]},
  // 12-17
  { id:'puberty', age:[12,15], icon:'🌱', title:'Ты меняешься', text:'Тело и настроение скачут. Взрослые то ругают, то хвалят. Хочется быть собой — но кем?', choices:[
    { text:'Искать себя', effects:{happiness:4, relations:-1}, log:'Ты начала искать — иногда больно, но честно.' },
    { text:'Быть как все', effects:{relations:4, happiness:-2}, log:'Ты слилась с компанией — спокойнее, но тесно.' }
  ]},
  { id:'first_love', age:[13,17], icon:'💌', title:'Первая любовь', text:'Сердце стучит, когда он/она рядом. Записка в учебнике, взгляд на перемене. Страшно признаться.', choices:[
    { text:'Признаться', effects:{happiness:8, relations:5, health:-1}, flag:'first_love', log:'Ты призналась — и вас связала первая любовь.' },
    { text:'Скрыть чувства', effects:{happiness:-4, relations:-1}, log:'Ты промолчала — чувство осталось внутри.' }
  ]},
  { id:'study_choice', age:[14,17], icon:'📚', title:'Экзамены', text:'Важный тест решает, пойдёшь ли ты в старшую школу/колледж. Родители не могут оплатить репетитора.', choices:[
    { text:'Готовиться ночами', effects:{health:-5, money:3, happiness:-2}, flag:'studious', log:'Ты не спала ночами — и сдала.' },
    { text:'Полагаться на удачу', effects:{happiness:2, money:-2, relations:1}, log:'Ты рискнула — результат средний.' }
  ]},
  { id:'phone', age:[12,16], icon:'📱', title:'Первый телефон', text:'Одноклассники уже с телефонами. Тебе дарят старый, или ты копишь на новый.', choices:[
    { text:'Копить самой', effects:{money:-2, happiness:3, relations:2}, log:'Ты купила телефон сама — гордость.' },
    { text:'Просить у родителей', effects:{money:-6, relations:-1, happiness:4}, log:'Родители купили — но с упрёками.' }
  ]},
  { id:'bully', age:[11,16], icon:'🥊', title:'Конфликт', text:'Тебя дразнят из-за одежды/акцента. Можно ответить силой, шуткой или уйти.', choices:[
    { text:'Ответить спокойно', effects:{relations:3, happiness:2, health:1}, log:'Ты ответила спокойно — уважение выросло.' },
    { text:'Драться', effects:{health:-6, happiness:-3, relations:-3}, log:'Драка — синяк и выговор.' }
  ]},
  // 18-24
  { id:'uni', age:[17,20], icon:'🎓', title:'Университет или работа', text:'Приглашение в вуз в столице. Но семье нужны деньги сейчас. Общежитие дорого, дорога далека.', choices:[
    { text:'Поступать', effects:{money:-8, happiness:5, relations:-1, health:-1}, flag:'uni', log:'Ты уехала учиться — новая жизнь.' },
    { text:'Идти работать', effects:{money:6, happiness:-2, relations:2}, flag:'work_early', log:'Ты пошла работать — деньги сразу.' }
  ]},
  { id:'migrate', age:[18,25], icon:'✈️', title:'Шанс уехать', text:'Знакомый зовёт в другую страну на работу. Виза, риск, тоска по дому. Но там платят в 5 раз больше.', choices:[
    { text:'Рискнуть', effects:{money:8, relations:-5, happiness:-3, health:-2}, flag:'migrant', log:'Ты уехала — мигрантка с надеждой.' },
    { text:'Остаться', effects:{relations:5, happiness:1, money:-1}, log:'Ты осталась — рядом семья.' }
  ]},
  { id:'first_job', age:[18,23], icon:'💼', title:'Первая работа', text:'Собеседование. Тебе предлагают низкую ставку, но с обучением. Или тяжёлый труд за больше денег.', choices:[
    { text:'Выбрать обучение', effects:{money:2, happiness:3, health:1}, log:'Ты выбрала рост — медленно, но верно.' },
    { text:'Выбрать деньги', effects:{money:7, health:-4, happiness:-2}, log:'Ты выбрала деньги — усталость, но стабильность.' }
  ]},
  { id:'love2', age:[19,26], icon:'💍', title:'Серьёзные отношения', text:'Человек, с которым хочется просыпаться. Предложение пожить вместе. Родители против — «рано».', choices:[
    { text:'Съехаться', effects:{happiness:6, relations:4, money:-3}, flag:'partner', log:'Вы стали жить вместе.' },
    { text:'Повременить', effects:{relations:1, happiness:-1, money:1}, log:'Вы решили не спешить.' }
  ]},
  { id:'party', age:[18,22], icon:'🎉', title:'Вечеринка', text:'Друзья зовут на ночь в городе. Завтра экзамен/смена. Хочется жить — и страшно.', choices:[
    { text:'Пойти', effects:{happiness:6, relations:4, health:-3, money:-2}, log:'Ночь запомнилась на годы.' },
    { text:'Остаться дома', effects:{happiness:-2, health:2, money:1}, log:'Ты осталась — тихо и правильно.' }
  ]},
  // 25-34
  { id:'child', age:[22,32], icon:'👶', title:'Ребёнок?', text:'Тест положительный. Радость и паника одновременно. Карьера только началась, денег впритык.', choices:[
    { text:'Рожать', effects:{happiness:7, relations:6, money:-7, health:-2}, flag:'child', log:'У тебя родился ребёнок — жизнь разделилась на до и после.' },
    { text:'Отложить', effects:{money:3, happiness:-3, relations:-1}, log:'Вы решили подождать — выбор тяжёлый.' }
  ]},
  { id:'career_peak', age:[26,34], icon:'📈', title:'Повышение', text:'Начальник предлагает должность с переездом и переработками. Больше денег — меньше дома.', choices:[
    { text:'Согласиться', effects:{money:9, happiness:-4, relations:-4, health:-3}, flag:'career', log:'Ты стала руководителем — цена высока.' },
    { text:'Отказаться', effects:{happiness:3, relations:3, money:-2}, log:'Ты отказалась — сохранила баланс.' }
  ]},
  { id:'house', age:[25,35], icon:'🏠', title:'Жильё', text:'Кредит на квартиру или аренда? Кредит — на 20 лет, аренда — деньги в никуда. Семья давит.', choices:[
    { text:'Взять кредит', effects:{money:-9, happiness:4, relations:2}, flag:'house', log:'Свой угол — пусть и в долгах.' },
    { text:'Снимать', effects:{money:-3, happiness:-1}, log:'Вы снимаете — гибко, но тревожно.' }
  ]},
  { id:'friend_reunion', age:[25,30], icon:'🪁', title:'Старый друг', text:'Тот самый друг из детства написал. Он/она в беде/успехе. Зовёт встретиться после лет молчания.', choices:[
    { text:'Встретиться', effects:{happiness:6, relations:7}, reqFlag:'friend_child', log:'Детская дружба ожила — вы снова рядом.' },
    { text:'Написать коротко', effects:{relations:-2, happiness:-1}, log:'Ты ответила сухо — нить оборвалась.' }
  ]},
  { id:'illness_mid', age:[28,40], icon:'🏥', title:'Диагноз', text:'Врач хмурится: «Нужно обследование». Страховки нет, очередь длинная. Страшно загуглить.', choices:[
    { text:'Лечиться платно', effects:{health:6, money:-10, happiness:-2}, log:'Ты заплатила — болезнь отступила.' },
    { text:'Ждать бесплатно', effects:{health:-7, happiness:-3}, log:'Ты ждала — болезнь прогрессировала.' }
  ]},
  { id:'lottery', age:[20,45], icon:'🎰', title:'Лотерея', text:'Вымышленная лотерея — шанс 1 к миллиону. Коллеги скидываются. «А вдруг?»', choices:[
    { text:'Купить билет', effects:{money:-2, happiness:1}, log:'Билет пустой — но мечтать было приятно.' },
    { text:'Не играть', effects:{money:1, happiness:-1}, log:'Ты не стала играть — деньги целее.' }
  ]},
  // 35-50
  { id:'divorce', age:[32,45], icon:'💔', title:'Кризис в паре', text:'Вы отдалились. Ссоры, усталость, будто говорите на разных языках. Дети чувствуют.', choices:[
    { text:'Идти к психологу', effects:{relations:5, money:-4, happiness:2}, log:'Вы пошли на терапию — стало легче.' },
    { text:'Расстаться', effects:{happiness:-6, relations:-6, money:-4}, flag:'divorced', log:'Вы расстались — больно, но честно.' }
  ]},
  { id:'parent_death', age:[30,50], icon:'🕯️', title:'Потеря', text:'Звонок ночью. Родитель умер. Ты далеко — или рядом, но бессильна. Мир опустел.', choices:[
    { text:'Вернуться домой', effects:{relations:4, money:-4, happiness:-5}, log:'Ты была рядом в последние дни.' },
    { text:'Не успеть', effects:{happiness:-8, relations:-2}, log:'Ты не успела — вина осталась.' }
  ]},
  { id:'business', age:[33,42], icon:'🧱', title:'Свой бизнес', text:'Идея: маленькая пекарня/мастерская. Кредит, риск, семья боится. Но глаза горят.', choices:[
    { text:'Открыть', effects:{money: -6, happiness:6, relations:-1}, flag:'business', log:'Ты открыла дело — страшно, но твоё.' },
    { text:'Оставить как хобби', effects:{happiness:1, money:1}, log:'Оставила хобби — спокойно.' }
  ]},
  // 50-65
  { id:'health50', age:[48,58], icon:'❤️', title:'Сердце', text:'Давление скачет, одышка. Врач: «Меньше стресса, больше ходьбы». Но как — с твоей работой?', choices:[
    { text:'Менять образ жизни', effects:{health:7, money:-3, happiness:2}, log:'Ты стала гулять каждый день — легче.' },
    { text:'Отмахнуться', effects:{health:-8, happiness:-1}, log:'Ты отмахнулась — стало хуже.' }
  ]},
  { id:'child_leaving', age:[48,60], icon:'🎓', title:'Дети уезжают', text:'Ребёнок поступил/уехал работать. Дом опустел. Тишина оглушает.', choices:[
    { text:'Отпустить с гордостью', effects:{happiness:3, relations:4}, log:'Ты отпустила — и гордишься.' },
    { text:'Удерживать', effects:{relations:-4, happiness:-4}, log:'Ты держала — и отдалились.' }
  ]},
  { id:'conflict', age:[25,60], icon:'⚠️', title:'Кризис в стране', text:'В стране — конфликт/кризис. Цены взлетели, кто-то уезжает. Твой район пока тих — но надолго ли?', choices:[
    { text:'Увозить семью', effects:{money:-7, relations:-3, happiness:-3, health:2}, log:'Вы уехали — безопасность дороже.' },
    { text:'Остаться и помогать', effects:{relations:5, happiness:-2, health:-2}, log:'Ты осталась помогать соседям.' }
  ]},
  // 65+
  { id:'retire', age:[60,70], icon:'🌿', title:'Пенсия', text:'Работа позади. Чем заполнить дни? Внуки, огород, книги — или пустота.', choices:[
    { text:'Заняться внуками', effects:{happiness:6, relations:6, health:2}, log:'Внуки дали новый смысл.' },
    { text:'Уйти в себя', effects:{happiness:-5, relations:-4, health:-3}, log:'Тишина стала одиночеством.' }
  ]},
  { id:'loss_partner', age:[62,78], icon:'🕊️', title:'Утрата', text:'Партнёр умер. Половина тебя — тоже. Друзья звонят, но никто не заменит.', choices:[
    { text:'Жить памятью', effects:{happiness:-3, relations:2}, log:'Ты живёшь памятью — и держишься.' },
    { text:'Искать новую близость', effects:{happiness:2, relations:3}, log:'Ты решилась на новую близость — тонкую, осторожную.' }
  ]},
  { id:'legacy', age:[65,85], icon:'📖', title:'Что останется', text:'Ты перебираешь фото. Что сказать молодым? О чём жалеешь?', choices:[
    { text:'«Любите, пока есть время»', effects:{happiness:4, relations:4}, log:'Ты оставила послание о любви.' },
    { text:'«Не бойтесь рисковать»', effects:{happiness:3, money:1}, log:'Ты оставила послание о смелости.' }
  ]},
  { id:'quiet', age:[40,85], icon:'☕', title:'Тихий год', text:'Год прошёл без событий. Работа, дом, редкие радости. Ты просто жила.', choices:[
    { text:'Прожить', effects:{happiness:1, health:1}, log:'Тихий год — тоже жизнь.' },
    { text:'Замечать мелочи', effects:{happiness:2, relations:1}, log:'Ты замечала мелочи — и год стал тёплым.' }
  ]},
];

// Для тихих лет — подменяем текст на более атмосферный
export const QUIET_TEXTS = [
  "Обычный год. Завтрак, дорога, работа, ужин. Иногда — смех, иногда — слёзы.",
  "Год как год: новости тревожат, но дома тепло. Ты учишься быть.",
  "Сезоны сменились. Ты стала чуть старше — и чуть мудрее.",
  "Без больших событий. Но в мелочах — вся жизнь.",
];
