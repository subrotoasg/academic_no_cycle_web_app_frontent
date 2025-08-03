import React from 'react';
import Image from 'next/image';

export default async function Page() {

  const profileInfo = await fetch('https://shop.aparsclassroom.com/profile/info?uid=RoyV322jE3Rcz5S5NLawxTpzXhh2')
    const profileData = await profileInfo.json()
    const data = profileData?.data;

  return (
    <div className=" flex items-center justify-center p-4 mt-20">
      <div className=" dark:bg-gray-800  max-w-4xl w-full p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            <Image
              src={data?.photo || 'https://i.pravatar.cc/300'}
              alt={data?.Name || 'Profile Picture'}
              width={192}
              height={192}
              className="rounded-full border-4 border-blue-800 dark:border-blue-900 mx-auto hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-2xl font-bold text-blue-800 dark:text-white mt-4">{data?.Name || 'Loading...'}</h1>
            <a
              href={data?.FbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {data?.FbName}
            </a>
            <p className="text-gray-600 dark:text-gray-300">{data?.Institution || 'Institution'}</p>
          </div>

          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-white mb-4">About Me</h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <InfoItem label="Email" value={data?.Email} />
              <InfoItem label="HSC Batch" value={data?.HSC} />
              <InfoItem label="Number" value={data?.Phone} />
              <InfoItem label="Parent's Number" value={data?.Parent} />
              <InfoItem label="Roll" value={data?.roll} />
              <InfoItem label="Address" value={data?.Address} />
            </div>            

            <h2 className="text-xl font-semibold text-blue-800 dark:text-white mb-4">Enrolled Courses</h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              {data?.Courses?.length > 0 ? (
                data.Courses.map((course, index) => (
                  <div key={index} className="bg-blue-100 dark:bg-gray-700 p-2 rounded">
                    <div className="font-medium">{course.course} ({course.code})</div>
                    <div className="text-sm">
                      Batch: {course.batch} <br />
                      Branch: {course.branch} 
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses enrolled.</p>
              )}
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex">
      <span className="font-medium md:w-40 text-gray-600 dark:text-gray-400">{label}</span>
      <span>: {value || 'Not provided'}</span>
    </div>
  );
}
