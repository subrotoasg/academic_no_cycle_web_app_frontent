import { useGetCycleClassContentByChapterIdQuery } from "@/redux/services/cycleClassContentApi";

/**
 *
 * @param {{ chapterId: string }} props
 */
const RelatedLessons = ({ chapterId }) => {
  const { data: chapterContentsData, isLoading } =
    useGetCycleClassContentByChapterIdQuery(chapterId, {
      skip: !chapterId,
    });

  const chapterContents = chapterContentsData?.data;

  return (
    <aside>
      <h2 className="md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Related Lessons
      </h2>
      <div className="space-y-2">
        {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
        {!isLoading && chapterContents?.length > 0
          ? chapterContents.map((content) => (
              <a
                key={content.id}
                href={`/content/${content.id}?title=${encodeURIComponent(
                  content.classTitle
                )}`}
                className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              >
                <strong className="text-gray-900 dark:text-white">
                  {content.classNo}
                </strong>
                <span className="text-gray-600 dark:text-gray-300">
                  {" "}
                  — {content.classTitle}
                </span>
              </a>
            ))
          : !isLoading && (
              <p className="text-sm text-gray-500">No related lessons found.</p>
            )}
      </div>
    </aside>
  );
};

export default RelatedLessons;
