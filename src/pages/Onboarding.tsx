import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Folder, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';

export function Onboarding() {
  const navigate = useNavigate();
  const { updateSettings } = useApp();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Folder,
      title: 'This is your Life Deck',
      description: 'Organize what matters across Health, Finance, and Personal Growth.',
    },
    {
      icon: Sparkles,
      title: 'Generate smart prompts',
      description: 'Create contextual prompts to use in any AI assistant you prefer.',
    },
    {
      icon: BookOpen,
      title: 'Save the gems',
      description: 'Build your personal knowledge base with insights from your conversations.',
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      updateSettings({ hasCompletedOnboarding: true });
      navigate('/home');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-accent/10 rounded-full">
            <Icon className="w-16 h-16 text-accent" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentStep.title}
          </h1>
          <p className="text-lg text-gray-600">
            {currentStep.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={clsx(
                'h-2 rounded-full transition-all duration-300',
                index === step
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-gray-300'
              )}
            />
          ))}
        </div>

        {/* Button */}
        <div className="pt-8">
          <Button
            onClick={handleNext}
            variant="primary"
            size="lg"
            fullWidth
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </Button>
        </div>

        {/* Skip link */}
        {!isLastStep && (
          <button
            onClick={() => {
              updateSettings({ hasCompletedOnboarding: true });
              navigate('/home');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
