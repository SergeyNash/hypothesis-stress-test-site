"use client";

import { useEffect, useState, type CSSProperties } from "react";
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

const stations = [
  {
    code: "01 / INTAKE",
    short: "Вход",
    operation: "DECOMPOSE",
    title: "Разобрать утверждение",
    input: "1 абзац · 5 смыслов смешаны",
    output: "Карта из 5 полей",
    signal: "5 полей",
    findings: ["наблюдение", "проблема", "причина", "действие", "эффект"],
    score: 24,
  },
  {
    code: "02 / ROLES",
    short: "Роли",
    operation: "CHALLENGE",
    title: "Столкнуть пять взглядов",
    input: "Карта гипотезы · 5 полей",
    output: "7 вопросов без ответа",
    signal: "7 вопросов",
    findings: ["пользователь", "бизнес", "технология", "риски", "эксплуатация"],
    score: 38,
  },
  {
    code: "03 / EVIDENCE",
    short: "Данные",
    operation: "VERIFY",
    title: "Отделить факты от допущений",
    input: "7 вопросов · внутренний контекст",
    output: "2 факта · 3 пробела",
    signal: "3 пробела",
    findings: ["2 подтверждено", "3 без данных", "1 спорное"],
    score: 53,
  },
  {
    code: "04 / MARKET",
    short: "Рынок",
    operation: "COLLIDE",
    title: "Проверить внешний мир",
    input: "Главный тезис · 5 сигналов",
    output: "Тезис не подтверждён",
    signal: "1 конфликт",
    findings: ["2 слабых сигнала", "1 контрпример", "нет метрики риска"],
    score: 46,
  },
  {
    code: "05 / SYNTHESIS",
    short: "Решение",
    operation: "REFRAME",
    title: "Собрать проверяемую версию",
    input: "Факты · пробелы · конфликт",
    output: "Метрика + следующий тест",
    signal: "REFRAME",
    findings: ["time-to-action", "ручной контроль", "аудит решений"],
    score: 78,
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
        <span>INPUT / СЫРАЯ ГИПОТЕЗА</span>
        <p>«AI‑приоритизация SAST снизит риск пропустить критическую уязвимость»</p>
        <i>UNTESTED</i>
      </div>

      <div className="flow-deck">
        <div className="flow-rail" style={{ "--step": step } as CSSProperties}>
          <div className="rail-base" />
          <div className="rail-progress" style={{ width: `${10 + step * 20}%` }} />
          <div className="rail-stream" aria-hidden="true">
            {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
          </div>
          <div className={`hypothesis-packet packet-${step}`}>
            <span>HYP</span>
            <b>0{step + 1}</b>
            <i>{stations[step].signal}</i>
          </div>

          <div className="flow-gates">
            {stations.map((station, index) => (
              <button
                type="button"
                key={station.code}
                className={`flow-gate ${index === step ? "active" : index < step ? "passed" : ""} ${index === 3 ? "risk" : ""}`}
                onClick={() => {
                  setStep(index);
                  setRunning(false);
                }}
                aria-label={`Открыть этап: ${station.short}`}
              >
                <span className="gate-port"><i /></span>
                <span className="station-index">0{index + 1}</span>
                <b>{station.short}</b>
                <em>{station.operation}</em>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`stage-console ${step === 3 ? "has-conflict" : ""}`} key={step}>
        <div className="console-head">
          <span>{stations[step].code}</span>
          <b>{stations[step].title}</b>
          <i>{running ? "PROCESSING" : "INSPECT MODE"}</i>
        </div>

        <div className="console-grid">
          <div className="console-side console-in">
            <span>ВХОД НА ЭТАП</span>
            <strong>{stations[step].input}</strong>
            <div className="signal-stack" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <i key={index} className={index > 4 - Math.min(step, 3) ? "dim" : ""} />
              ))}
            </div>
          </div>

          <div className="console-core">
            <span>ОПЕРАЦИЯ</span>
            <div className="operation-core">
              <div className="core-orbit"><i /><i /><i /></div>
              <strong>{stations[step].operation}</strong>
              <small>{stations[step].signal}</small>
            </div>
          </div>

          <div className="console-side console-out">
            <span>ВЫХОД ЭТАПА</span>
            <strong>{stations[step].output}</strong>
            <div className="confidence">
              <div><i style={{ width: `${stations[step].score}%` }} /></div>
              <small>качество формулировки <b>{stations[step].score}%</b></small>
            </div>
          </div>
        </div>

        <div className="finding-strip">
          <span>ДОБАВЛЕНО В КОНТЕЙНЕР</span>
          <div>
            {stations[step].findings.map((finding, index) => (
              <i key={finding} className={step === 3 && index > 0 ? "warning" : ""}>{finding}</i>
            ))}
          </div>
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
