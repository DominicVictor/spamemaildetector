import { useState } from "react";
import {
  HiShieldCheck,
  HiLightningBolt,
  HiExclamationCircle,
  HiCheckCircle,
  HiChartBar,
  HiSearch,
} from "react-icons/hi";
import "../styles/home.css";

interface SpamResult {
  isSpam: boolean;
  score: number;
  keywords: string[];
  message: string;
}

const HomePage = () => {
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [result, setResult] = useState<SpamResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

 const API_URL = "https://spamemaildetector-eqh2.onrender.com/predict";
 
  const handleAnalyse = async () => {
    if (!subject.trim() && !body.trim()) {
      setError("Please enter at least a subject or body.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult({
        isSpam: data.is_spam,
        score: data.spam_score,
        keywords: data.found_keywords || [],
        message: data.message || (data.is_spam ? "Spam detected!" : "Legitimate email"),
      });
    } catch (err) {
      setError("Failed to connect to spam detection server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spam-detector">
      <div className="card">
        {/* Hero section */}
        <div className="hero">
          <HiShieldCheck className="hero-icon" size={48} color="#5B9BD5" />
          <h1>Email Detector</h1>
          <p className="subtitle">Stop spam before it stops you</p>
        </div>

        {/* Subject input */}
        <input
          type="text"
          placeholder="Email subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
        />

        {/* Body textarea */}
        <textarea
          placeholder="Email body..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="input-textarea"
        />

        {/* Analyse button */}
        <button onClick={handleAnalyse} disabled={loading} className="analyse-btn">
          {loading ? (
            <span className="loader"></span>
          ) : (
            <>
              <HiLightningBolt size={18} />
              Analyse Message
            </>
          )}
        </button>

        {/* Error display */}
        {error && (
          <div className="error">
            <HiExclamationCircle size={20} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
            {error}
          </div>
        )}

        {/* Result display – RED for spam, GREEN for legit */}
        {result && (
          <div className={`result ${result.isSpam ? "spam" : "ham"}`}>
            <div className="result-badge">
              {result.isSpam ? (
                <>
                  <HiExclamationCircle size={22} color="#c0392b" />
                  <span> SPAM</span>
                </>
              ) : (
                <>
                  <HiCheckCircle size={22} color="#27ae60" />
                  <span> LEGIT</span>
                </>
              )}
            </div>
            <div className="result-message">{result.message}</div>
            <div className="result-details">
              <span>
                <HiChartBar size={16} style={{ marginRight: "0.3rem" }} />
                Spam score: {result.score}
              </span>
              {result.keywords?.length > 0 && (
                <span>
                  <HiSearch size={16} style={{ marginRight: "0.3rem" }} />
                  Keywords: {result.keywords.join(", ")}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;