import React, { useState } from "react";
import axios from "axios";

const termOptions = [
  "Freshman Fall", "Freshman Winter", "Freshman Spring", "Freshman Summer",
  "Sophomore Fall", "Sophomore Winter", "Sophomore Spring", "Sophomore Summer",
  "Junior Fall", "Junior Winter", "Junior Spring", "Junior Summer",
  "Senior Fall", "Senior Winter", "Senior Spring", "Senior Summer"
];

const gradeOptions = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "E"];

function App() {
  const [selectedTerm, setSelectedTerm] = useState(termOptions[0]);
  const [terms, setTerms] = useState({});
  const [inputGrade, setInputGrade] = useState("");
  const [gpaData, setGpaData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddGrade = () => {
    if (inputGrade && gradeOptions.includes(inputGrade)) {
      setTerms(prevTerms => ({
        ...prevTerms,
        [selectedTerm]: [...(prevTerms[selectedTerm] || []), inputGrade]
      }));
      setInputGrade("");
    }
  };

  const handleMarkOffTerm = () => {
    setTerms(prevTerms => ({
      ...prevTerms,
      [selectedTerm]: "Off-Term"
    }));
  };

  const handleClearTerm = () => {
    setTerms(prevTerms => {
      const newTerms = { ...prevTerms };
      delete newTerms[selectedTerm];
      return newTerms;
    });
  };

  const calculateGPA = async () => {
    try {
      const response = await axios.post("dartmouth-gpa-frontend-kofqpw6xa-izzyallen876s-projects.vercel.app", { terms });
      setGpaData(response.data);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while calculating GPA.");
      }
    }
  };

  const clearAllData = () => {
    setTerms({});
    setGpaData(null);
    setErrorMessage("");
  };

  return (
    <div style={{
      backgroundImage: "url('/background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        padding: 30, maxWidth: 650, width: "90%",
        textAlign: "center", borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <h1 style={{ color: "#00703C", fontSize: "36px", fontWeight: "600" }}>Dartmouth GPA Calculator</h1>

        <label style={{ fontSize: "18px", fontWeight: "500" }}>Select Term:</label>
        <select 
          value={selectedTerm} 
          onChange={(e) => setSelectedTerm(e.target.value)}
          style={{
            padding: "12px", margin: "10px", fontSize: "16px",
            backgroundColor: "#00703C", color: "white", borderRadius: "8px",
            fontWeight: "500"
          }}
        >
          {termOptions.map(term => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>

        <br />

        <input
          type="text"
          value={inputGrade}
          onChange={(e) => setInputGrade(e.target.value)}
          placeholder="Enter grade (A, B+, etc.)"
          list="gradeList"
          style={{
            padding: "14px", fontSize: "16px", borderRadius: "8px",
            margin: "10px", border: "2px solid #00703C", fontWeight: "500"
          }}
        />
        <datalist id="gradeList">
          {gradeOptions.map((grade, index) => (
            <option key={index} value={grade} />
          ))}
        </datalist>

        <br />

        <button onClick={handleAddGrade} style={{
          padding: "12px", fontSize: "16px", backgroundColor: "#00703C",
          color: "white", borderRadius: "8px", border: "none", cursor: "pointer", margin: "5px",
          fontWeight: "500"
        }}>
          Add Grade
        </button>
        <button onClick={handleMarkOffTerm} style={{
          padding: "12px", fontSize: "16px", backgroundColor: "#C0A46E",
          color: "white", borderRadius: "8px", border: "none", cursor: "pointer", margin: "5px",
          fontWeight: "500"
        }}>
          Mark as Off-Term
        </button>
        <button onClick={handleClearTerm} style={{
          padding: "12px", fontSize: "16px", backgroundColor: "#DC3545",
          color: "white", borderRadius: "8px", border: "none", cursor: "pointer", margin: "5px",
          fontWeight: "500"
        }}>
          Clear This Term
        </button>

        <h3 style={{ color: "#343a40", fontWeight: "500" }}>Selected Term: {selectedTerm}</h3>
        <p style={{ fontSize: "16px", fontWeight: "400" }}>{terms[selectedTerm] ? terms[selectedTerm].toString() : "No Courses Added"}</p>

        <button onClick={calculateGPA} style={{
          padding: "12px", fontSize: "16px", backgroundColor: "#00703C",
          color: "white", borderRadius: "8px", border: "none", cursor: "pointer", margin: "5px",
          fontWeight: "500"
        }}>
          Calculate GPA
        </button>
        <button onClick={clearAllData} style={{
          padding: "12px", fontSize: "16px", backgroundColor: "#DC3545",
          color: "white", borderRadius: "8px", border: "none", cursor: "pointer", margin: "5px",
          fontWeight: "500"
        }}>
          Clear All Data
        </button>

        {errorMessage && <p style={{ color: "red", fontWeight: "500" }}>{errorMessage}</p>}

        {gpaData && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ color: "#00703C", fontWeight: "600" }}>Cumulative GPA: {gpaData.cumulative_gpa}</h2>
            <h3 style={{ color: "#343a40", fontWeight: "500" }}>Term GPAs:</h3>
            <ul>
              {Object.entries(gpaData.term_gpas).map(([term, gpa]) => (
                <li key={term}><strong>{term}:</strong> {gpa}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
