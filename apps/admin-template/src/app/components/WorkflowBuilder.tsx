/**
 * Workflow Builder Component
 * Visual interface for creating and editing workflows
 */

import React, { useState } from 'react';
import { Button, InputGroup, InputGroupInput } from '@react-mono/ui-controls';
import { Workflow, WorkflowStep, WorkflowAction, WorkflowTriggerType, WorkflowActionType } from '../types/workflow';

interface WorkflowBuilderProps {
  workflow: Workflow;
  onWorkflowChange: (workflow: Workflow) => void;
  onSave: (workflow: Workflow) => void;
  validationErrors?: string[];
  isDarkMode?: boolean;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onWorkflowChange,
  onSave,
  validationErrors = [],
  isDarkMode = false,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    workflow.steps.length > 0 ? workflow.steps[0].id : null,
  );

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const handleNameChange = (name: string) => {
    onWorkflowChange({ ...workflow, name });
  };

  const handleDescriptionChange = (description: string) => {
    onWorkflowChange({ ...workflow, description });
  };

  const handleTriggerTypeChange = (type: WorkflowTriggerType) => {
    onWorkflowChange({
      ...workflow,
      trigger: { ...workflow.trigger, type },
    });
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: `Step ${workflow.steps.length + 1}`,
      order: workflow.steps.length,
      actions: [],
    };

    onWorkflowChange({
      ...workflow,
      steps: [...workflow.steps, newStep],
    });
    setSelectedStepId(newStep.id);
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    const steps = workflow.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s));
    onWorkflowChange({ ...workflow, steps });
  };

  const removeStep = (stepId: string) => {
    const steps = workflow.steps.filter((s) => s.id !== stepId);
    onWorkflowChange({ ...workflow, steps });
    if (selectedStepId === stepId) {
      setSelectedStepId(steps.length > 0 ? steps[0].id : null);
    }
  };

  const addAction = (stepId: string) => {
    const newAction: WorkflowAction = {
      id: `action-${Date.now()}`,
      type: WorkflowActionType.SEND_EMAIL,
      name: 'New Action',
      retryable: false,
      config: {},
    };

    const steps = workflow.steps.map((s) => {
      if (s.id === stepId) {
        return { ...s, actions: [...s.actions, newAction] };
      }
      return s;
    });

    onWorkflowChange({ ...workflow, steps });
  };

  const updateAction = (stepId: string, actionId: string, updates: Partial<WorkflowAction>) => {
    const steps = workflow.steps.map((s) => {
      if (s.id === stepId) {
        return {
          ...s,
          actions: s.actions.map((a) => (a.id === actionId ? { ...a, ...updates } : a)),
        };
      }
      return s;
    });

    onWorkflowChange({ ...workflow, steps });
  };

  const removeAction = (stepId: string, actionId: string) => {
    const steps = workflow.steps.map((s) => {
      if (s.id === stepId) {
        return { ...s, actions: s.actions.filter((a) => a.id !== actionId) };
      }
      return s;
    });

    onWorkflowChange({ ...workflow, steps });
  };

  const selectedStep = workflow.steps.find((s) => s.id === selectedStepId);

  return (
    <div className={`${bgClass} rounded-lg shadow overflow-hidden`}>
      {/* Header */}
      <div className={`border-b ${borderClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${textClass}`}>Workflow Builder</h2>
          <Button onClick={() => onSave(workflow)} className="bg-blue-600 text-white">
            💾 Save Workflow
          </Button>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Validation Errors:</p>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, idx) => (
                <li key={idx} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Workflow Name
            </label>
            <InputGroup>
              <InputGroupInput
                value={workflow.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Workflow"
                className={inputBg}
              />
            </InputGroup>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Trigger Type
            </label>
            <select
              value={workflow.trigger.type}
              onChange={(e) => handleTriggerTypeChange(e.target.value as WorkflowTriggerType)}
              className={`w-full px-3 py-2 rounded border ${inputBg}`}
            >
              <option value="manual">Manual</option>
              <option value="data_change">Data Change</option>
              <option value="scheduled">Scheduled</option>
              <option value="event">Event</option>
              <option value="threshold">Threshold</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${textClass}`}>
            Description
          </label>
          <textarea
            value={workflow.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Describe what this workflow does..."
            className={`w-full px-3 py-2 rounded border ${inputBg}`}
            rows={2}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex" style={{ minHeight: '600px' }}>
        {/* Steps Sidebar */}
        <div className={`w-1/3 border-r ${borderClass} p-4 space-y-3`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textClass}`}>Steps</h3>
            <Button onClick={addStep} className="bg-green-600 text-white text-sm">
              + Add
            </Button>
          </div>

          {workflow.steps.length === 0 ? (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No steps yet. Add a step to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {workflow.steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedStepId === step.id
                      ? `${isDarkMode ? 'bg-blue-900 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-600'}`
                      : `${cardBg} border ${borderClass}`
                  }`}
                >
                  <p className={`font-medium text-sm ${textClass}`}>{step.name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.actions.length} action{step.actions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step Editor */}
        <div className={`w-2/3 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {selectedStep ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                  Step Name
                </label>
                <InputGroup>
                  <InputGroupInput
                    value={selectedStep.name}
                    onChange={(e) => updateStep(selectedStep.id, { name: e.target.value })}
                    className={inputBg}
                  />
                </InputGroup>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h4 className={`font-semibold ${textClass}`}>Actions</h4>
                <Button
                  onClick={() => addAction(selectedStep.id)}
                  className="bg-green-600 text-white text-sm"
                >
                  + Add Action
                </Button>
              </div>

              {selectedStep.actions.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No actions yet. Add an action to this step.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedStep.actions.map((action, idx) => (
                    <div
                      key={action.id}
                      className={`rounded p-4 border ${
                        isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className={`font-medium ${textClass}`}>{action.name}</p>
                        <div className="flex gap-1">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              isDarkMode
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {action.type}
                          </span>
                          <Button
                            onClick={() => removeAction(selectedStep.id, action.id)}
                            className="bg-red-600 text-white text-xs"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                      <select
                        value={action.type}
                        onChange={(e) =>
                          updateAction(selectedStep.id, action.id, {
                            type: e.target.value as WorkflowActionType,
                          })
                        }
                        className={`w-full text-sm px-2 py-1 rounded border ${inputBg}`}
                      >
                        <option value="send_email">Send Email</option>
                        <option value="create_record">Create Record</option>
                        <option value="update_record">Update Record</option>
                        <option value="delete_record">Delete Record</option>
                        <option value="export_data">Export Data</option>
                        <option value="send_notification">Send Notification</option>
                        <option value="execute_script">Execute Script</option>
                        <option value="wait">Wait</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={() => removeStep(selectedStep.id)}
                  className="bg-red-600 text-white w-full"
                >
                  🗑 Delete Step
                </Button>
              </div>
            </div>
          ) : (
            <p className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select a step or create a new one to begin
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
