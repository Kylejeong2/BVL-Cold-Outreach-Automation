import { Suspense } from 'react';
import { ApplicationResponse } from '@/lib/types/application';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function ApplicationParserPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Application Parser</h1>
        <form action="/api/applications" method="POST">
          <button 
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Process New Applications
          </button>
        </form>
      </div>
      <Suspense fallback={<div>Loading applications...</div>}>
        <ApplicationTable />
      </Suspense>
    </div>
  );
}

async function ApplicationTable() {
  const response = await fetch('/api/applications');
  
  if (!response.ok) {
    return (
      <div className="rounded-md border p-4">
        <p className="text-sm text-red-500">
          Failed to load applications. Please try again later.
        </p>
      </div>
    );
  }

  const applications = await response.json();

  return <DataTable columns={columns} data={applications} />;
} 