"use client";

import { ArrowUpDown, UserX } from "lucide-react";
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

function AdminAssignTable({ assignedData, handleSort, handleDelete }) {
  
  return (
    <div className="overflow-x-auto mb-6">
      <Table className="min-w-full border border-gray-300 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center border text-sm md:text-base">
              Course Image
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Course Name
              <Button
                variant="ghost"
                onClick={() => handleSort("course.title")}
              >
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Admin Name
              <Button variant="ghost" onClick={() => handleSort("admin.name")}>
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>

            <TableHead className="text-center border text-sm md:text-base">
              Remove Access
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {assignedData?.length > 0 ? (
            assignedData.map((assigned, index) => (
              <TableRow key={index}>
                <TableCell className="px-2 py-2 border text-sm md:text-base">
                  {assigned?.course?.courseImage ? (
                    <Image
                      src={assigned?.course?.courseImage}
                      alt="Course image"
                      width={100}
                      height={100}
                      className="mx-auto w-16 h-12 object-fill rounded-md"
                    />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="text-center border">
                  {assigned?.course?.title}
                </TableCell>
                <TableCell className="text-center border capitalize">
                  {assigned?.admin?.name}
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(assigned)}
                  >
                    <UserX className="h-4 w-4 text-red-600" />
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

export default AdminAssignTable;
