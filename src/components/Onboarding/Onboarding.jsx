import { useState } from 'react';
import Button from '../shared/Button';

const STEPS = ['welcome', 'age', 'experience', 'health', 'equipment', 'goal'];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    ageGroup: null,
    experience: null,
    healthFlags: [],
    equipment: null,
    goal: null,
  });

  const currentStep = STEPS[step];
  const canNext = () => {
    switch (currentStep) {
      case 'welcome': return true;
      case 'age': return data.ageGroup !== null && data.ageGroup !== 'under12';
      case 'experience': return data.experience !== null;
      case 'health': return data.healthFlags.length > 0 || data.healthFlags.includes('none');
      case 'equipment': return data.equipment !== null;
      case 'goal': return data.goal !== null;
      default: return false;
    }
  };

  const next = () => {
    if (step === STEPS.length - 1) {
      onComplete(data);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSelect = (field, value) => {
    setData(d => ({ ...d, [field]: value }));
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', maxWidth: 430, margin: '0 auto' }}>
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Welcome */}
        {currentStep === 'welcome' && (
          <div className="text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: 'var(--accent-dim)' }}>
              💪
            </div>
            <h1 className="text-5xl" style={{ color: 'var(--accent)' }}>TEENSTRONG</h1>
            <p className="text-lg" style={{ color: 'var(--text-mid)' }}>
              The first evidence-based strength training app built specifically for teens.
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
              <div className="rounded-xl p-4" style={{ background: 'var(--red-dim)', border: '1px solid var(--red)' }}>
                <p className="text-sm" style={{ color: 'var(--red)' }}>
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
              <div className="rounded-xl p-4" style={{ background: 'var(--red-dim)', border: '1px solid var(--red)' }}>
                <p className="text-sm" style={{ color: 'var(--red)' }}>
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
