import { PhotoPlaceholder } from "@/components/ui";

export function PublicTreatment() {
  return (
    <section
      id="public-treatment"
      className="section public-treatment"
      aria-labelledby="public-treatment-title"
    >
      <div className="container">
        <div className="public-treatment-heading">
          <p className="eyebrow">OPEN PRACTICE / 公開施術</p>
          <h2 id="public-treatment-title">
            技術に向き合う姿勢を、
            <br />
            目の前で。
          </h2>
          <p className="public-treatment-lead">
            実際の施術を、公開する機会。
            <br />
            自然形体療法の技術を伝える、一つのかたちです。
          </p>
        </div>
        <div className="public-treatment-grid">
          <div>
            <PhotoPlaceholder label="OPEN PRACTICE" caption="公開施術の写真" />
            <p className="public-photo-caption">
              写真は準備中です。実際の写真を、掲載許諾の確認後にご紹介します。
            </p>
          </div>
          <div className="public-treatment-copy">
            <span className="public-treatment-label">
              施術を公開するということ
            </span>
            <h3>
              技術を見せる。
              <br />
              その姿勢も、伝える。
            </h3>
            <p>
              自然形体療法には、実際の施術を公開する機会があります。人の目に触れる場で技術を示すことを通して、施術への自信や、技術に向き合う姿勢を伝えます。
            </p>
            <p>
              ここで紹介するのは、公開施術という機会の存在です。特定の施術効果や学習成果を保証するものではありません。
            </p>
            <aside className="public-treatment-notice">
              <strong>開催・参加について</strong>
              <p>
                開催日・場所・実施者・参加条件は確認中です。本プログラムの受講に公開施術への参加・見学・受講が含まれるかは未確定であり、参加等をお約束するものではありません。
              </p>
            </aside>
            <a className="public-treatment-link" href="#training">
              プログラムの実技・理論研修を見る <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
