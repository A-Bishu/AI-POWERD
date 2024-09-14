const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const OpenAI = require('openai');
const axios = require('axios');
const { syncDatabase } = require('./models');

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());

// Connect to PostgreSQL
syncDatabase();

// Proxy middleware setup for basketball
app.use('/api/basketball', createProxyMiddleware({
    target: 'https://basketball.entitysport.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/basketball': '', // remove base path
    },
  }));

   // Proxy for NFL API
   app.use(
    '/api/nfl', createProxyMiddleware({
      target: 'https://nfl.entitysport.com', // replace with the actual NFL API endpoint
      changeOrigin: true,
      pathRewrite: {
        '^/api/nfl': '', // remove /api/nfl from the request path
      },
    })
  );

// Define Routes
app.use('/api/auth', require('./routes/auth'));

// Protect routes that require authentication with the auth middleware
const auth = require('./middleware/auth');

app.get('/protected-route', auth, (req, res) => {
    res.json({ msg: 'This is a protected route', user: req.user });
});


// Cache to store match data
let matchesCache = [];

const API_TOKEN = process.env.SOCCER_API_TOKEN;
const API_URL = `https://soccer.entitysport.com/matches?status=1&per_page=50&pre_squad=true&token=${API_TOKEN}`;

// Function to fetch matches from the API and update the cache
async function updateMatchesCache() {
    try {
        const response = await axios.get(API_URL);
        matchesCache = response.data.response.items; // Update cache
    } catch (error) {
        console.error('Error fetching matches from API:', error);
    }
}

// Weathe fetching
async function fetchWeather(location) {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        const response = await axios.get(weatherApiUrl);
        const weatherData = response.data;
        return {
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            windSpeed: weatherData.wind.speed,
            humidity: weatherData.main.humidity
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
  
// Utility function to fetch seasons
async function seasons(req, res) {
    try {
        const response = await soccerApiClient.get('/seasons/', {
            params: {
                token: process.env.SOCCER_API_TOKEN,
            },
        });

        res.status(200).json({
            status: 'success',
            data: response.data,
        });
    } catch (error) {
        console.error('Failed to fetch seasons:', error);
        res.status(500).send('Error fetching seasons');
    }
}

// Endpoint to fetch all seasons
app.get('/seasons', seasons);


// Create an axios instance for API requests
const soccerApiClient = axios.create({
    baseURL: 'https://soccer.entitysport.com',
    timeout: 5000, // Optional: timeout for requests
});

// Utility function to fetch competitions for a given season
async function SeasonCompetitions(req, res) {
    const { sid } = req.params; // Season ID from the route parameter
    const { per_page = 10, paged = 1 } = req.query; // Default values if not provided

    try {
        const response = await soccerApiClient.get(`/season/${sid}/competitions`, {
            params: {
                token: process.env.SOCCER_API_TOKEN,
                per_page,
                paged,
            },
        });

        res.status(200).json({
            status: 'success',
            data: response.data,
        });
    } catch (error) {
        console.error(`Failed to fetch competitions for season ${sid}:`, error);
        res.status(500).send('Error fetching season competitions');
    }
}

// Endpoint to get competitions for a specific season
app.get('/season-competitions/:sid', SeasonCompetitions);


// Utility function to fetch competition list
async function CompetitionList(req, res) {
    const { status = 3,  per_page = 10, paged = 1 } = req.query; // Default values if not provided

    try {
        const response = await soccerApiClient.get('/competitions', {
            params: {
                token: process.env.SOCCER_API_TOKEN, // Ensure your token is correct
                status,
                per_page,
                paged,
            },
        });

        res.json({
            status: 'success',
            data: response.data, // Return the fetched competition data
        });
    } catch (error) {
        console.error('Failed to fetch competition details:', error);
        res.status(500).send('Error fetching competition details');
    }
}

// Endpoint to fetch competition list with optional query parameters
app.get('/competitions', CompetitionList);

// Utility function to fetch competition data
async function fetchCompetitionData(cid) {
    try {
        const response = await soccerApiClient.get(`/competition/${cid}`, {
            params: {
                token: process.env.SOCCER_API_TOKEN,
            },
        });

        if (response.data.status === "ok" && response.data.response) {
            return response.data.response.items[0]; 
        }

        console.warn('Unexpected API response format');
        return null; // If the expected data structure is not present, return null
    } catch (error) {
        console.error('Error fetching competition data:', error);
        throw error; // Re-throw to handle it in the calling context
    }
}

// Endpoint to fetch competition details by competition ID
app.get('/competition-data/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const competitionDetails = await fetchCompetitionData(cid);

        if (!competitionDetails) {
            return res.status(404).send("Competition data not found.");
        }

        res.json({
            status: 'success',
            data: competitionDetails,
        });
    } catch (error) {
        console.error('Error serving competition data:', error);
        res.status(500).send('Internal server error');
    }
});


// Utility function to fetch competition squad
async function CompetitionSquad(req, res) {
    const { cid } = req.params; // Competition ID from route parameters
    const { per_page = 10, paged = 1 } = req.query; // Default query parameters

    try {
        const response = await soccerApiClient.get(`/competition/${cid}/squad`, {
            params: {
                token: process.env.SOCCER_API_TOKEN,
                per_page,
                paged,
            },
        });

        if (response.data.status === "ok" && response.data.response) {
            return response.data.response.teams; // Return the teams with squads
        } else {
            throw new Error("Competition squad information not found.");
        }
    } catch (error) {
        console.error(`Failed to fetch squad info for competition ${cid}:`, error);
        throw error; // Re-throw error for handling in the calling context
    }
}

// Endpoint to fetch squad information for a given competition
app.get('/competition/:cid/squad', async (req, res) => {
    try {
        const { cid } = req.params;
        const competitionSquad = await CompetitionSquad(req, res);
        if (competitionSquad) {
          res.json({ status: 'success', data: competitionSquad });
        } else {
          res.status(404).send("Competition squad information not found.");
        }
      } catch (error) {
        console.error("Error fetching competition squad:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  


// Utility function to fetch competition matches
async function CompetitionMatches(req, res) {
    const { cid } = req.params; // Extract competition ID from route parameters
    const { per_page = 10, paged = 1 } = req.query; // Default values for pagination and other query parameters

    try {
        const response = await soccerApiClient.get(`/competition/${cid}/matches`, {
            params: {
                token: process.env.SOCCER_API_TOKEN,
                status: 1, // 1 for active or upcoming matches
                per_page,
                paged,
            },
        });

        if (response.data.status === "ok" && response.data.response) {
            res.json({
                status: 'success',
                data: response.data.response.items,
            });
        } else {
            res.status(404).send("No matches found for this competition.");
        }
    } catch (error) {
        console.error(`Failed to fetch matches for competition ${cid}:`, error);
        res.status(500).send('Error fetching competition match details');
    }
}

// Endpoint to get matches for a specific competition by ID
app.get('/competition-matches/:cid', CompetitionMatches);


// Utility function to fetch player profile data with stats filtering
async function fetchPlayerProfile(pid) {
    try {
        const response = await soccerApiClient.get(`/player/${pid}/profile`, {
            params: {
                token: process.env.SOCCER_API_TOKEN,
            }
        });

        const playerData = response.data.response?.items;

        if (!playerData) {
            throw new Error('Player data is undefined');
        }

        // Get the current year and set a range for the last three years
        const currentYear = new Date().getFullYear();
        const recentYears = [currentYear, currentYear - 1, currentYear - 2].map(year => year.toString());

        const formattedData = {
            player_info: {
                fullname: playerData.player_info?.fullname || 'N/A',
                positionname: playerData.player_info?.positionname || 'N/A',
                height: playerData.player_info?.height || 'N/A',
                weight: playerData.player_info?.weight || 'N/A',
                foot: playerData.player_info?.foot || 'N/A',
            },
            team_played: playerData.team_played?.map(team => ({
                team_name: team.team?.name || 'Unknown',
                startdate: team.startdate || 'N/A',
                enddate: team.enddate || 'N/A',
                shirt: team.shirt || 'N/A',
            })) || [], // default to an empty array if team_played is undefined
            stats: playerData.stats?.seasons?.filter(season => {
                // Filter seasons to include only those within the last three years
                const year = season.year.toString();
                return recentYears.includes(year) || recentYears.includes(year.slice(-2)); // Handle both full and two-digit year formats
            }).map(season => ({
                team_name: season.tname || 'Unknown',
                competition_name: season.cname || 'Unknown',
                year: season.year || 'N/A',
                goals: season.data?.goals || 0,
                assists: season.data?.assists || 0,
                yellowcards: season.data?.yellowcards || 0,
                redcards: season.data?.redcards || 0,
                matches: season.data?.matches || 0,
                minutesplayed: season.data?.minutesplayed || 0,
                shotsongoal: season.data?.shotsongoal || 0,
                shotsoffgoal: season.data?.shotsoffgoal || 0,
                shotsblocked: season.data?.shotsblocked || 0,
                penalties: season.data?.penalties || 0,
                corners: season.data?.corners || 0,
                offside: season.data?.offside || 0,
            })) || [], // default to an empty array if no relevant seasons are found
        };

        return formattedData;
    } catch (error) {
        console.error('Error fetching player profile:', error.message);
        throw new Error('Failed to fetch player profile data');
    }
}

// Example usage of the fetchPlayerProfile function in an endpoint
app.get('/player/:pid/profile', async (req, res) => {
    const { pid } = req.params;

    try {
        const profile = await fetchPlayerProfile(pid);
        if (profile) {
            res.json({ status: 'success', data: profile });
        } else {
            res.status(404).json({ status: 'error', message: 'Player profile not found.' });
        }
    } catch (error) {
        console.error('Error fetching player profile:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



// Utility function to fetch competition statistics
async function fetchCompetitionStats(cid) {
   
    try {
        const response = await soccerApiClient.get(`/competition/${cid}/statsv2`, {
            params: {
                token: process.env.SOCCER_API_TOKEN, // Using the API token
                per_page:20,
                paged: 2,
            },
        });
        if (response.data.status === "ok" && response.data.response && response.data.response.items) {
            return  response.data.response.items.map(player => ({
                pid: player.pid,
                name: player.name,
                team: player.team,
                assists: player.assist,
                goals: player.goals,
                shotsOnTarget: player.shotsontarget,
                shotsOffTarget: player.shotsofftarget,
                shotsBlocked: player.shotsblocked,
                dribbleAttempts: player.dribbleattempts,
                dribbleSuccess: player.dribblesuccess,
                bigChanceMissed: player.bigchancemissed,
                penaltyWon: player.penaltywon,
                hitWoodwork: player.hitwoodwork,
                penaltyMissed: player.penaltymiss,
                totalClearance: player.totalclearance,
                outfielderBlock: player.outfielderblock,
                interceptionWon: player.interceptionwon,
                tackleCommitted: player.tacklecommitted,
                tackleSuccess: player.tacklesuccess,
                challengeLost: player.challengelost,
                ownGoals: player.owngoals,
                penaltyCommitted: player.penaltycommitted,
                errorLedToShot: player.errorledtoshot,
                lastManTackle: player.lastmantackle,
                clearanceOffLine: player.clearanceoffline,
                passingAccuracy: player.passingaccuracy,
                accuratePass: player.accuratepass,
                totalPass: player.totalpass,
                longBallsAcc: player.longballsacc,
                totalLongBalls: player.totallongballs,
                totalCross: player.totalcross,
                crossesAcc: player.crossesacc,
                bigChanceCreated: player.bigchancecreated,
                errorLedToGoal: player.errorledtogoal,
                dispossessed: player.dispossessed,
                duelsTotal: player.duelstotal,
                duelsWon: player.duelswon,
                wasFouled: player.wasfouled,
                fouls: player.fouls,
                runsOutSuccess: player.runsoutsucess,
                totalRunsOut: player.totalrunsout,
                goodHighClaim: player.goodhighclaim,
                punches: player.punches,
                saves: player.saves,
                savesFromInsideBox: player.savesfrominsidebox,
                penaltySave: player.penaltysave,
                yellowCard: player.yellowcard,
                redCard: player.redcard
            }));

            
        } else {
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch competition statistics:', error);
        return null;
    }
}


// Endpoint to fetch competition statistics by competition ID
app.get('/competition-statistics/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const competitionStats = await fetchCompetitionStats(cid);
        if (competitionStats) {
            res.json({
                status: 'success',
                data: competitionStats,
            });
        } else {
            res.status(404).json({ status: 'error', message: 'Competition statistics not found.' });
        }
    } catch (error) {
        console.error('Failed to fetch competition statistics:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching competition statistics' });
    }
});


// Scheduled job to update the cache every 15 minutes
setInterval(updateMatchesCache, 15 * 60 * 1000);

// Route to get all upcoming matches
app.get('/upcoming-matches', (req, res) => {
    res.json(matchesCache);
});

// Route to get a match by mid
app.get('/matches/:mid', (req, res) => {
    const { mid } = req.params;
    const match = matchesCache.find(item => item.mid === mid);
    if (match) {
        res.json(match);
    } else {
        res.status(404).send('Match not found');
    }
});

// Helper function to fetch match details from the API
async function fetchMatchDetails(mid) {
    const url = `https://soccer.entitysport.com/matches/${mid}/info?token=${API_TOKEN}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === "ok" && response.data.response && response.data.response.items) {
            const items = response.data.response.items;
            const matchInfo = items.match_info[0]; // Assuming match_info is an array and you need the first item
            const headtohead = items.headtohead; // Directly accessing headtohead
            const lineup = items.lineup;
            const cid = matchInfo.competition.cid;
            const homeTid = matchInfo.teams.home.tid;
            const awayTid = matchInfo.teams.away.tid;
         
           

            return { matchInfo, lineup, headtohead, cid, homeTid, awayTid };
        }
        return null;  // No valid data found or the response does not match expected format
    } catch (error) {
        console.error('Error fetching match details:', error);
        throw error;  // Re-throw to handle it in the calling context
    }
}


// Route to get detailed match info including lineup if available
app.get('/match-details/:mid', async (req, res) => {
    const { mid } = req.params;

    try {
        const details = await fetchMatchDetails(mid);
        if (details) {
            res.json({
                mid: details.matchInfo.mid,
                teams: details.matchInfo.teams,
                venue: details.matchInfo.venue,
                dateStart: details.matchInfo.datestart,
                lineup: details.lineup, // This will either be the lineup or the message 'Lineup not available'
                headToHead: details.headtohead || 'Head to head data not available', // Check if headtohead data is present
                cid: details.cid,
                homeTid: details.homeTid,
                awayTid: details.awayTid,
                
            });
        } else {
            res.status(404).send('Match details not available');
        }
    } catch (error) {
        console.error("Error in fetching match details:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


// Helper function to fetch fantasy data from the API
async function fetchFantasyData(mid) {
    const url = `https://soccer.entitysport.com/matches/${mid}/newfantasy?token=${API_TOKEN}&fantasy=new2point`;
    try {
        const response = await axios.get(url);
        if (response.data.status === "ok" && response.data.response) {
            return response.data.response.items; // Directly return the response part if status is OK
        }
        console.log('Fantasy data not available or API response missing expected data:', response.data);
        return null;
    } catch (error) {
        console.error('Error fetching fantasy data:', error);
        throw error; // Re-throw to handle it in the calling context
    }
}

// Route to get fantasy match details
app.get('/fantasy-match-details/:mid', async (req, res) => {
    const { mid } = req.params;

    try {
        const fantasyDetails = await fetchFantasyData(mid);
        if (fantasyDetails) {
            // Assuming fantasyDetails is directly usable as received from fetchFantasyData
            const { teams, fantasyPoints, playerStats } = fantasyDetails;
            
            res.json ({
                matchInfo: fantasyDetails.match_info,
                teams:  teams, // Team details
                fantasyPoints: fantasyPoints,
                playerStats: playerStats
            });
            
        } else {
            res.status(404).send('Fantasy match details not available');
        }
    } catch (error) {
        console.error('Error serving fantasy match details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch team matches
const fetchTeamMatchs = async (tid, status = 2, per_page = 5, paged = 1) => {
    const url = `https://soccer.entitysport.com/team/${tid}/matches?token=${API_TOKEN}&status=${status}&per_page=${per_page}&paged=${paged}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === "ok" && response.data.response && response.data.response.items) {
            return response.data.response.items;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching match details:', error);
        throw error;
    }
};


// Endpoint to fetch match details by team ID
app.get('/team/:tid/matches', fetchTeamMatchs);


async function getMatchOutcome(mid) {
    try {
        const matchDetails = await fetchMatchDetails(mid);
        if (!matchDetails) {
            return "Match details not found.";
        }
         // Extract competition ID from match details
         const {cid, homeTid, awayTid} = matchDetails;
         const matchLocation = matchDetails.matchInfo.venue?.location || 'Unknown Location';
         if (!cid) {
             return "Competition ID not found in match details.";
         }

        const competitionDetails = await fetchCompetitionData(cid);
        if (!competitionDetails) {
            return "Competition details not found.";
        }
        
        const fantasyDetails = await fetchFantasyData(mid);
        if (!fantasyDetails) {
            return "Fantasy data not found.";
        }
        
        const competitionStats = await fetchCompetitionStats(cid);
        if (!competitionStats) {
            return "Competition statistics not found.";
        }
        
        const homeMatches = await fetchTeamMatchs(homeTid);
        const awayMatches = await fetchTeamMatchs(awayTid);
        
        const weatherData = await fetchWeather(matchLocation);

        function normalizePointTableData(pointTable, section) {
            if (!pointTable || !pointTable.tables) return [];
            if (Array.isArray(pointTable.tables)) {
                return pointTable.tables;
            } else if (typeof pointTable.tables === 'object' && pointTable.tables[section]) {
                return pointTable.tables[section];
            } else {
                return [];
            }
        }

        const formatLineup = (lineup) => {
            if (!lineup || !lineup.player) {
                return 'No lineup available';
            }
            const formation = lineup.formation || 'Unknown Formation';
            const players = lineup.player.map((player) => `(${player.pid},${player.pname}) (${player.position}, ${player.matchposition})`).join(", ");
            return `Formation: ${formation}, Players: ${players}`;
        };

        const homePointTableData = normalizePointTableData(competitionDetails.point_table[0], 'home');
        const awayPointTableData = normalizePointTableData(competitionDetails.point_table[0], 'away');

        const homeTableOverview = homePointTableData.map(team => `- ${team.tname}, Position: ${team.position}, Home Points: ${team.pointstotal}, Played at Home: ${team.playedtotal}, Home Wins: ${team.wintotal}, Home Draws: ${team.drawtotal}, Home Losses: ${team.losstotal}, Home Goals For: ${team.goalsfortotal}, Home Goals Against: ${team.goalsagainsttotal}, Home Goal Difference: ${team.goaldifftotal}, Promotion: ${team.promotion.type} (${team.promotion.name})`).join('\n');

        const awayTableOverview = awayPointTableData.map(team => `- ${team.tname}, Position: ${team.position}, Away Points: ${team.pointstotal}, Played Away: ${team.playedtotal}, Away Wins: ${team.wintotal}, Away Draws: ${team.drawtotal}, Away Losses: ${team.losstotal}, Away Goals For: ${team.goalsfortotal}, Away Goals Against: ${team.goalsagainsttotal}, Away Goal Difference: ${team.goaldifftotal}, Promotion: ${team.promotion.type} (${team.promotion.name})`).join('\n');

        const pointTableData = normalizePointTableData(competitionDetails.point_table[0]);

        const pointTableOverview = pointTableData.map(team => `. Team: ${team.tname}, Position: ${team.position}, Points: ${team.pointstotal}, Played: ${team.playedtotal}, Wins: ${team.wintotal}, Draws: ${team.drawtotal}, Losses: ${team.losstotal}, Goals For: ${team.goalsfortotal}, Goals Against: ${team.goalsagainsttotal}, Goal Difference: ${team.goaldifftotal}, Promotion: ${team.promotion.type} (${team.promotion.name})`).join('\n');

       // Fetching player profiles for the presquad
const homePresquadPids = fantasyDetails.teams.home?.map(player => player.pid) || [];
const awayPresquadPids = fantasyDetails.teams.away?.map(player => player.pid) || [];

// Fetch player profiles for all presquad players
const playerProfiles = await Promise.all(
    [...homePresquadPids, ...awayPresquadPids].map(pid => fetchPlayerProfile(pid))
);

// Format player profiles with stats
const formatPlayerProfiles = (profiles) => {
    return profiles.map(profile => 
        profile ? 
        `${profile.player_info.fullname} (${profile.player_info.positionname}), Height: ${profile.player_info.height} cm, Weight: ${profile.player_info.weight} kg, Foot: ${profile.player_info.foot}
        Stats:
        ${Array.isArray(profile.stats) 
            ? profile.stats.map(stat => 
                `Team: ${stat.team_name}, Competition: ${stat.competition_name}, Year: ${stat.year}, 
                Goals: ${stat.goals}, Assists: ${stat.assists}, Yellow Cards: ${stat.yellowcards}, Red Cards: ${stat.redcards}, 
                Matches: ${stat.matches}, Minutes Played: ${stat.minutesplayed}, Shots On Goal: ${stat.shotsongoal}, 
                Shots Off Goal: ${stat.shotsoffgoal}, Shots Blocked: ${stat.shotsblocked}, Penalties: ${stat.penalties}, 
                Corners: ${stat.corners}, Offside: ${stat.offside}`
              ).join('\n') 
            : 'Stats not available'}`
        : 'Profile not available'
    ).join('\n');
};

// Split player profiles into home and away based on presquad lengths
const homePlayerProfiles = formatPlayerProfiles(playerProfiles.slice(0, homePresquadPids.length));
const awayPlayerProfiles = formatPlayerProfiles(playerProfiles.slice(homePresquadPids.length));

        
        let prompt = `{
You are an expert sports analyst, with insights sharper than those of betting bookmakers.
Analyze the upcoming football match and provide predictions. Structure your response in bullet points, covering the following sections:

1. **Expected Outcome in Terms of Goals and Corners:**
   - Predict the number of goals for both home and away teams.
   - Predict the number of corners for both teams.

2. **Key Players Likely to Impact the Match:**
   - List key players for both teams.
   - For each player, provide their expected number of shots, shots on target, and assists.

3. **Same Game Parlay (SGP) Suggestions:**
   - Suggest a combination of bets with high winning probability based on team dynamics and player stats.

4. **Additional Predictions:**
   - Total over and under goals for the first and second half.
   - Most probable single bet outcome: WIN/LOSS/DOUBLE CHANCE.

Use the following format for your response:
        
    Expected Goals Outcome:
    Predicted Corners: 
    Key Players and Their Contributions: 
        Home:
        - Player Name, Shots: <number>, Shots on Target: <number>, Assists: <number>
        - Player Name, Shots: <number>, Shots on Target: <number>, Assists: <number>
        - ...
        
        Away:
        - Player Name, Shots: <number>, Shots on Target: <number>, Assists: <number>
        - Player Name, Shots: <number>, Shots on Target: <number>, Assists: <number>
        - ...
        
    Same Game Parlay Options:
    - Option 1: [Description]
    - Option 2: [Description]

    Total Goals (Over/Under) for First/Second Half:
    - First Half: [Prediction]
    - Second Half: [Prediction]

    Most Probable Single Bet:
    - Outcome: 
}

        
Teams: ${matchDetails.matchInfo.teams.home.tname} vs ${matchDetails.matchInfo.teams.away.tname},
Venue: ${matchDetails.matchInfo.venue?.name || 'Unknown Venue'}, Location: ${matchDetails.matchInfo.venue?.location || 'Unknown Location'};
Date: ${matchDetails.matchInfo.datestart}
Competition: ${competitionDetails.cname || 'Unknown Competition'}, featuring teams like ${competitionDetails.teams.map(team => team.tname).join(', ')}.

Weather:
${weatherData ? `Temperature: ${weatherData.temperature}°C, Description: ${weatherData.description}, Wind Speed: ${weatherData.windSpeed} m/s, Humidity: ${weatherData.humidity}%` : 'Weather data not available'}

Point Table Overview:
${pointTableOverview}

Home Games:
${homeTableOverview}

Away Games:
${awayTableOverview}

Competition Group: ${competitionDetails.point_table[0].name} (${competitionDetails.point_table[0].groupname})

Formation: 
Home: ${matchDetails.lineup?.home?.lineup?.formation || 'Unknown Formation'},
Away: ${matchDetails.lineup?.away?.lineup?.formation || 'Unknown Formation'}.

Lineup: 
Home: ${matchDetails.lineup?.home ? formatLineup(matchDetails.lineup.home.lineup) : 'Not Available'},
Substitutes:
Home: ${matchDetails.lineup?.home?.substitutes?.map(sub => `(${sub.pid},${sub.pname}) (${sub.matchposition}, ${sub.position})`).join(', ') || 'Not Available'},
Lineup:
Away: ${matchDetails.lineup?.away ? formatLineup(matchDetails.lineup.away.lineup) : 'Not Available'},
Substitutes:
Away: ${matchDetails.lineup?.away?.substitutes?.map(sub => `(${sub.pid},${sub.pname}) (${sub.matchposition}, ${sub.position})`).join(', ') || 'Not Available'}.

Head-to-Head:
Home wins: ${matchDetails.headtohead?.totalhomewin || 0},
Away wins: ${matchDetails.headtohead?.totalawaywin || 0},
Draws: ${matchDetails.headtohead?.totaldraw || 0}.

Recent Matches:
Home Team:
${homeMatches ? homeMatches.map(match => `Opponent: ${match.teams.away.tname}, Date: ${match.datestart}, Result: ${match.result.home}-${match.result.away}`).join('\n') : 'No recent matches available.'}
Away Team:
${awayMatches ? awayMatches.map(match => `Opponent: ${match.teams.home.tname}, Date: ${match.datestart}, Result: ${match.result.away}-${match.result.home}`).join('\n') : 'No recent matches available.'}


Fantasy Players:
Pre Squad Home: ${fantasyDetails.teams.home.map(player => `(${player.pid},${player.pname}) (${player.role}, ${player.rating})`).join(', ')},
Pre Squad Away: ${fantasyDetails.teams.away.map(player => `(${player.pid},${player.pname}) (${player.role}, ${player.rating})`).join(', ')}.

Player Profiles:
Home Team:
${homePlayerProfiles}

Away Team:
${awayPlayerProfiles}

Competition Statistics:
${competitionStats.map(player => `Player: ${player.name}, Team: ${player.team.name}, Goals: ${player.goals}, Assists: ${player.assists}, Shots On Target: ${player.shotsOnTarget}`).join('\n')} 

`;

        console.log('Prompt sent to AI:', prompt);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a sports Analyst AI." },
                { role: "user", content: prompt },
            ],
            
        });

        let assistantMessage = completion.choices[0].message.content.trim();
        assistantMessage = assistantMessage.replace(/[*#]/g, ''); // Remove unwanted characters

        return assistantMessage;
    } catch (error) {
        console.error("Error getting match outcome:", error);
        return "Unable to generate a prediction due to an internal error.";
    }
}

// GET route to predict match outcome
app.get('/predict-match-outcome/:mid', async (req, res) => {
    const { mid } = req.params;

    try {
        // Fetch match details and generate prediction using only the match ID
        const outcome = await getMatchOutcome(mid);
        if (!outcome) {
            console.log("Failed to generate the match outcome.");
            return res.status(500).send("Failed to generate the match outcome.");
        }

        
        res.setHeader('Content-Type', 'text/plain');
        res.send(outcome);
        
    } catch (error) {
        console.error("Error predicting match outcome:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    updateMatchesCache(); // Initial fetch of the matches
});

