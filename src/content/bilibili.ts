// B 站课程调研台账：记录已检索/已读视频，避免重复搜索。
// 只保存元数据与阅读状态，不保存字幕或正文；视频不作为理论依据。
// 台账含多个合集与板块；新增内容前先按 AGENTS.md 的「B 站调研工作规范」查重。

export type VideoReadStatus = "read" | "catalogued";

export type BilibiliCollectionId =
  | "jazz-harmony"
  | "jazz-academy"
  | "stylized-creation"
  | "jazz-extras";

export type BilibiliSection = "爵士和声" | "风格化创作";

export type BilibiliReadVia = "subtitle" | "asr" | "frames";

export interface BilibiliCollection {
  id: BilibiliCollectionId;
  title: string;
  author: string;
  mid: string;
  seasonId: string;
  url: string;
  total: number;
  fetchedAt: string;
  section: BilibiliSection;
  note: string;
}

export interface BilibiliVideo {
  bvid: string;
  title: string;
  episode: string;
  chapter: "导言" | "上" | "下" | "";
  duration: number;
  published: string;
  url: string;
  status: VideoReadStatus;
  themes: string[];
  collection: BilibiliCollectionId;
  via?: BilibiliReadVia;
  usedIn?: string[];
  takeaway?: string;
  readAt?: string;
}

export const BILIBILI_COLLECTIONS: BilibiliCollection[] = [
  {
    id: "jazz-harmony",
    title: "爵士和声理论",
    author: "爵士-没有派对",
    mid: "1405367071",
    seasonId: "762895",
    url: "https://space.bilibili.com/1405367071/lists/762895?type=season",
    total: 68,
    fetchedAt: "2026-10-24",
    section: "爵士和声",
    note: "上册 15 集（音程到布鲁斯）、下册 52 集（和弦音阶到无功能和声）；仅记录元数据与阅读状态。",
  },
  {
    id: "jazz-academy",
    title: "学院派作曲·爵士理论（Yulia Music Note）",
    author: "Yulia Music Note",
    mid: "278407980",
    seasonId: "3336077",
    url: "https://space.bilibili.com/278407980/lists/3336077?type=season",
    total: 10,
    fetchedAt: "2026-10-24",
    section: "爵士和声",
    note: "EP01–EP10：中古调式记忆与色彩、ii-V-I、调式爵士创作、斜线和弦与旋律小调和声。",
  },
  {
    id: "stylized-creation",
    title: "风格化创作（Gray-Frezical 作曲编曲教程）",
    author: "Gray-Frezical",
    mid: "15099599",
    seasonId: "247985",
    url: "https://space.bilibili.com/15099599/lists/247985?type=season",
    total: 31,
    fetchedAt: "2026-10-24",
    section: "风格化创作",
    note: "独立板块：风格化编曲与配乐演示，多为无人声视频，靠关键帧读屏文字与钢琴卷帘；只记主题，不作理论依据。",
  },
  {
    id: "jazz-extras",
    title: "爵士和声·合集外公开课",
    author: "爵士-没有派对",
    mid: "1405367071",
    seasonId: "",
    url: "https://space.bilibili.com/1405367071",
    total: 2,
    fetchedAt: "2026-10-24",
    section: "爵士和声",
    note: "同一 UP 的合集外公开课补充视频。",
  },
];

export const BILIBILI_VIDEOS: BilibiliVideo[] = [
  {
    bvid:  "BV1fv4y157oo",
    title:  "【导言】用陈奕迅《孤独患者》告诉你为啥音乐人需要爵士和声？扒带扒不出？扒出来也看不懂？今天一次跟你聊明白（爵士和声上册序言）",
    episode:  "导言",
    chapter:  "导言",
    duration:  422,
    published:  "2023-03-24",
    url:  "https://www.bilibili.com/video/BV1fv4y157oo",
    status:  "catalogued",
    themes:  [
      "课程定位"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV11V4y1Q7zo",
    title:  "【上01】 小调到底唱6还是唱1？和弦扩展音老是找不对？现代音乐到底有多少种七和弦？一次性搞懂现代音乐音程底层逻辑 /初学小白福音《爵士和声》【爵士-没有派对】",
    episode:  "上01",
    chapter:  "上",
    duration:  858,
    published:  "2023-04-01",
    url:  "https://www.bilibili.com/video/BV11V4y1Q7zo",
    status:  "catalogued",
    themes:  [
      "音程",
      "调式音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV13o4y1j7t8",
    title:  "【上02】十分钟快速了解调式音阶到底怎么学？有啥用？现代音乐底层逻辑 乐理扫盲/初学小白福音《爵士和声》【爵士-没有派对】",
    episode:  "上02",
    chapter:  "上",
    duration:  588,
    published:  "2023-04-15",
    url:  "https://www.bilibili.com/video/BV13o4y1j7t8",
    status:  "read",
    themes:  [
      "音程",
      "调式音阶"
    ],
    usedIn:  [
      "modes",
      "modal-characteristics"
    ],
    takeaway:  "调式要按同主音比较，特征音来自与大小调的差异。",
    readAt:  "2026-10-24",
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1TV4y1d7W6",
    title:  "【上03】现代/爵士和声学自然和弦功能分组与和弦重配/现代和声学大扫盲《爵士和声》【爵士没有派对】",
    episode:  "上03",
    chapter:  "上",
    duration:  758,
    published:  "2023-04-29",
    url:  "https://www.bilibili.com/video/BV1TV4y1d7W6",
    status:  "catalogued",
    themes:  [
      "功能分组",
      "重配和声"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1gc411P7Ko",
    title:  "【上04】三分钟搞懂爵士和声的终止式《爵士和声》【爵士-没有派对】",
    episode:  "上04",
    chapter:  "上",
    duration:  220,
    published:  "2023-05-13",
    url:  "https://www.bilibili.com/video/BV1gc411P7Ko",
    status:  "catalogued",
    themes:  [
      "终止式"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Sh41157EU",
    title:  "【上05】大三级？大六级？..你真的搞懂副属和弦了吗？——《爵士和声》【爵士-没有派对】",
    episode:  "上05",
    chapter:  "上",
    duration:  472,
    published:  "2023-05-13",
    url:  "https://www.bilibili.com/video/BV1Sh41157EU",
    status:  "catalogued",
    themes:  [
      "副属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Cg4y1c7mK",
    title:  "【上06】一次性搞懂爵士251，哪来的？怎么用？爵士案例？流行歌案例？连讲带弹，统统都有！！《爵士和声》【爵士-没有派对】",
    episode:  "上06",
    chapter:  "上",
    duration:  805,
    published:  "2023-05-27",
    url:  "https://www.bilibili.com/video/BV1Cg4y1c7mK",
    status:  "catalogued",
    themes:  [
      "ii-V-I"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1bh411P7pu",
    title:  "【上07】声部连接/基础排列底层逻辑——《爵士和声》【爵士-没有派对】",
    episode:  "上07",
    chapter:  "上",
    duration:  630,
    published:  "2023-06-24",
    url:  "https://www.bilibili.com/video/BV1bh411P7pu",
    status:  "catalogued",
    themes:  [
      "声部连接"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1na4y1w79R",
    title:  "【上08】一离调就懵？永远跳不出和声套路？该学学调式转换了！！《爵士和声》【爵士-没有派对】",
    episode:  "上08",
    chapter:  "上",
    duration:  588,
    published:  "2023-07-02",
    url:  "https://www.bilibili.com/video/BV1na4y1w79R",
    status:  "catalogued",
    themes:  [
      "调式转换",
      "自然小调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV12M4y1x79c",
    title:  "【上09】自然小调的调式转换和弦的功能分组《爵士和声》【爵士-没有派对】",
    episode:  "上09",
    chapter:  "上",
    duration:  474,
    published:  "2023-07-15",
    url:  "https://www.bilibili.com/video/BV12M4y1x79c",
    status:  "catalogued",
    themes:  [
      "调式转换",
      "自然小调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1kp4y1G7rJ",
    title:  "【上10】b2maj7/4mM7 自然小调的调式转换其他下属小调和弦《爵士和声》【爵士-没有派对】",
    episode:  "上10",
    chapter:  "上",
    duration:  757,
    published:  "2023-07-29",
    url:  "https://www.bilibili.com/video/BV1kp4y1G7rJ",
    status:  "catalogued",
    themes:  [
      "调式转换",
      "自然小调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1nm4y1p7tf",
    title:  "【上11】突破和声大俗套！调式转换和弦 扩展音+音阶 一站式大汇总《爵士和声》【爵士-没有派对】",
    episode:  "上11",
    chapter:  "上",
    duration:  1048,
    published:  "2023-08-12",
    url:  "https://www.bilibili.com/video/BV1nm4y1p7tf",
    status:  "catalogued",
    themes:  [
      "调式转换",
      "自然小调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1yh4y1U7iu",
    title:  "【上12】你真的了解小调吗？现代音乐小调系统-自然和弦/音阶一站通！《爵士和声》【爵士-没有派对】",
    episode:  "上12",
    chapter:  "上",
    duration:  1208,
    published:  "2023-08-26",
    url:  "https://www.bilibili.com/video/BV1yh4y1U7iu",
    status:  "catalogued",
    themes:  [
      "调式转换",
      "自然小调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1oh4y1P7kQ",
    title:  "【上13】小调也可以有副属/扩展属喔！-小调和声案例分析《爵士和声》【爵士-没有派对】",
    episode:  "上13",
    chapter:  "上",
    duration:  578,
    published:  "2023-09-09",
    url:  "https://www.bilibili.com/video/BV1oh4y1P7kQ",
    status:  "catalogued",
    themes:  [
      "调式转换",
      "自然小调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1y94y1p7S5",
    title:  "【上14】超好上手的现代和声技巧——惯用线！配乐/编曲都好用！《爵士和声》【爵士-没有派对】",
    episode:  "上14",
    chapter:  "上",
    duration:  650,
    published:  "2023-09-22",
    url:  "https://www.bilibili.com/video/BV1y94y1p7S5",
    status:  "catalogued",
    themes:  [
      "惯用线"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1qG41117jJ",
    title:  "【上15】布鲁斯和声你了解几种？传统、爵士、bebop《爵士和声》【爵士-没有派对】",
    episode:  "上15",
    chapter:  "上",
    duration:  704,
    published:  "2023-10-14",
    url:  "https://www.bilibili.com/video/BV1qG41117jJ",
    status:  "catalogued",
    themes:  [
      "布鲁斯"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1xx4y1S78m",
    title:  "【下01】乐手/编曲人必修！和弦就是音阶，音阶就是和弦！扩展音/避免音的基本概念《爵士和声系统教程》【爵士-没有派对】",
    episode:  "下01",
    chapter:  "下",
    duration:  467,
    published:  "2024-03-09",
    url:  "https://www.bilibili.com/video/BV1xx4y1S78m",
    status:  "catalogued",
    themes:  [
      "和弦音阶",
      "扩展音",
      "避免音"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV19J4m1b7M2",
    title:  "【下02】和弦的9音11音13音到底是怎么加的《爵士和声系统教程》【爵士-没有派对】",
    episode:  "下02",
    chapter:  "下",
    duration:  617,
    published:  "2024-03-10",
    url:  "https://www.bilibili.com/video/BV19J4m1b7M2",
    status:  "catalogued",
    themes:  [
      "和弦音阶",
      "扩展音",
      "避免音"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV19p421m7Nm",
    title:  "【下03】副属和你会了？那扩展音和音阶怎么办？《爵士和声系统教程》【爵士-没有派对】",
    episode:  "下03",
    chapter:  "下",
    duration:  436,
    published:  "2024-03-16",
    url:  "https://www.bilibili.com/video/BV19p421m7Nm",
    status:  "catalogued",
    themes:  [
      "和弦音阶",
      "扩展音",
      "避免音"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1gH4y1p7gA",
    title:  "【下04】属和弦的N种玩法/副属和弦扩展音选择2/主属和弦音阶扩展音选择/Alt音阶/变化属音阶/爵士和声（下）04集【重制】",
    episode:  "下04",
    chapter:  "下",
    duration:  312,
    published:  "2024-03-22",
    url:  "https://www.bilibili.com/video/BV1gH4y1p7gA",
    status:  "catalogued",
    themes:  [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1rV4y1L7mA",
    title:  "【下05】爵士和声（下册）/全网最系统/——大调中的和弦音阶5——副属和弦音阶3",
    episode:  "下05",
    chapter:  "下",
    duration:  605,
    published:  "2022-10-09",
    url:  "https://www.bilibili.com/video/BV1rV4y1L7mA",
    status:  "catalogued",
    themes:  [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Y14y177Xo",
    title:  "【下06】爵士和声（下册）全网最系统 第六集——扩展属和弦音阶/其他属和弦音阶/相关二级和弦音阶",
    episode:  "下06",
    chapter:  "下",
    duration:  622,
    published:  "2022-10-10",
    url:  "https://www.bilibili.com/video/BV1Y14y177Xo",
    status:  "catalogued",
    themes:  [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Qe4y1q7g8",
    title:  "【下07】爵士和声（下册）大调中的和弦音阶7——大调中其他和弦音阶",
    episode:  "下07",
    chapter:  "下",
    duration:  755,
    published:  "2022-10-11",
    url:  "https://www.bilibili.com/video/BV1Qe4y1q7g8",
    status:  "catalogued",
    themes:  [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1CR4y1R7cw",
    title:  "【下08】爵士和声（下册）大调中的和弦音阶8——大调中其他和弦音阶/小调中的和弦音阶",
    episode:  "下08",
    chapter:  "下",
    duration:  621,
    published:  "2022-10-13",
    url:  "https://www.bilibili.com/video/BV1CR4y1R7cw",
    status:  "catalogued",
    themes:  [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Fe411V7G3",
    title:  "【下09】爵士和声（下册）——小调和弦音阶2",
    episode:  "下09",
    chapter:  "下",
    duration:  504,
    published:  "2022-10-19",
    url:  "https://www.bilibili.com/video/BV1Fe411V7G3",
    status:  "catalogued",
    themes:  [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV16K411U72A",
    title:  "【下10】爵士和声（下册）——第十集-小调和弦音阶3",
    episode:  "下10",
    chapter:  "下",
    duration:  897,
    published:  "2022-10-29",
    url:  "https://www.bilibili.com/video/BV16K411U72A",
    status:  "catalogued",
    themes:  [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV12R4y1Z7yJ",
    title:  "【下11】爵士和声（下册）——第十一集-小调和弦音阶4",
    episode:  "下11",
    chapter:  "下",
    duration:  622,
    published:  "2022-11-14",
    url:  "https://www.bilibili.com/video/BV12R4y1Z7yJ",
    status:  "catalogued",
    themes:  [
      "小调和弦音阶",
      "布鲁斯"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1vK411X7MU",
    title:  "【下12】爵士和声（下册）——第12集-布鲁斯和弦与音阶",
    episode:  "下12",
    chapter:  "下",
    duration:  987,
    published:  "2022-12-04",
    url:  "https://www.bilibili.com/video/BV1vK411X7MU",
    status:  "catalogued",
    themes:  [
      "小调和弦音阶",
      "布鲁斯"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1bR4y1r79Z",
    title:  "【下13】爵士和声（下册）——第13集-替代属和弦（三全音代理）1",
    episode:  "下13",
    chapter:  "下",
    duration:  545,
    published:  "2022-12-11",
    url:  "https://www.bilibili.com/video/BV1bR4y1r79Z",
    status:  "catalogued",
    themes:  [
      "替代属",
      "三全音替代"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1wM411S7d6",
    title:  "【下14】爵士和声（下册）——第14集-替代属和弦（三全音代理）2",
    episode:  "下14",
    chapter:  "下",
    duration:  792,
    published:  "2022-12-18",
    url:  "https://www.bilibili.com/video/BV1wM411S7d6",
    status:  "catalogued",
    themes:  [
      "替代属",
      "三全音替代"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Tg411b7GQ",
    title:  "【下15】爵士和声（下册）——第15集-替代属和弦的相关二级",
    episode:  "下15",
    chapter:  "下",
    duration:  715,
    published:  "2022-12-24",
    url:  "https://www.bilibili.com/video/BV1Tg411b7GQ",
    status:  "catalogued",
    themes:  [
      "替代属",
      "三全音替代"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1RD4y157jN",
    title:  "【下16】爵士和声（下册）——第16集-扩展替代属和弦",
    episode:  "下16",
    chapter:  "下",
    duration:  751,
    published:  "2023-01-01",
    url:  "https://www.bilibili.com/video/BV1RD4y157jN",
    status:  "catalogued",
    themes:  [
      "替代属",
      "三全音替代"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV19M41187FS",
    title:  "【下17】爵士和声（下册）——第17集-替代属和弦的扩展音与音阶",
    episode:  "下17",
    chapter:  "下",
    duration:  601,
    published:  "2023-01-08",
    url:  "https://www.bilibili.com/video/BV19M41187FS",
    status:  "catalogued",
    themes:  [
      "替代属",
      "三全音替代"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1M24y1z7ti",
    title:  "【下18】爵士和声（下册）——第18集-纵享丝滑的减七和弦1",
    episode:  "下18",
    chapter:  "下",
    duration:  793,
    published:  "2023-02-04",
    url:  "https://www.bilibili.com/video/BV1M24y1z7ti",
    status:  "catalogued",
    themes:  [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1uG4y1K7sS",
    title:  "【下19】爵士和声（下册）——第19集-减七和弦的变化走向",
    episode:  "下19",
    chapter:  "下",
    duration:  474,
    published:  "2023-02-11",
    url:  "https://www.bilibili.com/video/BV1uG4y1K7sS",
    status:  "catalogued",
    themes:  [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1y14y1F7aQ",
    title:  "【下20】爵士和声（下册）——第20集-减七和弦的扩展音",
    episode:  "下20",
    chapter:  "下",
    duration:  842,
    published:  "2023-02-18",
    url:  "https://www.bilibili.com/video/BV1y14y1F7aQ",
    status:  "catalogued",
    themes:  [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1U24y1J7zo",
    title:  "【下21】爵士和声（下册）——第21集-减和弦音阶与对称减音阶",
    episode:  "下21",
    chapter:  "下",
    duration:  678,
    published:  "2023-02-25",
    url:  "https://www.bilibili.com/video/BV1U24y1J7zo",
    status:  "catalogued",
    themes:  [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1UM4y1R7v9",
    title:  "【下22】爵士和声（下册）——第22集-八分钟彻底掌握升4级半减和弦",
    episode:  "下22",
    chapter:  "下",
    duration:  508,
    published:  "2023-03-04",
    url:  "https://www.bilibili.com/video/BV1UM4y1R7v9",
    status:  "catalogued",
    themes:  [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1mL411d72a",
    title:  "【下23】爱出轨的属和弦/谁说五级只爱一级（爵士和声下册第23集-主属和弦的假解决）",
    episode:  "下23",
    chapter:  "下",
    duration:  515,
    published:  "2023-03-11",
    url:  "https://www.bilibili.com/video/BV1mL411d72a",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1rk4y187Fc",
    title:  "【下24】10分钟打通现代爵士和声底层逻辑（爵士和声下册第24集-假解决之副属/替代属）",
    episode:  "下24",
    chapter:  "下",
    duration:  765,
    published:  "2023-03-18",
    url:  "https://www.bilibili.com/video/BV1rk4y187Fc",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1HM4y117KT",
    title:  "【下25】10分钟突破口水歌和声连接、和弦瞬间高级大法——假解决之副属和弦下行小二度（爵士和声下册第25集）",
    episode:  "下25",
    chapter:  "下",
    duration:  635,
    published:  "2023-04-08",
    url:  "https://www.bilibili.com/video/BV1HM4y117KT",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1SP411m7TS",
    title:  "【下26】「爵士和声」10分钟让你的和弦进行与众不同，三全音替代还能这么玩？——替代属和弦的下行五度假解决（爵士和声下册第26集）",
    episode:  "下26",
    chapter:  "下",
    duration:  668,
    published:  "2023-04-22",
    url:  "https://www.bilibili.com/video/BV1SP411m7TS",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1PX4y127dk",
    title:  "【下27】和弦进行永不枯寂的终极大法——假解决完结篇 烧脑⚠️慎入！（爵士和声下册27集）",
    episode:  "下27",
    chapter:  "下",
    duration:  797,
    published:  "2023-05-07",
    url:  "https://www.bilibili.com/video/BV1PX4y127dk",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1TP41197kk",
    title:  "【下28】是属和弦，但是没属功能——《爵士和声》下册第28集",
    episode:  "下28",
    chapter:  "下",
    duration:  841,
    published:  "2023-05-20",
    url:  "https://www.bilibili.com/video/BV1TP41197kk",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Vo4y177Ti",
    title:  "【下29】是7级属和弦，但居然不是副属和弦？《爵士和声》下册第29集——没有属功能的属和弦之7级属七",
    episode:  "下29",
    chapter:  "下",
    duration:  485,
    published:  "2023-06-16",
    url:  "https://www.bilibili.com/video/BV1Vo4y177Ti",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1LX4y1e7Dc",
    title:  "【下30】《爵士和声》下册第30集——没有属功能的属和弦之3级属七",
    episode:  "下30",
    chapter:  "下",
    duration:  542,
    published:  "2023-07-08",
    url:  "https://www.bilibili.com/video/BV1LX4y1e7Dc",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1J8411S7mu",
    title:  "【下31】Ab7-Cmaj7！拓展和声色彩必学《爵士和声》下册第31集：没有属功能的属和弦之降六级属七",
    episode:  "下31",
    chapter:  "下",
    duration:  461,
    published:  "2023-07-22",
    url:  "https://www.bilibili.com/video/BV1J8411S7mu",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV12k4y1u7Kf",
    title:  "【下32】D7不一定是重属和弦！拓展和声色彩必学《爵士和声》下册第32集：没有属功能的属和弦之二级属七",
    episode:  "下32",
    chapter:  "下",
    duration:  520,
    published:  "2023-08-03",
    url:  "https://www.bilibili.com/video/BV12k4y1u7Kf",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Am4y1H74w",
    title:  "【下33】没有属功能的属和弦完结撒花+单元总复习——A7/Eb7/Gb7《爵士和声》下册第33集",
    episode:  "下33",
    chapter:  "下",
    duration:  521,
    published:  "2023-08-18",
    url:  "https://www.bilibili.com/video/BV1Am4y1H74w",
    status:  "catalogued",
    themes:  [
      "假解决",
      "无功能属和弦"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1vu411P7zS",
    title:  "【下34】「爵士和声」模进大法好！无功能和声之相邻属和弦——《爵士和声》下册第34集",
    episode:  "下34",
    chapter:  "下",
    duration:  801,
    published:  "2023-09-02",
    url:  "https://www.bilibili.com/video/BV1vu411P7zS",
    status:  "read",
    themes:  [
      "相邻属和弦",
      "无功能和声"
    ],
    usedIn:  [
      "non-functional-dominants"
    ],
    takeaway:  "相邻属和弦连续上行，最后解决形成渐进转调。",
    readAt:  "2026-10-24",
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1H34y1P7s4",
    title:  "【下35】「爵士和声」转调大法 开篇绪论！——《爵士和声》下册第35集",
    episode:  "下35",
    chapter:  "下",
    duration:  771,
    published:  "2023-09-15",
    url:  "https://www.bilibili.com/video/BV1H34y1P7s4",
    status:  "catalogued",
    themes:  [
      "转调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1nh4y1h74v",
    title:  "【下36】转调大法 第一招*直接转调！《爵士和声》下册第36集",
    episode:  "下36",
    chapter:  "下",
    duration:  667,
    published:  "2023-09-30",
    url:  "https://www.bilibili.com/video/BV1nh4y1h74v",
    status:  "catalogued",
    themes:  [
      "转调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV17u411M7NP",
    title:  "【下37】转调绝招-有缘者看（爵士和声下37集-转调之支点和弦/属和弦）",
    episode:  "下37",
    chapter:  "下",
    duration:  757,
    published:  "2023-10-06",
    url:  "https://www.bilibili.com/video/BV17u411M7NP",
    status:  "catalogued",
    themes:  [
      "转调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1eG411y7Hw",
    title:  "【下38】转调终章-渐进式转调（爵士和声下38集）",
    episode:  "下38",
    chapter:  "下",
    duration:  518,
    published:  "2023-10-21",
    url:  "https://www.bilibili.com/video/BV1eG411y7Hw",
    status:  "catalogued",
    themes:  [
      "转调"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1jj411e7ni",
    title:  "【下39】高阶调式转换和弦-打破套路坐拥无限灵感（爵士和声下39集）",
    episode:  "下39",
    chapter:  "下",
    duration:  909,
    published:  "2023-10-28",
    url:  "https://www.bilibili.com/video/BV1jj411e7ni",
    status:  "catalogued",
    themes:  [
      "调式互换",
      "高阶调式转换"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV16G411X7N3",
    title:  "【下40】高阶调式转换和弦-大转小/大转大【PS：大胆使用洛克利亚调式和弦吧】！（爵士和声下40集）",
    episode:  "下40",
    chapter:  "下",
    duration:  594,
    published:  "2023-11-04",
    url:  "https://www.bilibili.com/video/BV16G411X7N3",
    status:  "catalogued",
    themes:  [
      "调式互换",
      "高阶调式转换"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1tu4y1N73a",
    title:  "【下41】小调调式转换和弦-小转小/小转大！（爵士和声下41集）",
    episode:  "下41",
    chapter:  "下",
    duration:  456,
    published:  "2023-11-11",
    url:  "https://www.bilibili.com/video/BV1tu4y1N73a",
    status:  "catalogued",
    themes:  [
      "调式互换",
      "高阶调式转换"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Cb4y1M7Nc",
    title:  "【下42】调式转换和弦中音阶的选择（爵士和声下42集）",
    episode:  "下42",
    chapter:  "下",
    duration:  618,
    published:  "2023-11-18",
    url:  "https://www.bilibili.com/video/BV1Cb4y1M7Nc",
    status:  "catalogued",
    themes:  [
      "调式互换",
      "高阶调式转换"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1UC4y117eq",
    title:  "【下43】以不变应万变「持续底音&固定音型」（爵士和声下册 43集）",
    episode:  "下43",
    chapter:  "下",
    duration:  478,
    published:  "2023-11-25",
    url:  "https://www.bilibili.com/video/BV1UC4y117eq",
    status:  "catalogued",
    themes:  [
      "持续低音",
      "固定音型"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV12b4y1L7Br",
    title:  "【下44】原来披头士这多年前就开始用调式写歌了！【擒贼先擒王之-调式特征音】（爵士和声下册 44集）",
    episode:  "下44",
    chapter:  "下",
    duration:  1003,
    published:  "2023-12-09",
    url:  "https://www.bilibili.com/video/BV12b4y1L7Br",
    status:  "read",
    themes:  [
      "调式特征音"
    ],
    usedIn:  [
      "modal-characteristics",
      "modal-interchange"
    ],
    takeaway:  "调式音乐没有完整 TSD；含特征音的和弦可作调式终止，避免三全音和弦。",
    readAt:  "2026-10-24",
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1QN4y1h74P",
    title:  "【下45】Lydian！原神味大料？【Lydian调式和声一站通】（爵士和声下册 45集）",
    episode:  "下45",
    chapter:  "下",
    duration:  656,
    published:  "2023-12-16",
    url:  "https://www.bilibili.com/video/BV1QN4y1h74P",
    status:  "read",
    themes:  [
      "Lydian"
    ],
    usedIn:  [
      "modal-characteristics"
    ],
    takeaway:  "Lydian 的特征音是 #4；II 大与 vii 小可作调式终止。",
    readAt:  "2026-10-24",
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1cw41157UD",
    title:  "【下46】Mixolydian调式和声一站通（爵士和声下册 46集）",
    episode:  "下46",
    chapter:  "下",
    duration:  622,
    published:  "2023-12-23",
    url:  "https://www.bilibili.com/video/BV1cw41157UD",
    status:  "catalogued",
    themes:  [
      "Mixolydian"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1fi4y16718",
    title:  "【下47】多利亚Dorian 调式和声完整攻略-内附爵士/流行/Funk案例应有尽有...（爵士和声下册 47集）",
    episode:  "下47",
    chapter:  "下",
    duration:  591,
    published:  "2023-12-30",
    url:  "https://www.bilibili.com/video/BV1fi4y16718",
    status:  "catalogued",
    themes:  [
      "Dorian"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1ac411t7Y4",
    title:  "【下48】弗里吉亚Phrygian调式和声完整攻略-内附配乐/流行/民族案例应有尽有...（爵士和声下册 48集）",
    episode:  "下48",
    chapter:  "下",
    duration:  638,
    published:  "2024-01-06",
    url:  "https://www.bilibili.com/video/BV1ac411t7Y4",
    status:  "catalogued",
    themes:  [
      "Phrygian"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Dc411x7Kq",
    title:  "【下49】爱奥尼亚Aeolian调式和声完整攻略&再谈调式和声避免和弦——爵士和声下册 49集",
    episode:  "下49",
    chapter:  "下",
    duration:  661,
    published:  "2024-01-13",
    url:  "https://www.bilibili.com/video/BV1Dc411x7Kq",
    status:  "catalogued",
    themes:  [
      "Aeolian"
    ],
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1Ba4y1C7S4",
    title:  "【下50】现代和声利器——四度和声/四度排列——爵士和声下册 50集",
    episode:  "下50",
    chapter:  "下",
    duration:  728,
    published:  "2024-01-27",
    url:  "https://www.bilibili.com/video/BV1Ba4y1C7S4",
    status:  "read",
    themes:  [
      "四度和声"
    ],
    usedIn:  [
      "quartal-harmony"
    ],
    takeaway:  "四度叠置弱化大小性质，低音保持主音；So What 排列以四度为主。",
    readAt:  "2026-10-24",
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV174421F7bb",
    title:  "【下51】和弦也能混合？高叠和弦的秘密！——转位和弦/混合和弦/复合和弦/斜杠和弦爵士和声下册51集",
    episode:  "下51",
    chapter:  "下",
    duration:  693,
    published:  "2024-02-16",
    url:  "https://www.bilibili.com/video/BV174421F7bb",
    status:  "read",
    themes:  [
      "混合和弦",
      "复合和弦",
      "斜杠和弦"
    ],
    usedIn:  [
      "hybrid-chords"
    ],
    takeaway:  "斜杠分转位、混合、复合；低音定功能，上层定颜色。",
    readAt:  "2026-10-24",
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1eF4m157WP",
    title:  "【下52】爵士和声大结局-固定结构/无功能和声初探",
    episode:  "下52",
    chapter:  "下",
    duration:  397,
    published:  "2024-02-24",
    url:  "https://www.bilibili.com/video/BV1eF4m157WP",
    status:  "read",
    themes:  [
      "固定结构",
      "无功能和声"
    ],
    usedIn:  [
      "constant-structure",
      "non-functional-dominants"
    ],
    takeaway:  "固定结构可平移到有功能或无功能终点；平行色彩带削弱倾向解决。",
    readAt:  "2026-10-24",
    collection:  "jazz-harmony"
  },
  {
    bvid:  "BV1zS421d7ZR",
    title:  "EP01中古调式如何快速记忆？「初阶」",
    episode:  "EP01",
    chapter:  "",
    duration:  269,
    published:  "2024-06-27",
    url:  "https://www.bilibili.com/video/BV1zS421d7ZR",
    status:  "read",
    themes:  [
      "调式特征音",
      "中古调式"
    ],
    collection:  "jazz-academy",
    via:  "subtitle",
    usedIn:  [
      "modes",
      "modal-characteristics"
    ],
    takeaway:  "特征音记忆法：拿调式与同主音大小调比较，差出来的音就是特征音（Dorian 升 6、Phrygian 降 2、Lydian 升 4、Mixolydian 降 7、Locrian 降 2 降 5）。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1rH4y1w7Ka",
    title:  "EP02不同中古调式音阶的色彩变化「初阶」",
    episode:  "EP02",
    chapter:  "",
    duration:  296,
    published:  "2024-07-03",
    url:  "https://www.bilibili.com/video/BV1rH4y1w7Ka",
    status:  "read",
    themes:  [
      "调式色彩",
      "明暗排序"
    ],
    collection:  "jazz-academy",
    via:  "asr",
    usedIn:  [
      "modal-characteristics",
      "modal-mixture-color"
    ],
    takeaway:  "七调式按调号排明暗：Lydian 最亮 → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian 最暗；Lydian 梦幻（原神）、Mixolydian 民族/中世纪（塞尔达时之笛）、Phrygian 威胁（大白鲨）、Locrian 邪恶（FF6 炭坑都市）。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1Fr6DYJEeg",
    title:  "EP03大调音阶的II-V-I进行「初阶」",
    episode:  "EP03",
    chapter:  "",
    duration:  253,
    published:  "2024-12-31",
    url:  "https://www.bilibili.com/video/BV1Fr6DYJEeg",
    status:  "catalogued",
    themes:  [
      "ii-V-I"
    ],
    collection:  "jazz-academy"
  },
  {
    bvid:  "BV16dcpeoE3e",
    title:  "EP04为什么能够演奏一个和弦一个调？「中阶」",
    episode:  "EP04",
    chapter:  "",
    duration:  209,
    published:  "2025-01-11",
    url:  "https://www.bilibili.com/video/BV16dcpeoE3e",
    status:  "read",
    themes:  [
      "调式互换",
      "同主音调式"
    ],
    collection:  "jazz-academy",
    via:  "subtitle",
    usedIn:  [
      "modal-interchange",
      "chord-scale"
    ],
    takeaway:  "一个和弦一个调：不变功能和弦，只替换同主音调式旋律（Dm7 用 C Dorian、Cmaj7 用 C Lydian）即可改色；频繁换色会让听众难以跟随（James Newton Howard 电影配乐示例）。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1XK9hYmELs",
    title:  "EP05常见的和弦进行如何“意外”？「中阶」",
    episode:  "EP05",
    chapter:  "",
    duration:  290,
    published:  "2025-03-02",
    url:  "https://www.bilibili.com/video/BV1XK9hYmELs",
    status:  "catalogued",
    themes:  [
      "意外进行",
      "假解决"
    ],
    collection:  "jazz-academy"
  },
  {
    bvid:  "BV1J398YxEwa",
    title:  "EP06“你发现了几次意外？”「The Last Emperor｜坂本龙一」调感变化分析「高阶」",
    episode:  "EP06",
    chapter:  "",
    duration:  258,
    published:  "2025-03-02",
    url:  "https://www.bilibili.com/video/BV1J398YxEwa",
    status:  "catalogued",
    themes:  [
      "调感分析",
      "影视分析"
    ],
    collection:  "jazz-academy"
  },
  {
    bvid:  "BV1XbXqYAEok",
    title:  "EP07 用调式爵士写曲子（一）｜大调音阶和声上的调式爵士「初阶」",
    episode:  "EP07",
    chapter:  "",
    duration:  386,
    published:  "2025-03-24",
    url:  "https://www.bilibili.com/video/BV1XbXqYAEok",
    status:  "read",
    themes:  [
      "调式爵士",
      "避免音"
    ],
    collection:  "jazz-academy",
    via:  "subtitle",
    usedIn:  [
      "chord-scale",
      "modal-harmony",
      "constant-structure"
    ],
    takeaway:  "调式爵士=较少和弦+较多空间：每级和弦配第一选择音阶与避免音（外音化处理）；和声简化后靠平行移动与持续调式建立氛围（荒野大镖客示例）。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1xJZYYHEcx",
    title:  "EP08用调式爵士写曲子（二）｜“给你们听个好玩的”「创作演示」",
    episode:  "EP08",
    chapter:  "",
    duration:  114,
    published:  "2025-03-29",
    url:  "https://www.bilibili.com/video/BV1xJZYYHEcx",
    status:  "catalogued",
    themes:  [
      "调式爵士",
      "创作演示"
    ],
    collection:  "jazz-academy"
  },
  {
    bvid:  "BV1N2LdzWEJe",
    title:  "EP09学院派作曲带你揭秘斜线和弦｜全网最全的斜线和弦教程",
    episode:  "EP09",
    chapter:  "",
    duration:  1028,
    published:  "2025-04-27",
    url:  "https://www.bilibili.com/video/BV1N2LdzWEJe",
    status:  "read",
    themes:  [
      "斜线和弦",
      "变和弦",
      "三全音代理"
    ],
    collection:  "jazz-academy",
    via:  "subtitle",
    usedIn:  [
      "hybrid-chords",
      "tritone-substitution",
      "extensions-alterations"
    ],
    takeaway:  "斜线和弦=低音之上的三和弦：低音定功能、上层定色彩；Db/C=C7(b9b13)、Gb/C=保留低音的三全音代理、Ab/C+Gb/C=C7alt——斯波索宾变属和弦的快速记法。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1TeJdzTESr",
    title:  "EP10学院派作曲带你揭秘旋律小调音阶和声用法大全「理论好‘爵’」EP10",
    episode:  "EP10",
    chapter:  "",
    duration:  1097,
    published:  "2025-09-21",
    url:  "https://www.bilibili.com/video/BV1TeJdzTESr",
    status:  "read",
    themes:  [
      "旋律小调",
      "调式和弦",
      "变化属和弦"
    ],
    collection:  "jazz-academy",
    via:  "subtitle",
    usedIn:  [
      "melodic-minor-modes",
      "chord-scale",
      "hybrid-chords"
    ],
    takeaway:  "旋律小调七个调式各有代表和弦：mMaj7 主、m7b5 二级、sus b9 / Lydian aug / Lydian dom / 7alt 属色彩；mMaj7 不能替换 ii–V 中作 ii 的 m7；斜线和弦是复杂音响的快速反应工具。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1uE411X79u",
    title:  "《一首器乐摇滚是如何从一条单旋律制成的》",
    episode:  "",
    chapter:  "",
    duration:  311,
    published:  "2019-10-03",
    url:  "https://www.bilibili.com/video/BV1uE411X79u",
    status:  "catalogued",
    themes:  [
      "器乐摇滚",
      "动机发展"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1i7411p7jN",
    title:  "《如何仅从一个和弦想出整首歌曲》",
    episode:  "",
    chapter:  "",
    duration:  440,
    published:  "2020-02-04",
    url:  "https://www.bilibili.com/video/BV1i7411p7jN",
    status:  "read",
    themes:  [
      "持续音",
      "单和弦写作"
    ],
    collection:  "stylized-creation",
    via:  "frames",
    usedIn:  [
      "modal-harmony",
      "bass-line"
    ],
    takeaway:  "先立一个持续中心和弦铺满整曲，再按 6145 等级数局部替换与分层——从单和弦到进行是扩展出来的，不是一次写完的。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1iv4y1f71i",
    title:  "《如何写出一首航空级配乐》",
    episode:  "",
    chapter:  "",
    duration:  398,
    published:  "2021-01-23",
    url:  "https://www.bilibili.com/video/BV1iv4y1f71i",
    status:  "catalogued",
    themes:  [
      "影视配乐"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV12r4y1S7RG",
    title:  "《如何写出大气而明亮的配乐》",
    episode:  "",
    chapter:  "",
    duration:  333,
    published:  "2021-12-11",
    url:  "https://www.bilibili.com/video/BV12r4y1S7RG",
    status:  "catalogued",
    themes:  [
      "影视配乐",
      "明亮色彩"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1ea411y7cE",
    title:  "《在5分钟内学会写一首流行摇滚》",
    episode:  "",
    chapter:  "",
    duration:  285,
    published:  "2022-02-12",
    url:  "https://www.bilibili.com/video/BV1ea411y7cE",
    status:  "catalogued",
    themes:  [
      "流行摇滚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1nZ4y1r7Go",
    title:  "《如何写一首风味奇特的另类摇滚》",
    episode:  "",
    chapter:  "",
    duration:  285,
    published:  "2022-03-09",
    url:  "https://www.bilibili.com/video/BV1nZ4y1r7Go",
    status:  "catalogued",
    themes:  [
      "另类摇滚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1yu411y7Jx",
    title:  "《如何写一首拍手跺脚的摇滚》",
    episode:  "",
    chapter:  "",
    duration:  241,
    published:  "2022-04-18",
    url:  "https://www.bilibili.com/video/BV1yu411y7Jx",
    status:  "catalogued",
    themes:  [
      "摇滚",
      "律动"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1HZ4y1y7RN",
    title:  "《如何在4分钟内写一首欧美流行》",
    episode:  "",
    chapter:  "",
    duration:  232,
    published:  "2022-05-01",
    url:  "https://www.bilibili.com/video/BV1HZ4y1y7RN",
    status:  "catalogued",
    themes:  [
      "欧美流行"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1YU4y1m7bm",
    title:  "《如何写一首史诗新世纪风格的配乐》",
    episode:  "",
    chapter:  "",
    duration:  315,
    published:  "2022-05-15",
    url:  "https://www.bilibili.com/video/BV1YU4y1m7bm",
    status:  "catalogued",
    themes:  [
      "新世纪",
      "史诗"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1yY4y1B7ak",
    title:  "《如何将【白鸟过河滩】改编为流行摇滚》",
    episode:  "",
    chapter:  "",
    duration:  119,
    published:  "2022-05-28",
    url:  "https://www.bilibili.com/video/BV1yY4y1B7ak",
    status:  "catalogued",
    themes:  [
      "改编",
      "流行摇滚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1rY4y1g7qi",
    title:  "《一首金属是如何从一条Riff制成的》",
    episode:  "",
    chapter:  "",
    duration:  201,
    published:  "2022-06-17",
    url:  "https://www.bilibili.com/video/BV1rY4y1g7qi",
    status:  "catalogued",
    themes:  [
      "金属",
      "Riff"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1uU4y1D7L4",
    title:  "《影视配乐中的摇滚是怎样写出来的》",
    episode:  "",
    chapter:  "",
    duration:  198,
    published:  "2022-07-08",
    url:  "https://www.bilibili.com/video/BV1uU4y1D7L4",
    status:  "catalogued",
    themes:  [
      "影视配乐",
      "摇滚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1vT411J7qK",
    title:  "《欧美风的流行摇滚是如何写成的》",
    episode:  "",
    chapter:  "",
    duration:  277,
    published:  "2022-07-17",
    url:  "https://www.bilibili.com/video/BV1vT411J7qK",
    status:  "catalogued",
    themes:  [
      "流行摇滚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1UU4y1e7CP",
    title:  "《商业宣传片中的管弦配乐是怎样写成的》",
    episode:  "",
    chapter:  "",
    duration:  235,
    published:  "2022-07-26",
    url:  "https://www.bilibili.com/video/BV1UU4y1e7CP",
    status:  "catalogued",
    themes:  [
      "管弦配乐",
      "宣传片"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV17U4y1C7pM",
    title:  "《如何写出大场面的史诗流行&另类流行》",
    episode:  "",
    chapter:  "",
    duration:  241,
    published:  "2022-08-14",
    url:  "https://www.bilibili.com/video/BV17U4y1C7pM",
    status:  "catalogued",
    themes:  [
      "史诗流行"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1te4y1d7ED",
    title:  "《如何像汪峰那样写一首流行摇滚》",
    episode:  "",
    chapter:  "",
    duration:  213,
    published:  "2022-08-31",
    url:  "https://www.bilibili.com/video/BV1te4y1d7ED",
    status:  "catalogued",
    themes:  [
      "流行摇滚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1Wt4y1j7rf",
    title:  "《如何写一首日系&ACG摇滚》",
    episode:  "",
    chapter:  "",
    duration:  197,
    published:  "2022-09-17",
    url:  "https://www.bilibili.com/video/BV1Wt4y1j7rf",
    status:  "catalogued",
    themes:  [
      "日系摇滚",
      "ACG"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1A14y1h7Ws",
    title:  "《游戏里的中世纪风格配乐是怎样写出来的》",
    episode:  "",
    chapter:  "",
    duration:  227,
    published:  "2022-10-08",
    url:  "https://www.bilibili.com/video/BV1A14y1h7Ws",
    status:  "catalogued",
    themes:  [
      "中世纪",
      "管弦"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1FG4y1R7vQ",
    title:  "《用混合利底亚把世界杯宣传曲写一首摇滚》",
    episode:  "",
    chapter:  "",
    duration:  186,
    published:  "2022-12-01",
    url:  "https://www.bilibili.com/video/BV1FG4y1R7vQ",
    status:  "read",
    themes:  [
      "Mixolydian",
      "摇滚"
    ],
    collection:  "stylized-creation",
    via:  "frames",
    usedIn:  [
      "modal-characteristics",
      "modal-interchange"
    ],
    takeaway:  "摇滚语境的 Mixolydian：降七级造成的 4-5 特征半音与 I–bVII 交替；同一结构可上移纯五度复用。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1CD4y1g7M2",
    title:  "《商业流行史诗教程：如何写出震撼且充满张力的史诗音乐》",
    episode:  "",
    chapter:  "",
    duration:  242,
    published:  "2023-02-25",
    url:  "https://www.bilibili.com/video/BV1CD4y1g7M2",
    status:  "catalogued",
    themes:  [
      "史诗",
      "张力"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1DT411x7vy",
    title:  "《电影游戏里的异世界音乐原来是这样写的》",
    episode:  "",
    chapter:  "",
    duration:  243,
    published:  "2023-05-19",
    url:  "https://www.bilibili.com/video/BV1DT411x7vy",
    status:  "catalogued",
    themes:  [
      "异世界",
      "配乐"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1uM4y147Jt",
    title:  "《史诗音乐教程：如何写一首悲壮的弦乐史诗》",
    episode:  "",
    chapter:  "",
    duration:  250,
    published:  "2023-07-18",
    url:  "https://www.bilibili.com/video/BV1uM4y147Jt",
    status:  "catalogued",
    themes:  [
      "弦乐",
      "史诗"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1cu4y1i7nE",
    title:  "《凯尔特管弦教程：幻想、魔法与异世界》",
    episode:  "",
    chapter:  "",
    duration:  229,
    published:  "2023-08-21",
    url:  "https://www.bilibili.com/video/BV1cu4y1i7nE",
    status:  "catalogued",
    themes:  [
      "凯尔特",
      "管弦"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1tT4y1H746",
    title:  "《史诗音乐教程：如何写出优雅华丽的华尔兹管弦配乐》",
    episode:  "",
    chapter:  "",
    duration:  249,
    published:  "2024-01-06",
    url:  "https://www.bilibili.com/video/BV1tT4y1H746",
    status:  "catalogued",
    themes:  [
      "圆舞曲",
      "管弦"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV12r421375t",
    title:  "《史诗音乐教程：影视史诗是如何使用弗里吉亚来塑造紧张感的》",
    episode:  "",
    chapter:  "",
    duration:  121,
    published:  "2024-04-18",
    url:  "https://www.bilibili.com/video/BV12r421375t",
    status:  "read",
    themes:  [
      "Phrygian",
      "紧张感"
    ],
    collection:  "stylized-creation",
    via:  "frames",
    usedIn:  [
      "modal-characteristics"
    ],
    takeaway:  "史诗配乐用弗里吉亚 b2 与经典 3–4–5 旋律细胞制造紧张；铜管+定音鼓填中频冲击。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1Wb421E7RL",
    title:  "《史诗音乐教程：给BOSS战写首紧张激烈的配乐》",
    episode:  "",
    chapter:  "",
    duration:  112,
    published:  "2024-07-10",
    url:  "https://www.bilibili.com/video/BV1Wb421E7RL",
    status:  "catalogued",
    themes:  [
      "BOSS战",
      "快节奏"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV16M4m1y7AE",
    title:  "《流行配乐教程：将弗拉门戈运用到小调音乐中》",
    episode:  "",
    chapter:  "",
    duration:  226,
    published:  "2024-08-11",
    url:  "https://www.bilibili.com/video/BV16M4m1y7AE",
    status:  "catalogued",
    themes:  [
      "弗拉门戈",
      "弗里吉亚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1Rkq5YcENx",
    title:  "《史诗音乐教程：如何写出预告片风格的史诗配乐》",
    episode:  "",
    chapter:  "",
    duration:  149,
    published:  "2024-12-08",
    url:  "https://www.bilibili.com/video/BV1Rkq5YcENx",
    status:  "catalogued",
    themes:  [
      "预告片",
      "史诗"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1kBdSYxEvC",
    title:  "《作曲编曲教程：如何在配乐中塑造和转换情绪》",
    episode:  "",
    chapter:  "",
    duration:  321,
    published:  "2025-04-12",
    url:  "https://www.bilibili.com/video/BV1kBdSYxEvC",
    status:  "catalogued",
    themes:  [
      "情绪转换",
      "新世纪"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1XvhozCEXi",
    title:  "《游戏配乐里的中世纪神秘色彩是怎么来的？》",
    episode:  "",
    chapter:  "",
    duration:  281,
    published:  "2025-08-30",
    url:  "https://www.bilibili.com/video/BV1XvhozCEXi",
    status:  "read",
    themes:  [
      "中古调式",
      "配器色彩"
    ],
    collection:  "stylized-creation",
    via:  "frames",
    usedIn:  [
      "modal-characteristics",
      "modal-harmony"
    ],
    takeaway:  "中世纪神秘感=中古调式+配器：拨弦把阴森推向神秘，动机节奏型复现承载动态变化。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1muz2BgEzJ",
    title:  "《作曲编曲教程：midwest什么一招鲜这么管用》",
    episode:  "",
    chapter:  "",
    duration:  186,
    published:  "2026-01-25",
    url:  "https://www.bilibili.com/video/BV1muz2BgEzJ",
    status:  "catalogued",
    themes:  [
      "Midwest Emo",
      "流行摇滚"
    ],
    collection:  "stylized-creation"
  },
  {
    bvid:  "BV1diijBbEM2",
    title:  "一个视频搞定所有和弦扩展音！初学现代和声必看",
    episode:  "公开课",
    chapter:  "",
    duration:  362,
    published:  "2026-01-04",
    url:  "https://www.bilibili.com/video/BV1diijBbEM2",
    status:  "read",
    themes:  [
      "扩展音",
      "避免音"
    ],
    collection:  "jazz-extras",
    via:  "subtitle",
    usedIn:  [
      "extensions-alterations"
    ],
    takeaway:  "9 音几乎百搭；b9/#9 属于属七（b9 也可在半减七）；11 归小与挂留、#11 归大与属（Lydian/blues）；13 用于大/属/半减，b13 用于半减与 alt 属七。",
    readAt:  "2026-10-24"
  },
  {
    bvid:  "BV1vxrnBnE9P",
    title:  "和弦排列多到崩溃？请了解“滚雪球”效应",
    episode:  "公开课",
    chapter:  "",
    duration:  265,
    published:  "2026-01-14",
    url:  "https://www.bilibili.com/video/BV1vxrnBnE9P",
    status:  "read",
    themes:  [
      "排列",
      "学习方法"
    ],
    collection:  "jazz-extras",
    via:  "subtitle",
    usedIn:  [
      "rootless-voicings",
      "extensions-alterations"
    ],
    takeaway:  "排列不用逐日回头复习：voicing 是滚雪球式累积——音程→三和弦→七和弦→无根排列→扩展音→drop/上层结构，后一步永远在调用前一步。",
    readAt:  "2026-10-24"
  }
]

export const BILIBILI_VIDEO_COUNT = BILIBILI_VIDEOS.length;
export const BILIBILI_READ_COUNT = BILIBILI_VIDEOS.filter((video) => video.status === "read").length;
export const getBilibiliVideo = (bvid: string): BilibiliVideo | undefined =>
  BILIBILI_VIDEOS.find((video) => video.bvid === bvid);
