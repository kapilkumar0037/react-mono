import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AlertsDemo } from './components/demos/AlertsDemo';
import { BadgesDemo } from './components/demos/BadgesDemo';
import { BreadcrumbsDemo } from './components/demos/BreadcrumbsDemo';
import { ButtonsDemo } from './components/demos/ButtonsDemo';
import { CardsDemo } from './components/demos/CardsDemo';
import { CheckboxesDemo } from './components/demos/CheckboxesDemo';
import { DatetimeDemo } from './components/demos/DatetimeDemo';
import { DropdownsDemo } from './components/demos/DropdownsDemo';
import { RadioDemo } from './components/demos/RadioDemo';
import { TextareasDemo } from './components/demos/TextareasDemo';
import { ModalDemo } from './components/demos/ModalDemo';
import { NavbarDemo } from './components/demos/NavbarDemo';
import { ToastDemo } from './components/demos/ToastDemo';
import { ButtonGroupDemo } from './components/demos/ButtonGroupDemo';
import { SpinnerDemo } from './components/demos/SpinnerDemo';

export function App() {
  return (
    <div data-theme="default">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/components/buttons" replace />} />
          <Route path="components">
            <Route path="buttons" element={<ButtonsDemo />} />
            <Route path="checkboxes" element={<CheckboxesDemo />} />
            <Route path="cards" element={<CardsDemo />} />
            <Route path="alerts" element={<AlertsDemo />} />
            <Route path="badges" element={<BadgesDemo />} />
            <Route path="breadcrumbs" element={<BreadcrumbsDemo />} />
            <Route path="dropdowns" element={<DropdownsDemo />} />
            <Route path="radio" element={<RadioDemo />} />
            <Route path="textareas" element={<TextareasDemo />} />
            <Route path="datetime" element={<DatetimeDemo />} />
            <Route path="modal" element={<ModalDemo />} />
            <Route path="navbar" element={<NavbarDemo />} />
            <Route path="toast" element={<ToastDemo />} />
            <Route path="button-group" element={<ButtonGroupDemo />} />
            <Route path="spinner" element={<SpinnerDemo />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
