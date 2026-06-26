import { Copy, Download, RadioTower, RotateCcw, Search, ShieldAlert, UserCheck } from 'lucide-react';
import { meiroCollectProxyPath, meiroProfileApi } from '../lib/meiroConfig';
import type { MeiroProfile, TrackingMode } from '../lib/types';

export function PresenterControls({
  onReset,
  onAbandon,
  onSuccess,
  onFailure,
  onCopyProfile,
  onExportEvents,
  profile,
  onToggle,
  trackingMode,
  onTrackingModeChange,
  profileApiStatus,
  onFetchProfile,
}: {
  onReset: () => void;
  onAbandon: () => void;
  onSuccess: () => void;
  onFailure: () => void;
  onCopyProfile: () => void;
  onExportEvents: () => void;
  profile: MeiroProfile;
  onToggle: (key: keyof MeiroProfile) => void;
  trackingMode: TrackingMode;
  onTrackingModeChange: (mode: TrackingMode) => void;
  profileApiStatus: string;
  onFetchProfile: () => void;
}) {
  const toggles: { key: keyof MeiroProfile; label: string }[] = [
    { key: 'marketing_consent_push', label: 'Push' },
    { key: 'marketing_consent_email', label: 'Email' },
    { key: 'marketing_consent_whatsapp', label: 'WhatsApp' },
    { key: 'push_token_available', label: 'Token' },
    { key: 'email_available', label: 'Email reachable' },
    { key: 'whatsapp_phone_available', label: 'WhatsApp reachable' },
  ];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100">
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={onAbandon} className="inline-flex items-center gap-2 rounded-lg border border-aurum/30 bg-aurum/10 px-3 py-2 text-xs font-semibold text-aurum">
          <ShieldAlert size={14} /> Abandon
        </button>
        <button onClick={onSuccess} className="inline-flex items-center gap-2 rounded-lg border border-mint/30 bg-mint/10 px-3 py-2 text-xs font-semibold text-mint">
          <UserCheck size={14} /> Complete
        </button>
        <button onClick={onFailure} className="inline-flex items-center gap-2 rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-xs font-semibold text-rose-100">
          <ShieldAlert size={14} /> Fail
        </button>
        <button onClick={onExportEvents} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100">
          <Download size={14} /> Events
        </button>
        <button onClick={onCopyProfile} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100">
          <Copy size={14} /> Profile
        </button>
        <button
          onClick={() => onTrackingModeChange(trackingMode === 'demo' ? 'live' : 'demo')}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
            trackingMode === 'live' ? 'border-mint/40 bg-mint/10 text-mint' : 'border-white/10 bg-white/5 text-slate-100'
          }`}
          title={meiroCollectProxyPath}
        >
          <RadioTower size={14} /> {trackingMode === 'live' ? 'Live Meiro' : 'Demo only'}
        </button>
        <button
          onClick={onFetchProfile}
          className="inline-flex items-center gap-2 rounded-lg border border-cyanSoft/30 bg-cyanSoft/10 px-3 py-2 text-xs font-semibold text-cyanSoft"
          title={`${meiroProfileApi.path}?identifier_type=mobile_user_id&identifier_value=${profile.mobile_user_id}`}
        >
          <Search size={14} /> Client lookup
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {toggles.map((toggle) => (
          <button
            key={String(toggle.key)}
            onClick={() => onToggle(toggle.key)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${profile[toggle.key] ? 'border-mint/40 bg-mint/10 text-mint' : 'border-white/10 bg-white/5 text-slate-400'}`}
          >
            {toggle.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        {trackingMode === 'live' ? `Sending mobile-app events through ${meiroCollectProxyPath}` : 'Local demo mode. Switch on Live Meiro only when ready to send events.'}
      </p>
      <p className="mt-1 text-[11px] text-slate-500">
        Profile API proxy: {meiroProfileApi.proxyPath} · mobile_user_id={profile.mobile_user_id} · {profileApiStatus}
      </p>
    </div>
  );
}
