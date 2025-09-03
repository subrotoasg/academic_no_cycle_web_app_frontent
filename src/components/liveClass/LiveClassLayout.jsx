import React, { useEffect, useState } from "react";
import VideoHeroSection from "./heroSection/VideoHeroSection";
import VideoCarousel from "./videoCarousel/VideoCarousel";

const LiveClassLayout = ({ data }) => {
  const { liveClasses = [], upcomingClasses = [] } = data?.data || {};
  const liveAndUpcomming = [...liveClasses, ...upcomingClasses];
  const [selectedClass, setSelectedClass] = useState(liveClasses?.[0]);
  useEffect(() => {
    if (liveClasses.length > 0 && !selectedClass) {
      setSelectedClass(liveClasses?.[0]);
    }
  }, [liveClasses, selectedClass]);

  const filteredLiveAndUpcomming = liveAndUpcomming?.filter(
    (cls) => cls.id !== selectedClass?.id
  );

  return (
    <div>
      {selectedClass && (
        <VideoHeroSection
          key={selectedClass?.id}
          selectedClass={selectedClass}
        />
      )}

      {filteredLiveAndUpcomming?.length > 0 && (
        <VideoCarousel
          videos={filteredLiveAndUpcomming}
          // title={liveClasses.length <= 1 ? "লাইভ ক্লাস" : "লাইভ ক্লাসসমূহ"}
          title={
            liveClasses?.length > 1
              ? liveClasses?.length <= 1
                ? "লাইভ ক্লাস"
                : "লাইভ ক্লাসসমূহ"
              : upcomingClasses?.length <= 1
              ? "পরবর্তী লাইভ ক্লাস"
              : "পরবর্তী লাইভ ক্লাসসমূহ"
          }
          setSelectedClass={setSelectedClass}
        />
      )}
    </div>
  );
};

export default LiveClassLayout;
