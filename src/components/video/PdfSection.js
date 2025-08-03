
import { useState } from "react";
import PDFViewer from "./PDFViewer"; 

const TABS_CONFIG = [
  {
    key: "lectureSheet",
    label: "Lecture PDF",
    styles: "bg-blue-500 hover:bg-blue-600",
    activeStyles: "bg-blue-700",
  },
  {
    key: "practiceSheet",
    label: "Practice Sheet",
    styles: "bg-green-500 hover:bg-green-600",
    activeStyles: "bg-green-700",
  },
  {
    key: "solutionSheet",
    label: "Solution Sheet",
    styles: "bg-purple-500 hover:bg-purple-600",
    activeStyles: "bg-purple-700",
  },
];

/**
 * 
 * @param {{ classContent: object }} props
 */
const PdfSection = ({ classContent }) => {
    const [activeTab, setActiveTab] = useState(null);
  
    const availableTabs = TABS_CONFIG.filter(tab => classContent[tab.key]);
  
    if (availableTabs.length === 0) return null;
  
    const toggleTab = (key) => {
      setActiveTab(prev => (prev === key ? null : key));
    };
    
    return (
      <>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {availableTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => toggleTab(tab.key)}
              className={`px-5 py-2 rounded-md font-semibold text-sm transition text-white ${
                activeTab === tab.key ? tab.activeStyles : tab.styles
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {activeTab && (
            <PDFViewer
              id={classContent[activeTab]}
              title={TABS_CONFIG.find(t => t.key === activeTab)?.label || "PDF"}
            />
          )}
        </div>
      </>
    );
  };
  
  export default PdfSection;