"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export function SubjectsTable({
  Subjects,
  handleDelete,
  handleSubjectEditModal,
}) {
  return (
    <div className="overflow-x-auto mb-6">
      <Table className="min-w-full border border-gray-100 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-sm md:text-base border">
              Subject Name
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              Subject Image
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
          {Subjects?.length > 0 ? (
            Subjects.map((Subject) => (
              <TableRow key={Subject?.id}>
                <TableCell className="text-center border">
                  {Subject?.title || Subject?.subject?.title || "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  <Image
                    src={
                      Subject?.courseSubjectImage ||
                      Subject?.subject?.subjectImage
                    }
                    alt={
                      Subject?.title ||
                      Subject?.subject?.title ||
                      "Subject Image"
                    }
                    width={200}
                    height={200}
                    className="mx-auto h-12 w-16 md:h-16 md:w-20 rounded-md object-fill"
                  />
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSubjectEditModal(Subject)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(Subject)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center border">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
