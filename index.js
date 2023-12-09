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
          description: "Relay connected",
          color: 65280,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Online Players: ${client.players.length} - Skribbl-Relay`,
          },
        },
      ],
    });

    console.log(
      `Connected to ${client.lobbyId}\nOnline Players: ${client.players.length}`,
    );
  });

  client.on("votekick", ({ voter, votee, currentVotes, requiredVotes }) => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `${voter.name} is voting to kick ${votee.name} (${currentVotes}/${requiredVotes})`,
          color: 14863104,
        },
      ],
    });
  });

  client.on("disconnect", (disconnectData) => {
    console.log(disconnectData);

    setTimeout(() => {
      main();
    }, 5000);

    const disconnectedParams = {
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: "",
          color: 16711680,
        },
      ],
    };

    switch (disconnectData.reason) {
      case 1:
        disconnectedParams.embeds[0].description = "Relay kicked";
        break;

      case 2:
        disconnectedParams.embeds[0].description = "Relay banned";
    }

    switch (disconnectData.joinErr) {
      case 1:
        disconnectedParams.embeds[0].description = "Room not found";
        break;

      case 2:
        disconnectedParams.embeds[0].description = "Room is full";
        break;

      case 3:
        disconnectedParams.embeds[0].description = "Relay on kick cooldown";
        break;

      case 4:
        disconnectedParams.embeds[0].description = "Relay banned";
        break;

      case 5:
        disconnectedParams.embeds[0].description = "Relay ratelimited";
        break;

      case 100:
        disconnectedParams.embeds[0].description = "Relay is already connected";
        break;

      case 200:
        disconnectedParams.embeds[0].description = "Too many connections";
        break;

      case 300:
        disconnectedParams.embeds[0].description =
          "Relay kicked too many times";
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

  client.on("chooseWord", (word) => {
    client.disconnect();
  });

  client.on("playerJoin", (userJoin) => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `**${userJoin.name}** joined the room!`,
          color: 65280,
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
          color: 16711680,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Online Players: ${client.players.length} - Skribbl-Relay`,
          },
        },
      ],
    };

    switch (reason) {
      case 0:
        message.embeds[0].description = `**${player.name}** left the room!`;
        break;

      case 1:
        message.embeds[0].description = `**${player.name}** has been kicked.`;
        break;

      case 2:
        message.embeds[0].description = `**${player.name}** has been banned.`;
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
        },
      ],
    });
  });

  // packet logging for id 11
  client.on("packet", ({ id, data }) => {
    if (id != 11) return;

    const message = {
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: "",
          color: 16754756,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Online Players: ${client.players.length} - Skribbl-Relay`,
          },
        },
      ],
    };

    switch (client.state) {
      case 0:
        message.embeds[0].description = "Waiting for players";
        client.currentDrawer = null;
        break;

      case 1:
        message.embeds[0].description = "Game starting in a few seconds";
        break;

      case 3:
        if(client.options.name === client.currentDrawer?.name) return;
        message.embeds[0].description = `**${
          client.currentDrawer?.name ?? "N/A"
        }** is choosing a word!`;
        break;

      case 4:
        if(client.options.name === client.currentDrawer?.name) return;
        message.embeds[0].description = `**${
          client.currentDrawer?.name ?? "N/A"
        }** is drawing now!`;
        message.embeds[0].color = 3765710;
        break;

      case 5:
        switch (data.data.reason) {
          case 0:
            message.embeds[0].description = `The word was '**${data.data.word}**'\nEveryone guessed the word!`;
            break;

          case 1:
            message.embeds[0].description = `Time is up!\nThe word was '**${data.data.word}**'`;
            break;

          case 2:
            message.embeds[0].description = `The drawer left the game!\nThe word was '**${data.data.word}**'`;
            break;
        }

        message.embeds[0].color = 65280;
        client.currentDrawer = null;
        break;

      case 7:
        message.embeds[0].description = "Waiting for the game to start";
        break;
    }

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
              : "The server will be restarting soon",
          color: 16711680,
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
          color: 65280,
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
          description: `A hint was revealed!`,
          color: 16754756,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
        },
      ],
    });
  });

  client.on("roundStart", () => {
    send({
      username: "Skribbl-Relay",
      embeds: [
        {
          title: "System",
          description: `Round **${client.round}** has started`,
          color: 65280,
          footer: {
            text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`,
          },
        },
      ],
    });
  });

  client.on("vote", ({player, vote}) => {
      send({
          username: "Skribbl-Relay",
          embeds: [{
              title: "System",
              description: `**${player.name}** ${vote === 0 ? "disliked" : "liked"} the drawing!`,
              color: vote === 0 ? 16711680 : 65280,
              footer: {
                  text: `Lobby ID: ${client.lobbyId} - Skribbl-Relay`
              }
          }]
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
  }).catch((error) => console.error);
}
