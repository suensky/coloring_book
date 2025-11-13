
import React from 'react';

interface GenerationProgressProps {
    message: string;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ message }) => {
    return (
        <div className="mt-8 p-4 bg-rose-100 border border-rose-200 rounded-lg text-center">
            <div className="flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-rose-400 animate-ping mr-3"></div>
                <p className="text-rose-700 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default GenerationProgress;
