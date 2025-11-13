
import React from 'react';

interface UserInputProps {
    theme: string;
    setTheme: (theme: string) => void;
    childName: string;
    setChildName: (name: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ theme, setTheme, childName, setChildName, onGenerate, isLoading }) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700">Let's Create a Magical Coloring Book!</h2>
                <p className="text-gray-500 mt-2">Enter a theme and a name to start the magic.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <input
                        type="text"
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="e.g., Magical Forest Animals"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
                    <input
                        type="text"
                        id="childName"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="e.g., Lily"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="text-center">
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !theme || !childName}
                    className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                        </>
                    ) : 'Generate Coloring Book'}
                </button>
            </div>
        </div>
    );
};

export default UserInput;
