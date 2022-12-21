 const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    });
    if (command == "!play") {
        let evaluar;
        const regexp = new RegExp(/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/g);
        if (regexp.test(msg)) {
            evaluar = msg;
        } else {
            const sr = await spotify.search({ type: 'track', query: msg });
            const sr2 = sr.tracks.items.shift();
            evaluar = sr2.external_urls.spotify
        }
        console.log(evaluar);
        const voiceChannel = message.member.voice.channel;
       
        
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        })
        const { VoiceConnectionStatus } = require("@discordjs/voice");
    
    
        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log("Todo listo para reproducir música.")
        });
        
        const songInfo = await getPreview(evaluar);
        const songName = songInfo.title;
      



        const search = await play.search(songInfo.title, { limit: 1 });
        const stream = await play.stream(search[0].url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });
        
        player.play(resource);

        connection.subscribe(player);
        
        
        

        


        const embedPlay = new EmbedBuilder()
            .setTitle(`Reproduciendo ${songName}`)
            .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL() })
            .setThumbnail(songInfo.image)
            .setColor("#883d3a")

        message.channel.send({ embeds: [embedPlay] })
    }

    if(command == "!pause"){
        
        player.pause();
        message.channel.send("Reproductor Pausado.")
    }
