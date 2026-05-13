# CET-6 Pop Culture Vocabulary Card Viewer

一个本地运行的 CET-6 个性化单词卡展示前端。它只负责读取已经生成好的 `cards.json`，并以清晰、美观、方便复习的方式展示。

它不会联网，不会调用 AI，不会检索字幕，不会生成词源或台词。

当前 Viewer 的入口是 `index.html`、`package.json` 和 `src/**/*.tsx`。如果目录中残留旧版 Python 原型文件，它们不参与前端运行。

## 安装

```bash
npm install
```

## 启动

macOS 可直接双击：

```text
一键启动.command
```

如果系统提示没有执行权限，在终端运行一次：

```bash
chmod +x 一键启动.command start.sh
```

也可以手动启动：

```bash
npm run dev
```

默认会在启动前自动扫描：

```text
public/data/*.json
```

并自动生成：

```text
public/data/card-files.json
```

这个文件是程序清单，通常不需要手动编辑。每个 JSON 文件会成为一个分类，分类名默认由文件名生成。例如：

```json
[
  {
    "file": "cet6_page1_group1_vocab_cards.json",
    "category": "Cet6 Page1 Group1 Vocab Cards"
  }
]
```

程序会把这些文件里的卡片合并显示。

如果文件不存在或为空，页面会显示：

```text
未找到单词卡数据。请将 cards.json 放入 public/data/ 目录。
```

## cards.json 格式

支持数组：

```json
[
  {
    "word": "block",
    "lemma": "block",
    "pos": ["noun", "verb"],
    "cet6_meaning_cn": ["阻塞", "障碍物", "阻挡"],
    "core_meaning_en": "to stop movement or progress; an obstacle",
    "status": "A"
  }
]
```

也支持外层对象：

```json
{
  "cards": [
    { "word": "block", "status": "A" }
  ]
}
```

字段缺失时页面不会崩溃，会显示“暂无数据”。

## 替换自己的词卡数据

把外部 AI 或脚本生成的词卡 JSON 文件放入：

```text
public/data/
```

例如：

```text
public/data/cet6_page1_group1_vocab_cards.json
public/data/cet6_page1_group2_vocab_cards.json
public/data/movie_context_cards.json
```

然后重新运行或重新双击 `一键启动.command`。启动时会自动扫描这些文件并生成分类。不需要你手动把文件名加入清单。

本项目不会修改你的词卡内容，只会保存学习状态到浏览器 `localStorage`。

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

也可以分别提供美式和英式：

```json
{
  "word": "initially",
  "phonetics": {
    "us": "/ɪˈnɪʃəli/",
    "uk": "/ɪˈnɪʃəli/"
  }
}
```

卡片状态：

- A 类：真实白名单语境卡，通常有 `corpus_matches`
- B 类：主题联想卡，通常有 `theme_association`，并醒目标注“非原台词，仅为主题联想”
- C 类：结构记忆卡，主要依靠词源、词族、搭配和复习问题

## 快捷键

- `←`：上一张
- `→`：下一张
- `Space`：下一张
- `F`：收藏 / 取消收藏
- `M`：已掌握 / 取消已掌握
- `R`：待复习 / 取消待复习

## 详情与总览

顶部工具栏可以在“详细卡片”和“总览”之间切换。

- 详细卡片：显示当前单词的完整释义、语境、词源、搭配和复习问题。
- 总览：把当前筛选条件下的所有词汇显示成方格，适合快速找词。
- 在总览中点击任意单词，会自动切换回该词的详细卡片。

总览会继续遵守当前分类、A/B/C、学习状态和搜索筛选。

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

状态保存在浏览器 `localStorage`，刷新页面后不会丢失。清空浏览器站点数据会删除这些状态。

## 当前限制

- 只读取 `public/data/cards.json`
- 不提供后端数据库
- 不生成单词卡内容
- 不校验台词版权或真实性
- 学习状态只保存在当前浏览器

## 后续可扩展方向

- 导入多个 JSON 卡组
- 导出学习状态
- 更细粒度的复习计划
- 卡片背面模式
- 离线 PWA
- Anki 或 SuperMemo 风格复习调度
