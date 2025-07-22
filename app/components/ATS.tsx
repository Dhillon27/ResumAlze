import React from 'react';

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background color based on score
  const bgClass = score > 69
    ? 'bg-[#1f3d1a]'
    : score > 49
      ? 'bg-[#3e3914]'
      : 'bg-[#3d1f1f]';

  const borderClass = score > 69
    ? 'border-green-600'
    : score > 49
      ? 'border-yellow-600'
      : 'border-red-600';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  return (
    <div className={`w-full p-6 rounded-lg border ${bgClass} ${borderClass}`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="ATS Score Icon" className="w-10 h-10" />
        <div>
          <h2 className="text-xl font-semibold text-white">ATS Score - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">{subtitle}</h3>
        <p className="text-sm text-[#aaa] mb-4">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        {/* Suggestions list */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Check" : "Warning"}
                className="w-4 h-4 mt-1"
              />
              <p className={suggestion.type === "good" ? "text-green-400" : "text-yellow-400"}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <p className="text-sm text-[#bbb] italic">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  );
};

export default ATS;
