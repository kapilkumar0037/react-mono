import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRole, DEFAULT_ROLE_DEFINITIONS, RoleDefinition } from './rbac';
import { AppCommand, getAvailableCommands } from './appCommands';

const RECENT_COMMANDS_STORAGE_KEY = 'admin-template.recent-commands';

interface CommandPaletteProps {
  isOpen: boolean;
  isDarkMode?: boolean;
  currentRole: AppRole;
  definitions?: Record<AppRole, RoleDefinition>;
  onClose: () => void;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

interface RuntimeCommand extends AppCommand {
  action?: () => void;
}

function readRecentCommands(): string[] {
  const value = localStorage.getItem(RECENT_COMMANDS_STORAGE_KEY);

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function persistRecentCommands(commandIds: string[]): void {
  localStorage.setItem(RECENT_COMMANDS_STORAGE_KEY, JSON.stringify(commandIds.slice(0, 6)));
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  isDarkMode = false,
  currentRole,
  definitions = DEFAULT_ROLE_DEFINITIONS,
  onClose,
  onToggleDarkMode,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() => readRecentCommands());

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commands = useMemo<RuntimeCommand[]>(() => {
    const available = getAvailableCommands(currentRole, definitions).map((command) => {
      const target = command.to;
      return {
        ...command,
        action: target
          ? () => {
              navigate(target);
            }
          : undefined,
      };
    });

    return [
      ...available,
      {
        id: 'action-theme',
        label: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        description: 'Toggle the workspace color theme.',
        keywords: ['theme', 'dark mode', 'light mode', 'appearance'],
        section: 'Workspace',
        action: onToggleDarkMode,
      },
      {
        id: 'action-logout',
        label: 'Log Out',
        description: 'Sign out of the current session.',
        keywords: ['logout', 'sign out', 'exit'],
        section: 'Account',
        action: onLogout,
      },
    ];
  }, [currentRole, definitions, isDarkMode, navigate, onLogout, onToggleDarkMode]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      const recent = recentCommandIds
        .map((id) => commands.find((command) => command.id === id))
        .filter((command): command is RuntimeCommand => Boolean(command));

      const remaining = commands.filter((command) => !recent.some((recentCommand) => recentCommand.id === command.id));
      return [...recent, ...remaining].slice(0, 10);
    }

    return commands
      .filter((command) => {
        const searchBlob = [command.label, command.description, ...command.keywords].join(' ').toLowerCase();
        return searchBlob.includes(normalizedQuery);
      })
      .slice(0, 10);
  }, [commands, query, recentCommandIds]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

  const runCommand = (command: RuntimeCommand) => {
    command.action?.();

    const nextRecent = [command.id, ...recentCommandIds.filter((item) => item !== command.id)];
    setRecentCommandIds(nextRecent);
    persistRecentCommands(nextRecent);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/55 px-4 pt-20" onClick={onClose}>
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-lg border shadow-2xl ${
          isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className={`border-b px-4 py-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <svg
              className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setActiveIndex((current) => Math.min(current + 1, Math.max(filteredCommands.length - 1, 0)));
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setActiveIndex((current) => Math.max(current - 1, 0));
                }

                if (event.key === 'Enter' && filteredCommands[activeIndex]) {
                  event.preventDefault();
                  runCommand(filteredCommands[activeIndex]);
                }
              }}
              placeholder="Search pages, actions, and shortcuts..."
              className={`w-full bg-transparent text-sm outline-none ${
                isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <span
              className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${
                isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
              }`}
            >
              Ctrl K
            </span>
          </div>
        </div>

        <div className={`px-4 py-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {query.trim() ? 'Matching commands' : 'Recent and available commands'} for {currentRole}
        </div>

        <div className="max-h-[60vh] overflow-y-auto pb-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                type="button"
                onClick={() => runCommand(command)}
                className={`flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors ${
                  activeIndex === index
                    ? isDarkMode
                      ? 'bg-gray-800'
                      : 'bg-blue-50'
                    : isDarkMode
                    ? 'hover:bg-gray-800/70'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{command.label}</div>
                  <div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{command.description}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                      isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {command.section}
                  </span>
                  {'to' in command && command.to && (
                    <span className={`text-[11px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{command.to}</span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className={`px-4 py-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No commands match "{query}".
            </div>
          )}
        </div>

        <div className={`flex items-center justify-between border-t px-4 py-3 text-xs ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
          <span>Use arrows to move and Enter to run.</span>
          <span>{location.pathname}</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
