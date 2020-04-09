/* 
    - Aquatic Dashboard V3.0 : Made By Aquatic Development Team -

    - Tutorial On AQUA PLAY'S YouTube channel! -

    [WARNING] If you dont know what your doing dont mess with the code!
*/

const { Client } = require('discord.js');
const request = require("request-promise");
var client = new Client();
var config = require('./config.json');

console.log("\nFN Lobby Bot\n");

console.log("----------------------------------------------------------------- ");
console.log("If you need help join the Discord: discord.gg/7WPctqq");
console.log("A tutorial can be found on Youtube! ");
console.log("https://youtube.com/c/aquaplaysyt");
console.log("----------------------------------------------------------------- \n");

var CID = "CID_TBD_Athena_Commando_M_ConstructorTest";
var BID = "";
var EID = "eid_bendy";
var PICKAXE_ID = "";

const ClientLoginAdapter = require('epicgames-client-login-adapter');
const request = require("request-promise");
const { Client: EGClient } = require('epicgames-client');
const Fortnite = require('epicgames-fortnite-client');
const { ESubGame } = Fortnite;
const { EPartyPrivacy } = require('epicgames-client');

var rNetCL = request('https://fnserver.terax235.com/api/v1.2/build', { json: true }, (err, res, body) => {
    rNetCL = body.fortnite.netCL 
});   

console.log("[AUTO] " + rNetCL);

const eg = new EGClient({ // For this make a new account that has nothing and put the details in here.
    email: "",
    password: "",
    debug: console.log,
    defaultPartyConfig: {
        privacy: EPartyPrivacy.PUBLIC,
        joinConfirmation: false,
        joinability: 'OPEN', // Opens the party and allows it to be joined
        maxSize: 16,
        subType: 'default',
        type: 'default',
        inviteTTL: 14400,
        chatEnabled: true,
    }
});

eg.init().then(async (success) => {

    const clientLoginAdapter = await ClientLoginAdapter.init();
    const exchangeCode = await clientLoginAdapter.getExchangeCode();
    await clientLoginAdapter.close();

    await eg.login(null, exchangeCode); 

    if(config.UseDiscord == true) {
        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
            client.user.setActivity(`Fortnite Custom Lobbies`);
        });
        client.login(config.DiscordBotToken);
    }

    if (!success)
        throw new Error('Cannot initialize EpicGames launcher.');

    const fortnite = await eg.runGame(Fortnite, {
        netCL: rNetCL,
        partyBuildId: '1:1:' + rNetCL,
    });
    const br = await fortnite.runSubGame(ESubGame.BattleRoyale)

    fortnite.communicator.on('party:member:joined', async (member) => {
        console.log(`Member#${member.id} joined!`);
        console.log(`Members count: ${fortnite.party.members.length}`);

        fortnite.party.me.setOutfit("/Game/Athena/Items/Cosmetics/Characters/" + CID + "." + CID);

        fortnite.party.me.setBackpack("/Game/Athena/Items/Cosmetics/Backpacks/" + BID + "." + BID);

        fortnite.party.me.setPickaxe("/Game/Athena/Items/Cosmetics/Pickaxes/" + PICKAXE_ID + "." + PICKAXE_ID); // ALL OF THE THINGS ARE PULLED FROM ABOVE!

        fortnite.party.me.setEmote("/Game/Athena/Items/Cosmetics/Dances/" + EID + "." + EID);

        fortnite.party.me.setBattlePass(true, 420000, 420000, 420000);

        fortnite.party.me.setBanner(420000, "otherbanner28", "default");

        if(config.UseDiscord == true) {
            client.user.setActivity(`Serving ${fortnite.party.members.length} Players!`);
        }
    });

    fortnite.communicator.on('party:member:left', async (member) => {
        console.log(`Member#${member.id} left!`);
        console.log(`Members count: ${fortnite.party.members.length}`);

        if(config.UseDiscord == true) {
            client.user.setActivity(`Serving ${fortnite.party.members.length} Players!`);
        }
    });

    fortnite.communicator.on('party:invitation', async (invitation) => {
        await invitation.accept();
    });

    fortnite.communicator.on('friend:request', async (friendops) => {
        eg.communicator.sendMessage(friendops.friend.id, "Thanks for friending me! I'm a lobby bot, to use me invite or join my party then send me the CID or EID in private messages!");
        await eg.acceptFriendRequest(friendops.friend.id);
    });

    eg.communicator.on('friend:message', async (data) => {
        const message = data.messsage;
        const friend = data.friend;

        const args = message.split(" ");
        const ids = ["CID", "EID", "Pickaxe"];
        const fortnitefunction = message.toUpperCase().includes('CID') ? "setOutfit" : message.toUpperCase().includes("BID") ? "setBackpack" : message.toUpperCase().includes("Pickaxe") ? "setPickaxe" : message.toUpperCase().includes("EID") ? "setEmote" : null;

        if(ids.some(id => message.startsWith(id))) {
            fortnite.party.me[fortnitefunction](data.message);
            eg.communicator.sendMessage(friend.id, "Skin set to " + args[0]);
        }

        if (data.message == 'help') {
            eg.communicator.sendMessage(friend.id, 'Commands: CID_ , EID_ , BID_ , !banner, !stop, !bp, !status, !ready, !unready, !input, !platform');
        }

        if (args[0].toLowerCase() == "!status") {
            fortnite.communicator.updateStatus(args[1]);
            eg.communicator.sendMessage(friend.id, 'Status set to ' + args[1] + "!");
        }

        if (args[0].toLowerCase() == "!banner") {
            fortnite.party.me.setBanner(100, args[1], args[2]);
            eg.communicator.sendMessage(friend.id, "Banner set to " + args[1] + " " + args[2]);
        }

        if (args[0].toLowerCase() == "!ready") {
            fortnite.party.me.setReady(true);
            eg.communicator.sendMessage(friend.id, "Ready!");
        }

        if (args[0].toLowerCase() == "!unready") {
            fortnite.party.me.setReady(false);
            eg.communicator.sendMessage(friend.id, "Unready!");
        }

        if (args[0].toLowerCase() == "!bp") {
            fortnite.party.me.setBattlePass(true, args[1], args[2], args[3]);
            eg.communicator.sendMessage(friend.id, "BP set to " + args[1] + " " + args[2] + " " + args[3] + "!");
        }

        if (args[0].toLowerCase() == "!stop") {
            fortnite.party.me.clearEmote();
            eg.communicator.sendMessage(friend.id, "Emote cleared!");
        }

        if (args[0].toLowerCase() == "!platform") {
            fortnite.party.me.setPlatform(args[1]);
            eg.communicator.sendMessage(friend.id, "Set Platform to " + args[1] + " !");
        }

        if (args[0].toLowerCase() == "!input") {
            fortnite.party.me.setInputType(args[1]);
            eg.communicator.sendMessage(friend.id, "Set Input to " + args[1] + " !");
        }

    });

    // This changes the default status, i would prefer you keep it the same but you change it if you feel!

    fortnite.communicator.updateStatus("FN Lobby Bot, Tutorial on 'youtube.com/aquaplaysyt'");
});
