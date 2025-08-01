import useSWR from 'swr';

const API_URL = 'https://metaquetzal-production.up.railway.app';

const fetcher = async () => {
  const res = await fetch(`${API_URL}/alerts?limit=50`);
  if (!res.ok) throw new Error('Error fetching alerts');
  return res.json();
};

export default function useAlerts() {
  const { data, error, isLoading, mutate } = useSWR('alerts', fetcher, {
    refreshInterval: 60000,
  });

  return { data, error, isLoading, mutate };
}
