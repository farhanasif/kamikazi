const express = require('express')
const request = require('request')
var bodyParser = require('body-parser')
const asyncHandler = require('express-async-handler')

require('dotenv').config()
const app = express()
const port = process.env.APP_PORT

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN


const HOME_RESPONSE = {
    "text": "Welcome to ONE BANK LTD, we are constantly seeking our ways to improve customer service, here are some quick options!",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Website",
        "payload":"web",
        "image_url":"http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/house-icon.png"
      },
      {
        "content_type":"text",
        "title":"Retail",
        "payload":"rb2001",
        "image_url":"http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/institution-icon.png"
      },
      {
        "content_type":"text",
        "title":"Corporate",
        "payload":"cp2001",
        "image_url":"http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/handshake-icon.png"
      },
      {
        "content_type":"text",
        "title":"OK Wallet",
        "payload":"ok2001",
        "image_url":"http://do.entertechbd.com/doerapi/images/ok-logo.png"
      },
      {
        "content_type":"text",
        "title":"Internet Banking",
        "payload":"internetbanking",
        "image_url":"http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/device-laptop-icon.png"
      },
      {
        "content_type":"text",
        "title":"Contact",
        "payload":"profile",
        "image_url":"http://icons.iconarchive.com/icons/vcferreira/firefox-os/48/dialer-icon.png"
      }
    ]
  }


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({"extended": false}));
app.use(bodyParser.json());


var requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}


app.use(requestTime)

app.get('/mala', function (req, res) {
    var responseText = 'Hello World!<br>'
    responseText += '<small>Requested at: ' + req.requestTime + '</small><br>'
    responseText += 'this is after the effect'
    res.send(responseText)
})


app.get('/', (req, res) => res.send('Hello World!'))

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "3387027151"
      
    // Parse the query params
    console.log(JSON.stringify(req.query));
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
})


app.post('/webhook', (req, res) => {  
    console.log('we have a hit');
    // Parse the request body from the POST
    let body = req.body;
    
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        
  
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
  
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          asyncHandler(handleMessage(sender_psid, webhook_event.message));        
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
  
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
    
  });


  app.post('/notify', (req, res) => {
    let response = {
      "text": `Your Order #1809779 is arrived. It is on its way to your shipping location, Happy Shopping`
    }
    
    let sender_psid = '1874795055968674'
    let stat = 2
    // Send the response message
    callSendAPI(sender_psid, response, stat); 
    
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  })
  
  // Handles messages events
  function handleMessage(sender_psid, received_message) {
    let response;
    let pivotal = 1;
    
    // Checks if the message contains text
    if (received_message.text) {    
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      console.log('we receied ----- '+received_message.text);
      
      
      
      let responsetext = received_message.text;
      //lets check the mobile number
      let ismobile = 'no';
      let mobile = responsetext.substring(1, responsetext.length);
      //console.log('aha-----'+mobile);
      if (isNaN(mobile)){
        
      }else{
        ismobile = 'yes';
      }
      
      if(responsetext.toUpperCase() == 'HELLO' || responsetext.toUpperCase() == 'HI' || responsetext.toUpperCase() == 'START'){
        console.log('YOU SAID HELLO');
        response = HOME_RESPONSE;
        
      }
      else if(responsetext.toUpperCase() == 'WEBSITE'){
        response = {
          "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title":"ENTERTECH",
              "image_url":"http://entertechbd.com/images/entertech-fb.png",
              "subtitle":"Entertech - Enterprise Solutions, Managed Service, Software development",
              "default_action": {
                  "type": "web_url",
                  "url": "http://entertechbd.com",
                  "webview_height_ratio": "COMPACT"
              },
              "buttons":[
                      {
                        "type":"web_url",
                        "url":"http://entertechbd.com",
                        "title":"View Website"
                      },{
                        "type":"web_url",
                        "url":"http://entertechbd.com/bond",
                        "title":"Enterprise Service"
                      },
                      {
                        "type": "postback",
                        "title": "Back",
                        "payload": "hello",
                      }
                ],
            }]
          }
        }
        }
      }
      else if(responsetext.toUpperCase() == 'CONTACT'){
        response = {
          "text": "Please share us your contact so that we can call you at our earliest free time!",
          "quick_replies":[
            {
              "content_type":"user_phone_number"
            }
          ]
        }
      }
      else if(responsetext.toUpperCase() == 'EMAIL'){
        response = {
          "text": "Please share us your email to get more about our services and offers!",
          "quick_replies":[
            {
              "content_type":"user_email"
            }
          ]
        }
      }
      else if(responsetext.toUpperCase() == 'PROFILE'){
        pivotal = 2;
        let url = "https://graph.facebook.com/"+sender_psid+"?fields=first_name,last_name,profile_pic&access_token="+PAGE_ACCESS_TOKEN
        
        // Send the HTTP request to the Messenger Platform
        request({
          "uri": url,
          "qs": { "access_token": PAGE_ACCESS_TOKEN },
          "method": "GET",
        }, (err, res, body) => {
          if (!err) {
            let obj = JSON.parse(body)
            let welcome = "Welcome "+obj.first_name+" "+obj.last_name +" to Entertech."
            console.log(welcome)
            response = {
              "text": welcome
            }
            callSendAPI(sender_psid, response);
          } else {
            console.error("An error occured :" + err);
            let welcome = "An error occured :" + err
            response = {
              "text": welcome
            }
            callSendAPI(sender_psid, response);
          }
        });
        
        console.log('printing response----------------')
        console.log(response)
      }
      else if(responsetext.toUpperCase() == 'NEWS'){
        response = {
          "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
                {
                  "title":"Mashrafe gives credit to seniors!",
                  "image_url":"http://en.samakal.com/uploads/2018/09/photos/Mash-5b9e0e6f601cc.jpg",
                  "subtitle":"Bangladesh skipper Mashrafe Mortaza gave credit to his senior players behind the Bangladesh massive victory...",
                  "default_action": {
                    "type": "web_url",
                    "url": "http://en.samakal.com/sports/article/1809124/mashrafe-gives-credit-to-seniors",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"http://en.samakal.com/sports/article/1809124/mashrafe-gives-credit-to-seniors",
                      "title":"View"
                    },{
                      "type":"postback",
                      "title":"Back",
                      "payload":"hello"
                    }              
                  ]      
                },
                {
                  "title":"Samakal Online!",
                  "image_url":"http://en.samakal.com/uploads/2018/10/photos/CEC_samakal-5bc607a0128e7.jpg",
                  "subtitle":"Disagreement not to affect conducting national polls: CEC",
                  "default_action": {
                    "type": "web_url",
                    "url": "http://en.samakal.com/bangladesh/article/181094/disagreement-not-to-affect-conducting-national-polls-cec",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"http://en.samakal.com/bangladesh/article/181094/disagreement-not-to-affect-conducting-national-polls-cec",
                      "title":"View"
                    },{
                      "type":"postback",
                      "title":"Back",
                      "payload":"hello"
                    }              
                  ]      
                },
                {
                  "title":"Samakal Online!",
                  "image_url":"http://en.samakal.com/uploads/2018/10/photos/River-Demonstration-5bc616fbc0501.jpg",
                  "subtitle":"Climate change demonstration on Buriganga river",
                  "default_action": {
                    "type": "web_url",
                    "url": "http://en.samakal.com/bangladesh/article/181095/%EF%BB%BFclimate-change-demonstration-on-buriganga-river",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"http://en.samakal.com/bangladesh/article/181095/%EF%BB%BFclimate-change-demonstration-on-buriganga-river",
                      "title":"View"
                    },{
                      "type":"postback",
                      "title":"Back",
                      "payload":"hello"
                    }              
                  ]      
                },
                {
                  "title":"Meghan and Harry expecting baby!",
                  "image_url":"http://en.samakal.com/uploads/2018/10/photos/fzqgc-5bc45ceb0b9e0.jpg",
                  "subtitle":"The Duchess of Sussex is pregnant and is due to give birth next spring, Kensington Palace has revealed.",
                  "default_action": {
                    "type": "web_url",
                    "url": "http://en.samakal.com/world/article/181091/meghan-and-harry-expecting-baby",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"http://en.samakal.com/world/article/181091/meghan-and-harry-expecting-baby",
                      "title":"View"
                    },{
                      "type":"postback",
                      "title":"Back",
                      "payload":"hello"
                    }              
                  ]      
                },
                {
                  "title":"Welcome!",
                  "image_url":"http://entertechbd.com/images/entertech-fb.png",
                  "subtitle":"We have the right hat for everyone.",
                  "default_action": {
                    "type": "web_url",
                    "url": "http://entertechbd.com/images/entertech-fb.png",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"http://entertechbd.com",
                      "title":"View Website"
                    },{
                      "type":"postback",
                      "title":"Back",
                      "payload":"hello"
                    }              
                  ]      
                }
              ]
            }
          }
        }
      }
      else if(ismobile == 'yes'){
        response = {
          "text": `Thanks for submitting your number: "${received_message.text}". Our support will call you at our earliest time!`
        }
      }
      else{
        response = {
          "text": `You sent the message: "${received_message.text}". We don't have any answer for that, Please send 'hi' to make a start!`
        }
      }
      
      
    } else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Is this the right picture?",
              "subtitle": "Tap a button to answer.",
              "image_url": attachment_url,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        }
      }
    } 
    
    // Send the response message
    //console.log(response)
    if(pivotal == 1){callSendAPI(sender_psid, response);}
        
  }
  
  // Handles messaging_postbacks events
  function handlePostback(sender_psid, received_postback) {
    let response;
    
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    }
    else if(payload.toUpperCase() == 'APPLY2000'){
      response = { "text": "You pressed Apply!" }
    }
    else if(payload.toUpperCase() == 'HELLO'){
      console.log('YOU SAID HELLO');
      response = HOME_RESPONSE;
    
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}
  
// Sends response messages via the Send API
function callSendAPI(sender_psid, response, stat = 1) {
    let request_body;
    if(stat == 1){
        console.log('######### stat is : '+stat)
        // Construct the message body
        request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
        }
    }
    else{
        console.log('######### stat is : '+stat)
        // Construct the message body
        request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response,
        "messaging_type": "MESSAGE_TAG",
        "tag": "SHIPPING_UPDATE"
        }
    }


    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
        console.log('message sent!')
        } else {
        console.error("Unable to send message:" + err);
        }
    }); 
}
  



app.listen(port, () => console.log(`Example app listening on port ${port}!`))