const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
const serviceAccount = require("./key/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-zikken.firebaseio.com"
});

const db = admin.firestore();

exports.setCount = functions.https.onRequest(async (req, res) => {
  res.send('count一括設定のバッチ処理');

  let batch = db.batch();

  const snapshots = await db.collection('logs').get();

  snapshots.docs.map((doc, index) => {
    if ((index + 1) % 500 === 0) {
      batch.commit();
      batch = db.batch();
    }

    batch.set(doc.ref, { count: 1 }, { merge: true });
  });
  batch.commit();
});

exports.logsDelete = functions.https.onRequest(async (req, res) => {
  res.send('古いDBを削除');
  
  const admin = require("firebase-admin");
  const db = admin.firestore();

  let dt = new Date();
  dt.setMonth(dt.getMonth()-1);
  try {
    const query = await db.collection("logs").where("createdAt", "<", dt).get();
    query.docs.forEach(async doc => {
      await doc.ref.delete();
    });
  } catch (error) {
    console.error(error);
  };
});