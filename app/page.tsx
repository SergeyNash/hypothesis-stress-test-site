"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
    code: "01",
    title: "Разделить точки зрения",
    text: "Роли смотрят на одну гипотезу независимо — и находят разные слабые места.",
  },
  {
    code: "02",
    title: "Найти факты",
    text: "Утверждения сверяются с внутренними данными. Отсутствие доказательств тоже становится результатом.",
  },
  {
    code: "03",
    title: "Столкнуть сигналы",
    text: "Внутренняя логика встречается с рынком. Противоречия не прячутся — они становятся видимыми.",
  },
  {
    code: "04",
    title: "Собрать результаты",
    text: "Система формирует уточнённую гипотезу и следующий тест. Решение всё равно остаётся за человеком.",
  },
];

function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const update = () => {
      frameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, -rect.top / distance));
      setProgress(nextProgress);
      setStep(Math.min(stations.length - 1, Math.round(nextProgress * (stations.length - 1))));
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

  const goToStep = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: sectionTop + (distance * index) / (stations.length - 1),
      behavior: "smooth",
    });
  };

  const cameraX = 24 - progress * 48;

  return (
    <section className="scroll-pipeline" id="pipeline" ref={sectionRef}>
      <div className="scroll-pipeline-sticky">
        <div className="pipeline-space" aria-hidden="true" />
        <div
          className="pipeline-camera"
          style={{ transform: `translate3d(${cameraX}%, 0, 0) scale(1.08)` }}
        >
          <Image
              src="/hypothesis-pipeline.webp"
            width={1672}
            height={941}
            priority
            alt="Пиксельный конвейер: роли, факты, столкновение сигналов и синтез результата"
          />
        </div>
        <div className={`pipeline-vignette stage-${step}`} aria-hidden="true" />
        <div className="pipeline-stage-copy" key={step}>
          <span>{stations[step].code} / 04</span>
          <h2>{stations[step].title}</h2>
          <p>{stations[step].text}</p>
        </div>
        <div className="pipeline-input" data-visible={progress < 0.08}>
          СЫРАЯ ГИПОТЕЗА
        </div>
        <div className="pipeline-human" data-visible={progress > 0.9}>
          <strong>Система не принимает решение</strong>
          <span>Она помогает его принимать.</span>
        </div>
        <div className="pipeline-scroll-hint" data-visible={progress < 0.06}>
          <i /> КРУТИТЕ КОЛЕСО
        </div>
        <nav className="pipeline-step-nav" aria-label="Этапы стресс-теста">
          {stations.map((station, index) => (
            <button
              type="button"
              key={station.code}
              className={index === step ? "active" : index < step ? "passed" : ""}
              onClick={() => goToStep(index)}
              aria-label={`Перейти к этапу ${station.code}: ${station.title}`}
            >
              <span>{station.code}</span>
              <i />
            </button>
          ))}
        </nav>
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
