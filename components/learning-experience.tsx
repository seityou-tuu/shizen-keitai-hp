import { TrainingDay } from "@/components/training-day";
import { PhotoPlaceholder, SectionHeading } from "@/components/ui";

export function LearningQuestions() {
  return (
    <section
      className="section learning-questions"
      aria-labelledby="questions-title"
    >
      <div className="container">
        <div className="learning-question-heading">
          <p className="eyebrow">FIND YOUR STARTING POINT</p>
          <h2 id="questions-title">
            学びたい。
            <br />
            でも、気になることがある。
          </h2>
          <p>
            初めての挑戦にも、経験を重ねた今にも。
            <br />
            まずは、あなたの知りたいことから。
          </p>
        </div>
        <div className="learning-question-grid">
          <a href="#audience">
            <span className="card-index">01 / START</span>
            <h3>
              未経験の自分にも、
              <br />
              学びの入口はある？
            </h3>
            <p>未経験者・施術経験者、それぞれへのご案内</p>
            <span className="question-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a href="#training">
            <span className="card-index">02 / EXPERIENCE</span>
            <h3>
              どんな時間を、
              <br />
              どんな形で学ぶ？
            </h3>
            <p>対面の実技とオンラインの理論を知る</p>
            <span className="question-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a href="#courses">
            <span className="card-index">03 / PLAN</span>
            <h3>
              期間や費用を、
              <br />
              きちんと確かめたい。
            </h3>
            <p>各コース6ヶ月の受講期間と料金を確認</p>
            <span className="question-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

const formats = [
  {
    number: "01",
    english: "FACE TO FACE",
    title: "実技研修",
    message: "画面越しではない、対面で学ぶ時間。",
    text: "会場に足を運び、実技に取り組む研修です。オンラインの理論研修とあわせて、自然形体療法を学んでいきます。",
    time: "9:00–17:00",
    timeLabel: "開催時間",
    frequency: "月1回",
    format: "対面（オフライン）",
    photo: "実技研修の風景",
    note: "会場・開催日・具体的な指導内容は確認中です。休憩時間を含む内訳も未確認です。",
  },
  {
    number: "02",
    english: "ONLINE LEARNING",
    title: "理論研修",
    message: "オンラインで、理論と向き合う時間。",
    text: "月に一度、オンラインで理論を学ぶ研修です。実技だけに偏らず、理論にも継続して触れる構成になっています。",
    time: "2",
    timeLabel: "1回あたりの時間",
    frequency: "月1回",
    format: "オンライン",
    photo: "オンライン理論研修の風景",
    note: "使用ツール・開催日時・具体的な学習内容は確認中です。録画や見逃し配信の有無は未確定です。",
  },
];

export function TrainingExperience() {
  return (
    <section
      id="training"
      className="section training-section learning-training"
    >
      <div className="container">
        <div className="section-top">
          <SectionHeading number="05" english="TWO WAYS TO LEARN">
            実技と理論。
            <br />
            二つの時間で、学びを重ねる。
          </SectionHeading>
          <p>
            各コースに共通する研修スタイル。
            <br />
            参加する場と、学ぶ時間を具体的に。
          </p>
        </div>
        <div className="learning-format-list">
          {formats.map((item) => (
            <article className="learning-format" key={item.number}>
              <div className="learning-format-photo">
                <PhotoPlaceholder label={item.english} caption={item.photo} />
                <p className="learning-photo-note">
                  研修写真は準備中です。実際の様子は、確認・許諾後に掲載します。
                </p>
              </div>
              <div className="learning-format-content">
                <p className="eyebrow">
                  {item.number} / {item.english}
                </p>
                <h3>{item.title}</h3>
                <p className="learning-format-message">{item.message}</p>
                <p className="learning-format-copy">{item.text}</p>
                <div className="learning-time">
                  <span>{item.timeLabel}</span>
                  <strong>{item.time}</strong>
                  {item.number === "02" && <span>時間</span>}
                </div>
                <dl>
                  <div>
                    <dt>頻度</dt>
                    <dd>{item.frequency}</dd>
                  </div>
                  <div>
                    <dt>形式</dt>
                    <dd>{item.format}</dd>
                  </div>
                </dl>
                <p className="small-note">{item.note}</p>
              </div>
            </article>
          ))}
        </div>
        <TrainingDay />
        <div className="learning-rhythm">
          <div>
            <p className="eyebrow">A MONTHLY RHYTHM</p>
            <h3>
              毎月、二つの研修。
              <br />
              6ヶ月ごとに、一つのコース。
            </h3>
          </div>
          <div
            className="learning-rhythm-diagram"
            aria-label="各月は対面実技研修1回とオンライン理論研修1回。各コースの期間は6ヶ月。"
          >
            <span>
              実技<small>月1回・対面</small>
            </span>
            <b aria-hidden="true">＋</b>
            <span>
              理論<small>月1回・オンライン</small>
            </span>
            <b aria-hidden="true">×</b>
            <span className="rhythm-duration">
              6<small>ヶ月 / 各コース</small>
            </span>
          </div>
        </div>
        <p className="editorial-note">
          研修頻度を示す図です。具体的なカリキュラム・実施日程・認定基準は確認中です。修得する技能や資格取得を保証するものではありません。
        </p>
      </div>
    </section>
  );
}

export function ProgramFacts() {
  return (
    <div className="learning-facts" aria-label="プログラムの基本情報">
      <div className="container">
        <p className="eyebrow">PROGRAM AT A GLANCE</p>
        <dl>
          <div>
            <dt>資格取得のステップ</dt>
            <dd>
              <strong>3</strong>
              <span>段階</span>
            </dd>
            <p>準師範 → 師範 → 本部師範</p>
          </div>
          <div>
            <dt>各コースの受講期間</dt>
            <dd>
              <strong>6</strong>
              <span>ヶ月</span>
            </dd>
            <p>各コース共通の期間</p>
          </div>
          <div>
            <dt>毎月の研修スタイル</dt>
            <dd>
              <strong>2</strong>
              <span>つの形式</span>
            </dd>
            <p>対面実技 ＋ オンライン理論</p>
          </div>
        </dl>
        <p className="learning-facts-note">
          各コースの受講期間の合算は18ヶ月です。連続開講時期は未確認のため、18ヶ月での資格取得を確約するものではありません。
        </p>
      </div>
    </div>
  );
}
