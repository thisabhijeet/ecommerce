import { buffer } from "micro";
import firebase from "firebase";
import db from "../../../firebase";

// firebase backend connection
// const serviceAccount = require("../../../permissions.json");
// const app = !admin.apps.length
//   ? admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     })
//   : admin.app();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  console.log("fulfilling order");
  // const user = doc(db, "users", session.metadata.email, "orders", session.id);
  const user = db
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id);
  user
    .set(
      {
        amount: session.amount_total / 100,
        amount_shipping: session.total_details.amount_shipping / 100,
        images: JSON.parse(session.metadata.images),
        timestamp: firebase.firestore.Timestamp.now().toDate().toString(),
      },
      { merge: true }
    )
    .then(() => {
      console.log(`order with ${session.id} added to DB`);
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  // console.log("yes");
  // return db
  //   .collection("users")
  //   .doc(session.metadata.email)
  //   .collection("orders")
  //   .doc(session.id)
  //   .set({
  //     amount: session.amount_total / 100,
  //     amount_shipping: session.total_details.amount_shipping / 100,
  //     images: JSON.parse(session.metadata.images),
  //     timestamp: admin.firestore.FieldValue.serverTimestamp(),
  //   })
  //   .then(() => {
  //     console.log(`order with ${session.id} added to DB`);
  //   });
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];
    let event;

    //verify that event cae from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log("ERROR", err.message);
      return res.status(400).send(`Webhook error ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      //fulfill order
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook error ${err.message}`));
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
