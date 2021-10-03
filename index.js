/////////////////
//configuration//
/////////////////

const Discord = require("discord.js");
const DisTube = require("distube");
const config = {
    PREFIX: ",",
    TOKEN: "token here",
}

const Enmap = require("enmap")

const client = new Discord.Client({
    disableMentions: "all"
});

client.settings = new Enmap({
    name: "settings"
}); 

const distube = new DisTube(client, {
    youtubeCookie: "Your cookie must go here !!!",
    emitNewSongOnly: true,
    highWaterMark: 50 * 1024 * 1024,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: true,
    searchSongs: false,
    customFilters: {
        "optimized": "bass=g=13,dynaudnorm=f=1300",
        "bassboost": "bass=g=23,dynaudnorm=f=1700",
        "clear": "dynaudnorm=f=1300",
        "8d": "apulsator=hz=0.08",
        "vaporwave": "aresample=48000,asetrate=48000*0.8",
        "nightcore": "aresample=48000,asetrate=48000*1.25",
        "phaser": "aphaser=in_gain=0.4",
        "purebass": "bass=g=20,dynaudnorm=f=200,asubboost",
        "tremolo": "tremolo",
        "vibrato": "vibrato=f=6.5",
        "reverse": "areverse",
        "treble": "treble=g=5",
        "surrounding": "surround",
        "pulsator": "apulsator=hz=1",
        "subboost": "asubboost",
        "karaoke": "stereotools=mlev=0.03",
        "flanger": "flanger",
        "gate": "agate",
        "haas": "haas",
        "mcompand": "mcompand"
    }
})

let stateswitch = false;

let emojis = [
    "🟢",
    "🟩",
    "✅",
    "☑️",
    "💚",
    "👌",
    "👍",
    "💪"
];

const filters = [
    "mcompand",
    "gate",
    "haas",
    "pulsator",
    "surrounding",
    "optimized",
    "8d",
    "bassboost",
    "clear",
    "echo",
    "karaoke",
    "nightcore",
    "vaporwave",
    "flanger",
    "subboost",
    "phaser",
    "tremolo",
    "vibrato",
    "reverse",
    "purebass",
    "treble"
];
//filters array for filtering

/////////////////
//////Events/////
/////////////////

client.login(config.TOKEN); //start the botthe bot

//log when ready and status
client.on("ready", () => {
    console.log(` :: Bot has started as : ${client.user.tag}`);
    client.user.setPresence({
        status: "online"
    }); //change to online

    setInterval(() => {
        stateswitch = !stateswitch; //change state
        if (stateswitch) client.user.setActivity(`Type ${config.PREFIX}help to get started.`, {
            type: "PLAYING"
        });
        else client.user.setActivity(`music on your command!`, {
            type: "PLAYING"
        });
    }, 3000);
})

//log when reconnect
client.on('reconnecting', () => {
    console.log(' :: Reconnecting!');
    client.user.setPresence({
        status: "offline"
    }); //change to offline
});

//log when disconnecting
client.on('disconnect', () => {
    console.log(' :: Disconnect!');
    client.user.setPresence({
        status: "offline"
    }); //change to offline
});

client.on("message", async message => {
    if (message.author.bot) return; //if a bot return 
    if (!message.guild) return; //if not in a guild return

    client.settings.ensure(message.guild.id, {
        prefix: ","
    });

    let prefix = client.settings.get(message.guild.id, `prefix`);

    if (prefix === null) prefix = config.PREFIX; //if not prefix set it to standard prefix in the config.json file

    const args = message.content.slice(prefix.length).trim().split(/ +/g); //arguments of the content
    const command = args.shift(); //defining the command msgs

    if (message.content.includes(client.user.id)) { //if message contains musicium as a ping
        return message.reply(new Discord.MessageEmbed().setColor("#c219d8").setAuthor(`${message.author.username}, My Prefix is ${prefix}, to get started; type ${prefix}help`, message.author.displayAvatarURL({
            dynamic: true
        })));
    }
    if (message.content.startsWith(prefix)) { //if its a command react with a random emoji
        let random = getRandomInt(8); //get the actual random number
        message.react(emojis[random]); //react with the emoji
    } else { //if not a command skip
        return;
    }

    ///////////////////
    /////COMMANDS//////
    ///////////////////

    try {
        if (command === "invite" || command === "add") {
            await message.channel.bulkDelete(1).catch(err=>{});
            return embedbuilder(client, message, "#c219d8", "Invite this Bot!", "[`Click here`](https://discord.com/api/oauth2/authorize?client_id=853138775118446617&permissions=2184408176&scope=bot)   |   :heart: Thanks for inviting!").then(msg => msg.delete({
                timeout: 60000
            }).catch(console.error))
        }

        if (command === "help" || command === "about" || command === "h" || command === "info") {
            await message.channel.bulkDelete(1).catch(err=>{});
            let helpembed = new Discord.MessageEmbed()
                .setColor("#c219d8")
                .setTitle("***__COMMANDS__***")
                .setDescription(`
        >>>\`${prefix}prefix <NEW PREFIX>\` ➖➖ *to change pefix:* 
        \`${prefix}help\`  \`${prefix}h\`  ➖➖ *List of all Commands*
        \`${prefix}setup\`  ➖➖ *Creates a separate text channel for Harmonica(It is better to use this bot in a sepatate channel)*
        \`${prefix}play <URL/NAME>\`  \`${prefix}p\`  ➖➖ *Plays a song
        \`${prefix}search <URL/NAME>\`  \`${prefix}sr\`  ➖➖ *Searches for 15 results*
        \`${prefix}status\`  \`${prefix}st\`  ➖➖ *Shows queue status*
        \`${prefix}nowplaying\`  \`${prefix}np\`  ➖➖ *Shows current song*
        \`${prefix}pause\`  ➖➖ *Pauses the song*
        \`${prefix}resume\`  \`${prefix}r\`  ➖➖ *Resume the song*
        \`${prefix}clr\`  ➖➖ *deletes previous 70 messages in the channel*
        \`${prefix}shuffle\`  \`${prefix}mix\`  ➖➖ *Shuffles the queue*
        \`${prefix}playskip\`  \`${prefix}ps\`  ➖➖ *Plays new song and skips current*
        \`${prefix}autoplay\`  \`${prefix}ap\`  ➖➖ *Enables autoplay - random similar songs
        \`${prefix}skip\`  \`${prefix}s\`  ➖➖ *Skips current song*
        \`${prefix}stop\`  \`${prefix}leave\`  \`${prefix}dc\`  ➖➖ *Stops playing and leaves the channel*
        \`${prefix}seek <DURATION>\`  ➖➖ *Moves in the Song in: seconds*
        \`${prefix}volume <VOLUME\`  \`${prefix}vol\`  ➖➖ *Changes volume*
        \`${prefix}queue\`  \`${prefix}q\`  ➖➖ *Shows current Queue*
        \`${prefix}loop <0/1/2>\`  \`${prefix}mix\`  ➖➖ *Enables loop for off / song / queue*
        \`${prefix}jump <Queue num.>\`  ➖➖ *Jumps to a queue song*
        \`${prefix}prefix <PREFIX>\`  ➖➖ *Changes the prefix*
        \`${prefix}ping\`  ➖➖ *Gives you the ping*
        \`${prefix}uptime\`  ➖➖ *Shows you the Bot's Uptime*
        \`${prefix}invite\`  ➖➖ *Invite the Bot to your Server :heart:*
        `)
                .addField("***FILTER COMMANDS:***", `
        >>> \`${prefix}gate\` | \`${prefix}haas\` | \`${prefix}pulsator\` | \`${prefix}surrounding\` | \`${prefix}clear\` | \`${prefix}8d\` | \`${prefix}bassboost\` | \`${prefix}echo\` | \`${prefix}karaoke\` | \`${prefix}nightcore\` | \`${prefix}vaporwave\` | \`${prefix}flanger\` | \`${prefix}subboost\` | \`${prefix}phaser\` | \`${prefix}tremolo\` | \`${prefix}vibrato\` | \`${prefix}reverse\` | \`${prefix}treble\` | \`${prefix}clear\`   
        `)
                .addField("***SUPPORTED SOURCES:***", `
        >>> \`Youtube\`, \`Soundcloud\`, [\`More\`]
        `)
                .addField("***BOT BY:***", `
        >>> <@852928580031610900>
        `)
                .addField("***SUPPORT:***", `
        >>> [\`Invite\`](https://discord.com/api/oauth2/authorize?client_id=853138775118446617&permissions=2184408176&scope=bot)
        `)
            message.channel.send(helpembed)
            return;
        } else if (command === "prefix") {
            await message.channel.bulkDelete(1).catch(err=>{});
            client.settings.ensure(message.guild.id, {
                prefix: ","
            });

            let prefix = client.settings.get(message.guild.id, `prefix`);

            if (prefix === null) prefix = config.PREFIX;

            message.react("✅");

            if (!args[0]) return embedbuilder(client, message, "RED", "Current Prefix: \`${prefix}\`", `Please provide a new prefix`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))


            if (!message.member.hasPermission("ADMINISTRATOR")) return embedbuilder(client, message, "RED", "PREFIX", `❌ You don\'t have permission for this Command!`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))


            if (args[1]) return embedbuilder(client, message, "RED", "PREFIX", `'❌ The prefix can\'t have two spaces'`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))

            client.settings.set(message.guild.id, args[0], `prefix`);

            return embedbuilder(client, message, "#c219d8", "PREFIX", `✅ Successfully set new prefix to **\`${args[0]}\`**`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } else if (command === "search" || command == "sr") {
            await message.channel.bulkDelete(1).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "Searching!", args.join(" ")).then(msg => msg.delete({
                timeout: 1000
            }).catch(console.error))

            let result = await distube.search(args.join(" "));

            let searchresult = " ";

            for (let i = 0; i <= result.length; i++) {
                try {
                    searchresult += await `**${i + 1}**. ${result[i].name} - \`${result[i].formattedDuration}\`\n`;
                } catch {
                    searchresult += await " ";
                }
            }
            let searchembed = await embedbuilder(client, message, "#c219d8", "Current Queue!", searchresult)

            let userinput;

            await searchembed.channel.awaitMessages(m => m.author.id == message.author.id, {
                max: 1,
                time: 70000,
                errors: ["time"],
            }).then(collected => {
                userinput = collected.first().content;
                if (isNaN(userinput)) {
                    embedbuilder(client, message, "RED", "Not a right number!", "so i use number 1!").then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    userinput = 1;
                }
                if (Number(userinput) < 1 || Number(userinput) > 15) {
                    embedbuilder(client, message, "RED", "Not a right number!", "so i use number 1!").then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    userinput = 1;
                }
                searchembed.delete({
                    timeout: Number(client.ws.ping)
                });
            }).catch(() => {
                console.log(console.error);
                userinput = 404
            });
            if (userinput === 404) {
                return embedbuilder(client, message, "RED", "Something went wrong!").then(msg => msg.delete({
                    timeout: 3000
                }).catch(console.error))
            }
            embedbuilder(client, message, "#c219d8", "Searching!", `[${result[userinput - 1].name}](${result[userinput - 1].url})`, result[userinput - 1].thumbnail).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.play(message, result[userinput - 1].url)
        } else if (command == "status" || command == "st") {
            await message.channel.bulkDelete(1).catch(err=>{});
            let queue = distube.getQueue(message);
            if (!queue) return embedbuilder(client, message, "RED", "There is nothing playing!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error));

            const status = `Volume: \`${queue.volume}\` | Filter: \`${queue.filter || "❌"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
            return embedbuilder(client, message, "#c219d8", "Current status:", status).then(msg => msg.delete({
                timeout: 7000
            }).catch(console.error))
        } else if (command == "np" || command === "nowplaying") {
            await message.channel.bulkDelete(1).catch(err=>{});
            let queue = distube.getQueue(message);
            if (!queue) return embedbuilder(client, message, "RED", "There is nothing playing!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error));

            let cursong = queue.songs[0];

            return embedbuilder(client, message, "#c219d8", "Current Song!", `[${cursong.name}](${cursong.url})\n\nPlaying for: \`${(Math.floor(queue.currentTime / 1000 / 60 * 100) / 100).toString().replace(".", ":")} Minutes\`\n\nDuration: \`${cursong.formattedDuration}\``, cursong.thumbnail).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } else if (command == "pause") {
            await message.channel.bulkDelete(1).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "Paused!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.pause(message);
        } else if (command == "resume" || command == "r") {
            await message.channel.bulkDelete(1).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "Resume!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.resume(message);
        } else if (command == "setup") {
            await message.channel.bulkDelete(1).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "Channel Created!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return message.guild.channels.create('🎶harmonica', {
                type: 'text',
            }).then(channel => {
                channel.setTopic(":play_pause: Pause the song. :pause_button: Resume the song. :stop_button: Stop and empty the queue. :track_next: Skip the song. :sound: Decreases volume by 10%. :loud_sound: Increases volume by 10%. :arrow_backward: Seek - 10 sec. :arrow_forward: Seek + 10 sec. :repeat_one: Repeat current song. :repeat: Repeat all songs in the queue.")
            })
        } else if (command == "shuffle" || command == "mix") {
            await message.channel.bulkDelete(1).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "Shuffled!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.shuffle(message);
        } else if (command == "playskip" || command == "ps") {
            await message.channel.bulkDelete(2).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "Searching and Skipping!", args.join(" ")).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.playSkip(message, args.join(" "));
        } else if (command == "autoplay" || command == "ap") {
            await message.channel.bulkDelete(1).catch(err=>{});
            await embedbuilder(client, message, "#c219d8", `Autoplay is now on ${distube.toggleAutoplay(message) ? "ON" : "OFF"}!`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return;
        } else if (command === "ping") {
            await message.channel.bulkDelete(1).catch(err=>{});
            return embedbuilder(client, message, `#c219d8`, `PING:`, `\`${client.ws.ping} ms\``).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } else if (command === "uptime") {
            await message.channel.bulkDelete(1).catch(err=>{});
            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;
            return embedbuilder(client, message, `#c219d8`, `UPTIME:`, `\`${days}d\` \`${hours}h\` \`${minutes}m\` \`${seconds}s\n\``).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } else if (command === "play" || command === "p") {
            await message.channel.bulkDelete(1).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "Searching!", args.join(" ")).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.play(message, args.join(" "));
        } else if (command === "skip" || command === "s") {
            await message.channel.bulkDelete(2).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "SKIPPED!", `Skipped the song`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.skip(message);
        } else if (command === "clr") {
            await message.channel.bulkDelete(70).catch(err=>{})
        } else if (command === "stop" || command === "leave" || command === "dc") {
            await message.channel.bulkDelete(2).catch(err=>{});
            embedbuilder(client, message, "RED", "STOPPED!", `Left the channel`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return distube.stop(message);
        } else if (command === "seek") {
            await message.channel.bulkDelete(1).catch(err=>{});
            await embedbuilder(client, message, "#c219d8", "Seeked!", `seeked the song to \`${args[0]} seconds\``).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            await distube.seek(message, Number(args[0] * 1000));
            return
        } else if (filters.includes(command)) {
            await message.channel.bulkDelete(1).catch(err=>{});
            let filter = await distube.setFilter(message, command);
            await embedbuilder(client, message, "#c219d8", "Adding filter!", filter).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            return
        } else if (command === "volume" || command === "vol") {
            await message.channel.bulkDelete(1).catch(err=>{});
            embedbuilder(client, message, "#c219d8", "VOLUME!", `changed volume to \`${args[0]} %\``).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
            await distube.setVolume(message, args[0]);
            return
        } else if (command === "queue" || command === "q") {
            await message.channel.bulkDelete(1).catch(err=>{});
            let currentPage = 0;
            let queue = distube.getQueue(message);
            if (!queue) return embedbuilder(client, message, "RED", "There is nothing playing!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error));

            const embeds = QueueEmbed(queue.songs);
            const queueEmbed = await message.channel.send(`
        **Current Page - ${currentPage + 1}/${embeds.length}**`,
                embeds[currentPage]);
            try {
                await queueEmbed.react("⬅️");
                await queueEmbed.react("⏹");
                await queueEmbed.react("➡️");
            } catch (error) {
                console.error(error)

            }
            const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
            const collector = queueEmbed.createReactionCollector(filter, {
                time: 60000
            });
            collector.on("collect", async (reaction, user) => {
                try {
                    if (reaction.emoji.name === "➡️") {
                        reaction.users.remove(user).catch(console.error); //removes the reaction
                        if (currentPage < embeds.length - 1) {
                            currentPage++;
                            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                        }
                    } else if (reaction.emoji.name === "⬅️") {
                        reaction.users.remove(user).catch(console.error);
                        if (currentPage !== 0) {
                            --currentPage;
                            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                        }
                    } else {
                        reaction.users.remove(user).catch(console.error);
                        collector.stop();
                        reaction.message.reactions.removeAll();
                    }
                    await reaction.users.remove(message.author.id);
                } catch (error) {
                    console.error(error)

                }
            })
        } else if (command === "loop" || command === "repeat") {
            await message.channel.bulkDelete(1).catch(err=>{});
            if (0 <= Number(args[0]) && Number(args[0]) <= 2) {
                await distube.setRepeatMode(message, parseInt(args[0]));
                await embedbuilder(client, message, "#c219d8", "Repeat mode set to:!", `${args[0].replace("0", "OFF").replace("1", "Repeat song").replace("2", "Repeat Queue")}`).then(msg => msg.delete({
                    timeout: 3000
                }).catch(console.error))
                return
            } else {
                return embedbuilder(client, message, "RED", "ERROR", `Please use a number between **0** and **2**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`).then(msg => msg.delete({
                    timeout: 3000
                }).catch(console.error))
            }
        } else if (command === "jump" || command === "j") {
            await message.channel.bulkDelete(1).catch(err=>{});
            let queue = distube.getQueue(message);
            if (!queue) return embedbuilder(client, message, "RED", "There is nothing playing!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error));

            if (0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length) {
                embedbuilder(client, message, "RED", "ERROR", `Jumped ${parseInt(args[0])} songs!`).then(msg => msg.delete({
                    timeout: 3000
                }).catch(console.error))
                return distube.jump(message, parseInt(args[0]))
                    .catch(err => message.channel.send("Invalid song number."));
            } else {
                return embedbuilder(client, message, "RED", "ERROR", `Please use a number between **0** and **${DisTube.getQueue(message).length}**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`).then(msg => msg.delete({
                    timeout: 3000
                }).catch(console.error))
            }
        } else if (message.content.startsWith(prefix)) {
            await message.channel.bulkDelete(1).catch(err=>{});
            return embedbuilder(client, message, "RED", "Unknown Command", `Type ${prefix}help to see all available commands!`).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        }
    } catch (error) {
        console.error
    }
})

///////////////
////DISTUBE////
///////////////

distube
    .on("playSong", async (message, queue, song) => {
        try {
            playsongyes(message, queue, song);
        } catch (error) {
            console.error
        }
    })

    .on("addSong", (message, queue, song) => {
        try {
            return embedbuilder(client, message, "#c219d8", "Added a Song!", `Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\` \n\nRequested by: ${song.user}\n\nEstimated Time: ${queue.songs.length - 1} song(s) - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\`\nQueue duration: \`${queue.formattedDuration}\``, song.thumbnail).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } catch (error) {
            console.error
        }
    })

    .on("playList", (message, queue, playlist, song) => {
        try {
            playplaylistyes(message, queue, playlist, song);
        } catch (error) {
            console.error
        }
    })

    .on("addList", (message, queue, playlist, song) => {
        try {
            return embedbuilder(client, message, "#c219d8", "Added a Playling!", `Playlist: [\`${playlist.name}\`](${playlist.url})  -  \`${playlist.songs.length} songs\` \n\nRequested by: ${song.user}`, playlist.thumbnail).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } catch (error) {
            console.error
        }
    })

    .on("searchResult", (message, result) => {
        try {
            let i = 0;
            return embedbuilder(client, message, "#c219d8", "", `**Choose an option from below**\n${result.map(song => `**${++i}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`).then(msg => msg.delete({
                timeout: 60000
            }).catch(console.error))
        } catch (error) {
            console.error
        }
    })

    .on("searchCancel", (message) => {
        try {
            message.reactions.removeAll();
            message.react("❌")
        } catch (error) {
            console.error(error)

        }
        try {
            return embedbuilder(client, message, "RED", `Searching canceled`, "").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error)).then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } catch (error) {
            console.error
        }
    })

    .on("error", (message, err) => {
        try {
            message.reactions.removeAll();
            message.react("❌")
        } catch (error) {
            console.error(error)
        }
        console.log(err);
    })

    .on("finish", message => {
        try {
            return embedbuilder(client, message, "RED", "LEFT THE CHANNEL", "There are no more songs left").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } catch (error) {
            console.error
        }
    })

    .on("empty", message => {

        try {
            return embedbuilder(client, message, "RED", "Left the channel cause it got empty!").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } catch (error) {
            console.error
        }
    })

    .on("noRelated", message => {
        try {
            return embedbuilder(client, message, "RED", "Can't find related video to play. Stop playing music.").then(msg => msg.delete({
                timeout: 3000
            }).catch(console.error))
        } catch (error) {
            console.error
        }
    })

    .on("initQueue", queue => {
        try {
            queue.autoplay = false;
            queue.volume = 100;
            queue.filter = filters[5];
        } catch (error) {
            console.error
        }
    });

///////////////
///FUNCTIONS///
///////////////

//function embeds creates embeds

function embedbuilder(client, message, color, title, description, thumbnail) {
    try {
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
                dynamic: true
            }))
            .setFooter(client.user.username, client.user.displayAvatarURL());
        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (thumbnail) embed.setThumbnail(thumbnail)
        return message.channel.send(embed);
    } catch (error) {
        console.error
    }
}

//this function is for playing the song

async function playsongyes(message, queue, song) {
    try {
        await message.channel.bulkDelete(1).catch(err=>{});
        let embed1 = new Discord.MessageEmbed()
            .setColor("#c219d8")
            .setTitle("Playing Song!")
            .setDescription(`Song: [\`${song.name}\`](${song.url})`)
            .addField("💡 Requested by:", `>>> ${song.user}`, true)
            .addField("⏱ Duration:", `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
            .addField("🌀 Queue:", `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
            .addField("🔊 Volume:", `>>> \`${queue.volume} %\``, true)
            .addField("♾ Loop:", `>>> \`${queue.repeatMode ? queue.repeatMode === 2 ? "✅ Queue" : "✅ Song" : "❌"}\``, true)
            .addField("↪️ Autoplay:", `>>> \`${queue.autoplay ? "✅" : "❌"}\``, true)
            .addField("❔ Filter:", `>>> \`${queue.filter || "❌"}\``, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
                dynamic: true
            }))
            .setThumbnail(song.thumbnail)

        var playingMessage = await message.channel.send(embed1)

        try {

            await playingMessage.react("⏸");
            await playingMessage.react("⏯");
            await playingMessage.react("⏹");
            await playingMessage.react("⏭");
            await playingMessage.react("🔉");
            await playingMessage.react("🔊");
            await playingMessage.react("◀️");
            await playingMessage.react("▶️");
            await playingMessage.react("🔂");
            await playingMessage.react("🔁");
        } catch (error) {
            message.reply("Missing permissions, i need to add reactions!")
            console.log(error);
        }

        const filter = (reaction, user) => ["⏸", "⏯", "⏹", "⏭", "🔉", "🔊", "◀️", "▶️", "🔂", "🔁"].includes(reaction.emoji.name) && user.id !== message.client.user.id;
        var collector = playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 700000
        });
        collector.on("collect", async (reaction, user) => {
            if (!queue) return;
            const member = message.guild.member(user);
            if (member.voice.connection && member.voice.connection !== member.guild.me.voice.connection) return;

            switch (reaction.emoji.name) {
                case "⏸":
                    reaction.users.remove(user).catch(console.error);
                    distube.resume(message);
                    embedbuilder(client, message, "#c219d8", "Resumed!", `Resumed the song.`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "⏯":
                    reaction.users.remove(user).catch(console.error);
                    distube.pause(message);
                    embedbuilder(client, message, "#c219d8", "Paused!", `Paused the song.`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "⏹":
                    reaction.users.remove(user).catch(console.error);
                    distube.stop(message);
                    playingMessage.reactions.removeAll().catch(console.error);
                    playingMessage.delete({
                        timeout: client.ws.ping
                    }).catch(console.error);
                    embedbuilder(client, message, "RED", "STOPPED!", `Left the channel`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    break;

                case "⏭":
                    reaction.users.remove(user).catch(console.error);
                    distube.skip(message);
                    await message.channel.bulkDelete(1).catch(err=>{});
                    embedbuilder(client, message, "#c219d8", "SKIPPED!", `Skipped the song`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    playingMessage.reactions.removeAll().catch(console.error);
                    playingMessage.delete({
                        timeout: client.ws.ping
                    }).catch(console.error);
                    break;

                case "🔉":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setVolume(message, Number(queue.volume) - 10);
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "🔊":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setVolume(message, Number(queue.volume) + 10);
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "🔁":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setRepeatMode(message, parseInt(2));
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "🔂":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setRepeatMode(message, parseInt(1));
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "◀️":
                    reaction.users.remove(user).catch(console.error);
                    let seektime = queue.currentTime - 10000;
                    if (seektime < 0) seektime = 0;
                    await distube.seek(message, Number(seektime));
                    playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "▶️":
                    reaction.users.remove(user).catch(console.error);
                    let seektime2 = queue.currentTime + 10000;
                    if (seektime2 >= queue.songs[0].duration * 1000) {
                        seektime2 = queue.songs[0].duration * 1000 - 1;
                    }
                    console.log(seektime2)
                    await distube.seek(message, seektime2);
                    playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        });
        collector.on("end", () => {
            playingMessage.reactions.removeAll().catch(console.error);
            playingMessage.delete({
                timeout: client.ws.ping
            }).catch(console.error);
        })
    } catch (error) {
        console.error
    }
}

//this function is for playlistsong playing like the function above
async function playplaylistyes(message, queue, playlist, song) {
    try {
        var playingMessage = await embedbuilder(client, message, "#c219d8", "Playling playlist", `Playlist: [\`${playlist.name}\`](${playlist.url})  -  \`${playlist.songs.length} songs\` \n\nRequested by: ${song.user}\n\nVolume: \`${queue.volume} %\`\nLoop: \`${queue.repeatMode ? "On" : "Off"}\`\nAutoplay: \`${queue.autoplay ? "On" : "Off"}\`\nFilter: \`${queue.filter || "❌"}\``, playlist.thumbnail)
        try {
            await playingMessage.react("⏸");
            await playingMessage.react("⏯");
            await playingMessage.react("⏹");
            await playingMessage.react("⏭");
            await playingMessage.react("🔉");
            await playingMessage.react("🔊");
            await playingMessage.react("◀️");
            await playingMessage.react("▶️");
            await playingMessage.react("🔂");
            await playingMessage.react("🔁");
        } catch (error) {
            message.reply("Missing permissions, i need to add reactions!")
            console.log(error);
        }

        const filter = (reaction, user) => ["⏸", "⏯", "⏹", "⏭", "🔉", "🔊", "◀️", "▶️", "🔂", "🔁"].includes(reaction.emoji.name) && user.id !== message.client.user.id;
        var collector = playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 700000
        });
        collector.on("collect", async (reaction, user) => {
            if (!queue) return;
            const member = message.guild.member(user);
            if (member.voice.connection && member.voice.connection !== member.guild.me.voice.connection) return;

            switch (reaction.emoji.name) {
                case "⏸":
                    distube.resume(message);
                    embedbuilder(client, message, "#c219d8", "Resumed!", `Resumed the song.`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "⏯":
                    distube.pause(message);
                    embedbuilder(client, message, "#c219d8", "Paused!", `Paused the song.`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "⏹":
                    distube.stop(message);
                    playingMessage.reactions.removeAll().catch(console.error);
                    playingMessage.delete({
                        timeout: client.ws.ping
                    }).catch(console.error);
                    embedbuilder(client, message, "RED", "STOPPED!", `Left the channel`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    break;

                case "⏭":
                    distube.skip(message);
                    await message.channel.bulkDelete(1).catch(err=>{});
                    embedbuilder(client, message, "#c219d8", "SKIPPED!", `Skipped the song`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    playingMessage.reactions.removeAll().catch(console.error);
                    playingMessage.delete({
                        timeout: client.ws.ping
                    }).catch(console.error);
                    break;

                case "🔉":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setVolume(message, Number(queue.volume) - 10);
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "🔊":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setVolume(message, Number(queue.volume) + 10);
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "🔁":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setRepeatMode(message, parseInt(2));
                    embedbuilder(client, message, "#c219d8", "Repeat all songs!", `Repeat all songs present in the queue.`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "🔂":
                    reaction.users.remove(user).catch(console.error);
                    await distube.setRepeatMode(message, parseInt(1));
                    embedbuilder(client, message, "#c219d8", "Repeat this song!", `Repeat only this song.`).then(msg => msg.delete({
                        timeout: 3000
                    }).catch(console.error))
                    await playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "◀️":
                    reaction.users.remove(user).catch(console.error);
                    let seektime = queue.currentTime - 10000;
                    if (seektime < 0) seektime = 0;
                    await distube.seek(message, Number(seektime));
                    playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                case "▶️":
                    reaction.users.remove(user).catch(console.error);
                    let seektime2 = queue.currentTime + 10000;
                    if (seektime2 >= queue.songs[0].duration * 1000) {
                        seektime2 = queue.songs[0].duration * 1000 - 1;
                    }
                    console.log(seektime2)
                    await distube.seek(message, seektime2);
                    playingMessage.edit(curembed(message)).catch(console.error);
                    break;

                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        });
        collector.on("end", () => {
            playingMessage.reactions.removeAll().catch(console.error);
            playingMessage.delete({
                timeout: client.ws.ping
            }).catch(console.error);
        })
    } catch (error) {
        console.error
    }
}

//this function is for embed editing for the music info msg
function curembed(message) {
    try {
        let queue = distube.getQueue(message); //get the current queue
        let song = queue.songs[0];
        embed = new Discord.MessageEmbed()
            .setColor("#c219d8")
            .setTitle("Playing Song!")
            .setDescription(`Song: [\`${song.name}\`](${song.url})`)
            .addField("💡 Requested by:", `>>> ${song.user}`, true)
            .addField("⏱ Duration:", `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
            .addField("🌀 Queue:", `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
            .addField("🔊 Volume:", `>>> \`${queue.volume} %\``, true)
            .addField("♾ Loop:", `>>> \`${queue.repeatMode ? queue.repeatMode === 2 ? "✅ Queue" : "✅ Song" : "❌"}\``, true)
            .addField("↪️ Autoplay:", `>>> \`${queue.autoplay ? "✅" : "❌"}\``, true)
            .addField("❔ Filter:", `>>> \`${queue.filter || "❌"}\``, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
                dynamic: true
            }))
            .setThumbnail(song.thumbnail)
        return embed; //sending the new embed back
    } catch (error) {
        console.error
    }
}

//this function is for current Queue................for queue command
function QueueEmbed(queue) {
    try {
        let embeds = [];
        let k = 10;
        //defining each Pages
        for (let i = 0; i < queue.length; i += 10) {
            const current = queue.slice(i, k)
            let j = i;
            k += 10;
            const info = current.map((track) => `**${++j} -** [\`${track.name}\`](${track.url})`).join("\n")
            const embed = new Discord.MessageEmbed()
                .setTitle("Server Queue")
                .setColor("#c219d8")
                .setDescription(`**Current Song - [\`${queue[0].name}\`](${queue[0].url})**\n\n${info}`)
                .setFooter(client.user.username, client.user.displayAvatarURL())
            embeds.push(embed);
        }
        //returning the Embed
        return embeds;
    } catch (error) {
        console.error
    }

}

/////////////
///GENERAL///
/////////////

//this function is for delaying stuff if needed

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

//this function is for getting a random number

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
