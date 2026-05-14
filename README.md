# CET-6 Pop Culture Vocabulary Card Viewer

一个本地运行的 CET-6 个性化单词卡展示前端。它只负责读取已经生成好的 JSON 单词卡数据，并以清晰、美观、方便复习的方式展示。

它不会联网检索内容，不会调用 AI，不会生成词源或台词。真实语境、主题联想、词源、复习问题等内容都来自你放入 `public/data/` 的 JSON 文件。

## 环境要求

先安装 Node.js LTS：

https://nodejs.org

安装后确认命令可用：

```bash
node -v
npm -v
```

## 一键启动

### Windows

Windows 用户双击：

```text
start-windows.bat
```

它会自动：

1. 进入项目目录
2. 检查是否安装了 `npm`
3. 首次运行时执行 `npm install`
4. 启动 Vite 本地前端
5. 自动打开 `http://localhost:5173`

如果双击 `.bat` 被系统策略拦截，可以右键选择“以管理员身份运行”，或者在 PowerShell 中运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-windows.ps1
```

### macOS

macOS 用户双击：

```text
一键启动.command
```

如果系统提示没有执行权限，在终端运行一次：

```bash
chmod +x 一键启动.command start.sh
```

然后再双击 `一键启动.command`。

### 手动启动

所有系统也都可以手动运行：

```bash
npm install
npm run dev
```

浏览器访问：

```text
http://localhost:5173
```

## 数据文件放在哪里

把词汇卡 JSON 文件放入：

```text
public/data/
```

例如：

```text
public/data/page1.json
public/data/page2.json
public/data/movie_context_cards.json
```

启动时程序会自动扫描：

```text
public/data/*.json
```

并自动生成：

```text
public/data/card-files.json
```

每个 JSON 文件会成为一个分类，分类名默认由文件名生成。你通常不需要手动编辑 `card-files.json`。

## JSON 数据格式

支持数组格式：

```json
[
  {
    "word": "block",
    "lemma": "block",
    "phonetic": "/blɑːk/",
    "pos": ["noun", "verb"],
    "cet6_meaning_cn": ["阻塞", "障碍物", "阻挡"],
    "core_meaning_en": "to stop movement or progress; an obstacle",
    "status": "A",
    "etymology": {
      "summary": "Originally referring to a solid piece of wood.",
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
    "common_collocations": ["block the road", "block access", "mental block"],
    "corpus_matches": [
      {
        "match_id": "demo_block_0001",
        "matched_text": "block",
        "match_type": "exact",
        "work_id": "demo_arcane",
        "title": "Demo Arcane-like Text",
        "tier": 1,
        "medium": "sample",
        "location": {
          "season": 1,
          "episode": 1,
          "timestamp": "00:00:12"
        },
        "quote": "And you still block with your face.",
        "context_before": "",
        "context_after": "We have to move before they find us.",
        "speaker": "unknown",
        "sense_match_score": 5,
        "context_quality_score": 4,
        "final_score": 9.5,
        "note": "Demo quote for UI testing."
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
]
```

也支持外层对象格式：

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

字段缺失时页面不会崩溃，会显示“暂无数据”。

## 支持字段

主要字段：

- `word`
- `lemma`
- `phonetic` 或 `ipa`
- `phonetics.us` / `phonetics.uk`
- `pos`
- `cet6_meaning_cn`
- `core_meaning_en`
- `status`: `"A" | "B" | "C"`
- `etymology`
- `word_family`
- `common_collocations`
- `corpus_matches`
- `theme_association`
- `memory_anchor`
- `review_prompts`
- `needs_human_review`
- `accepted`

音标字段示例：

```json
{
  "word": "initially",
  "phonetic": "/ɪˈnɪʃəli/"
}
```

或：

```json
{
  "word": "initially",
  "phonetics": {
    "us": "/ɪˈnɪʃəli/",
    "uk": "/ɪˈnɪʃəli/"
  }
}
```

## 卡片状态

- A 类：真实白名单语境卡，通常有 `corpus_matches`
- B 类：主题联想卡，通常有 `theme_association`，必须标注“非原台词，仅为主题联想”
- C 类：结构记忆卡，主要依靠词源、词族、搭配和复习问题

## 功能

- 按 JSON 文件自动分类
- A/B/C 状态筛选
- 单词搜索
- 详细卡片视图
- 总览方格视图
- 上一张 / 下一张 / 随机一张
- 标记已掌握 / 收藏 / 待复习
- 学习状态保存到浏览器 `localStorage`
- 支持暗色模式

## 快捷键

- `←`：上一张
- `→`：下一张
- `Space`：下一张
- `F`：收藏 / 取消收藏
- `M`：已掌握 / 取消已掌握
- `R`：待复习 / 取消待复习

## 本地学习状态

每张卡片会以 `word + lemma + index` 作为 key 保存学习状态：

```json
{
  "word": "block",
  "mastered": false,
  "favorite": true,
  "review": true,
  "lastViewedAt": "2026-05-12T..."
}
```

状态保存在当前浏览器的 `localStorage`。刷新页面不会丢失，清空浏览器站点数据会删除这些状态。

## 当前限制

- 只读取本地 `public/data/*.json`
- 不提供后端数据库
- 不生成单词卡内容
- 不校验台词版权或真实性
- 学习状态只保存在当前浏览器
