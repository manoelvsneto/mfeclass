import Products from './Products';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Catalog App</h1>
        <Products />
      </div>
    </div>
  );
}

export default App;
