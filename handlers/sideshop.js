var Dota2 = require("../index");

var tiers = {
    1: 1,
    2: 1,
    4: 1,
    6: 1,
    15:1,
    48: 2,
    14: 2,
    30: 2,
    98: 2,
    5: 2,
    44: 3,
    25: 3,
    107: 3,
    8: 3,
    11: 3,
    36: 4,
    46: 4,
    49: 4,
    23: 4,
    69: 4,
    105: 5,
    31: 5,
    41: 5,
    94: 5,
    72: 5,
}

var heroes = {
    1: "Anti-Mage",
    2: "Axe",
    3: "Bane",
    4: "Bloodseeker",
    5: "Crystal Maiden",
    6: "Drow Ranger",
    7: "Earthshaker",
    8: "Juggernaut",
    9: "Mirana",
    10: "Morphling",
    11: "Shadow Fiend",
    12: "Phantom Lancer",
    13: "Puck",
    14: "Pudge",
    15: "Razor",
    16: "Sand King",
    17: "Storm Spirit",
    18: "Sven",
    19: "Tiny",
    20: "Vengeful Spirit",
    21: "Windranger",
    22: "Zeus",
    23: "Kunkka",
    25: "Lina",
    26: "Lion",
    27: "Shadow Shaman",
    28: "Slardar",
    29: "Tidehunter",
    30: "Witch Doctor",
    31: "Lich",
    32: "Riki",
    33: "Enigma",
    34: "Tinker",
    35: "Sniper",
    36: "Necrophos",
    37: "Warlock",
    38: "Beastmaster",
    39: "Queen of Pain",
    40: "Venomancer",
    41: "Faceless Void",
    42: "Wraith King",
    43: "Death Prophet",
    44: "Phantom Assassin",
    45: "Pugna",
    46: "Templar Assassin",
    47: "Viper",
    48: "Luna",
    49: "Dragon Knight",
    50: "Dazzle",
    51: "Clockwerk",
    52: "Leshrac",
    53: "Nature's Prophet",
    54: "Lifestealer",
    55: "Dark Seer",
    56: "Clinkz",
    57: "Omniknight",
    58: "Enchantress",
    59: "Huskar",
    60: "Night Stalker",
    61: "Broodmother",
    62: "Bounty Hunter",
    63: "Weaver",
    64: "Jakiro",
    65: "Batrider",
    66: "Chen",
    67: "Spectre",
    68: "Ancient Apparition",
    69: "Doom",
    70: "Ursa",
    71: "Spirit Breaker",
    72: "Gyrocopter",
    73: "Alchemist",
    74: "Invoker",
    75: "Silencer",
    76: "Outworld Devourer",
    77: "Lycan",
    78: "Brewmaster",
    79: "Shadow Demon",
    80: "Lone Druid",
    81: "Chaos Knight",
    82: "Meepo",
    83: "Treant Protector",
    84: "Ogre Magi",
    85: "Undying",
    86: "Rubick",
    87: "Disruptor",
    88: "Nyx Assassin",
    89: "Naga Siren",
    90: "Keeper of the Light",
    91: "Io",
    92: "Visage",
    93: "Slark",
    94: "Medusa",
    95: "Troll Warlord",
    96: "Centaur Warrunner",
    97: "Magnus",
    98: "Timbersaw",
    99: "Bristleback",
    100: "Tusk",
    101: "Skywrath Mage",
    102: "Abaddon",
    103: "Elder Titan",
    104: "Legion Commander",
    105: "Techies",
    106: "Ember Spirit",
    107: "Earth Spirit",
    108: "Underlord",
    109: "Terrorblade",
    110: "Phoenix",
    111: "Oracle",
    112: "Winter Wyvern",
    113: "Arc Warden",
    114: "Monkey King",
    119: "Dark Willow",
    120: "Pangolier",
    121: "Grimstroke",
    126: "Void Spirit",
    128: "Snapfire",
    129: "Mars"
};

// Methods

/**
 * Sends a message to the Game Coordinator requesting the match details for the given match ID. 
 * This method is rate limited. When abused, the GC just stops responding.
 * Provide a callback or listen for {@link module:Dota2.Dota2Client#event:matchDetailsData|matchDetailsData} event for Game Coordinator's response. 
 * Requires the GC to be {@link module:Dota2.Dota2Client#event:ready|ready}.
 * @alias module:Dota2.Dota2Client#requestMatchDetails
 * @param {number} match_id - Match ID for which the bot should fetch the details
 * @param {module:Dota2~requestCallback} [callback] - Called with `err, CMsgGCMatchDetailsResponse`
 */
Dota2.Dota2Client.prototype.underDraftRequest = function(event_id, callback) {
    callback = callback || null;
    
    var payload = new Dota2.schema.CMsgClientToGCUnderDraftRequest({
        "event_id": event_id
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftRequest, 
                    payload, 
                    onUnderDraftResponse, 
                    callback);
};

Dota2.Dota2Client.prototype.underDraftSell = function(event_id, slot_id, callback) {
    callback = callback || null;
    
    var payload = new Dota2.schema.CMsgClientToGCUnderDraftSell({
        "event_id": event_id,
        "slot_id": slot_id
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftSell, 
                    payload, 
                    onUnderDraftSellResponse, 
                    callback);
};

Dota2.Dota2Client.prototype.underDraftBuy = function(event_id, slot_id, callback) {
    callback = callback || null;
    
    var payload = new Dota2.schema.CMsgClientToGCUnderDraftBuy({
        "event_id": event_id,
        "slot_id": slot_id
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftBuy, 
                    payload, 
                    onUnderDraftBuyResponse, 
                    callback);
};

Dota2.Dota2Client.prototype.underDraftReroll = function(event_id, callback) {
    callback = callback || null;
    
    var payload = new Dota2.schema.CMsgClientToGCUnderDraftReroll({
        "event_id": event_id
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftReroll, 
                    payload, 
                    onUnderDraftRerollResponse, 
                    callback);
};

Dota2.Dota2Client.prototype.hack = function(event_id, callback) {
    callback = callback || null;
    
    /* Sends a message to the Game Coordinator requesting `match_id`'s match details.  Listen for `matchData` event for Game Coordinator's response. */
    
    var payload = new Dota2.schema.CMsgClientToGCUnderDraftRedeemSpecialReward({
        "event_id": event_id
    });
    this.sendToGC(Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftRedeemSpecialReward, 
                    payload, 
                    onHackResponse, 
                    callback);
};


// Events
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatches|request for matches}
 * @event module:Dota2.Dota2Client#matchesData
 * @param {number} requestId - Id of the request to which this event is the answer
 * @param {number} total_results - Total number of results corresponding to the query (max 500)
 * @param {number} results_remaining - Total number of results not in this response
 * @param {CMsgDOTAMatch[]} matches - List of match information objects
 * @param {Object[]} series - List of series
 * @param {CMsgDOTAMatch[]} series[].matches - List of match information objects for the matches in this series
 * @param {number} series[].series_id - ID of the series
 * @param {number} series[].series_type - Type of the series
 * @param {CMsgDOTARequestMatchesResponse} matchResponse - A `CMsgDOTARequestMatchesResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatchDetails|request for a match's details}
 * @event module:Dota2.Dota2Client#matchDetailsData
 * @param {number} match_id - Match ID for which the details where asked
 * @param {CMsgGCMatchDetailsResponse} matchDetailsResponse - A `CMsgGCMatchDetailsResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatchMinimalDetails|request for a/multiples match's minimal details}
 * @event module:Dota2.Dota2Client#matchMinimalDetailsData
 * @param {boolean} last_match - Whether or not the last of the requested matches is included in this response
 * @param {CMsgClientToGCMatchesMinimalResponse} matchMinimalDetailsResponse - A `CMsgClientToGCMatchesMinimalResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestMatchmakingStats|request for the match making stats}
 * @event module:Dota2.Dota2Client#matchmakingStatsData
 * @param {number} matchgroups_version - Version nr of the match groups (these evolve over time). For the current list check {@link https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/regions.txt|regions.txt}
 * @param {Object[]} match_groups - The different match groups and their stats
 * @param {number} match_groups[].players_searching - The number of people searching for a match
 * @param {number} match_groups[].auto_region_select_ping_penalty - Ping penalty for people searching this region
 * @param {CMsgDOTAMatchmakingStatsResponse} matchmakingStatsResponse - A `CMsgDOTAMatchmakingStatsResponse` object containing the raw response.
 */
/**
 * Emitted in response to a {@link module:Dota2.Dota2Client#requestTopFriendMatches|request for the current top matches played by your friends}
 * @event module:Dota2.Dota2Client#topFriendMatchesData
 * @param {CMsgDOTAMatchMinimal[]} matches - A list of `CMsgDOTAMatchMinimal` objects containing the minimal match details of the matches your friends are currently playing.
 */


// Handlers
var handlers = Dota2.Dota2Client.prototype._handlers;

function enhanceDraftData(draft_data) {
    let shop = draft_data["shop_slots"];
    for (let i = 0; i < shop.length; i++){
        shop[i]["hero_name"] = heroes[shop[i]["hero_id"]];
        shop[i]["tier"] = tiers[shop[i]["hero_id"]];
    }

    let bench = draft_data["bench_slots"];
    for (let i = 0; i < bench.length; i++){
        bench[i]["hero_name"] = heroes[bench[i]["hero_id"]];
        bench[i]["tier"] = tiers[bench[i]["hero_id"]];
    }
}

var onUnderDraftResponse = function onUnderDraftResponse(message, callback) {
    callback = callback || null;
    var underDraftResponse = Dota2.schema.CMsgClientToGCUnderDraftResponse.decode(message);
    if(underDraftResponse["result"] == 1){
        enhanceDraftData(underDraftResponse["draft_data"]);
    }
    callback(underDraftResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftResponse] = onUnderDraftResponse;

var onUnderDraftSellResponse = function onUnderDraftSellResponse(message, callback) {
    callback = callback || null;
    var underDraftSellResponse = Dota2.schema.CMsgClientToGCUnderDraftSellResponse.decode(message);
    if(underDraftSellResponse["result"] == 1){
        enhanceDraftData(underDraftSellResponse["draft_data"]);
    }
    callback(underDraftSellResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftSellResponse] = onUnderDraftSellResponse;

var onUnderDraftBuyResponse = function onUnderDraftBuyResponse(message, callback) {
    callback = callback || null;
    var underDraftBuyResponse = Dota2.schema.CMsgClientToGCUnderDraftBuyResponse.decode(message);
    if(underDraftBuyResponse["result"] == 1){
        enhanceDraftData(underDraftBuyResponse["draft_data"]);
    }
    callback(underDraftBuyResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftBuyResponse] = onUnderDraftBuyResponse;

var onUnderDraftRerollResponse = function onUnderDraftRerollResponse(message, callback) {
    callback = callback || null;
    var underDraftRerollResponse = Dota2.schema.CMsgClientToGCUnderDraftRerollResponse.decode(message);
    if(underDraftRerollResponse["result"] == 1){
        enhanceDraftData(underDraftRerollResponse["draft_data"]);
    }
    callback(underDraftRerollResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftRerollResponse] = onUnderDraftRerollResponse;

var onHackResponse = function onHackResponse(message, callback) {
    callback = callback || null;
    var hackResponse = Dota2.schema.CMsgClientToGCUnderDraftRedeemSpecialRewardResponse.decode(message);
    callback(hackResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgClientToGCUnderDraftRedeemSpecialRewardResponse] = onHackResponse;
