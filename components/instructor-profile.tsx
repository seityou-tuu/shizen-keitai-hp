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
      <p>
        自然形体療法の技術を、{profile.displayName}の施術を見ながら学びます。
      </p>
      <p>
        細かな触れ方や身体の反応を確認しながら、技術への理解を深めていきます。
      </p>
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
