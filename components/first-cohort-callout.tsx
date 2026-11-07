import { FIRST_COHORT_PATH, firstCohortDetails, formatRecruitmentDate, getFirstCohort, getFirstCohortSummary } from "@/lib/recruitment";

/** Public course information, independent of opening formal applications. */
export function FirstCohortCallout() {
  const summary = getFirstCohortSummary();
  const recruitment = getFirstCohort();
  return (
    <aside className="home-cohort-notice renewal-wrap" aria-labelledby="home-cohort-title">
      <div className="home-cohort-introduction">
        <p className="home-cohort-kicker">自然形体療法 資格取得プログラム</p>
        <p id="home-cohort-title" className="home-cohort-title">第1期生募集案内 <span>{recruitment.statusLabel}</span></p>
        <p className="home-cohort-lead">{summary.startYear}年{summary.startMonth}月、第1期生として学び始める。</p>
      </div>
      <dl className="home-cohort-facts">
        <div><dt>開催地域</dt><dd>{summary.locations}</dd></div>
        <div><dt>定員</dt><dd>{summary.capacityLabel}／合計{summary.totalCapacity}名</dd></div>
        <div><dt>募集締切</dt><dd><time dateTime={firstCohortDetails.deadline}>{formatRecruitmentDate(firstCohortDetails.deadline)}</time></dd></div>
      </dl>
      <a className="home-cohort-button" href={FIRST_COHORT_PATH}>第1期生の詳細を見る <span aria-hidden="true">↗</span></a>
    </aside>
  );
}
