import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
  { title: "ResumAlze | Review" },
  { name: "description", content: "Detailed overview of your resume" },
]);

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
    };

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0 bg-white text-black">
      <nav className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
          <img src="/icons/back.svg" alt="back" className="w-3 h-3" />
          Back to Homepage
        </Link>
      </nav>

      <div className="flex flex-col lg:flex-row w-full">
        {/* Resume Preview */}
        <aside className="lg:w-1/2 sticky top-0 p-6 bg-gray-50 flex items-center justify-center min-h-[60vh]">
          {imageUrl && resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img
                src={imageUrl}
                className="w-full max-w-md object-contain rounded-xl shadow-lg"
                alt="Resume Preview"
              />
            </a>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full max-w-md" />
          )}
        </aside>

        {/* Resume Feedback */}
        <section className="lg:w-1/2 p-8 space-y-8">
          <h2 className="text-3xl font-semibold">Resume Review</h2>

          {feedback ? (
            <>
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
              <Details feedback={feedback} />
            </>
          ) : (
            <p className="text-gray-600">Fetching feedback...</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
