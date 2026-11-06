import { instructorProfile as profile, historicalYouTubeRecord } from "@/lib/instructor";
import { ProgramPhoto } from "@/components/program-photo";

/** Editorial description of the existing program, never a fabricated interview. */
export function CohortInstructor() {
  return (
    <section id="cohort-instructor" className="recruitment-section recruitment-wrap cohort-instructor-feature">
      <div className="cohort-teacher-heading">
        <div><p className="recruitment-eyebrow">INSTRUCTOR</p><h2>永友先生から、<br />技術と考え方を学ぶ。</h2></div>
        <p><span>映像で気になった技術を、</span><span>永友裕也から直接。</span><span>実技と理論を通して、</span><span>その背景にある考え方まで学びます。</span></p>
      </div>
      <div className="cohort-teacher-visual">
        <div className="cohort-teacher-portrait cohort-photo"><ProgramPhoto name="instructor-portrait" caption={`${profile.formalName}先生`} sizes="(max-width: 700px) calc(100vw - 80px), 440px" /></div>
        <dl className="cohort-teacher-metrics">
          <div><dt>施術歴</dt><dd>{profile.practiceExperience}</dd></div>
          <div><dt>{historicalYouTubeRecord.label}</dt><dd>{historicalYouTubeRecord.total}</dd></div>
        </dl>
        <p className="recruitment-note cohort-teacher-source">再生回数は主催者確認の過去情報です。最新の再生数を示すものではなく、施術効果や指導成果を保証するものではありません。</p>
      </div>
      <div className="cohort-teacher-bio">
        <p className="cohort-teacher-role">{profile.role}</p>
        <h3>{profile.formalName}<span>先生</span></h3>
        <dl className="cohort-teacher-history">
          <div><dt>保有資格</dt><dd>{profile.qualifications.map(value => <p key={value}>{value}</p>)}</dd></div>
          <div><dt>経歴</dt><dd>{profile.background.map(value => <p key={value}>{value}</p>)}</dd></div>
        </dl>
        <aside className="cohort-teacher-method" aria-labelledby="cohort-method-title">
          <p className="recruitment-eyebrow">THE WAY WE LEARN</p>
          <h3 id="cohort-method-title">技術の背景まで、<br />理解を深める。</h3>
          <p>技術だけでなく、身体をどう捉え、なぜその施術を行うのか。実技と理論を通して、考え方への理解も深めていきます。</p>
        </aside>
        <a className="recruitment-text-link" href="#cohort-learning">実技と理論の学び方を確認する <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

