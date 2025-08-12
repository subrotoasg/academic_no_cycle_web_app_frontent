import Image from "next/image";
import React from "react";
import { TicketPercent, Gift, BookmarkCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import featureImg from "../../../public/feature.jpg";

function FeaturedCard({ feature }) {
  return (
    <div className="max-w-xs h-full flex flex-col  border border-gray-300 rounded-lg shadow-sm bg-blue-300 hover:scale-[1.05] ">
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        {feature?.type && (
          <span className="absolute flex items-center gap-1 bottom-2 right-2 bg-slate-300 font-bold text-blue-600 text-xs px-2 py-1 rounded-full z-10">
            {feature.type === "Discount" && (
              <>
                <BookmarkCheck className="h-4 w-4" />
                Discount
              </>
            )}
            {feature.type === "Coupon" && (
              <>
                <TicketPercent className="h-4 w-4" />
                Code
                {feature?.coupne && (
                  <span className="ml-1 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                    {feature.coupne}
                  </span>
                )}
              </>
            )}
            {feature.type === "Offer" && (
              <>
                <Gift className="h-4 w-4" />
                Offer
              </>
            )}
          </span>
        )}
        <Image
          className="w-full h-full object-cover p-1 rounded-sm bg-gray-200"
          src={
            feature?.image && feature.image.trim() !== ""
              ? feature.image
              : featureImg
          }
          alt="featured image"
          width={400}
          height={400}
        />
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 capitalize">
            {feature?.title}
          </h5>

          {/* {feature?.description && (
            <p className="mb-3 text-gray-800 dark:text-gray-400 font-medium">
              {feature.description.length > 100
                ? feature.description.slice(0, 100) + "..."
                : feature.description}
            </p>
          )} */}
        </div>

        <div className="mt-auto flex justify-end">
          <Link
            href={feature?.url || "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button
              type="button"
              className="text-white border flex justify-center items-center border-black text-sm font-semibold px-4 py-2 rounded-lg hover:rounded-full bg-blue-900 hover:bg-blue-700 transition"
            >
              {feature?.type === "Discount"
                ? "Purchase Now"
                : feature?.type === "Coupon"
                ? "Apply Coupon"
                : "View Gift"}
              <ArrowRight className="h-4 w-5 ps-1" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCard;
