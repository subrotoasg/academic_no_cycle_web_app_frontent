import SubjectCard from "../cards/SubjectCard";

const SubjectFeature = ({ courseSubjects }) => {
  return (
    <div className="container mx-auto p-2">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-center text-blue-500 mb-8">
          📚 Available Subjects
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {courseSubjects.map((cs, index) => (
          <div
            key={cs.id}
            data-aos-delay={index * 300}
            className="transition-transform transform hover:scale-105"
          >
            <SubjectCard key={cs.id} cycleSubject={cs} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectFeature;
