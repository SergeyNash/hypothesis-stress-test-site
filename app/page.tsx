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
  const [activeRole, setActiveRole] = useState<string | null>(null);

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

  const arrival = Math.min(1, progress / 0.28);
  const split = Math.min(1, Math.max(0, (progress - 0.22) / 0.46));
  const reveal = Math.min(1, Math.max(0, (progress - 0.62) / 0.28));
  const phase = progress < 0.28 ? 0 : progress < 0.68 ? 1 : 2;
  const phaseCopy = [
    ["СЫРАЯ ГИПОТЕЗА", "Одна формулировка входит в систему без готового ответа."],
    ["ЧЕТЫРЕ ВЗГЛЯДА", "Каждая роль разбирает гипотезу независимо от остальных."],
    ["КАРТА СЛАБЫХ МЕСТ", "Вместо одного общего мнения появляются конкретные точки проверки."],
  ][phase];
  const roles = [
    { id: "user", code: "01", title: "Пользователь", finding: "Ценность не доказана", x: 112, y: 112, anchorX: 292, anchorY: 157 },
    { id: "business", code: "02", title: "Бизнес", finding: "Экономика не сходится", x: 908, y: 112, anchorX: 908, anchorY: 157 },
    { id: "tech", code: "03", title: "Реализация", finding: "Критичная зависимость", x: 112, y: 408, anchorX: 292, anchorY: 453 },
    { id: "risk", code: "04", title: "Риски", finding: "Нет критерия отказа", x: 908, y: 408, anchorX: 908, anchorY: 453 },
  ] as const;
  const selectedRole = roles.find((role) => role.id === activeRole);
  const crystalX = 145 + arrival * 455;

  return (
    <section className="scroll-pipeline" id="pipeline" ref={sectionRef}>
      <div className="scroll-pipeline-sticky">
        <div className="pipeline-space" aria-hidden="true" />
        <div className="pipeline-stage-copy">
          <span>01 / 04</span>
          <h2>Разделить точки зрения</h2>
          <p>Одна гипотеза получает четыре независимых разбора — без преждевременного общего мнения.</p>
        </div>

        <div className="perspective-stage">
          <svg
            className="perspective-map"
            viewBox="0 0 1200 620"
            role="img"
            aria-label="Гипотеза разделяется на четыре независимые точки зрения"
          >
            <defs>
              <pattern id="perspective-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10223a" strokeWidth="1" />
              </pattern>
              <filter id="blue-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="crystal-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#78d8ff" />
                <stop offset=".48" stopColor="#087ff5" />
                <stop offset="1" stopColor="#163d9c" />
              </linearGradient>
            </defs>
            <rect width="1200" height="620" fill="url(#perspective-grid)" opacity=".55" />
            <path className="intake-rail" d="M60 310 H520" />
            <text className="intake-label" x="70" y="285" style={{ opacity: 1 - arrival * .8 }}>СЫРАЯ ГИПОТЕЗА</text>

            {roles.map((role) => (
              <g key={role.id}>
                <path
                  className={`perspective-link ${activeRole === role.id ? "active" : ""}`}
                  d={`M600 310 L${role.anchorX} ${role.anchorY}`}
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={1 - split}
                />
                <circle
                  className={`perspective-packet ${activeRole === role.id ? "active" : ""}`}
                  cx={600 + (role.anchorX - 600) * split}
                  cy={310 + (role.anchorY - 310) * split}
                  r="5"
                  style={{ opacity: split }}
                />
                <g
                  className={`role-node ${activeRole === role.id ? "active" : activeRole ? "muted" : ""}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${role.title}: ${role.finding}`}
                  onPointerEnter={() => setActiveRole(role.id)}
                  onPointerLeave={() => setActiveRole(null)}
                  onFocus={() => setActiveRole(role.id)}
                  onBlur={() => setActiveRole(null)}
                  onClick={() => setActiveRole(activeRole === role.id ? null : role.id)}
                  style={{ opacity: Math.max(.18, split) }}
                >
                  <rect x={role.x} y={role.y} width="180" height="90" rx="2" />
                  <text className="role-code" x={role.x + 18} y={role.y + 27}>{role.code}</text>
                  <text className="role-title" x={role.x + 18} y={role.y + 51}>{role.title}</text>
                  <text className="role-finding" x={role.x + 18} y={role.y + 74} style={{ opacity: reveal }}>{role.finding}</text>
                </g>
              </g>
            ))}

            <g className="hypothesis-carrier" style={{ transform: `translateX(${crystalX - 600}px)` }}>
              <g className="hypothesis-core" filter="url(#blue-glow)">
                <circle className="core-orbit outer" cx="600" cy="310" r={68 + split * 10} />
                <circle className="core-orbit inner" cx="600" cy="310" r="50" />
                <path className="crystal" d="M600 244 L644 288 L627 348 L600 375 L573 348 L556 288 Z" fill="url(#crystal-fill)" />
                <path className="crystal-facet" d="M600 244 L600 375 M556 288 L627 348 M644 288 L573 348" />
              </g>
            </g>

            <g className="finding-summary" style={{ opacity: reveal, transform: `translateY(${16 - reveal * 16}px)` }}>
              <rect x="430" y="500" width="340" height="72" rx="2" />
              <text className="summary-kicker" x="454" y="529">4 ТОЧКИ ПРОВЕРКИ</text>
              <text className="summary-copy" x="454" y="554">одна гипотеза → четыре независимых разбора</text>
            </g>
          </svg>
        </div>

        <div className={`signal-phase phase-${phase}`} aria-live="polite">
          <span>0{phase + 1} / 03</span>
          <strong>{phaseCopy[0]}</strong>
          <p>{selectedRole ? `${selectedRole.title}: ${selectedRole.finding}.` : phaseCopy[1]}</p>
        </div>
        <div className="pipeline-scroll-hint" data-visible={progress < 0.06}>
          <i /> КРУТИТЕ КОЛЕСО
        </div>
        <div className="signal-progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></div>
      </div>
    </section>
  );
}

const evidenceRows = [
  { id: "user", role: "ПОЛЬЗОВАТЕЛЬ", claim: "Проблема регулярна", source: "7 интервью", result: "ПОДТВЕРЖДЕНО", tone: "confirmed" },
  { id: "business", role: "БИЗНЕС", claim: "Клиент готов платить", source: "рынок / КП", result: "ОПРОВЕРГНУТО", tone: "refuted" },
  { id: "tech", role: "РЕАЛИЗАЦИЯ", claim: "Данных достаточно", source: "внутренние данные", result: "НЕТ ДАННЫХ", tone: "missing" },
  { id: "risk", role: "РИСКИ", claim: "Ограничение известно", source: "архитектура", result: "ПОДТВЕРЖДЕНО", tone: "confirmed" },
] as const;

function EvidenceStation() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeRow, setActiveRow] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      frameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
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

  const feed = Math.min(1, progress / .38);
  const scan = Math.min(1, Math.max(0, (progress - .28) / .4));
  const reveal = Math.min(1, Math.max(0, (progress - .58) / .3));
  const phase = progress < .3 ? 0 : progress < .65 ? 1 : 2;
  const phaseCopy = [
    ["УТВЕРЖДЕНИЯ", "Четыре вывода первой станции входят в проверочный контур."],
    ["ПОИСК СИГНАЛОВ", "Система сопоставляет каждое утверждение с конкретным источником."],
    ["ВЕРДИКТ", "Подтверждение, опровержение и пробел в данных видны одновременно."],
  ][phase];
  const selected = evidenceRows.find((row) => row.id === activeRow);

  return (
    <section className="scroll-pipeline evidence-pipeline" id="evidence" ref={sectionRef}>
      <div className="scroll-pipeline-sticky">
        <div className="pipeline-space" aria-hidden="true" />
        <div className="pipeline-stage-copy">
          <span>02 / 04</span>
          <h2>Сверить с фактами</h2>
          <p>Каждое утверждение проходит через источник данных и получает отдельный статус.</p>
        </div>

        <div className="evidence-stage">
          <svg className="evidence-map" viewBox="0 0 1200 620" role="img" aria-label="Утверждения проходят через сканер фактов">
            <defs>
              <pattern id="evidence-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10223a" strokeWidth="1" />
              </pattern>
              <filter id="evidence-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width="1200" height="620" fill="url(#evidence-grid)" opacity=".55" />
            <path className="evidence-rail" d="M60 342 H1140" />
            <g className="scanner" style={{ opacity: .35 + scan * .65 }}>
              <rect x="536" y="142" width="128" height="400" rx="4" />
              <path d="M560 166 H640 M560 518 H640" />
              <line x1="600" y1="182" x2="600" y2="502" />
              <text x="600" y="128" textAnchor="middle">EVIDENCE SCAN</text>
              <rect className="scan-beam" x="548" y={190 + scan * 290} width="104" height="3" />
            </g>

            {evidenceRows.map((row, index) => {
              const y = 222 + index * 82;
              const x = 78 + feed * 392;
              const isActive = activeRow === row.id;
              return (
                <g key={row.id} className={`evidence-row ${row.tone} ${isActive ? "active" : activeRow ? "muted" : ""}`}>
                  <g
                    className="claim-card"
                    style={{ transform: `translateX(${x - 78}px)` }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${row.role}: ${row.claim}`}
                    onPointerEnter={() => setActiveRow(row.id)}
                    onPointerLeave={() => setActiveRow(null)}
                    onFocus={() => setActiveRow(row.id)}
                    onBlur={() => setActiveRow(null)}
                    onClick={() => setActiveRow(activeRow === row.id ? null : row.id)}
                  >
                    <rect x="78" y={y - 27} width="330" height="54" rx="2" />
                    <text className="claim-role" x="96" y={y - 6}>{row.role}</text>
                    <text className="claim-text" x="96" y={y + 15}>{row.claim}</text>
                  </g>
                  <path className="evidence-link" d={`M664 ${y} H850`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - reveal} />
                  <circle className="evidence-pulse" cx={664 + 186 * reveal} cy={y} r="4" style={{ opacity: reveal }} />
                  <g className="verdict-card" style={{ opacity: reveal, transform: `translateX(${18 - reveal * 18}px)` }}>
                    <rect x="850" y={y - 27} width="270" height="54" rx="2" />
                    <text className="source-text" x="868" y={y - 7}>{row.source}</text>
                    <text className="verdict-text" x="868" y={y + 16}>{row.result}</text>
                  </g>
                </g>
              );
            })}
            <text className="evidence-caption" x="86" y="574">УТВЕРЖДЕНИЯ</text>
            <text className="evidence-caption" x="868" y="574" style={{ opacity: reveal }}>ДОКАЗАТЕЛЬСТВА</text>
          </svg>
        </div>

        <div className={`signal-phase phase-${phase}`} aria-live="polite">
          <span>0{phase + 1} / 03</span>
          <strong>{phaseCopy[0]}</strong>
          <p>{selected ? `${selected.claim} → ${selected.source}: ${selected.result.toLowerCase()}.` : phaseCopy[1]}</p>
        </div>
        <div className="pipeline-scroll-hint" data-visible={progress < .06}><i /> КРУТИТЕ КОЛЕСО</div>
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
        <EvidenceStation />
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
