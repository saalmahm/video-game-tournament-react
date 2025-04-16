import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'ongoing', 'completed'
  const { user } = useAuth();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await tournamentService.getAll();
        setTournaments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError('Failed to load tournaments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const filteredTournaments = tournaments.filter((tournament) => {
    if (filter === 'all') return true;
    return tournament.status === filter;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tournaments</h1>
        {user && (
          <Link
            to="/tournaments/create"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Create Tournament
          </Link>
        )}
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md ${
              filter === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('ongoing')}
            className={`px-4 py-2 rounded-md ${
              filter === 'ongoing'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading tournaments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No tournaments found.</p>
          {user && (
            <Link
              to="/tournaments/create"
              className="inline-block mt-4 text-blue-500 hover:text-blue-700"
            >
              Create your first tournament
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div
                className={`h-2 ${
                  tournament.status === 'upcoming'
                    ? 'bg-yellow-500'
                    : tournament.status === 'ongoing'
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                }`}
              ></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{tournament.name}</h2>
                <p className="text-gray-600 mb-4">{tournament.description}</p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <div>
                    <span className="block">Start: {new Date(tournament.start_date).toLocaleDateString()}</span>
                    <span className="block">End: {new Date(tournament.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="block">{tournament.players_count || 0} Players</span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full ${
                        tournament.status === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-800'
                          : tournament.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                </div>
                
                <Link
                  to={`/tournaments/${tournament.id}`}
                  className="inline-block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentsPage; 