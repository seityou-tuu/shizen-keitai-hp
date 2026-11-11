import Image from "next/image";
import awardPhoto from "@/public/images/homepage/fannchannel-award.webp";
import { instructorProfile as profile, historicalYouTubeRecord, instructorAward } from "@/lib/instructor";
import { ProgramPhoto } from "@/components/program-photo";

/** Editorial description of the existing program, never a fabricated interview. */
export function CohortInstructor() {
  return (
    <section id="cohort-instructor" className="recruitment-section recruitment-wrap cohort-instructor-feature">
      <div className="cohort-teacher-heading">
        <p className="recruitment-eyebrow">INSTRUCTOR</p><h2>永友先生から、<br />技術と考え方を学ぶ。</h2>
        <p><span>映像で気になった技術を、</span><span>永友裕也から直接。</span><span>実技と理論を通して、</span><span>その背景にある考え方まで学びます。</span></p>
      </div>
      <div className="cohort-teacher-visual">
        <div className="cohort-teacher-portrait cohort-photo"><ProgramPhoto name="instructor-portrait" caption={`${profile.formalName}先生`} sizes="(max-width: 700px) calc(100vw - 80px), 440px" /></div>

        <figure className="cohort-teacher-award-record">
          <Image src={awardPhoto} alt="主催者提供の受賞時集合写真" sizes="(max-width: 700px) calc(100vw - 40px), 500px" />
          <figcaption>
            <h3>映像で知った技術を、今度は直接。</h3>
            <p>実技だけでなく、その背景にある考え方まで。永友先生の指導のもと、理論と実技を重ねて学びます。</p>
            <p className="recruitment-note">主催者提供の受賞時の記録です。本プログラムの受講生の集合写真ではありません。</p>
          </figcaption>
        </figure>
      </div>
      <div className="cohort-teacher-bio">
        <p className="cohort-teacher-role">{profile.role}</p>
        <h3>{profile.formalName}<span>先生</span></h3>
        <dl className="cohort-teacher-history">
          <div><dt>保有資格</dt><dd>{profile.qualifications.map(value => <p key={value}>{value}</p>)}</dd></div>
          <div><dt>経歴</dt><dd>{profile.background.map(value => <p key={value}>{value}</p>)}</dd></div>
        </dl>
        <div className="cohort-teacher-award">
          <p className="recruitment-eyebrow">AWARD</p>
          <h3>{instructorAward.label}</h3>
        </div>
        <dl className="cohort-teacher-metrics">
          <div><dt>施術歴</dt><dd>{profile.practiceExperience}</dd></div>
          <div><dt>{historicalYouTubeRecord.label}</dt><dd>{historicalYouTubeRecord.total}</dd></div>
        </dl>
        <p className="recruitment-note cohort-teacher-source">再生回数は主催者確認の過去情報です。最新の再生数を示すものではなく、施術効果や指導成果を保証するものではありません。</p>
        <aside className="cohort-teacher-method" aria-labelledby="cohort-method-title">
          <p className="recruitment-eyebrow">THE WAY WE LEARN</p>
          <h3 id="cohort-method-title">見た技術を、<br />自分の学びへ。</h3>
          <p>永友先生から直接学ぶ、第1期生の6ヶ月。実技で確認した触れ方を、理論と照らして振り返る。復習用動画や研修日以外の質問も活用し、疑問をひとつずつ確かめていきます。</p>
        </aside>
        <div className="cohort-teacher-next-links">
          <a className="recruitment-text-link" href="#cohort-learning">実技と理論の学び方を確認する <span aria-hidden="true">↗</span></a>
          <a className="recruitment-text-link" href="#cohort-contact">受講前の疑問を相談する <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}

