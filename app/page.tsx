import { PublicTreatment } from "@/components/public-treatment";
import { MonthlyTraining } from "@/components/monthly-training";
import { InformationLinks } from "@/components/information-links";
import { Header } from "@/components/header";
import { ArrowLink, PhotoPlaceholder, SectionHeading } from "@/components/ui";
import {
  LearningQuestions,
  TrainingExperience,
  ProgramFacts,
} from "@/components/learning-experience";

const courses = [
  {
    step: "01",
    title: "準師範コース",
    english: "JUNIOR INSTRUCTOR",
    text: "資格取得の第一歩となるコース。実技と理論を組み合わせ、学びを積み重ねていきます。",
  },
  {
    step: "02",
    title: "師範コース",
    english: "INSTRUCTOR",
    text: "準師範コースに続く、次の段階。継続した研修を通じて、自然形体療法への理解を深めます。",
  },
  {
    step: "03",
    title: "本部師範コース",
    english: "HEADQUARTERS INSTRUCTOR",
    text: "3段階のロードマップの最終コース。実技と理論の両面から、さらに学びを重ねます。",
  },
];
const faqs = [
  [
    "未経験でも受講できますか？",
    "はい。未経験者と施術経験者の両方を対象としたプログラムです。具体的な受講要件や学習内容の詳細は、正式な募集案内でご確認ください。",
  ],
  [
    "資格取得はどのような順番で進みますか？",
    "準師範コース、師範コース、本部師範コースの順に進みます。資格認定の基準や各段階への進級条件は現在確認中です。公的資格としてのご案内ではありません。",
  ],
  [
    "受講期間と費用を教えてください。",
    "各コース6ヶ月、受講料は各990,000円（税込）／900,000円（税抜）です。3コースすべての受講料合計は2,970,000円（税込）／2,700,000円（税抜）（消費税10％前提）。各コースの受講期間の合算は18ヶ月ですが、連続開講時期は未確認のため、18ヶ月での資格取得を保証するものではありません。",
  ],
  [
    "研修はどこで、どのくらいの頻度で行いますか？",
    "実技研修は月1回、オフラインで9:00〜17:00。理論研修は月1回、オンラインで1回2時間です。実技会場や具体的な日程、オンラインの受講方法は現在確認中です。",
  ],
  [
    "次回の開講日や支払い方法は決まっていますか？",
    "次回開講日、支払い方法、受講料以外の費用の有無は現在確認中です。確定後、正式な募集案内に掲載します。",
  ],
  [
    "問い合わせや申し込みはできますか？",
    "現在、お問い合わせ窓口を準備しています。このページからの送信・申し込みはできません。窓口の確定後にご案内します。",
  ],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-text">
            <p className="eyebrow">
              <span /> SHIZEN KEITAI EDUCATION
            </p>
            <p className="hero-kicker">
              未経験者・施術経験者のための資格取得プログラム
            </p>
            <h1 id="hero-title">
              施術を学ぶ、
              <br />
              次の一歩を。
              <br />
              <em>実技と理論から。</em>
            </h1>
            <p className="hero-description">
              初めて学ぶ方も、施術の経験がある方も。
              <br />
              対面の実技とオンラインの理論を組み合わせ、
              <br />
              準師範から本部師範へ、段階的に学ぶプログラムです。
            </p>
            <div className="learning-hero-actions">
              <ArrowLink href="#training">研修の内容・スタイルを見る</ArrowLink>
              <a href="#courses" className="learning-secondary-link">
                期間・料金を確認する ↓
              </a>
            </div>
            <p className="small-note">
              お問い合わせ窓口は準備中です。まずはプログラムをご確認ください。
            </p>
          </div>
          <div
            className="hero-visual"
            aria-label="自然と学びを表現した抽象的な装飾"
          >
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-orbit orbit-three" />
            <div className="botanical">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="vertical-copy">自然に学び、人に向き合う。</p>
            <span className="visual-index">
              THE ART OF LEARNING
              <br />
              SHIZEN KEITAI
            </span>
            <span className="visual-caption">CONCEPT VISUAL / イメージ</span>
          </div>
          <a className="scroll-hint" href="#about">
            SCROLL TO DISCOVER <span>↓</span>
          </a>
        </section>
        <div className="intro-strip">
          <span>学びの入口は、どなたにも。</span>
          <p>未経験からの挑戦も、施術家としての次の一歩も。</p>
          <a href="#roadmap">
            3段階の学びを見る <span>↗</span>
          </a>
        </div>
        <LearningQuestions />
        <ProgramFacts />
        <section id="about" className="section about-section">
          <div className="container two-column">
            <div>
              <SectionHeading number="01" english="ABOUT THE PROGRAM">
                知識だけで終わらない。
                <br />
                身体で学ぶ、
                <br />
                自然形体療法。
              </SectionHeading>
              <p className="body-copy">
                自然形体療法に向き合い、学びを一歩ずつ積み重ねるための資格取得プログラムです。
              </p>
              <p className="body-copy">
                対面で取り組む実技と、オンラインで学ぶ理論。二つの研修を軸に、準師範・師範・本部師範の3段階で学んでいきます。
              </p>
              <p className="editorial-note">
                療法の具体的な定義・指導方針・カリキュラム詳細は、主催者確認後に掲載予定です。医療効果や治癒を保証するものではありません。
              </p>
            </div>
            <div className="about-image">
              <PhotoPlaceholder
                label="PRACTICE & LEARNING"
                caption="実技研修の風景"
              />
              <div className="image-caption">
                <span>01 — LEARNING THROUGH PRACTICE</span>
                <span>学ぶ。確かめる。積み重ねる。</span>
              </div>
            </div>
          </div>
        </section>
        <section id="audience" className="section audience-section">
          <div className="container">
            <SectionHeading number="02" english="WHO IT IS FOR">
              それぞれの出発点から、
              <br />
              新しい学びへ。
            </SectionHeading>
            <div className="audience-grid">
              <article className="audience-card">
                <span className="card-index">FOR BEGINNERS / 01</span>
                <h3>
                  これから、
                  <br />
                  施術を学びたい方へ。
                </h3>
                <p>
                  未経験から自然形体療法の学びを始めたい方に。実技と理論の両方に触れながら、新しい一歩を踏み出すためのプログラムです。
                </p>
                <span className="tag">未経験者の方</span>
              </article>
              <article className="audience-card">
                <span className="card-index">FOR PRACTITIONERS / 02</span>
                <h3>
                  いまの経験に、
                  <br />
                  新しい視点を。
                </h3>
                <p>
                  すでに施術に携わっている方に。これまでの経験を大切にしながら、自然形体療法を体系的に学ぶ機会をご案内します。
                </p>
                <span className="tag">施術経験者の方</span>
              </article>
            </div>
          </div>
        </section>
        <section id="roadmap" className="section roadmap-section">
          <div className="container">
            <div className="section-top">
              <SectionHeading number="03" english="YOUR LEARNING PATH" light>
                一歩ずつ、深めていく。
                <br />
                3段階の資格取得。
              </SectionHeading>
              <p>
                準師範から、師範、そして本部師範へ。
                <br />
                各コース6ヶ月の学びを重ねます。
              </p>
            </div>
            <ol className="roadmap-grid">
              {courses.map((c) => (
                <li key={c.step}>
                  <span className="roadmap-number">{c.step}</span>
                  <p className="eyebrow">STEP {c.step}</p>
                  <h3>{c.title}</h3>
                  <p className="course-english">{c.english}</p>
                  <div className="roadmap-duration">
                    受講期間 <strong>6</strong> ヶ月
                  </div>
                </li>
              ))}
            </ol>
            <p className="roadmap-note">
              各コースの受講期間の合算は18ヶ月です。連続開講時期等は未確認のため、18ヶ月での資格取得を確約するものではありません。資格認定基準・進級条件は確認中です。
            </p>
          </div>
        </section>
        <section id="courses" className="section courses-section">
          <div className="container">
            <div className="section-top">
              <SectionHeading number="04" english="COURSES & TUITION">
                学びのかたちと、
                <br />
                受講料金。
              </SectionHeading>
              <p>
                すべてのコースで、実技と理論を。
                <br />
                各コース共通の研修スタイルです。
              </p>
            </div>
            <div className="course-list">
              {courses.map((c) => (
                <article className="course-row" key={c.step}>
                  <div className="course-title">
                    <span className="card-index">STEP {c.step}</span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                  <dl className="course-facts">
                    <div>
                      <dt>受講期間</dt>
                      <dd>6ヶ月</dd>
                    </div>
                    <div>
                      <dt>実技研修</dt>
                      <dd>月1回・対面 9:00〜17:00</dd>
                    </div>
                    <div>
                      <dt>理論研修</dt>
                      <dd>月1回・オンライン2時間</dd>
                    </div>
                    <div>
                      <dt>回数の目安</dt>
                      <dd>実技6回・理論6回※</dd>
                    </div>
                  </dl>
                  <div className="course-price">
                    <span>受講料</span>
                    <p>
                      990,000<small>円（税込）</small>
                    </p>
                    <span>税抜900,000円 / 1コース</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="total-price">
              <div>
                <span className="eyebrow">TOTAL TUITION</span>
                <h3>3コースすべての受講料合計</h3>
              </div>
              <p>
                2,970,000<small>円（税込）</small>
              </p>
            </div>
            <p className="editorial-note">
              ※
              税込額は消費税10％前提です。3コースの税抜合計は2,700,000円です。※研修回数は月1回×6ヶ月で算出した目安です。正式な開催日程・振替等は確認中です。各コースの詳しいカリキュラム・認定基準は確認中です。支払い方法、教材費・交通費等の受講料以外の費用の有無、キャンセル規定は、正式な募集案内でご確認ください。
            </p>
          </div>
        </section>
        <PublicTreatment />
        <TrainingExperience />
        <section className="section schedule-section">
          <div className="container">
            <div className="section-top">
              <SectionHeading number="06" english="SIX MONTHS OF LEARNING">
                6ヶ月の積み重ねが、
                <br />
                次の一歩につながる。
              </SectionHeading>
              <p>
                各コース共通の研修頻度を表したイメージです。
                <br />
                指導内容や実施順序を示すものではありません。
              </p>
            </div>
            <MonthlyTraining />
            <p className="editorial-note">
              ※
              研修イメージです。正式な年間日程、各月のカリキュラム、修了・認定の条件は確認後にご案内します。
            </p>
          </div>
        </section>
        <section id="instructors" className="section instructor-section">
          <div className="container two-column">
            <PhotoPlaceholder label="INSTRUCTOR" caption="講師紹介写真" />
            <div>
              <SectionHeading number="07" english="INSTRUCTORS">
                学びを支える、
                <br />
                講師のこと。
              </SectionHeading>
              <p className="body-copy">
                一人ひとりの学びに向き合う講師について、今後こちらでご紹介します。
              </p>
              <div className="pending-box">
                <span className="status-dot" />
                講師情報は現在確認中です
                <p>
                  氏名・経歴・保有資格・担当コースは、確認が取れた情報のみ掲載します。
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="section flow-section">
          <div className="container">
            <div className="section-top">
              <SectionHeading number="08" english="GETTING STARTED">
                受講までの流れ。
              </SectionHeading>
              <span className="outline-label">以下は仮案です</span>
            </div>
            <ol className="flow-grid">
              {[
                [
                  "お問い合わせ",
                  "まずはプログラムへの関心や、ご質問をお寄せいただく流れを想定しています。",
                ],
                [
                  "プログラムのご案内",
                  "研修内容・開催日程・受講条件などの詳細をご確認いただきます。",
                ],
                [
                  "お申し込み",
                  "内容や規約にご同意のうえ、正式なお申し込みへ進みます。",
                ],
                [
                  "受講スタート",
                  "受講に必要な準備をご案内し、研修の開始を迎えます。",
                ],
              ].map(([title, text], i) => (
                <li key={title}>
                  <span className="card-index">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <p className="editorial-note">
              ※
              正式な受付・申し込み手順は未確定です。上記はご案内の構成案であり、現在のお申し込み受付を示すものではありません。
            </p>
          </div>
        </section>
        <section id="faq" className="section faq-section">
          <div className="container faq-layout">
            <SectionHeading number="09" english="QUESTIONS & ANSWERS">
              よくあるご質問。
            </SectionHeading>
            <div className="faq-list">
              {faqs.map(([q, a], i) => (
                <details key={q}>
                  <summary>
                    <span className="question-number">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{q}</span>
                    <span className="faq-toggle" aria-hidden="true" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="container contact-inner">
            <p className="eyebrow">YOUR NEXT CHAPTER</p>
            <h2>
              学びたい、その気持ちを。
              <br />
              次の一歩へ。
            </h2>
            <p>
              受講についての疑問や、プログラムの詳細など。
              <br />
              お問い合わせ窓口の準備が整い次第、ご案内します。
            </p>
            <div className="contact-status">
              <span className="status-dot" />
              お問い合わせ窓口は準備中です
            </div>
            <p className="contact-note">
              現在、このページからのお問い合わせ・お申し込みはできません。
              <br />
              連絡先・フォーム送信先は、確定後に掲載します。
            </p>
          </div>
          <span className="contact-circle" aria-hidden="true" />
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <a href="#" className="brand">
              <span className="brand-symbol" aria-hidden="true">
                自然
              </span>
              <span>
                自然形体療法<small>資格取得プログラム</small>
              </span>
            </a>
            <div className="company-info">
              <p className="eyebrow">OPERATED BY</p>
              <dl>
                <div>
                  <dt>主催</dt>
                  <dd>株式会社TSUNAGi</dd>
                </div>
                <div>
                  <dt>代表取締役</dt>
                  <dd>永友裕也</dd>
                </div>
              </dl>
            </div>
            <a href="#main" className="back-top">
              PAGE TOP <span>↑</span>
            </a>
          </div>
          <InformationLinks />
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} TSUNAGi Co., Ltd.</p>
            <p>デザイン試作版 · 掲載内容には確認中の情報が含まれます</p>
          </div>
        </div>
      </footer>
    </>
  );
}
