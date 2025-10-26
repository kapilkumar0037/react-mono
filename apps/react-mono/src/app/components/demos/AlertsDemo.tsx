import { Alert } from '@react-mono/ui-controls';

export const AlertsDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Alerts</h2>
        <p className="text-gray-600 mb-8">
          Alert components for different types of messages.
        </p>
      </div>

      <div className="space-y-4">
        <Alert variant="info" title="Information">
          This is an informational message with a title.
        </Alert>

        <Alert variant="success">
          Your changes have been successfully saved!
        </Alert>

        <Alert 
          variant="warning" 
          title="Warning" 
          dismissible 
          onDismiss={() => console.log('Warning alert dismissed')}
        >
          Please backup your data before proceeding.
        </Alert>

        <Alert 
          variant="error" 
          title="Error" 
          dismissible 
          onDismiss={() => console.log('Error alert dismissed')}
        >
          Unable to connect to the server. Please try again later.
        </Alert>

        <Alert 
          variant="info" 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          This alert uses a custom icon.
        </Alert>
      </div>
    </div>
  );
};