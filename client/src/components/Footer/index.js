import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Auth from "../../utils/auth";

const Footer = () => {
  const location = useLocation();
  const history = useHistory();
  const isLoggedIn = Auth.loggedIn();

  // if a user is logged in - don't show the Icons

  return (
    <>
      {isLoggedIn ? (
        <footer className="w-100 mt-auto text-dark p-4">
          <div className="container text-center mb-5">
            <h4>SpeakEasy&copy; {new Date().getFullYear()}</h4>
          </div>
        </footer>
      ) : (
        <footer className="w-100 mt-auto text-dark p-4">
          <div className="container text-center mb-5">
            <h4>SpeakEasy&copy; {new Date().getFullYear()}</h4>
            <a
              href="https://www.linkedin.com/in/tomsouthwick/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon alt="linkedIn" />
            </a>

            <a
              href="https://github.com/TomSouthwick"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon alt="GitHub repository" />
            </a>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
