'use client';

import { useState } from 'react';

export function AdminRewardsClient({ initialConfig, initialAccounts }: { initialConfig: any, initialAccounts: any[] }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);

  const saveConfig = async () => {
    setSaving(true);
    await fetch('/api/admin/rewards/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setSaving(false);
    alert('Config saved!');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Global Configuration</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Earning Ratio (Points per ₹1)</label>
            <input 
              type="number" 
              value={config.earningRatio}
              onChange={(e) => setConfig({ ...config, earningRatio: parseFloat(e.target.value) })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Redemption Ratio (₹ per 1 Point)</label>
            <input 
              type="number" 
              value={config.redemptionRatio}
              onChange={(e) => setConfig({ ...config, redemptionRatio: parseFloat(e.target.value) })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <button 
          onClick={saveConfig}
          disabled={saving}
          className="mt-4 bg-black text-white px-4 py-2 rounded font-medium"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Top Reward Accounts</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">User</th>
              <th className="p-2">Current Points</th>
              <th className="p-2">Lifetime Points</th>
              <th className="p-2">Tier</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {initialAccounts.map(acc => (
              <tr key={acc.id} className="border-b">
                <td className="p-2">{acc.user.name || acc.user.email}</td>
                <td className="p-2">{acc.currentPoints}</td>
                <td className="p-2">{acc.lifetimePoints}</td>
                <td className="p-2">{acc.tier}</td>
                <td className="p-2">
                  <button className="text-blue-600 font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
