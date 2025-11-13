import React, { useEffect, useRef, useState } from 'react';

export interface ScrollspySection {
  id: string;
  label: string;
}

export interface ScrollspyProps {
  /** List of sections to spy on */
  sections: ScrollspySection[];
  /** Optional offset for sticky headers etc */
  offset?: number;
  /** Class for nav container */
  navClassName?: string;
  /** Class for nav link */
  linkClassName?: string;
  /** Class for active nav link */
  activeLinkClassName?: string;
  /** Render prop for custom nav rendering */
  renderNav?: (props: {
    sections: ScrollspySection[];
    activeId: string | null;
    onNavClick: (id: string) => void;
  }) => React.ReactNode;
}

export const Scrollspy: React.FC<ScrollspyProps> = ({
  sections,
  offset = 0,
  navClassName = '',
  linkClassName = '',
  activeLinkClassName = 'text-primary font-bold',
  renderNav,
}) => {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id || null);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          let found = false;
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i].id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top - offset <= 1) {
                setActiveId(sections[i].id);
                found = true;
                break;
              }
            }
          }
          if (!found && sections.length) setActiveId(sections[0].id);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, offset]);

  const onNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (renderNav) {
    return <>{renderNav({ sections, activeId, onNavClick })}</>;
  }

  return (
    <nav className={navClassName} aria-label="Scrollspy">
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <button
              className={
                (linkClassName ? linkClassName + ' ' : '') +
                (activeId === section.id ? activeLinkClassName : '')
              }
              aria-current={activeId === section.id ? 'true' : undefined}
              onClick={() => onNavClick(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Scrollspy;
