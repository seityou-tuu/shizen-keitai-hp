import { Header } from "@/components/header";
import { InformationLinks } from "@/components/information-links";
import { CONTACT_PHONE, CONTACT_TEL } from "@/lib/contact";
import { informationMetadata } from "@/lib/information-metadata";
import { FIRST_COHORT_PATH, formatRecruitmentDate, getFirstCohort } from "@/lib/recruitment";
import { operator } from "@/lib/site-information";

export const metadata = informationMetadata(
  "第1期生 募集案内 | 自然形体療法 資格取得プログラム",
  "自然形体療法 資格取得プログラムの第1期生募集案内。募集状況・開催日程・会場・研修内容・受講料金・電話での受講相談をご確認いただけます。",
  FIRST_COHORT_PATH,
);
const faq = [
  ["第1期生の募集は始まっていますか？", "募集状況は、このページ上部の表示をご確認ください。開催日程・募集条件は確定後にご案内します。現在、このページでは正式な受講申込み・契約・決済を受け付けていません。"],
  ["施術未経験でも相談できますか？", "はい。プログラムは施術経験者・未経験者の両方を対象としています。第1期生の具体的な受講要件は、正式な募集案内でご確認ください。"],
  ["実技と理論はどのように学びますか？", "プログラム共通の案内は、実技が月1回・対面9:00〜17:00、理論が月1回・オンラインで1回2時間です。第1期生の実施日・会場などは確定後にご案内します。"],
  ["研修日以外にも学べますか？", "主催者から復習用動画が提供され、研修日以外も質問できます。視聴方法・閲覧期限、質問方法・回答時間などの詳細は確認後にご案内します。"],
  ["3コースすべての受講が必要ですか？", "3コースすべての受講が必須かどうか、各コースの認定基準・進級条件は確認後にご案内します。本プログラムの資格は国家資格や法的な開業資格の取得を示すものではありません。"],
  ["支払い方法・キャンセル条件は？", "支払い方法・支払時期、追加費用、キャンセル・返金条件は確認後にご案内します。クレジットカード分割払いは導入準備中で、現時点で利用可能とはご案内していません。"],
];

export default function FirstRecruitmentPage() {
  const info = getFirstCohort();
  const facts = info.confirmed;
  const schedule = [
    ["研修開始日", formatRecruitmentDate(facts.startDate)],
    ["第1期生の研修時間", facts.trainingTime ?? "開催日とあわせてご案内します"],
    ["募集開始日", formatRecruitmentDate(facts.recruitmentStartDate)],
    ["募集締切日", formatRecruitmentDate(facts.deadline)],
    ["定員", facts.capacity ? `${facts.capacity}名` : "確定後にご案内します"],
    ["実技研修の会場", facts.venue ?? "確定後にご案内します"],
  ];
  return (
    <>
      <a className="skip-link" href="#recruitment-main">本文へ移動</a>
      <Header />
      <main id="recruitment-main" className="recruitment-page">
        <header className="recruitment-hero">
          <div className="recruitment-wrap">
            <a className="recruitment-back" href="/">← プログラム全体のご案内</a>
            <p className="recruitment-eyebrow">SHIZEN KEITAI / FIRST COHORT</p>
            <span className="recruitment-status">{info.statusLabel}</span>
            <h1>第1期生へ。<br />その技術を、<br /><em>あなた自身の手に。</em></h1>
            <p className="recruitment-lead">自然形体療法 資格取得プログラム</p>
            <p>理論で理解し、実技で体感し、繰り返し磨いていく。<br />次の学びを考える方へ、第1期生の情報をご案内します。</p>
            <p className="recruitment-hero-note">{info.summary}<br />このページは正式な受講申込み・決済の窓口ではありません。</p>
            <a href="#cohort-contact" className="recruitment-button">受講について相談する <span aria-hidden="true">↗</span></a>
          </div>
          <span className="recruitment-hero-number" aria-hidden="true">01</span>
        </header>
        <nav className="recruitment-quick-nav recruitment-wrap" aria-label="第1期生のページ内メニュー">
          <a href="#cohort-schedule">日程・会場 <span aria-hidden="true">↓</span></a>
          <a href="#cohort-tuition">受講料金 <span aria-hidden="true">↓</span></a>
          <a href="#cohort-faq">よくある質問 <span aria-hidden="true">↓</span></a>
          <a href="#cohort-contact">受講相談 <span aria-hidden="true">↓</span></a>
        </nav>
        <section className="recruitment-section recruitment-wrap" aria-labelledby="cohort-overview">
          <p className="recruitment-eyebrow">OVERVIEW</p>
          <h2 id="cohort-overview">次の一歩を、ここから。</h2>
          <div className="recruitment-two-columns">
            <div><p>第0期生の研修が始まっています。</p><p>第1期生に関するご案内として、プログラムの概要と、確認しておきたい情報をまとめました。</p></div>
            <div className="recruitment-note-panel"><h3>受講対象</h3><p>接骨院・整体院などで施術を行っている方も、これから施術を学びたい方も対象です。</p><p>第1期生の具体的な受講要件・募集条件は、確定後にご案内します。</p></div>
          </div>
        </section>
        <section id="cohort-schedule" className="recruitment-section recruitment-soft">
          <div className="recruitment-wrap">
            <p className="recruitment-eyebrow">SCHEDULE & LOCATION</p>
            <h2>日程・会場・募集条件</h2>
            <p className="recruitment-section-lead">未確定の項目は、確認が取れた内容からお知らせします。</p>
            <dl className="recruitment-facts">{schedule.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <p className="recruitment-note">実技は対面、理論はオンラインのプログラムです。開催日・使用ツール・接続方法などの詳細は確定後にご案内します。</p>
          </div>
        </section>
        <section id="cohort-learning" className="recruitment-section recruitment-wrap">
          <p className="recruitment-eyebrow">LEARNING</p><h2>理論と実技を、重ねて学ぶ。</h2>
          <div className="recruitment-learning">
            <article><span>01</span><h3>実技研修</h3><p>講師の技術を間近で見ながら、触れ方・力加減・身体の反応を確かめます。</p><p className="recruitment-fact-line">月1回・対面<br />9:00〜17:00</p></article>
            <article><span>02</span><h3>理論研修</h3><p>なぜその施術を行うのか。感覚だけに頼らず、技術の背景にある考え方を学びます。</p><p className="recruitment-fact-line">月1回・オンライン<br />1回2時間</p></article>
            <article><span>03</span><h3>復習と質問</h3><p>主催者が提供する復習用動画で振り返り、研修日以外にも疑問を質問できます。</p><p className="recruitment-fact-line">提供範囲・利用方法などは<br />確認後にご案内</p></article>
          </div>
          <p className="recruitment-note">上記は既存のプログラム共通情報です。第1期生の詳しいカリキュラム・開催日程・認定条件は確定後にご案内します。施術見学を確約するものではありません。</p>
          <a className="recruitment-text-link" href="/#training">研修内容を詳しく見る ↗</a>
        </section>
        <section id="cohort-tuition" className="recruitment-section recruitment-soft">
          <div className="recruitment-wrap">
            <p className="recruitment-eyebrow">TUITION</p><h2>受講料金</h2><p className="recruitment-section-lead">既存プログラムの受講料金です。各コースの受講期間は6ヶ月です。</p>
            <div className="recruitment-fees">{["準師範コース", "師範コース", "本部師範コース"].map((name, i) => <article key={name}><span className="recruitment-eyebrow">STEP 0{i + 1}</span><h3>{name}</h3><p className="recruitment-fee">990,000<small>円（税込）</small></p><p>税抜900,000円／受講期間6ヶ月</p></article>)}</div>
            <div className="recruitment-total"><p>3コースすべてを受講した場合の受講料合計</p><p>2,970,000円（税込）<small>税抜2,700,000円</small></p></div>
            <p className="recruitment-note">3コースすべての受講が必須かどうか、認定基準・進級条件は確認後にご案内します。税込額は消費税10％前提です。</p>
            <p className="recruitment-note">支払い方法・支払時期、教材費・交通費等の追加費用、キャンセル・返金条件は確認後にご案内します。クレジットカード分割払いは導入準備中です。</p>
            <a className="recruitment-text-link" href="/#courses">プログラムの料金案内を確認する ↗</a>
          </div>
        </section>
        <section id="cohort-flow" className="recruitment-section recruitment-wrap">
          <p className="recruitment-eyebrow">GETTING STARTED</p><h2>受講前の確認事項</h2>
          <p className="recruitment-section-lead">現在ご利用いただけるのは電話による受講相談です。正式な申込み方法・契約手順は、確定後にご案内します。</p>
          <ol className="recruitment-flow"><li><h3>まずは受講相談</h3><p>ご自身の経験や、学びたいこと、気になる点をお聞かせください。</p></li><li><h3>日程・条件を確認</h3><p>開催日・会場・受講要件・料金・規約など、確定した募集案内をご確認ください。</p></li><li><h3>正式手続きは確定後にご案内</h3><p>お申込み・支払い・受講開始までの具体的な手順は未確定です。</p></li></ol>
          <p className="recruitment-note">上記は確認する情報の案内であり、確定した契約手順ではありません。お問い合わせだけで申込み・契約成立・決済になることはありません。</p>
          <InformationLinks />
        </section>
        <section id="cohort-faq" className="recruitment-section recruitment-soft">
          <div className="recruitment-wrap"><p className="recruitment-eyebrow">QUESTIONS</p><h2>よくある質問</h2><div className="recruitment-faq">{faq.map(([q, a], i) => <details key={q}><summary><span>Q0{i + 1}</span><span>{q}</span><b aria-hidden="true">＋</b></summary><p>{a}</p></details>)}</div></div>
        </section>
        <section id="cohort-contact" className="recruitment-section recruitment-contact">
          <div className="recruitment-wrap"><p className="recruitment-eyebrow">CONSULTATION</p><h2>第1期生について、<br />まずはご相談ください。</h2><p>日程や学び方、料金など、気になることをお聞かせください。</p><a className="recruitment-phone" href={CONTACT_TEL}>{CONTACT_PHONE}</a><p>スマートフォンではタップして発信できます。</p><p className="recruitment-note">受付時間・休業日は確認後にご案内します。通話料はお客様のご負担です。<br />お問い合わせは正式な受講申込み・契約・決済ではありません。</p><a className="recruitment-text-link" href="/">プログラム全体を見る ↗</a></div>
        </section>
      </main>
      <footer className="recruitment-footer"><div className="recruitment-wrap"><InformationLinks /><p>{operator.name} · 代表取締役 {operator.representative}</p><p>掲載情報・各種方針には確認中の項目が含まれます。</p></div></footer>
      <nav className="recruitment-contact-bar" aria-label="第1期生の相談窓口"><a href={CONTACT_TEL} aria-label={`電話で第1期生について相談する（${CONTACT_PHONE}へ発信）`}>電話で相談する<small>{CONTACT_PHONE}</small></a><a href="#cohort-schedule">日程・会場を見る ↓</a></nav>
    </>
  );
}
