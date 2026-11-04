export function MonthlyTraining() {
  return (
    <div
      className="monthly-training"
      aria-label="6ヶ月間の研修頻度。各月、対面実技1回とオンライン理論1回。指導内容は未確定です。"
    >
      <div className="monthly-training-key">
        <span>
          <i className="monthly-practice-dot" aria-hidden="true" />
          実技：対面・9:00〜17:00
        </span>
        <span>
          <i className="monthly-theory-dot" aria-hidden="true" />
          理論：オンライン・1回2時間
        </span>
      </div>
      <ol className="monthly-training-grid">
        {[1, 2, 3, 4, 5, 6].map((month) => (
          <li key={month}>
            <p className="eyebrow">
              MONTH <span>0{month}</span>
            </p>
            <h3>{month}ヶ月目</h3>
            <dl>
              <div>
                <dt>
                  <i className="monthly-practice-dot" aria-hidden="true" />
                  実技
                </dt>
                <dd>
                  1<small>回</small>
                </dd>
              </div>
              <div>
                <dt>
                  <i className="monthly-theory-dot" aria-hidden="true" />
                  理論
                </dt>
                <dd>
                  1<small>回</small>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
      <p className="monthly-training-summary">
        毎月、実技と理論をそれぞれ1回。
        <span>各コース共通の6ヶ月間の研修頻度です。</span>
      </p>
    </div>
  );
}
