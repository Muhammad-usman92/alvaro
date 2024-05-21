import { useEffect, useState } from 'react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const FacebookLoginButton = ({ onLoginSuccess }: { onLoginSuccess: (accessToken: string) => void }) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    const loadFbSdk = () => {
      if (document.getElementById('facebook-jssdk')) return;

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.fbAsyncInit = () => {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
            cookie: true,
            xfbml: true,
            version: process.env.NEXT_PUBLIC_FACEBOOK_GRAPH_API_VERSION!,
          });

          setIsSdkLoaded(true);
        };
      };
    };

    if (!window.FB) {
      loadFbSdk();
    } else {
      setIsSdkLoaded(true);
    }
  }, []);

  const handleLogin = () => {
    if (!isSdkLoaded) {
      console.error('Facebook SDK not loaded yet.');
      return;
    }

    window.FB.login((response: any) => {
      if (response.authResponse) {
        console.log('Access Token:', response.authResponse.accessToken);
        onLoginSuccess(response.authResponse.accessToken);
      } else {
        console.error('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'public_profile,ads_management,ads_read,read_insights,email,pages_show_list,pages_read_engagement' });
  };

  return (
    <button onClick={handleLogin} disabled={!isSdkLoaded}>
      {isSdkLoaded ? 'Connect your Facebook' : 'Loading...'}
    </button>
  );
};

export default FacebookLoginButton;
