'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import api from '../../lib/api';
import { SummaryData } from '../../lib/types';
import SummaryCards from '../../components/SummaryCards';

export default function SummaryPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      const fetchSummary = async () => {
        try {
          const response = await api.get('/summary/daily');
          setSummaryData(response.data);
        } catch (error) {
          console.error('Failed to fetch summary', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSummary();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="text-center py-10">Loading...</div>;
  if (!user || !summaryData) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Daily Summary</h1>
      <p className="text-slate-500 mb-8">
        Here's an overview of your activity for today, {new Date().toLocaleDateString()}.
      </p>
      <SummaryCards data={summaryData} />
    </div>
  );
}
