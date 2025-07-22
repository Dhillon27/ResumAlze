import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading your resume...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("❌ Upload failed.");

    setStatusText("Converting PDF to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText("❌ Image conversion failed.");

    setStatusText("Uploading preview image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("❌ Image upload failed.");

    setStatusText("Preparing analysis...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing resume...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("❌ Analysis failed.");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("✅ Done! Redirecting...");
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-white text-black min-h-screen font-sans">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Smart Feedback for Your Dream Job
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Get insights and tips to improve your resume with AI using <strong>ResumAlze</strong>.
          </p>
        </div>

        {isProcessing ? (
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-700 font-medium">{statusText}</p>
            <img
              src="/images/resume-scan.gif"
              alt="Processing..."
              className="mx-auto w-48"
            />
          </div>
        ) : (
          <form
            id="upload-form"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-6"
          >
            <div>
              <label
                htmlFor="company-name"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company-name"
                name="company-name"
                placeholder="e.g. Google"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="job-title"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <input
                type="text"
                id="job-title"
                name="job-title"
                placeholder="e.g. Software Engineer"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="job-description"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description
              </label>
              <textarea
                id="job-description"
                name="job-description"
                rows={5}
                placeholder="Paste the job description here..."
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="uploader"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Resume (PDF)
              </label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
            >
              Analyze Resume with ResumAlze
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Upload;
