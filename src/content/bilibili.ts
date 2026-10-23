// B 站课程调研台账：记录已检索/已读视频，避免重复搜索。
// 只保存元数据与阅读状态，不保存字幕或正文；视频不作为理论依据。

export type VideoReadStatus = "read" | "catalogued";

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
  usedIn?: string[];
  takeaway?: string;
  readAt?: string;
}

export const BILIBILI_SEASON = {
  mid: "1405367071",
  seasonId: "762895",
  title: "爵士和声理论",
  url: "https://space.bilibili.com/1405367071/lists/762895?type=season",
  total: 68,
  fetchedAt: "2026-10-24",
  note: "仅记录视频元数据与阅读状态；不保存字幕/正文，视频不作为理论依据。",
} as const;

export const BILIBILI_VIDEOS: BilibiliVideo[] = [
  {
    "bvid": "BV1fv4y157oo",
    "title": "【导言】用陈奕迅《孤独患者》告诉你为啥音乐人需要爵士和声？扒带扒不出？扒出来也看不懂？今天一次跟你聊明白（爵士和声上册序言）",
    "episode": "导言",
    "chapter": "导言",
    "duration": 422,
    "published": "2023-03-24",
    "url": "https://www.bilibili.com/video/BV1fv4y157oo",
    "status": "catalogued",
    "themes": [
      "课程定位"
    ]
  },
  {
    "bvid": "BV11V4y1Q7zo",
    "title": "【上01】 小调到底唱6还是唱1？和弦扩展音老是找不对？现代音乐到底有多少种七和弦？一次性搞懂现代音乐音程底层逻辑 /初学小白福音《爵士和声》【爵士-没有派对】",
    "episode": "上01",
    "chapter": "上",
    "duration": 858,
    "published": "2023-04-01",
    "url": "https://www.bilibili.com/video/BV11V4y1Q7zo",
    "status": "catalogued",
    "themes": [
      "音程",
      "调式音阶"
    ]
  },
  {
    "bvid": "BV13o4y1j7t8",
    "title": "【上02】十分钟快速了解调式音阶到底怎么学？有啥用？现代音乐底层逻辑 乐理扫盲/初学小白福音《爵士和声》【爵士-没有派对】",
    "episode": "上02",
    "chapter": "上",
    "duration": 588,
    "published": "2023-04-15",
    "url": "https://www.bilibili.com/video/BV13o4y1j7t8",
    "status": "read",
    "themes": [
      "音程",
      "调式音阶"
    ],
    "usedIn": [
      "modes",
      "modal-characteristics"
    ],
    "takeaway": "调式要按同主音比较，特征音来自与大小调的差异。",
    "readAt": "2026-10-24"
  },
  {
    "bvid": "BV1TV4y1d7W6",
    "title": "【上03】现代/爵士和声学自然和弦功能分组与和弦重配/现代和声学大扫盲《爵士和声》【爵士没有派对】",
    "episode": "上03",
    "chapter": "上",
    "duration": 758,
    "published": "2023-04-29",
    "url": "https://www.bilibili.com/video/BV1TV4y1d7W6",
    "status": "catalogued",
    "themes": [
      "功能分组",
      "重配和声"
    ]
  },
  {
    "bvid": "BV1gc411P7Ko",
    "title": "【上04】三分钟搞懂爵士和声的终止式《爵士和声》【爵士-没有派对】",
    "episode": "上04",
    "chapter": "上",
    "duration": 220,
    "published": "2023-05-13",
    "url": "https://www.bilibili.com/video/BV1gc411P7Ko",
    "status": "catalogued",
    "themes": [
      "终止式"
    ]
  },
  {
    "bvid": "BV1Sh41157EU",
    "title": "【上05】大三级？大六级？..你真的搞懂副属和弦了吗？——《爵士和声》【爵士-没有派对】",
    "episode": "上05",
    "chapter": "上",
    "duration": 472,
    "published": "2023-05-13",
    "url": "https://www.bilibili.com/video/BV1Sh41157EU",
    "status": "catalogued",
    "themes": [
      "副属和弦"
    ]
  },
  {
    "bvid": "BV1Cg4y1c7mK",
    "title": "【上06】一次性搞懂爵士251，哪来的？怎么用？爵士案例？流行歌案例？连讲带弹，统统都有！！《爵士和声》【爵士-没有派对】",
    "episode": "上06",
    "chapter": "上",
    "duration": 805,
    "published": "2023-05-27",
    "url": "https://www.bilibili.com/video/BV1Cg4y1c7mK",
    "status": "catalogued",
    "themes": [
      "ii-V-I"
    ]
  },
  {
    "bvid": "BV1bh411P7pu",
    "title": "【上07】声部连接/基础排列底层逻辑——《爵士和声》【爵士-没有派对】",
    "episode": "上07",
    "chapter": "上",
    "duration": 630,
    "published": "2023-06-24",
    "url": "https://www.bilibili.com/video/BV1bh411P7pu",
    "status": "catalogued",
    "themes": [
      "声部连接"
    ]
  },
  {
    "bvid": "BV1na4y1w79R",
    "title": "【上08】一离调就懵？永远跳不出和声套路？该学学调式转换了！！《爵士和声》【爵士-没有派对】",
    "episode": "上08",
    "chapter": "上",
    "duration": 588,
    "published": "2023-07-02",
    "url": "https://www.bilibili.com/video/BV1na4y1w79R",
    "status": "catalogued",
    "themes": [
      "调式转换",
      "自然小调"
    ]
  },
  {
    "bvid": "BV12M4y1x79c",
    "title": "【上09】自然小调的调式转换和弦的功能分组《爵士和声》【爵士-没有派对】",
    "episode": "上09",
    "chapter": "上",
    "duration": 474,
    "published": "2023-07-15",
    "url": "https://www.bilibili.com/video/BV12M4y1x79c",
    "status": "catalogued",
    "themes": [
      "调式转换",
      "自然小调"
    ]
  },
  {
    "bvid": "BV1kp4y1G7rJ",
    "title": "【上10】b2maj7/4mM7 自然小调的调式转换其他下属小调和弦《爵士和声》【爵士-没有派对】",
    "episode": "上10",
    "chapter": "上",
    "duration": 757,
    "published": "2023-07-29",
    "url": "https://www.bilibili.com/video/BV1kp4y1G7rJ",
    "status": "catalogued",
    "themes": [
      "调式转换",
      "自然小调"
    ]
  },
  {
    "bvid": "BV1nm4y1p7tf",
    "title": "【上11】突破和声大俗套！调式转换和弦 扩展音+音阶 一站式大汇总《爵士和声》【爵士-没有派对】",
    "episode": "上11",
    "chapter": "上",
    "duration": 1048,
    "published": "2023-08-12",
    "url": "https://www.bilibili.com/video/BV1nm4y1p7tf",
    "status": "catalogued",
    "themes": [
      "调式转换",
      "自然小调"
    ]
  },
  {
    "bvid": "BV1yh4y1U7iu",
    "title": "【上12】你真的了解小调吗？现代音乐小调系统-自然和弦/音阶一站通！《爵士和声》【爵士-没有派对】",
    "episode": "上12",
    "chapter": "上",
    "duration": 1208,
    "published": "2023-08-26",
    "url": "https://www.bilibili.com/video/BV1yh4y1U7iu",
    "status": "catalogued",
    "themes": [
      "调式转换",
      "自然小调"
    ]
  },
  {
    "bvid": "BV1oh4y1P7kQ",
    "title": "【上13】小调也可以有副属/扩展属喔！-小调和声案例分析《爵士和声》【爵士-没有派对】",
    "episode": "上13",
    "chapter": "上",
    "duration": 578,
    "published": "2023-09-09",
    "url": "https://www.bilibili.com/video/BV1oh4y1P7kQ",
    "status": "catalogued",
    "themes": [
      "调式转换",
      "自然小调"
    ]
  },
  {
    "bvid": "BV1y94y1p7S5",
    "title": "【上14】超好上手的现代和声技巧——惯用线！配乐/编曲都好用！《爵士和声》【爵士-没有派对】",
    "episode": "上14",
    "chapter": "上",
    "duration": 650,
    "published": "2023-09-22",
    "url": "https://www.bilibili.com/video/BV1y94y1p7S5",
    "status": "catalogued",
    "themes": [
      "惯用线"
    ]
  },
  {
    "bvid": "BV1qG41117jJ",
    "title": "【上15】布鲁斯和声你了解几种？传统、爵士、bebop《爵士和声》【爵士-没有派对】",
    "episode": "上15",
    "chapter": "上",
    "duration": 704,
    "published": "2023-10-14",
    "url": "https://www.bilibili.com/video/BV1qG41117jJ",
    "status": "catalogued",
    "themes": [
      "布鲁斯"
    ]
  },
  {
    "bvid": "BV1xx4y1S78m",
    "title": "【下01】乐手/编曲人必修！和弦就是音阶，音阶就是和弦！扩展音/避免音的基本概念《爵士和声系统教程》【爵士-没有派对】",
    "episode": "下01",
    "chapter": "下",
    "duration": 467,
    "published": "2024-03-09",
    "url": "https://www.bilibili.com/video/BV1xx4y1S78m",
    "status": "catalogued",
    "themes": [
      "和弦音阶",
      "扩展音",
      "避免音"
    ]
  },
  {
    "bvid": "BV19J4m1b7M2",
    "title": "【下02】和弦的9音11音13音到底是怎么加的《爵士和声系统教程》【爵士-没有派对】",
    "episode": "下02",
    "chapter": "下",
    "duration": 617,
    "published": "2024-03-10",
    "url": "https://www.bilibili.com/video/BV19J4m1b7M2",
    "status": "catalogued",
    "themes": [
      "和弦音阶",
      "扩展音",
      "避免音"
    ]
  },
  {
    "bvid": "BV19p421m7Nm",
    "title": "【下03】副属和你会了？那扩展音和音阶怎么办？《爵士和声系统教程》【爵士-没有派对】",
    "episode": "下03",
    "chapter": "下",
    "duration": 436,
    "published": "2024-03-16",
    "url": "https://www.bilibili.com/video/BV19p421m7Nm",
    "status": "catalogued",
    "themes": [
      "和弦音阶",
      "扩展音",
      "避免音"
    ]
  },
  {
    "bvid": "BV1gH4y1p7gA",
    "title": "【下04】属和弦的N种玩法/副属和弦扩展音选择2/主属和弦音阶扩展音选择/Alt音阶/变化属音阶/爵士和声（下）04集【重制】",
    "episode": "下04",
    "chapter": "下",
    "duration": 312,
    "published": "2024-03-22",
    "url": "https://www.bilibili.com/video/BV1gH4y1p7gA",
    "status": "catalogued",
    "themes": [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ]
  },
  {
    "bvid": "BV1rV4y1L7mA",
    "title": "【下05】爵士和声（下册）/全网最系统/——大调中的和弦音阶5——副属和弦音阶3",
    "episode": "下05",
    "chapter": "下",
    "duration": 605,
    "published": "2022-10-09",
    "url": "https://www.bilibili.com/video/BV1rV4y1L7mA",
    "status": "catalogued",
    "themes": [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ]
  },
  {
    "bvid": "BV1Y14y177Xo",
    "title": "【下06】爵士和声（下册）全网最系统 第六集——扩展属和弦音阶/其他属和弦音阶/相关二级和弦音阶",
    "episode": "下06",
    "chapter": "下",
    "duration": 622,
    "published": "2022-10-10",
    "url": "https://www.bilibili.com/video/BV1Y14y177Xo",
    "status": "catalogued",
    "themes": [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ]
  },
  {
    "bvid": "BV1Qe4y1q7g8",
    "title": "【下07】爵士和声（下册）大调中的和弦音阶7——大调中其他和弦音阶",
    "episode": "下07",
    "chapter": "下",
    "duration": 755,
    "published": "2022-10-11",
    "url": "https://www.bilibili.com/video/BV1Qe4y1q7g8",
    "status": "catalogued",
    "themes": [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ]
  },
  {
    "bvid": "BV1CR4y1R7cw",
    "title": "【下08】爵士和声（下册）大调中的和弦音阶8——大调中其他和弦音阶/小调中的和弦音阶",
    "episode": "下08",
    "chapter": "下",
    "duration": 621,
    "published": "2022-10-13",
    "url": "https://www.bilibili.com/video/BV1CR4y1R7cw",
    "status": "catalogued",
    "themes": [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ]
  },
  {
    "bvid": "BV1Fe411V7G3",
    "title": "【下09】爵士和声（下册）——小调和弦音阶2",
    "episode": "下09",
    "chapter": "下",
    "duration": 504,
    "published": "2022-10-19",
    "url": "https://www.bilibili.com/video/BV1Fe411V7G3",
    "status": "catalogued",
    "themes": [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ]
  },
  {
    "bvid": "BV16K411U72A",
    "title": "【下10】爵士和声（下册）——第十集-小调和弦音阶3",
    "episode": "下10",
    "chapter": "下",
    "duration": 897,
    "published": "2022-10-29",
    "url": "https://www.bilibili.com/video/BV16K411U72A",
    "status": "catalogued",
    "themes": [
      "属和弦扩展",
      "Alt音阶",
      "小调和弦音阶"
    ]
  },
  {
    "bvid": "BV12R4y1Z7yJ",
    "title": "【下11】爵士和声（下册）——第十一集-小调和弦音阶4",
    "episode": "下11",
    "chapter": "下",
    "duration": 622,
    "published": "2022-11-14",
    "url": "https://www.bilibili.com/video/BV12R4y1Z7yJ",
    "status": "catalogued",
    "themes": [
      "小调和弦音阶",
      "布鲁斯"
    ]
  },
  {
    "bvid": "BV1vK411X7MU",
    "title": "【下12】爵士和声（下册）——第12集-布鲁斯和弦与音阶",
    "episode": "下12",
    "chapter": "下",
    "duration": 987,
    "published": "2022-12-04",
    "url": "https://www.bilibili.com/video/BV1vK411X7MU",
    "status": "catalogued",
    "themes": [
      "小调和弦音阶",
      "布鲁斯"
    ]
  },
  {
    "bvid": "BV1bR4y1r79Z",
    "title": "【下13】爵士和声（下册）——第13集-替代属和弦（三全音代理）1",
    "episode": "下13",
    "chapter": "下",
    "duration": 545,
    "published": "2022-12-11",
    "url": "https://www.bilibili.com/video/BV1bR4y1r79Z",
    "status": "catalogued",
    "themes": [
      "替代属",
      "三全音替代"
    ]
  },
  {
    "bvid": "BV1wM411S7d6",
    "title": "【下14】爵士和声（下册）——第14集-替代属和弦（三全音代理）2",
    "episode": "下14",
    "chapter": "下",
    "duration": 792,
    "published": "2022-12-18",
    "url": "https://www.bilibili.com/video/BV1wM411S7d6",
    "status": "catalogued",
    "themes": [
      "替代属",
      "三全音替代"
    ]
  },
  {
    "bvid": "BV1Tg411b7GQ",
    "title": "【下15】爵士和声（下册）——第15集-替代属和弦的相关二级",
    "episode": "下15",
    "chapter": "下",
    "duration": 715,
    "published": "2022-12-24",
    "url": "https://www.bilibili.com/video/BV1Tg411b7GQ",
    "status": "catalogued",
    "themes": [
      "替代属",
      "三全音替代"
    ]
  },
  {
    "bvid": "BV1RD4y157jN",
    "title": "【下16】爵士和声（下册）——第16集-扩展替代属和弦",
    "episode": "下16",
    "chapter": "下",
    "duration": 751,
    "published": "2023-01-01",
    "url": "https://www.bilibili.com/video/BV1RD4y157jN",
    "status": "catalogued",
    "themes": [
      "替代属",
      "三全音替代"
    ]
  },
  {
    "bvid": "BV19M41187FS",
    "title": "【下17】爵士和声（下册）——第17集-替代属和弦的扩展音与音阶",
    "episode": "下17",
    "chapter": "下",
    "duration": 601,
    "published": "2023-01-08",
    "url": "https://www.bilibili.com/video/BV19M41187FS",
    "status": "catalogued",
    "themes": [
      "替代属",
      "三全音替代"
    ]
  },
  {
    "bvid": "BV1M24y1z7ti",
    "title": "【下18】爵士和声（下册）——第18集-纵享丝滑的减七和弦1",
    "episode": "下18",
    "chapter": "下",
    "duration": 793,
    "published": "2023-02-04",
    "url": "https://www.bilibili.com/video/BV1M24y1z7ti",
    "status": "catalogued",
    "themes": [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ]
  },
  {
    "bvid": "BV1uG4y1K7sS",
    "title": "【下19】爵士和声（下册）——第19集-减七和弦的变化走向",
    "episode": "下19",
    "chapter": "下",
    "duration": 474,
    "published": "2023-02-11",
    "url": "https://www.bilibili.com/video/BV1uG4y1K7sS",
    "status": "catalogued",
    "themes": [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ]
  },
  {
    "bvid": "BV1y14y1F7aQ",
    "title": "【下20】爵士和声（下册）——第20集-减七和弦的扩展音",
    "episode": "下20",
    "chapter": "下",
    "duration": 842,
    "published": "2023-02-18",
    "url": "https://www.bilibili.com/video/BV1y14y1F7aQ",
    "status": "catalogued",
    "themes": [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ]
  },
  {
    "bvid": "BV1U24y1J7zo",
    "title": "【下21】爵士和声（下册）——第21集-减和弦音阶与对称减音阶",
    "episode": "下21",
    "chapter": "下",
    "duration": 678,
    "published": "2023-02-25",
    "url": "https://www.bilibili.com/video/BV1U24y1J7zo",
    "status": "catalogued",
    "themes": [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ]
  },
  {
    "bvid": "BV1UM4y1R7v9",
    "title": "【下22】爵士和声（下册）——第22集-八分钟彻底掌握升4级半减和弦",
    "episode": "下22",
    "chapter": "下",
    "duration": 508,
    "published": "2023-03-04",
    "url": "https://www.bilibili.com/video/BV1UM4y1R7v9",
    "status": "catalogued",
    "themes": [
      "减七和弦",
      "对称减音阶",
      "半减和弦"
    ]
  },
  {
    "bvid": "BV1mL411d72a",
    "title": "【下23】爱出轨的属和弦/谁说五级只爱一级（爵士和声下册第23集-主属和弦的假解决）",
    "episode": "下23",
    "chapter": "下",
    "duration": 515,
    "published": "2023-03-11",
    "url": "https://www.bilibili.com/video/BV1mL411d72a",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1rk4y187Fc",
    "title": "【下24】10分钟打通现代爵士和声底层逻辑（爵士和声下册第24集-假解决之副属/替代属）",
    "episode": "下24",
    "chapter": "下",
    "duration": 765,
    "published": "2023-03-18",
    "url": "https://www.bilibili.com/video/BV1rk4y187Fc",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1HM4y117KT",
    "title": "【下25】10分钟突破口水歌和声连接、和弦瞬间高级大法——假解决之副属和弦下行小二度（爵士和声下册第25集）",
    "episode": "下25",
    "chapter": "下",
    "duration": 635,
    "published": "2023-04-08",
    "url": "https://www.bilibili.com/video/BV1HM4y117KT",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1SP411m7TS",
    "title": "【下26】「爵士和声」10分钟让你的和弦进行与众不同，三全音替代还能这么玩？——替代属和弦的下行五度假解决（爵士和声下册第26集）",
    "episode": "下26",
    "chapter": "下",
    "duration": 668,
    "published": "2023-04-22",
    "url": "https://www.bilibili.com/video/BV1SP411m7TS",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1PX4y127dk",
    "title": "【下27】和弦进行永不枯寂的终极大法——假解决完结篇 烧脑⚠️慎入！（爵士和声下册27集）",
    "episode": "下27",
    "chapter": "下",
    "duration": 797,
    "published": "2023-05-07",
    "url": "https://www.bilibili.com/video/BV1PX4y127dk",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1TP41197kk",
    "title": "【下28】是属和弦，但是没属功能——《爵士和声》下册第28集",
    "episode": "下28",
    "chapter": "下",
    "duration": 841,
    "published": "2023-05-20",
    "url": "https://www.bilibili.com/video/BV1TP41197kk",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1Vo4y177Ti",
    "title": "【下29】是7级属和弦，但居然不是副属和弦？《爵士和声》下册第29集——没有属功能的属和弦之7级属七",
    "episode": "下29",
    "chapter": "下",
    "duration": 485,
    "published": "2023-06-16",
    "url": "https://www.bilibili.com/video/BV1Vo4y177Ti",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1LX4y1e7Dc",
    "title": "【下30】《爵士和声》下册第30集——没有属功能的属和弦之3级属七",
    "episode": "下30",
    "chapter": "下",
    "duration": 542,
    "published": "2023-07-08",
    "url": "https://www.bilibili.com/video/BV1LX4y1e7Dc",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1J8411S7mu",
    "title": "【下31】Ab7-Cmaj7！拓展和声色彩必学《爵士和声》下册第31集：没有属功能的属和弦之降六级属七",
    "episode": "下31",
    "chapter": "下",
    "duration": 461,
    "published": "2023-07-22",
    "url": "https://www.bilibili.com/video/BV1J8411S7mu",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV12k4y1u7Kf",
    "title": "【下32】D7不一定是重属和弦！拓展和声色彩必学《爵士和声》下册第32集：没有属功能的属和弦之二级属七",
    "episode": "下32",
    "chapter": "下",
    "duration": 520,
    "published": "2023-08-03",
    "url": "https://www.bilibili.com/video/BV12k4y1u7Kf",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1Am4y1H74w",
    "title": "【下33】没有属功能的属和弦完结撒花+单元总复习——A7/Eb7/Gb7《爵士和声》下册第33集",
    "episode": "下33",
    "chapter": "下",
    "duration": 521,
    "published": "2023-08-18",
    "url": "https://www.bilibili.com/video/BV1Am4y1H74w",
    "status": "catalogued",
    "themes": [
      "假解决",
      "无功能属和弦"
    ]
  },
  {
    "bvid": "BV1vu411P7zS",
    "title": "【下34】「爵士和声」模进大法好！无功能和声之相邻属和弦——《爵士和声》下册第34集",
    "episode": "下34",
    "chapter": "下",
    "duration": 801,
    "published": "2023-09-02",
    "url": "https://www.bilibili.com/video/BV1vu411P7zS",
    "status": "read",
    "themes": [
      "相邻属和弦",
      "无功能和声"
    ],
    "usedIn": [
      "non-functional-dominants"
    ],
    "takeaway": "相邻属和弦连续上行，最后解决形成渐进转调。",
    "readAt": "2026-10-24"
  },
  {
    "bvid": "BV1H34y1P7s4",
    "title": "【下35】「爵士和声」转调大法 开篇绪论！——《爵士和声》下册第35集",
    "episode": "下35",
    "chapter": "下",
    "duration": 771,
    "published": "2023-09-15",
    "url": "https://www.bilibili.com/video/BV1H34y1P7s4",
    "status": "catalogued",
    "themes": [
      "转调"
    ]
  },
  {
    "bvid": "BV1nh4y1h74v",
    "title": "【下36】转调大法 第一招*直接转调！《爵士和声》下册第36集",
    "episode": "下36",
    "chapter": "下",
    "duration": 667,
    "published": "2023-09-30",
    "url": "https://www.bilibili.com/video/BV1nh4y1h74v",
    "status": "catalogued",
    "themes": [
      "转调"
    ]
  },
  {
    "bvid": "BV17u411M7NP",
    "title": "【下37】转调绝招-有缘者看（爵士和声下37集-转调之支点和弦/属和弦）",
    "episode": "下37",
    "chapter": "下",
    "duration": 757,
    "published": "2023-10-06",
    "url": "https://www.bilibili.com/video/BV17u411M7NP",
    "status": "catalogued",
    "themes": [
      "转调"
    ]
  },
  {
    "bvid": "BV1eG411y7Hw",
    "title": "【下38】转调终章-渐进式转调（爵士和声下38集）",
    "episode": "下38",
    "chapter": "下",
    "duration": 518,
    "published": "2023-10-21",
    "url": "https://www.bilibili.com/video/BV1eG411y7Hw",
    "status": "catalogued",
    "themes": [
      "转调"
    ]
  },
  {
    "bvid": "BV1jj411e7ni",
    "title": "【下39】高阶调式转换和弦-打破套路坐拥无限灵感（爵士和声下39集）",
    "episode": "下39",
    "chapter": "下",
    "duration": 909,
    "published": "2023-10-28",
    "url": "https://www.bilibili.com/video/BV1jj411e7ni",
    "status": "catalogued",
    "themes": [
      "调式互换",
      "高阶调式转换"
    ]
  },
  {
    "bvid": "BV16G411X7N3",
    "title": "【下40】高阶调式转换和弦-大转小/大转大【PS：大胆使用洛克利亚调式和弦吧】！（爵士和声下40集）",
    "episode": "下40",
    "chapter": "下",
    "duration": 594,
    "published": "2023-11-04",
    "url": "https://www.bilibili.com/video/BV16G411X7N3",
    "status": "catalogued",
    "themes": [
      "调式互换",
      "高阶调式转换"
    ]
  },
  {
    "bvid": "BV1tu4y1N73a",
    "title": "【下41】小调调式转换和弦-小转小/小转大！（爵士和声下41集）",
    "episode": "下41",
    "chapter": "下",
    "duration": 456,
    "published": "2023-11-11",
    "url": "https://www.bilibili.com/video/BV1tu4y1N73a",
    "status": "catalogued",
    "themes": [
      "调式互换",
      "高阶调式转换"
    ]
  },
  {
    "bvid": "BV1Cb4y1M7Nc",
    "title": "【下42】调式转换和弦中音阶的选择（爵士和声下42集）",
    "episode": "下42",
    "chapter": "下",
    "duration": 618,
    "published": "2023-11-18",
    "url": "https://www.bilibili.com/video/BV1Cb4y1M7Nc",
    "status": "catalogued",
    "themes": [
      "调式互换",
      "高阶调式转换"
    ]
  },
  {
    "bvid": "BV1UC4y117eq",
    "title": "【下43】以不变应万变「持续底音&固定音型」（爵士和声下册 43集）",
    "episode": "下43",
    "chapter": "下",
    "duration": 478,
    "published": "2023-11-25",
    "url": "https://www.bilibili.com/video/BV1UC4y117eq",
    "status": "catalogued",
    "themes": [
      "持续低音",
      "固定音型"
    ]
  },
  {
    "bvid": "BV12b4y1L7Br",
    "title": "【下44】原来披头士这多年前就开始用调式写歌了！【擒贼先擒王之-调式特征音】（爵士和声下册 44集）",
    "episode": "下44",
    "chapter": "下",
    "duration": 1003,
    "published": "2023-12-09",
    "url": "https://www.bilibili.com/video/BV12b4y1L7Br",
    "status": "read",
    "themes": [
      "调式特征音"
    ],
    "usedIn": [
      "modal-characteristics",
      "modal-interchange"
    ],
    "takeaway": "调式音乐没有完整 TSD；含特征音的和弦可作调式终止，避免三全音和弦。",
    "readAt": "2026-10-24"
  },
  {
    "bvid": "BV1QN4y1h74P",
    "title": "【下45】Lydian！原神味大料？【Lydian调式和声一站通】（爵士和声下册 45集）",
    "episode": "下45",
    "chapter": "下",
    "duration": 656,
    "published": "2023-12-16",
    "url": "https://www.bilibili.com/video/BV1QN4y1h74P",
    "status": "read",
    "themes": [
      "Lydian"
    ],
    "usedIn": [
      "modal-characteristics"
    ],
    "takeaway": "Lydian 的特征音是 #4；II 大与 vii 小可作调式终止。",
    "readAt": "2026-10-24"
  },
  {
    "bvid": "BV1cw41157UD",
    "title": "【下46】Mixolydian调式和声一站通（爵士和声下册 46集）",
    "episode": "下46",
    "chapter": "下",
    "duration": 622,
    "published": "2023-12-23",
    "url": "https://www.bilibili.com/video/BV1cw41157UD",
    "status": "catalogued",
    "themes": [
      "Mixolydian"
    ]
  },
  {
    "bvid": "BV1fi4y16718",
    "title": "【下47】多利亚Dorian 调式和声完整攻略-内附爵士/流行/Funk案例应有尽有...（爵士和声下册 47集）",
    "episode": "下47",
    "chapter": "下",
    "duration": 591,
    "published": "2023-12-30",
    "url": "https://www.bilibili.com/video/BV1fi4y16718",
    "status": "catalogued",
    "themes": [
      "Dorian"
    ]
  },
  {
    "bvid": "BV1ac411t7Y4",
    "title": "【下48】弗里吉亚Phrygian调式和声完整攻略-内附配乐/流行/民族案例应有尽有...（爵士和声下册 48集）",
    "episode": "下48",
    "chapter": "下",
    "duration": 638,
    "published": "2024-01-06",
    "url": "https://www.bilibili.com/video/BV1ac411t7Y4",
    "status": "catalogued",
    "themes": [
      "Phrygian"
    ]
  },
  {
    "bvid": "BV1Dc411x7Kq",
    "title": "【下49】爱奥尼亚Aeolian调式和声完整攻略&再谈调式和声避免和弦——爵士和声下册 49集",
    "episode": "下49",
    "chapter": "下",
    "duration": 661,
    "published": "2024-01-13",
    "url": "https://www.bilibili.com/video/BV1Dc411x7Kq",
    "status": "catalogued",
    "themes": [
      "Aeolian"
    ]
  },
  {
    "bvid": "BV1Ba4y1C7S4",
    "title": "【下50】现代和声利器——四度和声/四度排列——爵士和声下册 50集",
    "episode": "下50",
    "chapter": "下",
    "duration": 728,
    "published": "2024-01-27",
    "url": "https://www.bilibili.com/video/BV1Ba4y1C7S4",
    "status": "read",
    "themes": [
      "四度和声"
    ],
    "usedIn": [
      "quartal-harmony"
    ],
    "takeaway": "四度叠置弱化大小性质，低音保持主音；So What 排列以四度为主。",
    "readAt": "2026-10-24"
  },
  {
    "bvid": "BV174421F7bb",
    "title": "【下51】和弦也能混合？高叠和弦的秘密！——转位和弦/混合和弦/复合和弦/斜杠和弦爵士和声下册51集",
    "episode": "下51",
    "chapter": "下",
    "duration": 693,
    "published": "2024-02-16",
    "url": "https://www.bilibili.com/video/BV174421F7bb",
    "status": "read",
    "themes": [
      "混合和弦",
      "复合和弦",
      "斜杠和弦"
    ],
    "usedIn": [
      "hybrid-chords"
    ],
    "takeaway": "斜杠分转位、混合、复合；低音定功能，上层定颜色。",
    "readAt": "2026-10-24"
  },
  {
    "bvid": "BV1eF4m157WP",
    "title": "【下52】爵士和声大结局-固定结构/无功能和声初探",
    "episode": "下52",
    "chapter": "下",
    "duration": 397,
    "published": "2024-02-24",
    "url": "https://www.bilibili.com/video/BV1eF4m157WP",
    "status": "read",
    "themes": [
      "固定结构",
      "无功能和声"
    ],
    "usedIn": [
      "constant-structure",
      "non-functional-dominants"
    ],
    "takeaway": "固定结构可平移到有功能或无功能终点；平行色彩带削弱倾向解决。",
    "readAt": "2026-10-24"
  }
];

export const BILIBILI_VIDEO_COUNT = BILIBILI_VIDEOS.length;
export const BILIBILI_READ_COUNT = BILIBILI_VIDEOS.filter((video) => video.status === "read").length;
export const getBilibiliVideo = (bvid: string): BilibiliVideo | undefined =>
  BILIBILI_VIDEOS.find((video) => video.bvid === bvid);
