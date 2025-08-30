import React, { Suspense } from 'react';

// Lazy load the Products component from the remote catalog app
const ProductsComponent = React.lazy(() => import('catalog/Products'));

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Shell Application</h1>
          <p className="text-gray-600 mt-2">This app loads the Products component from the Catalog MFE</p>
        </header>

        <main className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Remote Products</h2>
          
          <Suspense fallback={
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-blue-500">Loading Products from remote Catalog app...</p>
            </div>
          }>
            <ProductsComponent />
          </Suspense>
        </main>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Module Federation Demo - Shell App</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
