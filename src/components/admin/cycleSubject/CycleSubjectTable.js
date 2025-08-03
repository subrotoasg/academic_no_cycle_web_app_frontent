"use client";
import { ArrowUpDown, Trash2, Edit } from "lucide-react";
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
import React from "react";
import Swal from "sweetalert2";
import { useDeleteCycleSubjectMutation } from "@/redux/services/cycleSubjectApi";

function CycleSubjectTable({ cycleSubjects, handleCycleSubjectEditModal }) {
  const [deleteCycleSubject] = useDeleteCycleSubjectMutation();

  const handleDelete = async (subject) => {
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${subject.subject?.title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteCycleSubject(subject.id);
      Swal.fire({
        title: "Deleted!",
        text: `"${subject.subject?.title}" has been successfully deleted.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="overflow-x-auto mb-6">
      <Table className="min-w-full border border-gray-300 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center border text-sm md:text-base">
              Cycle
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Subject
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Image
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Edit
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(cycleSubjects) && cycleSubjects.length > 0 ? (
            cycleSubjects.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center border">
                  {item.cycle?.title}
                </TableCell>
                <TableCell className="text-center border">
                  {item.subject?.title}
                </TableCell>
                <TableCell className="text-center border">
                  <Image
                    src={item?.cycleSubjectImage || item?.subject?.subjectImage}
                    alt={item.subject?.title}
                    width={200}
                    height={200}
                    className="mx-auto h-12 w-16 md:h-16 md:w-20 rounded-sm object-fill"
                  />
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCycleSubjectEditModal(item)}
                  >
                    <Edit className="h-4 w-4 text-yellow-500" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default CycleSubjectTable;
