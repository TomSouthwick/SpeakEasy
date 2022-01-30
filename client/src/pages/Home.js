import React from 'react';
import { useQuery } from '@apollo/client';

import Translator from '../components/Translator';

import { QUERY_PROFILES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_PROFILES);
  const profiles = data?.profiles || [];
 
  return (
    <main>
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 my-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            // <h2>hello world</h2>
            <div>
                <Translator />
            </div>  
            // <ProfileList
            //   profiles={profiles}
            //   title="Here's the current roster of friends..."
            // />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
