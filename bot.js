var yawMap = {
    "cs":           0.022,
    "quake":        0.022,
    "source":       0.022,
    "overwatch":    0.0066,
    "ow":           0.0066,
    "rainbow6":     0.00572957795130823,
    "reflex":       0.00572957795130823,
    "fn":           0.55550,
    "fortnite":     0.55550,
    "doom":         0.0439453125,
    "qcde":         0.0439453125,
};

const CM_PER_INCH = 2.54;

// for now just use degrees and cm as units. can add conversion tables later if
// desired.

// GetCM(yaw, sens, dpi)
function GetCM(yaw, sens, dpi) {
    // save increment (degrees per count)
    var inc = yaw * sens;
    var counts_per_rev = 360 / inc;
    return counts_per_rev / dpi * CM_PER_INCH;
}

// GetSens(yaw, cm, dpi)
function GetSens(yaw, cm, dpi) {
    var counts_per_rev = cm / CM_PER_INCH * dpi;
    var inc = 360 / counts_per_rev;
    return inc / yaw;
}


var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

// commands:
//  !cm game sens dpi -> cm/360
//  !convert [game1] to [game2] sens1 dpi -> sens2
//  !sens game cm dpi -> sens

var usage = `
commands:
    !cm [game | yaw] sens cpi -> cm/rev
    !convert [game1 | yaw1] to [game2 | yaw2] sens1 -> sens2
    !sens [game | yaw] cm cpi -> sens'
    !games -> list of supported games
`

function GetYaw(arg) {
    var yaw = parseFloat(arg);
    if (!isNaN(yaw)) {
        return yaw;
    }
    game = arg.toLowerCase();
    if (!(game in yawMap)) {
        return -1;
    }
    return yawMap[game];
}

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var msg = '';

        args = args.splice(1);
        switch(cmd.toLowerCase()) {
            case 'help':
            case 'usage':
                msg = usage;
                break;
            case 'sens':
                if (args.length != 3) {
                    msg = usage;
                    break;
                }
                var yaw = GetYaw(args[0]);
                // msg = args[0] + ', ' + yaw.toString();
                // break;
                if (yaw === -1) {
                    msg = 'Supported games: ' + Object.keys(yawMap).join(',');
                    break;
                }
                cm = args[1];
                dpi = args[2];
                msg = GetSens(yaw, cm, dpi).toFixed(4).toString();
                break;
            case 'convert':
                if (args.length != 4) {
                    msg = usage;
                    break;
                }
                yaw1 = GetYaw(args[0]);
                yaw2 = GetYaw(args[2]);
                if (yaw1 === -1 || yaw2 === -1) {
                    msg = 'Supported games: ' + Object.keys(yawMap).join(',');
                    break;
                }
                sens = parseFloat(args[3]);
                inc1 = sens * yaw1;
                msg = (inc1 / yaw2).toFixed(4).toString();
                break;
            case 'cm':
                if (args.length != 3) {
                    msg = usage;
                    break;
                }
                var yaw = GetYaw(args[0]);
                if (yaw === -1) {
                    msg = 'Supported games: ' + Object.keys(yawMap).join(',');
                    break;
                }
                sens = args[1];
                dpi = args[2];
                msg = GetCM(yaw, sens, dpi).toFixed(4).toString();
                break;
            case 'game':
            case 'games':
                msg = 'Supported games: ' + Object.keys(yawMap).join(',');
                break;
            default:
                msg = usage;
         }
        bot.sendMessage({
            to: channelID,
            message: msg,
        });
     }
});
