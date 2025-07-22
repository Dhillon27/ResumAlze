import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumAlze" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-white text-black min-h-screen font-sans">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-4xl font-bold">Your Resume Library</h1>

          <Link
            to="/upload"
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-md font-semibold transition"
          >
            Upload New Resume
          </Link>

          <p className="text-gray-600 text-lg mt-4 max-w-xl">
            Upload and track your resumes with instant AI feedback using <strong>ResumAlze</strong>.
          </p>
        </div>

        {loadingResumes ? (
          <div className="flex justify-center mt-16">
            <img
              src="/images/resume-scan-2.gif"
              alt="Loading..."
              className="w-[200px] opacity-70"
            />
          </div>
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-12 space-y-4">
            <p className="text-gray-600 text-lg">
              You haven’t uploaded any resumes yet.
            </p>
            <Link
              to="/upload"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-medium"
            >
              Upload Your First Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
