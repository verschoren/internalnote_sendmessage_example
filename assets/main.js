var client = ZAFClient.init();
client.invoke('resize', { width: '100%', height: '250px' });

//This should be replaced with a real API endpoint
var order = {"number":42,"status":"shipped","price":1138,"product":["Newton,Pismo"]}

client.get('ticket').then(function(ticket) {
    var name = ticket['ticket'].requester.name;
    var channel = ticket['ticket'].via.channel
    channel = channel == 'native_messaging'? 'messaging' : channel
console.log(channel)
    if (channel != 'messaging' && channel != 'chat'){
        $('body').html(`
        <div class="c-callout c-callout--info c-callout--recessed">
              <strong class="c-callout__title">Incompatible channel</strong>
              <p class="c-callout__paragraph">the sendMessage action only works for Chat or Messaging</p>
            </div>
        `)
    }
    
    $( "#request" ).click(function() {
        sendMessage(channel,`Hello ${name}, before we can assist you we need your account number.`) 
    });

    $( "#status" ).click(function() {
        sendMessage(channel,`Your order ${order.number} is currently ${order.status}`) 
    });

    $( "#info" ).click(function() {
        sendMessage(channel,`Your order ${order.number} contains ${(order.product.length)} product and has a total value of ${order.price}$. You ordered: \n- ${order.product.join('\r\n')}.`) 
    });
});

function sendMessage(channel,message){
    client.invoke('ticket.sendMessage', {
        channel: channel, 
        message: message
    }) 
}