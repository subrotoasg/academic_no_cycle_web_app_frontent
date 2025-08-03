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
      <div className="rounded-[22px]  p-2 bg-white dark:bg-zinc-900 transition-transform transform group-hover:scale-105 border">
        {" "}
        <Image
          src={
            cycleSubject?.cycleSubjectImage ||
            cycleSubject?.subject?.subjectImage
          }
          alt="subject image"
          height={400}
          width={400}
          className="object-fill w-full h-40 rounded-xl"
        />
        <p className="text-center pt-2 text-neutral-700 dark:text-neutral-300">
          Title: {cycleSubject?.subject?.title}
        </p>
      </div>
    </Link>
  );
};

export default SubjectCard;
