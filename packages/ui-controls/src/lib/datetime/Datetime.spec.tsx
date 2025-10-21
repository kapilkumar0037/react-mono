import { render } from '@testing-library/react';

import Datetime from './Datetime';

describe('Datetime', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Datetime />);
    expect(baseElement).toBeTruthy();
  });
});
