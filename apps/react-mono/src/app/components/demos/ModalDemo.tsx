import { useState } from 'react';
import { Modal } from '@react-mono/ui-controls';

export const ModalDemo = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isLargeOpen, setIsLargeOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Modal</h2>
        <button
          onClick={() => setIsBasicOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Open Basic Modal
        </button>
        <Modal
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          title="Basic Modal"
        >
          <p className="text-gray-600">
            This is a basic modal with a title and close button. Click outside or press ESC to close.
          </p>
        </Modal>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Large Modal with Form</h2>
        <button
          onClick={() => setIsLargeOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Open Large Modal
        </button>
        <Modal
          isOpen={isLargeOpen}
          onClose={() => setIsLargeOpen(false)}
          title="Contact Form"
          size="lg"
        >
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsLargeOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Modal</h2>
        <button
          onClick={() => setIsCustomOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Open Custom Modal
        </button>
        <Modal
          isOpen={isCustomOpen}
          onClose={() => setIsCustomOpen(false)}
          size="sm"
          showCloseButton={false}
          className="bg-gray-800 text-white"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Success!</h3>
            <p className="text-gray-300 mb-4">Your changes have been saved successfully.</p>
            <button
              onClick={() => setIsCustomOpen(false)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Continue
            </button>
          </div>
        </Modal>
      </section>
    </div>
  );
};