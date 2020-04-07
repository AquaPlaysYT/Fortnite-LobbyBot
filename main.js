//* - Aquatic Dashboard V3.0 : Made By Aquatic Development Team - *\\
//* - Tutorial On AQUA PLAY'S YouTube channel! - *\\

// [WARNING] If you dont know what your doing dont mess with the code!

//* Requirements *\\
const { Client } = require('discord.js');
const request = require("request-promise");
var readlineSync = require('readline-sync');
const path = require('path');
var client = new Client();
var fs = require('fs');

//* Main Pogram *\\ 

console.log("\nFN Lobby Bot\n");

console.log("----------------------------------------------------------------- ")
console.log("If you need help join the Discord: discord.gg/7WPctqq")
console.log("A tutorial can be found on Youtube! ")
console.log("https://youtube.com/c/aquaplaysyt")
console.log("----------------------------------------------------------------- \n")

var ExchangeCode;

// Manual Exchange Code Login Via Kysunes Login Script!

var Email = readlineSync.question('Please Enter your bots Email: ');
var Password = readlineSync.question('Please Enter your bots Password: ', {
  hideEchoBack: true,
});

StartClient();

function StartClient() {

  // Default Cosmetics!

  var CID = "CID_TBD_Athena_Commando_M_ConstructorTest"
  var BID = ""
  var EID = "eid_bendy"
  var PICKAXE_ID = ""

  // Netcl Auto Update

  const ClientLoginAdapter = require('epicgames-client-login-adapter');
  const request = require("request-promise");
  const EGClient = require('epicgames-client').Client;
  const Fortnite = require('epicgames-fortnite-client');
  const { ESubGame } = Fortnite;
  const { EPlatform } = require('epicgames-client');
  const { EInputType } = require('epicgames-client');
  const { EPartyPrivacy } = require('epicgames-client');

  var rNetCL = request('https://fnserver.terax235.com/api/v1.2/build',{ json: true }, (err, res, body) => {
    rNetCL = body.fortnite.netCL 
  });   

  console.log("[AUTO] " + rNetCL)

  let eg = new EGClient({ // For this make a new account that has nothing and put the details in here.
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

  function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds) {
              break;
          }
      }
  }

  eg.init().then(async (success) => {

      // Login system reworked by Kysune

      const clientLoginAdapter = await ClientLoginAdapter.init({
          login: Email,
          password: Password,
      });
      const exchangeCode = await clientLoginAdapter.getExchangeCode();
      await clientLoginAdapter.close();

      await eg.login(null, exchangeCode); 

      var current_party;

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

          fortnite.party.me.setBattlePass(true, 100, 999, 999);

          fortnite.party.me.setBanner(100, "otherbanner28", "default");
      });

      fortnite.communicator.on('party:invitation', async (invitation) => {
          current_party = invitation.party;
          await invitation.accept()
      });

      fortnite.communicator.on('friend:request', async (friendops) => {
          eg.communicator.sendMessage(friendops.friend.id, "Thanks for friending me! I'm a lobby bot, to use me invite or join my party then send me the CID or EID in private messages!");
          sleep(200);
          eg.acceptFriendRequest(friendops.friend.id)
      });

      eg.communicator.on('friend:message', async (data) => {

          if (data.message == 'help') {
              eg.communicator.sendMessage(data.friend.id, 'Commands: CID_ , EID_ , BID_ , !banner, !stop, !bp, !status, !ready, !unready, !input, !platform');
          }

          var args = data.message.split(" ");
          if (args[0].toLowerCase().startsWith("cid_")) {
              CID = args[0];
              try {
                  fortnite.party.me.setOutfit("/Game/Athena/Items/Cosmetics/Characters/" + args[0] + "." + args[0]);
                  eg.communicator.sendMessage(data.friend.id, "Skin set to " + args[0]);
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use CID");
              }
          }

          if (args[0].toLowerCase().startsWith("eid_")) {
              EID = args[0];
              try {
                  fortnite.party.me.setEmote("/Game/Athena/Items/Cosmetics/Dances/" + args[0] + "." + args[0]);
                  eg.communicator.sendMessage(data.friend.id, "Emote set to " + args[0]);
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use EID");
              }
          }

          if (args[0].toLowerCase().startsWith("pickaxeid_")) {
              PICKAXE_ID = args[0];
              try {
                  fortnite.party.me.setPickaxe("/Game/Athena/Items/Cosmetics/Pickaxes/" + args[0] + "." + args[0]);
                  eg.communicator.sendMessage(data.friend.id, "Pickaxe set to " + args[0]);
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use Pickaxe_ID");
              }
          }

          if (args[0].toLowerCase().startsWith("bid_")) {
              BID = args[0];
              try {
                  fortnite.party.me.setBackpack("/Game/Athena/Items/Cosmetics/Backpacks/" + args[0] + "." + args[0]);
                  eg.communicator.sendMessage(data.friend.id, "Backbling set to " + args[0]);
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use BID");
              }
          }

          if (args[0].toLowerCase() == "!status") {
              var mess = data.message.replace("!status", "");
              fortnite.communicator.updateStatus(mess);
              communicator.sendMessage(data.friend.id, 'Status set to ' + mess + "!");
          }

          if (args[0].toLowerCase() == "!banner") {
              try {
                  fortnite.party.me.setBanner(100, args[1], args[2]);
                  eg.communicator.sendMessage(data.friend.id, "Banner set to " + args[1] + " " + args[2]);
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use !banner BANNER COLOR");
              }
          }

          if (args[0].toLowerCase() == "!ready") {
              try {
                  fortnite.party.me.setReady(true);
                  eg.communicator.sendMessage(data.friend.id, "Ready!");
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use !ready");
              }
          }

          if (args[0].toLowerCase() == "!unready") {
              try {
                  fortnite.party.me.setReady(false);
                  eg.communicator.sendMessage(data.friend.id, "Unready!");
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use !unready");
              }
          }

          if (args[0].toLowerCase() == "!bp") {
              try {
                  fortnite.party.me.setBattlePass(true, args[1], args[2], args[3]);
                  eg.communicator.sendMessage(data.friend.id, "BP set to " + args[1] + " " + args[2] + " " + args[3] + "!");
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use !bp LEVEL SELFXP FRIENDXP");
              }
          }

          if (args[0].toLowerCase() == "!stop") {
              try {
                  fortnite.party.me.clearEmote();
                  eg.communicator.sendMessage(data.friend.id, "Emote cleared!");
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use !stop");
              }
          }

          if (args[0].toLowerCase() == "!platform") {
              try {
                  fortnite.party.me.setPlatform(args[1]);
                  eg.communicator.sendMessage(data.friend.id, "Set Platform to " + args[1] + " !");
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use !platform PLATFORM");
              }
          }

          if (args[0].toLowerCase() == "!input") {
              try {
                  fortnite.party.me.setInputType(args[1]);
                  eg.communicator.sendMessage(data.friend.id, "Set Input to " + args[1] + " !");
              } catch {
                  eg.communicator.sendMessage(data.friend.id, "Please use !input INPUTTYPE");
              }
          }

      });

      fortnite.communicator.updateStatus("FN Lobby Bot, Tutorial on 'youtube.com/aquaplaysyt'");
  });
};