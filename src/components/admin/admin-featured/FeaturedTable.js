"use client";

import { Edit, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import featureImg from "../../../../public/feature.jpg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export function FeaturedTable({
  features,
  handleDelete,
  handleFeatureEditModal,
  handleFeatureInfoModal,
}) {
  console.log(features);
  return (
    <div className="overflow-x-auto mb-6">
      <Table className="min-w-full border border-gray-100 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center border text-sm md:text-base">
              Image
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Title
            </TableHead>
            <TableHead className="text-center text-sm md:text-base border">
              Cycle
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Type
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Coupon Code
            </TableHead>
            <TableHead className="text-center border text-sm md:text-base">
              Info
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
          {features?.length > 0 ? (
            features?.map((feature) => (
              <TableRow key={feature?.id}>
                <TableCell className="text-center border">
                  <Image
                    src={
                      feature?.image && feature?.image?.trim() !== ""
                        ? feature?.image
                        : featureImg
                    }
                    alt={feature?.title || "Featured image"}
                    width={200}
                    height={200}
                    className="mx-auto h-12 w-16 md:h-16 md:w-20 rounded-md object-fill"
                  />
                </TableCell>
                <TableCell className="text-center border">
                  {feature?.title}
                </TableCell>
                <TableCell className="text-center border">
                  {feature?.cycle ? feature.cycle.title : "N/A"}
                </TableCell>
                <TableCell className="text-center border">
                  {feature?.type}
                </TableCell>
                <TableCell className="text-center border">
                  {feature?.coupne || "-"}
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeatureInfoModal(feature)}
                  >
                    <Info className="h-4 w-4 text-blue-700" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeatureEditModal(feature)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(feature)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No featured items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
