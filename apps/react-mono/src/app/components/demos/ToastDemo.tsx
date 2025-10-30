import { useState } from 'react';
import { ToastProvider, useToast } from '@react-mono/ui-controls';
import { Button } from '@react-mono/ui-controls';

const ToastButtons = () => {
  const { showToast } = useToast();
  const [duration, setDuration] = useState(5000);
  const [position, setPosition] = useState('top-right');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Toast Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              showToast({
                message: 'Success! Your action was completed.',
                variant: 'success',
                duration,
              })
            }
          >
            Show Success
          </Button>
          <Button
            onClick={() =>
              showToast({
                message: 'Error! Something went wrong.',
                variant: 'error',
                duration,
              })
            }
          >
            Show Error
          </Button>
          <Button
            onClick={() =>
              showToast({
                message: 'Warning! Please review your input.',
                variant: 'warning',
                duration,
              })
            }
          >
            Show Warning
          </Button>
          <Button
            onClick={() =>
              showToast({
                message: 'Info: This is a helpful message.',
                variant: 'info',
                duration,
              })
            }
          >
            Show Info
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Duration</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={() => setDuration(2000)}
            className={duration === 2000 ? 'ring-2 ring-primary' : ''}
          >
            2 seconds
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDuration(5000)}
            className={duration === 5000 ? 'ring-2 ring-primary' : ''}
          >
            5 seconds
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDuration(0)}
            className={duration === 0 ? 'ring-2 ring-primary' : ''}
          >
            Persistent
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Position</h3>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="secondary"
            onClick={() => setPosition('top-left')}
            className={position === 'top-left' ? 'ring-2 ring-primary' : ''}
          >
            Top Left
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPosition('top-center')}
            className={position === 'top-center' ? 'ring-2 ring-primary' : ''}
          >
            Top Center
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPosition('top-right')}
            className={position === 'top-right' ? 'ring-2 ring-primary' : ''}
          >
            Top Right
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPosition('bottom-left')}
            className={position === 'bottom-left' ? 'ring-2 ring-primary' : ''}
          >
            Bottom Left
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPosition('bottom-center')}
            className={position === 'bottom-center' ? 'ring-2 ring-primary' : ''}
          >
            Bottom Center
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPosition('bottom-right')}
            className={position === 'bottom-right' ? 'ring-2 ring-primary' : ''}
          >
            Bottom Right
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Toasts</h3>
        <Button
          onClick={() => {
            ['success', 'error', 'warning', 'info'].forEach((variant, index) => {
              setTimeout(() => {
                showToast({
                  message: `This is a ${variant} message`,
                  variant: variant as any,
                  duration,
                });
              }, index * 500);
            });
          }}
        >
          Show Multiple Toasts
        </Button>
      </div>
    </div>
  );
};

export const ToastDemo = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-6">Toast Notifications</h2>
        <ToastProvider>
          <ToastButtons />
        </ToastProvider>
      </section>
    </div>
  );
};