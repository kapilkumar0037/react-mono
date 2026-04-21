import React, { useMemo, useState } from 'react';
import { useToast } from '@react-mono/ui-controls';
import {
  AppRole,
  DEFAULT_ROLE_DEFINITIONS,
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
  RoleDefinition,
  getRoleBadgeClass,
} from './rbac';
import { appendAuditEntry, persistRolePolicies, readStoredRolePolicies, RolePolicy } from './rbacStorage';

interface AccessControlProps {
  isDarkMode?: boolean;
  currentRole: AppRole;
  currentUserEmail?: string;
}

function toDefinitionMap(policies: RolePolicy[]): Record<AppRole, RoleDefinition> {
  return policies.reduce(
    (accumulator, policy) => ({
      ...accumulator,
      [policy.role]: {
        label: policy.role,
        description: DEFAULT_ROLE_DEFINITIONS[policy.role].description,
        permissions: policy.permissions,
      },
    }),
    {} as Record<AppRole, RoleDefinition>
  );
}

const AccessControl: React.FC<AccessControlProps> = ({
  isDarkMode = false,
  currentRole,
  currentUserEmail,
}) => {
  const { showToast } = useToast();
  const [policies, setPolicies] = useState<RolePolicy[]>(() => readStoredRolePolicies());

  const roleDefinitions = useMemo(() => toDefinitionMap(policies), [policies]);

  const handlePermissionToggle = (role: AppRole, permission: keyof typeof PERMISSION_LABELS) => {
    setPolicies((currentPolicies) =>
      currentPolicies.map((policy) => {
        if (policy.role !== role) {
          return policy;
        }

        const nextPermissions = policy.permissions.includes(permission)
          ? policy.permissions.filter((item) => item !== permission)
          : [...policy.permissions, permission];

        return {
          ...policy,
          permissions: nextPermissions,
        };
      })
    );
  };

  const handleSavePolicies = () => {
    persistRolePolicies(policies);
    appendAuditEntry({
      user: currentUserEmail ?? 'Workspace admin',
      action: 'Access Policy Updated',
      description: `Role permissions were updated by ${currentRole}.`,
      timestamp: 'Just now',
      category: 'system',
      status: 'success',
    });
    showToast({
      message: 'Access policies updated successfully.',
      variant: 'success',
    });
  };

  const totalProtectedAreas = Object.keys(PERMISSION_LABELS).length;

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Security</p>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Access Control</h1>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Control which roles can reach each operational area across the workspace.
          </p>
        </div>

        <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Current session</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClass(currentRole)}`}>
              {currentRole}
            </span>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentUserEmail ?? 'Workspace admin'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg border p-5 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Protected areas</p>
          <p className={`mt-2 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalProtectedAreas}</p>
        </div>
        <div className={`rounded-lg border p-5 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Roles configured</p>
          <p className={`mt-2 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{policies.length}</p>
        </div>
        <div className={`rounded-lg border p-5 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Owner coverage</p>
          <p className={`mt-2 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {roleDefinitions.Owner.permissions.length}/{totalProtectedAreas}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {policies.map((policy) => (
          <div
            key={policy.role}
            className={`rounded-lg border p-6 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{policy.role}</h2>
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClass(policy.role)}`}>
                    {policy.permissions.length} permissions
                  </span>
                </div>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {DEFAULT_ROLE_DEFINITIONS[policy.role].description}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
              {PERMISSION_GROUPS.map((group) => (
                <div
                  key={`${policy.role}-${group.name}`}
                  className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.name}</h3>
                  <div className="mt-3 space-y-3">
                    {group.permissions.map((permission) => (
                      <label key={`${policy.role}-${permission}`} className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={policy.permissions.includes(permission)}
                          onChange={() => handlePermissionToggle(policy.role, permission)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {PERMISSION_LABELS[permission]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSavePolicies}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          Save Access Policies
        </button>
      </div>
    </div>
  );
};

export default AccessControl;
