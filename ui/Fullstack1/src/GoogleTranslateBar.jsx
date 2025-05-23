import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";


const GoogleTranslateBar = () => {
  const scriptRef = useRef();
  const translateRef = useRef();
  const location = useLocation();

  useEffect(() => {
    let timeoutId;

    function activateTranslate() {
      // Add script only once
      if (!scriptRef.current) {
        const addScript = document.createElement("script");
        addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(addScript);
        scriptRef.current = addScript;
      }

      // Attach Google Translate once the script is ready
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
      };

      // If it's not yet attached, retry
      if (!translateRef.current?.childNodes.length > 0) {
        timeoutId = setTimeout(() => {
          activateTranslate();
        }, 1000);
      }
    }

    activateTranslate();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const element = document.querySelector("goog-te-combo");
    if (element) element.value = "";
  }, [location]);

  return <div ref={translateRef} id="google_translate_element"></div>;
};

export default GoogleTranslateBar;
