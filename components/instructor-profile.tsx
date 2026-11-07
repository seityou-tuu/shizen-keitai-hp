import {
  instructorProfile,
  type InstructorProfile as Profile,
} from "@/lib/instructor";

export function InstructorProfile({
  profile = instructorProfile,
}: {
  profile?: Profile;
}) {
  const background = profile.background.filter((value) => value.trim());
  const qualifications = profile.qualifications.filter((value) => value.trim());
  const achievements = (profile.achievements ?? []).filter((value) => value.trim());
  const hasBiography = !!(
    profile.formalName.trim() ||
    profile.role?.trim() ||
    achievements.length ||
    background.length ||
    qualifications.length ||
    profile.practiceExperience.trim() ||
    profile.teachingExperience.trim()
  );
  const hasDetails = hasBiography || !!profile.message.trim();
  return (
    <div className="renewal-prose">
      <h3 className="instructor-name">{profile.displayName}</h3>
      <p className="instructor-learning-lead">技術を覚えるだけで終わらない。</p>
      <p>目の前の身体をどう捉え、どのように触れるか。{profile.displayName}の技術を見ながら、その背景にある考え方を学びます。</p>
      <div className="instructor-teaching-view" aria-label="研修で学ぶ視点">
        <p><strong>実技で確かめる</strong><span>触れ方と力加減、身体の反応を観察する。</span></p>
        <p><strong>理論で考える</strong><span>なぜその施術を行うのか、理由への理解を深める。</span></p>
      </div>
      {hasDetails ? (
        <>
          {hasBiography && (
            <dl className="instructor-details">
              {profile.formalName.trim() && (
                <div>
                  <dt>氏名</dt>
                  <dd>{profile.formalName}</dd>
                </div>
              )}
              {background.length > 0 && (
                <div>
                  <dt>経歴</dt>
                  <dd>
                    <ul>
                      {background.map((value, i) => (
                        <li key={i}>{value}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              {qualifications.length > 0 && (
                <div>
                  <dt>保有資格</dt>
                  <dd>
                    <ul>
                      {qualifications.map((value, i) => (
                        <li key={i}>{value}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              {profile.practiceExperience.trim() && (
                <div>
                  <dt>施術歴</dt>
                  <dd>{profile.practiceExperience}</dd>
                </div>
              )}
              {profile.role?.trim() && (
                <div>
                  <dt>役職</dt>
                  <dd>{profile.role}</dd>
                </div>
              )}
              {achievements.length > 0 && (
                <div>
                  <dt>実績</dt>
                  <dd>
                    <ul>
                      {achievements.map((value, i) => <li key={i}>{value}</li>)}
                    </ul>
                  </dd>
                </div>
              )}
              {profile.teachingExperience.trim() && (
                <div>
                  <dt>指導実績</dt>
                  <dd>{profile.teachingExperience}</dd>
                </div>
              )}
            </dl>
          )}
          {profile.message.trim() && (
            <blockquote className="instructor-message">
              <p>{profile.message}</p>
            </blockquote>
          )}
        </>
      ) : (
        <p className="renewal-note">
          詳しいプロフィールは、確認が取れた内容から順次ご紹介します。
        </p>
      )}
    </div>
  );
}
