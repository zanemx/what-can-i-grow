/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
//const foods = require('./zanemx-modules/Foods');
//const moment = require("moment")
const wcig = require('./zanemx-modules/wcig');
const axios = require('axios');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {

        // get user zipcode 
        const {user,device,apiEndpoint,apiAccessToken} = handlerInput.requestEnvelope.context.System;
        const url = `${apiEndpoint}/v1/devices/${device.deviceId}/settings/address/countryAndPostalCode`;

        axios.get(url,{
            'Content-Type':'application/json',
            'X-Amzn-RequestId':user.userId,
            'Authorization':`Bearer ${apiAccessToken}`,
        }).then((res)=>{
            const zip = res.data.postalCode;
            console.log("ZIPCODE: " + zip);
            const speechText = 'Welcome To What Can I Grow. You can say, Today, to hear what you can grow today. Or ask me about a specific date or month.';
            return handlerInput.responseBuilder .speak(speechText) .reprompt(speechText) .withSimpleCard('What Can I Grow', speechText) .getResponse();
        }).catch((err)=>{
            const speechText = 'There was a big bad error';
            console.error(err);
            return handlerInput.responseBuilder .speak(speechText).withSimpleCard('What Can I Grow', err).getResponse();
        });


        //if(response.status !== 200){
        //const speechText = 'unable to fetch your zip code. Goodbye.'; 
        //return await handlerInput.responseBuilder
        //.speak(speechText)
        //.getResponse();
        //}

        //const zipCode = response.data.postalCode;
        //console.log("ZIPCODE: " + zipCode);

        // TODO - check for 403 Forbidden (means the user hasn't granted perms) 
        // TODO - check for 200 success request 

        // get api access token (used for partial address query) 
        //const apiAccessToken = this.event.context.System.apiAccessToken;
        ////// get device id (used for partial address query) 
        //const deviceId =       this.event.context.System.device.deviceId;
        //console.log(JSON.stringify(this.event.context));

        //const uri = `https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address/countryAndPostalCode`
        //const hostHeader= 'api.amazonalexa.com'
        //const AuthHeader = `Bearer ${apiAccessToken}` 
        //const AcceptHeader = 'application/json'

        //const speechText = 'Welcome To What Can I Grow. You can say, Today, to hear what you can grow today. Or ask me about a specific date or month.';
        //return handlerInput.responseBuilder .speak(speechText) .reprompt(speechText) .withSimpleCard('What Can I Grow', speechText) .getResponse();
    },
};

const GetFoodForMonthIntent = {

    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetFoodForMonthIntent'
        // TODO - properly validate slot {when}
            && handlerInput.requestEnvelope.request.intent.slots['month'];
    },
    handle(handlerInput){

        // get date requested 
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const when = slots['month'].value;

        let foods = wcig.getFoodsICanGrowInMonth(when);

        // dialogify string array 
        foods[foods.length-1] = 'and ' + foods[foods.length-1];
        foods = foods.join(', ');

        const speechText = `In ${when}, you can grow, ${foods}.`; 
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const GetFoodForDateIntentHandler =  {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetFoodForDateIntent'
        // TODO - properly validate slot {when}
            && handlerInput.requestEnvelope.request.intent.slots['when'];
    },
    handle(handlerInput){

        //console.log(JSON.stringify(handlerInput));


        // get date requested 
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const when = slots['when'].value;

        let [month,foods] = wcig.getFoodForDate(when);

        // dialogify string array 
        foods[foods.length-1] = 'and ' + foods[foods.length-1];
        foods = foods.join(', ');

        const speechText = `In ${month}, you can grow, ${foods}.`; 
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();

        //}).catch((error)=>{
        //console.log(error);

        //const speechText = 'unable to fetch your zip code. Goodbye.'; 
        //return handlerInput.responseBuilder
        //.speak(speechText)
        //.getResponse();
        //});
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        GetFoodForMonthIntent,
        GetFoodForDateIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
