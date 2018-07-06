const fs = require('fs'),
	parseString = require('xml2js').parseString,
	xml2js = require('xml2js');

module.exports.editPlayList = (filename, starttime, stoptime) => {
    const fileNameWithExtension = filename+".xspf";
    const copyFile = filename+"-edited.xspf";

    fs.readFile(fileNameWithExtension, 'utf-8', function (err, data) {
        if (err) console.log(err);
        parseString(data, function (err, json) {
            if (err) console.log(err);
            json.playlist.trackList[0].track.forEach(function (track, index) {
                let startStopOptions = [];
                startStopOptions["start-time"] = "start-time="+starttime;
                startStopOptions["stop-time"] = "stop-time="+(track.duration[0] - stoptime*1000)/1000;
                json.playlist.trackList[0].track[index].extension[0]["vlc:option"] = startStopOptions;
            });
    
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(json);
    
            fs.writeFile(copyFile, xml, function (err, data) {
                if (err) console.log(err);
                console.log("successfully written our update xml to file");
            })
        });
    });
}