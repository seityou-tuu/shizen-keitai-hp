import { InstagramSection } from "@/components/instagram-section";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { getGa4MeasurementId } from "@/lib/analytics-config";
import "./homepage-quality.css";
import { HomepageTrainingPhoto, InstructorEvidence } from "@/components/homepage-photos";
import { HomepageMotion } from "@/components/homepage-motion";
import { InstructorProfile } from "@/components/instructor-profile";
import { instructorProfile } from "@/lib/instructor";
import { CONTACT_PHONE, CONTACT_TEL, getOfficialLineUrl } from "@/lib/contact";
import { LineConsultationLink } from "@/components/line-consultation-link";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/site-config";
import { operator } from "@/lib/site-information";
import { Header } from "@/components/header";
import { InformationLinks } from "@/components/information-links";
import { ProgramPhoto } from "@/components/program-photo";
import { SectionHeading } from "@/components/ui";

const courses = [
  {
    step: "01",
    title: "準師範コース",
    english: "JUNIOR INSTRUCTOR",
    lead: "資格取得の第一歩となるコース。",
    text: "実技と理論を組み合わせ、学びを積み重ねていきます。",
  },
  {
    step: "02",
    title: "師範コース",
    english: "INSTRUCTOR",
    lead: "準師範コースに続く、次の段階。",
    text: "継続した研修を通じて、自然形体療法への理解を深めます。",
  },
  {
    step: "03",
    title: "本部師範コース",
    english: "HEADQUARTERS INSTRUCTOR",
    lead: "3段階のロードマップの最終コース。",
    text: "実技と理論の両面から、さらに学びを重ねます。",
  },
];
const features = [
  ["身体にやさしい施術", "強い刺激を避け、身体の状態に合わせて施術する。"],
  ["身体の変化を体感", "施術前後の動きや反応を丁寧に確認する。"],
  ["呼吸まで捉える", "身体のわずかな変化まで目を向ける繊細な観察。"],
  ["再現性を追求する", "感覚だけに頼らず、理論と実技を重ねる。"],
];
const support = [
  ["講師による直接指導", "実技を通して触れ方や力加減、身体の反応を学ぶ。"],
  ["理論を深く理解", "なぜその技術を使うのか、考え方から理解する。"],
  [
    "復習用動画を提供",
    "主催者が提供する復習用動画で、研修後も振り返ることができる。",
  ],
  [
    "研修日以外も質問できる",
    "研修日以外にも疑問を質問できるため、学びを継続できる。",
  ],
];
const future = [
  ["施術の選択肢が広がる", "これまでの施術に、新たな技術や視点を取り入れる。"],
  [
    "技術への理解を深める",
    "理論と実践を重ねながら、自分の判断力や技術を磨く。",
  ],
  [
    "独立・開業にも活かせる",
    "将来の施術活動や開業に向けて、学んだ技術を活かす可能性を広げる。",
  ],
  ["資格取得後も学べる", "取得後のフォローを通して、技術を継続して深める。"],
  ["仲間とつながる", "同じ技術を学ぶ人たちとの交流や学び合いにつなげる。"],
];
const faqs = [
  [
    "施術未経験でも受講できますか？",
    "はい。施術経験者・未経験者の両方を対象としています。未経験の方は、身体への触れ方や施術の理論を一から学ぶ機会としてご参加いただけます。具体的な受講要件は、正式な募集案内でご確認ください。",
  ],
  [
    "研修の頻度と受講期間は？",
    "各コース6ヶ月です。実技は月1回、対面で9:00〜17:00。理論は月1回、オンラインで1回2時間です。正式な開催日程・実技会場・連続開講時期は確認後にご案内します。",
  ],
  [
    "理論研修はどのように受講しますか？",
    "オンラインで受講します。使用するツール・接続方法・開催日時は、確定後にご案内します。対面座学の紹介写真は、オンライン研修の実際の画面ではありません。",
  ],
  [
    "実技研修ではどのように学びますか？",
    "講師の技術を間近で見ながら、実際に手を動かして学びます。手の位置、力加減、身体への触れ方、身体の反応を確認していきます。詳しいカリキュラムは確定後にご案内します。施術見学は確約された内容ではありません。",
  ],
  [
    "復習用動画はありますか？",
    "はい。主催者が復習用動画を提供します。研修後の振り返りに活用できます。視聴方法・提供範囲・閲覧期限は、確認後にご案内します。",
  ],
  [
    "研修日以外にも質問できますか？",
    "はい。研修日以外にも質問できます。質問方法や回答時間などの詳細は、確認後にご案内します。",
  ],
  [
    "資格取得後にも学べますか？",
    "資格取得後も、フォローを通して技術を継続して深めていくことを大切にしています。具体的な内容・参加条件・費用・実施頻度は、確認後にご案内します。",
  ],
  [
    "受講料金はいくらですか？",
    "準師範・師範・本部師範の各コースは990,000円（税込）／900,000円（税抜）です。3コースすべてを受講した場合の合計は2,970,000円（税込）／2,700,000円（税抜）です（消費税10％前提）。追加費用の有無は確認中です。",
  ],
  [
    "支払い方法や分割払いについて教えてください。",
    "支払い方法・支払時期は確認中です。クレジットカード分割払いは導入準備中で、現時点では利用可能とご案内していません。正式な条件が決まり次第お知らせします。",
  ],
  [
    "資格取得の条件は？3コースすべての受講が必要ですか？",
    "準師範→師範→本部師範の順に学びます。認定基準・進級条件・3コースすべての受講が必須かどうかは、確認後にご案内します。本プログラムの資格は、国家資格や法的な開業資格の取得を示すものではありません。",
  ],
];
function ConsultationCallout({ text }: { text: string }) {
  return (
    <aside className="consultation-callout">
      <p>{text}</p>
      <div className="consultation-actions">
        <a className="renewal-button" href={CONTACT_TEL}>
          受講について電話で相談する <span aria-hidden="true">↗</span>
        </a>
        <LineConsultationLink />
        <a className="consultation-details-link" href="#contact">
          電話番号・窓口案内を見る <span aria-hidden="true">↓</span>
        </a>
      </div>
    </aside>
  );
}

export default function Home() {
  const measurementId = getGa4MeasurementId();
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="program-renewal cinematic-program homepage-quality">
        <HomepageMotion />
        <section className="renewal-hero" aria-labelledby="hero-title">
          <div className="renewal-wrap hero-composition">
            <div className="hero-statement">
              <p className="renewal-kicker">01 / SHIZEN KEITAI EDUCATION</p>
              <p className="hero-for">自然形体療法 資格取得プログラム</p>
              <h1 id="hero-title">
                驚きを、
                <br />
                憧れで終わらせない。
                <br />
                <em>
                  次は、あなたが
                  <br className="hero-break" />
                  学ぶ番だ。
                </em>
              </h1>
              <div className="hero-introduction">
                <p>強い力に頼らない、やさしい施術。</p>
                <p>呼吸や身体のわずかな反応まで丁寧に捉える、自然形体療法。</p>
                <p>
                  理論で理解し、実技で体感し、繰り返し磨いていく。
                  <br />
                  その技術を、あなた自身の手に。
                </p>
              </div>
              <a className="renewal-button" href="#roadmap">
                資格取得プログラムを見る <span aria-hidden="true">↗</span>
              </a>
              <a className="renewal-text-link" href={CONTACT_TEL}>
                受講について電話で相談する <span aria-hidden="true">↗</span>
              </a>
              <LineConsultationLink />
            </div>
            <div className="hero-photograph">
              <span className="photo-overline">THE ART OF A GENTLE TOUCH</span>
              <ProgramPhoto
                name="treatment-main"
                caption="自然形体療法の施術風景"
                priority
                sizes="(max-width: 1100px) 100vw, 65vw"
              />
              <p className="hero-photo-word">その手で、学びを深める。</p>
              <p className="hero-photo-detail">理論を知る。実技で確かめる。</p>
            </div>
          </div>
          <div
            className="hero-facts renewal-wrap"
            aria-label="プログラムの基本情報"
          >
            <p>
              自然形体療法
              <br />
              <strong>資格取得プログラム</strong>
            </p>
            <dl>
              <div>
                <dt>対象</dt>
                <dd>施術経験者・未経験者</dd>
              </div>
              <div>
                <dt>学び方</dt>
                <dd>対面の実技 ＋ オンラインの理論</dd>
              </div>
              <div>
                <dt>ステップ</dt>
                <dd>3段階・各コース6ヶ月</dd>
              </div>
            </dl>
          </div>
          <nav className="program-shortcuts renewal-wrap" aria-label="プログラムの確認ポイント">
            <p>気になる内容から確認する</p>
            <ul>
              <li><a href="#training">研修内容<span aria-hidden="true">↓</span></a></li>
              <li><a href="#instructors">講師・映像紹介<span aria-hidden="true">↓</span></a></li>
              <li><a href="#courses">受講料金<span aria-hidden="true">↓</span></a></li>
              <li><a href="#faq">よくある質問<span aria-hidden="true">↓</span></a></li>
            </ul>
          </nav>
        </section>

        <section id="about" className="story-section renewal-about">
          <div className="renewal-wrap editorial-split">
            <div className="about-photograph">
              <ProgramPhoto
                name="treatment-detail"
                caption="身体の反応を確かめながら行う施術"
              />
              <p className="photo-footnote">
                A GENTLE TOUCH, A THOUGHTFUL APPROACH.
              </p>
            </div>
            <div className="editorial-copy">
              <SectionHeading number="02" english="ABOUT SHIZEN KEITAI">
                痛くない施術には、
                <br />
                理由がある。
              </SectionHeading>
              <div className="renewal-prose">
                <p>
                  自然形体療法が大切にしているのは、身体に無理な負担をかけず、その反応を丁寧に捉えること。
                </p>
                <p>
                  手の触れ方、身体の動き、呼吸の変化。
                  <br />
                  一つひとつに目を向けながら、理論に基づいて施術を組み立てます。
                </p>
                <p>
                  施術前後の身体の状態を確かめ、その変化から学ぶ。
                  <br />
                  ただ手順を覚えるだけではない、技術の奥深さがあります。
                </p>
              </div>
              <p className="renewal-note">
                感じ方や身体の反応には個人差があります。痛みがないことや、医学的な効果・治癒を保証するものではありません。
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="story-section renewal-features">
          <div className="renewal-wrap">
            <div className="section-intro-row">
              <SectionHeading number="03" english="FOUR PERSPECTIVES">
                その一手には、
                <br />
                理由がある。
              </SectionHeading>
              <p className="section-side-copy">
                触れる。確かめる。理解する。
                <br />
                技術の土台となる、4つの視点。
              </p>
            </div>
            <ol className="perspective-grid">
              {features.map(([title, text], i) => (
                <li key={title}>
                  <span className="perspective-number">0{i + 1}</span>
                  <span
                    className={`perspective-mark mark-${i + 1}`}
                    aria-hidden="true"
                  >
                    <i />
                    <i />
                    <i />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="audience" className="story-section renewal-audience">
          <div className="renewal-wrap">
            <SectionHeading number="04" english="YOUR NEXT POSSIBILITY">
              今の技術に、
              <br />
              もう一つの可能性を。
            </SectionHeading>
            <div className="renewal-audience-grid">
              <article>
                <p className="renewal-kicker">FOR PRACTITIONERS</p>
                <span className="audience-subject">
                  接骨院・整体院などで施術を行っている方へ
                </span>
                <h3>
                  積み重ねた経験に、
                  <br />
                  新しい視点を。
                </h3>
                <p>
                  施術経験がある方には、今までの技術に新たな考え方や選択肢を加える学びとして。
                </p>
              </article>
              <article>
                <p className="renewal-kicker">FOR BEGINNERS</p>
                <span className="audience-subject">
                  これから施術を学びたい方へ
                </span>
                <h3>
                  その興味を、
                  <br />
                  最初の一歩に。
                </h3>
                <p>
                  これから施術を始めたい方には、身体への触れ方や施術の理論を一から学ぶ機会として。
                </p>
              </article>
            </div>
            <p className="audience-closing">
              経験の有無にかかわらず、技術を深く学びたいという思いを大切にしています。
            </p>
          </div>
        </section>

        <section id="support" className="story-section renewal-support">
          <div className="renewal-wrap support-composition">
            <div>
              <SectionHeading number="05" english="LEARNING & SUPPORT">
                学んだその日だけで、
                <br />
                終わらせない。
              </SectionHeading>
              <div className="renewal-prose">
                <p className="prose-lead">学んで、試して、振り返る。</p>
                <p>疑問が生まれたら質問し、また次の研修で深めていく。</p>
                <p>
                  自然形体療法では、技術の習得に向けて繰り返し学べる環境を大切にしています。
                </p>
              </div>
              <a className="renewal-text-link" href="#faq">
                サポートについてのFAQ <span aria-hidden="true">↗</span>
              </a>
            </div>
            <ol className="support-list">
              {support.map(([title, text], i) => (
                <li key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="renewal-wrap">
            <ol
              className="learning-cycle"
              aria-label="繰り返して学ぶ4つのサイクル"
            >
              {[
                "理論を理解する",
                "実技で体感する",
                "動画で復習する",
                "質問して理解を深める",
              ].map((step, i) => (
                <li key={step}>
                  <span>0{i + 1}</span>
                  <p>{step}</p>
                  <b aria-hidden="true">{i === 3 ? "↺" : "→"}</b>
                </li>
              ))}
            </ol>
            <p className="cycle-caption">
              このサイクルを繰り返し、技術の習得を目指します。
            </p>
            <p className="renewal-note support-note">
              復習用動画の視聴方法・期間、質問方法・対応時間などの利用条件は、確認後にご案内します。
            </p>
          </div>
        </section>

        <section id="training" className="story-section renewal-training">
          <div className="renewal-wrap">
            <div className="training-section-intro">
              <SectionHeading number="06" english="INSIDE THE TRAINING">
                技術を、目で見て、
                <br />
                手で感じる。
              </SectionHeading>
              <p className="section-side-copy">対面で手を動かす実技と、<br />オンラインで理解を深める理論。<br />二つの学びを、毎月重ねていきます。</p>
            </div>
            <div className="training-format-key" aria-label="二つの研修形式">
              <p><span>01 / 実技</span><strong>対面で学ぶ</strong><small>月1回 · 9:00〜17:00</small></p>
              <span className="format-plus" aria-hidden="true">＋</span>
              <p><span>02 / 理論</span><strong>オンラインで学ぶ</strong><small>月1回 · 1回2時間</small></p>
            </div>
            <article className="training-story">
              <div className="training-practical-details">
                <div className="training-story-copy">
                  <p className="renewal-kicker"><span className="training-label">対面 / 実技</span> PRACTICAL TRAINING</p>
                  <h3>
                    身体で確かめる、
                    <br />
                    実技の時間。
                  </h3>
                  <div className="renewal-prose">
                    <p>講師の技術を間近で見ながら、実際に手を動かして学ぶ。</p>
                    <p>
                      手の位置、力加減、身体への触れ方など、言葉だけでは伝わりにくい細かな部分まで確認していきます。
                    </p>
                  </div>
                  <dl className="training-details">
                    <div>
                      <dt>開催頻度</dt>
                      <dd>月1回</dd>
                    </div>
                    <div>
                      <dt>受講形式</dt>
                      <dd>対面（オフライン）</dd>
                    </div>
                    <div>
                      <dt>研修時間</dt>
                      <dd>9:00〜17:00</dd>
                    </div>
                  </dl>
                  <p className="renewal-note">
                    会場・開催日・具体的な指導内容、休憩時間を含む時間配分は確認中です。
                  </p>
                </div>
              </div>
              <div className="training-main-photo">
                <ProgramPhoto
                  name="practical-hands-on"
                  caption="講師の技術を間近で学ぶ実技研修"
                  sizes="(max-width: 900px) calc(100vw - 40px), (max-width: 1392px) 50vw, 680px"
                />
                <div className="training-secondary-photo">
                  <HomepageTrainingPhoto name="observation" />
                </div>
              </div>
            </article>
            <article className="training-story theory-story">
              <div className="training-story-copy">
                <p className="renewal-kicker"><span className="training-label">オンライン / 理論</span> THEORETICAL TRAINING</p>
                <h3>
                  その技術の、
                  <br />
                  理由を知る。
                </h3>
                <div className="renewal-prose">
                  <p>なぜ、その施術を行うのか。</p>
                  <p>
                    身体の状態や反応をどのように捉え、施術につなげていくのか。
                  </p>
                  <p>感覚だけに頼らず、技術の背景にある考え方を学びます。</p>
                </div>
                <dl className="training-details">
                  <div>
                    <dt>開催頻度</dt>
                    <dd>月1回</dd>
                  </div>
                  <div>
                    <dt>受講形式</dt>
                    <dd>オンライン</dd>
                  </div>
                  <div>
                    <dt>研修時間</dt>
                    <dd>1回2時間</dd>
                  </div>
                </dl>
                <p className="renewal-note">
                  使用ツール・開催日時・具体的な学習内容は確認中です。
                </p>
              </div>
              <div>
                <ProgramPhoto
                  name="classroom-session"
                  caption="座学・講義の風景"
                />
                <p className="renewal-note">
                  写真は対面での座学・講義の様子です。オンライン理論研修の画面ではありません。
                </p>
              </div>
            </article>
            <div className="training-atmosphere-story">
              <div>
                <p className="renewal-kicker">LEARN TOGETHER</p>
                <h3>
                  <span className="thought-phrase">一人では</span><span className="thought-phrase">気づけなかったことが、</span>
                  <br />
                  <span className="thought-phrase">仲間との学びで</span><span className="thought-phrase">見えてくる。</span>
                </h3>
                <p>機会によっては、実際の施術を見学できる場合もあります。</p>
                <p className="renewal-note">
                  施術見学は確約されたカリキュラムではありません。開催日・場所・実施者・参加条件、本プログラムへの包含は確認後にご案内します。
                </p>
              </div>
              <HomepageTrainingPhoto name="guidance" />
            </div>
          </div>
        </section>

        <section id="roadmap" className="story-section renewal-roadmap">
          <div className="renewal-wrap">
            <div className="section-intro-row">
              <SectionHeading number="07" english="YOUR LEARNING PATH" light>
                学びを重ね、
                <br />
                次の段階へ。
              </SectionHeading>
              <p className="section-side-copy">
                準師範から、師範、本部師範へ。
                <br />
                理論と実技を重ねる3つのステップ。
              </p>
            </div>
            <ol className="renewal-step-grid">
              {courses.map((c) => (
                <li key={c.step}>
                  <p className="renewal-kicker">STEP {c.step}</p>
                  <h3>{c.title}</h3>
                  <p className="step-english">{c.english}</p>
                  <p className="step-description"><strong>{c.lead}</strong>{c.text}</p>
                  <p className="step-period">
                    受講期間 <strong>6ヶ月</strong>
                  </p>
                  <a className="step-fee-link" href={`#tuition-${c.step}`}>
                    {c.title}の料金を見る <span aria-hidden="true">↓</span>
                  </a>
                </li>
              ))}
            </ol>
            <a className="roadmap-fee-link" href="#courses">各コースの料金を確認する <span aria-hidden="true">↓</span></a>
            <div className="roadmap-common">
              <p>各コース共通</p>
              <span>実技：月1回・対面 9:00〜17:00</span>
              <span>理論：月1回・オンライン 1回2時間</span>
            </div>
            <p className="renewal-note">
              3コースの受講期間合計は18ヶ月ですが、連続開講時期は未確認のため、18ヶ月での資格取得を確約するものではありません。開催日程・振替、カリキュラム・認定基準・進級条件は確認後にご案内します。
            </p>
            <ConsultationCallout text="ご自身の経験や学びたいことを、受講相談でお聞かせください。" />
          </div>
        </section>

        <section id="instructors" className="story-section renewal-instructors">
          <div className="renewal-wrap">
            <SectionHeading number="08" english="INSTRUCTORS">
              一つひとつの技術に、
              <br />
              向き合う。
            </SectionHeading>
            <div className="instructor-introduction">
              <InstructorProfile />
              <div className="renewal-instructor-photos">
                <ProgramPhoto
                  name="instructor-portrait"
                  caption={instructorProfile.displayName}
                  sizes="(max-width: 700px) calc(100vw - 40px), 520px"
                />
                <ProgramPhoto
                  name="speaker-message"
                  caption={`技術への考え方を伝える${instructorProfile.displayName}`}
                />
              </div>
            </div>
            <InstructorEvidence />
          </div>
        </section>

        <InstagramSection />

        <section id="future" className="story-section renewal-future">
          <div className="renewal-wrap future-composition">
            <div>
              <SectionHeading number="09" english="BEYOND CERTIFICATION">
                技術を身につけた、
                <br />
                その先へ。
              </SectionHeading>
              <div className="renewal-prose">
                <p>資格取得は、学びの終わりではありません。</p>
                <p>
                  身につけた技術を日々の施術に活かし、さらに理解を深めていく。
                </p>
                <p>独立や開業を目指す人も、仲間と学び続けたい人も。</p>
                <p>自然形体療法を、これからの可能性につなげていく。</p>
              </div>
            </div>
            <ol className="future-list">
              {future.map(([title, text], i) => (
                <li key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="renewal-note future-note">
              本プログラムの資格は、国家資格や法的な開業資格の取得を示すものではありません。収入・集客・独立開業の実現を保証するものではありません。取得後のフォロー内容・参加条件・費用等は、確認後にご案内します。
            </p>
          </div>
        </section>

        <section id="courses" className="story-section renewal-tuition">
          <div className="renewal-wrap">
            <div className="section-intro-row">
              <SectionHeading number="10" english="TUITION & GETTING STARTED">
                学びの内容と、
                <br />
                受講料金。
              </SectionHeading>
              <p className="section-side-copy">
                各コース6ヶ月。
                <br />
                ご自身の学びの計画をご確認ください。
              </p>
            </div>
            <div className="tuition-courses">
              {courses.map((c) => (
                <article key={c.step} id={`tuition-${c.step}`} className="tuition-course">
                  <div>
                    <p className="renewal-kicker">STEP {c.step}</p>
                    <h3>{c.title}</h3>
                  </div>
                  <p className="tuition-duration">受講期間 <strong>6ヶ月</strong></p>
                  <div className="tuition-amount">
                    <span>受講料 / 1コース</span>
                    <p>
                      990,000<small>円（税込）</small>
                    </p>
                    <span>税抜900,000円</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="tuition-shared">
              <p className="renewal-kicker">各コース共通の研修</p>
              <p><strong>実技</strong>月1回・対面 9:00〜17:00</p>
              <p><strong>理論</strong>月1回・オンライン 1回2時間</p>
            </div>
            <div className="tuition-total">
              <p>3コースすべての受講料合計</p>
              <p>
                <strong>2,970,000円（税込）</strong>
                <span>税抜2,700,000円</span>
              </p>
            </div>
            <p className="renewal-note">
              合計は3コースすべてを受講した場合の受講料です。3コースの受講が必須かどうか、各コースの認定条件は確認後にご案内します。
            </p>
            <p className="renewal-note">
              税込額は消費税10％前提です。支払い方法・支払時期、教材費・交通費等の受講料以外の費用の有無、キャンセル規定は、正式な募集案内でご確認ください。
            </p>
            <div className="payment-preparing">
              <span className="renewal-kicker">PAYMENT INFORMATION</span>
              <h3>分割払いは、導入に向けて準備中です。</h3>
              <p>
                クレジットカード分割払いは、現時点で利用可能とはご案内していません。決済会社の審査・導入が完了し、条件が確定した後にお知らせします。
              </p>
            </div>
            <ConsultationCallout text="受講内容や料金について、気になる点をご相談ください。" />
            <a className="renewal-text-link" href="#faq">
              料金・支払いについてのFAQを見る <span aria-hidden="true">↓</span>
            </a>
            <div className="renewal-flow">
              <div className="flow-title">
                <h3>受講前に確認すること</h3>
                <span>相談前の確認ポイント</span>
              </div>
              <ol>
                {[
                  [
                    "研修の学び方",
                    "月1回の対面実技とオンライン理論で、どのように学ぶかをご確認ください。",
                  ],
                  [
                    "復習と質問",
                    "復習用動画と研修日以外の質問対応があります。利用条件は確認後にご案内します。",
                  ],
                  [
                    "受講期間・料金",
                    "各コース6ヶ月の受講期間と料金、受講料以外の費用の確認事項をご覧ください。",
                  ],
                  [
                    "受講条件",
                    "受講要件・認定基準・進級条件は確認後にご案内します。気になる点は電話でご相談ください。",
                  ],
                ].map(([title, text], i) => (
                  <li key={title}>
                    <span className="renewal-kicker">0{i + 1}</span>
                    <h4>{title}</h4>
                    <p>{text}</p>
                  </li>
                ))}
              </ol>
              <p className="renewal-note">このサイトでは、正式な受講申込み・決済は受け付けていません。</p>
            </div>
            <div className="tuition-information">
              <p>お申し込み前にご確認いただく情報</p>
              <InformationLinks />
            </div>
          </div>
        </section>

        <section id="faq" className="story-section renewal-faq">
          <div className="renewal-wrap renewal-faq-layout">
            <SectionHeading number="11" english="QUESTIONS & ANSWERS">
              学びの前に、
              <br />
              知っておきたいこと。
            </SectionHeading>
            <div className="renewal-faq-list">
              {faqs.map(([q, a], i) => (
                <details key={q}>
                  <summary>
                    <span>Q{String(i + 1).padStart(2, "0")}</span>
                    <h3>{q}</h3>
                    <span className="renewal-faq-toggle" aria-hidden="true" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
              <aside className="faq-consultation">
                <p>ほかにも気になることがありましたら、お気軽にご相談ください。</p>
                <a className="renewal-text-link" href="#contact">
                  受講相談の窓口を見る <span aria-hidden="true">↗</span>
                </a>
              </aside>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="renewal-contact"
          aria-labelledby="contact-title"
        >
          <div className="renewal-wrap">
            <p className="renewal-kicker">YOUR NEXT CHAPTER</p>
            <h2 id="contact-title">
              その「学びたい」を、
              <br />
              次の一歩に。
            </h2>
            <p>
              受講内容や研修についてのご質問は、お電話でご相談ください。
              <br />
              正式な受講申込みや決済のお手続きではありません。
            </p>
            <div className="contact-layout">
              <div className="contact-by-phone">
                <h3>受講について電話で相談する</h3>
                <a className="contact-phone" href={CONTACT_TEL}>
                  {CONTACT_PHONE}
                </a>
                <p>
                  現在の正式なお問い合わせ窓口は、お電話です。スマートフォンではタップして発信できます。
                </p>
                <p className="renewal-note">
                  受付時間・休業日は確認後にご案内します。通話料はお客様のご負担となります。
                </p>
              </div>
              <div className="contact-guidance">
                <h3>ご相談の際に</h3>
                <p>
                  受講内容・研修の進め方・料金など、気になることをお聞かせください。
                </p>
                <p>
                  お問い合わせだけで正式な受講申込みや決済が行われることはありません。
                </p>
                <ul className="consultation-topics" aria-label="相談前に確認できる内容">
                  <li><a href="#training">実技・理論の学び方を確認する</a></li>
                  <li><a href="#roadmap">資格取得のステップを確認する</a></li>
                  <li><a href="#courses">各コースの受講料金を確認する</a></li>
                </ul>
                <LineConsultationLink />
                {!getOfficialLineUrl() && (
                  <p className="renewal-note line-preparing">
                    公式LINEでのご相談は準備中です。
                  </p>
                )}
                <a className="renewal-contact-link" href="#faq">
                  よくある質問を確認する <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  inLanguage: "ja",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
                {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/#webpage`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  inLanguage: "ja",
                  isPartOf: { "@id": `${SITE_URL}/#website` },
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: operator.name,
                  url: SITE_URL,
                  telephone: CONTACT_PHONE,
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </main>
      <footer className="footer home-footer">
        <div className="container">
          <div className="footer-top">
            <a href="#main" className="brand">
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
                <div>
                  <dt>所在地</dt>
                  <dd>{operator.address ?? "確認中・確定後に掲載予定"}</dd>
                </div>
                <div>
                  <dt>電話相談</dt>
                  <dd>
                    <a href={CONTACT_TEL}>{CONTACT_PHONE}</a>
                  </dd>
                </div>
              </dl>
              <a className="footer-contact-link" href="#contact">
                お問い合わせはこちら ↗
              </a>
            </div>
            <a href="#main" className="back-top">
              PAGE TOP <span>↑</span>
            </a>
          </div>
          <InformationLinks />
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} TSUNAGi Co., Ltd.</p>
          </div>
        </div>
      </footer>
      {measurementId && <AnalyticsConsent measurementId={measurementId} />}
      <nav className="mobile-consult-bar" aria-label="スマートフォンの受講相談">
        <a
          href={CONTACT_TEL}
          aria-label={`電話で受講相談する（${CONTACT_PHONE}へ発信）`}
        >
          <svg className="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
            <path d="M7 3H4.5C3.7 3 3 3.7 3 4.5 3 13.6 10.4 21 19.5 21c.8 0 1.5-.7 1.5-1.5V17l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z" />
          </svg>
          <span className="phone-action">電話で相談する<small>{CONTACT_PHONE}</small></span>
        </a>
        {getOfficialLineUrl() ? (
          <LineConsultationLink className="mobile-line-link" />
        ) : (
          <a href="#contact" aria-label="受講相談の窓口案内へ移動">
            窓口案内を見る <span aria-hidden="true">↓</span>
          </a>
        )}
      </nav>
    </>
  );
}
