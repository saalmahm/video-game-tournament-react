import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Configure axios
axios.defaults.baseURL = API_URL;

// Add a request interceptor to add the token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service for tournaments
export const tournamentService = {
  // Get all tournaments
  getAll: async () => {
    try {
      const response = await axios.get('/tournaments');
      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  },

  // Get tournament by id
  getById: async (id) => {
    try {
      const response = await axios.get(`/tournaments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tournament ${id}:`, error);
      throw error;
    }
  },

  // Create a new tournament
  create: async (tournamentData) => {
    try {
      const response = await axios.post('/tournaments', tournamentData);
      return response.data;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  },

  // Update tournament
  update: async (id, tournamentData) => {
    try {
      const response = await axios.put(`/tournaments/${id}`, tournamentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating tournament ${id}:`, error);
      throw error;
    }
  },

  // Delete tournament
  delete: async (id) => {
    try {
      const response = await axios.delete(`/tournaments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting tournament ${id}:`, error);
      throw error;
    }
  }
};

// API service for players
export const playerService = {
  // Get all players for a tournament
  getAll: async (tournamentId) => {
    try {
      const response = await axios.get(`/tournaments/${tournamentId}/players`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching players for tournament ${tournamentId}:`, error);
      throw error;
    }
  },

  // Add player to tournament
  add: async (tournamentId, playerData) => {
    try {
      const response = await axios.post(`/tournaments/${tournamentId}/players`, playerData);
      return response.data;
    } catch (error) {
      console.error(`Error adding player to tournament ${tournamentId}:`, error);
      throw error;
    }
  },

  // Remove player from tournament
  remove: async (tournamentId, playerId) => {
    try {
      const response = await axios.delete(`/tournaments/${tournamentId}/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing player ${playerId} from tournament ${tournamentId}:`, error);
      throw error;
    }
  }
};

// API service for matches
export const matchService = {
  // Get all matches
  getAll: async () => {
    try {
      const response = await axios.get('/matches');
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  // Get match by id
  getById: async (id) => {
    try {
      const response = await axios.get(`/matches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match ${id}:`, error);
      throw error;
    }
  },

  // Create a new match
  create: async (matchData) => {
    try {
      const response = await axios.post('/matches', matchData);
      return response.data;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  },

  // Update match
  update: async (id, matchData) => {
    try {
      const response = await axios.put(`/matches/${id}`, matchData);
      return response.data;
    } catch (error) {
      console.error(`Error updating match ${id}:`, error);
      throw error;
    }
  },

  // Delete match
  delete: async (id) => {
    try {
      const response = await axios.delete(`/matches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting match ${id}:`, error);
      throw error;
    }
  },

  // Add score to match
  addScore: async (id, scoreData) => {
    try {
      const response = await axios.post(`/matches/${id}/scores`, scoreData);
      return response.data;
    } catch (error) {
      console.error(`Error adding score to match ${id}:`, error);
      throw error;
    }
  },

  // Update score
  updateScore: async (id, scoreData) => {
    try {
      const response = await axios.put(`/matches/${id}/scores`, scoreData);
      return response.data;
    } catch (error) {
      console.error(`Error updating score for match ${id}:`, error);
      throw error;
    }
  }
};

export default {
  tournamentService,
  playerService,
  matchService
}; 