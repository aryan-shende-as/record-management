
import React, { useState, useEffect } from 'react';
import { variables } from './Variables';

function App() {
  const [homeTitle, setHomeTitle] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [language, setLanguage] = useState('en'); // Default language

  const fetchLocalizedContent = async (language) => {
    try {
      const response = await fetch(variables.HOME_PAGE_CONTENT_URL, {
        headers: {
          'Accept-Language': language,
        },
      });
  
      const data = await response.json();
      console.log('Data:', data); // Debugging
      
      // Access `.value` from the localized object
      setHomeTitle(data.homeTitle?.Value ?? 'Missing Title');
      setWelcomeMessage(data.welcomeMessage?.Value ?? 'Missing Text');
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };
  

  useEffect(() => {
    fetchLocalizedContent(language);
  }, [language]);

  return (
    <div className="p-6 text-center">
      <h4 className="text-3xl font-bold mb-4">{homeTitle}</h4>
      {/* <select
        className="p-2 border rounded"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
         <option value="en">English</option>
         <option value="es">Español</option>
         <option value="fr">Français</option>
         <option value="hi">हिन्दी</option>
         <option value="ja">日本語</option>
      </select>
      <br></br>
      <br></br> */}
      <p className="text-lg mb-6">{welcomeMessage}</p>

    </div>
  );
}

export default App;






