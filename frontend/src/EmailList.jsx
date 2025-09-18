import React, { useEffect, useState } from "react";

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchEmails = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/emails");
      const data = await response.json();

      if (data && data.length > 0) {
        setEmails((prevEmails) => [
          ...prevEmails, // keep old emails (log style)
          ...data,       // add new ones
        ]);
      }

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  useEffect(() => {
    fetchEmails(); // first load
    const interval = setInterval(fetchEmails, 120000); // every 2 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Email Log Viewer</h2>
      <p>Last refreshed at: {lastRefreshed || "Loading..."}</p>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          background: "#111",
          color: "#0f0",
        }}
      >
        {emails.length === 0 ? (
          <p>No emails with documents found yet.</p>
        ) : (
          emails.map((email, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p>📧 <b>From:</b> {email.from}</p>
              <p>📝 <b>Subject:</b> {email.subject}</p>
              <p>📅 <b>Date:</b> {email.date}</p>
              <p>📎 <b>Attachments:</b></p>
              <ul>
                {email.attachments.map((att, i) => (
                  <li key={i}>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#4af" }}
                    >
                      {att.filename}
                    </a>
                  </li>
                ))}
              </ul>
              <hr style={{ border: "1px solid #333" }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmailList;
