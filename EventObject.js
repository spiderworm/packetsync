define(
	function() {
	
		function EventObject() {
			this._handlers = {};
		}
		
		EventObject.prototype._on = function(type,callback) {
			if(!this._handlers[type])
				this._handlers[type] = [];

			var handler = new Handler(this,type,callback);
			this._handlers[type].push(handler);
			return handler;
		}

		EventObject.prototype._subscribe = function(type,callback,args) {
			var handler = this._on(type,callback);
			handler.fire(args);
			return handler;
		}
		
		EventObject.prototype._fire = function(type,args) {
			var handlers = this.__getHandlersCopy(type);
			
			for(var i=0; i<handlers.length; i++) {
				handlers[i].fire(args);
			}
		}

		EventObject.prototype.__getHandlers = function(type) {
			if(!this._handlers[type])
				this._handlers[type] = [];

			return this._handlers[type];
		}

		EventObject.prototype.__getHandlersCopy = function(type) {
			return [].concat(this.__getHandlers(type));
		}

		EventObject.prototype.__addHandler = function(type,handler) {
			var handlers = this.__getHandlers(type);
			handlers.push(handler);
		}

		EventObject.prototype.__removeHandler = function(type,handler) {
			var handlers = this.__getHandlers(type);
			var i = handlers.indexOf(handler);
			if(i > -1)
				handlers.splice(i,1);
			if(handlers.length === 0)
				this.__removeHandlerType(type);
		}

		EventObject.prototype.__removeHandlerType = function(type) {
			delete this._handlers[type];
		}





		function Handler(eventObject,type,callback) {
			this._eventObject = eventObject;
			this._callback = callback;
			this._type = type;
			this._on = true;
			this.asynchronous = true;
		}
		Handler.prototype.off = function() {
			if(this._on) {
				this._on = false;
				this._eventObject.__removeHandler(this._type,this);
			}
		}
		Handler.prototype.on = function() {
			if(!this._on) {
				this._on = true;
				this._eventObject.__addHandler(this._type,this);
			}
		}
		Handler.prototype.fire = function(args) {
			if(this.asynchronous) {
				var handler = this;
				setTimeout(function() {
					handler._callback.apply(handler._eventObject,args);
				}, 0);
			} else {
				this._callback.apply(this._eventObject,args);
			}
		}






		return EventObject;
	
	}
);