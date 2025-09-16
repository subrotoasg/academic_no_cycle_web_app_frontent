"use client";

import { ArrowUpDown, Edit, Info, TvMinimalPlay, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ContentTable({
  contentData,
  handleSort,
  handleContentDelete,
  handleRedirect,
  handleContentInfoModal,
  handleContentEditModal,
}) {
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
              <Button variant="ghost" onClick={() => handleSort("classTitle")}>
                <ArrowUpDown />
              </Button>
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              Class No.
              <Button variant="ghost" onClick={() => handleSort("classNo")}>
                <ArrowUpDown />
              </Button>
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              Watch
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              More Info
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
                  {content?.cycleSubjectChapter?.cycleSubject?.title ||
                    content?.cycleSubjectChapter?.cycleSubject?.subject
                      ?.title ||
                    "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  {content?.cycleSubjectChapter?.title ||
                    content?.cycleSubjectChapter?.chapter?.chapterName ||
                    "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  {content?.classTitle || "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  {content?.classNo || "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRedirect(content)}
                  >
                    <TvMinimalPlay className="w-5 h-5 text-green-600" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleContentInfoModal(content)}
                  >
                    <Info className="h-4 w-4 text-blue-700" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleContentEditModal(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleContentDelete(content)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center border">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
