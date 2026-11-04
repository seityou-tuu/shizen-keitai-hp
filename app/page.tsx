import { Header } from "@/components/header";
import { InformationLinks } from "@/components/information-links";
import { ProgramPhoto } from "@/components/program-photo";
import { SectionHeading } from "@/components/ui";

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
const features = [
  ["身体にやさしい施術", "強い刺激を避け、身体の状態に合わせて施術する。"],
  ["身体の変化を体感", "施術前後の動きや反応を丁寧に確認する。"],
  ["呼吸まで捉える", "身体のわずかな変化まで目を向ける繊細な観察。"],
  ["再現性を追求する", "感覚だけに頼らず、理論と実技を重ねる。"],
];
const support = [
  ["講師による直接指導", "実技を通して触れ方や力加減、身体の反応を学ぶ。"],
  ["理論を深く理解", "なぜその技術を使うのか、考え方から理解する。"],
  ["復習用動画を提供", "主催者が提供する復習用動画で、研修後も振り返ることができる。"],
  ["研修日以外も質問できる", "研修日以外にも疑問を質問できるため、学びを継続できる。"],
];
const future = [
  ["施術の選択肢が広がる", "これまでの施術に、新たな技術や視点を取り入れる。"],
  ["技術への理解を深める", "理論と実践を重ねながら、自分の判断力や技術を磨く。"],
  ["独立・開業にも活かせる", "将来の施術活動や開業に向けて、学んだ技術を活かす可能性を広げる。"],
  ["資格取得後も学べる", "取得後のフォローを通して、技術を継続して深める。"],
  ["仲間とつながる", "同じ技術を学ぶ人たちとの交流や学び合いにつなげる。"],
];
const faqs = [
  ["未経験でも受講できますか？", "はい。未経験者と施術経験者の両方を対象としています。未経験の方には、身体への触れ方や施術の理論を一から学ぶ機会としてご案内しています。具体的な受講要件は、正式な募集案内でご確認ください。"],
  ["実技と理論はどのくらいの頻度ですか？", "実技研修は月1回、対面で9:00〜17:00。理論研修は月1回、オンラインで1回2時間です。各コースの受講期間は6ヶ月です。具体的な日程・実技会場・オンラインの受講方法は確認中です。"],
  ["研修日以外にも質問できますか？", "はい。研修日以外にも疑問を質問できる環境を設けています。質問方法・対応時間・利用条件の詳細は、確認後にご案内します。"],
  ["復習用動画はありますか？", "はい。主催者が提供する復習用動画で、研修後も振り返ることができます。視聴方法・提供範囲・視聴期間などの詳細は、確認後にご案内します。"],
  ["資格取得後にも学べますか？", "資格取得後も、フォローを通して技術を継続して深めていくことを大切にしています。具体的なサポート内容・参加条件・費用等は、確認後にご案内します。"],
  ["料金と支払い方法は？", "各コース990,000円（税込）／900,000円（税抜）、3コース合計2,970,000円（税込）／2,700,000円（税抜）です（消費税10％前提）。クレジットカード分割払いは導入に向けて準備中で、現在利用可能とはご案内していません。支払い方法・支払時期・追加費用の有無は確認中です。"],
  ["資格の認定条件は？", "準師範→師範→本部師範の順に学びます。資格認定の基準・進級条件・詳しいカリキュラムは確認中です。本プログラムの資格は、国家資格や法的な開業資格の取得を示すものではありません。"],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">本文へ移動</a>
      <Header />
      <main id="main" className="program-renewal">
        <section className="renewal-hero" aria-labelledby="hero-title">
          <div className="renewal-wrap hero-composition">
            <div className="hero-statement">
              <p className="renewal-kicker">01 / SHIZEN KEITAI EDUCATION</p>
              <p className="hero-for">施術に向き合う、あなたの次の一歩へ。</p>
              <h1 id="hero-title">驚きを、<br />憧れで終わらせない。<br /><em>次は、あなたが<br className="hero-break" />学ぶ番だ。</em></h1>
              <div className="hero-introduction">
                <p>強い力に頼らない、やさしい施術。</p>
                <p>呼吸や身体のわずかな反応まで丁寧に捉える、自然形体療法。</p>
                <p>理論で理解し、実技で体感し、繰り返し磨いていく。<br />その技術を、あなた自身の手に。</p>
              </div>
              <a className="renewal-button" href="#roadmap">資格取得プログラムを見る <span aria-hidden="true">↗</span></a>
              <a className="renewal-text-link" href="#training">研修風景を見る <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-photograph">
              <span className="photo-overline">THE ART OF A GENTLE TOUCH</span>
              <ProgramPhoto name="treatment-main" caption="自然形体療法の施術風景" priority sizes="(max-width: 900px) calc(100vw - 40px), 55vw" />
              <div className="hero-photo-word" aria-hidden="true">その手で、<br />学びを深める。</div>
              <p className="hero-photo-detail">理論を知る。実技で確かめる。</p>
            </div>
          </div>
          <div className="hero-facts renewal-wrap" aria-label="プログラムの基本情報">
            <p>自然形体療法<br /><strong>資格取得プログラム</strong></p>
            <dl>
              <div><dt>対象</dt><dd>施術経験者・未経験者</dd></div>
              <div><dt>学び方</dt><dd>対面の実技 ＋ オンラインの理論</dd></div>
              <div><dt>ステップ</dt><dd>3段階・各コース6ヶ月</dd></div>
            </dl>
          </div>
        </section>

        <section id="about" className="story-section renewal-about">
          <div className="renewal-wrap editorial-split">
            <div className="about-photograph">
              <ProgramPhoto name="treatment-detail" caption="身体の反応を確かめながら行う施術" />
              <p className="photo-footnote">A GENTLE TOUCH, A THOUGHTFUL APPROACH.</p>
            </div>
            <div className="editorial-copy">
              <SectionHeading number="02" english="ABOUT SHIZEN KEITAI">痛くない施術には、<br />理由がある。</SectionHeading>
              <div className="renewal-prose">
                <p>自然形体療法が大切にしているのは、身体に無理な負担をかけず、その反応を丁寧に捉えること。</p>
                <p>手の触れ方、身体の動き、呼吸の変化。<br />一つひとつに目を向けながら、理論に基づいて施術を組み立てます。</p>
                <p>施術前後の身体の状態を確かめ、その変化から学ぶ。<br />ただ手順を覚えるだけではない、技術の奥深さがあります。</p>
              </div>
              <p className="renewal-note">感じ方や身体の反応には個人差があります。痛みがないことや、医学的な効果・治癒を保証するものではありません。</p>
            </div>
          </div>
        </section>

        <section id="features" className="story-section renewal-features">
          <div className="renewal-wrap">
            <div className="section-intro-row">
              <SectionHeading number="03" english="FOUR PERSPECTIVES">その一手には、<br />理由がある。</SectionHeading>
              <p className="section-side-copy">触れる。確かめる。理解する。<br />技術の土台となる、4つの視点。</p>
            </div>
            <ol className="perspective-grid">
              {features.map(([title, text], i) => <li key={title}>
                <span className="perspective-number">0{i + 1}</span>
                <span className={`perspective-mark mark-${i + 1}`} aria-hidden="true"><i /><i /><i /></span>
                <h3>{title}</h3><p>{text}</p>
              </li>)}
            </ol>
          </div>
        </section>

        <section id="audience" className="story-section renewal-audience">
          <div className="renewal-wrap">
            <SectionHeading number="04" english="YOUR NEXT POSSIBILITY">今の技術に、<br />もう一つの可能性を。</SectionHeading>
            <div className="renewal-audience-grid">
              <article>
                <p className="renewal-kicker">FOR PRACTITIONERS</p>
                <span className="audience-subject">接骨院・整体院などで施術を行っている方へ</span>
                <h3>積み重ねた経験に、<br />新しい視点を。</h3>
                <p>施術経験がある方には、今までの技術に新たな考え方や選択肢を加える学びとして。</p>
              </article>
              <article>
                <p className="renewal-kicker">FOR BEGINNERS</p>
                <span className="audience-subject">これから施術を学びたい方へ</span>
                <h3>その興味を、<br />最初の一歩に。</h3>
                <p>これから施術を始めたい方には、身体への触れ方や施術の理論を一から学ぶ機会として。</p>
              </article>
            </div>
            <p className="audience-closing">経験の有無にかかわらず、技術を深く学びたいという思いを大切にしています。</p>
          </div>
        </section>

        <section id="support" className="story-section renewal-support">
          <div className="renewal-wrap support-composition">
            <div>
              <SectionHeading number="05" english="LEARNING & SUPPORT">学んだその日だけで、<br />終わらせない。</SectionHeading>
              <div className="renewal-prose">
                <p className="prose-lead">学んで、試して、振り返る。</p>
                <p>疑問が生まれたら質問し、また次の研修で深めていく。</p>
                <p>自然形体療法では、技術の習得に向けて繰り返し学べる環境を大切にしています。</p>
              </div>
              <a className="renewal-text-link" href="#faq">サポートについてのFAQ <span aria-hidden="true">↗</span></a>
            </div>
            <ol className="support-list">
              {support.map(([title, text], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
            </ol>
          </div>
          <div className="renewal-wrap">
            <p className="renewal-note support-note">復習用動画の視聴方法・期間、質問方法・対応時間などの利用条件は、確認後にご案内します。</p>
          </div>
        </section>

        <section id="training" className="story-section renewal-training">
          <div className="renewal-wrap">
            <SectionHeading number="06" english="INSIDE THE TRAINING">技術を、目で見て、<br />手で感じる。</SectionHeading>
            <article className="training-story">
              <div className="training-main-photo"><ProgramPhoto name="practical-hands-on" caption="講師の技術を間近で学ぶ実技研修" sizes="(max-width: 900px) calc(100vw - 40px), 65vw" /></div>
              <div className="training-story-copy">
                <p className="renewal-kicker">PRACTICAL TRAINING</p><h3>身体で確かめる、<br />実技の時間。</h3>
                <div className="renewal-prose"><p>講師の技術を間近で見ながら、実際に手を動かして学ぶ。</p><p>手の位置、力加減、身体への触れ方など、言葉だけでは伝わりにくい細かな部分まで確認していきます。</p></div>
                <dl className="training-details"><div><dt>開催頻度</dt><dd>月1回</dd></div><div><dt>受講形式</dt><dd>対面（オフライン）</dd></div><div><dt>研修時間</dt><dd>9:00〜17:00</dd></div></dl>
                <p className="renewal-note">会場・開催日・具体的な指導内容、休憩時間を含む時間配分は確認中です。</p>
              </div>
            </article>
            <div className="training-secondary-photo"><ProgramPhoto name="practical-observation" caption="手の位置や身体への触れ方を確認する様子" /></div>
            <article className="training-story theory-story">
              <div className="training-story-copy">
                <p className="renewal-kicker">THEORETICAL TRAINING</p><h3>その技術の、<br />理由を知る。</h3>
                <div className="renewal-prose"><p>なぜ、その施術を行うのか。</p><p>身体の状態や反応をどのように捉え、施術につなげていくのか。</p><p>感覚だけに頼らず、技術の背景にある考え方を学びます。</p></div>
                <dl className="training-details"><div><dt>開催頻度</dt><dd>月1回</dd></div><div><dt>受講形式</dt><dd>オンライン</dd></div><div><dt>研修時間</dt><dd>1回2時間</dd></div></dl>
                <p className="renewal-note">使用ツール・開催日時・具体的な学習内容は確認中です。</p>
              </div>
              <div><ProgramPhoto name="classroom-session" caption="座学・講義の風景" /><p className="renewal-note">写真は対面での座学・講義の様子です。オンライン理論研修の画面ではありません。</p></div>
            </article>
            <div className="training-atmosphere-story">
              <div><p className="renewal-kicker">LEARN TOGETHER</p><h3>同じ場で、<br />学びを重ねる。</h3><p>機会によっては、実際の施術を見学できる場合もあります。</p><p className="renewal-note">施術見学は確約されたカリキュラムではありません。公開施術の開催日・場所・実施者・参加条件、本プログラムへの参加・見学等の包含は未確定です。</p></div>
              <ProgramPhoto name="group-guidance" caption="研修での指導・学び合いの雰囲気" />
            </div>
          </div>
        </section>

        <section id="roadmap" className="story-section renewal-roadmap">
          <div className="renewal-wrap">
            <div className="section-intro-row">
              <SectionHeading number="07" english="YOUR LEARNING PATH" light>学びを重ね、<br />次の段階へ。</SectionHeading>
              <p className="section-side-copy">準師範から、師範、本部師範へ。<br />理論と実技を重ねる3つのステップ。</p>
            </div>
            <ol className="renewal-step-grid">
              {courses.map(c => <li key={c.step}><p className="renewal-kicker">STEP {c.step}</p><h3>{c.title}</h3><p className="step-english">{c.english}</p><p className="step-description">{c.text}</p><p className="step-period">受講期間 <strong>6</strong> ヶ月</p></li>)}
            </ol>
            <div className="roadmap-common"><p>各コース共通</p><span>実技：月1回・対面 9:00〜17:00</span><span>理論：月1回・オンライン 1回2時間</span></div>
            <p className="renewal-note">各コースの受講期間の合算は18ヶ月です。連続開講時期は未確認のため、18ヶ月での資格取得を確約するものではありません。各研修6回は月1回×6ヶ月で算出した目安です。正式な開催日程・振替、詳しいカリキュラム・認定基準・進級条件は確認中です。</p>
          </div>
        </section>

        <section id="instructors" className="story-section renewal-instructors">
          <div className="renewal-wrap">
            <div className="instructor-introduction">
              <SectionHeading number="08" english="INSTRUCTORS">一つひとつの技術に、<br />向き合う。</SectionHeading>
              <div className="renewal-prose"><p>自然形体療法の技術を、講師の施術を見ながら学ぶ。</p><p>細かな触れ方や身体の反応を確認しながら、技術への理解を深めていきます。</p><p className="renewal-note">氏名・経歴・保有資格・担当コースなどの講師情報は、確認が取れた情報のみ掲載します。</p></div>
            </div>
            <div className="renewal-instructor-photos"><ProgramPhoto name="instructor-portrait" caption="講師紹介" /><ProgramPhoto name="speaker-message" caption="講師・メッセージ紹介" /></div>
          </div>
        </section>

        <section id="future" className="story-section renewal-future">
          <div className="renewal-wrap future-composition">
            <div>
              <SectionHeading number="09" english="BEYOND CERTIFICATION">技術を身につけた、<br />その先へ。</SectionHeading>
              <div className="renewal-prose"><p>資格取得は、学びの終わりではありません。</p><p>身につけた技術を日々の施術に活かし、さらに理解を深めていく。</p><p>独立や開業を目指す人も、仲間と学び続けたい人も。</p><p>自然形体療法を、これからの可能性につなげていく。</p></div>
            </div>
            <ol className="future-list">{future.map(([title,text],i)=><li key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
            <p className="renewal-note future-note">本プログラムの資格は、国家資格や法的な開業資格の取得を示すものではありません。収入・集客・独立開業の実現を保証するものではありません。取得後のフォロー内容・参加条件・費用等は、確認後にご案内します。</p>
          </div>
        </section>

        <section id="courses" className="story-section renewal-tuition">
          <div className="renewal-wrap">
            <div className="section-intro-row"><SectionHeading number="10" english="TUITION & GETTING STARTED">学びの内容と、<br />受講料金。</SectionHeading><p className="section-side-copy">各コース6ヶ月。<br />ご自身の学びの計画をご確認ください。</p></div>
            <div className="tuition-courses">{courses.map(c => <article key={c.step} className="tuition-course"><div><p className="renewal-kicker">STEP {c.step}</p><h3>{c.title}</h3><p>{c.text}</p></div><dl><div><dt>受講期間</dt><dd>6ヶ月</dd></div><div><dt>実技研修</dt><dd>月1回・対面<br />9:00〜17:00</dd></div><div><dt>理論研修</dt><dd>月1回・オンライン<br />1回2時間</dd></div></dl><div className="tuition-amount"><span>受講料 / 1コース</span><p>990,000<small>円（税込）</small></p><span>税抜900,000円</span></div></article>)}</div>
            <div className="tuition-total"><p>3コースすべての受講料合計</p><p><strong>2,970,000円（税込）</strong><span>税抜2,700,000円</span></p></div>
            <p className="renewal-note">税込額は消費税10％前提です。支払い方法・支払時期、教材費・交通費等の受講料以外の費用の有無、キャンセル規定は、正式な募集案内でご確認ください。</p>
            <div className="payment-preparing"><span className="renewal-kicker">PAYMENT INFORMATION</span><h3>分割払いは、導入に向けて準備中です。</h3><p>クレジットカード分割払いは、現時点で利用可能とはご案内していません。決済会社の審査・導入が完了し、条件が確定した後にお知らせします。</p></div>
            <div className="renewal-flow"><div className="flow-title"><h3>受講までの流れ</h3><span>以下は仮案です</span></div>
              <ol>{[
                ["お問い合わせ", "まずはプログラムへの関心や、ご質問をお寄せいただく流れを想定しています。"],
                ["プログラムのご案内", "研修内容・開催日程・受講条件などの詳細をご確認いただきます。"],
                ["お申し込み", "内容や規約にご同意のうえ、正式なお申し込みへ進みます。"],
                ["受講スタート", "受講に必要な準備をご案内し、研修の開始を迎えます。"],
              ].map(([title,text],i)=><li key={title}><span className="renewal-kicker">0{i+1}</span><h4>{title}</h4><p>{text}</p></li>)}</ol>
              <p className="renewal-note">正式な受付・申し込み手順は未確定です。上記はご案内の構成案であり、現在のお申し込み受付を示すものではありません。</p>
            </div>
            <div className="tuition-information"><p>お申し込み前にご確認いただく情報</p><InformationLinks /></div>
          </div>
        </section>

        <section id="faq" className="story-section renewal-faq">
          <div className="renewal-wrap renewal-faq-layout"><SectionHeading number="11" english="QUESTIONS & ANSWERS">学びの前に、<br />知っておきたいこと。</SectionHeading><div className="renewal-faq-list">{faqs.map(([q,a],i)=><details key={q}><summary><span>Q{String(i+1).padStart(2,"0")}</span><h3>{q}</h3><span className="renewal-faq-toggle" aria-hidden="true" /></summary><p>{a}</p></details>)}</div></div>
        </section>
        <section id="contact" className="renewal-contact" aria-labelledby="contact-title"><div className="renewal-wrap">
          <p className="renewal-kicker">YOUR NEXT CHAPTER</p><h2 id="contact-title">その「学びたい」を、<br />次の一歩に。</h2><p>受講についての疑問や、プログラムの詳細など。<br />ご相談窓口の準備が整い次第、こちらでご案内します。</p>
          <p className="contact-availability"><span aria-hidden="true" />受講相談・お問い合わせ窓口は準備中です</p><p className="renewal-note">現在、このページからのお問い合わせ・お申し込みはできません。<br />連絡先・フォーム送信先は、確定後に掲載します。</p><a className="renewal-contact-link" href="#faq">よくある質問を確認する <span aria-hidden="true">↗</span></a>
        </div></section>
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
