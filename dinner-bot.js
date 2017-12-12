var builder = require('botbuilder');

module.exports = function(app) {

var connector = new builder.ChatConnector({
appId: process.env.MICROSOFT_APP_ID,
appPassword: process.env.MICROSOFT_APP_PASSWORD
});

app.post('/api/messages', connector.listen() );

var bot = new builder.UniversalBot(connector, [
function(session)
{
session.send("Welcome to Reservation Bot. Please say `dinner reservation` or `order dinner`");
}
]);


//------------------------------- Dinner reservation dialog bot----------------------

bot.dialog('dinner reservation', [
function(session)
{
session.send("Welcome to Dinner Reservation");
session.beginDialog('askforDateTime');
},
function(session, results)
{
session.dialogData.reservationdate = builder.EntityRecognizer.resolveTime([results.response]);
session.beginDialog('askforPartySize');
},
function(session, results)
{
session.dialogData.partysize = results.response;
session.beginDialog('askforDishType');
},
function(session, results)
{
session.dialogData.type = results.response.entity;
session.beginDialog('askforReservName');
},
function(session, results)
{
session.dialogData.reservname = results.response;
session.endDialog(`Reservation Confirmed. Reservation Details.<br/> Date/Time: ${session.dialogData.reservationdate} <br/> Party Size: ${session.dialogData.partysize} <br/> Dish type: ${session.dialogData.type} <br/> reservation name: ${session.dialogData.reservname}`);
}
])

.triggerAction({
	matches: /^dinner reservation$/i,
	confirmPrompt: "This will Cancel your current request. Are you sure.?"
})

.endConversationAction(
   "endorderdinner", "Ok. Good Bye",
   {
	   matches: /^cancel$|^goodbye$/i,
	   confirmPrompt: "This will cancel your order. Are you sure?"
   }
);

bot.dialog('askforDateTime', [
function(session)
{
builder.Prompts.time(session, "Please Provide a reservation date and time" );
},
function(session,results)
{
session.endDialogWithResult(results);
}
]);

bot.dialog('askforPartySize', [
function(session)
{
builder.Prompts.text(session, "How many people are in the party?" );
},
function(session, results)
{
session.endDialogWithResult(results);
}])

.beginDialogAction('partysizehelp', 'partysize', { matches: /^help$/i } );

bot.dialog('partysize', function(session,args,next) {
	session.endDialog("Party Size Help: Our Restaurant supports up to 150 members under one reservation");
});

bot.dialog('askforDishType', [
function(session)
{
builder.Prompts.choice(session, "Choose your Dish type?", "Veg|Non-Veg", {listStyleType: 3});
},
function(session, results)
{
session.endDialogWithResult(results);
}]);

bot.dialog('askforReservName', [
function(session)
{
builder.Prompts.text(session, "who's name you want the reservation be under?");
},
function(session,results)
{
session.endDialogWithResult(results);
}
]);
//-------------------------- Order Dinner dialog-----------------------
var dinnermenu = {
	"Veg Biryani": {
		Description : "Veg Biryani",
		price: 100
	},
	"Egg Biryani": {
		Description: "Egg Biryani",
		price: 130
	},
	"Chicken Biryani": {
		Description: "Chicken Biryani",
		price: 160
	}
};


bot.dialog('order dinner', [
function(session)
{
	session.send("Lets order some dinner!");
	builder.Prompts.choice(session, "Dinner Menu: ", dinnermenu );
},
function(session,results)
{
	
	if(results.response)
	{
	  var order = dinnermenu[results.response.entity];
	  var msg = `your ordered. Order Description: ${order.Description} and total ${order.price} rs`;
	  session.send(msg);
	  session.dialogData.order = order;
	  builder.Prompts.text(session, "What is your room number?" );
	}
},

function(session, results)
{
    if(results.response)
	{
		session.dialogData.room = results.response;
	    var msg = `Thank you. your order will be delivered ${session.dialogData.room}`;
		//session.send(msg);
		session.endConversation(msg);
	}
}

])

.triggerAction({
	matches: /^order dinner$/i,
	confirmPrompt: "This will cancel your order. Are you Sure?"
});
};