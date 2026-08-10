/**
 * Report Builder Component
 * Interface for creating and configuring reports
 */

import React, { useState } from 'react';
import { Button, InputGroup, InputGroupInput } from '@react-mono/ui-controls';
import { ReportConfig, ReportType, ReportDataSource, ReportAggregation, ReportFilter } from '../types/reporting';

interface ReportBuilderProps {
  config: ReportConfig;
  onConfigChange: (config: ReportConfig) => void;
  onGenerate: (config: ReportConfig) => void;
  onSave: (config: ReportConfig) => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  config,
  onConfigChange,
  onGenerate,
  onSave,
  isLoading = false,
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'filters' | 'metrics'>('basic');

  const handleNameChange = (name: string) => {
    onConfigChange({ ...config, name });
  };

  const handleDescriptionChange = (description: string) => {
    onConfigChange({ ...config, description });
  };

  const handleTypeChange = (type: ReportType) => {
    onConfigChange({ ...config, type });
  };

  const handleDataSourceChange = (dataSource: ReportDataSource) => {
    onConfigChange({ ...config, dataSource });
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      field: '',
      operator: 'equals',
      value: '',
    };
    onConfigChange({
      ...config,
      filters: [...(config.filters || []), newFilter],
    });
  };

  const updateFilter = (index: number, filter: ReportFilter) => {
    const filters = [...(config.filters || [])];
    filters[index] = filter;
    onConfigChange({ ...config, filters });
  };

  const removeFilter = (index: number) => {
    const filters = config.filters?.filter((_, i) => i !== index) || [];
    onConfigChange({ ...config, filters });
  };

  const addAggregation = () => {
    const newAgg: ReportAggregation = {
      name: '',
      field: '',
      type: 'count',
    };
    onConfigChange({
      ...config,
      aggregations: [...(config.aggregations || []), newAgg],
    });
  };

  const updateAggregation = (index: number, agg: ReportAggregation) => {
    const aggregations = [...(config.aggregations || [])];
    aggregations[index] = agg;
    onConfigChange({ ...config, aggregations });
  };

  const removeAggregation = (index: number) => {
    const aggregations = config.aggregations?.filter((_, i) => i !== index) || [];
    onConfigChange({ ...config, aggregations });
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';

  return (
    <div className={`${bgClass} rounded-lg shadow p-6 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
        <h2 className={`text-lg font-bold ${textClass}`}>Report Builder</h2>
        <div className="flex gap-2">
          <Button onClick={() => onSave(config)} disabled={isLoading} className="bg-blue-600 text-white">
            💾 Save Config
          </Button>
          <Button onClick={() => onGenerate(config)} disabled={isLoading} className="bg-green-600 text-white">
            {isLoading ? 'Generating...' : '▶ Generate'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
        {['basic', 'filters', 'metrics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? `border-b-2 ${isDarkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'basic' && '📋 Basic'}
            {tab === 'filters' && '🔍 Filters'}
            {tab === 'metrics' && '📊 Metrics'}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Report Name</label>
            <InputGroup>
              <InputGroupInput
                value={config.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Report"
                className={inputBg}
              />
            </InputGroup>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Description</label>
            <textarea
              value={config.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Describe what this report shows..."
              className={`w-full px-3 py-2 rounded border ${inputBg}`}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Report Type</label>
              <select
                value={config.type}
                onChange={(e) => handleTypeChange(e.target.value as ReportType)}
                className={`w-full px-3 py-2 rounded border ${inputBg}`}
              >
                <option value={ReportType.SUMMARY}>Summary</option>
                <option value={ReportType.DETAILED}>Detailed</option>
                <option value={ReportType.COMPARATIVE}>Comparative</option>
                <option value={ReportType.TREND}>Trend</option>
                <option value={ReportType.DISTRIBUTION}>Distribution</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Data Source</label>
              <select
                value={config.dataSource}
                onChange={(e) => handleDataSourceChange(e.target.value as ReportDataSource)}
                className={`w-full px-3 py-2 rounded border ${inputBg}`}
              >
                <option value={ReportDataSource.USERS}>Users</option>
                <option value={ReportDataSource.ORDERS}>Orders</option>
                <option value={ReportDataSource.CUSTOMERS}>Customers</option>
                <option value={ReportDataSource.AUDIT_LOG}>Audit Log</option>
                <option value={ReportDataSource.ACTIVITY}>Activity</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Record Limit</label>
            <InputGroup>
              <InputGroupInput
                type="number"
                value={config.limit || 1000}
                onChange={(e) => onConfigChange({ ...config, limit: parseInt(e.target.value) })}
                className={inputBg}
              />
            </InputGroup>
          </div>
        </div>
      )}

      {/* Filters Tab */}
      {activeTab === 'filters' && (
        <div className="space-y-4">
          {config.filters?.map((filter, idx) => (
            <div
              key={idx}
              className={`rounded p-3 border ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
              } flex items-end gap-2`}
            >
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${textClass}`}>Field</label>
                <InputGroup>
                  <InputGroupInput
                    value={filter.field}
                    onChange={(e) =>
                      updateFilter(idx, { ...filter, field: e.target.value })
                    }
                    placeholder="Field name"
                    className={inputBg}
                  />
                </InputGroup>
              </div>
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${textClass}`}>Operator</label>
                <select
                  value={filter.operator}
                  onChange={(e) =>
                    updateFilter(idx, { ...filter, operator: e.target.value as any })
                  }
                  className={`w-full px-3 py-2 rounded border text-sm ${inputBg}`}
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="gt">greater than</option>
                  <option value="lt">less than</option>
                </select>
              </div>
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${textClass}`}>Value</label>
                <InputGroup>
                  <InputGroupInput
                    value={String(filter.value)}
                    onChange={(e) =>
                      updateFilter(idx, { ...filter, value: e.target.value })
                    }
                    placeholder="Value"
                    className={inputBg}
                  />
                </InputGroup>
              </div>
              <Button
                onClick={() => removeFilter(idx)}
                className="bg-red-600 text-white text-sm"
              >
                ✕
              </Button>
            </div>
          ))}

          <Button onClick={addFilter} className="w-full bg-blue-600 text-white">
            + Add Filter
          </Button>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          {config.aggregations?.map((agg, idx) => (
            <div
              key={idx}
              className={`rounded p-3 border ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
              } flex items-end gap-2`}
            >
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${textClass}`}>Metric Name</label>
                <InputGroup>
                  <InputGroupInput
                    value={agg.name}
                    onChange={(e) =>
                      updateAggregation(idx, { ...agg, name: e.target.value })
                    }
                    placeholder="e.g., Total Revenue"
                    className={inputBg}
                  />
                </InputGroup>
              </div>
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${textClass}`}>Field</label>
                <InputGroup>
                  <InputGroupInput
                    value={agg.field}
                    onChange={(e) =>
                      updateAggregation(idx, { ...agg, field: e.target.value })
                    }
                    placeholder="Field name"
                    className={inputBg}
                  />
                </InputGroup>
              </div>
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${textClass}`}>Type</label>
                <select
                  value={agg.type}
                  onChange={(e) =>
                    updateAggregation(idx, { ...agg, type: e.target.value as any })
                  }
                  className={`w-full px-3 py-2 rounded border text-sm ${inputBg}`}
                >
                  <option value="count">Count</option>
                  <option value="sum">Sum</option>
                  <option value="avg">Average</option>
                  <option value="min">Minimum</option>
                  <option value="max">Maximum</option>
                  <option value="distinct">Distinct</option>
                </select>
              </div>
              <Button
                onClick={() => removeAggregation(idx)}
                className="bg-red-600 text-white text-sm"
              >
                ✕
              </Button>
            </div>
          ))}

          <Button onClick={addAggregation} className="w-full bg-blue-600 text-white">
            + Add Metric
          </Button>
        </div>
      )}
    </div>
  );
};
