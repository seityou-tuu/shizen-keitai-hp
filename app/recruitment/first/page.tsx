import { programCourses } from "@/lib/program-courses";
import "@/app/learning-value.css";
import Image from "next/image";
import { YoutubeVideoLink } from "@/components/youtube-video-link";
import youtube860k from "@/public/images/homepage/youtube-860k.webp";
import youtube1320k from "@/public/images/homepage/youtube-1320k.webp";
import { ProgramPhoto } from "@/components/program-photo";
import { LineConsultationLink } from "@/components/line-consultation-link";
import { CohortSchedule } from "@/components/cohort-schedule";
import { CohortInstructor } from "@/components/cohort-instructor";
import "@/app/recruitment.css";
import "@/app/cohort-instructor-story.css";
import "@/app/cohort-mobile.css";
import { Header } from "@/components/header";
import { InformationLinks } from "@/components/information-links";
import { CONTACT_PHONE, CONTACT_TEL } from "@/lib/contact";
import { informationMetadata } from "@/lib/information-metadata";
import { FIRST_COHORT_PATH, firstCohortDetails, firstCohortMinimumNotice, formatRecruitmentDate, getFirstCohort, getFirstCohortSummary } from "@/lib/recruitment";
import { operator } from "@/lib/site-information";

export function generateMetadata() {
  const summary = getFirstCohortSummary();
  return { ...informationMetadata(
  "第1期生 募集案内 | 自然形体療法 資格取得プログラム",
  `${summary.period}、${summary.locations}の${summary.venueCount}会場で学ぶ第1期生の開催案内。${summary.capacityLabel}、募集締切${formatRecruitmentDate(firstCohortDetails.deadline)}。日程・研修・料金とLINE・電話による受講相談をご案内します。申込み方法は準備中です。`,
  FIRST_COHORT_PATH,
  ), robots: { index: false, follow: false } };
}
const faq = [
  ["申込みはどこからできますか？", "正式な申込み方法は準備中です。公式LINE・電話は受講相談とお問い合わせの窓口です。LINEでの相談や友だち追加だけで、正式な受講申込み・契約・決済が完了するものではありません。"],
  ["施術未経験でも受講できますか？", "はい。第1期生は施術経験者・未経験者のどちらも受講可能です。その他の具体的な受講要件・認定条件は確認後にご案内します。"],
  ["実技と理論はどのように学びますか？", "実技は対面、理論はオンラインで学びます。プログラム共通の案内ではいずれも月1回、理論は1回2時間です。第1期生の会場住所・開始時刻・終了時刻、オンライン理論の開催日・接続方法は確認後にご案内します。"],
  ["研修日以外にも学べますか？", "主催者から復習用動画が提供され、研修日以外も質問できます。視聴方法・閲覧期限、質問方法・回答時間は未確定です。"],
  ["3コースすべての受講が必要ですか？", "3コースすべての受講が必須かどうか、認定基準・進級条件は未確定です。本プログラムの資格は国家資格や法的な開業資格の取得を示すものではありません。"],
  ["支払い方法・キャンセル条件は？", "支払い方法・支払時期、追加費用、キャンセル・返金条件は未確定です。クレジットカード分割払いは導入準備中で、現時点で利用可能とはご案内していません。"],
];

export default function FirstRecruitmentPage() {
  const info = getFirstCohort();
  const facts = firstCohortDetails;
  const summary = getFirstCohortSummary();
  return (
    <>
      <a className="skip-link" href="#recruitment-main">本文へ移動</a>
      <Header variant="first-cohort" />
      <main id="recruitment-main" tabIndex={-1} className="recruitment-page">
        <header className="recruitment-hero">
          <div className="recruitment-wrap cohort-hero-grid">
            <div className="cohort-hero-heading">
              <a className="recruitment-back" href="/">← プログラム全体のご案内</a>
              <p className="recruitment-eyebrow">SHIZEN KEITAI / FIRST COHORT</p>
              <span className="recruitment-status">{info.statusLabel}</span>
              <h1><span className="cohort-program-title">自然形体療法<br />資格取得プログラム</span><em>第1期生募集</em></h1>
              <p className="recruitment-lead">{summary.startYear}年{summary.startMonth}月、第1期生として学び始める。</p>
            </div>
            <div className="cohort-hero-photo cohort-photo">
              <ProgramPhoto name="practical-hands-on" caption="実技研修の紹介写真（既存HP掲載）" priority sizes="(max-width: 900px) calc(100vw - 40px), (max-width: 1400px) 52vw, 680px" />
              <p className="cohort-photo-note">掲載写真は既存の研修紹介用です。第1期生・第0期生の実施状況を示すものではありません。</p>
            </div>
            <div className="cohort-hero-details">
              <p>0期生の研修が、すでに始まっています。<br />次の学びの一歩を、第1期生として。</p>
              <div className="cohort-hero-actions">
                <LineConsultationLink className="recruitment-button" label="第1期生についてLINEで相談する" />
                <a href="#cohort-schedule" className="recruitment-text-link">会場・全6回の日程を見る ↓</a>
              </div>
              <p className="recruitment-hero-note">受講相談の窓口です。<br />正式な申込み・決済は受け付けていません。</p>
            </div>
            <dl className="cohort-launch-facts">
              <div><dt>開講</dt><dd>{summary.startYear}年<span>{summary.startMonth}月</span></dd></div>
              <div><dt>開催地域</dt><dd>{summary.locations}</dd></div>
              <div><dt>定員</dt><dd><strong>{summary.capacityLabel}</strong><small>合計{summary.totalCapacity}名</small><p className="cohort-hero-minimum">最少催行人数：<span>各会場{facts.minimumParticipantsPerVenue}名</span></p></dd></div>
              <div><dt>募集締切</dt><dd><time dateTime={facts.deadline}>{formatRecruitmentDate(facts.deadline)}</time></dd></div>
            </dl>
          </div>
        </header>
        <nav className="recruitment-quick-nav recruitment-wrap" aria-label="第1期生のページ内メニュー">
          <a href="#cohort-schedule">日程・会場 <span aria-hidden="true">↓</span></a>
          <a href="#cohort-tuition">受講料金 <span aria-hidden="true">↓</span></a>
          <a href="#cohort-faq">よくある質問 <span aria-hidden="true">↓</span></a>
          <a href="#cohort-contact">受講相談 <span aria-hidden="true">↓</span></a>
        </nav>
        <section className="cohort-next-step" aria-labelledby="cohort-next-step-title">
          <div className="recruitment-wrap">
            <p className="recruitment-eyebrow">まずは、その技術を映像で。</p>
            <div className="cohort-next-step-grid">
              <h2 id="cohort-next-step-title">次は、あなたが<br />この技術を<em>身につける番。</em></h2>
              <div className="cohort-next-step-copy">
                <p className="cohort-next-step-lead"><span>映像で見るだけだった技術を、</span><span>今度は自分の手で。</span></p>
                <p><span>自然形体療法の考え方と技術を、</span><span>永友裕也から直接学ぶ6ヶ月。</span></p>
              </div>
            </div>
            <div className="cohort-film-grid">
              {([
                { image: youtube860k, count: "86万回", title: "技術への関心を、ここから。", text: "まずは施術の映像から、技術に触れてみてください。" },
                { image: youtube1320k, count: "132万回", title: "映像から、自分の学びへ。", text: "気になった技術を、これからの学びのきっかけに。" },
              ] as const).map(({ image, count, title, text }) => (
                <figure className="cohort-film" key={count}>
                  <YoutubeVideoLink count={count}>
                    <Image src={image} alt="Fann Channelの施術紹介動画の掲載画面" sizes="(max-width: 700px) calc(100vw - 40px), 560px" />
                  </YoutubeVideoLink>
                  <figcaption><h3>{title}</h3><p>{text}</p></figcaption>
                </figure>
              ))}
            </div>
            <a className="recruitment-text-link cohort-film-learning" href="#cohort-learning">学び方を知る <span aria-hidden="true">↓</span></a>
            <p className="cohort-film-note">YouTubeが別タブで開きます。画像が出ない場合も「YouTubeで見る」から視聴できます。画像内の再生数・表現は掲載時点のもので、施術効果や受講後の成果を保証するものではありません。</p>
          </div>
        </section>
        <section id="cohort-learning" className="recruitment-section recruitment-wrap">
          <p className="recruitment-eyebrow">LEARNING</p><h2>理論と実技を、重ねて学ぶ。</h2>
          <p className="cohort-learning-lead">身体をどう捉え、どのように触れるか。<br />実技で確かめ、理論で考え、復習で理解を重ねる6ヶ月。</p>
          <div className="cohort-training-spread">
            <div className="cohort-observation-photo cohort-photo"><ProgramPhoto name="practical-observation" caption="手の位置や身体への触れ方を確認する研修紹介写真" sizes="(max-width: 900px) calc(100vw - 40px), 650px" /></div>
            <div className="cohort-training-copy">
              <p className="recruitment-eyebrow">SEE / PRACTICE / REFLECT</p>
              <h3>目で見て、<br />手で確かめる。</h3>
              <p>手の位置や力加減を確かめ、身体の反応を観察する。実際に手を動かしながら、施術を考えるための視点を学びます。</p>
              <p>なぜ、その施術を行うのか。理論で考え方を理解し、実技で身体の反応を確かめます。</p>
            </div>
            <div className="cohort-community-photo cohort-photo"><ProgramPhoto name="group-guidance" caption="指導・学び合いの雰囲気を伝える研修紹介写真" sizes="(max-width: 700px) 75vw, 440px" /></div>
          </div>
          <div className="recruitment-learning">
            <article><span>01</span><h3>実技研修</h3><p>講師の技術を間近で見ながら、触れ方・力加減・身体の反応を確かめます。</p><p className="recruitment-fact-line">月1回・対面<br />第1期生の時刻は確認中</p></article>
            <article><span>02</span><h3>理論研修</h3><p>なぜその施術を行うのか。感覚だけに頼らず、技術の背景にある考え方を学びます。</p><p className="recruitment-fact-line">月1回・オンライン<br />1回2時間</p></article>
            <article><span>03</span><h3>復習と質問</h3><p>主催者が提供する復習用動画で振り返り、研修日以外にも疑問を質問できます。</p><p className="recruitment-fact-line">研修の振り返りと<br />研修日以外の質問</p></article>
          </div>
          <p className="recruitment-note">上記は既存プログラムの学び方です。第1期生の開始・終了時刻、動画の視聴方法・期限、質問方法・回答時間等は確認後にご案内します。施術見学を確約するものではありません。施術の感じ方や身体の反応には個人差があり、医学的な効果・治癒を保証するものではありません。</p>
          <a className="recruitment-text-link" href="#cohort-schedule">募集日程・条件を確認する ↓</a>
        </section>
        <CohortInstructor />
        <section className="recruitment-section recruitment-wrap" aria-labelledby="cohort-overview">
          <p className="recruitment-eyebrow">OVERVIEW</p>
          <h2 id="cohort-overview">続いていく学びに、<br />あなたの一歩を。</h2>
          <div className="cohort-story-layout">
            <div className="cohort-intake-story"><h3>{summary.startYear}年{summary.startMonth}月、第1期生へ。</h3><p>同じ技術に向き合う仲間と、新しい学びを。{summary.locations}の{summary.venueCount}会場で始まります。</p></div>
            <div className="cohort-small-group"><p className="recruitment-eyebrow">FIRST COHORT</p><h3>各会場<span>{facts.venues[0].capacity}</span>名の募集</h3><p>同じ技術を学ぶ仲間と、ひとつずつ理解を重ねる。自然形体療法を学ぶ、新しい出会いを。</p><p>{facts.eligible}です。</p></div>
          </div>
          <dl className="cohort-overview-facts">
            <div><dt>開催期間</dt><dd>{summary.period}</dd></div>
            <div><dt>開催地域</dt><dd>{summary.locations}の{summary.venueCount}会場</dd></div>
            <div><dt>募集定員</dt><dd>{summary.capacityLabel}<span className="cohort-minimum-label">（最少催行人数{facts.minimumParticipantsPerVenue}名）</span>・合計{summary.totalCapacity}名<p className="cohort-minimum-notice">{firstCohortMinimumNotice}</p></dd></div>
            <div><dt>募集締切</dt><dd>{formatRecruitmentDate(facts.deadline)}</dd></div>
            <div><dt>受講対象</dt><dd>{facts.eligible}</dd></div>
            <div><dt>受講料金</dt><dd>各コース990,000円（税込）／税抜900,000円 <a href="#cohort-tuition">料金の詳細を見る ↓</a></dd></div>
          </dl>
        </section>

        <section id="cohort-schedule" className="recruitment-section recruitment-soft">
          <div className="recruitment-wrap">
            <p className="recruitment-eyebrow">SCHEDULE & LOCATION</p>
            <h2>学ぶ会場を選び、<br />全6回を見渡す。</h2>
            <p className="recruitment-section-lead">{summary.period}、{summary.locations}の{summary.venueCount}会場。{summary.capacityLabel}の開催情報です。会場を切り替えて日程を確認できます。</p>
            <CohortSchedule />
            <div className="cohort-pending-panel">
              <h3>現在、確認・準備している項目</h3>
              <p>会場住所・開始時刻・終了時刻、募集する研修と各コースの対応、認定基準・進級条件、支払方法・支払時期、追加費用、キャンセル・返金条件、正式な申込み方法は確認後にご案内します。</p>
              <p className="recruitment-note">公式LINE・電話で受講相談をご利用いただけます。相談だけで正式な申込みが完了するものではありません。</p>
            </div>
          </div>
        </section>
        <section id="cohort-tuition" className="recruitment-section recruitment-soft">
          <div className="recruitment-wrap">
            <p className="recruitment-eyebrow">TUITION</p><h2>受講料金</h2><p className="recruitment-section-lead">各コースの受講期間は6ヶ月です。対面の実技・オンライン理論に、復習用動画と研修日以外の質問を組み合わせて学びます。</p>
            <div className="recruitment-fees">{programCourses.map((course, i) => <article key={course.title}><span className="recruitment-eyebrow">STEP 0{i + 1}</span><h3>{course.title}</h3><p className="cohort-course-description">{course.lead}{course.text}</p><p className="recruitment-fee">990,000<small>円（税込）</small></p><p>税抜900,000円／受講期間6ヶ月</p></article>)}</div>
            <div className="recruitment-total"><p>3コースすべてを受講した場合の受講料合計</p><p>2,970,000円（税込）<small>税抜2,700,000円</small></p></div>
            <p className="recruitment-note">コースごとの詳しいカリキュラム・認定基準、3コースすべての受講が必須かどうかは未確定です。税込額は消費税10％前提です。</p>
            <p className="recruitment-note">支払・追加費用・キャンセル等の条件は募集情報欄をご確認ください。クレジットカード分割払いは導入準備中です。</p>
            <a className="recruitment-text-link" href="#cohort-contact">料金・受講条件について相談する ↗</a>
          </div>
        </section>
        <section id="cohort-flow" className="recruitment-section recruitment-wrap">
          <p className="recruitment-eyebrow">GETTING STARTED</p><h2>受講前の確認事項</h2>
          <p className="recruitment-section-lead">受講相談は公式LINEを中心に、お電話でも承ります。正式な申込み方法・契約手順は準備中です。</p>
          <ol className="recruitment-flow"><li><h3>まずは受講相談</h3><p>ご自身の経験や、学びたいこと、気になる点をお聞かせください。</p></li><li><h3>日程・条件を確認</h3><p>開催日・会場・受講要件・料金・規約など、確定した募集案内をご確認ください。</p></li><li><h3>手続き・条件を確認する</h3><p>お申込み・支払い・受講開始までの具体的な手順は未確定です。</p></li></ol>
          <p className="recruitment-note">上記は確認する情報の案内であり、確定した契約手順ではありません。お問い合わせだけで申込み・契約成立・決済になることはありません。</p>
          <InformationLinks />
        </section>
        <section id="cohort-faq" className="recruitment-section recruitment-soft">
          <div className="recruitment-wrap"><p className="recruitment-eyebrow">QUESTIONS</p><h2>よくある質問</h2><div className="recruitment-faq">{faq.map(([q, a], i) => <details key={q}><summary><span>Q0{i + 1}</span><span>{q}</span><b aria-hidden="true">＋</b></summary><p>{a}</p></details>)}</div></div>
        </section>
        <section id="cohort-contact" className="recruitment-section recruitment-contact">
          <div className="recruitment-wrap">
            <p className="recruitment-eyebrow">CONSULTATION</p><h2>「学んでみたい」を、<br />相談するところから。</h2>
            <p>学び方、会場選び、受講料金。受講を検討中の方も、お気軽にご相談ください。</p>
            <LineConsultationLink className="recruitment-button" label="第1期生についてLINEで相談する" />
            <p className="recruitment-note">LINE相談や友だち追加だけで、正式な受講申込み・契約・決済が完了するものではありません。</p>
            <p>電話でもご相談いただけます。</p><a className="recruitment-phone" href={CONTACT_TEL}>{CONTACT_PHONE}</a>
            <p className="recruitment-note">受付時間・休業日は確認後にご案内します。通話料はお客様のご負担です。</p>
            <a className="recruitment-text-link" href="/">プログラム全体を見る ↗</a>
          </div>
        </section>
      </main>
      <footer className="recruitment-footer"><div className="recruitment-wrap"><InformationLinks /><p>{operator.name} · 代表取締役 {operator.representative}</p><p>掲載情報・各種方針には確認中の項目が含まれます。</p></div></footer>
      <nav className="recruitment-contact-bar" aria-label="第1期生の相談窓口"><LineConsultationLink className="cohort-sticky-line" label="LINEで相談" /><a href={CONTACT_TEL} aria-label={`電話で第1期生について相談する（${CONTACT_PHONE}へ発信）`}>電話相談<small>{CONTACT_PHONE}</small></a></nav>
    </>
  );
}
