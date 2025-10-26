import { Textarea } from '@react-mono/ui-controls';

export const TextareasDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Textareas</h2>
        <p className="text-gray-600 mb-8">
          Textarea components for multi-line text input.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Textarea</h3>
        <div className="max-w-lg">
          <Textarea 
            rows={4} 
            placeholder="Type your message here..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Label</h3>
        <div className="max-w-lg">
          <Textarea rows={4}>
            Feedback Message
          </Textarea>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">States</h3>
        <div className="max-w-lg space-y-4">
          <Textarea 
            rows={2} 
            placeholder="Disabled textarea"
            disabled
          />
          <Textarea 
            rows={2} 
            placeholder="Read-only textarea"
            readOnly
            defaultValue="This is read-only content"
          />
        </div>
      </div>
    </div>
  );
};