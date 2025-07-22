import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        };

        loadResume();
    }, [imagePath]);

    return (
        <Link
            to={`/resume/${id}`}
            className="block rounded-md overflow-hidden shadow-md hover:shadow-lg transition border border-gray-200 bg-white"
        >
            <div className="flex items-start justify-between p-4">
                <div className="flex flex-col gap-1">
                    {companyName && <h2 className="text-lg font-semibold text-gray-900 break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-sm text-gray-600 break-words">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="text-lg font-semibold text-gray-900">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl && (
                <div className="w-full h-[350px] max-sm:h-[200px] overflow-hidden border-t border-gray-200">
                    <img
                        src={resumeUrl}
                        alt="resume"
                        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
                    />
                </div>
            )}
        </Link>
    );
};

export default ResumeCard;
