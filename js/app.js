var App = React.createClass({
  getInitialState: function() {
    // For now, routes are in format ?page or ?page=args
    var match, param, val;
    [match, param, val] = window.location.search.match(/\??([^=]*)(?:=(.*))?/);

    if (['settings', 'help', 'start', 'watch', 'report', 'files', 'publish'].indexOf(param) != -1) {
      var viewingPage = param;
    } else {
      var viewingPage = 'home';
    }

    return {
      viewingPage: viewingPage,
      pageArgs: val,
    };
  },
  componentWillMount: function() {
    lbry.checkNewVersionAvailable(function(isAvailable) {
      if (isAvailable) {
        var message = "The version of LBRY you're using is not up to date.\n\n" +
                      "You'll now be taken to lbry.io, where you can download the latest version.";

        lbry.getVersionInfo(function(versionInfo) {
          var maj, min, patch;
          [maj, min, patch] = versionInfo.lbrynet_version.split('.');

          if (versionInfo.os_system == 'Darwin' && maj == 0 && min <= 2 && patch <= 2) {
            // On OS X with version <= 0.2.2, we need to notify user to close manually close LBRY
            message += "\n\nBefore installing the new version, make sure to exit LBRY, if you started the app " +
                        "click that LBRY icon in your status bar and choose \"Quit.\"";
          } else {
            lbry.stop();
          }

          alert(message);
          window.location = "http://www.lbry.io/" + (versionInfo.os_system == 'Darwin' ? 'osx' : 'linux');
        });
      }
    });
  },
  render: function() {
    if (this.state.viewingPage == 'home') {
      return <HomePage />;
    } else if (this.state.viewingPage == 'settings') {
      return <SettingsPage />;
    } else if (this.state.viewingPage == 'help') {
      return <HelpPage />;
    } else if (this.state.viewingPage == 'watch') {
      return <WatchPage name={this.state.pageArgs}/>;
    } else if (this.state.viewingPage == 'report') {
      return <ReportPage />;
    } else if (this.state.viewingPage == 'files') {
      return <MyFilesPage />;
    } else if (this.state.viewingPage == 'start') {
      return <StartPage />;
    } else if (this.state.viewingPage == 'publish') {
      return <PublishPage />;
    }
  }
});