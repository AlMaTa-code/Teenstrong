import { useState } from 'react';
import Button from '../shared/Button';

const STEPS = ['welcome', 'age', 'experience', 'assessment', 'health', 'equipment', 'measurements', 'goal'];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    ageGroup: null,
    experience: null,
    assessment: { pushups: null, squats: null, situps: null, plank: null },
    healthFlags: [],
    equipment: null,
    height: '',
    heightUnit: 'cm',
    heightFeet: '',
    heightInches: '',
    weight: '',
    weightUnit: 'kg',
    goal: null,
  });

  const currentStep = STEPS[step];

  const getHeightCm = () => {
    if (data.heightUnit === 'cm') return parseFloat(data.height) || 0;
    const ft = parseFloat(data.heightFeet) || 0;
    const inch = parseFloat(data.heightInches) || 0;
    return Math.round((ft * 30.48) + (inch * 2.54));
  };

  const getWeightKg = () => {
    const w = parseFloat(data.weight) || 0;
    return data.weightUnit === 'kg' ? w : Math.round(w * 0.4536);
  };

  const canNext = () => {
    switch (currentStep) {
      case 'welcome': return true;
      case 'age': return data.ageGroup !== null && data.ageGroup !== 'under12';
      case 'experience': return data.experience !== null;
      case 'assessment': {
        const a = data.assessment;
        return a.pushups !== null && a.squats !== null && a.situps !== null && a.plank !== null;
      }
      case 'health': return data.healthFlags.length > 0 || data.healthFlags.includes('none');
      case 'equipment': return data.equipment !== null;
      case 'measurements': {
        if (data.heightUnit === 'cm') {
          return parseFloat(data.height) > 0 && parseFloat(data.weight) > 0;
        }
        return (parseFloat(data.heightFeet) > 0 || parseFloat(data.heightInches) > 0) && parseFloat(data.weight) > 0;
      }
      case 'goal': return data.goal !== null;
      default: return false;
    }
  };

  const next = () => {
    if (step === STEPS.length - 1) {
      onComplete({
        ageGroup: data.ageGroup,
        experience: data.experience,
        assessment: data.assessment,
        healthFlags: data.healthFlags,
        equipment: data.equipment,
        heightCm: getHeightCm(),
        weightKg: getWeightKg(),
        weightUnit: data.weightUnit,
        goal: data.goal,
      });
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSelect = (field, value) => {
    setData(d => ({ ...d, [field]: value }));
  };

  const handleAssessment = (field, value) => {
    setData(d => ({ ...d, assessment: { ...d.assessment, [field]: value } }));
  };

  const handleHealthToggle = (value) => {
    setData(d => {
      if (value === 'none') {
        return { ...d, healthFlags: ['none'] };
      }
      const flags = d.healthFlags.filter(f => f !== 'none');
      if (flags.includes(value)) {
        return { ...d, healthFlags: flags.filter(f => f !== value) };
      }
      return { ...d, healthFlags: [...flags, value] };
    });
  };

  const OptionButton = ({ selected, onClick, children }) => (
    <button
      onClick={onClick}
      className="w-full text-center transition-all min-h-[48px]"
      style={{
        background: selected ? 'var(--accent-dim)' : 'var(--bg-card)',
        border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
        color: selected ? 'var(--accent)' : 'var(--text)',
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        fontSize: 15,
      }}
    >
      {children}
    </button>
  );

  const SmallOption = ({ selected, onClick, children }) => (
    <button
      onClick={onClick}
      className="flex-1 text-center transition-all min-h-[44px]"
      style={{
        background: selected ? 'var(--accent-dim)' : 'var(--bg-card)',
        border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
        color: selected ? 'var(--accent)' : 'var(--text)',
        borderRadius: 'var(--radius)',
        padding: '10px 4px',
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );

  const UnitToggle = ({ value, onChange, options }) => (
    <div className="flex w-full overflow-hidden" style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="flex-1 text-center transition-all min-h-[44px]"
          style={{
            background: value === opt.value ? 'var(--accent-dim)' : 'var(--bg-card)',
            color: value === opt.value ? 'var(--accent)' : 'var(--text-muted)',
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  const inputStyle = {
    background: 'var(--bg-card)',
    border: '2px solid var(--border)',
    color: 'var(--text)',
    borderRadius: 'var(--radius)',
    outline: 'none',
    padding: '14px 16px',
    fontSize: 15,
    width: '100%',
    minHeight: 48,
  };

  return (
    <div className="app-container min-h-dvh flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 flex flex-col justify-center overflow-y-auto" style={{ padding: '32px 16px' }}>

        {/* Welcome */}
        {currentStep === 'welcome' && (
          <div className="text-center flex flex-col items-center" style={{ gap: 24 }}>
            <div className="flex items-center justify-center text-4xl"
              style={{ width: 72, height: 72, background: 'var(--accent-dim)', borderRadius: 'var(--radius)' }}>
              💪
            </div>
            <h1 style={{ fontSize: 42, color: 'var(--accent)', lineHeight: 1 }}>KALDR</h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 320 }}>
              Evidence-based strength training for teens. Build confidence, feel powerful in your body, and get stronger for sports and life.
            </p>
            <div style={{
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              borderRadius: 'var(--radius)',
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}>
              Based on AAP & NSCA guidelines
            </div>
            <Button onClick={next} className="w-full" style={{ marginTop: 8 }}>GET STARTED</Button>
          </div>
        )}

        {/* Age */}
        {currentStep === 'age' && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <h1 style={{ fontSize: 30, marginBottom: 8 }}>HOW OLD ARE YOU?</h1>
            <OptionButton selected={data.ageGroup === 'under12'} onClick={() => handleSelect('ageGroup', 'under12')}>
              Under 12
            </OptionButton>
            <OptionButton selected={data.ageGroup === '12-14'} onClick={() => handleSelect('ageGroup', '12-14')}>
              12–14
            </OptionButton>
            <OptionButton selected={data.ageGroup === '15-17'} onClick={() => handleSelect('ageGroup', '15-17')}>
              15–17
            </OptionButton>
            {data.ageGroup === 'under12' && (
              <div style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue)', borderRadius: 'var(--radius)', padding: 16 }}>
                <p style={{ fontSize: 14, color: 'var(--blue)' }}>
                  KALDR is designed for ages 12+. We recommend working with a coach in person for younger athletes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Experience */}
        {currentStep === 'experience' && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <h1 style={{ fontSize: 30, marginBottom: 8 }}>FITNESS EXPERIENCE?</h1>
            <OptionButton selected={data.experience === 'beginner'} onClick={() => handleSelect('experience', 'beginner')}>
              Brand new to training
            </OptionButton>
            <OptionButton selected={data.experience === 'some'} onClick={() => handleSelect('experience', 'some')}>
              Some sport or PE experience
            </OptionButton>
            <OptionButton selected={data.experience === 'regular'} onClick={() => handleSelect('experience', 'regular')}>
              I train regularly
            </OptionButton>
          </div>
        )}

        {/* Fitness Assessment */}
        {currentStep === 'assessment' && (
          <div className="flex flex-col" style={{ gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 30, marginBottom: 4 }}>QUICK FITNESS CHECK</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Don't worry about exact numbers — just pick the closest range.
              </p>
            </div>

            {[
              { label: 'Push-ups in one go?', field: 'pushups', opts: [{ v: 1, l: '0–5' }, { v: 2, l: '6–15' }, { v: 3, l: '16–30' }, { v: 4, l: '30+' }] },
              { label: 'Squats in one go?', field: 'squats', opts: [{ v: 1, l: '0–10' }, { v: 2, l: '11–25' }, { v: 3, l: '26–50' }, { v: 4, l: '50+' }] },
              { label: 'Sit-ups in one go?', field: 'situps', opts: [{ v: 1, l: '0–5' }, { v: 2, l: '6–15' }, { v: 3, l: '16–30' }, { v: 4, l: '30+' }] },
              { label: 'Plank hold?', field: 'plank', opts: [{ v: 1, l: '<15s' }, { v: 2, l: '15–30s' }, { v: 3, l: '30–60s' }, { v: 4, l: '60s+' }] },
            ].map(q => (
              <div key={q.field} className="flex flex-col" style={{ gap: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{q.label}</p>
                <div className="flex" style={{ gap: 8 }}>
                  {q.opts.map(o => (
                    <SmallOption key={o.v} selected={data.assessment[q.field] === o.v} onClick={() => handleAssessment(q.field, o.v)}>{o.l}</SmallOption>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Health Screening */}
        {currentStep === 'health' && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 30, marginBottom: 4 }}>HEALTH CHECK</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Select any that apply:</p>
            </div>
            {[
              { value: 'heart', label: 'Heart condition' },
              { value: 'injury', label: 'Recent injury or surgery' },
              { value: 'seizure', label: 'Seizure disorder' },
              { value: 'none', label: 'None of these' },
            ].map(opt => (
              <OptionButton
                key={opt.value}
                selected={data.healthFlags.includes(opt.value)}
                onClick={() => handleHealthToggle(opt.value)}
              >
                {opt.label}
              </OptionButton>
            ))}
            {data.healthFlags.length > 0 && !data.healthFlags.includes('none') && (
              <div style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue)', borderRadius: 'var(--radius)', padding: 16 }}>
                <p style={{ fontSize: 14, color: 'var(--blue)' }}>
                  The AAP recommends young people with health conditions get medical clearance before starting.
                  Please show this to a parent/guardian and check with your doctor.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Equipment */}
        {currentStep === 'equipment' && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <h1 style={{ fontSize: 30, marginBottom: 8 }}>EQUIPMENT?</h1>
            <OptionButton selected={data.equipment === 'none'} onClick={() => handleSelect('equipment', 'none')}>
              Nothing (bodyweight only)
            </OptionButton>
            <OptionButton selected={data.equipment === 'bands'} onClick={() => handleSelect('equipment', 'bands')}>
              Resistance bands
            </OptionButton>
            <OptionButton selected={data.equipment === 'dumbbells'} onClick={() => handleSelect('equipment', 'dumbbells')}>
              Dumbbells
            </OptionButton>
            <OptionButton selected={data.equipment === 'both'} onClick={() => handleSelect('equipment', 'both')}>
              Bands + dumbbells
            </OptionButton>
          </div>
        )}

        {/* Measurements */}
        {currentStep === 'measurements' && (
          <div className="flex flex-col" style={{ gap: 24 }}>
            <div>
              <h1 style={{ fontSize: 30, marginBottom: 4 }}>YOUR MEASUREMENTS</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                This helps us suggest appropriate weights and track your progress.
              </p>
            </div>

            {/* Height */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Height</p>
              <UnitToggle
                value={data.heightUnit}
                onChange={(v) => setData(d => ({ ...d, heightUnit: v }))}
                options={[{ value: 'cm', label: 'cm' }, { value: 'ft', label: 'ft / in' }]}
              />
              {data.heightUnit === 'cm' ? (
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 165"
                  value={data.height}
                  onChange={e => setData(d => ({ ...d, height: e.target.value }))}
                  style={inputStyle}
                />
              ) : (
                <div className="flex" style={{ gap: 12 }}>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="ft"
                    value={data.heightFeet}
                    onChange={e => setData(d => ({ ...d, heightFeet: e.target.value }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="in"
                    value={data.heightInches}
                    onChange={e => setData(d => ({ ...d, heightInches: e.target.value }))}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              )}
            </div>

            {/* Weight */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Weight</p>
              <UnitToggle
                value={data.weightUnit}
                onChange={(v) => setData(d => ({ ...d, weightUnit: v }))}
                options={[{ value: 'kg', label: 'kg' }, { value: 'lbs', label: 'lbs' }]}
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder={data.weightUnit === 'kg' ? 'e.g. 55' : 'e.g. 120'}
                value={data.weight}
                onChange={e => setData(d => ({ ...d, weight: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Goal */}
        {currentStep === 'goal' && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <h1 style={{ fontSize: 30, marginBottom: 8 }}>YOUR GOAL?</h1>
            <OptionButton selected={data.goal === 'stronger'} onClick={() => handleSelect('goal', 'stronger')}>
              Get stronger
            </OptionButton>
            <OptionButton selected={data.goal === 'sport'} onClick={() => handleSelect('goal', 'sport')}>
              Improve at sport
            </OptionButton>
            <OptionButton selected={data.goal === 'confident'} onClick={() => handleSelect('goal', 'confident')}>
              Feel more confident
            </OptionButton>
            <OptionButton selected={data.goal === 'fitness'} onClick={() => handleSelect('goal', 'fitness')}>
              General fitness
            </OptionButton>
          </div>
        )}
      </div>

      {/* Bottom area — hidden on welcome since button is inline */}
      {currentStep !== 'welcome' && (
        <div className="flex flex-col" style={{ padding: '0 16px 32px', gap: 12 }}>
          {/* Segmented progress */}
          <div className="flex" style={{ gap: 4 }}>
            {STEPS.slice(1).map((s, i) => (
              <div
                key={s}
                className="flex-1"
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: i <= step - 1 ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                }}
              />
            ))}
          </div>

          <div className="flex" style={{ gap: 12 }}>
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="flex-1">
                BACK
              </Button>
            )}
            <Button
              onClick={next}
              disabled={!canNext()}
              className="flex-1"
            >
              {currentStep === 'goal' ? 'BUILD MY PROGRAM' : 'NEXT'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
