import type { Brief } from "./index.js";

/**
 * Seed brief for dashboard development. Replace with real brief output once
 * the brief generator worker is live. URLs are illustrative — they do not
 * need to resolve during scaffold development.
 *
 * Timestamps span 2026-05-11 through 2026-05-12 morning, with the brief
 * itself generated at 2026-05-12T06:00:00Z.
 */
export const SEED_BRIEF: Brief = {
  brief_date: "2026-05-12",
  generated_at: "2026-05-12T06:00:00.000Z",

  exec_summary: [
    "PLA Navy concluded a 72-hour joint exercise in the Taiwan Strait, with the Shandong carrier group operating east of Taiwan for the first time in 2026 — a notable shift in posture.",
    "Taiwan's MND tracked 38 PLA aircraft and 9 naval vessels in the past 24 hours; 22 aircraft crossed the median line, near a 12-month high.",
    "TSMC reported an unscheduled Tier-3 supplier audit by Taiwan's MOEA tied to new export controls on advanced packaging equipment bound for mainland clients.",
    "Beijing announced retaliatory tariffs on selected EU dairy and luxury goods after the European Commission moved to extend EV anti-subsidy duties through 2031.",
    "PBOC injected ¥420bn via 7-day reverse repos as the yuan weakened past 7.32; Caixin and 21st Century Business Herald frame the move as defensive.",
    "Senior US-Taiwan economic dialogue in Taipei produced agreement on a semiconductor workforce initiative and stalled on supply-chain transparency language.",
    "Hang Seng Tech dropped 2.4% on weaker-than-expected Q1 earnings from Tencent and continued cloud margin pressure across mainland operators.",
    "China Vanke disclosed a further ¥4.8bn loss provision tied to delayed-delivery projects, weighing on the broader mainland property sector index.",
    "Cross-strait passenger flight slots remain frozen at pre-2026 levels; civil aviation authorities on both sides traded statements but no movement.",
  ],

  sections: {
    defense: {
      summary: [
        "Shandong carrier group operated east of Taiwan for the first time this year — meaningful escalation of cross-axis pressure pattern.",
        "PLAAF sortie volume sustained at elevated levels for fourth consecutive day; cross-median-line ratio at 12-month high.",
        "Taiwan's MND signaled upcoming Han Kuang exercise will incorporate east-coast resilience scenarios in 2026 iteration.",
        "US INDOPACOM CINC publicly referenced 'asymmetric deterrence acceleration' in Senate testimony — language watched closely in Beijing.",
      ],
      analyst_note:
        "Today's defense picture is best read as the operational expression of a posture shift signaled at last month's Central Military Commission readout. The carrier group's east-of-Taiwan operations matter less for what they do than for what they normalize: cross-axis pressure is becoming routine rather than exceptional. Watch the next 7–10 days for whether the carrier group remains forward-deployed or returns to home port; sustained presence past 10 days would mark a new baseline.",
      english_sources: [
        {
          headline:
            "China's Shandong carrier group enters waters east of Taiwan, first such deployment in 2026",
          summary_short:
            "Reuters reports the Shandong group transited the Bashi Channel and is operating roughly 200nm east of Taiwan.",
          summary_extended:
            "Reuters cites two Taiwan defense officials confirming the Shandong carrier group transited the Bashi Channel on the night of May 10 and is now operating in waters east of Taiwan. First such deployment in 2026. Carrier group includes four escorts and one replenishment vessel.",
          url: "https://www.reuters.com/world/asia-pacific/china-shandong-carrier-east-taiwan-2026-05-12/",
          published_at: "2026-05-12T03:14:00.000Z",
        },
        {
          headline:
            "Taiwan tracks 38 PLA aircraft, 22 across median line — near 12-month peak",
          summary_short:
            "MND daily tally shows sustained elevated activity for fourth consecutive day.",
          summary_extended:
            "Taiwan's MND released its daily tally showing 38 PLA aircraft, 22 crossing the median line — highest since June 2025. Mix included J-16, KJ-500, and BZK-005 UAVs.",
          url: "https://focustaiwan.tw/cross-strait/202605120014",
          published_at: "2026-05-12T01:45:00.000Z",
        },
        {
          headline:
            "US INDOPACOM commander cites 'asymmetric deterrence acceleration' as Pacific priority",
          summary_short:
            "Senate Armed Services testimony emphasizes munitions stockpiles and Taiwan training programs.",
          summary_extended:
            "Defense News covers Adm. Paparo's Senate testimony framing 'asymmetric deterrence acceleration' as the command's 2026 priority. Phrasing covers Pacific munitions pre-positioning and accelerated Taiwan defense industrial cooperation.",
          url: "https://www.defensenews.com/pentagon/2026/05/11/paparo-asymmetric-deterrence-pacific/",
          published_at: "2026-05-11T19:30:00.000Z",
        },
        {
          headline:
            "Han Kuang 2026 to emphasize east-coast resilience, Taiwan officials say",
          summary_short:
            "MND briefing previews scenario shifts addressing carrier-axis pressure.",
          summary_extended:
            "Taipei Times reports Han Kuang 2026 will incorporate east-coast hardening scenarios. MND sources describe the change as a 'multi-axis defense' adjustment. Exercise dates not yet confirmed.",
          url: "https://www.taipeitimes.com/News/front/archives/2026/05/12/2003812345",
          published_at: "2026-05-12T00:20:00.000Z",
        },
        {
          headline:
            "Japan scrambles fighters as PLA aircraft transit near Yonaguni",
          summary_short:
            "Three KJ-500 and BZK-005 platforms tracked over international waters south of Okinawa.",
          summary_extended:
            "Nikkei Asia reports MoD confirmed F-15 scrambles from Naha after three PLA aircraft transited near Yonaguni Island. Treated as connected to broader PLA exercise framework.",
          url: "https://asia.nikkei.com/Politics/Defense/Japan-scrambles-fighters-PLA-Yonaguni-May-2026",
          published_at: "2026-05-11T22:05:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "海军山东舰编队跨区机动训练 提升远海实战能力",
          headline_en:
            "Shandong carrier group conducts cross-region maneuver training",
          summary_short_en:
            "Xinhua frames the deployment as routine far-seas training, citing 'normal annual plan' language.",
          summary_extended_en:
            "Xinhua's coverage frames the deployment as 'cross-region maneuver training' consistent with 2026 annual training plan. No geographic specifics or reference to Taiwan.",
          url: "https://www.xinhuanet.com/mil/2026-05/12/c_1129987654.htm",
          published_at: "2026-05-12T02:30:00.000Z",
        },
        {
          headline_original:
            "环球时报：美方在台海方向轮番表态意在制造紧张",
          headline_en:
            "Global Times: US repeated Taiwan Strait statements aim to manufacture tension",
          summary_short_en:
            "Editorial frames US INDOPACOM testimony as escalatory rhetoric.",
          summary_extended_en:
            "Global Times editorial argues asymmetric deterrence language is 'thinly veiled support for separatist forces' and warns of 'corresponding responses.' Standard escalation rhetoric.",
          url: "https://opinion.huanqiu.com/article/4Hk9TaiwanMay2026",
          published_at: "2026-05-11T23:40:00.000Z",
        },
        {
          headline_original:
            "解放军报：东部战区组织联合战备警巡",
          headline_en:
            "PLA Daily: Eastern Theater Command organizes joint combat readiness patrol",
          summary_short_en:
            "PLA Daily reports Eastern Theater 'combat readiness patrol' without naming Taiwan directly.",
          summary_extended_en:
            "PLA Daily reports Eastern Theater Command organized joint combat readiness patrol involving naval, air, and rocket force elements. Third such patrol in 60 days.",
          url: "https://www.81.cn/szb_223187/szbxq/index.html?paperName=jfjb&type=1&paperDate=2026-05-12",
          published_at: "2026-05-12T00:00:00.000Z",
        },
      ],
    },

    economy: {
      summary: [
        "PBOC injected ¥420bn via 7-day reverse repos as yuan weakened past 7.32 — largest defensive injection in three months.",
        "Beijing retaliated against EU EV duties with tariffs on selected dairy, brandy, and luxury vehicles, sparing German auto components.",
        "Hang Seng dropped 1.8%; mainland CSI 300 fell 0.6% on lower volume.",
        "Caixin and 21st Century Business Herald frame PBOC action as 'defensive but measured'.",
      ],
      analyst_note:
        "PBOC's ¥420bn injection is the largest defensive action in three months, but the framing in Caixin and 21CBH — 'defensive but measured' — tells the market Beijing has tools in reserve. Read this as confidence that current pressure is manageable, but also as a signal that more forceful action is held back for a reason.",
      english_sources: [
        {
          headline:
            "China retaliates on EU EV duties with tariffs on dairy, brandy, luxury cars",
          summary_short:
            "MOFCOM announces 28% duties effective June 1 on selected EU exports.",
          summary_extended:
            "Bloomberg reports MOFCOM retaliatory tariffs of up to 28% on EU dairy, brandy, and luxury vehicles above €60,000. Sparing German automotive components is consistent with prior Chinese practice of differentiating among EU member states.",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/china-retaliates-eu-ev-duties-dairy-luxury",
          published_at: "2026-05-12T01:08:00.000Z",
        },
        {
          headline:
            "PBOC injects ¥420bn as yuan slides past 7.32, largest reverse repo since February",
          summary_short:
            "Central bank uses 7-day repos to stabilize liquidity amid currency pressure.",
          summary_extended:
            "FT reports PBOC ¥420 billion injection via 7-day reverse repurchase agreements at 1.7%. Onshore-offshore spread widened to 280 pips. PBOC has yet to deploy more forceful tools.",
          url: "https://www.ft.com/content/pboc-420bn-yuan-defense-may-2026",
          published_at: "2026-05-12T02:45:00.000Z",
        },
        {
          headline:
            "Hang Seng falls 1.8% led by China tech, financials; CSI 300 down 0.6%",
          summary_short:
            "Bloomberg session wrap: outflows accelerated through the afternoon.",
          summary_extended:
            "Hang Seng dropped 1.8% with tech subindex off 2.4%. Tencent, Alibaba, JD.com all lower. CSI 300 fell 0.6% on lighter volume. Property stocks worst-performing subindex.",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/asia-stocks-session-wrap-may-12",
          published_at: "2026-05-12T08:15:00.000Z",
        },
        {
          headline:
            "US-Taiwan economic dialogue produces semiconductor workforce pact, stalls on transparency",
          summary_short:
            "Joint statement omits supply-chain transparency language sought by Washington.",
          summary_extended:
            "Reuters covers the joint statement. $2.4bn semiconductor workforce initiative announced. Supply-chain transparency requirement reportedly pushed by US negotiators, declined by Taiwan side citing mainland retaliation risk.",
          url: "https://www.reuters.com/world/asia-pacific/us-taiwan-economic-dialogue-semiconductor-workforce-2026-05-11/",
          published_at: "2026-05-11T16:20:00.000Z",
        },
        {
          headline:
            "China's April CPI prints +0.2% YoY, PPI -2.1%, deflation pressure persists",
          summary_short:
            "NBS data confirms continued price weakness despite policy support.",
          summary_extended:
            "WSJ reports China's April CPI at +0.2% YoY, well below consensus +0.4%. PPI -2.1%, the 19th consecutive month of factory-gate deflation. Reinforces case for further monetary easing.",
          url: "https://www.wsj.com/economy/china-cpi-april-2026-deflation-86a3b2c1",
          published_at: "2026-05-11T22:30:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "央行开展4200亿元逆回购操作 流动性合理充裕",
          headline_en:
            "PBOC conducts ¥420bn reverse repo operation, liquidity reasonably ample",
          summary_short_en:
            "Caixin frames the operation as 'defensive but measured,' liquidity narrative.",
          summary_extended_en:
            "Caixin frames PBOC operation as 'defensive but measured.' Quotes state-owned bank treasurer characterizing further intervention as 'available but not currently required.'",
          url: "https://www.caixin.com/2026-05-12/102076543.html",
          published_at: "2026-05-12T03:20:00.000Z",
        },
        {
          headline_original:
            "21世纪经济报道：人民币汇率波动加大 但基本面支撑稳固",
          headline_en:
            "21CBH: Yuan volatility increases but fundamentals remain solid",
          summary_short_en:
            "21CBH economist commentary downplays depreciation concerns.",
          summary_extended_en:
            "21CBH commentary from a PBOC-affiliated economist arguing recent yuan depreciation reflects 'transitory external pressure' rather than fundamental weakness. Coordinated with Caixin framing.",
          url: "https://www.21jingji.com/article/20260512/herald/abcd1234.html",
          published_at: "2026-05-12T04:00:00.000Z",
        },
        {
          headline_original:
            "商务部对欧盟乳制品、白兰地、豪华汽车加征关税",
          headline_en:
            "MOFCOM imposes tariffs on EU dairy, brandy, luxury vehicles",
          summary_short_en:
            "Official MOFCOM announcement with full product list.",
          summary_extended_en:
            "MOFCOM published the tariff schedule: dairy 18–22%, brandy 28%, luxury vehicles above €60,000 25%. Excludes German automotive components and high-end machinery.",
          url: "https://www.mofcom.gov.cn/article/zwgk/gkzcfb/202605/20260512345678.shtml",
          published_at: "2026-05-12T00:30:00.000Z",
        },
      ],
    },

    tech: {
      summary: [
        "Taiwan MOEA conducted unscheduled audit of TSMC Tier-3 suppliers tied to new advanced packaging export controls.",
        "Huawei HiSilicon paper signals progress on 7nm-equivalent yield optimization, read as SMIC N+2 maturity indicator.",
        "Japan MITI revising EUV-adjacent equipment controls; two Japanese tool-makers now in scope.",
        "Tencent reports Q1 cloud margin compression; capex cycle narrative under pressure.",
      ],
      analyst_note:
        "The MOEA Tier-3 supplier audit is the operational arm of policy that has been forming for months. Choice to audit Tier-3 — not just Tier-1 — signals enforcement posture on advanced packaging. Expect mainland-affiliated buyers to begin appearing in Singaporean and Malaysian intermediary trade data over the next quarter.",
      english_sources: [
        {
          headline:
            "Taiwan MOEA audits TSMC Tier-3 suppliers on advanced packaging exports",
          summary_short:
            "Audit covers materials and tooling suppliers for CoWoS-class packaging.",
          summary_extended:
            "Nikkei Asia reports MOEA conducted unscheduled audit of three Tier-3 TSMC suppliers focused on CoWoS and SoIC packaging materials. First under expanded controls covering re-export risk for mainland-affiliated customers.",
          url: "https://asia.nikkei.com/Business/Tech/Taiwan-MOEA-audits-TSMC-tier-3-suppliers-May-2026",
          published_at: "2026-05-12T01:10:00.000Z",
        },
        {
          headline:
            "HiSilicon publishes yield optimization paper, hints at 7nm process maturity",
          summary_short:
            "Conference paper highlights statistical yield gains on advanced node.",
          summary_extended:
            "The Diplomat covers HiSilicon technical paper at IEEE conference describing statistical yield optimization on 7nm-equivalent process. Process parameters consistent with SMIC N+2.",
          url: "https://thediplomat.com/2026/05/hisilicon-yield-paper-smic-n2-process/",
          published_at: "2026-05-11T20:45:00.000Z",
        },
        {
          headline:
            "Tencent Q1 cloud revenue +9% YoY, margin compression continues",
          summary_short:
            "Earnings beat headline revenue but disappoint on operating leverage.",
          summary_extended:
            "Reuters covers Tencent Q1 print. Revenue +9% YoY at ¥164bn, narrowly beating consensus. Cloud and enterprise segment operating margin -180bps. Stock down 2.2% in HK trading.",
          url: "https://www.reuters.com/business/tencent-q1-earnings-cloud-margin-2026-05-12/",
          published_at: "2026-05-12T07:55:00.000Z",
        },
        {
          headline:
            "Japan MITI revises EUV-adjacent export controls, two Japanese tool-makers in scope",
          summary_short:
            "Industry briefing notes new licensing requirements.",
          summary_extended:
            "Bloomberg reports MITI revising export controls on metrology and inspection tools adjacent to EUV lithography. Two Japanese tool-makers receive notices of new licensing requirements for mainland customers.",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/japan-miti-euv-adjacent-controls",
          published_at: "2026-05-12T05:30:00.000Z",
        },
        {
          headline:
            "Baidu Q1 AI revenue surges 38%, but ad business misses expectations",
          summary_short:
            "AI cloud growth offsets weakness in core search advertising.",
          summary_extended:
            "WSJ covers Baidu Q1. AI cloud revenue +38% YoY but core search advertising -3% on macro softness. Capex guidance raised for 2026 model training investment.",
          url: "https://www.wsj.com/tech/baidu-q1-ai-revenue-2026-05-11-3a1c2b8d",
          published_at: "2026-05-11T21:20:00.000Z",
        },
        {
          headline:
            "SMIC reports Q1 capacity utilization at 89%, advanced node mix improves",
          summary_short:
            "Foundry guidance suggests sustained demand from mainland customers.",
          summary_extended:
            "Reuters covers SMIC earnings call. Q1 utilization 89%, up from 84% in Q4. Mature-node revenue flat; advanced-node mix improving, consistent with HiSilicon yield narrative.",
          url: "https://www.reuters.com/technology/smic-q1-2026-utilization-2026-05-11/",
          published_at: "2026-05-11T18:00:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "国产先进封装产线进入量产爬坡 政策与产业共振",
          headline_en:
            "Domestic advanced packaging lines enter ramp, policy-industry convergence",
          summary_short_en:
            "Yicai reports mainland packaging capacity expanding to address external pressure.",
          summary_extended_en:
            "Yicai reports two mainland advanced packaging lines have entered production ramp this quarter. Capacity numbers (combined ~30k wafers/month) below leading-edge but represent meaningful onshore scale.",
          url: "https://www.yicai.com/news/101998765.html",
          published_at: "2026-05-12T04:15:00.000Z",
        },
        {
          headline_original:
            "财新：腾讯云利润率承压 国内云市场价格战仍未止",
          headline_en:
            "Caixin: Tencent Cloud margin pressure, domestic cloud price war continues",
          summary_short_en:
            "Caixin analysis points to structural pricing pressure across mainland hyperscalers.",
          summary_extended_en:
            "Caixin analysis of Q1 cloud results across Tencent, Alibaba, Baidu — all show margin compression. Frames as structural pricing pressure rather than cyclical, driven by competition for AI training workloads.",
          url: "https://www.caixin.com/2026-05-12/102076890.html",
          published_at: "2026-05-12T05:00:00.000Z",
        },
      ],
    },

    politics: {
      summary: [
        "Taiwan opposition KMT and TPP coordinated a procedural motion to delay the FY27 special defense budget.",
        "TAO spokesperson Chen Binhua issued unusually pointed remarks at scheduled press conference.",
        "DPP caucus pushed back; budget likely to pass on schedule but pattern of coordination notable.",
      ],
      analyst_note:
        "The opposition procedural motion on the special defense budget is structurally significant. Motion unlikely to derail the budget — DPP has votes — but telegraphs KMT-TPP coordination now operating on defense matters. That coalition behavior is the strategic question for the rest of 2026.",
      english_sources: [
        {
          headline:
            "Taiwan opposition delays FY27 special defense budget, citing US arms pricing transparency",
          summary_short:
            "KMT-TPP procedural motion sends budget back for committee review.",
          summary_extended:
            "Focus Taiwan covers procedural motion filed jointly by KMT and TPP lawmakers. Sends budget back for committee review. Indicates increasing KMT-TPP coordination on defense matters.",
          url: "https://focustaiwan.tw/politics/202605120025",
          published_at: "2026-05-12T00:50:00.000Z",
        },
        {
          headline:
            "DPP caucus chair: special defense budget will pass on schedule",
          summary_short:
            "Liberty Times quotes caucus leadership pushing back on opposition motion.",
          summary_extended:
            "Liberty Times reports DPP caucus chair indicating the budget will pass on schedule despite the procedural motion. Frames the opposition action as 'political theater' rather than substantive review.",
          url: "https://www.taipeitimes.com/News/taiwan/archives/2026/05/12/2003812440",
          published_at: "2026-05-12T02:10:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "国台办：坚决反对台当局副领导人窜访活动",
          headline_en:
            "TAO: Firm opposition to Taiwan deputy leader's visits",
          summary_short_en:
            "TAO spokesperson uses pointed language including title reference.",
          summary_extended_en:
            "TAO spokesperson named VP Hsiao Bi-khim by title (副领导人) for the first time in 2026. Standard practice has been to avoid acknowledging executive titles. Rhetorically negative but establishes reference baseline.",
          url: "https://www.gwytb.gov.cn/xwfbh/202605/t20260512_12567890.htm",
          published_at: "2026-05-11T08:00:00.000Z",
        },
      ],
    },

    diplomacy: {
      summary: [
        "G7 foreign ministers' joint statement to include Taiwan Strait stability language at upcoming June meeting.",
        "Philippines and Japan reach in-principle agreement on Reciprocal Access framework.",
        "Australia signals reopening of Yantai consulate, suspended since 2022.",
        "EU-China trade dialogue rescheduled for early July; agenda contested.",
      ],
      analyst_note:
        "The combination of an expected Taiwan Strait reference in G7 communiqué, Philippines-Japan RAA progress, and Australia-China consular reopening sketches a more textured regional posture than a binary US-China framing captures. Beijing is calibrating responses by partner rather than confronting the bloc as a whole.",
      english_sources: [
        {
          headline:
            "G7 foreign ministers to include Taiwan Strait stability language in June communiqué",
          summary_short:
            "Reuters cites draft seen by diplomats from three delegations.",
          summary_extended:
            "Reuters reports draft language for the June G7 foreign ministers' meeting includes a reaffirmation of Taiwan Strait stability. Italy reportedly the most reluctant. Final text not yet locked.",
          url: "https://www.reuters.com/world/g7-fm-taiwan-language-june-2026-05-11/",
          published_at: "2026-05-11T17:30:00.000Z",
        },
        {
          headline:
            "Philippines-Japan reach in-principle agreement on Reciprocal Access Agreement",
          summary_short:
            "Pact expected to be formalized at Manila summit in late May.",
          summary_extended:
            "Nikkei Asia reports in-principle agreement on Japan-Philippines RAA. Would enable Japanese SDF operations and exercises in the Philippines. Manila summit late May target for formalization.",
          url: "https://asia.nikkei.com/Politics/International-relations/Japan-Philippines-RAA-2026-05-11",
          published_at: "2026-05-11T14:00:00.000Z",
        },
        {
          headline:
            "Australia signals Yantai consulate reopening as relations stabilize",
          summary_short:
            "DFAT confirms preparatory mission underway, consulate idle since 2022.",
          summary_extended:
            "ABC News reports DFAT confirmation that preparatory mission has been dispatched to Yantai. Consulate has been effectively idle since 2022. Signal of continuing Australia-China relationship stabilization.",
          url: "https://www.abc.net.au/news/2026-05-11/yantai-consulate-reopening-dfat",
          published_at: "2026-05-11T11:45:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "外交部：反对七国集团涉台错误言论 已提出严正交涉",
          headline_en:
            "MFA: Opposes G7 erroneous remarks on Taiwan, has lodged solemn representations",
          summary_short_en:
            "Preemptive MFA pushback ahead of June ministerial draft language.",
          summary_extended_en:
            "MFA spokesperson Lin Jian's regular briefing includes preemptive pushback on the G7 draft Taiwan language. Mentions 'solemn representations' to G7 capitals — boilerplate but timing is notable.",
          url: "https://www.fmprc.gov.cn/web/wjbxw_673019/202605/t20260511_12567456.shtml",
          published_at: "2026-05-11T08:30:00.000Z",
        },
      ],
    },

    property: {
      summary: [
        "China Vanke discloses further ¥4.8bn loss provision tied to delayed-delivery projects in Q1.",
        "Mainland property sector index down 1.4%; CIFI Holdings and Sunac among biggest decliners.",
        "Beijing tier-1 cities new-home sales -8% YoY in April; secondary market slightly stronger.",
        "Hong Kong residential transactions hit 12-month low as rate-cut expectations recede.",
      ],
      analyst_note:
        "The Vanke provision is incremental rather than surprising, but the timing — coincident with PBOC defensive injection — reinforces that the property workout is structural and slow. Watch for whether the policy bank lending facility announced in March is actually drawn down meaningfully in May.",
      english_sources: [
        {
          headline:
            "China Vanke takes ¥4.8bn Q1 loss provision on delayed-delivery projects",
          summary_short:
            "Filing details project-specific impairments across six cities.",
          summary_extended:
            "Bloomberg covers Vanke Q1 filing. ¥4.8bn provision specifically tied to delayed-delivery residential projects. Filing details six cities including Wuhan, Chengdu, and Hefei. Stock -3.6% in Shenzhen.",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/vanke-q1-loss-provision-delayed-projects",
          published_at: "2026-05-12T03:50:00.000Z",
        },
        {
          headline:
            "Beijing tier-1 new-home sales -8% YoY in April, secondary stronger",
          summary_short:
            "NBS monthly data shows continued softness in primary market.",
          summary_extended:
            "WSJ covers NBS April real estate prints. New-home sales -8% YoY in tier-1 cities; secondary market resilient. Suggests inventory overhang in primary developments not yet cleared.",
          url: "https://www.wsj.com/economy/china-tier1-home-sales-april-2026-05-11-87a2b3c1",
          published_at: "2026-05-11T19:00:00.000Z",
        },
        {
          headline:
            "Hong Kong residential deals hit 12-month low as rate-cut bets recede",
          summary_short:
            "SCMP cites Centaline transaction data through May 10.",
          summary_extended:
            "SCMP reports Hong Kong residential transactions hit 12-month low for first 10 days of May per Centaline. Recent repricing of Fed rate-cut expectations weighed on sentiment.",
          url: "https://www.scmp.com/business/article/2026/05/11/hong-kong-residential-low",
          published_at: "2026-05-11T15:20:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "财新：万科一季报计提48亿减值 项目交付进度仍是关键",
          headline_en:
            "Caixin: Vanke Q1 ¥4.8bn impairment, project delivery pace remains key",
          summary_short_en:
            "Caixin analysis frames provision as part of multi-quarter workout pattern.",
          summary_extended_en:
            "Caixin analysis frames the Vanke provision as part of a multi-quarter pattern. Notes the policy bank lending facility announced in March has been drawn down only modestly so far.",
          url: "https://www.caixin.com/2026-05-12/102077001.html",
          published_at: "2026-05-12T04:30:00.000Z",
        },
        {
          headline_original:
            "澎湃新闻：4月70城新房价格环比涨幅缩窄 一线城市分化明显",
          headline_en:
            "The Paper: April 70-city new-home price MoM gains narrow, tier-1 differentiation marked",
          summary_short_en:
            "Coverage of NBS monthly 70-city price data with tier-1 city focus.",
          summary_extended_en:
            "The Paper covers NBS 70-city April data. Headline MoM gain narrowed to +0.1%. Tier-1 differentiation between Beijing/Shenzhen (softer) and Shanghai/Guangzhou (firmer) is notable.",
          url: "https://www.thepaper.cn/newsDetail_forward_27812345",
          published_at: "2026-05-11T16:40:00.000Z",
        },
      ],
    },

    consumer: {
      summary: [
        "Alibaba 618 pre-sale GMV tracking +3% YoY in first 48 hours, well below historical pre-sale growth.",
        "JD.com confirms expanded instant-delivery investment, citing competitive pressure from Meituan.",
        "Pinduoduo Q1 print preview: consensus expects revenue +12% on slowing growth.",
        "Macau gaming revenue +4% YoY in April, below government's full-year recovery trajectory.",
      ],
      analyst_note:
        "Consumer-cycle prints are running below consensus across the sector — pre-sale GMV growth, gaming revenue, and tier-1 home sales all show similar pattern. Read together, these don't indicate a discrete shock but rather a continued grinding-down of consumer confidence that policy support has not arrested.",
      english_sources: [
        {
          headline:
            "Alibaba 618 pre-sale GMV +3% YoY in first 48 hours, well below historical norms",
          summary_short:
            "Internal data shared with sell-side analysts, sources tell Bloomberg.",
          summary_extended:
            "Bloomberg cites two sell-side analysts briefed on internal Alibaba data. 618 pre-sale GMV +3% YoY in first 48 hours, well below typical 15–20% pre-sale growth in prior years. Read as confirming weak consumer sentiment.",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/alibaba-618-presale-gmv-2026",
          published_at: "2026-05-12T02:00:00.000Z",
        },
        {
          headline:
            "JD.com expands instant-delivery investment, cites Meituan competitive pressure",
          summary_short:
            "Q1 earnings call previews ¥3.5bn capex shift toward 30-minute logistics.",
          summary_extended:
            "Reuters covers JD.com Q1 call. Management announced ¥3.5bn additional capex on instant-delivery logistics, explicitly citing Meituan's expanded grocery and convenience offerings as competitive pressure.",
          url: "https://www.reuters.com/business/jd-instant-delivery-meituan-pressure-2026-05-11/",
          published_at: "2026-05-11T22:00:00.000Z",
        },
        {
          headline:
            "Macau April gaming revenue +4% YoY, trailing government recovery target",
          summary_short:
            "DICJ monthly data printed below estimated +8% consensus.",
          summary_extended:
            "Nikkei Asia covers Macau DICJ April gaming revenue at +4% YoY, missing +8% consensus. Trails government's stated full-year recovery trajectory. Mass-market segment particularly weak.",
          url: "https://asia.nikkei.com/Business/Tourism/Macau-gaming-revenue-april-2026-05-11",
          published_at: "2026-05-11T13:30:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "21世纪经济报道：618预售开局平淡 平台让利与消费分级并存",
          headline_en:
            "21CBH: 618 pre-sale starts flat, platform discounts and tiered consumption coexist",
          summary_short_en:
            "21CBH analysis frames 618 weakness as structural consumer tiering, not platform-specific.",
          summary_extended_en:
            "21CBH analysis of 618 pre-sale across Alibaba, JD, and Pinduoduo. Frames as structural consumer tiering rather than platform-specific weakness. Premium and value tiers diverging.",
          url: "https://www.21jingji.com/article/20260512/consumer/4567ef89.html",
          published_at: "2026-05-12T03:00:00.000Z",
        },
      ],
    },

    cyber: {
      summary: [
        "CrowdStrike attributes a multi-month intrusion campaign against Taiwan defense contractors to a PRC-linked group.",
        "Beijing's CAC issues updated guidance on cross-border data transfers, narrowing the security review threshold.",
        "Microsoft confirms patching of an SMB-related vulnerability flagged as targeting Taiwan government networks.",
      ],
      analyst_note:
        "The CrowdStrike attribution and Microsoft SMB-patch coincide with the broader pre-Han Kuang posture watch. Cyber activity ahead of major Taiwan defense exercises is now patterned enough to be treated as a leading indicator rather than discrete event.",
      english_sources: [
        {
          headline:
            "CrowdStrike attributes Taiwan defense-contractor intrusion campaign to PRC-linked group",
          summary_short:
            "Report details multi-month campaign across at least 11 Taiwan firms.",
          summary_extended:
            "Reuters covers CrowdStrike public report attributing a multi-month intrusion campaign against at least 11 Taiwan defense contractors to a PRC-linked group. TTPs consistent with prior Volt Typhoon-adjacent activity.",
          url: "https://www.reuters.com/technology/cybersecurity/crowdstrike-taiwan-prc-intrusion-2026-05-11/",
          published_at: "2026-05-11T20:00:00.000Z",
        },
        {
          headline:
            "Microsoft patches SMB vulnerability flagged as targeting Taiwan government networks",
          summary_short:
            "MSRC advisory notes 'active exploitation' against Taiwan public-sector targets.",
          summary_extended:
            "Bleeping Computer covers MSRC advisory. SMB-related vulnerability rated 8.8 CVSS. Advisory notes 'active exploitation' against Taiwan government networks. Patch released out-of-band.",
          url: "https://www.bleepingcomputer.com/news/security/microsoft-smb-taiwan-2026-05-11/",
          published_at: "2026-05-11T18:45:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "网信办：数据出境安全评估办法征求意见 涉及阈值调整",
          headline_en:
            "CAC: Updated cross-border data transfer security review draft, threshold adjustments",
          summary_short_en:
            "CAC issues updated guidance narrowing review thresholds for cross-border transfers.",
          summary_extended_en:
            "Official CAC notice on updated cross-border data transfer guidance. Narrows review threshold for sensitive sectors. Effective date 30 days from publication. Implementation guidance expected.",
          url: "https://www.cac.gov.cn/2026-05/11/c_1718765432.htm",
          published_at: "2026-05-11T10:00:00.000Z",
        },
      ],
    },

    influence: {
      summary: [
        "Taiwan's Investigation Bureau opens probe into coordinated content campaign across PTT and Threads.",
        "Meta releases quarterly inauthentic-behavior report flagging cross-strait operation, takes down 1,800 accounts.",
        "Beijing's UFWD-linked outlets push 'Taiwan compatriot' framing ahead of regional youth festival in June.",
      ],
      analyst_note:
        "The Meta takedown is mid-sized rather than headline-grabbing, but the targeting pattern (Taiwan municipal politics and defense-budget debate) is more relevant than the volume. Influence operations are converging on KMT-TPP procedural coordination as a wedge — worth watching as the FY27 budget debate continues.",
      english_sources: [
        {
          headline:
            "Meta takes down 1,800 accounts in cross-strait coordinated inauthentic behavior operation",
          summary_short:
            "Quarterly report flags Taiwan municipal politics and defense-budget targeting.",
          summary_extended:
            "Bloomberg covers Meta quarterly CIB report. 1,800 accounts removed across Facebook, Instagram, and Threads. Operation targeted Taiwan municipal politics and the FY27 defense budget debate.",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/meta-cross-strait-takedown-q2-2026",
          published_at: "2026-05-12T04:00:00.000Z",
        },
        {
          headline:
            "Taiwan Investigation Bureau opens probe into coordinated PTT and Threads campaign",
          summary_short:
            "Focus Taiwan reports preliminary findings link to overseas accounts.",
          summary_extended:
            "Focus Taiwan reports Investigation Bureau preliminary findings linking coordinated content campaign to overseas accounts. Content focused on FY27 defense budget framing.",
          url: "https://focustaiwan.tw/society/202605120031",
          published_at: "2026-05-12T02:30:00.000Z",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "中国新闻网：海峡两岸青年交流活动6月在福州举行",
          headline_en:
            "China News Service: Cross-strait youth exchange event in Fuzhou in June",
          summary_short_en:
            "Official announcement of UFWD-coordinated June youth festival.",
          summary_extended_en:
            "China News Service announcement of cross-strait youth exchange event in Fuzhou in June. UFWD-coordinated. Framing emphasizes 'Taiwan compatriot' (台湾同胞) language consistent with current line.",
          url: "https://www.chinanews.com.cn/tw/2026/05-11/12345678.shtml",
          published_at: "2026-05-11T09:30:00.000Z",
        },
      ],
    },
  },

  assessments: [
    {
      judgment:
        "PLA Navy is normalizing cross-axis pressure operations against Taiwan, shifting from episodic to routine east-side carrier presence.",
      confidence: "moderate",
      actor: "china",
      reasoning:
        "Today's carrier deployment is consistent with a posture signaled at last month's CMC readout. Operational tempo and multi-axis framing in PLA Daily support normalization. Moderate rather than high because we lack visibility into planned exercise duration.",
    },
    {
      judgment:
        "Beijing's economic response posture is calibrated for sustained pressure rather than immediate escalation.",
      confidence: "high",
      actor: "china",
      reasoning:
        "Measured PBOC intervention, coordinated 'defensive but measured' messaging in Caixin and 21CBH, and selective EU retaliation (sparing German auto-supply) all point to paced response. Tools in reserve, not spent.",
    },
    {
      judgment:
        "Consumer prints across e-commerce, gaming, and property point to continued grinding-down of confidence — not a discrete shock, but no policy traction visible.",
      confidence: "high",
      actor: "china",
      reasoning:
        "618 pre-sale +3%, Macau gaming +4%, tier-1 new-home sales -8% YoY, April CPI +0.2% all run in the same direction. The pattern is more informative than any individual print.",
    },
    {
      judgment:
        "KMT-TPP coordination is extending from domestic legislation into defense matters — a 2026 dynamic that will shape special budget execution.",
      confidence: "moderate",
      actor: "taiwan",
      reasoning:
        "Joint procedural motion on FY27 special defense budget is first instance of substantive KMT-TPP coordination on national security in this session. Sustained coordination over 30 days would raise this to high.",
    },
    {
      judgment:
        "Cyber and influence activity timing increasingly tracks Taiwan defense calendar — pre-Han Kuang posture watch is now a useful frame.",
      confidence: "moderate",
      actor: "china",
      reasoning:
        "CrowdStrike intrusion campaign, Microsoft SMB patch, and Meta CIB takedown all surface within a 14-day window ahead of expected Han Kuang scheduling. Pattern is now repeated enough to be treated as a leading indicator.",
    },
  ],

  indicators: [
    {
      text: "Shandong carrier group remains forward-deployed east of Taiwan past May 19 (10+ days).",
      rationale:
        "Sustained presence past 10 days would mark a baseline shift from episodic to enduring east-side posture.",
    },
    {
      text: "TAO sustains use of Taiwan executive titles in two or more subsequent press conferences.",
      rationale:
        "Establishing title use as routine would represent a small but real shift in Beijing's declaratory framework.",
    },
    {
      text: "Onshore-offshore yuan spread sustains above 250 pips for 5+ consecutive sessions.",
      rationale:
        "Sustained spread would indicate capital-flow pressure exceeding reverse repo management, raising probability of more forceful PBOC tools.",
    },
    {
      text: "Additional MOEA audits of TSMC Tier-2 or Tier-3 suppliers within 30 days.",
      rationale:
        "Pattern of audits would confirm Taiwan has moved from declaratory advanced-packaging controls to enforcement posture.",
    },
    {
      text: "Joint KMT-TPP procedural action on a second national security matter within 30 days.",
      rationale:
        "Would elevate the KMT-TPP defense coordination assessment from moderate to high confidence.",
    },
    {
      text: "PLA Daily uses 'joint combat readiness patrol' language in two or more readouts within 14 days.",
      rationale:
        "Phrasing is reserved for Taiwan-directed operations; clustering would indicate sustained elevated tempo.",
    },
    {
      text: "618 final-week GMV growth tracks below +5% YoY across the top three platforms.",
      rationale:
        "Would confirm structural consumer weakness rather than transitory effect.",
    },
    {
      text: "Vanke or another major developer accesses policy bank lending facility above ¥10bn in May.",
      rationale:
        "First meaningful drawdown of the March-announced facility would signal escalation in property workout management.",
    },
  ],

  scenarios: [
    {
      name: "Sustained east-axis pressure baseline",
      probability_pct: 45,
      one_line:
        "Carrier-axis east-of-Taiwan operations become routine over 30–90 days, shifting Taiwan's defense planning baseline.",
      triggers: [
        "Shandong group remains forward-deployed past May 19",
        "Second carrier rotation observed east of Taiwan within 60 days",
      ],
      implications: [
        "Han Kuang 2026 east-coast emphasis becomes structural",
        "Japan increases Southwestern Islands ISR posture",
      ],
      analyst_note:
        "Modal outcome on current trajectory. Probability not higher because PLA carrier sustainment east of Taiwan is operationally demanding and a return to home port within 10 days remains plausible.",
    },
    {
      name: "Economic-axis pressure escalation",
      probability_pct: 25,
      one_line:
        "Beijing deploys more forceful FX tools and broader retaliatory measures if EU-US economic cooperation deepens.",
      triggers: [
        "Onshore-offshore yuan spread sustains above 250 pips",
        "EU-US joint communique on China economic policy at next G7",
      ],
      implications: [
        "PBOC moves to fixing intervention or state bank dollar sales",
        "Hong Kong equity outflows accelerate",
      ],
      analyst_note:
        "Below modal because today's 'defensive but measured' messaging suggests Beijing is signaling reserves rather than spending them. EU-US G7 communique would be the most likely accelerant.",
    },
    {
      name: "Taiwan internal political constraint",
      probability_pct: 20,
      one_line:
        "Sustained KMT-TPP defense coordination materially slows FY27 special budget execution.",
      triggers: [
        "Second joint KMT-TPP procedural action within 30 days",
        "FY27 budget revisions reduce headline figure by >10%",
      ],
      implications: [
        "US-Taiwan FMS pipeline timing slips",
        "Beijing reads coordination as a structural opportunity",
      ],
      analyst_note:
        "Single procedural motion is not yet a pattern, but the dynamic is real. Pattern emerging over 30 days would push probability up materially.",
    },
    {
      name: "Tactical de-escalation",
      probability_pct: 10,
      one_line:
        "PLA returns carrier group to home port within 10 days and rhetoric softens — episodic posture, not new baseline.",
      triggers: [
        "Shandong group transit through Bashi Channel southbound by May 18",
        "TAO drops Taiwan executive title usage in next press conference",
      ],
      implications: [
        "Current sortie levels read as exercise-bounded",
        "Cross-strait economic engagement modestly resumes",
      ],
      analyst_note:
        "Residual probability. Not implausible — PLA carrier deployments do remain episodic — but broader posture signals run against it.",
    },
  ],

  escalation_risk: "moderate",
  escalation_rationale:
    "Defense picture consistent with normalization of cross-axis pressure rather than imminent kinetic risk. Economic posture calibrated. Political coordination in Taipei is a structural watchpoint but not a near-term trigger. Moderate rating reflects sustained elevated baseline rather than acute event risk.",

  bottom_line:
    "Cross-axis PLA pressure on Taiwan is normalizing into a sustained baseline. Beijing's economic posture is calibrated and paced. Watch the carrier group's duration east of Taiwan and the onshore-offshore yuan spread as the two leading indicators for the next 7–10 days.",
  bottom_line_extended:
    "Today's signal is best read together: PLA Navy cross-axis pressure, PBOC defensive intervention, MOFCOM EU retaliation, soft consumer prints, and TAO rhetorical adjustment are coordinated outputs of a paced posture rather than independent events. Beijing is signaling reserves rather than spending them, but the baseline has shifted. For Taipei, the structural questions are whether east-coast resilience planning can match the operational reality of carrier-axis pressure, and whether KMT-TPP coordination on defense matters extends beyond today's procedural motion.",

  cross_sector_synthesis:
    "Defense, economy, consumer, and political tracks today are connected by a single underlying dynamic: each side is calibrating a sustained posture rather than executing a discrete event. PLA cross-axis operations, PBOC measured intervention, MOFCOM selective retaliation, soft consumer prints, and TAO rhetorical adjustment are coordinated expressions of a paced framework. Today is not a single-event day; it is a baseline-shift day. The analytical priority is identifying indicators that distinguish a new sustained baseline from a temporary elevation, and the next 7–10 days will be revealing on that question.",

  source_notes:
    "Chinese-language coverage was robust across defense, economy, tech, property, and consumer sectors. Diplomacy Chinese coverage was lighter than usual (one source); influence coverage similarly thin on the Chinese-language side. All other sectors had balanced EN/ZH representation.",
};
