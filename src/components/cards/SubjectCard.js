import Image from "next/image";
import Link from "next/link";
import { BackgroundGradient } from "../ui/background-gradient";

const SubjectCard = ({ cycleSubject }) => {
  return (
    <Link
      href={{
        pathname: `/subject/${cycleSubject?.id}`,
        query: {
          title: cycleSubject?.subject?.title,
        },
      }}
      className="group block"
    >
      <div data-aos="fade-up ">
        <BackgroundGradient className="rounded-[22px]  p-4 bg-white dark:bg-zinc-900 transition-transform transform group-hover:scale-105">
          <Image
            src={
              cycleSubject?.cycleSubjectImage ||
              cycleSubject?.subject?.subjectImage
            }
            alt="subject image"
            height={400}
            width={400}
            className="object-fill w-full h-40 rounded-t-2xl"
          />
          <p className="text-center pt-2 text-neutral-700 dark:text-neutral-300">
            {cycleSubject?.subject?.title}
          </p>
        </BackgroundGradient>
      </div>
    </Link>
  );
};

export default SubjectCard;
