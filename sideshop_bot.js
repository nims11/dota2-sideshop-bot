var steam = require("steam"),
    util = require("util"),
    fs = require("fs"),
    crypto = require("crypto"),
    dota2 = require("./"),
    steamClient = new steam.SteamClient(),
    steamUser = new steam.SteamUser(steamClient),
    steamFriends = new steam.SteamFriends(steamClient),
    Dota2 = new dota2.Dota2Client(steamClient, true);

// Load config
global.config = require("./config");

// Load in server list if we've saved one before
if (fs.existsSync('servers')) {
  steam.servers = JSON.parse(fs.readFileSync('servers'));
}

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

function print_draft_data(draft_data) {
    console.log("Gold: " + draft_data["gold"]);
    let shop = []
    draft_data['shop_slots'].forEach(function (slot){
        let logstr = slot["hero_name"];
        if(slot["is_special_reward"]){
            console.log("$$$$$$$$$$$");
            throw "YAY";
        }
        logstr += "(" + slot["tier"] + ")";
        shop.push(logstr);
    });
    console.log("shop: " + shop.join(","));

    let bench = [];
    draft_data['bench_slots'].forEach(function (slot){
        let logstr = slot["hero_name"];
        for(let i = 0; i < slot["stars"]; i++)
            logstr += "*";
        logstr += "(" + slot["tier"] + ")";
        bench.push(logstr);
    });
    console.log("Bench: " + bench.join(","));
}

function is_combo(hero_id, bench_slots){
    let count = 0;
    bench_slots.forEach(function(bench){
        if(bench["hero_id"] == hero_id && bench["stars"] == 1)
            count += 1;
    });
    return count == 2;
}

/* Steam logic */
var onSteamLogOn = function onSteamLogOn(logonResp) {
        if (logonResp.eresult == steam.EResult.OK) {
            steamFriends.setPersonaState(steam.EPersonaState.Busy); // to display your steamClient's status as "Online"
            steamFriends.setPersonaName(global.config.steam_name); // to change its nickname
            util.log("Logged on.");
            Dota2.launch();
            Dota2.on("ready", function() {
                console.log("Node-dota2 ready.");
                Dota2.underDraftRequest(29, function (msg) {
                    print_draft_data(msg["draft_data"]);
                    Dota2.emit("3star_sell", msg["draft_data"]);
                });
            });
            Dota2.on("unready", function onUnready() {
                console.log("Node-dota2 unready.");
            });
            Dota2.on("unhandled", function(kMsg) {
                util.log("UNHANDLED MESSAGE " + dota2._getMessageName(kMsg));
            });
            Dota2.on("3star_sell", function(draft_data) {
                print_draft_data(draft_data);
                console.log("Looking to sell 3 stars");
                for(let i = 0 ; i <  draft_data["bench_slots"].length; i++){
                    let bench = draft_data["bench_slots"][i];
                    if(bench["stars"] == 3){
                        console.log("Selling " + bench["hero_name"]);
                        setTimeout(function() {
                            Dota2.underDraftSell(29, bench["slot_id"], function(msg) {
                                if(msg["result"] != 1){
                                    throw "Error";
                                }
                                Dota2.emit("3star_sell", msg["draft_data"]);
                            });
                        }, 500);
                        return;
                    }
                }
                Dota2.emit("buy_to_free_slots", draft_data);
            });
            Dota2.on("buy_to_free_slots", function(draft_data) {
                console.log("Looking to buy combo");
                for(let i = 0 ; i <  draft_data["shop_slots"].length; i++){
                    let shop = draft_data["shop_slots"][i];
                    if(is_combo(shop["hero_id"], draft_data["bench_slots"])) {
                        console.log("Buying " + shop["hero_name"]);
                        setTimeout(function() {
                            Dota2.underDraftBuy(29, shop["slot_id"], function(msg) {
                                if(msg["result"] != 1){
                                    throw "Error";
                                }
                                Dota2.emit("3star_sell", msg["draft_data"]);
                            });
                        }, 500);
                        return;
                    }
                }
                Dota2.emit("buy", draft_data);
            });
            Dota2.on("buy", function(draft_data) {
                console.log("Looking to buy");
                let bench = draft_data["bench_slots"];
                let shop = draft_data["shop_slots"];
                let hero_counts = {};
                let hero_counts_shop = {};
                bench.forEach(function(x){
                    if(x["hero_id"]){
                        if(!(hero_counts[x["hero_id"]])){
                            hero_counts[x["hero_id"]] = 0;
                        }
                        if(x["stars"] == 1)
                            hero_counts[x["hero_id"]] += 1;
                        else if(x["stars"] == 2)
                            hero_counts[x["hero_id"]] += 3;
                        else if(x["stars"] == 3)
                            hero_counts[x["hero_id"]] += 9;
                    }
                });
                shop.forEach(function(x){
                    if(x["hero_id"]){
                        if(!hero_counts_shop[x["hero_id"]]){
                            hero_counts_shop[x["hero_id"]] = 0;
                        }
                        hero_counts_shop[x["hero_id"]] += 1;
                    }
                });
                let cmp = function(a, b){
                    if(!a["hero_id"] && !b["hero_id"]) return 0;
                    if(a["hero_id"] && !b["hero_id"]) return 1;
                    if(b["hero_id"] && !a["hero_id"]) return -1;
                    if(a["hero_id"] != b["hero_id"]){
                        let shop_bench_total = (hero_counts[a["hero_id"]] || 0) + (hero_counts_shop[a["hero_id"]] || 0);
                        shop_bench_total -= (hero_counts[b["hero_id"]] || 0) + (hero_counts_shop[b["hero_id"]] || 0);
                        if(shop_bench_total != 0)
                            return shop_bench_total;
                        return (hero_counts[a["hero_id"]] || 0) - (hero_counts[b["hero_id"]] || 0);
                    }
                    return 0;
                };
                bench.sort(function(a, b){
                    let x = cmp(a,b);
                    if(x != 0)
                        return x;
                    return a["stars"] - b["stars"];
                });
                console.log(JSON.stringify(bench));
                for(let i = 0 ; i <  draft_data["shop_slots"].length; i++){
                    let candidate = draft_data["shop_slots"][i];
                    if(candidate["hero_id"] && candidate["tier"] == 5){
                        console.log("Considering buying " + candidate["hero_name"])
                        for(let j = 0; j < bench.length; j++){
                            if(cmp(candidate, bench[j])  > 0){
                                if(bench[j]["hero_id"] == 0){
                                    console.log("Buying " + candidate["hero_name"])
                                    setTimeout(function(){
                                        Dota2.underDraftBuy(29, candidate["slot_id"], function(msg){
                                            if(msg["result"] != 1){
                                                throw "Error";
                                            }
                                            Dota2.emit("3star_sell", msg["draft_data"]);
                                        });
                                    }, 500);
                                } else {
                                    console.log("Selling " + bench[j]["hero_name"])
                                    setTimeout(function(){
                                        Dota2.underDraftSell(29, bench[j]["slot_id"], function(msg){
                                            if(msg["result"] != 1){
                                                throw "Error";
                                            }
                                            Dota2.emit("buy", msg["draft_data"]);
                                        });
                                    }, 500);
                                }
                                return;
                            }
                        }
                    }
                }
                console.log("Rerolling");
                setTimeout(function(){
                    Dota2.underDraftReroll(29, function(msg){
                        if(msg["result"] != 1){
                            throw "Error";
                        }
                        fs.appendFile('log.txt', JSON.stringify(msg["draft_data"]["shop_slots"]) + "\n", function(){});
                        Dota2.emit("3star_sell", msg["draft_data"]);
                    });
                }, 500);
            });
        }
    },
    onSteamServers = function onSteamServers(servers) {
        util.log("Received servers.");
        fs.writeFile('servers', JSON.stringify(servers), (err)=>{
            if (err) {if (this.debug) util.log("Error writing ");}
            else {if (this.debug) util.log("");}
        });
    },
    onSteamLogOff = function onSteamLogOff(eresult) {
        util.log("Logged off from Steam.");
    },
    onSteamError = function onSteamError(error) {
        util.log("Connection closed by server: "+error);
    };

steamUser.on('updateMachineAuth', function(sentry, callback) {
    var hashedSentry = crypto.createHash('sha1').update(sentry.bytes).digest();
    fs.writeFileSync('sentry', hashedSentry)
    util.log("sentryfile saved");
    callback({
        sha_file: hashedSentry
    });
});


// Login, only passing authCode if it exists
var logOnDetails = {
    "account_name": global.config.steam_user,
    "password": global.config.steam_pass,
};
if (global.config.steam_guard_code) logOnDetails.auth_code = global.config.steam_guard_code;
if (global.config.two_factor_code) logOnDetails.two_factor_code = global.config.two_factor_code;

try {
    var sentry = fs.readFileSync('sentry');
    if (sentry.length) logOnDetails.sha_sentryfile = sentry;
} catch (beef) {
    util.log("Cannae load the sentry. " + beef);
}

steamClient.connect();
steamClient.on('connected', function() {
    steamUser.logOn(logOnDetails);
});
steamClient.on('logOnResponse', onSteamLogOn);
steamClient.on('loggedOff', onSteamLogOff);
steamClient.on('error', onSteamError);
steamClient.on('servers', onSteamServers);
