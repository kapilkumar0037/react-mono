import React from 'react';
import AccessDenied from './AccessDenied';
import { AppPermission, AppRole, RoleDefinition, hasPermission } from './rbac';

interface PermissionGuardProps {
  currentRole: AppRole;
  permission: AppPermission;
  definitions?: Record<AppRole, RoleDefinition>;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  currentRole,
  permission,
  definitions,
  isDarkMode = false,
  children,
}) => {
  if (!hasPermission(currentRole, permission, definitions)) {
    return (
      <AccessDenied
        isDarkMode={isDarkMode}
        message={`The ${currentRole} role does not include ${permission.replace('.', ' ')} access.`}
      />
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
