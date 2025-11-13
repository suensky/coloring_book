
import React from 'react';
import { Page } from '../types';

interface ColoringBookDisplayProps {
    pages: Page[];
    onDownloadPdf: () => void;
    childName: string;
}

const ColoringBookDisplay: React.FC<ColoringBookDisplayProps> = ({ pages, onDownloadPdf, childName }) => {
    const cover = pages.find(p => p.type === 'cover');
    const coloringPages = pages.filter(p => p.type === 'page');

    return (
        <div className="mt-8 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Your Coloring Book is Ready, {childName}!</h2>
                <p className="text-gray-500 mt-2">Here's a preview. Click the button below to download the full PDF.</p>
                <button
                    onClick={onDownloadPdf}
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download PDF
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cover && (
                    <div className="md:col-span-2 lg:col-span-3 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-center mb-2 text-gray-600">Cover Page</h3>
                        <img src={cover.imageData} alt="Coloring book cover" className="w-full h-auto object-contain rounded-md" />
                    </div>
                )}
                {coloringPages.map((page, index) => (
                    <div key={page.id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-center mb-2 text-gray-600">Page {index + 1}</h3>
                        <img src={page.imageData} alt={`Coloring page ${index + 1}`} className="w-full h-auto object-contain rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColoringBookDisplay;
