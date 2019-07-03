var request = require('request');

const OracleBot = require('@oracle/bots-node-sdk');
var bodyParser = require('body-parser')
const crypto = require('crypto');
const sharedSecret = "ya3Rl5V0RaHVNhJFmmZJKJZfssUGKG0oqa+sLlyN+rI="; // e.g. "+ZaRRMC8+mpnfGaGsBOmkIFt98bttL5YQRq3p2tXgcE="
const bufSecret = Buffer(sharedSecret, "base64");
const MSTEAMS_URL ="https://47064c43.ngrok.io/bot/sendmessage";

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser

const { WebhookClient, WebhookEvent } = OracleBot.Middleware;

module.exports = (app) => {
  const logger = console;
  // initialize the application with OracleBot
  OracleBot.init(app, {
    logger,
  });

  // add webhook integration
  const webhook = new WebhookClient({
    channel: {
      url: process.env.BOT_WEBHOOK_URL || "https://botv2frk1I0077H7FF842bots-mpaasocimt.botmxp.ocp.oraclecloud.com:443/connectors/v1/tenants/idcs-6d466372210e4300bb31f4db15e8e96c/listeners/webhook/channels/49ffdb70-6f27-40ee-922f-f77653e87870",
      secret: process.env.BOT_WEBHOOK_SECRET || "hDS7Nh7HBh28ZTjWoE3kixMIf4VH0SuP",
    }
  });
  // Add webhook event handlers (optional)
  webhook
    .on(WebhookEvent.ERROR, err => logger.error('Error:', err.message))
    .on(WebhookEvent.MESSAGE_SENT, message => logger.info('Message to bot:', message))
    .on(WebhookEvent.MESSAGE_RECEIVED, message => {
      // message was received from bot. forward to messaging client.
    logger.info('Message from bot:', message);
      // TODO: implement send to client...
console.log("send back to ms teams");
//////
var http = require("http");

var request = http.post(MSTEAMS_URL, function(response){
  var responseBody = '';

  response.on("data", function(message) {
    //This code line should work:   responseBody += dataChunk;

    //but I also passed with the line below:
    responseBody = responseBody + message;
  });

  response.on("end", function(){
      console.log(responseBody);
  });

});

request.on("error", function(error){
  console.error(error.message);
});

/////
  });

  // Create endpoint for bot webhook channel configurtion (Outgoing URI)
  // NOTE: webhook.receiver also supports using a callback as a replacement for WebhookEvent.MESSAGE_RECEIVED.
  //  - Useful in cases where custom validations, etc need to be performed.
  app.post('/bot/receivemessage', webhook.receiver());
  

   //TESTER
  app.get('/bot/tester', (req, res) => {
    //const { user, text } = {user: "Laban", text: req.query.text};

    const { user, text } = {user: "Laban", text: msteams.receivedMsg.text};
    // construct message to bot from the client message format
    const MessageModel = webhook.MessageModel();
    const message = {
      userId: user,
      messagePayload: MessageModel.textConversationMessage(text)
    };

   // send to bot webhook channel
    webhook.send(message)
      .then(() => res.send('ok'), e => res.status(400).end(e.message));
  });
  
 
  // Integrate with messaging client according to their specific SDKs, etc.
  //app.use(express.json());
  app.post('/bot/sendmessage',jsonParser, (req, res) => {
  
   const { user, text } = req.body;
  // console.log({ user, text });
        // construct message to bot from the client message format
    const MessageModel = webhook.MessageModel();
    const message = {
      userId: 'Labanish',
      messagePayload: MessageModel.textConversationMessage(text)
    };

    var payload ='';  
    req.on('data', (message) => {
      body.push(message);
    }).on('end', () => {
      // on end of data, perform necessary action
      try {
        // Retrieve authorization HMAC information
        var auth = this.headers['authorization'];
        // Calculate HMAC on the message we've received using the shared secret			
        var msgBuf = Buffer.from(payload, 'utf8');
        var msgHash = "HMAC " + crypto.createHmac('sha256', bufSecret).update(msgBuf).digest("base64");
        console.log("Computed HMAC: " + msgHash);
        console.log("Received HMAC: " + auth);
        
        res.writeHead(200);
        if (msgHash === auth) {
          var receivedMsg = JSON.parse(payload);
  
          var responseMsg = '{ "type": "message", "text": "From Bot: ' + receivedMsg.text + '" }';	
        } else {
          var responseMsg = '{ "type": "message", "text": "Error: message sender cannot be authenticated." }';
        }
        res.write(responseMsg);
        res.end();
      }
      catch (err) {
        res.writeHead(400);
        return res.end("Error: " + err + "\n" + err.stack);
      }
    });

    webhook.send(message)
      .then(() => res.send('ok'), e => res.status(400).end(e.message));

  });
}