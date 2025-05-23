import { useState } from "react";
import { useLocation } from "react-router-dom"; 
import axios from "axios";
import { variables } from "../Variables";

function BulkEmailForm() {
  const location = useLocation();
  const initialEmails = location.state?.selectedEmails || []; 
  const [selectedEmails, setSelectedEmails] = useState(initialEmails);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleQueryChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/employee/emails?query=${value}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (email) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails([...selectedEmails, email]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const removeEmail = (emailToRemove) => {
    setSelectedEmails(
      selectedEmails.filter((email) => email !== emailToRemove)
    );
  };

  const handleSend = async () => {
    if (selectedEmails.length === 0) {
      setStatus("Please enter at least one email address.");
      return;
    }

    try {
      // await axios.post("http://localhost:5299/api/email/send-bulk", {
      await axios.post(variables.SEND_BULK_EMAILS, {
        emails: selectedEmails,
        subject: "Message from Admin",
        message: message,
      });

      setStatus("Emails sent successfully!");
      setSelectedEmails([]);
      setMessage("");
      setQuery("");
    } catch (error) {
      console.error(error);
      setStatus("Failed to send Emails");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        📧 Compose Email
      </h2>

      <div className="relative">
        <input
          type="email"
          value={query}
          onChange={handleQueryChange}
          placeholder="Type an email to add"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((email, index) => (
              <li
                key={index}
                onClick={() => handleSelect(email)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
              >
                {email}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected email chips */}
      <div className="flex flex-wrap gap-2">
        {selectedEmails.map((email, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-2 text-sm"
          >
            <span>{email}</span>
            <button
              onClick={() => removeEmail(email)}
              className="text-red-500 font-bold hover:text-red-700 transition"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Message textarea */}
      <textarea
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
      >
        Send
      </button>

      {status && <p className="text-gray-600 text-md text-center">{status}</p>}
    </div>
  );
}

export default BulkEmailForm;

