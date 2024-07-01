# Skribbl-Relay
This project is a relay server that takes chat messages & events from skribbl.io and forwards them to a Discord webhook. The Discord webhook URL is configured in the `.env` file.

## Installation
1. Clone the repository: `git clone https://github.com/w0ahL/Skribbl-Relay.git`
2. Install the dependencies: `npm i`
3. Configure the Discord webhook URL in the `.env` file.
4. Start the relay: `node .`

## Usage
The relay will forward any chat messages and or events it receives from skribbl.io and sends it to the configured Discord webhook.

## Contributing
If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License
This project is licensed under the [GPL-3.0 License](LICENSE).