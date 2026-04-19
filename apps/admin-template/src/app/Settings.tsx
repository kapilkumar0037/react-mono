import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminActionConfirm from './AdminActionConfirm';

interface SettingsProps {
  isDarkMode?: boolean;
}

type SettingsTab = 'profile' | 'organization' | 'notifications' | 'security' | 'preferences';

const SETTINGS_TABS: SettingsTab[] = ['profile', 'organization', 'notifications', 'security', 'preferences'];
const SETTINGS_STORAGE_KEY = 'admin-template.settings';

const DEFAULT_PROFILE_SETTINGS = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  company: 'Tech Corp',
  phone: '+1 (555) 123-4567',
  address: '123 Business Ave',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'United States',
};

const DEFAULT_APP_SETTINGS = {
  emailNotifications: true,
  pushNotifications: true,
  smsAlerts: false,
  weeklyReport: true,
  monthlyDigest: true,
  marketingEmails: false,
  dataCollection: true,
  analyticsTracking: true,
  twoFactorAuth: false,
  sessionTimeout: '30',
  backupFrequency: 'weekly',
};

const DEFAULT_ORGANIZATION_SETTINGS = {
  organizationName: 'Tech Corp',
  workspaceSlug: 'tech-corp',
  industry: 'SaaS',
  employeeRange: '51-200',
  defaultCurrency: 'USD',
  fiscalYearStart: 'January',
  billingEmail: 'billing@techcorp.example',
  supportEmail: 'support@techcorp.example',
  auditRetention: '180',
  releaseChannel: 'stable',
  customerPortal: true,
  autoInvite: false,
};

type ProfileSettings = typeof DEFAULT_PROFILE_SETTINGS;
type AppSettings = typeof DEFAULT_APP_SETTINGS;
type OrganizationSettings = typeof DEFAULT_ORGANIZATION_SETTINGS;

interface StoredSettings {
  profile?: Partial<ProfileSettings>;
  app?: Partial<AppSettings>;
  organization?: Partial<OrganizationSettings>;
}

function getSettingsTab(value: string | null): SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab) ? (value as SettingsTab) : 'profile';
}

function readStoredSettings(): StoredSettings {
  const value = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as StoredSettings;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persistStoredSettings(settings: StoredSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState<ProfileSettings>(() => ({
    ...DEFAULT_PROFILE_SETTINGS,
    ...readStoredSettings().profile,
  }));

  const [appSettings, setAppSettings] = useState<AppSettings>(() => ({
    ...DEFAULT_APP_SETTINGS,
    ...readStoredSettings().app,
  }));

  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(() => ({
    ...DEFAULT_ORGANIZATION_SETTINGS,
    ...readStoredSettings().organization,
  }));

  const [successMessage, setSuccessMessage] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => getSettingsTab(searchParams.get('tab')));

  useEffect(() => {
    setActiveTab(getSettingsTab(searchParams.get('tab')));
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    const nextParams = new URLSearchParams(searchParams);

    if (tab === 'profile') {
      nextParams.delete('tab');
    } else {
      nextParams.set('tab', tab);
    }

    setActiveTab(tab);
    setSearchParams(nextParams, { replace: true });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof ProfileSettings]: value
    }));
  };

  const handleAppSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleOrganizationSettingChange = <K extends keyof OrganizationSettings>(
    key: K,
    value: OrganizationSettings[K]
  ) => {
    setOrganizationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    persistStoredSettings({
      ...readStoredSettings(),
      app: appSettings,
    });
  }, [appSettings]);

  useEffect(() => {
    persistStoredSettings({
      ...readStoredSettings(),
      organization: organizationSettings,
    });
  }, [organizationSettings]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    persistStoredSettings({
      ...readStoredSettings(),
      profile: formData,
    });
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleResetSettings = () => {
    setFormData(DEFAULT_PROFILE_SETTINGS);
    setAppSettings(DEFAULT_APP_SETTINGS);
    setOrganizationSettings(DEFAULT_ORGANIZATION_SETTINGS);
    persistStoredSettings({
      profile: DEFAULT_PROFILE_SETTINGS,
      app: DEFAULT_APP_SETTINGS,
      organization: DEFAULT_ORGANIZATION_SETTINGS,
    });
    setIsResetConfirmOpen(false);
    setSuccessMessage('Settings reset to defaults.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your profile, notifications, and application preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleTabChange('profile')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => handleTabChange('organization')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'organization'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Organization
        </button>
        <button
          onClick={() => handleTabChange('notifications')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => handleTabChange('security')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => handleTabChange('preferences')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'preferences'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Preferences
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formData.email}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                  Change Avatar
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSaveProfile}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-6">Address</h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organization Tab */}
      {activeTab === 'organization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Workspace</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {organizationSettings.organizationName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {organizationSettings.workspaceSlug}.admin.local
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Plan readiness</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">92%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-2 w-[92%] rounded-full bg-green-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Billing contacts, audit retention, and portal controls are configured.
                  </p>
                </div>
              </div>
            </div>

            <form className="lg:col-span-2" onSubmit={handleSaveSettings}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Organization Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={organizationSettings.organizationName}
                      onChange={(e) => handleOrganizationSettingChange('organizationName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Workspace Slug</label>
                    <input
                      type="text"
                      value={organizationSettings.workspaceSlug}
                      onChange={(e) => handleOrganizationSettingChange('workspaceSlug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Industry</label>
                    <select
                      value={organizationSettings.industry}
                      onChange={(e) => handleOrganizationSettingChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SaaS">SaaS</option>
                      <option value="Retail">Retail</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Size</label>
                    <select
                      value={organizationSettings.employeeRange}
                      onChange={(e) => handleOrganizationSettingChange('employeeRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-1000">201-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Default Currency</label>
                    <select
                      value={organizationSettings.defaultCurrency}
                      onChange={(e) => handleOrganizationSettingChange('defaultCurrency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fiscal Year Starts</label>
                    <select
                      value={organizationSettings.fiscalYearStart}
                      onChange={(e) => handleOrganizationSettingChange('fiscalYearStart', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {['January', 'April', 'July', 'October'].map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Operations</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Billing Email</label>
                    <input
                      type="email"
                      value={organizationSettings.billingEmail}
                      onChange={(e) => handleOrganizationSettingChange('billingEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={organizationSettings.supportEmail}
                      onChange={(e) => handleOrganizationSettingChange('supportEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Audit Retention</label>
                    <select
                      value={organizationSettings.auditRetention}
                      onChange={(e) => handleOrganizationSettingChange('auditRetention', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                      <option value="730">2 years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Release Channel</label>
                    <select
                      value={organizationSettings.releaseChannel}
                      onChange={(e) => handleOrganizationSettingChange('releaseChannel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="stable">Stable</option>
                      <option value="early">Early access</option>
                      <option value="beta">Beta</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Portal</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Let customers manage invoices, orders, and support requests.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={organizationSettings.customerPortal}
                      onChange={(e) => handleOrganizationSettingChange('customerPortal', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auto-Invite New Users</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Send workspace invitations when teammates are added.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={organizationSettings.autoInvite}
                      onChange={(e) => handleOrganizationSettingChange('autoInvite', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  Save Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

          <form onSubmit={handleSaveSettings}>
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Receive email updates about your account</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appSettings.emailNotifications}
                      onChange={(e) => handleAppSettingChange('emailNotifications', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Receive browser push notifications</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appSettings.pushNotifications}
                      onChange={(e) => handleAppSettingChange('pushNotifications', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* SMS Alerts */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SMS Alerts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Receive critical alerts via SMS</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appSettings.smsAlerts}
                      onChange={(e) => handleAppSettingChange('smsAlerts', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Weekly Report */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Report</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Receive weekly summary reports every Monday</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appSettings.weeklyReport}
                      onChange={(e) => handleAppSettingChange('weeklyReport', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Monthly Digest */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Digest</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Receive monthly digest emails</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appSettings.monthlyDigest}
                      onChange={(e) => handleAppSettingChange('monthlyDigest', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Marketing Emails */}
              <div className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing Emails</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Receive promotional and marketing emails</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appSettings.marketingEmails}
                      onChange={(e) => handleAppSettingChange('marketingEmails', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
            >
              Save Notification Settings
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Add an extra layer of security to your account</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.twoFactorAuth}
                  onChange={(e) => handleAppSettingChange('twoFactorAuth', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className={appSettings.twoFactorAuth ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                {appSettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </span>
            </p>
          </div>

          {/* Session Timeout */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Session Timeout</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Automatically log out after inactivity</p>
            <div className="flex gap-2 flex-wrap">
              {['15', '30', '60', '120'].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleAppSettingChange('sessionTimeout', minutes)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    appSettings.sessionTimeout === minutes
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(e); }}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Data Collection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Collection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Allow us to collect usage data to improve the app</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.dataCollection}
                  onChange={(e) => handleAppSettingChange('dataCollection', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Analytics Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Allow analytics services to track your usage</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.analyticsTracking}
                  onChange={(e) => handleAppSettingChange('analyticsTracking', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Backup Frequency */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup Frequency</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">How often should we back up your data?</p>
            <select
              value={appSettings.backupFrequency}
              onChange={(e) => handleAppSettingChange('backupFrequency', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">These actions cannot be undone</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors"
              >
                Reset Settings
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-500 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminActionConfirm
        isOpen={isResetConfirmOpen}
        title="Reset Settings"
        message="Reset profile details, organization settings, notification settings, security options, and preferences back to their defaults?"
        confirmLabel="Reset Settings"
        confirmClassName="bg-amber-600 text-white"
        isDarkMode={isDarkMode}
        onCancel={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetSettings}
      />
    </div>
  );
};

export default Settings;
