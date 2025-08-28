"use client";

import { ArrowUpDown, Edit, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useState } from "react";
import { useJoinLiveClassQuery } from "@/redux/services/liveClassApi";

export default function LiveClassTable({
  contentData = [],
  handleSort,
  handleDelete,
  handleEditModal,
}) {
  const [selectedJoinClass, setSelectedJoinClasses] = useState(null);
  const { data, isFetching, isLoading } = useJoinLiveClassQuery(
    {
      id: selectedJoinClass,
    },
    { skip: !selectedJoinClass }
  );

  const handleJoin = async (content) => {
    if (!content?.id) {
      toast.error("Invalid class ID");
      return;
    }
    setSelectedJoinClasses(() => content?.id);
  };
  const liveClassUrl = data?.data?.isLiveUrl;
  const isLiveClassStart = data?.data?.isLive;
  if (liveClassUrl) {
    return window.location.replace(liveClassUrl);
  }

  return (
    <>
      {!isLoading ? (
        <>
          <div className="overflow-x-auto mb-6">
            <Table className="min-w-full border border-gray-100 text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center text-sm md:text-base border">
                    Subject
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Chapter
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Class Title
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Class Description
                  </TableHead>
                  {/* <TableHead className="text-center text-sm md:text-base border">
              Class No.
              <Button variant="ghost" onClick={() => handleSort("classNo")}>
                <ArrowUpDown />
              </Button>
            </TableHead> */}
                  <TableHead className="text-center text-sm md:text-base border">
                    Instructor
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Status
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Time
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Join Class
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Edit
                  </TableHead>
                  <TableHead className="text-center text-sm md:text-base border">
                    Delete
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contentData?.length > 0 ? (
                  contentData?.map((content) => (
                    <TableRow key={content?.id}>
                      <TableCell className="font-medium text-center border">
                        {content?.courseSubject?.subjectName || "N/A"}
                      </TableCell>
                      <TableCell className="text-center border">
                        {content?.courseSubjectChapter?.chapterName || "N/A"}
                      </TableCell>
                      <TableCell className="text-center border">
                        {content?.title}
                      </TableCell>
                      <TableCell className="text-center border">
                        {content?.description}
                      </TableCell>
                      {/* <TableCell className="text-center border">
                  {content?.classNo || "N/A"}
                </TableCell> */}
                      <TableCell className="text-center border">
                        {content?.instructor}
                      </TableCell>
                      <TableCell className="text-center border">
                        {content?.status}
                      </TableCell>
                      <TableCell className="text-center border">
                        {new Date(content?.startTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell
                        className="text-center border cursor-pointer"
                        onClick={() => handleJoin(content)}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`cursor-pointer`}
                        >
                          <Video className="w-6 h-6 text-green-600 hover:text-blue-900 transition-colors duration-200" />
                        </Button>
                      </TableCell>

                      <TableCell className="text-center border">
                        {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditModal(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button> */}
                        N/A
                      </TableCell>
                      <TableCell className="text-center border">
                        {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(content)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button> */}
                        N/A
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center border">
                      No live class found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full aspect-video bg-black">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg md:text-xl font-semibold text-white text-center">
                Joining class, please wait...
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
