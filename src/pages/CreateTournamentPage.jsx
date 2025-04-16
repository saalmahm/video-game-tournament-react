import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentService } from '../services/api';

const CreateTournamentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    game: '',
    start_date: '',
    end_date: '',
    max_players: 8,
    status: 'upcoming'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await tournamentService.create(formData);
      navigate(`/tournaments/${response.data.id}`);
    } catch (err) {
      console.error('Error creating tournament:', err);
      setError(
        err.response?.data?.message || 'Failed to create tournament. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Tournament</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Tournament Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tournament name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your tournament"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="game" className="block text-gray-700 font-bold mb-2">
            Game *
          </label>
          <input
            type="text"
            id="game"
            name="game"
            value={formData.game}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., Fortnite, League of Legends, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="start_date" className="block text-gray-700 font-bold mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-gray-700 font-bold mb-2">
              End Date *
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="max_players" className="block text-gray-700 font-bold mb-2">
            Maximum Number of Players
          </label>
          <select
            id="max_players"
            name="max_players"
            value={formData.max_players}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="4">4 players</option>
            <option value="8">8 players</option>
            <option value="16">16 players</option>
            <option value="32">32 players</option>
            <option value="64">64 players</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => navigate('/tournaments')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Tournaments
        </button>
      </div>
    </div>
  );
};

export default CreateTournamentPage; 