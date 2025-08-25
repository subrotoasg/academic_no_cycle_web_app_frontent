import React, { useEffect, useState } from "react";
import VideoHeroSection from "./heroSection/VideoHeroSection";
import VideoCarousel from "./videoCarousel/VideoCarousel";

const LiveClassLayout = ({ data }) => {
  const { liveClasses = [], upcomingClasses = [] } = data?.data || {};
  const [selectedClass, setSelectedClass] = useState(liveClasses?.[0]);
  const liveAndUpcomming = [...liveClasses, ...upcomingClasses];
  useEffect(() => {
    if (liveClasses.length > 0 && !selectedClass) {
      setSelectedClass(liveClasses[0]);
    }
  }, [liveClasses, selectedClass]);
  const filteredLiveAndUpcomming = liveAndUpcomming?.filter(
    (cls) => cls.id !== selectedClass?.id
  );
  return (
    <div className="">
      {liveClasses?.length > 0 && (
        <VideoHeroSection selectedClass={selectedClass} />
      )}

      {filteredLiveAndUpcomming?.length > 0 && (
        <VideoCarousel
          videos={filteredLiveAndUpcomming}
          title="লাইভ ক্লাসসমূহ"
          setSelectedClass={setSelectedClass}
        />
      )}
    </div>
  );
};

export default LiveClassLayout;
