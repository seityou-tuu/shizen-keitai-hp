import { FIRST_COHORT_PATH, firstCohortConfig, getFirstCohort } from "@/lib/recruitment";

export function FirstCohortCallout() {
  if (!firstCohortConfig.publicationApproved) return null;
  const recruitment = getFirstCohort();
  return (
    <section id="first-cohort" className="first-cohort-callout" aria-labelledby="first-cohort-title">
      <div className="renewal-wrap first-cohort-callout-inner">
        <div>
          <p className="recruitment-eyebrow">FIRST COHORT <span className="recruitment-status">{recruitment.statusLabel}</span></p>
          <h2 id="first-cohort-title">第1期生へ。<br />次の学びの、一歩を。</h2>
        </div>
        <div>
          <p>第0期生の研修が始まっています。</p>
          <p>{recruitment.summary}</p>
          <a className="recruitment-button" href={FIRST_COHORT_PATH}>第1期生の募集案内を見る <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
