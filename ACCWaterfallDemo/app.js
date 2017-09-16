var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session,results) {
        session.userData.name = results.response;
        builder.Prompts.choice(session, "Hi " + results.response + ", What kind of soda would you like?",["Coke","Diet Coke","Sprite"])
    },
    function (session, results) {
        session.userData.soda = results.response.entity;
        builder.Prompts.number(session, "How many bottles would you like?"); 
     },
    function (session,results) {
        session.userData.sodaCoount = results.response;
        builder.Prompts.choice(session, "What kind of kind of chips would you like?",["Plain","BBQ","Corn"])
    },
    function (session, results) {
        session.userData.chips = results.response.entity;
        builder.Prompts.number(session, "How many bags would you like?"); 
    },
     function (session, results) {
    //     session.userData.sodaCount = results.response;
    //     session.send( session.userData.name + ", you ordered " + session.userData.sodaCount + 
    //                 " bottle(s) of " + session.userData.soda );
        
        session.userData.chipCount = results.response;
        session.send( session.userData.name + ", you ordered " + session.userData.sodaCount + 
                    " bottle(s) of " + session.userData.soda + " and " + session.userData.chipCount +
                    " bag(s) of " +  session.userData.chips + ' chips');
    }
]);
