'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Gift, 
  Clock, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RewardsDashboard({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'redeem'>('overview');
  const [copied, setCopied] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const copyReferral = () => {
    navigator.clipboard.writeText(data.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = async (points: number) => {
    if (data.currentPoints < points) return;
    try {
      setRedeeming(true);
      setError(null);
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to redeem points');
      }
      router.refresh();
      setActiveTab('history');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-8 border border-outline-variant/20 shadow-sm">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-primary/5">
          <Trophy className="h-64 w-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-primary" />
              {data.tier} TIER
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              {data.currentPoints.toLocaleString()} <span className="text-on-surface-variant text-2xl md:text-3xl font-medium">Points</span>
            </h1>
            <p className="text-on-surface-variant max-w-md">
              You have {data.currentPoints} available points. Reach {data.nextTier ? data.nextTier.min : ''} lifetime points to unlock the next tier.
            </p>
          </div>

          {data.nextTier && (
            <div className="w-full md:w-72 bg-surface p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">{data.tier}</span>
                <span className="text-on-surface-variant font-medium">{data.nextTier.name}</span>
              </div>
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${data.progressToNext}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-3 text-center">
                {data.nextTier.min - data.lifetimePoints} points away from {data.nextTier.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-surface-container rounded-xl overflow-x-auto w-max">
        {['overview', 'history', 'redeem'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab 
                ? 'bg-surface shadow-sm text-on-surface' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefits */}
            <div className="bg-surface rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Your Benefits</h3>
              </div>
              <ul className="space-y-4">
                {data.tierConfig.benefits.map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-on-surface-variant">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Referral */}
            <div className="bg-surface rounded-3xl p-6 border border-outline-variant/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-tertiary/10 rounded-xl text-tertiary">
                    <Gift className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Refer a Friend</h3>
                </div>
                <p className="text-on-surface-variant mb-6">
                  Give your friends ₹100 off their first order and get 500 points when they purchase.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container rounded-xl p-2 border border-outline-variant/10">
                <div className="flex-1 px-4 font-mono font-medium tracking-wider">
                  {data.referralCode}
                </div>
                <button
                  onClick={copyReferral}
                  className="p-3 bg-surface rounded-lg hover:bg-surface-variant transition-colors"
                  title="Copy Code"
                >
                  {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-on-surface-variant" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Transaction History</h3>
            {data.transactions.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No transactions yet. Start earning points!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.transactions.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-variant/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${t.points > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {t.points > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-xs text-on-surface-variant">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${t.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.points > 0 ? '+' : ''}{t.points}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'redeem' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { points: 500, value: '₹50' },
              { points: 1000, value: '₹100' },
              { points: 2500, value: '₹250' }
            ].map((option) => (
              <div key={option.points} className="bg-surface rounded-3xl p-6 border border-outline-variant/20 shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Gift className="h-24 w-24 -mt-8 -mr-8" />
                </div>
                <h4 className="text-3xl font-bold mb-1">{option.value}</h4>
                <p className="text-on-surface-variant mb-6 text-sm">Store Discount</p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">{option.points} Points</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(option.points)}
                    disabled={data.currentPoints < option.points || redeeming}
                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      data.currentPoints >= option.points
                        ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-md hover:shadow-lg'
                        : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                    }`}
                  >
                    {redeeming ? 'Redeeming...' : 'Redeem Now'}
                    {data.currentPoints >= option.points && !redeeming && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
