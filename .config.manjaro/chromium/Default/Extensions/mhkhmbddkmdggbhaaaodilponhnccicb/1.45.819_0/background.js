//-firefox background events
if (typeof browser !== "undefined") {

    //console.log('FIREFOX Background');
    browser.runtime.onMessage.addListener((messageRequest, sender, callback) => {
        if (sender.id === browser.runtime.id) {
            return tubeBuddyMessageReceived(messageRequest, callback);
        }
    });
}
//-firefox background events end

//-chrome background events
else if (typeof chrome !== "undefined") {

    //console.log('CHROME Background');
    chrome.runtime.onMessage.addListener(function (messageRequest, sender, callback) {
        if (sender.id === chrome.runtime.id) {
            return tubeBuddyMessageReceived(messageRequest, callback);
        }
    });
}
//-chrome background events end

//receive a message from content scripts
function tubeBuddyMessageReceived(messageRequest, callback) {

    //return true so the extension knows it's an async call
    var isAsyn = true;

    switch (messageRequest.type) {
        //record url for corb url check
        case "tb-corb-record": {

            isAsyn = false;
            break;
        }
        //ajax requests
        case "tb-xhr": {

            try {
                //check url against whitelist
                let isUrlValid = urlValidation(messageRequest.data.ajaxOptions.url);

                //if valid execute log
                if (isUrlValid === false) {

                    console.log('invalid url \n' + messageRequest.data.ajaxOptions.url);

                    //record so we can create the white list
                    recordRequest(messageRequest, messageRequest.host);
                }

                FetchUtilities.MakeFetchRequest(messageRequest, callback);
            }
            catch (ex) {
                console.log('tb-xhr exception', ex);
                callback({
                    success: false,
                    response: '',
                    error: ex
                });
            }
        }
    }

    return isAsyn;
}

function recordRequest(messageRequest, host) {
    try {
        if (host) {

            let version = '';
            if (typeof chrome !== "undefined") {
                let manifest = chrome.runtime.getManifest();
                version = manifest.version;
            }
            else if (typeof browser !== "undefined") {
                let manifest = browser.runtime.getManifest();
                version = manifest.version;
            }
          
            let urlData = { 'Url': messageRequest.data.ajaxOptions.url, 'Version': version};
            fetch(host + '/api/debug/addurlrecord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(urlData)
            })
                .catch(function () {
                    console.log('Error recording url: \n');
                });
        }
    }
    catch (ex) {
        console.log('Error recording url: \n ' + messageRequest.data.ajaxOptions.url, ex);
    }
}


//urls that are valid for the extension to call
var validUrls = ["https://www.tubebuddy.com/api/abtests/addctrdata", "https://www.tubebuddy.com/api/abtests/getvideostogather", "https://www.tubebuddy.com/api/activitylog/add", "https://www.tubebuddy.com/api/branding/add", "https://www.tubebuddy.com/api/branding/addbackgroundimage", "https://www.tubebuddy.com/api/branding/addstillframeimage", "https://www.tubebuddy.com/api/branding/delete", "https://www.tubebuddy.com/api/branding/deletebackgroundimage", "https://www.tubebuddy.com/api/branding/fontadd", "https://www.tubebuddy.com/api/branding/getall", "https://www.tubebuddy.com/api/branding/getallfonts", "https://www.tubebuddy.com/api/branding/getbackgroundimages", "https://www.tubebuddy.com/api/campaign/getbyyoutubechannelid", "https://www.tubebuddy.com/api/channelaction/add", "https://www.tubebuddy.com/api/clienterror/add", "https://www.tubebuddy.com/api/comments/getreadcomments", "https://www.tubebuddy.com/api/comments/markasread", "https://www.tubebuddy.com/api/comments/markasunread", "https://www.tubebuddy.com/api/contacthistory/getrecentforchannels", "https://www.tubebuddy.com/api/data/getchannelcompetitorstatistics", "https://www.tubebuddy.com/api/data/getchannellanguagestatistics", "https://www.tubebuddy.com/api/grammer/getkeywordmisspellings", "https://www.tubebuddy.com/api/highlights/gethighlights", "https://www.tubebuddy.com/api/image/getbytes", "https://www.tubebuddy.com/api/launchpad/checklisttemplateitemsexist", "https://www.tubebuddy.com/api/launchpad/createchecklist/", "https://www.tubebuddy.com/api/launchpad/getbestpractices", "https://www.tubebuddy.com/api/launchpad/getvideosummary", "https://www.tubebuddy.com/api/launchpad/importchecklisttemplateitemdefaults", "https://www.tubebuddy.com/api/launchpad/togglebestpractices", "https://www.tubebuddy.com/api/launchpad/updateitemstatus", "https://www.tubebuddy.com/api/magiclinks/getrecent", "https://www.tubebuddy.com/api/playlists/updateplaylist", "https://www.tubebuddy.com/api/scheduledmetaupdates/createscheduledmetaupdate", "https://www.tubebuddy.com/api/scheduledmetaupdates/getscheduledmetaupdatesbyvideo", "https://www.tubebuddy.com/api/searchrank/addrankings", "https://www.tubebuddy.com/api/searchrank/gethistory", "https://www.tubebuddy.com/api/searchrank/getmostrecentbeforetoday", "https://www.tubebuddy.com/api/searchrank/gettagrankingsfortoday", "https://www.tubebuddy.com/api/searchterm/addsearchterm", "https://www.tubebuddy.com/api/searchterm/getforvideo", "https://www.tubebuddy.com/api/searchterm/removesearchterm", "https://www.tubebuddy.com/api/searchtermanalysis/toggle", "https://www.tubebuddy.com/api/seoscore/addseoscore", "https://www.tubebuddy.com/api/seoscore/getlatestkeyword", "https://www.tubebuddy.com/api/seoscore/getseoscores", "https://www.tubebuddy.com/api/sharedvideo/add", "https://www.tubebuddy.com/api/sharedvideo/gethistory", "https://www.tubebuddy.com/api/sharedvideo/remove", "https://www.tubebuddy.com/api/socialaccounts/getfacebook", "https://www.tubebuddy.com/api/taglists/addlist", "https://www.tubebuddy.com/api/taglists/addlistwithtags", "https://www.tubebuddy.com/api/taglists/addtag", "https://www.tubebuddy.com/api/taglists/addtags", "https://www.tubebuddy.com/api/taglists/deletelist", "https://www.tubebuddy.com/api/taglists/getlists", "https://www.tubebuddy.com/api/taglists/getlisttags", "https://www.tubebuddy.com/api/taglists/removetags", "https://www.tubebuddy.com/api/tagscore/get", "https://www.tubebuddy.com/api/tagscore/getstored", "https://www.tubebuddy.com/api/thumbnail/add", "https://www.tubebuddy.com/api/thumbnail/addoverlay", "https://www.tubebuddy.com/api/thumbnail/addtemplate", "https://www.tubebuddy.com/api/thumbnail/deletetemplate", "https://www.tubebuddy.com/api/thumbnail/gettemplate", "https://www.tubebuddy.com/api/thumbnail/gettemplatelist", "https://www.tubebuddy.com/api/thumbnail/gettemplates", "https://www.tubebuddy.com/api/thumbnail/removeoverlay", "https://www.tubebuddy.com/api/thumbnail/uploadbulkoverlayimage", "https://www.tubebuddy.com/api/topics/addvideotopic", "https://www.tubebuddy.com/api/topics/addvideotopics", "https://www.tubebuddy.com/api/topics/deletevideotopic", "https://www.tubebuddy.com/api/topics/getaudiencesuggestedtopics", "https://www.tubebuddy.com/api/topics/getcommentaudiencesuggestedtopic", "https://www.tubebuddy.com/api/topics/getvideotopics", "https://www.tubebuddy.com/api/topics/togglecommentaudiencesuggestedtopic", "https://www.tubebuddy.com/api/topics/updatevideotopic", "https://www.tubebuddy.com/api/topics/updatevideotopicsorder", "https://www.tubebuddy.com/api/translate/gettranslation", "https://www.tubebuddy.com/api/translate/translatevideometadata", "https://www.tubebuddy.com/api/twitter/post", "https://www.tubebuddy.com/api/uploaddefaults/add", "https://www.tubebuddy.com/api/uploaddefaults/delete", "https://www.tubebuddy.com/api/uploaddefaults/list", "https://www.tubebuddy.com/api/uploaddefaults/update", "https://www.tubebuddy.com/api/user/updatebrowsermeta", "https://www.tubebuddy.com/api/videolytics/getvideotocompare", "https://www.tubebuddy.com/api/videolytics/toggle", "https://www.tubebuddy.com/api/youtubeapi/getchannel", "https://www.tubebuddy.com/api/youtubeapi/getchannelplaylists", "https://www.tubebuddy.com/api/youtubeapi/getchanneltrafficsearchterms", "https://www.tubebuddy.com/api/youtubeapi/getchanneluploadplaylist", "https://www.tubebuddy.com/api/youtubeapi/getchannelvideosearch", "https://www.tubebuddy.com/api/youtubeapi/getcommentsonvideo", "https://www.tubebuddy.com/api/youtubeapi/getcurrentchannel", "https://www.tubebuddy.com/api/youtubeapi/getpageofvideos", "https://www.tubebuddy.com/api/youtubeapi/getrecentvideos", "https://www.tubebuddy.com/api/youtubeapi/getrelatedvideos", "https://www.tubebuddy.com/api/youtubeapi/getvideo", "https://www.tubebuddy.com/api/youtubeapi/getvideotrafficsearchterms", "https://www.tubebuddy.com/api/youtubeapi/postcommentreply", "https://www.tubebuddy.com/api/youtubechannel/getchannelsubscribers", "https://www.tubebuddy.com/api/youtubechannel/getmilestones", "https://www.tubebuddy.com/api/youtubechannel/getprofile", "https://www.tubebuddy.com/api/youtubechannel/kickoffexport", "https://www.tubebuddy.com/api/youtubechannel/markasnotsubscribedtotubebuddy", "https://www.tubebuddy.com/api/youtubechannel/markassubscribedtotubebuddy", "https://www.tubebuddy.com/api/youtubechannel/processstring", "https://www.tubebuddy.com/api/youtubechannel/togglechannelytics", "https://www.tubebuddy.com/api/youtubevideos/addyoutubevideoscheduledaction", "https://www.tubebuddy.com/api/youtubevideos/deleteyoutubevideoscheduledaction", "https://www.tubebuddy.com/api/youtubevideos/getfacebookthumbnail", "https://www.tubebuddy.com/api/youtubevideos/getlatestcopytofacebook", "https://www.tubebuddy.com/api/youtubevideos/getusernotes/", "https://www.tubebuddy.com/api/youtubevideos/getvideo", "https://www.tubebuddy.com/api/youtubevideos/getvideocardtemplates", "https://www.tubebuddy.com/api/youtubevideos/getvideoendscreentemplates", "https://www.tubebuddy.com/api/youtubevideos/getvideostatus", "https://www.tubebuddy.com/api/youtubevideos/getyoutubevideoscheduledaction", "https://www.tubebuddy.com/api/youtubevideos/getyoutubevideoscheduledactionsinfuture", "https://www.tubebuddy.com/api/youtubevideos/gradetags", "https://www.tubebuddy.com/api/youtubevideos/publishtofacebook", "https://www.tubebuddy.com/api/youtubevideos/saveusernotes", "https://www.tubebuddy.com/api/youtubevideos/togglecardtemplate", "https://www.tubebuddy.com/api/youtubevideos/toggleendscreentemplate", "https://www.tubebuddy.com/api/youtubevideos/updatevideometadata", "chrome-extension://", "https://clients1.google.com/complete/search", "https://graph-video.facebook.com/v2.9/", "https://studio.youtube.com/channel/", "https://studio.youtube.com/video/<id>", "https://studio.youtube.com/youtubei/v1/analytics_data/join", "https://studio.youtube.com/youtubei/v1/creator/get_creator_videos", "https://studio.youtube.com/youtubei/v1/creator/list_creator_videos", "https://trends.google.com/trends/api/widgetdata/comparedgeo", "https://trends.google.com/trends/api/widgetdata/multiline", "https://trends.google.com/trends/api/widgetdata/relatedsearches", "https://trends.google.com/trends/embed/explore/geo_map", "https://trends.google.com/trends/embed/explore/related_queries", "https://trends.google.com/trends/embed/explore/timeseries", "https://trends.google.com/trends/hottrends/atom/feed", "https://trends.google.com/trends/trendingsearches/daily/rss", "https://twitter.com/i/search/timeline", "https://twitter.com/search", "https://www.facebook.com/v2.7/plugins/like.php", "https://www.facebook.com/v2.9/plugins/like.php", "https://www.reddit.com/search.json", "https://www.youtube.com/", "https://www.youtube.com/account", "https://www.youtube.com/account_advanced", "https://www.youtube.com/account_billing", "https://www.youtube.com/account_notifications", "https://www.youtube.com/account_playback", "https://www.youtube.com/account_privacy", "https://www.youtube.com/account_sharing", "https://www.youtube.com/addto_ajax", "https://www.youtube.com/annotations_auth/read2", "https://www.youtube.com/annotations_invideo", "https://www.youtube.com/c/<id>", "https://www.youtube.com/cards_ajax", "https://www.youtube.com/channel/", "https://www.youtube.com/channel/<id>/about", "https://www.youtube.com/comment_service_ajax", "https://www.youtube.com/comments", "https://www.youtube.com/dashboard", "https://www.youtube.com/edit", "https://www.youtube.com/endscreen_ajax", "https://www.youtube.com/features", "https://www.youtube.com/get_endscreen", "https://www.youtube.com/get_video_info", "https://www.youtube.com/metadata_ajax", "https://www.youtube.com/my_thumbnail_post", "https://www.youtube.com/my_videos", "https://www.youtube.com/paid_memberships", "https://www.youtube.com/playlist", "https://www.youtube.com/results", "https://www.youtube.com/subscription_ajax", "https://www.youtube.com/timedtext_video", "https://www.youtube.com/user/", "https://www.youtube.com/view_all_playlists", "https://www.youtube.com/watch", "https://www.youtube.com/watch_fragments_ajax", "moz-extension://"];
Object.freeze(validUrls);

//urls that need special conditions
var specialUrls = ["moz-extension://", "chrome-extension://", "https://studio.youtube.com/channel/", "https://www.youtube.com/user/", "https://www.youtube.com/channel/",
    "/about", "https://graph-video.facebook.com/v2.9/", "https://graph-video.facebook.com/v2.7/", "https://www.tubebuddy.com/api/launchpad/createchecklist/", "https://www.youtube.com/c/", "https://studio.youtube.com/video/"];
Object.freeze(specialUrls);

function urlValidation(url) {

    var isValid = false;
    try {

        //find base url
        var oUrl = new URL(url);
        var baseUrl = oUrl.protocol.toLowerCase() + '//' + oUrl.host.toLowerCase() + oUrl.pathname.toLowerCase();

        //check list of urls we need to treat differently
        var specialCaseUrl = "";
        var i;
        for (i = 0; i < specialUrls.length; i++) {
            let item = specialUrls[i].toLowerCase();
            if (baseUrl.indexOf(item) !== -1) {
                specialCaseUrl = item;
                break;
            }
        }

        if (specialCaseUrl !== "") {
            //special case for urls with ids in them, allow
            switch (specialCaseUrl) {
                case "https://www.youtube.com/channel/":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://www.youtube.com/channel/";
                        break;
                    }
                case "https://studio.youtube.com/channel/":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://studio.youtube.com/channel/";
                        break;
                    }
                case "https://www.youtube.com/user/":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://www.youtube.com/user/";
                        break;
                    }
                case "/about":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://www.youtube.com/channel/<id>/about";
                        break;
                    }
                case "https://graph-video.facebook.com/v2.9/":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://graph-video.facebook.com/v2.9/";
                        break;
                    }
                case "https://www.tubebuddy.com/api/launchpad/createchecklist/":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://www.tubebuddy.com/api/launchpad/createchecklist/";
                        break;
                    }
                case "https://www.youtube.com/c/":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://www.youtube.com/c/<id>";
                        break;
                    }
                case "https://studio.youtube.com/video/":
                    {
                        specialCaseUrl = "";
                        baseUrl = "https://studio.youtube.com/video/<id>";
                        break;
                    }
                case "chrome-extension://":
                    {
                        specialCaseUrl = "";
                        baseUrl = "chrome-extension://";
                        break;
                    }
                case "moz-extension://":
                    {
                        specialCaseUrl = "";
                        baseUrl = "moz-extension://";
                        break;
                    }
            }
        }

        //check for valid urls
        var index = validUrls.findIndex(item => baseUrl === item.toLowerCase());
        if (index !== -1) {
            isValid = true;
        }
    }
    catch (ex) {
        console.log(ex);
    }

    return isValid;
}


