"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowUpDown, Edit, Trash2, Video, X } from "lucide-react";
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
import { useJoinLiveClassQuery } from "@/redux/services/liveClassApi";
import ProtectedIframe from "@/components/liveClass/protectIframe/ProtectedIframe";

export default function LiveClassTable({
  contentData = [],
  handleSort,
  handleDelete,
  handleEditModal,
}) {
  const [selectedJoinClass, setSelectedJoinClasses] = useState(null);
  const { data, isFetching, isLoading, refetch } = useJoinLiveClassQuery(
    { id: selectedJoinClass },
    { skip: !selectedJoinClass }
  );

  const joinUrl = data?.data?.isLiveUrl;
  const isLiveClassStart = data?.data?.isLive;

  const handleJoin = async (content) => {
    if (!content?.id) {
      toast.error("Invalid class ID");
      return;
    }
    setSelectedJoinClasses(content.id);
  };
  useEffect(() => {
    if (!isLoading && selectedJoinClass && !joinUrl) {
      const t = setTimeout(() => {
        if (!joinUrl && !isFetching) {
          toast.error("Unable to get join URL for this class.");
        }
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isLoading, isFetching, joinUrl, selectedJoinClass]);

  return (
    <>
      {joinUrl ? (
        <ProtectedIframe joinUrl={joinUrl} />
      ) : isFetching || isLoading ? (
        <div className="relative w-full aspect-video bg-black">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg md:text-xl font-semibold text-white text-center">
              Joining class, please wait...
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto mb-6">
          <Table className="min-w-full border border-gray-100 text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-sm md:text-base border">
                  Delete
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Edit
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Join Class
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Time
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Status
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Class Title
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Class Description
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Instructor
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Chapter
                </TableHead>
                <TableHead className="text-center text-sm md:text-base border">
                  Subject
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {contentData?.length > 0 ? (
                contentData.map((content) => (
                  <TableRow key={content?.id}>
                    <TableCell className="text-center border">
                      <Button
                        variant="ghost"
                        disabled={true} //button temporaty disabled
                        size="icon"
                        onClick={() => handleDelete && handleDelete(content)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>

                    <TableCell className="text-center border">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={true} //button temporaty disabled
                        onClick={() =>
                          handleEditModal && handleEditModal(content)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
                      {content?.startTime
                        ? new Date(content.startTime).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "N/A"}
                    </TableCell>

                    <TableCell className="text-center border">
                      {content?.status || "N/A"}
                    </TableCell>

                    <TableCell className="text-center border">
                      {content?.title || "N/A"}
                    </TableCell>

                    <TableCell className="text-center border">
                      {content?.description || "N/A"}
                    </TableCell>

                    <TableCell className="text-center border">
                      {content?.instructor || "N/A"}
                    </TableCell>

                    <TableCell className="text-center border">
                      {content?.courseSubjectChapter?.chapterName || "N/A"}
                    </TableCell>

                    <TableCell className="font-medium text-center border">
                      {content?.courseSubject?.subjectName || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center border">
                    No live class found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
