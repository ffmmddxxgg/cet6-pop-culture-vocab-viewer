# CET-6 Pop Culture Vocabulary Card Viewer

一个本地运行的 CET-6 个性化单词卡展示前端。

这个项目的定位很明确：**只负责展示已经生成好的词汇卡 JSON 数据**。它不生成词卡、不联网搜索、不调用 AI、不爬取字幕、不读取 PDF，也不做 NLP 匹配。你可以把它理解成一个“本地词汇资料浏览器”：外部脚本或 AI 负责生产数据，本项目负责把这些数据用更适合复习的方式展示出来。

![CET-6 Pop Culture Vocabulary Card Viewer 效果演示](docs/demo-screenshot.svg)

> 如果上方图片没有显示，请确认仓库中存在 `docs/demo-screenshot.svg`。

## 项目特点

- 本地读取 `public/data/` 下的 JSON 词卡文件
- 自动扫描多个 JSON 文件，并按文件生成分类
- 支持 A / B / C 三类卡片筛选
- 支持搜索单词、lemma、中文释义、英文核心义、台词、搭配和作品名
- 支持详细卡片视图和总览方格视图
- 支持上一张、下一张、随机一张
- 支持本地学习状态：已掌握、待复习、收藏
- 学习状态保存在浏览器 `localStorage`
- 支持音标字段显示
- 支持 macOS 和 Windows 一键启动

## 重要说明：本项目不生产数据

本项目不会判断词源是否正确，不会自动保证台词来源合法，也不会验证影视台词版权。所有词汇卡、真实语境、主题联想、词源、搭配和复习问题都应由你自己的数据生成流程提供。

本项目只做这件事：

```text
读取本地 JSON 词卡数据 -> 展示 -> 筛选 -> 翻页 -> 保存学习状态
```

## 关于 page1 到 page30 数据

当前仓库中的 `public/data/page1.json` 到 `public/data/page30.json` 是一组已经生成好的 CET-6 词汇卡资料。

这组资料是基于我个人整理的影视 / 剧集 / 游戏 / 歌曲等资源片库，以及相应的白名单语料生成的六级词汇学习资料。它们不是官方 CET-6 数据集，也不是通用公开语料库。其主要用途是服务一种更个人化的记忆方式：把六级词汇和熟悉的影视语境、情绪主题、角色场景、词源结构连接起来。

如果你使用自己的词库，可以直接替换或新增 `public/data/*.json` 文件。

## A / B / C 卡片是什么意思

每张词卡都有一个 `status` 字段：

```json
{
  "word": "block",
  "status": "A"
}
```

### A 类：真实白名单语境卡

A 类卡片表示这个词在白名单作品语料中找到了真实出现的语境。

通常这类卡片会有：

- `corpus_matches`
- 真实 quote
- 作品 title
- tier
- medium
- speaker
- timestamp 或 season / episode
- match_type
- final_score

示例：

```json
{
  "status": "A",
  "corpus_matches": [
    {
      "title": "Arcane",
      "quote": "And you still block with your face.",
      "match_type": "exact",
      "tier": 1,
      "final_score": 9.5
    }
  ]
}
```

这里的“真实”指的是：这条语境应该来自你本地白名单语料文件，而不是由本项目生成。本 Viewer 不负责生成或伪造台词。

### B 类：主题联想卡

B 类卡片表示没有足够好的真实白名单台词，或者真实语境不足，但这个词和某个作品的主题、角色、情绪、世界观高度相关。

B 类可以包含 `theme_association`，并且必须明确标注：

```text
非原台词，仅为主题联想。
```

示例：

```json
{
  "status": "B",
  "corpus_matches": [],
  "theme_association": {
    "title": "Death Stranding",
    "is_original_quote": false,
    "disclaimer": "非原台词，仅为主题联想。",
    "association": "optimum 可以和路线规划、负重、体力管理中的最优选择联系起来。",
    "example_sentence": "Sam needs to find the optimum route across dangerous terrain.",
    "emotion_tags": ["survival", "isolation", "optimization"]
  }
}
```

注意：`theme_association.example_sentence` 不是原台词，不能放进 `corpus_matches`。

### C 类：结构记忆卡

C 类卡片表示没有真实语境，也没有强主题联想，主要靠词源、词族、搭配、易混点和复习问题来记忆。

通常这类卡片会重点展示：

- `etymology`
- `word_family`
- `common_collocations`
- `memory_anchor`
- `review_prompts`

示例：

```json
{
  "word": "initially",
  "status": "C",
  "etymology": {
    "summary": "From initial, meaning 'at the beginning', plus the adverb suffix -ly.",
    "root": "initial",
    "suffix": "-ly",
    "confidence": "medium"
  }
}
```

## 安装方法

确认电脑已经安装 Node.js。推荐 Node.js 18 或更高版本。

进入项目目录后运行：

```bash
npm install
```

## 启动方法

### macOS 一键启动

双击：

```text
一键启动.command
```

如果 macOS 提示没有执行权限，在终端运行一次：

```bash
chmod +x 一键启动.command start.sh
```

然后再次双击 `一键启动.command`。

### Windows 一键启动

双击：

```text
start-windows.bat
```

如果浏览器没有自动打开，可以手动访问：

```text
http://127.0.0.1:5173
```

运行时会出现一个命令行窗口，请保持它打开。关闭这个窗口，本地网页服务也会停止。

### 手动启动

macOS、Windows、Linux 都可以使用：

```bash
npm run dev
```

然后访问终端里显示的本地地址，通常是：

```text
http://127.0.0.1:5173
```

## 数据放在哪里

把词卡 JSON 文件放入：

```text
public/data/
```

例如：

```text
public/data/page1.json
public/data/page2.json
public/data/page3.json
public/data/my_movie_vocab.json
public/data/cet6_custom_cards.json
```

启动时项目会自动扫描 `public/data/*.json`，并生成：

```text
public/data/card-files.json
```

这个文件是程序使用的分类清单，通常不需要你手动维护。

## JSON 文件格式

每个 JSON 文件可以放一个分类下的多个单词。推荐使用数组格式：

```json
[
  {
    "word": "block",
    "lemma": "block",
    "pos": ["noun", "verb"],
    "phonetics": {
      "us": "/blɑːk/",
      "uk": "/blɒk/"
    },
    "cet6_meaning_cn": ["阻塞", "障碍物", "阻挡"],
    "core_meaning_en": "to stop movement or progress; an obstacle",
    "status": "A"
  },
  {
    "word": "initially",
    "lemma": "initially",
    "pos": ["adverb"],
    "phonetic": "/ɪˈnɪʃəli/",
    "cet6_meaning_cn": ["最初", "起初", "开始时"],
    "core_meaning_en": "at the beginning; at first",
    "status": "C"
  }
]
```

也兼容外层对象格式：

```json
{
  "cards": [
    {
      "word": "block",
      "status": "A"
    }
  ]
}
```

## 完整字段示例

```json
{
  "word": "block",
  "lemma": "block",
  "pos": ["noun", "verb"],
  "phonetics": {
    "us": "/blɑːk/",
    "uk": "/blɒk/"
  },
  "cet6_meaning_cn": ["阻塞", "障碍物", "阻挡"],
  "core_meaning_en": "to stop movement or progress; an obstacle",
  "status": "A",
  "etymology": {
    "summary": "Originally referring to a solid piece of wood; later extended to mean an obstacle.",
    "prefix": null,
    "root": "block",
    "suffix": null,
    "confidence": "medium"
  },
  "word_family": [
    {
      "word": "blockage",
      "relation": "noun derivative",
      "meaning": "a state of being blocked"
    }
  ],
  "common_collocations": [
    "block the road",
    "block access",
    "mental block"
  ],
  "corpus_matches": [
    {
      "match_id": "arcane_s1e07_0001",
      "matched_text": "block",
      "match_type": "exact",
      "work_id": "arcane_s1e07",
      "title": "Arcane",
      "tier": 1,
      "medium": "series",
      "location": {
        "season": 1,
        "episode": 7,
        "timestamp": "optional if available"
      },
      "quote": "And you still block with your face.",
      "context_before": "",
      "context_after": "",
      "speaker": "unknown",
      "sense_match_score": 5,
      "context_quality_score": 4,
      "final_score": 9.5,
      "note": "Good visual and emotional anchor for block = stop / defend."
    }
  ],
  "theme_association": null,
  "memory_anchor": {
    "one_sentence": "block 的底层画面是一块硬东西挡住路。",
    "visual_scene": "Someone physically blocking a path or attack.",
    "emotion_tags": ["obstacle", "defense", "conflict"]
  },
  "review_prompts": [
    {
      "type": "meaning_recall",
      "question": "block 作动词时是什么意思？",
      "answer": "阻挡，阻塞，妨碍"
    }
  ],
  "needs_human_review": true,
  "human_review_status": "pending",
  "human_notes": "",
  "accepted": false
}
```

字段缺失时页面不会崩溃，会显示“暂无数据”。

## 支持的常用字段

- `word`：单词
- `lemma`：词元
- `phonetic` / `ipa`：单个音标字段
- `phonetics.us` / `phonetics.uk`：美式 / 英式音标
- `pos`：词性，可以是数组或字符串
- `cet6_meaning_cn`：六级中文释义，可以是数组或字符串
- `core_meaning_en`：英文核心义
- `status`：`"A"`、`"B"`、`"C"`
- `etymology`：词源和构词信息
- `word_family`：词族网络
- `common_collocations`：常见搭配
- `corpus_matches`：真实白名单语境
- `theme_association`：主题联想
- `memory_anchor`：记忆锚点
- `review_prompts`：复习问题
- `needs_human_review`：是否需要人工审核
- `accepted`：是否已接受

## 白名单真实语境字段

真实语境统一放在 `corpus_matches` 中。

```json
{
  "corpus_matches": [
    {
      "title": "Arcane",
      "quote": "And you still block with your face.",
      "tier": 1,
      "medium": "series",
      "speaker": "unknown",
      "match_type": "exact",
      "final_score": 9.5
    }
  ]
}
```

建议约定：

- `corpus_matches` 只放真实白名单语料中的句子
- 不要把 AI 生成句子放进 `corpus_matches`
- 如果没有真实语境，使用空数组或省略该字段
- 如果是 B 类主题联想，把内容放进 `theme_association`

## 主题联想字段

主题联想统一放在 `theme_association` 中。

```json
{
  "theme_association": {
    "title": "Death Stranding",
    "is_original_quote": false,
    "disclaimer": "非原台词，仅为主题联想。",
    "association": "optimum 可以和路线规划、负重、体力管理中的最优选择联系起来。",
    "example_sentence": "Sam needs to find the optimum route across dangerous terrain.",
    "emotion_tags": ["survival", "isolation", "optimization"]
  }
}
```

为了避免混淆，建议始终保留：

```json
{
  "is_original_quote": false,
  "disclaimer": "非原台词，仅为主题联想。"
}
```

## 使用界面

页面顶部包含：

- 当前卡片进度
- 总卡片数
- 筛选后数量
- A / B / C 数量
- 已掌握数量
- 收藏数量
- 待复习数量
- 分类数量

工具栏包含：

- 搜索框
- 分类选择
- A / B / C 状态筛选
- All / Mastered / Favorite / Review 学习状态筛选
- 随机一张
- 总览 / 详情切换

详细卡片会展示：

- 单词、lemma、词性、音标
- CET-6 中文义和英文核心义
- 词源
- 词族网络
- 常见搭配
- 白名单真实语境
- 主题联想
- 记忆锚点
- 复习问题

总览模式会把当前筛选结果中的所有词汇显示成方格，适合快速定位单词。点击任意单词会回到该词的详细卡片。

## 快捷键

- `←`：上一张
- `→`：下一张
- `Space`：下一张
- `F`：收藏 / 取消收藏
- `M`：已掌握 / 取消已掌握
- `R`：待复习 / 取消待复习

## 本地学习状态

学习状态保存在浏览器 `localStorage`，不会写回 JSON 文件。

每张卡片大致使用 `word + lemma + index` 作为 key：

```json
{
  "word": "block",
  "mastered": false,
  "favorite": true,
  "review": true,
  "lastViewedAt": "2026-05-12T10:00:00.000Z"
}
```

刷新页面后状态仍然保留。清空浏览器站点数据、更换浏览器或更换域名端口，可能会导致学习状态不可见。

## 常见问题

### 为什么启动时会生成 card-files.json？

因为浏览器无法直接枚举 `public/data/` 目录，所以项目在 `npm run dev` 前会运行：

```bash
node scripts/generate-card-manifest.mjs
```

它会扫描所有 JSON 文件并生成 `card-files.json`，前端再根据这个清单加载词卡。

### 一个 JSON 可以放多个单词吗？

可以。推荐一个 JSON 文件放一个分类下的多个单词，例如 `page1.json`、`page2.json`。

### 可以放 JSONL 吗？

当前推荐并默认支持 JSON，不推荐 JSONL。请使用数组格式或 `{ "cards": [...] }` 格式。

### 为什么本地打开也需要等待？

如果数据文件较多或较大，首次加载需要读取并解析多个 JSON 文件。当前 `page1` 到 `page30` 合计数据量较大，所以第一次加载会有短暂等待。后续可扩展为分页加载、懒加载或索引缓存。

### 为什么页面里说“真实语境”，但 README 又说不保证版权？

“真实语境”只表示数据字段设计上用于存放来自本地白名单语料的原句。本项目本身不提供版权保证，也不负责判断你的语料是否合法。你需要自行确保语料来源和使用方式合规。

## 当前限制

- 不联网
- 不调用 AI
- 不生成词卡
- 不自动校验词源
- 不自动校验台词真伪
- 不校验版权来源
- 不提供后端数据库
- 学习状态只保存在当前浏览器
- 大体量 JSON 首次加载可能需要等待

## 后续可扩展方向

- 分页加载大型词库
- 学习状态导入 / 导出
- PWA 离线安装
- Anki 导出
- 更细的复习计划
- 词卡背面模式
- 多套主题
- 统计学习时长和复习次数
