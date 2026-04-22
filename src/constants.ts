/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scene, Evidence, Suspect } from './types';

export const AUDIO_ASSETS = {
  rain: 'https://cdn.pixabay.com/audio/2021/08/09/audio_88444c8038.mp3', // Rain on window
  clock: 'https://cdn.pixabay.com/audio/2021/11/25/audio_e19623e590.mp3', // Old clock ticking
  footsteps: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c1c4e976db.mp3', // Footsteps on wood
  typing: 'https://cdn.pixabay.com/audio/2022/03/15/audio_6f7f6f1f4d.mp3', // Typewriter sound
  pageTurn: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a1b6a67a.mp3', // Paper sound
};

export const INITIAL_SCENES: Record<string, Scene> = {
  'start': {
    id: 'start',
    title: '雨夜的侦探社 (The Rain-Slicked Agency)',
    text: '雨水敲打着百叶窗。桌上的烟灰缸里，一支香烟仍在燃烧。你手里紧紧握着那封没有署名的信：\"他们说你什么都能查清楚。来码头见我，如果你想知道真相。\"',
    imageUrl: 'https://images.unsplash.com/photo-1543336710-86367372132e?q=80&w=2000&auto=format&fit=crop',
    hotspots: [
      { id: 'h1', x: 45, y: 65, radius: 40, label: '检查烟灰缸 (Check Ashtray)', discoveryEvidenceId: 'cigar_1' },
      { id: 'h2', x: 70, y: 75, radius: 40, label: '查看抽屉 (Look at Drawer)', targetSceneId: 'drawer_examine' }
    ],
    choices: [
      { id: 'c1', text: '拿起大衣去码头 (Go to the docks)', targetSceneId: 'docks_path' },
      { id: 'c2', text: '先仔细检查这封信 (Examine the letter)', targetSceneId: 'examine_letter' }
    ]
  },
  'drawer_examine': {
    id: 'drawer_examine',
    title: '生锈的抽屉 (A Rusty Drawer)',
    text: '抽屉里除了一些发黄的旧卷宗，还有一把没上弹的手枪。看来你最近确实得罪了不少人。',
    choices: [
      { id: 'back', text: '回到桌前 (Return to desk)', targetSceneId: 'start' }
    ]
  },
  'examine_letter': {
    id: 'examine_letter',
    title: '一封无名信 (An Anonymous Letter)',
    text: '信纸是高级的亚麻纸，带着一股淡雅的檀香。在信封的背面，你发现了一个模糊的紫色印记——那是只有西城那家昂贵酒馆才会使用的火漆印。',
    choices: [
      { id: 'c3', text: '前往西城酒馆 (Go to the Midtown Bar)', targetSceneId: 'bar_path' },
      { id: 'c4', text: '还是去码头看看 (Head to the docks instead)', targetSceneId: 'docks_path' }
    ]
  },
  'docks_path': {
    id: 'docks_path',
    title: '12号仓库 (Warehouse No. 12)',
    text: '码头的空气混合着鱼腥味和铁锈气息。12号仓库的大门半开着，里面漆黑一片，却传来了微弱的脚步声。',
    imageUrl: 'https://images.unsplash.com/photo-1516053153503-4554f67c2957?q=80&w=2000&auto=format&fit=crop',
    choices: [
      { id: 'c5', text: '悄悄潜入 (Sneak in)', targetSceneId: 'sneak_in' },
      { id: 'c6', text: '大声询问 (Call out)', targetSceneId: 'call_out' }
    ]
  },
  'sneak_in': {
    id: 'sneak_in',
    title: '幽灵般的潜行 (Shadowy Entry)',
    text: '你像猫一样悄无声息地溜进仓库。在堆放的板条箱阴影下，你看到一个戴着宽檐帽的男人正在焦急地翻找着什么。他的手边放着一个密封的金属盒。',
    imageUrl: 'https://images.unsplash.com/photo-1549445980-f2038933b49e?q=80&w=2000',
    hotspots: [
      { id: 'crate_hot', x: 60, y: 70, radius: 50, label: '检查侧面标签 (Check Label)', discoveryEvidenceId: 'manifest_1' }
    ],
    choices: [
      { id: 'c7', text: '继续走近观察 (Get closer)', targetSceneId: 'closer_look' },
      { id: 'c8', text: '制造声响引诱他 (Create a distraction)', targetSceneId: 'distraction_scene' }
    ]
  },
  'bar_path': {
    id: 'bar_path',
    title: '西城酒馆 (The Midtown Bar)',
    text: '酒馆里的爵士乐慵懒地流淌着。梅夫正斜靠在吧台后，慢条斯理地擦拭着一只玻璃杯。看到你进来，她挑了挑眉，“我就知道你会来。你是为了那个信件，还是为了那个不见的人？”',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000',
    choices: [
      { id: 'c9', text: '询问最近的常客 (Ask about regulars)', targetSceneId: 'ask_regulars' },
      { id: 'c10', text: '回到码头 (Back to docks)', targetSceneId: 'docks_path' }
    ]
  },
  'ask_regulars': {
    id: 'ask_regulars',
    title: '梅夫的消息 (Maeve\'s Intel)',
    text: '梅夫盯着你看了看，沉默良久。“最近有个面生的人，一直守在12号仓库附近。他总是在找一个姓史密斯的人。但那家人已经在三年前的那场火灾中‘消失’了。”',
    choices: [
      { id: 'c11', text: '追问火灾的真相 (Ask about the fire)', targetSceneId: 'fire_truth' },
      { id: 'c12', text: '前往码头调查 (Go to the docks)', targetSceneId: 'docks_path' }
    ]
  },
  'fire_truth': {
    id: 'fire_truth',
    title: '消失的火光 (Vanished Flames)',
    text: '梅夫点燃了一根烟，缓缓吐出一个烟圈。“那场火烧得太干净了。干净得让人怀疑。如果你想查，去12号仓库看看，有些人觉得那是灰烬重燃的地方。”',
    choices: [
      { id: 'c13', text: '前往仓库 (Go to the Warehouse)', targetSceneId: 'docks_path' }
    ]
  },
  'closer_look': {
    id: 'closer_look',
    title: '身份揭露 (Identity Revealed)',
    text: '你终于看清了他的脸。是那个发信人！但他现在的样子极其惊恐。他把金属盒塞进怀里正准备离开，却突然停在了原地，因为他看到了地上的影子。',
    choices: [
      { id: 'confront', text: '叫住他 (Confront him)', targetSceneId: 'start' }
    ]
  },
  'distraction_scene': {
    id: 'distraction_scene',
    title: '调虎离山 (The Distraction)',
    text: '你推倒了一叠空的金属桶。沉重的撞击声在仓库里回荡。男人被吓了一跳，扔下手中的东西向仓库深处跑去。你趁机冲向那个他刚才翻找的板条箱。',
    choices: [
      { id: 'check_crate', text: '搜查板条箱 (Search the crate)', targetSceneId: 'sneak_in' }
    ]
  },
  'call_out': {
    id: 'call_out',
    title: '打草惊蛇 (A Bold Move)',
    text: '“站住！别动！”你大声喝道。仓库深处的身影猛地一颤，随即仓库里响起了急促的脚步声。当你冲进门时，只看到一个翻倒的箱子和空荡荡的后门。',
    choices: [
      { id: 'chase', text: '追上去 (Chase them)', targetSceneId: 'docks_path' }
    ]
  }
};

export const INITIAL_EVIDENCE: Evidence[] = [
  {
    id: 'letter_1',
    name: '神秘信件',
    description: '一封装在昂贵亚麻纸里的邀请函，背后有西城酒吧的火漆。信中字迹娟秀但显得有些急促，似乎是在极度紧张的情况下写就的。',
    dateFound: '2026-04-22',
    type: 'document',
    imageUrl: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=1000'
  },
  {
    id: 'cigar_1',
    name: '燃烧的雪茄',
    description: '这种昂贵的进口雪茄在本地很难买到。顶端的灰烬还很新鲜，散发着一股独特的黑巧克力和松木的气味。只有西城的几个大亨才抽得起这种货色。',
    dateFound: '2026-04-22',
    type: 'object',
    imageUrl: 'https://images.unsplash.com/photo-1541604193435-225878996233?q=80&w=1000'
  },
  {
    id: 'manifest_1',
    name: '旧货运清单',
    description: '上面记录了一些看似普通的化学试剂，但收货地址却是那个已经废弃三年的实验室。',
    dateFound: '2026-04-22',
    type: 'document',
    imageUrl: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=1000'
  }
];

export const INITIAL_SUSPECTS: Suspect[] = [
  {
    id: 'unknown_informant',
    name: '无名线人',
    role: '发信人',
    bio: '身份不明。唯一的线索是他们知道你处理棘手案件的能力。可能会引导你走向光明，也可能是个陷阱。',
    status: 'unknown',
    relatedCases: [
      { id: 'CASE_042', description: '银色怀表失踪案 - 提供过模糊线索' },
      { id: 'CASE_089', description: '码头走私疑云 - 曾在现场附近出现' }
    ]
  },
  {
    id: 'bar_owner',
    name: '梅夫 (Maeve)',
    role: '西城酒馆老板',
    bio: '在这一行混了二十年的女人。她知道这座城市每个肮脏的秘密，只要你的钱给够，或者你够讨她喜欢。',
    status: 'suspicious',
    relatedCases: []
  }
];
