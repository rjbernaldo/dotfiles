// Note to read the console log, you need to open the background page from the chrome://extensions page.
let buildfilename = "buildComplete.txt"
let watchChangesLogCount = 0;
let manualRestartCount = 0;
let isRunningTimestamp = new Date();
let building = false;

const filesInDirectory = dir => new Promise(resolve =>

    dir.createReader ().readEntries (entries =>

        Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>

            e.isDirectory
                ? filesInDirectory(e)
                : new Promise(resolve => e.file(resolve))
        ))
            .then(files => [].concat(...files))
            .then(resolve)

    )
)

const timestampForFilesInDirectory = dir =>
        filesInDirectory (dir).then (files =>
            files.map (f => f.name + f.lastModifiedDate).join ())

const reload = () => {

    chrome.tabs.query({ }, tabs => {

        try {
            isRunningTimestamp = new Date();
            console.log('hot-reload: Attempting to reload ' + tabs.length + ' tabs.');

            for (ndx = 0; ndx <= tabs.length; ndx++) {

                if (tabs[ndx]) {
                    var url = tabs[ndx].url;
                    console.log('hot-reload: Attempting to reload tab with url: ' + url);
                    if (url.indexOf('youtube.com') !== -1) {
                        chrome.tabs.reload(tabs[ndx].id)
                        console.log('hot-reload: Reload completed successfully.');
                    } else {
                        console.log('hot-reload: Reload skipped, not a youtube url.');
                    }
                }
                isRunningTimestamp = new Date();
            }

            chrome.runtime.reload();
            buildling = false;
            isRunningTimestamp = new Date();
        } catch (e) {
            building = false;
            console.log('hot-reload: reload Error - ' + JSON.stringify(e));
        }

    })
}

const watchChanges = (dir, lastTimestamp) => {

    timestampForFilesInDirectory (dir).then (timestamp => {

        try {
            isRunningTimestamp = new Date();
            if (!lastTimestamp || (lastTimestamp === timestamp)) {

                watchChangesLogCount = watchChangesLogCount + 1;
                if (watchChangesLogCount > 10) {
                    console.log('hot-reload: No changes detected in extension directory.');
                    watchChangesLogCount = 0;
                }

                setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
                isRunningTimestamp = new Date();

            } else {
                if (building == true)
                    return;

                building = true;
                console.log('hot-reload: Detected change, waiting for build complete.');
                setTimeout(() => checkForBuildComplete(), 2000) // retry after 1s
                isRunningTimestamp = new Date();
            }
        } catch (e) {
            building = false;
            console.log('hot-reload: watchChanges Error - ' + JSON.stringify(e));
        }

    })
}

const checkForBuildComplete = () => {
    chrome.runtime.getPackageDirectoryEntry(function (storageRootEntry) {

        try {
            
            fileExists(storageRootEntry, buildfilename, function (isExist) {
                if (isExist) {
                        console.log('hot-reload: Detected file: ' + buildfilename + ' reloading.');
                        reload(); // reload immediately before another build can be started
                        isRunningTimestamp = new Date();
                }
                else {
                    console.log('hot-reload: Did not detecte file: ' + buildfilename + ' waiting 1s then trying again.');
                    setTimeout(() => checkForBuildComplete(), 1000);
                    isRunningTimestamp = new Date();
                }
            });
        } catch (e) {
            console.log('hot-reload: checkForBuildComplete Error - ' + JSON.stringify(e));
        }

    });
}

function fileExists(storageRootEntry, fileName, callback) {
    storageRootEntry.getFile(fileName, {
        create: false
    }, function () {
        callback(true);
    }, function () {
        callback(false);
    });
}

chrome.management.getSelf (self => {

    try {
        console.log('hot-reload: hot-reload is loaded.');
        if (self.installType === 'development') {

            chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));

            // In case process gets stopped, start it again.
            setInterval(function () {
            
                var currentDate = new Date();
                var secondsSinceLastRun = currentDate.getTime() - isRunningTimestamp.getTime();
                if (Math.abs(secondsSinceLastRun) > 5000) {

                    console.log('hot-reload: Had to manually restart hot-reload process.');

                    // If nothing has happened in 5 seconds, restart the process.
                    chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
                    //reload();
                } else {
                    manualRestartCount = manualRestartCount + 1;
                    if (manualRestartCount > 10) {
                        console.log('hot-reload: Process running, no need to manually restart.');
                        manualRestartCount = 0;
                    }
                }

            }, 1000)
        }
    } catch (e) {
        console.log('hot-reload: getSelf Error - ' + JSON.stringify(e));
    }
})
