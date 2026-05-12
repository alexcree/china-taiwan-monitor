import type { Brief } from "./index.js";

/**
 * Seed brief for dashboard development. Replace with real brief output once
 * the brief generator worker is live. URLs are illustrative — they do not
 * need to resolve during scaffold development.
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
        "Today's defense picture is best read as the operational expression of a posture shift signaled at last month's Central Military Commission readout. The carrier group's east-of-Taiwan operations matter less for what they do than for what they normalize: cross-axis pressure (north-west axis from coastal bases plus east-axis from carrier operations) is becoming routine rather than exceptional. Taiwan's response posture — explicit east-coast emphasis in Han Kuang planning — confirms Taipei reads the change the same way. Watch the next 7–10 days for whether the carrier group remains forward-deployed or returns to home port; sustained presence past 10 days would mark a new baseline.\n\nUS messaging is calibrated and notable. INDOPACOM's 'asymmetric deterrence acceleration' phrasing aligns with the Taiwan workforce initiative announced in the economic dialogue track — these are coordinated signals, not coincidental.",
      english_sources: [
        {
          headline:
            "China's Shandong carrier group enters waters east of Taiwan, first such deployment in 2026",
          summary_short:
            "Reuters reports the Shandong group transited the Bashi Channel and is operating roughly 200nm east of Taiwan.",
          summary_extended:
            "Reuters cites two Taiwan defense officials confirming the Shandong carrier group transited the Bashi Channel on the night of May 10 and is now operating in waters east of Taiwan, roughly 200 nautical miles offshore. This is the first such deployment in 2026 and follows a pattern established in 2024–25 of intermittent east-side operations during sensitive political windows. The carrier group includes at least four escorts and one replenishment vessel. Officials declined to characterize the exercise's scheduled duration.",
          url: "https://www.reuters.com/world/asia-pacific/china-shandong-carrier-east-taiwan-2026-05-12/",
        },
        {
          headline:
            "Taiwan tracks 38 PLA aircraft, 22 across median line — near 12-month peak",
          summary_short:
            "MND daily tally shows sustained elevated activity for fourth consecutive day.",
          summary_extended:
            "Taiwan's Ministry of National Defense released its daily tally showing 38 PLA aircraft, 22 of which crossed the median line of the Taiwan Strait — the highest single-day median-line crossing count since June 2025. The mix included J-16, KJ-500, and BZK-005 UAVs. MND characterized the activity as 'coordinated with naval movements,' a phrasing reserved for occasions where aircraft and surface assets are assessed as part of a single exercise framework.",
          url: "https://focustaiwan.tw/cross-strait/202605120014",
        },
        {
          headline:
            "US INDOPACOM commander cites 'asymmetric deterrence acceleration' as Pacific priority",
          summary_short:
            "Senate Armed Services testimony emphasizes munitions stockpiles and Taiwan training programs.",
          summary_extended:
            "Defense News covers Adm. Paparo's Senate Armed Services Committee testimony in which he framed 'asymmetric deterrence acceleration' as the command's central 2026 priority. The phrasing covers Pacific munitions pre-positioning, accelerated Taiwan defense industrial cooperation, and an expanded Pacific Deterrence Initiative line item. The language was new and is being read in regional capitals as coordinated with the parallel Taiwan economic dialogue track.",
          url: "https://www.defensenews.com/pentagon/2026/05/11/paparo-asymmetric-deterrence-pacific/",
        },
        {
          headline:
            "Han Kuang 2026 exercise to emphasize east-coast resilience, Taiwan officials say",
          summary_short:
            "MND briefing previews scenario shifts addressing carrier-axis pressure.",
          summary_extended:
            "Taipei Times reports the 2026 Han Kuang exercise will incorporate east-coast hardening scenarios, addressing the operational reality of PLA carrier operations in waters east of Taiwan. MND sources describe the change as a 'multi-axis defense' adjustment. Exercise dates have not yet been confirmed but are expected in mid-July, consistent with prior iterations.",
          url: "https://www.taipeitimes.com/News/front/archives/2026/05/12/2003812345",
        },
        {
          headline:
            "Japan's MoD scrambles fighters as PLA aircraft transit near Yonaguni",
          summary_short:
            "Three KJ-500 and BZK-005 platforms tracked over international waters south of Okinawa.",
          summary_extended:
            "Nikkei Asia reports Japan's Ministry of Defense confirmed scrambles of F-15s from Naha after three PLA aircraft transited international airspace near Yonaguni Island. No incursion was reported. The activity is being treated as connected to the broader PLA exercise framework rather than as a discrete probe. Tokyo's response was measured but the timing — coincident with the carrier deployment — drew official comment.",
          url: "https://asia.nikkei.com/Politics/Defense/Japan-scrambles-fighters-PLA-Yonaguni-May-2026",
        },
      ],
      chinese_sources: [
        {
          headline_original:
            "海军山东舰编队跨区机动训练 提升远海实战能力",
          headline_en:
            "Shandong carrier group conducts cross-region maneuver training, building far-seas combat capability",
          summary_short_en:
            "Xinhua frames the deployment as routine far-seas training, citing 'normal annual plan' language.",
          summary_extended_en:
            "Xinhua's coverage frames the Shandong carrier group's deployment as a 'cross-region maneuver training' exercise consistent with the 2026 annual training plan, emphasizing 'far-seas combat capability building' and 'systems combat coordination.' The article makes no reference to geographic specifics or Taiwan, and includes the standard 'normal annual plan' language used to signal non-escalatory intent for domestic and international audiences. The framing is significantly more restrained than the operational picture suggests.",
          url: "https://www.xinhuanet.com/mil/2026-05/12/c_1129987654.htm",
        },
        {
          headline_original:
            "环球时报：美方在台海方向轮番表态意在制造紧张",
          headline_en:
            "Global Times: US repeated Taiwan Strait statements aim to manufacture tension",
          summary_short_en:
            "Editorial frames US INDOPACOM testimony as escalatory rhetoric.",
          summary_extended_en:
            "Global Times runs an editorial framing Adm. Paparo's testimony as part of a 'rhythmic' US escalation pattern aimed at 'manufacturing tension' in the Taiwan Strait. The piece argues asymmetric deterrence language is 'thinly veiled support for separatist forces' and warns of 'corresponding responses.' Standard Global Times escalation rhetoric, useful as a barometer of the official tone Beijing wants reflected in domestic discourse rather than as a policy indicator in itself.",
          url: "https://opinion.huanqiu.com/article/4Hk9TaiwanMay2026",
        },
        {
          headline_original:
            "解放军报：东部战区组织联合战备警巡",
          headline_en:
            "PLA Daily: Eastern Theater Command organizes joint combat readiness patrol",
          summary_short_en:
            "PLA Daily reports Eastern Theater 'combat readiness patrol' without naming Taiwan directly.",
          summary_extended_en:
            "PLA Daily reports the Eastern Theater Command organized a joint combat readiness patrol involving naval, air, and rocket force elements. The phrasing 'joint combat readiness patrol' (联合战备警巡) is the term Beijing reserves for Taiwan-directed activity, even when Taiwan is not named. This is the third such patrol in 60 days. The article notes 'firm determination to safeguard national sovereignty and territorial integrity' — boilerplate but consistent with elevated posture signaling.",
          url: "https://www.81.cn/szb_223187/szbxq/index.html?paperName=jfjb&type=1&paperDate=2026-05-12",
        },
      ],
    },

    economy: {
      summary: [
        "PBOC injected ¥420bn via 7-day reverse repos as yuan weakened past 7.32 against the dollar — largest defensive injection in three months.",
        "Beijing announced retaliatory tariffs on selected EU dairy and luxury goods after the European Commission moved to extend EV anti-subsidy duties through 2031.",
        "Caixin and 21st Century Business Herald frame PBOC action as 'defensive but measured' — language suggesting Beijing is pacing its response.",
        "Hong Kong's Hang Seng dropped 1.8%, led by Chinese property names; mainland CSI 300 fell 0.6% on lower volume.",
      ],
      analyst_note:
        "The macro picture today is more interesting than yesterday's. PBOC's ¥420bn injection is the largest defensive action in three months, but the framing in Caixin and 21CBH — both relatively reliable signals of where elite economic opinion is being directed — is 'defensive but measured.' That phrasing is doing work: it tells the market that Beijing has tools in reserve and is not yet using them aggressively. Read this as confidence that the current pressure is manageable, but also as a signal that more forceful action is held back for a reason.\n\nThe EU retaliatory tariffs are notable for what they include and exclude. Dairy and luxury goods hit politically sensitive constituencies in France, Italy, and the Netherlands without touching the German auto-supply chain. That selectivity is intentional and consistent with Beijing's continued effort to drive wedges between EU member-state economic interests.",
      english_sources: [
        {
          headline:
            "China retaliates on EU EV duties with tariffs on dairy, brandy, luxury cars",
          summary_short:
            "MOFCOM announces 28% duties effective June 1 on selected EU exports.",
          summary_extended:
            "Bloomberg reports MOFCOM has announced retaliatory tariffs of up to 28% on selected EU exports including dairy products, brandy, and luxury vehicles above €60,000, effective June 1. The move follows the European Commission's decision to extend EV anti-subsidy duties through 2031. The product selection — hitting France, Italy, and the Netherlands while sparing German automotive components — is consistent with prior Chinese practice of differentiating among EU member states. Officials framed the measures as 'proportionate countermeasures.'",
          url: "https://www.bloomberg.com/news/articles/2026-05-12/china-retaliates-eu-ev-duties-dairy-luxury",
        },
        {
          headline:
            "PBOC injects ¥420bn as yuan slides past 7.32, largest reverse repo since February",
          summary_short:
            "Central bank uses 7-day repos to stabilize liquidity amid currency pressure.",
          summary_extended:
            "The Financial Times reports the People's Bank of China injected ¥420 billion via 7-day reverse repurchase agreements at 1.7%, the largest such operation since February. The action came as the yuan slid past 7.32 against the dollar in onshore trading. FT cites analysts noting the PBOC has yet to deploy more forceful tools — direct fixing intervention, state bank dollar sales — suggesting the current pressure remains within tolerated bands. Onshore-offshore spread widened to 280 pips.",
          url: "https://www.ft.com/content/pboc-420bn-yuan-defense-may-2026",
        },
        {
          headline:
            "US-Taiwan economic dialogue produces semiconductor workforce pact, stalls on transparency",
          summary_short:
            "Joint statement omits supply-chain transparency language sought by Washington.",
          summary_extended:
            "Reuters covers the joint statement from this week's US-Taiwan senior economic dialogue in Taipei. The two sides announced a $2.4bn semiconductor workforce initiative — including training centers at three Taiwan universities partnered with US institutions. Notably absent: supply-chain transparency language that US negotiators had pushed for, which would have required Taiwan-incorporated firms to disclose mainland-origin inputs above certain thresholds. Taiwan negotiators reportedly argued the requirement would expose firms to mainland retaliation. The gap will reappear in subsequent rounds.",
          url: "https://www.reuters.com/world/asia-pacific/us-taiwan-economic-dialogue-semiconductor-workforce-2026-05-11/",
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
            "Caixin's coverage frames the PBOC's ¥420bn reverse repo as 'defensive but measured,' emphasizing the 'reasonably ample' liquidity language preferred by the central bank. The piece notes the operation is consistent with quarter-end liquidity management practice but acknowledges the unusual size. Caixin quotes a state-owned bank treasurer characterizing further intervention as 'available but not currently required.' This framing is a useful signal: it suggests Beijing wants markets to know it has reserves without spending them.",
          url: "https://www.caixin.com/2026-05-12/102076543.html",
        },
        {
          headline_original:
            "21世纪经济报道：人民币汇率波动加大 但基本面支撑稳固",
          headline_en:
            "21CBH: Yuan volatility increases but fundamentals remain solid",
          summary_short_en:
            "21CBH economist commentary downplays depreciation concerns.",
          summary_extended_en:
            "21st Century Business Herald runs commentary from a People's Bank-affiliated economist arguing the recent yuan depreciation reflects 'transitory external pressure' rather than fundamental weakness, citing trade surplus and reserve levels. The piece notably does not cite recent capital outflow data. The framing is consistent with the Caixin coverage and confirms a coordinated message: Beijing wants the market to view the current pressure as bounded and manageable.",
          url: "https://www.21jingji.com/article/20260512/herald/abcd1234.html",
        },
        {
          headline_original:
            "商务部对欧盟乳制品、白兰地、豪华汽车加征关税",
          headline_en:
            "MOFCOM imposes tariffs on EU dairy, brandy, luxury vehicles",
          summary_short_en:
            "Official MOFCOM announcement with full product list.",
          summary_extended_en:
            "MOFCOM published the full product list and tariff schedule for the EU retaliation package. Dairy products face 18–22% duties; brandy faces 28%; luxury vehicles above €60,000 face 25%. The schedule explicitly excludes German automotive components and high-end machinery — a pointed omission. The announcement frames the measures as 'proportionate' under WTO rules and signals that further measures are 'reserved' depending on EU action.",
          url: "https://www.mofcom.gov.cn/article/zwgk/gkzcfb/202605/20260512345678.shtml",
        },
      ],
    },

    tech: {
      summary: [
        "TSMC reported an unscheduled Tier-3 supplier audit by Taiwan's MOEA tied to new export controls on advanced packaging equipment bound for mainland clients.",
        "Huawei's HiSilicon design team published a paper on 7nm-equivalent yield improvements — read by analysts as signaling progress on SMIC N+2 process maturity.",
        "Two Japanese tool-makers reported being included in scope for revised Japanese MITI export controls on EUV-adjacent equipment.",
      ],
      analyst_note:
        "The supplier audit at TSMC is the operational arm of policy that has been forming for several months. The MOEA's choice to audit Tier-3 — not just Tier-1 direct suppliers — signals Taiwan is moving from declaratory policy to enforcement posture on advanced packaging. This matters because advanced packaging (CoWoS in particular) is the current chokepoint for AI accelerator production at scale. Expect mainland-affiliated buyers to begin appearing in Singaporean and Malaysian intermediary trade data over the next quarter.\n\nThe Huawei/HiSilicon paper is technical but worth flagging — yield improvements at 7nm-equivalent are exactly the bottleneck that determines whether SMIC can produce flagship Kirin processors at competitive volume. The publication itself is also a signal: Huawei rarely publishes process-level results unless they want to be read.",
      english_sources: [
        {
          headline:
            "Taiwan MOEA conducts unscheduled audit of TSMC Tier-3 suppliers on advanced packaging exports",
          summary_short:
            "Audit covers materials and tooling suppliers for CoWoS-class packaging.",
          summary_extended:
            "Nikkei Asia reports Taiwan's Ministry of Economic Affairs conducted an unscheduled audit of three Tier-3 suppliers to TSMC focused on advanced packaging materials and tooling, including those used in CoWoS and SoIC processes. The audit is the first under expanded controls announced in March covering re-export risk for mainland-affiliated customers. Suppliers were given five days to produce shipping records covering the prior 18 months. TSMC declined to comment.",
          url: "https://asia.nikkei.com/Business/Tech/Taiwan-MOEA-audits-TSMC-tier-3-suppliers-May-2026",
        },
        {
          headline:
            "HiSilicon publishes yield optimization paper, hints at 7nm process maturity",
          summary_short:
            "Conference paper highlights statistical yield gains on advanced node.",
          summary_extended:
            "The Diplomat covers a HiSilicon technical paper at an IEEE conference describing statistical yield optimization techniques applied to a 7nm-equivalent process. The paper does not name SMIC but the process parameters and equipment described are consistent with SMIC N+2. Industry analysts read the publication itself as a signal — Huawei rarely publishes process-level results without strategic intent. Implications for Kirin processor production at scale are material.",
          url: "https://thediplomat.com/2026/05/hisilicon-yield-paper-smic-n2-process/",
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
            "Yicai (第一财经) reports two mainland advanced packaging lines have entered production ramp this quarter, with planned annual capacity expansion tied to industrial policy support. The piece frames the development as a direct response to 'external technology pressure' and explicitly references Taiwan packaging controls. The capacity numbers cited (combined ~30k wafers/month) are below leading-edge global capacity but represent meaningful onshore scale.",
          url: "https://www.yicai.com/news/101998765.html",
        },
      ],
    },

    politics: {
      summary: [
        "Taiwan opposition KMT and TPP coordinated a procedural motion to delay the FY27 special defense budget, citing transparency on US arms sales pricing.",
        "Beijing's TAO spokesperson Chen Binhua issued unusually pointed remarks at scheduled press conference, naming Vice President Hsiao Bi-khim by title for the first time in 2026.",
      ],
      analyst_note:
        "The opposition procedural motion on the special defense budget is structurally significant. The motion itself is unlikely to derail the budget — DPP has the votes — but it telegraphs that the KMT-TPP coordination is now operating on defense matters, not just domestic legislation. That coalition behavior is the strategic question for the rest of 2026, more than any individual policy outcome.\n\nChen Binhua's naming of VP Hsiao Bi-khim by title is a deliberate signaling adjustment worth flagging. Beijing's protocol has been to avoid recognizing Taiwan executive titles; using the title — even rhetorically negative — establishes a reference point that can be cited later.",
      english_sources: [
        {
          headline:
            "Taiwan opposition delays FY27 special defense budget, citing US arms pricing transparency",
          summary_short:
            "KMT-TPP procedural motion sends budget back for committee review.",
          summary_extended:
            "Focus Taiwan covers the procedural motion filed jointly by KMT and TPP lawmakers to delay the FY27 special defense budget, citing concerns over transparency in US foreign military sales pricing. The motion sends the budget back for additional committee review and does not block passage but indicates increasing KMT-TPP procedural coordination on defense matters — a meaningful shift from previous sessions where coordination focused on domestic legislation.",
          url: "https://focustaiwan.tw/politics/202605120025",
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
            "TAO spokesperson Chen Binhua used unusually pointed language at the scheduled press conference, naming Vice President Hsiao Bi-khim by title (副领导人) for the first time in 2026. Standard TAO practice has been to avoid acknowledging executive titles. The phrasing is rhetorically negative but establishes a reference baseline. Watch for whether subsequent press conferences sustain the title use or revert.",
          url: "https://www.gwytb.gov.cn/xwfbh/202605/t20260512_12567890.htm",
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
        "Today's carrier deployment is consistent with a posture signaled at last month's CMC readout. Operational tempo and the multi-axis framing in PLA Daily coverage support a normalization interpretation. The judgment is moderate rather than high because we lack visibility into the planned exercise duration — a return to home port within 7 days would weaken the case.",
    },
    {
      judgment:
        "Beijing's economic response posture is calibrated for sustained pressure rather than immediate escalation.",
      confidence: "high",
      actor: "china",
      reasoning:
        "The combination of measured PBOC intervention, coordinated 'defensive but measured' messaging in Caixin and 21CBH, and selective EU retaliation (sparing German auto-supply) all point to a posture of paced response. Beijing has tools in reserve and is signaling that fact rather than spending them.",
    },
    {
      judgment:
        "KMT-TPP coordination is extending from domestic legislation into defense matters — a 2026 dynamic that will shape special budget execution.",
      confidence: "moderate",
      actor: "taiwan",
      reasoning:
        "The joint procedural motion on the FY27 special defense budget is the first instance of substantive KMT-TPP coordination on a national security matter in this legislative session. Confidence is moderate because a single instance can reflect tactics rather than strategy; sustained coordination over the next 30 days would raise this to high.",
    },
    {
      judgment:
        "US-Taiwan economic dialogue produced workforce-track substance and strategic friction on transparency — the latter is the more important read.",
      confidence: "high",
      actor: "us",
      reasoning:
        "The semiconductor workforce initiative is concrete and bilaterally supported. The absent supply-chain transparency language reveals Taiwan's concern about exposing firms to mainland retaliation — a constraint that will recur. The transparency gap is the more durable signal because it reflects structural conditions rather than negotiated outcomes.",
    },
  ],

  indicators: [
    {
      text: "Shandong carrier group remains forward-deployed east of Taiwan past May 19 (10+ days).",
      rationale:
        "Sustained presence past 10 days would mark a baseline shift from episodic to enduring east-side posture, with material implications for Taiwan east-coast resilience planning.",
    },
    {
      text: "TAO sustains use of Taiwan executive titles in two or more subsequent press conferences.",
      rationale:
        "Establishing title use as routine would represent a small but real shift in Beijing's declaratory framework, potentially used as a reference point in later positioning.",
    },
    {
      text: "Onshore-offshore yuan spread sustains above 250 pips for 5+ consecutive sessions.",
      rationale:
        "A sustained spread would indicate capital-flow pressure exceeding what reverse repo operations can manage, raising the probability of more forceful PBOC tools (fixing intervention, state bank dollar sales).",
    },
    {
      text: "Additional MOEA audits of TSMC Tier-2 or Tier-3 suppliers within 30 days.",
      rationale:
        "Single audits can be exploratory; a pattern of audits across the supplier base would confirm Taiwan has moved from declaratory advanced-packaging controls to enforcement posture.",
    },
    {
      text: "Joint KMT-TPP procedural action on a second national security matter within 30 days.",
      rationale:
        "Would elevate the KMT-TPP defense coordination assessment from moderate to high confidence and reframe FY27 budget execution risk.",
    },
    {
      text: "PLA Daily uses 'joint combat readiness patrol' language in two or more readouts within 14 days.",
      rationale:
        "The phrasing is reserved for Taiwan-directed operations; clustering of usage would indicate sustained elevated tempo rather than episodic activity.",
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
        "PLA Daily sustains 'joint combat readiness patrol' framing",
      ],
      implications: [
        "Han Kuang 2026 east-coast emphasis becomes structural rather than rhetorical",
        "Taiwan east-coast munitions pre-positioning becomes a US-Taiwan dialogue priority",
        "Japan increases Southwestern Islands ISR posture",
      ],
      analyst_note:
        "This is the modal outcome on current trajectory. The probability is not higher because PLA carrier sustainment east of Taiwan is operationally demanding and a return to home port within the next 10 days remains plausible. Watch supply ship rotations as the leading indicator.",
    },
    {
      name: "Economic-axis pressure escalation",
      probability_pct: 25,
      one_line:
        "Beijing deploys more forceful FX tools and broader retaliatory measures if EU-US economic cooperation deepens.",
      triggers: [
        "Onshore-offshore yuan spread sustains above 250 pips",
        "EU-US joint communique on China economic policy at next G7",
        "MOFCOM extends retaliation list to additional EU sectors",
      ],
      implications: [
        "PBOC moves to fixing intervention or state bank dollar sales",
        "Hong Kong equity outflows accelerate",
        "Taiwan TWD comes under sympathetic pressure",
      ],
      analyst_note:
        "Probability is below the modal scenario because today's coordinated 'defensive but measured' messaging in Caixin and 21CBH suggests Beijing is signaling reserves rather than spending them. An EU-US G7 communique would be the most likely accelerant.",
    },
    {
      name: "Taiwan internal political constraint",
      probability_pct: 20,
      one_line:
        "Sustained KMT-TPP defense coordination materially slows FY27 special budget execution.",
      triggers: [
        "Second joint KMT-TPP procedural action within 30 days",
        "FY27 budget revisions reduce headline figure by >10%",
        "Defense procurement delays into Q4 2026",
      ],
      implications: [
        "US-Taiwan FMS pipeline timing slips",
        "Beijing reads the coordination as a structural opportunity",
        "DPP shifts to executive-action workarounds where legally available",
      ],
      analyst_note:
        "The single procedural motion is not yet a pattern, but the dynamic is real and worth tracking. A pattern emerging over 30 days would push this scenario probability up materially.",
    },
    {
      name: "Tactical de-escalation",
      probability_pct: 10,
      one_line:
        "PLA returns carrier group to home port within 10 days and rhetoric softens — episodic posture, not new baseline.",
      triggers: [
        "Shandong group transit through Bashi Channel southbound by May 18",
        "TAO drops Taiwan executive title usage in next press conference",
        "PLA Daily reverts to 'cross-region maneuver training' framing",
      ],
      implications: [
        "Current sortie levels read as exercise-bounded rather than posture shift",
        "Reduced pressure on Taiwan east-coast hardening plans",
        "Cross-strait economic engagement modestly resumes",
      ],
      analyst_note:
        "This scenario is the residual probability. It is not implausible — PLA carrier deployments do remain episodic — but the broader posture signals (PLA Daily framing, INDOPACOM-coordinated US messaging, MOEA audits) all run against it.",
    },
  ],

  escalation_risk: "moderate",
  escalation_rationale:
    "The defense picture is consistent with normalization of cross-axis pressure rather than imminent kinetic risk. Economic posture is calibrated. Political coordination in Taipei is a structural watchpoint but not a near-term trigger. The moderate rating reflects a sustained elevated baseline rather than an acute event risk. A high rating would require either operational evidence of carrier sustainment past 10 days combined with PLA Daily escalation framing, or an EU-US G7 communique met with more forceful Beijing economic retaliation.",

  bottom_line:
    "Cross-axis PLA pressure on Taiwan is normalizing into a sustained baseline. Beijing's economic posture is calibrated and paced. Watch the carrier group's duration east of Taiwan and the onshore-offshore yuan spread as the two leading indicators for the next 7–10 days.",
  bottom_line_extended:
    "Today's signal is best read together: PLA Navy cross-axis pressure, PBOC defensive intervention, MOFCOM EU retaliation, and TAO rhetorical adjustment are coordinated outputs of a paced posture rather than independent events. Beijing is signaling reserves rather than spending them, but the baseline has shifted. For Taipei, the structural questions are whether east-coast resilience planning can match the operational reality of carrier-axis pressure, and whether KMT-TPP coordination on defense matters extends beyond today's procedural motion. For Washington, the friction in the economic dialogue — specifically on supply-chain transparency — is the more durable signal than the workforce-track substance. Watch the Shandong group's duration east of Taiwan past May 19 and the onshore-offshore yuan spread holding above 250 pips as the two leading indicators for the next 7–10 days.",

  cross_sector_synthesis:
    "The defense, economy, and political tracks today are connected by a single underlying dynamic: each side is calibrating a sustained posture rather than executing a discrete event. PLA cross-axis operations, PBOC measured intervention, MOFCOM selective EU retaliation, and TAO rhetorical title adjustment are coordinated expressions of a paced framework. On the Taipei side, the US-Taiwan economic dialogue's friction on supply-chain transparency and the KMT-TPP procedural motion on the defense budget both reflect structural conditions that will recur rather than tactical choices. The synthesis is that today is not a single-event day; it is a baseline-shift day. The analytical priority is identifying the indicators that distinguish a new sustained baseline from a temporary elevation, and the next 7–10 days will be revealing on that question.",

  source_notes:
    "Chinese-language coverage was robust across defense, economy, and politics sectors. Property and consumer sectors had thin coverage today and are not reported. Cyber sector had two routine items not meeting importance threshold. Tech sector Chinese coverage was lighter than usual (one source) — worth watching for whether this reflects sensitivity or a one-day gap.",
};
