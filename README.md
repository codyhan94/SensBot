# SensBot

Requires node.js. Install dependencies in the directory of this repo with:
```
npm install discord.io winston -save
npm install https://github.com/woor/discord.io/tarball/gateway_v6
```

Set up a token to host the bot if you are hosting it yourself, and put the token in a file `auth.json` in this directory. To host the bot:
```
node bot.js
```

# Usage:
```
commands:
    !cm [game | yaw] sens cpi -> cm/rev
    !convert [game1 | yaw1] to [game2 | yaw2] sens1 -> sens2
    !sens [game | yaw] cm cpi -> sens'
    !games -> list of supported games
```
