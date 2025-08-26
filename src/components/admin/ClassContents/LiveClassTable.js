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

export default function LiveClassTable({
  contentData,
  handleSort,
  handleDelete,
  //   handleEditModal,
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
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              Class No.
              <Button variant="ghost" onClick={() => handleSort("classNo")}>
                <ArrowUpDown />
              </Button>
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              Status
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
                <TableCell className="text-center border">
                  {content?.classNo || "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  {content?.status}
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => handleRedirect(content)}
                  >
                    <Video className="w-5 h-5 text-green-600" />
                  </Button>
                </TableCell>

                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => handleEditModal(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
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
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
