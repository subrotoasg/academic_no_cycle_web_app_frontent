"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

function CycleTable({ cycles, handleCycleInfoEdit, handleCycleDelete }) {
  return (
    <div className="overflow-x-auto ">
      <Table className="min-w-full text-center border border-gray-300">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center border text-sm md:text-base">
              Course
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Cycle Image
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Cycle Title
            </TableHead>
            <TableHead className="text-center border whitespace-nowrap">
              Edit
            </TableHead>
            <TableHead className="text-center border whitespace-nowrap">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cycles.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="p-2 border text-sm md:text-base">
                {item?.course?.title}
              </TableCell>
              <TableCell className="p-2 border text-sm md:text-base">
                <Image
                  src={item.cycleImage}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="mx-auto h-12 w-16 md:h-16 md:w-20 rounded-sm object-fill"
                />
              </TableCell>
              <TableCell className="p-2 border text-sm md:text-base">
                {item.title}
              </TableCell>
              <TableCell className="p-2 border text-sm md:text-base">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCycleInfoEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TableCell>
              <TableCell className="p-2 border text-sm md:text-base">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => handleCycleDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CycleTable;
