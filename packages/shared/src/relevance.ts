/**
 * Story-level relevance filter for the China–Taiwan Monitor pipeline.
 *
 * Returns true if an article appears to cover PR China, Hong Kong, Taiwan,
 * or a direct related nexus (US-China, China-Japan, China-Europe, etc.).
 *
 * Phase 2: keyword-based. Phase 3 will replace this with an LLM triage
 * call that emits {relevant, sectors[], importance, breaking, summary} —
 * see docs/ingestion-strategy.md.
 *
 * Tuning principle: tilt toward recall over precision. False positives
 * (irrelevant article slips through) are visible noise; false negatives
 * (relevant article dropped) are silent gaps. The Phase 3 LLM pass fixes
 * both. We accept some noise here to avoid silent gaps.
 */

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * English / Latin-script keywords. Each is matched with `\b` word boundaries
 * so "China" matches but "indochina" doesn't, "PLA" matches but "plane" doesn't.
 *
 * Cover: direct (China/Taiwan/HK), people (Xi/Lai/Tsai), institutions (CCP/KMT/
 * MND/MFA), military (PLA/PLAN/Han Kuang/Liaoning), geographies (mainland
 * cities, contested seas, autonomous regions), companies (TSMC/SMIC/Huawei/
 * Tencent/Alibaba/etc.), currency (yuan/RMB/HKD/TWD), index names, and
 * cross-relations frames (US-China, China-Japan, China-EU, etc.).
 */
const EN_TERMS: readonly string[] = [
  // Direct
  "china",
  "chinese",
  "prc",
  "p\\.r\\.c\\.",
  "mainland china",
  "ccp",
  "cpc",
  "communist party of china",
  "chinese communist party",
  "beijing",
  "taiwan",
  "taiwanese",
  "taipei",
  "kaohsiung",
  "formosa",
  "cross-strait",
  "cross strait",
  "one china",
  "one-china",
  "one-china policy",
  "hong kong",
  "hongkong",
  "hong-kong",
  "hongkonger",
  "hong konger",
  "hk-china",
  "macau",
  "macao",
  // Leaders and prominent officials
  "xi",         // Xi Jinping by surname alone — common in headlines. Word-boundary safe (does not match "axis", "hypoxia", etc.).
  "xi jinping",
  "xi-trump",
  "trump-xi",
  "trump xi",
  "xi-biden",
  "li qiang",
  "wang yi",
  "hu jintao",
  "jiang zemin",
  "li keqiang",
  "han zheng",
  "wang huning",
  "ding xuexiang",
  "qin gang",
  "chen binhua",
  "lin jian",
  "mao ning",
  "lai ching-te",
  "william lai",
  "tsai ing-wen",
  "ko wen-je",
  "hou yu-ih",
  "hsiao bi-khim",
  "joseph wu",
  "john lee", // HK CE
  // Parties and political institutions
  "kmt",
  "kuomintang",
  "dpp",
  "democratic progressive party",
  "tpp",
  "taiwan people's party",
  "national people's congress",
  "npc",
  "cppcc",
  "central military commission",
  "politburo",
  "standing committee",
  "taiwan affairs office",
  "state council",
  // Cross-relations frames
  "us-china",
  "china-us",
  "sino-american",
  "sino-us",
  "us\\.\\?china",
  "china-japan",
  "japan-china",
  "sino-japanese",
  "china-eu",
  "eu-china",
  "china-europe",
  "europe-china",
  "china-africa",
  "africa-china",
  "china-russia",
  "russia-china",
  "sino-russian",
  "china-india",
  "india-china",
  "china-asean",
  "asean-china",
  "china-philippines",
  "philippines-china",
  "china-australia",
  "australia-china",
  // Military / strategic
  "pla",
  "plan navy",
  "plaaf",
  "plarf",
  "han kuang",
  "liaoning",
  "shandong carrier",
  "fujian carrier",
  "rocket force",
  "indopacom",
  "indo-pacific",
  "first island chain",
  "second island chain",
  "south china sea",
  "scs",
  "east china sea",
  "senkaku",
  "diaoyu",
  "pratas",
  "spratly",
  "scarborough",
  "thaad",
  "aukus",
  "ait", // American Institute in Taiwan
  "mnd", // Taiwan MND
  // Tech / company ecosystem
  "tsmc",
  "smic",
  "yangtze memory",
  "ymtc",
  "huawei",
  "hisilicon",
  "kirin chip",
  "tencent",
  "alibaba",
  "alipay",
  "ant group",
  "bytedance",
  "tiktok",
  "baidu",
  "pinduoduo",
  "temu",
  "shein",
  "jd\\.com",
  "xiaomi",
  "meituan",
  "didi",
  "netease",
  "sinopec",
  "cnpc",
  "cnooc",
  "cnnc",
  "geely",
  "byd",
  "nio",
  "xpeng",
  "li auto",
  "catl",
  "mediatek",
  "umc",
  "asml china",
  "deepseek",
  "01\\.ai",
  // Mainland cities and autonomous regions
  "shanghai",
  "shenzhen",
  "guangzhou",
  "chongqing",
  "tianjin",
  "hangzhou",
  "chengdu",
  "wuhan",
  "xi'an",
  "nanjing",
  "qingdao",
  "dalian",
  "xinjiang",
  "tibet",
  "tibetan",
  "inner mongolia",
  "uyghur",
  "uighur",
  // Currency and markets
  "yuan",
  "renminbi",
  "rmb",
  "\\bcnh\\b",
  "\\bcny\\b",
  "\\btwd\\b",
  "\\bhkd\\b",
  "hang seng",
  "csi 300",
  "shanghai composite",
  "shenzhen component",
  "star 50",
  "taiex",
  "stock connect",
  "bond connect",
  "northbound flow",
  "southbound flow",
  // Trade and policy frames common in coverage
  "export controls",
  "entity list",
  "chip war",
  "chip act",
  "section 301",
  "belt and road",
  "bri",
  "made in china 2025",
  "dual circulation",
  "common prosperity",
  "wolf warrior",
  "panda diplomacy",
  // Triggers that often signal China nexus even without "China" word
  "han kuang exercise",
  "wolf warrior",
];

/**
 * Chinese-script terms (simplified + traditional). No word boundary needed —
 * CJK characters are inherently bounded for substring search.
 */
const ZH_TERMS: readonly string[] = [
  // Direct
  "中国",
  "中共",
  "中华",
  "中華",
  "大陆",
  "大陸",
  "对华",
  "對華",
  "涉华",
  "涉華",
  "京津冀",
  // Taiwan
  "台湾",
  "台灣",
  "臺灣",
  "两岸",
  "兩岸",
  "台北",
  "高雄",
  "台北101",
  "中華民國",
  "中华民国",
  // Hong Kong / Macau
  "香港",
  "港府",
  "港人",
  "港股",
  "澳门",
  "澳門",
  // Leaders
  "习近平",
  "習近平",
  "李强",
  "李強",
  "王毅",
  "胡锦涛",
  "胡錦濤",
  "韩正",
  "韓正",
  "丁薛祥",
  "陈斌华",
  "陳斌華",
  "林剑",
  "林劍",
  "毛宁",
  "毛寧",
  "赖清德",
  "賴清德",
  "蔡英文",
  "柯文哲",
  "侯友宜",
  "萧美琴",
  "蕭美琴",
  "李家超", // John Lee
  // Parties / institutions
  "民进党",
  "民進黨",
  "国民党",
  "國民黨",
  "民众党",
  "民眾黨",
  "国台办",
  "國台辦",
  "外交部",
  "中央军委",
  "中央軍委",
  "政治局",
  "全国人大",
  "全國人大",
  "全國政協",
  // Military
  "解放军",
  "解放軍",
  "共军",
  "共軍",
  "海军山东舰",
  "山東艦",
  "辽宁舰",
  "遼寧艦",
  "福建舰",
  "福建艦",
  "火箭军",
  "火箭軍",
  "东部战区",
  "東部戰區",
  "汉光",
  "漢光",
  // Geographies
  "新疆",
  "西藏",
  "内蒙古",
  "內蒙古",
  "维吾尔",
  "維吾爾",
  "藏族",
  "南海",
  "东海",
  "東海",
  "钓鱼岛",
  "釣魚島",
  "尖閣諸島",
  // Companies / tech
  "台积电",
  "台積電",
  "中芯国际",
  "中芯國際",
  "华为",
  "華為",
  "海思",
  "腾讯",
  "騰訊",
  "阿里巴巴",
  "字节跳动",
  "字節跳動",
  "抖音",
  "百度",
  "拼多多",
  "京东",
  "京東",
  "小米",
  "美团",
  "美團",
  "比亚迪",
  "比亞迪",
  "蔚来",
  "蔚來",
  "小鹏",
  "小鵬",
  "理想汽车",
  "理想汽車",
  "宁德时代",
  "寧德時代",
  // Markets / currency
  "人民币",
  "人民幣",
  "港币",
  "港幣",
  "新台币",
  "新台幣",
  "恒生",
  "恆生",
  "上证",
  "上證",
  "深证",
  "深證",
  "沪深",
  "滬深",
  // Cross-relations frames
  "美中",
  "中美",
  "中日",
  "日中",
  "中欧",
  "中歐",
  "欧中",
  "歐中",
  "中俄",
  "中印",
  "中非",
  "东盟",
  "東盟",
  "亚太",
  "亞太",
  "印太",
];

const EN_RE = new RegExp(
  "\\b(" + EN_TERMS.map(escapeRegExp).join("|") + ")\\b",
  "i",
);

const ZH_RE = new RegExp("(" + ZH_TERMS.map(escapeRegExp).join("|") + ")");

export interface RelevanceInput {
  title?: string | null;
  summary?: string | null;
  url?: string | null;
}

/**
 * Returns true if the article appears China/HK/Taiwan-relevant. Checks the
 * concatenation of title + summary + URL against the EN and ZH keyword sets.
 *
 * Performance: O(n) regex test per article. The two regexes are compiled
 * once at module load.
 */
export function isChinaTaiwanRelevant(input: RelevanceInput): boolean {
  const parts: string[] = [];
  if (input.title) parts.push(input.title);
  if (input.summary) parts.push(input.summary);
  if (input.url) parts.push(input.url);
  if (parts.length === 0) return false;
  const haystack = parts.join("\n");
  return EN_RE.test(haystack) || ZH_RE.test(haystack);
}
