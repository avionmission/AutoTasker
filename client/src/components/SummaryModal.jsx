import { generateSummary } from "../api";

export default function SummaryModal({ show, setShow, summary, setSummary }) {
  if (!show) return null;

  const handleGenerate = async () => {
    try {
      const res = await generateSummary();
      setSummary(res.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error generating summary. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Daily Summary</h2>
        <pre>
          {summary || "Click Generate to create your summary."}
        </pre>
        <div className="modal-buttons">
          <button 
            onClick={handleGenerate} 
            className="btn-primary">
            Generate
          </button>
          <button 
            onClick={() => setShow(false)} 
            className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
