import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  label: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        return (
          <React.Fragment key={step.label}>
            <motion.div
              className={`flex flex-col items-center relative`}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: isActive ? 1.1 : 1, opacity: isActive ? 1 : 0.7 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                  ${isActive ? 'border-red-500 bg-red-500 text-white shadow-lg' : isCompleted ? 'border-green-400 bg-green-400 text-white' : 'border-gray-300 bg-white text-gray-400'}`}
              >
                {step.icon ? step.icon : idx + 1}
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? 'text-red-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>{step.label}</span>
            </motion.div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded bg-gradient-to-r ${isCompleted ? 'from-green-400 to-red-500' : 'from-gray-200 to-gray-200'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper; 