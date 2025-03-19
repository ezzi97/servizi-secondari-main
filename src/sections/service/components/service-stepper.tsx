import type { Theme } from '@mui/material';

import { Step, Stack, Stepper, StepLabel, useMediaQuery } from '@mui/material';

interface ServiceStepperProps {
  activeStep: number;
  steps: Array<{ label: string }>;
}

export function ServiceStepper({ activeStep, steps }: ServiceStepperProps) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

  if (isMobile) {
    const halfLength = Math.ceil(steps.length / 2);
    return (
      <Stack spacing={2}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            '& .MuiStepLabel-label': {
              typography: 'caption',
            },
          }}
        >
          {steps.slice(0, halfLength).map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{`${index + 1}. ${step.label}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Stepper 
          activeStep={Math.max(activeStep - halfLength, -1)} 
          alternativeLabel
          sx={{
            '& .MuiStepLabel-label': {
              typography: 'caption',
            },
          }}
        >
          {steps.slice(halfLength).map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{`${index + halfLength + 1}. ${step.label}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    );
  }

  return (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{
        '& .MuiStepLabel-label': {
          typography: isTablet ? 'caption' : 'body2',
        },
      }}
    >
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel>{`${index + 1}. ${step.label}`}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
} 