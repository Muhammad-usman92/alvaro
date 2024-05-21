import { useEffect, useState } from 'react';
import axios from 'axios';
import FacebookLoginButton from '../components/FacebookLoginButton';

interface AdData {
  campaign_name: string;
  adset_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  reach: string;
  frequency: string;
  unique_clicks: string;
  unique_ctr: string;
}

const AdsPage = () => {
  const [adsData, setAdsData] = useState<AdData[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      fetchAdsData();
    }
  }, [accessToken]);

  const fetchAdsData = async () => {
    try {
      const response = await axios.get('/api/facebook/ads', {
        params: { accessToken },
      });
      setAdsData(response.data);
    } catch (error) {
      console.error('Error fetching ads data:', error);
    }
  };

  return (
    <div>
      <h1>Your Facebook Ads</h1>
      {accessToken ? (
        adsData.length > 0 ? (
          <table className="table-auto w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="px-4 py-2">Campaign Name</th>
                <th className="px-4 py-2">Adset Name</th>
                <th className="px-4 py-2">Spend</th>
                <th className="px-4 py-2">Impressions</th>
                <th className="px-4 py-2">Clicks</th>
                <th className="px-4 py-2">CTR</th>
                <th className="px-4 py-2">CPC</th>
                <th className="px-4 py-2">CPM</th>
                <th className="px-4 py-2">Reach</th>
                <th className="px-4 py-2">Frequency</th>
                <th className="px-4 py-2">Unique Clicks</th>
                <th className="px-4 py-2">Unique CTR</th>
              </tr>
            </thead>
            <tbody>
              {adsData.map((ad, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{ad.campaign_name}</td>
                  <td className="border px-4 py-2">{ad.adset_name}</td>
                  <td className="border px-4 py-2">${ad.spend}</td>
                  <td className="border px-4 py-2">{ad.impressions}</td>
                  <td className="border px-4 py-2">{ad.clicks}</td>
                  <td className="border px-4 py-2">{ad.ctr}%</td>
                  <td className="border px-4 py-2">${ad.cpc}</td>
                  <td className="border px-4 py-2">${ad.cpm}</td>
                  <td className="border px-4 py-2">{ad.reach}</td>
                  <td className="border px-4 py-2">{ad.frequency}</td>
                  <td className="border px-4 py-2">{ad.unique_clicks}</td>
                  <td className="border px-4 py-2">{ad.unique_ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ads found</p>
        )
      ) : (
        <FacebookLoginButton onLoginSuccess={setAccessToken} />
      )}
    </div>
  );
};

export default AdsPage;
