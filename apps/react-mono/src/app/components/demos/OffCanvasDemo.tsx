import React, { useState } from 'react';
import { OffCanvas } from '@react-mono/ui-controls';

export const OffCanvasDemo: React.FC = () => {
  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [topOpen, setTopOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  const navigationContent = (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-500 mb-2">MAIN MENU</div>
        <nav className="space-y-1">
          {[
            { icon: '🏠', label: 'Dashboard', badge: '2' },
            { icon: '📊', label: 'Analytics', badge: 'New' },
            { icon: '⚙️', label: 'Settings' },
            { icon: '👥', label: 'Team Members' },
          ].map(item => (
            <a
              key={item.label}
              href="#"
              className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-500 mb-2">RECENT ACTIVITY</div>
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium">Project "Atlas" created</div>
            <div className="text-xs text-gray-500">2 hours ago by John Doe</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium">New team member added</div>
            <div className="text-xs text-gray-500">Yesterday by Sarah Smith</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium">Sprint planning completed</div>
            <div className="text-xs text-gray-500">2 days ago by Team Lead</div>
          </div>
        </div>
      </div>
    </div>
  );

  const notificationContent = (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-500">NOTIFICATIONS</div>
        <button className="text-xs text-primary hover:text-primary/80">Mark all as read</button>
      </div>
      <div className="space-y-3">
        {[
          {
            title: 'New Comment',
            desc: 'Jane left a comment on your post',
            time: '5 min ago',
            unread: true
          },
          {
            title: 'Deploy Successful',
            desc: 'Production deployment completed',
            time: '1 hour ago'
          },
          {
            title: 'Meeting Reminder',
            desc: 'Team standup in 30 minutes',
            time: '2 hours ago',
            unread: true
          }
        ].map((notification, i) => (
          <div key={i} className={`p-3 rounded-md ${notification.unread ? 'bg-primary/5' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium">{notification.title}</div>
                <div className="text-sm text-gray-600">{notification.desc}</div>
              </div>
              <div className="text-xs text-gray-500">{notification.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const settingsContent = (
    <div className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <div className="text-sm font-medium">Dark Mode</div>
            <div className="text-xs text-gray-500">Toggle dark mode theme</div>
          </div>
          <button className="w-10 h-6 bg-gray-200 rounded-full relative">
            <span className="w-4 h-4 bg-white rounded-full absolute left-1 top-1" />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <div className="text-sm font-medium">Notifications</div>
            <div className="text-xs text-gray-500">Enable push notifications</div>
          </div>
          <button className="w-10 h-6 bg-primary rounded-full relative">
            <span className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <div className="text-sm font-medium">Auto Updates</div>
            <div className="text-xs text-gray-500">Keep app up to date</div>
          </div>
          <button className="w-10 h-6 bg-primary rounded-full relative">
            <span className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Off Canvas</h2>
        <p className="text-sm text-gray-600 mb-4">
          A sliding panel that can appear from any edge of the screen.
        </p>

        <div className="space-y-6">
          {/* Basic Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Examples</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setRightOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Open Right
              </button>
              <button
                onClick={() => setLeftOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Open Left
              </button>
              <button
                onClick={() => setTopOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Open Top
              </button>
              <button
                onClick={() => setBottomOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Open Bottom
              </button>
            </div>

            {/* Right Panel */}
            <OffCanvas
              isOpen={rightOpen}
              onClose={() => setRightOpen(false)}
              placement="right"
              header="Right Panel"
            >
              {notificationContent}
            </OffCanvas>

            {/* Left Panel */}
            <OffCanvas
              isOpen={leftOpen}
              onClose={() => setLeftOpen(false)}
              placement="left"
              header="Navigation Menu"
            >
              {navigationContent}
            </OffCanvas>

            {/* Top Panel */}
            <OffCanvas
              isOpen={topOpen}
              onClose={() => setTopOpen(false)}
              placement="top"
              header="Quick Settings"
              size="lg"
            >
              {settingsContent}
            </OffCanvas>

            {/* Bottom Panel */}
            <OffCanvas
              isOpen={bottomOpen}
              onClose={() => setBottomOpen(false)}
              placement="bottom"
              header="Activity Feed"
              size="lg"
            >
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-medium mb-2">Today's Stats</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">28</div>
                        <div className="text-sm text-gray-500">Tasks Done</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-500">92%</div>
                        <div className="text-sm text-gray-500">Completion</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-medium mb-2">Team Activity</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm">5 members online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span className="text-sm">3 in meetings</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-medium mb-2">Upcoming</div>
                    <div className="text-sm text-gray-600">
                      <div>Team Sync - 2:00 PM</div>
                      <div>Project Review - 4:30 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </OffCanvas>
          </div>

          {/* Custom Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Custom Example</h3>
            <button
              onClick={() => setCustomOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open Custom Panel
            </button>

            <OffCanvas
              isOpen={customOpen}
              onClose={() => setCustomOpen(false)}
              placement="right"
              size="lg"
              className="bg-gray-50"
              header={
                <div className="flex items-center gap-2 text-blue-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Custom Header</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h4 className="text-lg font-medium mb-2">User Profile</h4>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      👤
                    </div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-gray-500">Senior Developer</div>
                      <div className="text-sm text-gray-500">john.doe@example.com</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-2">CURRENT PROJECT</div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">React Monorepo Setup</div>
                        <div className="text-sm text-gray-600">Due in 5 days</div>
                      </div>
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                        In Progress
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-2">TEAM MEMBERS</div>
                    <div className="flex -space-x-2">
                      {['🧑', '👩', '👨', '👩'].map((emoji, i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white"
                        >
                          {emoji}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-white text-xs">
                        +3
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-2">RECENT ACTIVITY</div>
                    <div className="space-y-2">
                      <div className="text-sm">Added new component documentation</div>
                      <div className="text-sm">Reviewed pull request #42</div>
                      <div className="text-sm">Updated project dependencies</div>
                    </div>
                  </div>
                </div>
              </div>
            </OffCanvas>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OffCanvasDemo;