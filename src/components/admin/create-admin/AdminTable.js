import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminTable = ({ admins }) => {
  return (
    <div className="overflow-x-auto mb-6 p-2">
      <Table className="min-w-full border border-gray-300 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Name
            </TableHead>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Phone
            </TableHead>
            <TableHead className="px-2 py-2 border text-center text-sm md:text-base">
              Email
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => {
            return (
              <TableRow key={admin.admin.id}>
                <TableCell className="px-2 py-2 border text-sm md:text-base capitalize">
                  {admin.admin.name}
                </TableCell>
                <TableCell className="px-2 py-2 border text-sm md:text-base">
                  {admin.admin.phone}
                </TableCell>
                <TableCell className="px-2 py-2 border text-sm md:text-base">
                  {admin.admin.email}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTable;
