var googleAuthor = {

  auth2: null, // The Sign-In object.
  googleUser: null, // The current user.
  googleUserName: null, // The name of the current user
  authSuccess: null, //; A callback.  Set this to a function(token) to get notified of login

  appStart: function () {
    gapi.load('auth2', googleAuthor.initSigninV2);
  },
  initSigninV2: function () {
    googleAuthor.auth2 = gapi.auth2.init({
      client_id: '1029780837049-00a0kk6usg29br5ibv67bgoh9rs9mg42.apps.googleusercontent.com',
      scope: 'profile'
    });
    googleAuthor.auth2.attachClickHandler(document.getElementById('signInButton'));
    googleAuthor.auth2.currentUser.listen(googleAuthor.userChanged);
    // Sign in the user if they are currently signed in.
    if (googleAuthor.auth2.isSignedIn.get() == true) {
      console.log("Already signed in");
      googleAuthor.auth2.signIn();
      $('body').addClass('signedIn');
      $('body').removeClass('unchecked');
      $('body').removeClass('anon');
    }
  },

  userChanged: function (user) {
    console.log('User now: ', user);
    googleAuthor.googleUser = user;
    googleProfile = googleAuthor.googleUser.getBasicProfile();
    if (googleProfile) {
      googleAuthor.googleUserName = googleProfile.getName();
      console.log(`Signed in as ${googleAuthor.googleUserName}`);
      document.getElementById('signOutButton').classList.add("loggedin")
      document.getElementById('signOutLabel').innerText = googleProfile.getName();
      document.getElementById('signOutPic').src = googleProfile.getImageUrl();
      $('body').addClass('signedIn');
      $('body').removeClass('anon');
      $('body').removeClass('unchecked');
      let token = user.getAuthResponse().id_token;
      if (typeof googleAuthor.authSuccess !== 'undefined') googleAuthor.authSuccess(token);
    } else {
      googleAuthor.googleUser = null;
      googleAuthor.googleUserName = "";
      console.log("Not currently signed in");
      $('body').addClass('anon');
      $('body').removeClass('unchecked');
      $('body').removeClass('signedIn');
    }
  },

  signOutUser: function () {
    console.log("Signing out...")
    googleAuthor.auth2.signOut().then(() => {
      googleAuthor.googleUser = null;
      googleAuthor.googleUserName = "";
      $('body').addClass('anon');
      $('body').removeClass('unchecked');
      $('body').removeClass('signedIn');
      console.log("Signed out");
      location.reload();
    });
  },
}