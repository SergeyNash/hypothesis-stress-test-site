"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  GitBranch,
  GitFork,
  Radar,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

const repo = "https://github.com/SergeyNash/hypothesis-stress-test";

const stations = [
  {
    code: "01 / INTAKE",
    short: "Вход",
    title: "Гипотеза разобрана на части",
    text: "Наблюдение, проблема, причина, действие и ожидаемый эффект больше не смешаны в одном абзаце.",
    signal: "5 полей",
  },
  {
    code: "02 / ROLES",
    short: "Роли",
    title: "Пять взглядов спорят с идеей",
    text: "Пользователь, бизнес, технология, риски и эксплуатация независимо ищут слабые места.",
    signal: "7 вопросов",
  },
  {
    code: "03 / EVIDENCE",
    short: "Данные",
    title: "Утверждения сверены с фактами",
    text: "Внутренние знания отделены от допущений. Отсутствие данных тоже становится результатом.",
    signal: "3 пробела",
  },
  {
    code: "04 / MARKET",
    short: "Рынок",
    title: "Внешний мир не подтвердил главный тезис",
    text: "Снижение production-risk звучит логично, но найденные сигналы его не доказывают.",
    signal: "1 конфликт",
  },
  {
    code: "05 / SYNTHESIS",
    short: "Решение",
    title: "Гипотеза стала проверяемой",
    text: "Ценность смещена к измеримому time-to-action. Понятно, что проверять и кто принимает решение.",
    signal: "REFRAME",
  },
];

function Pipeline() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current === stations.length - 1) {
          setRunning(false);
          return current;
        }
        return current + 1;
      });
    }, 1700);
    return () => window.clearInterval(timer);
  }, [running]);

  const restart = () => {
    setStep(0);
    setRunning(true);
  };

  return (
    <div className="pipeline-machine" id="pipeline">
      <div className="machine-head">
        <div>
          <span className="machine-dot" />
          LIVE RUN / HYP-2026-001
        </div>
        <button type="button" onClick={restart}>
          {running ? "ПРОГОН ИДЁТ" : "ЗАПУСТИТЬ СНОВА"} <span>↻</span>
        </button>
      </div>

      <div className="input-ticket">
        <span>СЫРАЯ ГИПОТЕЗА</span>
        <p>«AI‑приоритизация SAST снизит риск пропустить критическую уязвимость»</p>
        <i>UNTESTED</i>
      </div>

      <div className="belt-wrap">
        <div className="belt">
          <div className={`cargo cargo-${step}`}>
            <span>H</span>
            <i />
          </div>
          <div className="belt-line">
            <div className="belt-progress" style={{ width: `${step * 25}%` }} />
          </div>
          <div className="belt-teeth" />
          <div className="stations">
            {stations.map((station, index) => (
              <button
                type="button"
                key={station.code}
                className={index === step ? "active" : index < step ? "passed" : ""}
                onClick={() => {
                  setStep(index);
                  setRunning(false);
                }}
                aria-label={`Открыть этап: ${station.short}`}
              >
                <span className="station-index">0{index + 1}</span>
                <b>{station.short}</b>
                <i>{index < step ? "DONE" : index === step ? "ACTIVE" : "WAIT"}</i>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="machine-readout" key={step}>
        <div className="readout-copy">
          <span>{stations[step].code}</span>
          <h2>{stations[step].title}</h2>
          <p>{stations[step].text}</p>
        </div>
        <div className="readout-signal">
          <span>СИГНАЛ ЭТАПА</span>
          <strong className={step === 3 ? "warning" : ""}>{stations[step].signal}</strong>
          <div className="mini-chart">
            {[42, 70, 55, 86, 64, 92].map((height, index) => (
              <i key={index} style={{ "--h": `${Math.max(16, height - (4 - step) * 8)}%` } as CSSProperties} />
            ))}
          </div>
        </div>
        <div className="readout-log">
          <span>LIVE LOG</span>
          <p className={step >= 1 ? "on" : ""}>✓ контекст роли получен</p>
          <p className={step >= 2 ? "on" : ""}>✓ evidence inventory собран</p>
          <p className={step >= 3 ? "alert" : ""}>! главный тезис не доказан</p>
          <p className={step >= 4 ? "on" : ""}>✓ next test сформирован</p>
        </div>
      </div>

      <div className={`output-ticket ${step === 4 ? "revealed" : ""}`}>
        <div className="output-mark"><Check size={18} /></div>
        <div>
          <span>ГИПОТЕЗА ПОСЛЕ СТРЕСС‑ТЕСТА</span>
          <p>«Гибридная приоритизация сократит time‑to‑action, сохранив ручные исключения и аудит решений»</p>
        </div>
        <strong>PROCEED<br />WITH VALIDATION</strong>
      </div>
    </div>
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
