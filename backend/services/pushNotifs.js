require("dotenv").config({
    path:__dirname+"./../.env"
});
const webpush = require("web-push");

webpush.setVapidDetails(
  process.env.email,
  process.env.public_key,
  process.env.private_key
);



const sendPush = async(subscription, payload) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (err) {
    console.error("Push failed", err);
  }
}
module.exports = {sendPush}
