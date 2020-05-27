
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.sendNotification = functions.database.ref('/notifications/{notificationId}').onWrite((change, context) => {
    const notificationId = context.params.notificationId;
    if (!change.after.exists()) {
        console.log('A notification has been deleted from the database:', notificationId);
        return null;
    }

    function cleanInvalidTokens(tokensWithKey, results) {

        const invalidTokens = [];

        results.forEach((result, i) => {
            if (!result.error) return;

            console.error('Failure sending notification to', tokensWithKey[i].token, result.error);

            switch (result.error.code) {
                case "messaging/invalid-registration-token":
                case "messaging/registration-token-not-registered":
                    invalidTokens.push(admin.database().ref('/tokens').child(tokensWithKey[i].key).remove());
                    break;
                default:
                    break;
            }
        });

        return Promise.all(invalidTokens);
    }

    admin.database().ref(`/notifications/${notificationId}`).once('value').then((snapshot) => {
        let data = snapshot.val();
        let payload = {
            notification: {
                title: `New message from ${data.user}`,
                body: data.message,
                icon: data.image,
                click_action: data.link
            }
        }
        return admin.database().ref('/tokens').once('value').then((data) => {

            if (!data.val()) return;

            const snapshot = data.val();
            const tokensWithKey = [];
            const tokens = [];

            for (let key in snapshot) {
                tokens.push(snapshot[key].token);
                tokensWithKey.push({
                    token: snapshot[key].token,
                    key: key
                });
            }

            return admin.messaging().sendToDevice(tokens, payload)
                .then((response) => cleanInvalidTokens(tokensWithKey, response.results))
                .then(() => admin.database().ref('/notifications').child(notificationId).remove())
        });
    })

})