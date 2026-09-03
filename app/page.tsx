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
    { id: "user", code: "01", title: "Пользователь", finding: "Ценность не доказана", x: 112, y: 112, anchorX: 292, anchorY: 157, mx: 18, my: 292 },
    { id: "business", code: "02", title: "Бизнес", finding: "Экономика не сходится", x: 908, y: 112, anchorX: 908, anchorY: 157, mx: 212, my: 292 },
    { id: "tech", code: "03", title: "Реализация", finding: "Критичная зависимость", x: 112, y: 408, anchorX: 292, anchorY: 453, mx: 18, my: 400 },
    { id: "risk", code: "04", title: "Риски", finding: "Нет критерия отказа", x: 908, y: 408, anchorX: 908, anchorY: 453, mx: 212, my: 400 },
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

        <div className="perspective-stage desktop-visual">
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

        <div className="mobile-stage mobile-perspective-stage">
          <svg className="mobile-map" viewBox="0 0 390 610" role="img" aria-label="Гипотеза разделяется на четыре точки зрения сверху вниз">
            <path className="mobile-flow-line" d="M195 42 V248" />
            <text className="mobile-svg-kicker" x="195" y="28" textAnchor="middle">СЫРАЯ ГИПОТЕЗА</text>
            <g className="mobile-crystal" style={{ transform: `translateY(${arrival * 150}px)` }}>
              <path d="M195 55 L222 78 L212 114 L195 132 L178 114 L168 78 Z" />
              <text x="195" y="99" textAnchor="middle">H</text>
            </g>
            {roles.map((role) => {
              const targetX = role.mx < 100 ? role.mx + 80 : role.mx + 80;
              const targetY = role.my;
              return (
                <g key={role.id} className={`mobile-role ${activeRole === role.id ? "active" : activeRole ? "muted" : ""}`} style={{ opacity: Math.max(.16, split) }}>
                  <path className="mobile-split-link" d={`M195 242 L${targetX} ${targetY}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - split} />
                  <g
                    tabIndex={0}
                    role="button"
                    onClick={() => setActiveRole(activeRole === role.id ? null : role.id)}
                    onFocus={() => setActiveRole(role.id)}
                    onBlur={() => setActiveRole(null)}
                  >
                    <rect x={role.mx} y={role.my} width="160" height="82" rx="2" />
                    <text className="mobile-role-code" x={role.mx + 14} y={role.my + 22}>{role.code}</text>
                    <text className="mobile-role-title" x={role.mx + 14} y={role.my + 44}>{role.title}</text>
                    <text className="mobile-role-finding" x={role.mx + 14} y={role.my + 66} style={{ opacity: reveal }}>{role.finding}</text>
                  </g>
                </g>
              );
            })}
            <g className="mobile-summary" style={{ opacity: reveal }}>
              <rect x="57" y="510" width="276" height="60" rx="2" />
              <text x="195" y="537" textAnchor="middle">4 ТОЧКИ ПРОВЕРКИ</text>
              <text className="mobile-summary-note" x="195" y="558" textAnchor="middle">четыре независимых разбора</text>
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

        <div className="evidence-stage desktop-visual">
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

        <div className="mobile-stage mobile-evidence-stage">
          <svg className="mobile-map" viewBox="0 0 390 640" role="img" aria-label="Утверждения последовательно проходят через вертикальный сканер фактов">
            <text className="mobile-svg-kicker" x="18" y="34">УТВЕРЖДЕНИЯ</text>
            <text className="mobile-svg-kicker right" x="372" y="34" textAnchor="end">ВЕРДИКТЫ</text>
            <g className="mobile-scanner" style={{ opacity: .35 + scan * .65 }}>
              <rect x="178" y="54" width="34" height="504" rx="3" />
              <line x1="195" y1="70" x2="195" y2="542" />
              <rect className="mobile-scan-beam" x="169" y={82 + scan * 438} width="52" height="3" />
            </g>
            {evidenceRows.map((row, index) => {
              const y = 116 + index * 116;
              return (
                <g key={row.id} className={`mobile-evidence-row ${row.tone} ${activeRow === row.id ? "active" : activeRow ? "muted" : ""}`}>
                  <g
                    className="mobile-evidence-card claim"
                    tabIndex={0}
                    role="button"
                    onClick={() => setActiveRow(activeRow === row.id ? null : row.id)}
                    onFocus={() => setActiveRow(row.id)}
                    onBlur={() => setActiveRow(null)}
                    style={{ transform: `translateX(${feed * 8}px)` }}
                  >
                    <rect x="14" y={y} width="154" height="80" rx="2" />
                    <text className="mobile-card-kicker" x="27" y={y + 23}>{row.role}</text>
                    <text className="mobile-card-copy" x="27" y={y + 48}>{row.claim}</text>
                  </g>
                  <path className="mobile-evidence-link" d={`M168 ${y + 40} H222`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - reveal} />
                  <g className="mobile-evidence-card verdict" style={{ opacity: reveal, transform: `translateX(${12 - reveal * 12}px)` }}>
                    <rect x="222" y={y} width="154" height="80" rx="2" />
                    <text className="mobile-card-source" x="235" y={y + 24}>{row.source}</text>
                    <text className="mobile-card-result" x="235" y={y + 51}>{row.result}</text>
                  </g>
                </g>
              );
            })}
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

const realitySignals = [
  { id: "interviews", side: "internal", label: "ИНТЕРВЬЮ", value: "Важна скорость реакции", mobileValue: "Важна скорость", x: 74, y: 220, tone: "blue" },
  { id: "metrics", side: "internal", label: "МЕТРИКИ", value: "Частота риска неизвестна", mobileValue: "Частота неизвестна", x: 74, y: 330, tone: "neutral" },
  { id: "team", side: "internal", label: "КОМАНДА", value: "Ручная проверка медленна", mobileValue: "Проверка медленна", x: 74, y: 440, tone: "blue" },
  { id: "market", side: "external", label: "РЫНОК", value: "Снижение риска не доказано", mobileValue: "Риск не доказан", x: 876, y: 220, tone: "pink" },
  { id: "competitors", side: "external", label: "КОНКУРЕНТЫ", value: "Обещают приоритизацию", mobileValue: "То же обещание", x: 876, y: 330, tone: "pink" },
  { id: "buyers", side: "external", label: "КЛИЕНТЫ", value: "Платят за скорость реакции", mobileValue: "Платят за скорость", x: 876, y: 440, tone: "blue" },
] as const;

function RealityCollisionStation() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeSignal, setActiveSignal] = useState<string | null>(null);

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

  const approach = Math.min(1, progress / .42);
  const collision = Math.min(1, Math.max(0, (progress - .3) / .38));
  const reframe = Math.min(1, Math.max(0, (progress - .62) / .28));
  const phase = progress < .32 ? 0 : progress < .68 ? 1 : 2;
  const selected = realitySignals.find((signal) => signal.id === activeSignal);
  const phaseCopy = [
    ["ДВА КОНТУРА", "Внутренние выводы и внешний мир входят в проверку независимо."],
    ["КОНФЛИКТ", "Сигналы сталкиваются: обещание о снижении риска не получает подтверждения."],
    ["НОВАЯ ЦЕННОСТЬ", "Гипотеза меняется: фокус смещается на измеримую скорость реакции."],
  ][phase];

  return (
    <section className="scroll-pipeline reality-pipeline" id="reality" ref={sectionRef}>
      <div className="scroll-pipeline-sticky">
        <div className="pipeline-space" aria-hidden="true" />
        <div className="pipeline-stage-copy">
          <span>03 / 04</span>
          <h2>Столкнуть с реальностью</h2>
          <p>Внутренние выводы встречаются с рынком. Противоречие становится причиной изменить гипотезу.</p>
        </div>

        <div className="collision-stage desktop-visual">
          <svg className="collision-map" viewBox="0 0 1200 620" role="img" aria-label="Внутренние и внешние сигналы сталкиваются и меняют гипотезу">
            <defs>
              <pattern id="collision-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10223a" strokeWidth="1" />
              </pattern>
              <filter id="collision-blue-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="collision-pink-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="9" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="collision-core" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#65c8ff" /><stop offset=".48" stopColor={collision > .45 ? "#fff" : "#087ff5"} /><stop offset="1" stopColor={collision > .2 ? "#ff3fa4" : "#173d9c"} />
              </linearGradient>
            </defs>
            <rect width="1200" height="620" fill="url(#collision-grid)" opacity=".55" />
            <text className="collision-column-title" x="82" y="176">ВНУТРЕННИЕ СИГНАЛЫ</text>
            <text className="collision-column-title external" x="884" y="176">ВНЕШНИЕ СИГНАЛЫ</text>

            {realitySignals.map((signal) => {
              const isLeft = signal.side === "internal";
              const startX = isLeft ? signal.x + 250 : signal.x;
              const endX = 600;
              const startY = signal.y;
              const isActive = activeSignal === signal.id;
              return (
                <g key={signal.id} className={`reality-signal ${signal.tone} ${isActive ? "active" : activeSignal ? "muted" : ""}`}>
                  <path className="collision-link" d={`M${startX} ${startY} L${endX} 330`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - approach} />
                  <circle className="collision-packet" cx={startX + (endX - startX) * approach} cy={startY + (330 - startY) * approach} r="5" style={{ opacity: approach }} />
                  <g
                    className="signal-card"
                    tabIndex={0}
                    role="button"
                    aria-label={`${signal.label}: ${signal.value}`}
                    onPointerEnter={() => setActiveSignal(signal.id)}
                    onPointerLeave={() => setActiveSignal(null)}
                    onFocus={() => setActiveSignal(signal.id)}
                    onBlur={() => setActiveSignal(null)}
                    onClick={() => setActiveSignal(activeSignal === signal.id ? null : signal.id)}
                  >
                    <rect x={signal.x} y={signal.y - 31} width="250" height="62" rx="2" />
                    <text className="reality-label" x={signal.x + 17} y={signal.y - 8}>{signal.label}</text>
                    <text className="reality-value" x={signal.x + 17} y={signal.y + 16}>{signal.value}</text>
                  </g>
                </g>
              );
            })}

            <g className={`collision-reactor phase-${phase}`} style={{ transform: `scale(${.86 + collision * .14})` }}>
              <circle className="reactor-orbit outer" cx="600" cy="330" r="92" />
              <circle className="reactor-orbit inner" cx="600" cy="330" r="69" />
              <path className="reactor-crystal" d="M600 267 L649 307 L632 368 L600 397 L568 368 L551 307 Z" fill="url(#collision-core)" />
              <path className="reactor-facet" d="M600 267 L600 397 M551 307 L632 368 M649 307 L568 368" />
              <g className="collision-flare" style={{ opacity: collision }}>
                <path d="M600 226 V255 M600 405 V434 M496 330 H532 M668 330 H704 M527 257 L549 279 M651 381 L673 403 M527 403 L550 380 M650 279 L674 255" />
              </g>
            </g>

            <g className="reframe-output" style={{ opacity: reframe, transform: `translateY(${18 - reframe * 18}px)` }}>
              <rect x="370" y="492" width="460" height="88" rx="2" />
              <text className="reframe-kicker" x="396" y="522">ГИПОТЕЗА ПЕРЕФОРМУЛИРОВАНА</text>
              <text className="reframe-copy" x="396" y="550">Снизить риск → сократить time-to-action</text>
            </g>
          </svg>
        </div>

        <div className="mobile-stage mobile-collision-stage">
          <svg className="mobile-map" viewBox="0 0 390 650" role="img" aria-label="Внутренние и внешние сигналы сталкиваются в центре экрана">
            <text className="mobile-svg-kicker" x="14" y="34">ВНУТРИ</text>
            <text className="mobile-svg-kicker pink" x="376" y="34" textAnchor="end">СНАРУЖИ</text>
            {realitySignals.map((signal) => {
              const sideSignals = realitySignals.filter((item) => item.side === signal.side);
              const row = sideSignals.findIndex((item) => item.id === signal.id);
              const x = signal.side === "internal" ? 14 : 208;
              const y = 70 + row * 106;
              const anchorX = signal.side === "internal" ? 172 : 208;
              return (
                <g key={signal.id} className={`mobile-reality-signal ${signal.tone} ${activeSignal === signal.id ? "active" : activeSignal ? "muted" : ""}`}>
                  <path className="mobile-collision-link" d={`M${anchorX} ${y + 38} L195 438`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - approach} />
                  <g
                    className="mobile-signal-card"
                    tabIndex={0}
                    role="button"
                    onClick={() => setActiveSignal(activeSignal === signal.id ? null : signal.id)}
                    onFocus={() => setActiveSignal(signal.id)}
                    onBlur={() => setActiveSignal(null)}
                  >
                    <rect x={x} y={y} width="168" height="76" rx="2" />
                    <text className="mobile-card-kicker" x={x + 13} y={y + 24}>{signal.label}</text>
                    <text className="mobile-card-copy" x={x + 13} y={y + 50}>{signal.mobileValue}</text>
                  </g>
                </g>
              );
            })}
            <g className={`mobile-reactor phase-${phase}`} style={{ transform: `scale(${.86 + collision * .14})` }}>
              <circle className="mobile-reactor-orbit" cx="195" cy="438" r="59" />
              <circle className="mobile-reactor-orbit inner" cx="195" cy="438" r="43" />
              <path className="mobile-reactor-crystal" d="M195 393 L230 422 L218 464 L195 484 L172 464 L160 422 Z" />
              <path className="mobile-reactor-flare" d="M195 360 V382 M195 494 V516 M117 438 H146 M244 438 H273" style={{ opacity: collision }} />
            </g>
            <g className="mobile-reframe" style={{ opacity: reframe, transform: `translateY(${12 - reframe * 12}px)` }}>
              <rect x="20" y="535" width="350" height="82" rx="2" />
              <text x="195" y="564" textAnchor="middle">ГИПОТЕЗА ИЗМЕНЕНА</text>
              <text className="mobile-reframe-copy" x="195" y="590" textAnchor="middle">Риск → скорость реакции</text>
            </g>
          </svg>
        </div>

        <div className={`signal-phase phase-${phase}`} aria-live="polite">
          <span>0{phase + 1} / 03</span>
          <strong>{phaseCopy[0]}</strong>
          <p>{selected ? `${selected.label}: ${selected.value}.` : phaseCopy[1]}</p>
        </div>
        <div className="pipeline-scroll-hint" data-visible={progress < .06}><i /> КРУТИТЕ КОЛЕСО</div>
        <div className="signal-progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></div>
      </div>
    </section>
  );
}

const decisionOptions = [
  { id: "stop", code: "STOP", note: "Закрыть гипотезу", x: 250 },
  { id: "validate", code: "VALIDATE", note: "Проверить дальше", x: 500 },
  { id: "proceed", code: "PROCEED", note: "Запускать решение", x: 750 },
] as const;

function HumanGateStation() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [decision, setDecision] = useState<(typeof decisionOptions)[number]["id"]>("validate");

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

  const intake = Math.min(1, progress / .28);
  const routes = Math.min(1, Math.max(0, (progress - .2) / .34));
  const handoff = Math.min(1, Math.max(0, (progress - .48) / .3));
  const output = Math.min(1, Math.max(0, (progress - .72) / .2));
  const phase = progress < .24 ? 0 : progress < .52 ? 1 : progress < .76 ? 2 : 3;
  const phaseCopy = [
    ["ПАКЕТ РЕШЕНИЯ", "Система собирает выводы трёх станций в один проверяемый пакет."],
    ["ТРИ МАРШРУТА", "Закрыть гипотезу, продолжить проверку или перейти к реализации."],
    ["HUMAN GATE", "Алгоритм показывает варианты и доказательства. Выбор остаётся за человеком."],
    ["СЛЕДУЮЩИЙ ШАГ", "Решение превращено в конкретный план проверки, а не в очередной отчёт."],
  ][phase];
  const selected = decisionOptions.find((option) => option.id === decision)!;
  const packetX = 76 + intake * 524;
  const leverX = 487 + handoff * 226;

  return (
    <section className="scroll-pipeline human-gate-pipeline" id="decision" ref={sectionRef}>
      <div className="scroll-pipeline-sticky">
        <div className="pipeline-space" aria-hidden="true" />
        <div className="pipeline-stage-copy">
          <span>04 / 04</span>
          <h2>Принять решение</h2>
          <p>Система готовит варианты и основания. Человек выбирает, что делать с гипотезой дальше.</p>
        </div>

        <div className="human-gate-stage desktop-visual">
          <svg className="human-gate-map" viewBox="0 0 1200 650" role="img" aria-label="Человек выбирает следующий шаг для проверенной гипотезы">
            <defs>
              <pattern id="human-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10223a" strokeWidth="1" />
              </pattern>
              <filter id="human-blue-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width="1200" height="650" fill="url(#human-grid)" opacity=".55" />
            <path className="decision-intake-rail" d="M54 318 H532" />
            <text className="decision-caption" x="62" y="290">ПЕРЕФОРМУЛИРОВАННАЯ ГИПОТЕЗА</text>

            <g className="decision-packet" style={{ transform: `translateX(${packetX - 600}px)` }}>
              <path d="M600 267 L642 301 L628 354 L600 380 L572 354 L558 301 Z" />
              <text x="600" y="327" textAnchor="middle">H</text>
            </g>

            <g className="decision-core" style={{ opacity: Math.max(.22, intake) }}>
              <rect x="520" y="232" width="160" height="166" rx="3" />
              <text className="decision-core-kicker" x="600" y="258" textAnchor="middle">DECISION CORE</text>
              <text className="decision-core-number" x="600" y="322" textAnchor="middle">3 → 1</text>
              <text className="decision-core-note" x="600" y="354" textAnchor="middle">сигналы → решение</text>
              <circle cx="600" cy="384" r="5" />
            </g>

            <g className="decision-facts" style={{ opacity: routes }}>
              <g><rect x="252" y="186" width="170" height="46" rx="2" /><text x="271" y="214">4 ТОЧКИ ЗРЕНИЯ</text></g>
              <g><rect x="515" y="158" width="170" height="46" rx="2" /><text x="534" y="186">3 СТАТУСА</text></g>
              <g><rect x="778" y="186" width="170" height="46" rx="2" /><text x="797" y="214">1 КОНФЛИКТ</text></g>
            </g>

            {decisionOptions.map((option) => {
              const active = option.id === decision;
              return (
                <g key={option.id} className={`decision-route ${active ? "active" : ""}`} style={{ opacity: routes }}>
                  <path d={`M600 398 Q600 438 ${option.x + 100} 470`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - routes} />
                  <g
                    className="decision-option"
                    tabIndex={0}
                    role="button"
                    aria-label={`${option.code}: ${option.note}`}
                    onClick={() => setDecision(option.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setDecision(option.id);
                    }}
                  >
                    <rect x={option.x} y="452" width="200" height="66" rx="2" />
                    <text className="decision-code" x={option.x + 18} y="478">{option.code}</text>
                    <text className="decision-note" x={option.x + 18} y="500">{option.note}</text>
                  </g>
                </g>
              );
            })}

            <g className="human-switch" style={{ opacity: handoff }}>
              <rect className="switch-panel" x="446" y="548" width="308" height="72" rx="3" />
              <text x="468" y="576">HUMAN GATE</text>
              <line x1="487" y1="598" x2="713" y2="598" />
              <circle cx={leverX} cy="598" r="15" />
              <text className="switch-state" x="730" y="603" textAnchor="end">{selected.code}</text>
            </g>

            <g className="decision-output" style={{ opacity: output, transform: `translateX(${22 - output * 22}px)` }}>
              <path d="M754 584 H1120" />
              <rect x="884" y="542" width="256" height="84" rx="2" />
              <text className="output-kicker" x="904" y="568">ПАКЕТ ПРОВЕРКИ</text>
              <text className="output-result" x="904" y="593">7 вопросов · 3 риска</text>
              <text className="output-result" x="904" y="614">1 следующий шаг</text>
            </g>
          </svg>
        </div>

        <div className="mobile-stage mobile-human-gate-stage">
          <svg className="mobile-map" viewBox="0 0 390 700" role="img" aria-label="Вертикальный выбор следующего шага человеком">
            <text className="mobile-svg-kicker" x="195" y="27" textAnchor="middle">ПАКЕТ РЕШЕНИЯ</text>
            <g className="mobile-decision-core" style={{ opacity: Math.max(.24, intake) }}>
              <rect x="111" y="45" width="168" height="104" rx="3" />
              <text className="mobile-card-kicker" x="195" y="74" textAnchor="middle">DECISION CORE</text>
              <text className="mobile-core-number" x="195" y="112" textAnchor="middle">3 → 1</text>
              <text className="mobile-core-note" x="195" y="135" textAnchor="middle">сигналы → решение</text>
            </g>
            <g className="mobile-decision-facts" style={{ opacity: routes }}>
              <rect x="15" y="170" width="110" height="42" rx="2" /><text x="70" y="196" textAnchor="middle">4 ВЗГЛЯДА</text>
              <rect x="140" y="170" width="110" height="42" rx="2" /><text x="195" y="196" textAnchor="middle">3 СТАТУСА</text>
              <rect x="265" y="170" width="110" height="42" rx="2" /><text x="320" y="196" textAnchor="middle">1 КОНФЛИКТ</text>
            </g>
            {decisionOptions.map((option, index) => {
              const y = 236 + index * 76;
              const active = decision === option.id;
              return (
                <g key={option.id} className={`mobile-decision-route ${active ? "active" : ""}`} style={{ opacity: routes }}>
                  <path d={`M195 149 V${y}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - routes} />
                  <g
                    className="mobile-decision-option"
                    tabIndex={0}
                    role="button"
                    onClick={() => setDecision(option.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setDecision(option.id);
                    }}
                  >
                    <rect x="49" y={y} width="292" height="60" rx="2" />
                    <text className="mobile-decision-code" x="68" y={y + 25}>{option.code}</text>
                    <text className="mobile-decision-note" x="68" y={y + 45}>{option.note}</text>
                  </g>
                </g>
              );
            })}
            <g className="mobile-human-switch" style={{ opacity: handoff }}>
              <rect x="49" y="472" width="292" height="76" rx="3" />
              <text x="68" y="500">HUMAN GATE</text>
              <line x1="78" y1="526" x2="312" y2="526" />
              <circle cx={78 + handoff * 234} cy="526" r="14" />
              <text className="mobile-switch-state" x="321" y="501" textAnchor="end">{selected.code}</text>
            </g>
            <g className="mobile-decision-output" style={{ opacity: output, transform: `translateY(${14 - output * 14}px)` }}>
              <path d="M195 548 V584" />
              <rect x="39" y="584" width="312" height="92" rx="2" />
              <text x="195" y="613" textAnchor="middle">ПАКЕТ ПРОВЕРКИ</text>
              <text className="mobile-output-copy" x="195" y="641" textAnchor="middle">7 вопросов · 3 риска</text>
              <text className="mobile-output-copy" x="195" y="662" textAnchor="middle">1 следующий шаг</text>
            </g>
          </svg>
        </div>

        <div className={`signal-phase phase-${phase}`} aria-live="polite">
          <span>0{phase + 1} / 04</span>
          <strong>{phaseCopy[0]}</strong>
          <p>{phase === 2 ? `Выбрано: ${selected.code.toLowerCase()} — ${selected.note.toLowerCase()}.` : phaseCopy[1]}</p>
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
        <RealityCollisionStation />
        <HumanGateStation />
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
