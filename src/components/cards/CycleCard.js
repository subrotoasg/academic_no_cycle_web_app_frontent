import Image from "next/image";
import Link from "next/link";

const CycleCard = ({ cycle }) => {
  return (
    <Link
      href={{
        pathname: `/cycles/${cycle?.id}`,
        query: { title: cycle?.title },
      }}
      className="group block "
    >
      <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform group-hover:scale-110">
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={cycle?.cycleImage}
            alt="cycle image"
            className="w-full h-full object-fit group-hover:opacity-90"
            width={300}
            height={200}
          />
        </div>

        <div className="text-center p-5">
          <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {cycle?.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CycleCard;
