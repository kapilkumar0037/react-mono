import { render } from '@testing-library/react';

import ReactMonoUiControls from './ui-controls';

describe('ReactMonoUiControls', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactMonoUiControls />);
    expect(baseElement).toBeTruthy();
  });
});
