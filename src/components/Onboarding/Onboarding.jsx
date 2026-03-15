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
      className="w-full text-left rounded-xl p-4 text-base transition-all min-h-[44px]"
      style={{
        background: selected ? 'var(--accent-dim)' : 'var(--bg-card)',
        border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
        color: selected ? 'var(--accent)' : 'var(--text)',
      }}
    >
      {children}
    </button>
  );

  const SmallOption = ({ selected, onClick, children }) => (
    <button
      onClick={onClick}
      className="flex-1 rounded-lg px-2 py-2 text-sm text-center transition-all min-h-[44px]"
      style={{
        background: selected ? 'var(--accent-dim)' : 'var(--bg-card)',
        border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
        color: selected ? 'var(--accent)' : 'var(--text)',
      }}
    >
      {children}
    </button>
  );

  const UnitToggle = ({ value, onChange, options }) => (
    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-4 py-2 text-sm min-h-[44px] transition-all"
          style={{
            background: value === opt.value ? 'var(--accent-dim)' : 'var(--bg-card)',
            color: value === opt.value ? 'var(--accent)' : 'var(--text-dim)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="app-container min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 flex flex-col justify-center px-6 py-8 overflow-y-auto">
        {/* Welcome */}
        {currentStep === 'welcome' && (
          <div className="text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: 'var(--accent-dim)' }}>
              💪
            </div>
            <h1 className="text-5xl" style={{ color: 'var(--accent)' }}>TEENSTRONG</h1>
            <p className="text-lg" style={{ color: 'var(--text-mid)' }}>
              Evidence-based strength training for teens. Build confidence, feel powerful in your body, and get stronger for sports and life.
            </p>
            <div className="rounded-lg px-4 py-2 text-sm"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              Based on AAP & NSCA guidelines
            </div>
          </div>
        )}

        {/* Age */}
        {currentStep === 'age' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl mb-2">HOW OLD ARE YOU?</h2>
            <OptionButton selected={data.ageGroup === 'under12'} onClick={() => handleSelect('ageGroup', 'under12')}>
              Under 12
            </OptionButton>
            <OptionButton selected={data.ageGroup === '12-14'} onClick={() => handleSelect('ageGroup', '12-14')}>
              12-14
            </OptionButton>
            <OptionButton selected={data.ageGroup === '15-17'} onClick={() => handleSelect('ageGroup', '15-17')}>
              15-17
            </OptionButton>
            {data.ageGroup === 'under12' && (
              <div className="rounded-xl p-4" style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue)' }}>
                <p className="text-sm" style={{ color: 'var(--blue)' }}>
                  TeenStrong is designed for ages 12+. We recommend working with a coach in person for younger athletes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Experience */}
        {currentStep === 'experience' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl mb-2">FITNESS EXPERIENCE?</h2>
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
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-3xl mb-1">QUICK FITNESS CHECK</h2>
              <p className="text-sm" style={{ color: 'var(--text-mid)' }}>
                Don't worry about exact numbers — just pick the closest range. This helps us personalise your program.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Push-ups in one go?</p>
              <div className="flex gap-2">
                {[{ v: 1, l: '0-5' }, { v: 2, l: '6-15' }, { v: 3, l: '16-30' }, { v: 4, l: '30+' }].map(o => (
                  <SmallOption key={o.v} selected={data.assessment.pushups === o.v} onClick={() => handleAssessment('pushups', o.v)}>{o.l}</SmallOption>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Squats in one go?</p>
              <div className="flex gap-2">
                {[{ v: 1, l: '0-10' }, { v: 2, l: '11-25' }, { v: 3, l: '26-50' }, { v: 4, l: '50+' }].map(o => (
                  <SmallOption key={o.v} selected={data.assessment.squats === o.v} onClick={() => handleAssessment('squats', o.v)}>{o.l}</SmallOption>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Sit-ups in one go?</p>
              <div className="flex gap-2">
                {[{ v: 1, l: '0-5' }, { v: 2, l: '6-15' }, { v: 3, l: '16-30' }, { v: 4, l: '30+' }].map(o => (
                  <SmallOption key={o.v} selected={data.assessment.situps === o.v} onClick={() => handleAssessment('situps', o.v)}>{o.l}</SmallOption>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>How long can you hold a plank?</p>
              <div className="flex gap-2">
                {[{ v: 1, l: '<15s' }, { v: 2, l: '15-30s' }, { v: 3, l: '30-60s' }, { v: 4, l: '60s+' }].map(o => (
                  <SmallOption key={o.v} selected={data.assessment.plank === o.v} onClick={() => handleAssessment('plank', o.v)}>{o.l}</SmallOption>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Health Screening */}
        {currentStep === 'health' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl mb-2">HEALTH CHECK</h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-mid)' }}>
              Select any that apply:
            </p>
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
              <div className="rounded-xl p-4" style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue)' }}>
                <p className="text-sm" style={{ color: 'var(--blue)' }}>
                  The AAP recommends young people with health conditions get medical clearance before starting.
                  Please show this to a parent/guardian and check with your doctor.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Equipment */}
        {currentStep === 'equipment' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl mb-2">WHAT EQUIPMENT DO YOU HAVE?</h2>
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
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl mb-1">YOUR MEASUREMENTS</h2>
            <p className="text-sm" style={{ color: 'var(--text-mid)' }}>
              This helps us suggest appropriate weights and track your progress.
            </p>

            {/* Height */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Height</p>
                <UnitToggle
                  value={data.heightUnit}
                  onChange={(v) => setData(d => ({ ...d, heightUnit: v }))}
                  options={[{ value: 'cm', label: 'cm' }, { value: 'ft', label: 'ft / in' }]}
                />
              </div>
              {data.heightUnit === 'cm' ? (
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 165"
                  value={data.height}
                  onChange={e => setData(d => ({ ...d, height: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-base min-h-[44px]"
                  style={{
                    background: 'var(--bg-card)',
                    border: '2px solid var(--border)',
                    color: 'var(--text)',
                    outline: 'none',
                  }}
                />
              ) : (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="ft"
                      value={data.heightFeet}
                      onChange={e => setData(d => ({ ...d, heightFeet: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-base min-h-[44px]"
                      style={{
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border)',
                        color: 'var(--text)',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="in"
                      value={data.heightInches}
                      onChange={e => setData(d => ({ ...d, heightInches: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-base min-h-[44px]"
                      style={{
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border)',
                        color: 'var(--text)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Weight</p>
                <UnitToggle
                  value={data.weightUnit}
                  onChange={(v) => setData(d => ({ ...d, weightUnit: v }))}
                  options={[{ value: 'kg', label: 'kg' }, { value: 'lbs', label: 'lbs' }]}
                />
              </div>
              <input
                type="number"
                inputMode="decimal"
                placeholder={data.weightUnit === 'kg' ? 'e.g. 55' : 'e.g. 120'}
                value={data.weight}
                onChange={e => setData(d => ({ ...d, weight: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-base min-h-[44px]"
                style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border)',
                  color: 'var(--text)',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Goal */}
        {currentStep === 'goal' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl mb-2">WHAT'S YOUR GOAL?</h2>
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

      {/* Bottom area */}
      <div className="px-6 pb-8 flex flex-col gap-3">
        {/* Progress dots */}
        {currentStep !== 'welcome' && (
          <div className="flex justify-center gap-2 mb-2">
            {STEPS.slice(1).map((s, i) => (
              <div
                key={s}
                className="w-2 h-2 rounded-full"
                style={{
                  background: i <= step - 1 ? 'var(--accent)' : 'var(--text-dim)',
                }}
              />
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="flex-1">
              BACK
            </Button>
          )}
          <Button
            onClick={next}
            disabled={!canNext()}
            className={step > 0 ? 'flex-1' : 'w-full'}
          >
            {currentStep === 'welcome' ? 'GET STARTED' : currentStep === 'goal' ? 'BUILD MY PROGRAM' : 'NEXT'}
          </Button>
        </div>
      </div>
    </div>
  );
}
