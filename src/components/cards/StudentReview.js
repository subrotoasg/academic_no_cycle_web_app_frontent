import { AnimatedTestimonials } from "../ui/animated-testimonials";

export function StudentReviews() {
  const testimonials = [{
    quote:
      " Dhaka Medical College ভর্তি হতে পেরেছি এই প্ল্যাটফর্মের নিয়মিত ক্লাস ও কুইজের কারণে। ধন্যবাদ পুরো টিমকে!",
    name: "Rafia Binte Alam",
    designation: "Student at Dhaka Medical College",
    src: "https://www.acsfutureschool.com/_next/image?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3D1NeUpegs2v7qFtLbZSaEQF15CCRzJrJvY&w=256&q=75",
  },
    {
      quote:
        "BUET-এ ভর্তি হতে পারাটা ছিল আমার স্বপ্ন। এই প্ল্যাটফর্মের নিয়মিত গাইডলাইন এবং মক টেস্ট আমাকে সবচেয়ে বেশি সাহায্য করেছে।",
      name: "Md. Adnan Ahamed Tamim",
      designation: "Student at BUET ",
      src: "https://www.acsfutureschool.com/_next/image?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3D18KX6ejOm8Z7Q375MwbbJBkDq1YIZoUcv&w=256&q=75",
    },
    
    {
      quote:
        "এই প্ল্যাটফর্মের Biology এবং Chemistry ক্লাসগুলো ছিল DMC-র জন্য অসাধারণ প্রস্তুতি। এখন আমি মেডিকেলে!",
      name: "Tajwar Hasnat Thuha",
      designation: "Student at Dhaka Medical College",
      src: "https://www.acsfutureschool.com/_next/image?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3D1m8N08ZVzlv_wWJAbMIh3BEUJECS7pMKd&w=256&q=75",
    },
    {
      quote:
        "DU ভর্তি পরীক্ষার জন্য Math এবং Analytical-এর প্র্যাকটিস সেটগুলো আমাকে সবচেয়ে বেশি হেল্প করেছে। Highly recommended!",
      name: "Sudipto Podder",
      designation: "Student at University of Dhaka",
      src: "https://www.acsfutureschool.com/_next/image?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3D1orKw9Rogv4iah3dUXNpOOqf2CcCEuETI&w=256&q=75",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
