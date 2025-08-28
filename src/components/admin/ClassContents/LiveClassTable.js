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
import { useLazyJoinLiveClassQuery } from "@/redux/services/liveClassApi";
import { toast } from "sonner";

export default function LiveClassTable({
  contentData,
  handleSort,
  handleDelete,
  handleEditModal,
}) {
  // console.log(contentData);
  const [triggerJoinClass, { isFetching }] = useLazyJoinLiveClassQuery();
  const handleJoin = async (videoId) => {
    try {
      const result = await triggerJoinClass({ videoId }).unwrap();
      // console.log(result);

      if (result?.success) {
        toast.success("Successfully joined the class");
        // if you want to redirect when success includes a joinUrl
        if (result?.joinUrl) {
          window.open(result.joinUrl, "_blank");
        }
      } else {
        toast.error("Failed to join class. Please try again.");
      }
    } catch (err) {
      console.error("Join failed:", err);
      toast.error("Failed to join class. Please try again.");
    }
  };

  return (
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
              Join
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
            contentData.map((content) => (
              <TableRow key={content.id}>
                <TableCell className="font-medium text-center border">
                  {content?.courseSubject?.title || "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  {content?.courseSubjectChapter?.title || "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  {content?.title}
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
                <TableCell className="text-center border">
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleJoin(content?.videoId)}
                    disabled={isFetching}
                  >
                    <Video className="w-5 h-5 text-green-600" />
                  </Button> */}
                  N/A
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(content)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
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
  );
}
