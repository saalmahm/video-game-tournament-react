import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tournamentService, matchService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch only the 5 most recent tournaments
        const tournamentsResponse = await tournamentService.getAll();
        setTournaments(tournamentsResponse.data.slice(0, 5));

        // Fetch only the 5 most recent matches
        const matchesResponse = await matchService.getAll();
        setRecentMatches(matchesResponse.data.slice(0, 5));

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-4 rounded-lg shadow-lg mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Tournament Manager</h1>
          <p className="text-xl mb-8">
            Organize, manage, and participate in video game tournaments with ease.
          </p>
          {user ? (
            <Link
              to="/tournaments/create"
              className="inline-block bg-white text-blue-600 font-medium py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
            >
              Create a Tournament
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 font-medium py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Tournaments</h2>
            <Link to="/tournaments" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading tournaments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : tournaments.length === 0 ? (
            <p className="text-gray-600">No tournaments found.</p>
          ) : (
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                >
                  <Link to={`/tournaments/${tournament.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800">{tournament.name}</h3>
                    <p className="text-gray-600">
                      {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                      {new Date(tournament.end_date).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-500">
                        {tournament.players_count || 0} Players
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
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
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Matches</h2>
            <Link to="/matches" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading matches...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : recentMatches.length === 0 ? (
            <p className="text-gray-600">No matches found.</p>
          ) : (
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                >
                  <Link to={`/matches/${match.id}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1 text-center">
                        <span className="font-medium">{match.player1?.name || 'TBD'}</span>
                      </div>
                      <div className="mx-4 text-center">
                        <span className="px-3 py-1 rounded-md bg-gray-100">
                          {match.player1_score !== null ? match.player1_score : '-'} vs{' '}
                          {match.player2_score !== null ? match.player2_score : '-'}
                        </span>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="font-medium">{match.player2?.name || 'TBD'}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 text-center">
                      {match.status === 'completed' ? (
                        <span className="text-green-600">Completed</span>
                      ) : match.status === 'scheduled' ? (
                        <span>Scheduled: {new Date(match.scheduled_date).toLocaleString()}</span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-3xl mb-3">1</div>
            <h3 className="text-xl font-semibold mb-2">Create a Tournament</h3>
            <p className="text-gray-600">
              Set up your tournament by defining the game, format, dates, and rules.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-3xl mb-3">2</div>
            <h3 className="text-xl font-semibold mb-2">Add Players</h3>
            <p className="text-gray-600">Invite participants and manage registrations.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-3xl mb-3">3</div>
            <h3 className="text-xl font-semibold mb-2">Run Matches</h3>
            <p className="text-gray-600">
              Schedule matches, record scores, and keep track of the tournament progress.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 