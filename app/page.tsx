"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  GitBranch,
  GitFork,
  Radar,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const repo = "https://github.com/SergeyNash/hypothesis-stress-test";

function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [focusSource, setFocusSource] = useState<"internal" | "market" | null>(null);

  useEffect(() => {
    const update = () => {
      frameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, -rect.top / distance));
      setProgress(nextProgress);
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const collision = Math.min(1, Math.max(0, (progress - 0.18) / 0.48));
  const reveal = Math.min(1, Math.max(0, (progress - 0.58) / 0.3));
  const leftX = collision * 255;
  const rightX = collision * -255;
  const phase = progress < 0.34 ? 0 : progress < 0.7 ? 1 : 2;
  const phaseCopy = [
    ["ДВА СИГНАЛА", "Внутренние данные и рынок говорят о гипотезе независимо."],
    ["СТОЛКНОВЕНИЕ", "Сигналы сходятся. Совпадения усиливают вывод, расхождения создают напряжение."],
    ["ПРОТИВОРЕЧИЕ НАЙДЕНО", "Внутренние данные обещают рост, а рынок не подтверждает готовность платить."],
  ][phase];

  return (
    <section className="scroll-pipeline" id="pipeline" ref={sectionRef}>
      <div className="scroll-pipeline-sticky">
        <div className="pipeline-space" aria-hidden="true" />
        <div className="pipeline-stage-copy">
          <span>03 / 04</span>
          <h2>Столкнуть сигналы</h2>
          <p>Не усреднять разные ответы, а показать, где именно гипотеза перестаёт сходиться с реальностью.</p>
        </div>

        <div className="signal-stage">
          <svg
            className="signal-map"
            viewBox="0 0 1200 620"
            role="img"
            aria-label="Внутренние данные и рыночные сигналы сходятся к гипотезе и выявляют противоречие"
          >
            <defs>
              <pattern id="signal-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10223a" strokeWidth="1" />
              </pattern>
              <filter id="blue-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pink-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="crystal-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#78d8ff" />
                <stop offset=".48" stopColor="#087ff5" />
                <stop offset="1" stopColor={reveal > 0.3 ? "#ff3fa4" : "#163d9c"} />
              </linearGradient>
            </defs>
            <rect width="1200" height="620" fill="url(#signal-grid)" opacity=".55" />
            <path className="signal-rail" d="M80 404 H1120" />

            <g
              className={`signal-cluster internal ${focusSource === "internal" ? "focused" : ""}`}
              style={{ transform: `translateX(${leftX}px)` }}
              tabIndex={0}
              role="button"
              aria-label="Подсветить внутренние данные"
              onPointerEnter={() => setFocusSource("internal")}
              onPointerLeave={() => setFocusSource(null)}
              onFocus={() => setFocusSource("internal")}
              onBlur={() => setFocusSource(null)}
            >
              <rect className="signal-terminal" x="86" y="214" width="250" height="142" rx="2" />
              <text className="signal-kicker" x="110" y="245">ВНУТРЕННИЕ ДАННЫЕ</text>
              <path className="signal-wave blue" d="M110 300 C135 245 160 350 185 285 S235 255 260 306 S300 330 318 272" />
              <text className="signal-value" x="110" y="334">рост конверсии +18%</text>
              <path className="signal-link blue" d="M336 285 H510" strokeDasharray="9 13" strokeDashoffset={-progress * 180} />
              {[0, 1, 2, 3].map((item) => (
                <circle key={item} className="signal-particle blue" cx={370 + item * 38} cy="285" r={item === 3 ? 5 : 3} />
              ))}
            </g>

            <g
              className={`signal-cluster market ${focusSource === "market" ? "focused" : ""}`}
              style={{ transform: `translateX(${rightX}px)` }}
              tabIndex={0}
              role="button"
              aria-label="Подсветить рыночные сигналы"
              onPointerEnter={() => setFocusSource("market")}
              onPointerLeave={() => setFocusSource(null)}
              onFocus={() => setFocusSource("market")}
              onBlur={() => setFocusSource(null)}
            >
              <rect className="signal-terminal" x="864" y="214" width="250" height="142" rx="2" />
              <text className="signal-kicker pink" x="888" y="245">РЫНОЧНЫЕ СИГНАЛЫ</text>
              <path className="signal-wave pink" d="M888 294 C915 325 940 252 965 310 S1015 338 1040 282 S1082 258 1092 318" />
              <text className="signal-value" x="888" y="334">готовность платить не найдена</text>
              <path className="signal-link pink" d="M690 285 H864" strokeDasharray="9 13" strokeDashoffset={progress * 180} />
              {[0, 1, 2, 3].map((item) => (
                <circle key={item} className="signal-particle pink" cx={830 - item * 38} cy="285" r={item === 3 ? 5 : 3} />
              ))}
            </g>

            <g className={`hypothesis-core phase-${phase}`} filter={phase > 0 ? "url(#pink-glow)" : "url(#blue-glow)"}>
              <circle className="core-orbit outer" cx="600" cy="285" r={82 + reveal * 16} />
              <circle className="core-orbit inner" cx="600" cy="285" r={60} />
              <path className="crystal" d="M600 205 L652 260 L632 334 L600 366 L568 334 L548 260 Z" fill="url(#crystal-fill)" />
              <path className="crystal-facet" d="M600 205 L600 366 M548 260 L632 334 M652 260 L568 334" />
              <path className="conflict-strike" d="M585 238 L610 270 L590 293 L618 328" style={{ opacity: reveal }} />
            </g>

            <g className="conflict-burst" style={{ opacity: reveal }}>
              <path d="M600 164 V128 M600 442 V406 M479 285 H443 M757 285 H721 M516 201 L490 175 M710 395 L684 369 M684 201 L710 175 M490 395 L516 369" />
            </g>

            <g className="signal-output" style={{ opacity: reveal, transform: `translateY(${18 - reveal * 18}px)` }}>
              <rect x="430" y="477" width="340" height="82" rx="2" />
              <text className="signal-kicker pink" x="454" y="508">ОБНАРУЖЕН РАЗРЫВ</text>
              <text className="output-copy" x="454" y="536">ценность подтверждена ≠ спрос подтверждён</text>
            </g>
          </svg>

          <button
            type="button"
            className={`source-chip internal ${focusSource === "internal" ? "active" : ""}`}
            onClick={() => setFocusSource(focusSource === "internal" ? null : "internal")}
          >
            01 Внутренние данные
          </button>
          <button
            type="button"
            className={`source-chip market ${focusSource === "market" ? "active" : ""}`}
            onClick={() => setFocusSource(focusSource === "market" ? null : "market")}
          >
            02 Рынок
          </button>
        </div>

        <div className={`signal-phase phase-${phase}`} aria-live="polite">
          <span>0{phase + 1} / 03</span>
          <strong>{phaseCopy[0]}</strong>
          <p>{phaseCopy[1]}</p>
        </div>
        <div className="pipeline-scroll-hint" data-visible={progress < 0.06}>
          <i /> КРУТИТЕ КОЛЕСО
        </div>
        <div className="signal-progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Hypothesis Stress Test — наверх">
          <span className="brand-mark">H//ST</span>
          <span className="brand-version">v2.4.0</span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#pipeline">Конвейер</a>
          <a href="#result">Результат</a>
          <a href="#fit">Кому нужен</a>
        </nav>
        <a className="github-link" href={repo} target="_blank" rel="noreferrer">
          <GitBranch size={16} /> GitHub
        </a>
      </header>

      <section className="hero grid-shell" id="top">
        <div className="hero-top">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse" /> PRODUCT HYPOTHESIS VALIDATION SYSTEM</div>
            <h1>Загрузите<br />гипотезу.<br /><em>Получите решение.</em></h1>
          </div>
          <div className="hero-side">
            <p>
              Система прогоняет продуктовую гипотезу через роли, внутренние данные,
              бизнес‑контекст и рынок. Показывает, <strong>что подтверждено, что нет
              и что проверять дальше.</strong>
            </p>
            <a className="btn btn-primary" href="#pipeline">
              Смотреть прогон <ArrowRight size={17} />
            </a>
          </div>
        </div>
        <Pipeline />
      </section>

      <section className="result grid-shell" id="result">
        <div className="result-heading">
          <span className="eyebrow">ЧТО ПОЛУЧАЕТ КОМАНДА</span>
          <h2>Не отчёт на 40 страниц.<br /><em>Три изменения в решении.</em></h2>
        </div>
        <div className="transform-grid">
          <article>
            <div className="transform-icon"><Radar /></div>
            <span>01 / ЦЕННОСТЬ</span>
            <div className="from"><i>БЫЛО</i> «Снизим риск»</div>
            <ArrowRight />
            <div className="to"><i>СТАЛО</i> «Сократим time‑to‑action»</div>
          </article>
          <article>
            <div className="transform-icon"><GitFork /></div>
            <span>02 / РЕШЕНИЕ</span>
            <div className="from"><i>БЫЛО</i> «Берём в backlog»</div>
            <ArrowRight />
            <div className="to"><i>СТАЛО</i> Proceed with validation</div>
          </article>
          <article>
            <div className="transform-icon"><Search /></div>
            <span>03 / СЛЕДУЮЩИЙ ШАГ</span>
            <div className="from"><i>БЫЛО</i> «Надо поисследовать»</div>
            <ArrowRight />
            <div className="to"><i>СТАЛО</i> 7 вопросов + discovery‑план</div>
          </article>
        </div>

        <div className="artifact-flow">
          <div className="artifact-source">
            <span>ОДИН ЗАПУСК</span>
            <strong>HYP-2026-001</strong>
          </div>
          <div className="flow-wires"><i /><i /><i /><i /></div>
          {[
            ["01", "Карта гипотезы", "hypothesis_map.md"],
            ["02", "Реестр доказательств", "evidence_inventory.md"],
            ["03", "Discovery‑план", "customer_discovery_plan.md"],
            ["04", "Решение для человека", "human_report.html"],
          ].map(([n, title, file]) => (
            <div className="artifact" key={n}>
              <span>{n}</span><b>{title}</b><i>{file}</i>
            </div>
          ))}
        </div>
      </section>

      <section className="fit grid-shell" id="fit">
        <div className="fit-intro">
          <span className="eyebrow">КОГДА ЭТО ИМЕЕТ СМЫСЛ</span>
          <h2>Чем дороже ошибка,<br /><em>тем полезнее прогон.</em></h2>
          <p>
            Я собрал этот подход, когда решения стали влиять на пять и больше
            команд. Плохая ставка сжигала не мой вечер — она сжигала чужие спринты.
          </p>
        </div>
        <div className="fit-table">
          <div className="fit-good">
            <span>ИСПОЛЬЗУЙТЕ</span>
            <p><Check /> Несколько команд зависят от решения</p>
            <p><Check /> B2B / enterprise / сложный контекст</p>
            <p><Check /> Много допущений, мало прямых данных</p>
          </div>
          <div className="fit-bad">
            <span>НЕ ТРАТЬТЕ ВРЕМЯ</span>
            <p><X /> Эксперимент дешёвый и обратимый</p>
            <p><X /> Проблема очевидна и быстро проверяется</p>
            <p><X /> Анализ стоит дороже возможной ошибки</p>
          </div>
        </div>
      </section>

      <section className="final-cta grid-shell">
        <div className="cta-orbit"><i /><i /><i /></div>
        <Sparkles className="cta-spark" />
        <span className="eyebrow">OPEN SOURCE / LOCAL FIRST</span>
        <h2>Прогоните свою<br />гипотезу через систему.</h2>
        <p>Cline, skills, Confluence MCP и решение, которое всегда остаётся за человеком.</p>
        <a className="btn btn-primary" href={`${repo}#быстрый-старт-cline`} target="_blank" rel="noreferrer">
          Открыть быстрый старт <ArrowRight size={17} />
        </a>
        <div className="author">
          <span>SS</span>
          <p><strong>Сергей Синяков</strong>Автор Hypothesis Stress Test</p>
        </div>
      </section>

      <footer>
        <span>HYPOTHESIS STRESS TEST / v2.4.0</span>
        <span>OPEN SOURCE · 2026</span>
        <a href={repo} target="_blank" rel="noreferrer">GITHUB <ArrowRight size={13} /></a>
      </footer>
    </main>
  );
}
