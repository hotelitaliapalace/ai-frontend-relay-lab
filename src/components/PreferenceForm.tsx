import type { FormEvent } from 'react';

function PreferenceForm() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // no-op for now
  };

  return (
    <form className="preference-form" onSubmit={handleSubmit}>
      <fieldset className="form-section">
        <legend>Stay details</legend>
        <div className="form-group">
          <label htmlFor="duration">How many nights?</label>
          <input type="number" id="duration" min="1" max="30" placeholder="e.g. 5" />
        </div>
        <div className="form-group">
          <label htmlFor="travel-profile">Travel profile</label>
          <select id="travel-profile">
            <option value="">Select...</option>
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
          </select>
        </div>
      </fieldset>
      <fieldset className="form-section">
        <legend>Interests</legend>
        <p className="helper-text">Choose the activities that appeal to you.</p>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" value="beach" /> Beach
          </label>
          <label>
            <input type="checkbox" value="culture" /> Culture
          </label>
          <label>
            <input type="checkbox" value="nature" /> Nature
          </label>
          <label>
            <input type="checkbox" value="dining" /> Dining
          </label>
          <label>
            <input type="checkbox" value="shopping" /> Shopping
          </label>
          <label>
            <input type="checkbox" value="relaxation" /> Relaxation
          </label>
        </div>
      </fieldset>
      <button type="submit" className="primary-action" disabled aria-disabled="true">
        Generate itinerary
      </button>
    </form>
  );
}

export default PreferenceForm;
