import UploadButton from "@/components/UploadButton/UploadButton";


export default function Home() {
  return (
  <div className="flex flex-col items-center h-screen gap-3 mt-10 mb-20">
    <h1 className="text-4xl font-bold">Upload Your File</h1>
      <p className="text-gray-500 text-wrap max-w-[500px] text-center">Generate a powerful CV tailored to your needs, with built-in analytics and even cover letter generation.</p>
    
    <UploadButton />
  </div>
  );
}

