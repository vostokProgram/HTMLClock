
var global_state;

/* expected input:
{
client_id,
type,
callback_function
}
*/
function init(json_object) {
    global_state = {
	client_id: json_object.client_id,
	type: json_object.type,
	callback_function: json_object.callback_function
    };
}

function login() {
    var windowObjectReference = window.open("https://api.imgur.com/oauth2/authorize?client_id=" + global_state.client_id +
					    "&response_type=" + global_state.type +
					    "&state=" + "some state",
					    "IMGUR WINDOW"
					   );
}
//http://ec2-54-68-242-251.us-west-2.compute.amazonaws.com/

function imgur_callback() {
     $.ajax({
	url: "https://api.imgur.com/3/account/me",
	type: 'GET',
	beforeSend: function (xhr) {
	    console.log(window.localStorage.token);
	    xhr.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.token);
	},
	data: {},
	success: function (data) { 
	    alert(data.url);
	},
	error: function () { },
    });
}

$(document).ready(function() {
    init({
	client_id: "44f0ee76eb4315f",
	type: "token",
	callback_function: imgur_callback
    });
});
