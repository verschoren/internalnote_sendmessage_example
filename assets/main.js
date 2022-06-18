var client = ZAFClient.init();
client.invoke('resize', { width: '100%', height: '250px' });

//This should be replaced with a real API endpoint
var order = {"number":42,"status":"shipped","price":1138,"product":["Newton,Pismo"]}

client.get('ticket').then(function(ticket) {
    //Filtering the channels and setting a variable for later use.
    var channel = ticket['ticket'].via.channel
    channel = channel == 'native_messaging'? 'messaging' : channel
    if (channel != 'messaging' && channel != 'chat'){
        //sendMessage only supports the above two channels, so show an error for other channels.
        $('body').html(`
        <div class="c-callout c-callout--info c-callout--recessed">
              <strong class="c-callout__title">Incompatible channel</strong>
              <p class="c-callout__paragraph">the sendMessage action only works for Chat or Messaging</p>
            </div>
        `)
    }
    
    $( "#request" ).click(function() {
        //Example of sending a message with placeholders from the Zendesk Ticket.
        sendMessage(channel,`Hello ${ticket['ticket'].requester.name}, before we can assist you we need your order number.`) 
    });

    $( "#status" ).click(function() {
        //Example of sending a reply with info from an external API.
        sendMessage(channel,`Your order ${order.number} is currently ${order.status}`) 
    });

    $( "#info" ).click(function() {
        //Example of sending a burst of short messages
        sendMessage(channel,`Your order ${order.number} contains ${(order.product.length)} products.`) 
        sendMessage(channel,`The total amount of ${order.price}`)
        sendMessage(channel,`You ordered the following items: \n- ${order.product.join('\r\n')}.`) 
    });
});

function sendMessage(channel,message){
    client.invoke('ticket.sendMessage', {
        channel: channel, 
        message: message
    }) 
}