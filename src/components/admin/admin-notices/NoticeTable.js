"use client";

import { ArrowUpDown, Edit, Info, Trash2 } from "lucide-react";
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

export function NoticeTable({
  notices,

  handleDelete,
  handleNoticeEditModal,
  handleNoticeInfoModal,
}) {
  return (
    <div className="overflow-x-auto mb-6">
      <Table className="min-w-full border border-gray-100 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-sm md:text-base border">
              Image
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              Title
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-sm md:text-base border">
              Type
            </TableHead>

            <TableHead className="text-center text-sm md:text-base border">
              Info
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
          {notices?.length > 0 ? (
            notices.map((notice) => (
              <TableRow key={notice?.id}>
                <TableCell className="text-center border">
                  <Image
                    src={notice?.image || "/routine.webp"}
                    alt={notice?.title}
                    width={200}
                    height={200}
                    className="mx-auto h-12 w-16 md:h-16 md:w-20 rounded-md object-fill"
                  />
                </TableCell>
                <TableCell className="text-center border">
                  {notice?.title}
                </TableCell>
                <TableCell className="text-center border">
                  {notice?.type}
                </TableCell>

                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNoticeInfoModal(notice)}
                  >
                    <Info className="h-4 w-4 text-blue-700" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNoticeEditModal(notice)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notice)}
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
