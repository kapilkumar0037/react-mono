import { useState } from 'react';
import { ButtonGroup, ButtonGroupItem } from '@react-mono/ui-controls';

export const ButtonGroupDemo = () => {
  const [selectedView, setSelectedView] = useState('list');
  const [selectedAlignment, setSelectedAlignment] = useState('left');
  const [selectedSize, setSelectedSize] = useState('md');

  return (
    <div className="space-y-8">
      {/* Basic Button Group */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Button Group</h2>
        <div className="space-y-4">
          <ButtonGroup ariaLabel="View options">
            <ButtonGroupItem
              active={selectedView === 'list'}
              onClick={() => setSelectedView('list')}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </div>
            </ButtonGroupItem>
            <ButtonGroupItem
              active={selectedView === 'grid'}
              onClick={() => setSelectedView('grid')}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </div>
            </ButtonGroupItem>
            <ButtonGroupItem
              active={selectedView === 'gallery'}
              onClick={() => setSelectedView('gallery')}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gallery
              </div>
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
      </section>

      {/* Text Alignment */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Text Alignment</h2>
        <div className="space-y-4">
          <ButtonGroup variant="outline" ariaLabel="Text alignment">
            <ButtonGroupItem
              active={selectedAlignment === 'left'}
              onClick={() => setSelectedAlignment('left')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h12" />
              </svg>
            </ButtonGroupItem>
            <ButtonGroupItem
              active={selectedAlignment === 'center'}
              onClick={() => setSelectedAlignment('center')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M6 18h12" />
              </svg>
            </ButtonGroupItem>
            <ButtonGroupItem
              active={selectedAlignment === 'right'}
              onClick={() => setSelectedAlignment('right')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M8 18h12" />
              </svg>
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Sizes</h2>
        <div className="space-y-4">
          <div className="space-x-4">
            <ButtonGroup size="sm" ariaLabel="Small buttons">
              <ButtonGroupItem
                active={selectedSize === 'sm'}
                onClick={() => setSelectedSize('sm')}
              >
                Small
              </ButtonGroupItem>
              <ButtonGroupItem disabled>Disabled</ButtonGroupItem>
              <ButtonGroupItem>Button</ButtonGroupItem>
            </ButtonGroup>

            <ButtonGroup size="md" ariaLabel="Medium buttons">
              <ButtonGroupItem
                active={selectedSize === 'md'}
                onClick={() => setSelectedSize('md')}
              >
                Medium
              </ButtonGroupItem>
              <ButtonGroupItem disabled>Disabled</ButtonGroupItem>
              <ButtonGroupItem>Button</ButtonGroupItem>
            </ButtonGroup>

            <ButtonGroup size="lg" ariaLabel="Large buttons">
              <ButtonGroupItem
                active={selectedSize === 'lg'}
                onClick={() => setSelectedSize('lg')}
              >
                Large
              </ButtonGroupItem>
              <ButtonGroupItem disabled>Disabled</ButtonGroupItem>
              <ButtonGroupItem>Button</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Vertical Orientation */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Vertical Orientation</h2>
        <div className="space-y-4">
          <ButtonGroup orientation="vertical" ariaLabel="Vertical buttons">
            <ButtonGroupItem>Profile</ButtonGroupItem>
            <ButtonGroupItem>Settings</ButtonGroupItem>
            <ButtonGroupItem>Messages</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </section>

      {/* Full Width */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Full Width</h2>
        <div className="space-y-4">
          <ButtonGroup fullWidth ariaLabel="Full width buttons">
            <ButtonGroupItem>Left</ButtonGroupItem>
            <ButtonGroupItem>Center</ButtonGroupItem>
            <ButtonGroupItem>Right</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </section>
    </div>
  );
};