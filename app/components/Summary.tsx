import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
    const textColor =
        score > 70
            ? 'text-green-600'
            : score > 49
            ? 'text-yellow-600'
            : 'text-red-600';

    return (
        <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-gray-900">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className={`text-lg font-semibold ${textColor}`}>
                    {score}/100
                </p>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 w-full shadow-sm">
            <div className="flex flex-row items-center px-6 py-6 gap-8">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Your Resume Score
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        This score is calculated based on the metrics below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content" score={feedback.content.score} />
            <Category title="Structure" score={feedback.structure.score} />
            <Category title="Skills" score={feedback.skills.score} />
        </div>
    );
};

export default Summary;
