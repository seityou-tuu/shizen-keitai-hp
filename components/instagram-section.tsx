import Image from "next/image";
import heel from "@/public/images/instagram/heel.webp";
import knee from "@/public/images/instagram/knee.webp";
import shin from "@/public/images/instagram/shin.webp";
import { INSTAGRAM_PROFILE_URL, instagramReels, instagramReelUrl } from "@/lib/instagram";
import "@/app/instagram-section.css";

const images = { heel, knee, shin };

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramSection() {
  return (
    <section id="instagram" className="instagram-section" aria-labelledby="instagram-title">
      <div className="renewal-wrap">
        <div className="instagram-intro">
          <div>
            <p className="instagram-eyebrow"><InstagramIcon /> INSTAGRAM / @ngtmyy_1990</p>
            <h2 id="instagram-title"><span>施術と考え方を、</span><span>映像で確かめる。</span></h2>
          </div>
          <p className="instagram-description">
            永友先生のInstagramで、自然形体療法の施術の様子や身体への向き合い方をご覧いただけます。
            気になる映像から、その考え方に触れてみてください。
          </p>
        </div>
        <p className="instagram-swipe">左右にスワイプしてご覧ください</p>
        <ul className="instagram-reels" tabIndex={0} aria-label="Instagramリール動画3本">
          {instagramReels.map((reel, index) => (
            <li key={reel.id}>
              <a className="instagram-reel" href={instagramReelUrl(reel.id)} target="_blank" rel="noopener noreferrer"
                aria-label={`Instagramリール${index + 1}を見る：提供画像の見出し「${reel.coverLabel}」（新しいタブで開きます）`}>
                <div className="instagram-reel-image">
                  <Image src={images[reel.image]} alt={`Instagramリールの提供画像（${reel.coverLabel}の見出し）`}
                    sizes="(max-width: 700px) 280px, (max-width: 1100px) 28vw, 300px" />
                  <span className="instagram-reel-icon"><InstagramIcon /></span>
                  <span className="instagram-play" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="currentColor" focusable="false"><path d="M5 3.5 12 8l-7 4.5z" /></svg>
                  </span>
                </div>
                <span className="instagram-reel-caption"><span>REEL 0{index + 1}</span>映像を見る <span aria-hidden="true">↗</span></span>
                <span className="instagram-reel-subject">提供画像の見出し：{reel.coverLabel}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="instagram-footer">
          <p className="instagram-note">サムネイルは提供画像です。画像内の表現や再生数は提供画像の表示時点のものであり、施術効果を保証するものではありません。映像はInstagram（外部サイト）で開きます。</p>
          <a className="instagram-account" href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer"
            aria-label="Instagramを見る（新しいタブで開きます）"><InstagramIcon />Instagramを見る<span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
