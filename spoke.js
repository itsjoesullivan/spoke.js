//the spoke app id
var spokeId = "dbbambfkcknfdgochdhdddakdlihifpg";

/**
 * Send a request through spoke
 * @param req {obj}
 * @param fn {function}
 */
var spoke = function(req,fn) {
	console.log('incoming',req);
	if(!spoke.handle(req,fn)) {
		chrome.runtime.sendMessage(spokeId,req,fn);
	}
};

var test = false;
if(test) {
	spoke = function(req,fn) {
		console.log(req);
		if(!req.register) fn(true);
	}
}

spoke.registry = [];

/**
 * Register a handler through spoke
 * @param req {obj}
 * @param fn {function}
 */
spoke.register = function(req,fn) {
	//identify this as a registration request
	req.register = true;
	//store callback locally
	req.fn = fn;
	spoke.registry.push(req);

	//send off the registration request. Spoke will then come back here when a request we can handle occurs, and we'll access our handler.
	spoke(req);
};

/**
 * Internal function for dealing with a spoke request. Identifies the handler, then executes it
 *
 * @param req {obj}
 * @param fn {function}
 */
spoke.handle = function(req, fn) {
	for(var i in this.registry) {
		var handler = this.registry[i];
		if(minimatch(req.noun,handler.noun) && req.verb === handler.verb) {
			return handler.fn(req,fn);
		}
	}
};

//Listen for messages from spoke, and handle such incoming messages.
/*chrome.runtime.onMessage.addListener(function(req, sender, fn) {
	if(sender.id === spokeId) {
		spoke.handle(req,fn);
	}
});*/
