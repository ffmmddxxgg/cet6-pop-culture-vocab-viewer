import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Card = Record<string, any> & {
  word?: string;
  lemma?: string;
  phonetic?: string;
  ipa?: string;
  phonetics?: { us?: string; uk?: string; american?: string; british?: string };
  status?: "A" | "B" | "C" | string;
  cet6_meaning_cn?: string[] | string;
  core_meaning_en?: string;
  common_collocations?: string[];
  corpus_matches?: any[];
  theme_association?: any;
  memory_anchor?: any;
  review_prompts?: any[];
  __category?: string;
  __sourceFile?: string;
};

type Progress = { mastered?: boolean; favorite?: boolean; review?: boolean; lastViewedAt?: string };

type ManifestItem = string | { file: string; category?: string };

const progressKey = "cet6-vocab-viewer-progress";

function asArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value)
    .split(/[;,；，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function text(value: unknown, fallback = "暂无数据") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function keyFor(card: Card, index: number) {
  return `${card.word ?? "word"}::${card.lemma ?? "lemma"}::${index}`;
}

async function loadCards(): Promise<Card[]> {
  const manifestResponse = await fetch("/data/card-files.json", { cache: "reload" });
  if (!manifestResponse.ok) return [];
  const manifest = (await manifestResponse.json()) as ManifestItem[];
  const chunks = await Promise.all(
    manifest.map(async (item) => {
      const file = typeof item === "string" ? item : item.file;
      const category = typeof item === "string" ? item.replace(/\.json$/i, "") : item.category ?? item.file;
      const response = await fetch(`/data/${file}`);
      if (!response.ok) return [] as Card[];
      const data = await response.json();
      const cards = Array.isArray(data) ? data : Array.isArray(data.cards) ? data.cards : [];
      return cards.map((card: Card) => ({ ...card, __category: category, __sourceFile: file }));
    }),
  );
  return chunks.flat();
}

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [mode, setMode] = useState<"detail" | "overview">("detail");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, Progress>>(() => {
    try {
      return JSON.parse(localStorage.getItem(progressKey) || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    loadCards()
      .then(setCards)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress]);

  const categories = useMemo(
    () => Array.from(new Set(cards.map((card) => card.__category).filter(Boolean))).sort() as string[],
    [cards],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return cards
      .map((card, originalIndex) => ({ card, originalIndex }))
      .filter(({ card }) => {
        if (category !== "all" && card.__category !== category) return false;
        if (status !== "all" && card.status !== status) return false;
        if (!needle) return true;
        const haystack = [
          card.word,
          card.lemma,
          card.core_meaning_en,
          ...asArray(card.cet6_meaning_cn),
          ...(card.common_collocations ?? []),
          ...(card.corpus_matches ?? []).flatMap((match) => [match.title, match.quote]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      });
  }, [cards, category, query, status]);

  useEffect(() => setIndex(0), [category, query, status]);

  const current = filtered[index] ?? filtered[0];
  const card = current?.card;
  const currentKey = card ? keyFor(card, current.originalIndex) : "";
  const currentProgress = progress[currentKey] ?? {};

  function toggle(field: keyof Progress) {
    if (!card) return;
    setProgress((previous) => ({
      ...previous,
      [currentKey]: { ...previous[currentKey], [field]: !previous[currentKey]?.[field], lastViewedAt: new Date().toISOString() },
    }));
  }

  function next() {
    if (filtered.length) setIndex((value) => (value + 1) % filtered.length);
  }

  function prev() {
    if (filtered.length) setIndex((value) => (value - 1 + filtered.length) % filtered.length);
  }

  if (loading) return <main className="page"><section className="panel">Loading cards...</section></main>;
  if (error) return <main className="page"><section className="panel error">加载失败：{error}</section></main>;

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">CET-6 Card Viewer</p>
          <h1>CET-6 Pop Culture Vocabulary</h1>
        </div>
        <div className="counter">第 {filtered.length ? index + 1 : 0} / {filtered.length} 张</div>
      </header>

      <section className="stats">
        <Stat label="总卡片" value={cards.length} />
        <Stat label="筛选后" value={filtered.length} />
        <Stat label="A" value={cards.filter((item) => item.status === "A").length} />
        <Stat label="B" value={cards.filter((item) => item.status === "B").length} />
        <Stat label="C" value={cards.filter((item) => item.status === "C").length} />
        <Stat label="分类" value={categories.length} />
      </section>

      <section className="toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索单词 / 释义 / 语境..." />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All Status</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button onClick={() => setMode(mode === "detail" ? "overview" : "detail")}>{mode === "detail" ? "总览" : "详细卡片"}</button>
      </section>

      {!filtered.length ? (
        <section className="panel empty">没有找到匹配的单词卡。请把 JSON 文件放入 public/data/，然后重新启动。</section>
      ) : mode === "overview" ? (
        <section className="gridPanel">
          {filtered.map(({ card: item }, position) => (
            <button key={`${item.word}-${position}`} className="wordTile" onClick={() => { setIndex(position); setMode("detail"); }}>
              <span className={`badge ${item.status ?? "C"}`}>{item.status ?? "C"}</span>
              <strong>{text(item.word)}</strong>
              <small>{text(item.lemma ?? item.__category)}</small>
            </button>
          ))}
        </section>
      ) : card ? (
        <section className="card">
          <div className="cardHead">
            <span className={`badge ${card.status ?? "C"}`}>{card.status ?? "C"}</span>
            <span className="badge muted">{card.__category}</span>
            {currentProgress.mastered ? <span className="badge good">已掌握</span> : null}
            {currentProgress.favorite ? <span className="badge warn">收藏</span> : null}
            {currentProgress.review ? <span className="badge info">待复习</span> : null}
          </div>
          <h2>{text(card.word)}</h2>
          <p className="phonetic">{text(card.phonetic ?? card.ipa ?? card.phonetics?.us ?? card.phonetics?.uk, "音标：暂无数据")}</p>
          <p className="lemma">lemma: {text(card.lemma, "—")}</p>

          <Block title="核心释义">
            <div className="tags">{asArray(card.cet6_meaning_cn).map((item) => <span key={item}>{item}</span>)}</div>
            <p>{text(card.core_meaning_en)}</p>
          </Block>

          <Block title="词源">
            <p>{text(card.etymology?.summary)}</p>
            <p>root: {text(card.etymology?.root, "—")} · confidence: {text(card.etymology?.confidence, "—")}</p>
          </Block>

          <Block title="常见搭配">
            <div className="tags">{(card.common_collocations ?? []).map((item) => <span key={item}>{item}</span>)}</div>
          </Block>

          <Block title="白名单真实语境">
            {(card.corpus_matches ?? []).length ? card.corpus_matches!.map((match, i) => (
              <blockquote key={i}>“{text(match.quote)}”<footer>{text(match.title)} · score {text(match.final_score)}</footer></blockquote>
            )) : <p>未找到真实白名单语境。</p>}
          </Block>

          <Block title="主题联想">
            {card.theme_association ? <p>{text(card.theme_association.disclaimer)} {text(card.theme_association.association)}</p> : <p>暂无主题联想。</p>}
          </Block>

          <Block title="记忆锚点">
            <p>{text(card.memory_anchor?.one_sentence)}</p>
            <p>{text(card.memory_anchor?.visual_scene)}</p>
          </Block>

          <Block title="复习问题">
            {(card.review_prompts ?? []).length ? card.review_prompts!.map((prompt, i) => (
              <details key={i}><summary>{text(prompt.question)}</summary><p>{text(prompt.answer)}</p></details>
            )) : <p>暂无数据</p>}
          </Block>
        </section>
      ) : null}

      <nav className="bottomBar">
        <button onClick={prev}>上一张</button>
        <button onClick={next}>下一张</button>
        <button onClick={() => filtered.length && setIndex(Math.floor(Math.random() * filtered.length))}>随机</button>
        <button onClick={() => toggle("mastered")}>{currentProgress.mastered ? "取消掌握" : "已掌握"}</button>
        <button onClick={() => toggle("favorite")}>{currentProgress.favorite ? "取消收藏" : "收藏"}</button>
        <button onClick={() => toggle("review")}>{currentProgress.review ? "取消复习" : "待复习"}</button>
      </nav>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return <section className="block"><h3>{title}</h3>{children}</section>;
}
