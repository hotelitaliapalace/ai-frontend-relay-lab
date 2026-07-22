import Header from './components/Header';
import PreferenceForm from './components/PreferenceForm';
import ItineraryPreview from './components/ItineraryPreview';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <PreferenceForm />
        <ItineraryPreview />
      </main>
    </div>
  );
}

export default App;
