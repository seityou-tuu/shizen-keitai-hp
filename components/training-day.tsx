// Add operator-approved schedule entries here once the actual timetable is confirmed.
// An empty list intentionally avoids suggesting any unconfirmed session or break.
type DayEntry = { time: string; title: string; description: string };
const confirmedDayEntries: DayEntry[] = [];

export function TrainingDay() {
  return (
    <section className="training-day" aria-labelledby="training-day-title">
      <div className="training-day-heading">
        <div>
          <p className="eyebrow">A DAY OF PRACTICE</p>
          <h3 id="training-day-title">実技研修の1日。</h3>
        </div>
        <p>
          月1回・対面研修
          <br />
          <strong>9:00〜17:00</strong>
        </p>
      </div>
      <div className="training-day-timeline">
        <div className="training-day-boundary">
          <time dateTime="09:00">9:00</time>
          <span>研修開始</span>
        </div>
        {confirmedDayEntries.length > 0 ? (
          <ol className="training-day-entries">
            {confirmedDayEntries.map((entry) => (
              <li key={entry.time + entry.title}>
                <time>{entry.time}</time>
                <div>
                  <h4>{entry.title}</h4>
                  <p>{entry.description}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="training-day-pending">
            <span className="eyebrow">SCHEDULE TO BE ANNOUNCED</span>
            <p>
              1日の詳細スケジュールは、
              <br />
              確認後にご案内します。
            </p>
            <small>指導内容・時間配分・休憩時間は未確定です。</small>
          </div>
        )}
        <div className="training-day-boundary">
          <time dateTime="17:00">17:00</time>
          <span>研修終了</span>
        </div>
      </div>
      <p className="editorial-note">
        表示しているのは研修の開始・終了時刻です。間の時間すべてが実技指導にあたることを示すものではありません。具体的な開催日・会場は確認中です。
      </p>
    </section>
  );
}
