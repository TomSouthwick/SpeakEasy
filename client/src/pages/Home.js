import React from "react";
import { useQuery } from "@apollo/client";

import Translator from "../components/Translator";
import ProfileList from "../components/ProfileList/ProfileList";

import { QUERY_PROFILES } from "../utils/queries";
import auth from "../utils/auth";
import { useHistory, useLocation } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  // is user is not authenticated, redirect to /login
  if (!auth.loggedIn()) {
    history.push("/login");
  }
  const { loading, data } = useQuery(QUERY_PROFILES);
  const profiles = data?.profiles || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 my-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            // <div>
            //   <profile />
            // </div>
            // <div>
            //   <ProfileList profiles={profiles} title={"hello"}/>
            // </div>
            <div>
              <Translator />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
/* //   profiles={profiles}
            //   title="Here's the current roster of friends..."
            // </div> */

export default Home;
