const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
const cors = require('cors');
admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

exports.addUser = functions.https.onRequest((request, response) => {
  return cors()(request, response, () => {
    var body = request.body;
    let keysRef = db.collection('oauth_codes').doc(body.name)
    let setUser = keysRef.set({
      login: body.login,
      name: body.name,
      code: body.code
    }).then(function () {
      response.json({ 'ADD ITEM': JSON.stringify(body), "status": "OK" });
      return true;
    });
  });
});


exports.getLinkHubSpot = functions.https.onRequest((request, response) => {
  return cors()(request, response, () => {
    let keysRef = db.collection('config_keys').doc('hubspot')
    let myHubspot = keysRef.get()
      .then(doc => {
        if (!doc || !doc.exists) {
          throw new Error("Key doesn't exist")
        }

        var hubspot = doc.data();
        var url = hubspot.url + "?";
        url += "client_id=" + hubspot.client_id + "&";
        url += "scope=" + hubspot.scope + "&";
        url += "redirect_uri=" + hubspot.redirect_uri;
        response.json({ 'url': url });
        return hubspot;

      })
      .catch(error => {
        console.log('error', error);
        response.send("Error:" + error);
      })

  })
});