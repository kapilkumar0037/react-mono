import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal, useToast } from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';

type TicketStatus = 'Open' | 'In Progress' | 'Waiting on Customer' | 'Resolved' | 'Escalated';
type TicketPriority = 'High' | 'Medium' | 'Low';
type TicketChannel = 'Email' | 'Chat' | 'Phone' | 'Marketplace';

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  email: string;
  orderId: string;
  createdAt: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  assignee: string;
}

interface SupportTicketsProps {
  isDarkMode?: boolean;
}

const initialTickets: Ticket[] = [
  {
    id: 'TCK-4302',
    subject: 'Refund not reflected after return',
    customer: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    orderId: 'ORD-10480',
    createdAt: '2026-03-30 09:15',
    status: 'Open',
    priority: 'High',
    channel: 'Email',
    assignee: 'Maya Singh',
  },
  {
    id: 'TCK-4301',
    subject: 'Package marked delivered but not received',
    customer: 'Ava Thompson',
    email: 'ava.thompson@example.com',
    orderId: 'ORD-10482',
    createdAt: '2026-03-30 08:42',
    status: 'In Progress',
    priority: 'High',
    channel: 'Chat',
    assignee: 'Rahul Verma',
  },
  {
    id: 'TCK-4300',
    subject: 'Need invoice copy for accounting',
    customer: 'Liam Carter',
    email: 'liam.carter@example.com',
    orderId: 'ORD-10481',
    createdAt: '2026-03-29 18:20',
    status: 'Waiting on Customer',
    priority: 'Low',
    channel: 'Email',
    assignee: 'Maya Singh',
  },
  {
    id: 'TCK-4299',
    subject: 'Marketplace sync created duplicate order',
    customer: 'Noah Reed',
    email: 'noah.reed@example.com',
    orderId: 'ORD-10479',
    createdAt: '2026-03-29 16:05',
    status: 'Escalated',
    priority: 'High',
    channel: 'Marketplace',
    assignee: 'Ops Escalation',
  },
  {
    id: 'TCK-4298',
    subject: 'Address correction before dispatch',
    customer: 'Isabella Nguyen',
    email: 'isabella.nguyen@example.com',
    orderId: 'ORD-10476',
    createdAt: '2026-03-29 13:11',
    status: 'Resolved',
    priority: 'Medium',
    channel: 'Phone',
    assignee: 'Rahul Verma',
  },
];

const SupportTickets: React.FC<SupportTicketsProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<TicketChannel | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        searchQuery === '' ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.orderId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesChannel = channelFilter === 'all' || ticket.channel === channelFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesChannel;
    });
  }, [channelFilter, priorityFilter, searchQuery, statusFilter, tickets]);

  const stats = useMemo(
    () => [
      { label: 'Open Queue', value: tickets.filter((ticket) => ticket.status === 'Open').length.toString(), tone: 'border-blue-500' },
      { label: 'Escalations', value: tickets.filter((ticket) => ticket.status === 'Escalated').length.toString(), tone: 'border-red-500' },
      { label: 'Waiting', value: tickets.filter((ticket) => ticket.status === 'Waiting on Customer').length.toString(), tone: 'border-amber-500' },
      { label: 'Resolved Today', value: tickets.filter((ticket) => ticket.status === 'Resolved').length.toString(), tone: 'border-green-500' },
    ],
    [tickets]
  );

  const getStatusVariant = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Waiting on Customer':
        return 'primary';
      case 'Resolved':
        return 'success';
      case 'Escalated':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPriorityClasses = (priority: TicketPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getChannelClasses = (channel: TicketChannel) => {
    switch (channel) {
      case 'Email':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'Chat':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Phone':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
      case 'Marketplace':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus, message: string) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket))
    );
    setSelectedTicket((currentTicket) =>
      currentTicket && currentTicket.id === ticketId ? { ...currentTicket, status } : currentTicket
    );
    showToast({
      message,
      variant: 'success',
    });
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Support Tickets</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Triage customer issues, route escalations, and keep order-related support work moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                showToast({
                  message: 'Ticket export started for the current queue.',
                  variant: 'info',
                })
              }
              className="bg-gray-700 text-white"
            >
              Export Queue
            </Button>
            <Button
              onClick={() =>
                showToast({
                  message: 'Support assignment sync queued successfully.',
                  variant: 'success',
                })
              }
              className="bg-blue-600 text-white"
            >
              Sync Assignments
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3 border-l-4 ${stat.tone}`}
            >
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>
                {stat.label}
              </div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ticket ID, customer, subject, or order..."
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as TicketStatus | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting on Customer">Waiting on Customer</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value as TicketPriority | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Channel</label>
              <select
                value={channelFilter}
                onChange={(event) => setChannelFilter(event.target.value as TicketChannel | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All channels</option>
                <option value="Email">Email</option>
                <option value="Chat">Chat</option>
                <option value="Phone">Phone</option>
                <option value="Marketplace">Marketplace</option>
              </select>
            </div>
          </div>
          <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredTickets.length} ticket{filteredTickets.length === 1 ? '' : 's'} in the current queue.
          </div>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ticket</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Channel</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assignee</th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="px-3 py-2 align-top">
                      <div className={`font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ticket.id}</div>
                      <div className={`mt-0.5 truncate max-w-[220px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ticket.subject}</div>
                      <div className={`mt-0.5 whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{ticket.orderId} • {ticket.createdAt}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className={`font-medium whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ticket.customer}</div>
                      <div className={`mt-0.5 truncate max-w-[180px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ticket.email}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getChannelClasses(ticket.channel)}`}>
                        {ticket.channel}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityClasses(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className={`px-3 py-2 align-top whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{ticket.assignee}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-1.5">
                        <Button onClick={() => setSelectedTicket(ticket)} className="bg-gray-700 text-white text-xs px-2.5 py-1">
                          View
                        </Button>
                        {ticket.status === 'Open' && (
                          <Button
                            onClick={() => updateTicketStatus(ticket.id, 'In Progress', `${ticket.id} moved into active handling.`)}
                            className="bg-blue-600 text-white text-xs px-2.5 py-1"
                          >
                            Start
                          </Button>
                        )}
                        {ticket.status === 'In Progress' && (
                          <Button
                            onClick={() => updateTicketStatus(ticket.id, 'Resolved', `${ticket.id} marked as resolved.`)}
                            className="bg-green-600 text-white text-xs px-2.5 py-1"
                          >
                            Resolve
                          </Button>
                        )}
                        {!['Resolved', 'Escalated'].includes(ticket.status) && (
                          <Button
                            onClick={() => updateTicketStatus(ticket.id, 'Escalated', `${ticket.id} escalated to the operations queue.`)}
                            className="bg-red-600 text-white text-xs px-2.5 py-1"
                          >
                            Escalate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className={`px-4 py-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No tickets match the current filters. Try clearing a queue filter to widen the results.
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `Support Ticket ${selectedTicket.id}` : 'Support Ticket Details'}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTicket.customer}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedTicket.email}</p>
              </Card>
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subject</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTicket.subject}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Order {selectedTicket.orderId}</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(selectedTicket.status)}>{selectedTicket.status}</Badge>
                </div>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Priority</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTicket.priority}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Channel</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTicket.channel}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assignee</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTicket.assignee}</p>
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operational Notes</h3>
              <ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Created: {selectedTicket.createdAt}</li>
                <li>Current assignee: {selectedTicket.assignee}</li>
                <li>Support channel: {selectedTicket.channel}</li>
                <li>Linked order: {selectedTicket.orderId}</li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => setSelectedTicket(null)} className="bg-gray-600 text-white">
                Close
              </Button>
              {selectedTicket.status === 'Open' && (
                <Button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'In Progress', `${selectedTicket.id} moved into active handling.`)}
                  className="bg-blue-600 text-white"
                >
                  Start Work
                </Button>
              )}
              {selectedTicket.status === 'In Progress' && (
                <Button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'Resolved', `${selectedTicket.id} marked as resolved.`)}
                  className="bg-green-600 text-white"
                >
                  Resolve Ticket
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportTickets;
