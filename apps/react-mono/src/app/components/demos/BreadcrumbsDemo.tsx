import { Breadcrumb } from '@react-mono/ui-controls';

export const BreadcrumbsDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Breadcrumbs</h2>
        <p className="text-gray-600 mb-8">
          Breadcrumb navigation with various styles and options.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
          <Breadcrumb.Item isCurrent>Electronics</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Custom Separator</h3>
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/settings">Settings</Breadcrumb.Item>
          <Breadcrumb.Item isCurrent>Profile</Breadcrumb.Item>
        </Breadcrumb>

        <Breadcrumb separator="•">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/blog">Blog</Breadcrumb.Item>
          <Breadcrumb.Item isCurrent>Article Title</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Icons</h3>
        <Breadcrumb>
          <Breadcrumb.Item 
            href="/"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          >
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item 
            href="/dashboard"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item 
            isCurrent
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            Profile
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Click Handlers</h3>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => console.log('Home clicked')}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => console.log('Library clicked')}>
            Library
          </Breadcrumb.Item>
          <Breadcrumb.Item isCurrent>
            Book Title
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Long Path Truncation</h3>
        <div className="max-w-md">
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/very">Very</Breadcrumb.Item>
            <Breadcrumb.Item href="/very/long">Long</Breadcrumb.Item>
            <Breadcrumb.Item href="/very/long/path">Path</Breadcrumb.Item>
            <Breadcrumb.Item href="/very/long/path/with">With</Breadcrumb.Item>
            <Breadcrumb.Item isCurrent>Many Segments</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};