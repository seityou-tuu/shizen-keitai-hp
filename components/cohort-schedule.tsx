"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { firstCohortDetails, firstCohortMinimumNotice, formatSessionDate, getFirstCohortSummary } from "@/lib/recruitment";

const venues = firstCohortDetails.venues;
const choices = [...venues.map(venue => ({ id: venue.id as string, label: `${venue.name}会場` })), { id: "all", label: "全会場を比較" }];

export function CohortSchedule() {
  const summary = getFirstCohortSummary();
  const [enhanced, setEnhanced] = useState(false);
  const [selected, setSelected] = useState<string>(venues[0].id);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const followHash = () => {
      const venue = venues.find(venue => window.location.hash === `#schedule-${venue.id}`);
      if (venue) setSelected(venue.id);
    };
    followHash();
    setEnhanced(true);
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, []);
  const navigate = (event: KeyboardEvent, index: number) => {
    const next = event.key === "ArrowRight" ? (index + 1) % choices.length
      : event.key === "ArrowLeft" ? (index + choices.length - 1) % choices.length
      : event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(choices[next].id);
    buttons.current[next]?.focus();
  };
  const all = selected === "all";
  return (
    <div className="cohort-schedule-switcher">
      {enhanced ? <div className="cohort-venue-tabs" role="tablist" aria-label="会場別の研修日程">
        {choices.map((choice, index) => <button key={choice.id} type="button" role="tab"
          id={`venue-tab-${choice.id}`} aria-controls={choice.id === "all" ? "schedule-collection" : `schedule-${choice.id}`}
          aria-selected={selected === choice.id} tabIndex={selected === choice.id ? 0 : -1}
          ref={node => { buttons.current[index] = node; }} onClick={() => setSelected(choice.id)} onKeyDown={event => navigate(event, index)}>
          {choice.label}<span aria-hidden="true">{choice.id === "all" ? "一覧" : "全6回"}</span>
        </button>)}
      </div> : <nav className="cohort-venue-tabs" aria-label="会場別の日程へ移動">
        {venues.map(venue => <a href={`#schedule-${venue.id}`} key={venue.id}>{venue.name}会場</a>)}
      </nav>}
      {enhanced && <p className="cohort-selection" role="status">{all ? `${summary.locations}の全日程を表示しています。` : `${venues.find(venue => venue.id === selected)?.name}会場の全6回を表示しています。`}</p>}
      <p className="cohort-minimum-notice">{firstCohortMinimumNotice}</p>
      <div id="schedule-collection" className={`cohort-venue-panels ${!enhanced || all ? "compare-venues" : ""}`}
        role={enhanced && all ? "tabpanel" : undefined} aria-labelledby={enhanced && all ? "venue-tab-all" : undefined}>
        {venues.map(venue => <article key={venue.id} id={`schedule-${venue.id}`} className="cohort-venue-panel"
          role={enhanced && !all ? "tabpanel" : undefined} aria-labelledby={enhanced && !all ? `venue-tab-${venue.id}` : undefined}
          hidden={enhanced && !all && selected !== venue.id} tabIndex={enhanced ? 0 : undefined}>
          <div className="cohort-venue-heading"><div><p className="recruitment-eyebrow">{summary.period}</p><h3>{venue.name}会場</h3></div><p>定員 <strong>{venue.capacity}</strong>名<small className="cohort-minimum-count">最少催行人数{firstCohortDetails.minimumParticipantsPerVenue}名</small></p></div>
          <ol className="cohort-session-list">{venue.dates.map((date, index) => <li key={date}>
            <span>第{index + 1}回</span><time dateTime={date} aria-label={`${date.slice(0, 4)}年${formatSessionDate(date)}`}>{formatSessionDate(date)}</time>
          </li>)}</ol>
          <p className="recruitment-note">会場住所・開始時刻・終了時刻は確認後にご案内します。</p>
        </article>)}
      </div>
      <p className="recruitment-note">日程は2027年の開催予定として主催者より共有されたものです。オンライン理論研修の日程・接続方法、各回の実施内容は確認後にご案内します。</p>
    </div>
  );
}
