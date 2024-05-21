import { useState } from 'react';
import FacebookLoginButton from '../components/FacebookLoginButton';
import AdDisplay from '../components/AdDisplay';

const Home = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
  };

  return (
    <div>
      <h1>Facebook Ads Management</h1>
      {!accessToken ? (
        <FacebookLoginButton onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdDisplay accessToken={accessToken} />
      )}
    </div>
  );
};

export default Home;
