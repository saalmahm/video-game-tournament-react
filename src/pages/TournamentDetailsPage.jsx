import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tournamentService, playerService, matchService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TournamentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        
        // Fetch tournament details
        const tournamentResponse = await tournamentService.getById(id);
        setTournament(tournamentResponse.data);
        
        // Fetch players in this tournament
        const playersResponse = await playerService.getAll(id);
        setPlayers(playersResponse.data);
        
        // Fetch matches for this tournament
        const allMatchesResponse = await matchService.getAll();
        // Filter matches that belong to this tournament
        const tournamentMatches = allMatchesResponse.data.filter(
          match => match.tournament_id === parseInt(id)
        );
        setMatches(tournamentMatches);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching tournament data:', err);
        setError('Failed to load tournament data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    
    if (!newPlayerName.trim()) {
      setPlayerError('Player name is required');
      return;
    }
    
    try {
      setAddingPlayer(true);
      setPlayerError(null);
      
      const response = await playerService.add(id, { name: newPlayerName });
      setPlayers([...players, response.data]);
      setNewPlayerName('');
    } catch (err) {
      console.error('Error adding player:', err);
      setPlayerError(err.response?.data?.message || 'Failed to add player. Please try again.');
    } finally {
      setAddingPlayer(false);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (!confirm('Are you sure you want to remove this player?')) {
      return;
    }
    
    try {
      await playerService.remove(id, playerId);
      setPlayers(players.filter(player => player.id !== playerId));
    } catch (err) {
      console.error('Error removing player:', err);
      alert('Failed to remove player. Please try again.');
    }
  };

  const handleDeleteTournament = async () => {
    if (!confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      return;
    }
    
    try {
      await tournamentService.delete(id);
      navigate('/tournaments');
    } catch (err) {
      console.error('Error deleting tournament:', err);
      alert('Failed to delete tournament. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <p className="text-gray-600">Loading tournament details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="text-center mt-4">
          <Link to="/tournaments" className="text-blue-500 hover:text-blue-700">
            ← Back to Tournaments
          </Link>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <p className="text-gray-600">Tournament not found.</p>
        <div className="mt-4">
          <Link to="/tournaments" className="text-blue-500 hover:text-blue-700">
            ← Back to Tournaments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{tournament.name}</h1>
              <p className="text-gray-600">{tournament.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-gray-500">Game:</span>
                  <span className="font-medium">{tournament.game}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Status:</span>
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
                <div>
                  <span className="block text-gray-500">Start Date:</span>
                  <span className="font-medium">
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">End Date:</span>
                  <span className="font-medium">
                    {new Date(tournament.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {user && (
              <div className="flex space-x-2">
                <Link
                  to={`/tournaments/${id}/edit`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDeleteTournament}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 -mb-px ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('players')}
                className={`py-4 px-2 -mb-px ${
                  activeTab === 'players'
                    ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Players ({players.length})
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`py-4 px-2 -mb-px ${
                  activeTab === 'matches'
                    ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Matches ({matches.length})
              </button>
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tournament Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Details</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><span className="font-medium">Format:</span> Single Elimination</li>
                      <li><span className="font-medium">Max Players:</span> {tournament.max_players}</li>
                      <li><span className="font-medium">Current Players:</span> {players.length}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Progress</h3>
                    <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(matches.filter(m => m.status === 'completed').length / matches.length) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {matches.filter(m => m.status === 'completed').length} of {matches.length} matches completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                {matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.slice(0, 3).map(match => (
                      <div key={match.id} className="border border-gray-200 rounded-lg p-4">
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
                      </div>
                    ))}
                    {matches.length > 3 && (
                      <div className="text-center mt-2">
                        <button
                          onClick={() => setActiveTab('matches')}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View All Matches
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No matches have been created yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div>
              {user && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Add Player</h2>
                  <form onSubmit={handleAddPlayer} className="flex space-x-2">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="Enter player name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={addingPlayer}
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                        addingPlayer ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {addingPlayer ? 'Adding...' : 'Add Player'}
                    </button>
                  </form>
                  {playerError && (
                    <p className="text-red-500 text-sm mt-2">{playerError}</p>
                  )}
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-800 mb-4">Tournament Players</h2>
              {players.length === 0 ? (
                <p className="text-gray-600">No players have been added to this tournament yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">{player.name}</h3>
                        <p className="text-sm text-gray-500">
                          Joined: {new Date(player.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {user && (
                        <button
                          onClick={() => handleRemovePlayer(player.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove player"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tournament Matches</h2>
                {user && (
                  <Link
                    to={`/tournaments/${id}/matches/create`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Create Match
                  </Link>
                )}
              </div>
              
              {matches.length === 0 ? (
                <p className="text-gray-600">No matches have been created for this tournament yet.</p>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => (
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
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-6">
        <Link to="/tournaments" className="text-blue-500 hover:text-blue-700">
          ← Back to Tournaments
        </Link>
      </div>
    </div>
  );
};

export default TournamentDetailsPage; 