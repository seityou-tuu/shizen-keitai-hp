import Image from "next/image";
import observation from "@/public/images/homepage/practical-peer-observation.webp";
import guidance from "@/public/images/homepage/practical-guidance.webp";
import youtube860k from "@/public/images/homepage/youtube-860k.webp";
import youtube1320k from "@/public/images/homepage/youtube-1320k.webp";
import award from "@/public/images/homepage/fannchannel-award.webp";

// Homepage-specific assets: shared photos and PR #9 keep their existing sources.
export function HomepageTrainingPhoto({ name }: { name: "observation" | "guidance" }) {
  const observing = name === "observation";
  const caption = observing
    ? "手元を囲み、身体への触れ方を確認する研修の様子"
    : "講師の指導を間近で学ぶ実技研修の様子";
  return (
    <figure className="program-photo" data-photo={`homepage-${name}`}>
      <Image src={observing ? observation : guidance} alt={caption}
        sizes={observing ? "(max-width: 900px) 65vw, 460px" : "(max-width: 900px) calc(100vw - 80px), 620px"} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function InstructorEvidence() {
  return (
    <aside className="instructor-evidence" aria-labelledby="evidence-title">
      <div className="evidence-heading">
        <p className="renewal-kicker">MEDIA & RECOGNITION</p>
        <h3 id="evidence-title">映像での紹介と、受賞の記録。</h3>
      </div>
      <div className="evidence-layout">
        <div className="evidence-videos">
          <h4>Fann Channelでの動画紹介</h4>
          {[{ image: youtube860k, count: "86万回" }, { image: youtube1320k, count: "132万回" }].map(({ image, count }) => (
            <figure className="evidence-video" key={count}>
              <Image src={image} alt={`Fann Channelの動画掲載画面（表示再生数${count}）`}
                sizes="(max-width: 700px) 128px, 160px" />
              <figcaption>
                <span>画像に表示された再生数</span>
                <strong>{count}</strong>
                <small>出典：主催者提供のYouTube掲載画面</small>
              </figcaption>
            </figure>
          ))}
        </div>
        <figure className="evidence-award">
          <Image src={award} alt="永友先生のFANCHANNELグランプリ受賞時の集合写真"
            sizes="(max-width: 700px) calc(100vw - 80px), (max-width: 1100px) 45vw, 560px" />
          <figcaption>
            <h4>2024年 FANCHANNEL グランプリ</h4>
            <p>主催者提供の受賞時集合写真です。<br />本プログラムの受講生の集合写真ではありません。</p>
          </figcaption>
        </figure>
      </div>
      <p className="renewal-note evidence-note">
        再生数は提供画像の表示時点のものです。2本の合計をチャンネル全体の再生数として示すものではありません。
        画像内の表現は動画の掲載内容であり、施術の効果を保証するものではありません。
      </p>
    </aside>
  );
}
