import { useMemo, useState } from 'react';
import { ActivationPanel } from './components/ActivationPanel';
import { DemoShell } from './components/DemoShell';
import { EventStream } from './components/EventStream';
import { PhoneFrame } from './components/PhoneFrame';
import { PresenterControls } from './components/PresenterControls';
import { ProfilePanel } from './components/ProfilePanel';
import { ScenarioSelector } from './components/ScenarioSelector';
import { scenarioNotes, runScenario, type ScenarioId } from './lib/demoScenarios';
import { screenOrder } from './lib/copy';
import { fetchMeiroProfile } from './lib/profileApi';
import { createInitialState, trackEvent, updateProfileFlags } from './lib/tracking';
import type { MeiroProfile, ScreenId, TrackingMode } from './lib/types';
import { OnboardingScreen } from './screens/OnboardingScreen';

function App() {
  const initialReviewScenario = useMemo(() => runScenario(createInitialState(), 'review'), []);
  const [state, setState] = useState(() => initialReviewScenario.state);
  const [screen, setScreen] = useState<ScreenId>(initialReviewScenario.screen);
  const [scenario, setScenario] = useState<ScenarioId>('review');
  const [trackingMode, setTrackingMode] = useState<TrackingMode>('demo');
  const [profileApiStatus, setProfileApiStatus] = useState('Not fetched');

  const note = useMemo(() => scenarioNotes[scenario], [scenario]);

  const reset = () => {
    const initial = createInitialState();
    setState(trackEvent(trackEvent(initial, 'app_opened', 'welcome'), 'screen_viewed', 'welcome'));
    setScreen('welcome');
  };

  const selectScenario = (id: ScenarioId) => {
    const initial = createInitialState();
    const result = runScenario(initial, id);
    setScenario(id);
    setState(result.state);
    setScreen(result.screen);
  };

  const act = (action: { event: string; next?: ScreenId; payload?: Record<string, unknown> }) => {
    let nextState = state;
    const screenName = screen;
    if (action.event === 'identity_number_submitted') {
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
      nextState = trackEvent(nextState, 'identity_verification_started', screenName, {}, { mode: trackingMode });
    } else if (action.event === 'privacy_notice_accepted') {
      nextState = trackEvent(nextState, 'privacy_notice_viewed', screenName, {}, { mode: trackingMode });
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
    } else if (action.event === 'personal_info_consent_given') {
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
      nextState = trackEvent(nextState, 'channel_consent_updated', screenName, {
        marketing_consent_push: nextState.profile.marketing_consent_push,
        marketing_consent_email: nextState.profile.marketing_consent_email,
        marketing_consent_whatsapp: nextState.profile.marketing_consent_whatsapp,
      }, { mode: trackingMode });
    } else if (action.event === 'form_completed') {
      nextState = trackEvent(nextState, 'form_step_started', screenName, action.payload, { mode: trackingMode });
      nextState = trackEvent(nextState, 'form_step_completed', screenName, action.payload, { mode: trackingMode });
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
    } else if (action.event === 'application_review_confirmed') {
      nextState = trackEvent(nextState, 'application_review_started', screenName, {}, { mode: trackingMode });
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
    } else if (action.event === 'password_created') {
      nextState = trackEvent(nextState, 'password_creation_started', screenName, {}, { mode: trackingMode });
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
      nextState = trackEvent(nextState, 'verification_code_sent', 'otp', {}, { mode: trackingMode });
    } else if (action.event === 'verification_code_verified') {
      nextState = trackEvent(nextState, 'verification_code_submitted', screenName, {}, { mode: trackingMode });
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
      nextState = trackEvent(nextState, 'account_request_submitted', 'submitted', {}, { mode: trackingMode });
    } else {
      nextState = trackEvent(nextState, action.event, screenName, action.payload, { mode: trackingMode });
    }
    if (action.next) {
      nextState = trackEvent(nextState, 'screen_viewed', action.next, {}, { mode: trackingMode });
      setScreen(action.next);
    }
    setState(nextState);
  };

  const back = () => {
    const index = screenOrder.indexOf(screen);
    if (index > 0) setScreen(screenOrder[index - 1]);
  };

  const copyProfile = async () => {
    await navigator.clipboard?.writeText(JSON.stringify(state.profile, null, 2));
  };

  const exportEvents = () => {
    const blob = new Blob([JSON.stringify(state.events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'aurum-meiro-events.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const toggleProfile = (key: keyof MeiroProfile) => {
    setState((current) => updateProfileFlags(current, { [key]: !current.profile[key] } as Partial<MeiroProfile>));
  };

  const fetchProfile = async () => {
    setProfileApiStatus('Fetching...');
    try {
      const result = await fetchMeiroProfile(state.profile);
      setProfileApiStatus(result.ok ? `Fetched profile (${result.status})` : `Profile API returned ${result.status}`);
    } catch {
      setProfileApiStatus('Unavailable in plain Vite dev; use Netlify Dev or deploy with MEIRO_PROFILE_API_KEY.');
    }
  };

  const controls = (
    <div className="space-y-3">
      <ScenarioSelector active={scenario} onSelect={selectScenario} />
      <PresenterControls
        profile={state.profile}
        onReset={reset}
        onAbandon={() => setState((current) => trackEvent(current, 'demo_abandonment_simulated', screen, { step: screen }))}
        onSuccess={() => selectScenario('completed')}
        onFailure={() => selectScenario('verification-failure')}
        onCopyProfile={copyProfile}
        onExportEvents={exportEvents}
        onToggle={toggleProfile}
        trackingMode={trackingMode}
        onTrackingModeChange={setTrackingMode}
        profileApiStatus={profileApiStatus}
        onFetchProfile={fetchProfile}
      />
      <p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-relaxed text-slate-300">{note}</p>
    </div>
  );

  return (
    <DemoShell
      controls={controls}
      left={
        <PhoneFrame>
          <OnboardingScreen key={screen} screen={screen} profile={state.profile} onAction={act} onBack={back} />
        </PhoneFrame>
      }
      center={<ProfilePanel profile={state.profile} audiences={state.audiences} />}
      right={<ActivationPanel decisions={state.activations} />}
      eventStream={<EventStream events={state.events} />}
    />
  );
}

export default App;
