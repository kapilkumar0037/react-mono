import React, { useState } from 'react';
import { Pagination } from '@react-mono/ui-controls';

// Sample data for the demo
const generateItems = (count: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: ['Active', 'Pending', 'Completed'][Math.floor(Math.random() * 3)],
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()
  }));

export const PaginationDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 235; // Total number of items

  const items = generateItems(pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real application, you would fetch data for the new page here
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    // In a real application, you would fetch data with the new page size here
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Pagination</h2>
        <p className="text-sm text-gray-600 mb-4">
          Pagination component with page size selection, boundary navigation, and dynamic page numbers.
        </p>

        <div className="space-y-8">
          {/* Basic Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Example</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${item.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                          ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${item.status === 'Completed' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-gray-200 px-4 py-3">
                <Pagination
                  totalItems={totalItems}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </div>
          </div>

          {/* More Examples */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Simple Variant (No Page Size)</h3>
              <Pagination
                totalItems={100}
                currentPage={1}
                pageSize={10}
                onPageChange={() => {}}
                showPageSize={false}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Compact (No Boundary Buttons)</h3>
              <Pagination
                totalItems={100}
                currentPage={1}
                pageSize={10}
                onPageChange={() => {}}
                showBoundaryButtons={false}
                showPageSize={false}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Custom Page Sizes</h3>
              <Pagination
                totalItems={100}
                currentPage={1}
                pageSize={25}
                onPageChange={() => {}}
                pageSizeOptions={[25, 50, 75, 100]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginationDemo;