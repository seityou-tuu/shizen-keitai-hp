import Image from "next/image";
import treatmentMain from "@/public/images/treatment-main.jpg";
import treatmentDetail from "@/public/images/treatment-detail.jpg";
import instructorPortrait from "@/public/images/instructor-portrait.jpg";
import speakerMessage from "@/public/images/speaker-message.jpg";
import practicalHandsOn from "@/public/images/practical-hands-on.jpg";
import practicalObservation from "@/public/images/practical-observation.jpg";
import classroomSession from "@/public/images/classroom-session.jpg";
import groupGuidance from "@/public/images/group-guidance.jpg";

const photos = {
  "treatment-main": treatmentMain,
  "treatment-detail": treatmentDetail,
  "instructor-portrait": instructorPortrait,
  "speaker-message": speakerMessage,
  "practical-hands-on": practicalHandsOn,
  "practical-observation": practicalObservation,
  "classroom-session": classroomSession,
  "group-guidance": groupGuidance,
};

export function ProgramPhoto({ name, caption, priority = false, sizes = "(max-width: 900px) calc(100vw - 40px), 600px" }: {
  name: keyof typeof photos;
  caption: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="program-photo">
      <Image src={photos[name]} alt={caption}
        sizes={sizes} priority={priority} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
