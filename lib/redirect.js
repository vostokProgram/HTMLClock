window.onload = redirect_init;


function redirect_init() {
    // First, parse the query string
    var params = {}, queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
	params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    window.opener.localStorage.token = params["access_token"];

    window.opener.global_state.callback_function();

    window.close();
}
