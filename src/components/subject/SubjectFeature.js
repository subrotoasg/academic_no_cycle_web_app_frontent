import { useSelector } from "react-redux";
import SubjectCard from "../cards/SubjectCard";
// import { selectCourse } from "@/redux/Features/courseInfo";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";

const SubjectFeature = () => {
  // const course = useSelector(selectCourse);
  const courseId = "a220ea44-dfb4-4d4d-a073-50f6bd7d6669";
  const { data: subjectData, isLoading } =
    useGetSubjectsByCourseIdQuery(courseId);

  if (!subjectData || subjectData?.data?.length === 0) {
    return null;
  }

  const subjects = subjectData?.data;
  return (
    <div className="container mx-auto p-2">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 mb-8">
          📚 Available Subjects
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Explore the subjects available in the course and find the perfect fit
          for your academic path.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {subjects.map((cs, index) => (
          <div
            key={cs.id}
            data-aos="fade-up"
            data-aos-delay={index * 300}
            className="transition-transform transform hover:scale-105"
          >
            <SubjectCard key={cs.id} courseSubject={cs} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectFeature;
