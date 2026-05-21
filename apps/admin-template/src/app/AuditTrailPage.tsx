import React from 'react';
import { AuditTrail } from './components/AuditTrail';

interface AuditTrailPageProps {
  isDarkMode?: boolean;
}

const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ isDarkMode = false }) => {
  return <AuditTrail isDarkMode={isDarkMode} />;
};

export default AuditTrailPage;
