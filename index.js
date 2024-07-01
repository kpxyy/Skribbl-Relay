const { Client } = require("skribbler");

require("dotenv").config();

let { WEBHOOK_URL: URL } = process.env;

if (!URL) {
  console.error("You must include a URL in the .env file.");
  process.exit(0);
}

send({
  username: "Skribbl-Relay",
  embeds: [
    {
      title: "System",
      description: "Relay started",
      color: 65280,
      footer: {
        text: "Skribbl-Relay",
      },
    },
  ],
});

function main() {
  const client = new Client({
    name: "Skribbl Relay",
  });

  client.on("connect", () => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `Relay connected

        __**Server Information**__
        ➸ Lobby ID: ${client.lobbyId}
        ➸ Online Players: ${client.players.length}
        ➸ Current Round: ${client.round}
        ➸ Lobby Type: ${client.lobbyType === 0 ? "Public" : "Private"}
        ➸ Current Drawer: ${client.currentDrawer?.name ?? "N/A"}

        __**Server Settings**__
        ➸ Language: ${client.settings.language}
        ➸ Max Players: ${client.settings.maxPlayers}
        ➸ Max Draw Time: ${client.settings.maxDrawTime}
        ➸ Max Rounds: ${client.settings.maxRounds}
        ➸ Max Hints: ${client.settings.maxHints}
        ➸ Custom Words: ${client.settings.useCustomWords}
        `,
          color: 5688871,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
        },
      ],
    });

    console.log(`Connected to ${client.lobbyId}\nOnline Players: ${client.players.length}`);
  });

  client.on("votekick", ({ voter, votee, currentVotes, requiredVotes }) => {
    if (currentVotes > requiredVotes) currentVotes = requriedVotes;

    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `**${voter.name}** is voting to kick **${votee.name}** (${currentVotes}/${requiredVotes})`,
          color: 14863104,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
        },
      ],
    });
  });

  client.on("disconnect", (disconnectData) => {
    setTimeout(() => {
      main();
    }, 1660);

    const disconnectedParams = {
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: "",
          color: 16711680,
          footer: {
            text: "Skribbl-Relay",
          },
        },
      ],
    };

    switch (disconnectData.reason) {
      case 1:
        disconnectedParams.embeds[0].description = "Relay kicked";
        send(disconnectedParams);
        break;

      case 2:
        disconnectedParams.embeds[0].description = "Relay banned";
        send(disconnectedParams);
        break;
    }

    switch (disconnectData.joinErr) {
      case 1:
        disconnectedParams.embeds[0].description = "Room not found";
        send(disconnectedParams);
        break;

      case 2:
        disconnectedParams.embeds[0].description = "Room is full";
        send(disconnectedParams);
        break;

      case 3:
        disconnectedParams.embeds[0].description = "Relay on kick cooldown";
        send(disconnectedParams);
        break;

      case 4:
        disconnectedParams.embeds[0].description = "Relay banned";
        send(disconnectedParams);
        break;

      case 5:
        disconnectedParams.embeds[0].description = "Relay ratelimited";
        send(disconnectedParams);
        break;

      case 100:
        disconnectedParams.embeds[0].description = "Relay is already connected";
        send(disconnectedParams);
        break;

      case 200:
        disconnectedParams.embeds[0].description = "Too many connections";
        send(disconnectedParams);
        break;

      case 300:
        disconnectedParams.embeds[0].description =
          "Relay kicked too many times";
        send(disconnectedParams);
        break;

      case 9999:
        disconnectedParams.embeds[0].description =
          "Relay was spamming too many messages.";
        send(disconnectedParams);
        break;

      default:
        if (!disconnectData.joinErr) break;

        disconnectedParams.embeds[0].description = `Undefined if joinErr call: ${disconnectData.joinErr}`;
    }

    switch (disconnectData.transportDisconnectReason) {
      case "io client disconnect":
        disconnectedParams.embeds[0].description =
          "Relay was disconnected by client";
        break;

      case "io server disconnect":
        disconnectedParams.embeds[0].description =
          "Relay was disconnected by server";
        break;

      case "transport close":
        disconnectedParams.embeds[0].description =
          "Relay was disconnected due to a transport close";
        break;

      case "transport error":
        disconnectedParams.embeds[0].description =
          "Relay was disconnected due to a transport error";
        break;

      case "ping timeout":
        disconnectedParams.embeds[0].description =
          "Relay was disconnected due to a ping timeout";
        break;
    }

    send(disconnectedParams);
  });

  client.on("playerJoin", (userJoin) => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `**${userJoin.name}** joined the room!

                __**User Information**__
                ➸ User ID: ${userJoin.id}
                ➸ Total Score: ${userJoin.score}
                ➸ Flag(s): ${userJoin.flags}
                `,
          color: 5688871,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Online Players: ${client.players.length} - Skribbl-Relay`,
          },
        },
      ],
    });
  });

  client.on("playerLeave", ({ player, reason }) => {
    const message = {
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: "",
          color: 13520650,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Online Players: ${client.players.length} - Skribbl-Relay`,
          },
        },
      ],
    };

    if (client.players.length < 3) client.disconnect();

    switch (reason) {
      case 0:
        message.embeds[0].description = `**${player.name}** left the room!

                __**User Information**__
                ➸ User ID: ${player.id}
                ➸ Total Score: ${player.score}
                ➸ Flag(s): ${player.flags}
                `;
        break;

      case 1:
        message.embeds[0].description = `**${player.name}** has been kicked.

                __**User Information**__
                ➸ User ID: ${player.id}
                ➸ Total Score: ${player.score}
                ➸ Flag(s): ${player.flags}
                `;
        break;

      case 2:
        message.embeds[0].description = `**${player.name}** has been banned.

                __**User Information**__
                ➸ User ID: ${player.id}
                ➸ Total Score: ${player.score}
                ➸ Flag(s): ${player.flags}
                `;
        break;
    }

    send(message);
  });

  client.on("newOwner", ({ player }) => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `**${player.name}** is now the new host.`,
          color: 16754756,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
          thumbnail: {
            url: "https://skribbl.io/img/crown.gif",
          },
        },
      ],
    });
  });

  client.on("stateUpdate", (data) => {
    const message = {
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: "",
          color: 16754756,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
          thumbnail: {
            url: "",
          },
        },
      ],
    };

    switch (data.state) {
      case 0:
        message.embeds[0].description = "Waiting for players";
        client.currentDrawer = null;
        break;

      case 1:
        message.embeds[0].description = "Game starting in a few seconds";
        break;

      case 2:
        message.embeds[0].description = `Round **${client.round}** has started`;
        message.embeds[0].color = 65280;
        break;

      case 3:
        if (client.options.name === data.drawer?.name) {
          client.disconnect();
          break;
        }

        message.embeds[0].description = `**${
          client.currentDrawer?.name ?? "N/A"
        }** is choosing a word!`;
        message.embeds[0].thumbnail.url =
          "https://skribbl.io/img/randomize.gif";
        break;

      case 4:
        if (client.options.name === data.drawer?.name) {
          client.disconnect();
          break;
        }

        message.embeds[0].description = `**${
          client.currentDrawer?.name ?? "N/A"
        }** is drawing now!`;
        message.embeds[0].thumbnail.url = "https://i.ibb.co/k4vb1PM/pen-2.gif";
        message.embeds[0].color = 3765710;
        break;

      case 5:
        let drawResultsMsg = "";

        switch (data.reason) {
          case 0:
            message.embeds[0].description = `Everyone guessed the word!\n➸ '**${data.word}**'`;
            message.embeds[0].color = 5688871;
            send(message);
            break;

          case 1:
            message.embeds[0].description = `Time's up!\n➸ '**${data.word}**'`;
            message.embeds[0].thumbnail.url =
              "https://skribbl.io/img/setting_2.gif";
            message.embeds[0].color = 5688871;
            send(message);
            break;

          case 2:
            message.embeds[0].description = `The drawer left the game!\n➸ '**${data.word}**'`;
            message.embeds[0].color = 5688871;
            send(message);
            break;
        }

        for (const player in data.newScores) {
          if (data.newScores[player] > 0) drawResultsMsg += `**${player}**: ${data.newScores[player]}\n`;
        }

        if (!drawResultsMsg) break;
        
        message.embeds[0].thumbnail.url = "https://skribbl.io/img/crown.gif";
        message.embeds[0].description = `The drawing results are in!\n\n${drawResultsMsg}`;
        message.embeds[0].color = 16754756;

        client.currentDrawer = null;
        break;

      case 6:
        let leaderboardMsg = "";

        for (const index in data.leaderboard) {
          const player = data.leaderboard[index];

          leaderboardMsg += `**${player.name}**: ${player.score}\n`;
        }

        if (!leaderboardMsg) break;

        message.embeds[0].thumbnail.url = "https://skribbl.io/img/trophy.gif";
        message.embeds[0].description = `The game results are in!\n\n${leaderboardMsg}`;
        message.embeds[0].color = 16754756;

        client.currentDrawer = null;
        break;

      case 7:
        message.embeds[0].description = "Waiting for the game to start";
        break;
    }

    if (message.embeds[0].description === "") return;

    send(message);
  });

  client.on("startError", (gameStartErr) => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description:
            gameStartErr === 0
              ? "The host needs atleast **2** players to start the game"
              : `The server will be restarting in ${gameStartErr.time}`,
          color: 13520650,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Online Players: ${client.players.length} - Skribbl-Relay`,
          },
        },
      ],
    });
  });

  client.on("playerGuessed", ({ player }) => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `**${player.name}** guessed the word!`,
          color: 5688871,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
        },
      ],
    });
  });

  client.on("hintRevealed", () => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `A hint was revealed!\n➸ '**${client.word.replace(
            /_/g,
            "﹍",
          )}**'`,
          color: 16754756,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
          thumbnail: {
            url: "https://skribbl.io/img/setting_5.gif",
          },
        },
      ],
    });
  });

  client.on("vote", ({ player, vote }) => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `**${player.name}** ${
            vote === 0 ? "disliked" : "liked"
          } the drawing!`,
          color: vote === 0 ? 13520650 : 5688871,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
          thumbnail: {
            url:
              vote === 0
                ? "https://i.ibb.co/Fgg0h1P/thumbsdown.gif"
                : "https://i.ibb.co/Ch2PW4B/thumbsup.gif",
          },
        },
      ],
    });
  });

  client.on("text", ({ player, msg }) => {
    if (player.name === client.options.name) return;

    const didGuess =
      player.name === client.currentDrawer?.name || player.guessed;

    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "Chat",
          description: `**${player.name}**: ${msg}`,
          color: didGuess ? 8236351 : 16777215,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
          thumbnail: {
            url: "https://skribbl.io/img/setting_0.gif",
          },
        },
      ],
    });
  });
}

main();

function send(params) {
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(params),
  }).catch((error) => console.error(error));
}