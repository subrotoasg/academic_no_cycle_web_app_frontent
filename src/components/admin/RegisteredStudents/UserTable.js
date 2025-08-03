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
import { ArrowUpDown, Edit, Trash } from "lucide-react";

export default function UserTable({
  data,
  handleSort,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="overflow-x-auto mt-6">
      <h1 className="md:text-xl font-bold text-center my-5">
        Student Details Information
      </h1>
      <Table className="min-w-full border border-gray-300 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Name
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="p-0 font-medium"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Email
              <Button
                variant="ghost"
                onClick={() => handleSort("email")}
                className="font-medium"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Phone
              <Button
                variant="ghost"
                onClick={() => handleSort("phone")}
                className="font-medium"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Edit
            </TableHead>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-2 py-2 border text-sm md:text-base">
                  {user.name}
                </TableCell>
                <TableCell className="px-2 py-2 border text-sm md:text-base">
                  {user.email}
                </TableCell>
                <TableCell className="px-2 py-2 border text-sm md:text-base">
                  {user.phone}
                </TableCell>
                <TableCell className="px-2 py-2 border text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
                <TableCell className="px-2 py-2 border text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-4 text-red-600 text-sm md:text-base"
              >
                Sorry, no matched data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
