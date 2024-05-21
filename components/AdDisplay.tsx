import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type AdData = {
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
};

const AdDisplay = ({ accessToken }: { accessToken: string }) => {
  const [adsData, setAdsData] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchAdsData('yesterday'); // Default fetch for yesterday
  }, [accessToken]);

  const fetchAdsData = async (datePreset: string, customDateRange?: { since: string; until: string }) => {
    setLoading(true);
    try {
      let url = `https://graph.facebook.com/v19.0/me/adaccounts?fields=campaigns{name,start_time,end_time,objective,status,adsets{name,start_time,end_time,daily_budget,insights{spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,unique_clicks,unique_ctr}}}&access_token=${accessToken}`;
      
      if (customDateRange) {
        url += `&time_range={'since':'${customDateRange.since}','until':'${customDateRange.until}'}`;
      } else {
        url += `&date_preset=${datePreset}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      const adsData = data.data.flatMap((account: any) =>
        account.campaigns?.data.flatMap((campaign: any) =>
          campaign.adsets?.data.map((adset: any) => {
            const insights = adset.insights?.data[0] || {};
            return {
              campaign_name: campaign.name,
              adset_name: adset.name,
              spend: insights.spend || '0',
              impressions: insights.impressions || '0',
              clicks: insights.clicks || '0',
              ctr: insights.ctr || '0',
              cpc: insights.cpc || '0',
              cpm: insights.cpm || '0',
              reach: insights.reach || '0',
              frequency: insights.frequency || '0',
              unique_clicks: insights.unique_clicks || '0',
              unique_ctr: insights.unique_ctr || '0',
            };
          })
        ) || []
      );

      setAdsData(adsData);
    } catch (error) {
      setError('Failed to fetch ads data');
    } finally {
      setLoading(false);
    }
  };

  const handleDatePresetChange = (preset: string) => {
    fetchAdsData(preset);
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      const customDateRange = {
        since: startDate.toISOString().split('T')[0],
        until: endDate.toISOString().split('T')[0],
      };
      fetchAdsData('custom', customDateRange);
    }
  };

  if (loading) return <p>Loading ads...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Your Facebook Ads</h2>
      <div>
        <button onClick={() => handleDatePresetChange('yesterday')}>Yesterday</button>
        <button onClick={() => handleDatePresetChange('last_7d')}>Last 7 Days</button>
        <div>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
          />
          <button onClick={handleCustomDateChange}>Apply</button>
        </div>
      </div>
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
          {adsData.length > 0 ? (
            adsData.map((ad, index) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={12} className="border px-4 py-2 text-center">No ads found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdDisplay;
