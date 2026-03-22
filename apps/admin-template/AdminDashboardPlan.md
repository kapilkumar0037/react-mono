# Admin Dashboard Application Plan

This plan outlines the structure, features, and implementation steps for building a ready-to-use admin dashboard in the `admin-template` Nx React application. All UI elements should use components from the `ui-controls` package wherever possible.

---

## 1. Project Structure
- `apps/admin-template/src/pages/` — Dashboard, Users, Settings, Login, etc.
- `apps/admin-template/src/components/` — Reusable widgets, forms, tables, etc.
- `apps/admin-template/src/layout/` — Sidebar, Navbar, MainLayout.
- `apps/admin-template/src/styles/` — Custom styles, theme overrides.

## 2. Layout & Navigation
- **Sidebar**: Navigation links (Dashboard, Users, Settings, etc.)
  - Use `ListGroup`, `Navs`, and `Icons` from `ui-controls`.
- **Top Navbar**: User info, notifications, quick actions
  - Use `Button`, `Dropdown`, `CloseButton`.
- **Main Content**: Responsive area for rendering pages
  - Use `Card`, `Collapse`, `Tabs` for content sections.

## 3. Pages & Features
### Dashboard
- Stat cards (users, revenue, activity)
- Charts (area, bar, pie)
- Recent activity list
- Quick actions (e.g., add user)
- Use `Card`, `ButtonGroup`, `Spinner`, `Popover`, `Collapse`.

### Users
- Table of users (search, filter, sort)
- User details modal/drawer
- Add/Edit user form
- Use `Table`, `InputGroup`, `Modal`, `Toast`, `CloseButton`.

### Settings
- Profile settings (form)
- App configuration (toggles, selects)
- Use `Form`, `InputGroup`, `Button`, `Collapse`.

### Authentication
- Login page (form)
- Protected routes (redirect if not logged in)
- Use `InputGroup`, `Button`, `Toast`.

### Other Pages
- Reports, Activity Log, Notifications, etc.
- Use `Tabs`, `ListGroup`, `Popover`, `Pagination`.

## 4. State & Data
- Use React context or Zustand for global state (user, theme, notifications).
- Mock data for initial development; connect to API later.

## 5. Theming & Responsiveness
- Use Tailwind and `ui-controls` styles for consistent look.
- Support light/dark mode toggle.
- Ensure mobile responsiveness for all layouts.

## 6. Demo & Documentation
- Add demo data and flows for all major features.
- Document usage of each `ui-controls` component in context.
- Provide customization instructions for teams.

---

## Implementation Steps
1. Scaffold pages and layout components.
2. Build sidebar and navbar using `ui-controls`.
3. Implement Dashboard page with stat cards and charts.
4. Build Users page with table, modals, and forms.
5. Add Settings and Authentication pages.
6. Integrate global state and mock data.
7. Add theming, responsiveness, and accessibility.
8. Write documentation and usage examples in this file.

---

## Notes
- Reuse and extend `ui-controls` components for all UI needs.
- Keep code modular and maintainable.
- Prioritize accessibility and performance.

---

_Last updated: November 23, 2025_

---

## Prioritized Roadmap

This roadmap is based on the current state of the codebase in `src/app/`, where most major admin screens already exist but still rely heavily on local component state, mock data, and placeholder actions.

### Phase 1: Quick Wins
- Persist theme, sidebar state, and user preferences across sessions.
- Add logout flow and replace the current demo-only login behavior with a clearer auth shell.
- Add global toasts for create, update, delete, export, and restore actions.
- Improve empty states, loading states, and confirmation dialogs across all admin pages.
- Add mobile navigation support for the sidebar and improve responsive behavior in dense tables.
- Wire navbar search into page-level filtering where applicable.

### Phase 2: Core Product Foundations
- Introduce a shared data layer for API calls, caching, and mutation state.
- Move auth into a real session model instead of a local `isLoggedIn` flag.
- Add role-based access control for routes, sidebar items, and page actions.
- Create reusable admin primitives:
  - Data table with sorting, filtering, pagination, bulk actions
  - Form validation and async submit states
  - Confirm modal and destructive action patterns
  - Status badges and timeline/event components
- Normalize mock data into shared fixtures or mock services so pages behave consistently.

### Phase 3: High-Impact Features
- **Dashboard**
  - Customizable widgets
  - Saved dashboard views
  - Date presets and cross-widget filtering
  - Drilldowns from charts into reports and activity
- **Users**
  - Invite user flow
  - Bulk role/status updates
  - User profile drawer
  - Per-user activity history
  - CSV import/export
- **Activity Log**
  - Date range filtering
  - Entity and actor filters
  - Saved views
  - Export and event detail panel
  - Real-time updates
- **Notifications**
  - Read/archive/snooze states
  - Per-category preferences
  - Deep links to related entities
  - Real-time delivery
- **Reports**
  - Saved report presets
  - Scheduled reports
  - Email delivery
  - PDF/CSV generation backed by real data
  - Drilldown filters
- **System Health**
  - Live polling or websocket updates
  - Incident timeline
  - Alert thresholds
  - Service detail pages
  - Acknowledgement and escalation flow
- **Backup & Recovery**
  - Editable schedules
  - Manual backup wizard
  - Retention policy controls
  - Restore audit trail
  - Progress tracking and approval flow

### Phase 4: Admin Platform Maturity
- Multi-tenant or workspace support.
- Feature flags and environment-based configuration.
- Audit-grade activity/event retention strategy.
- Accessibility pass across admin forms, tables, modals, and charts.
- Better test coverage for critical journeys:
  - Login and logout
  - Protected navigation
  - User CRUD
  - Report generation
  - Backup restore confirmations
- Component documentation and examples for `ui-controls`.

## Recommended Build Order
1. Authentication, logout, and session persistence
2. Shared API/state layer
3. Reusable data table and form patterns in `ui-controls`
4. Users page upgrade
5. Activity Log and Notifications upgrade
6. Reports and Dashboard drilldowns
7. System Health live monitoring
8. Backup & Recovery operational workflows
9. Testing, accessibility, and documentation hardening

## Suggested Sprint Breakdown

### Sprint 1
- Real auth shell
- Logout
- Theme persistence
- Global toast/confirm patterns
- Navbar search integration

### Sprint 2
- Shared data layer
- Reusable data table
- Users CRUD improvements
- Better validation and mutation UX

### Sprint 3
- Activity Log filters and export
- Notifications preferences and actions
- Report presets and export pipeline

### Sprint 4
- Dashboard drilldowns
- System Health live updates
- Backup scheduling and restore improvements

### Sprint 5
- E2E coverage for critical admin flows
- Accessibility cleanup
- Component docs and polish

## What To Build First

If the goal is to make this feel like a real product fast, start here:
- Replace demo auth with a real auth/session model.
- Build a reusable table + form workflow and apply it to Users first.
- Upgrade Activity Log and Notifications into connected operational tools.
- Turn Reports exports from placeholders into actual deliverables.

If the goal is to make this a stronger template/library, start here:
- Strengthen `ui-controls` with admin-ready primitives.
- Standardize page patterns across the admin app.
- Add tests and documentation so the template is easier to reuse.
