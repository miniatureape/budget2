(function (context, $) {

var getBidFromPath = function() {
    return context.location.pathname.split('/')[1];
}

context.User = Backbone.Model.extend({

    store: function () {
        return window.localStorage['user-' + this.get('bid')] = this.toJSON();
    },

    sync: function () {
        this.set('synced', true);
        this.store();
        console.log('syncing');
    }

});

context.User.fetch = function(bid) {
    var data = window.localStorage['user-' + bid];
    if (data) {
        return new User(JSON.parse(data));
    } 
    return null;
}

context.UserView = Backbone.View.extend({

    tagName: 'div',
    className: 'user-settings',
    tpl: _.template($('#tpl-user').html()),

    render: function() {
        return this.$el.html(this.tpl(this.model.toJSON()));
    },

    attach: function() {
        $('#budget').html(this.render());
    }

});

context.Day = Backbone.Model.extend({
});

context.Day = Backbone.Model.extend({
    model: contextDay,
});

/*
 * Compare a locally stored user to one bootstrapped onto the page
 * and return the most recent one, updating the other, or marking it
 * to be updated.
 */
var getCurrentUser = function (bid) {

    var lstoreUser = User.fetch(bid);
    var rstoreUser = new User(context.UserData);

    if (!lstoreUser) {
        rstoreUser.store();
        return rstoreUser;
    }

    if (lstoreUser.update > rstoreUser.update) {
        lstoreUser.set('synced', false);
        lstoreUser.store();
        return lstoreUser;
    } 

    return rstoreUser;
}

context.Synchronizer = function(collector, rate, syncMethodName) {
    this.collector = collector;
    this.rate = rate || 5000;
    this.syncMethodName = syncMethodName || 'sync';
}

context.Synchronizer.prototype = {

    start: function () {
        this.timer = setInterval(_.bind(this.sync, this), this.rate);
    },

    stop: function() {
        clearInterval(this.timer);
    },

    sync: function() {
        var collection = this.collector();
        _.invoke(collection, 'sync');
    }

};

var getCurrentWeek = function() {
    return [];
};

var initializeUser = function() {
    context.currentUser = getCurrentUser(bid);
    context.currentUserView = new UserView({model:context.currentUser});
    context.currentUserView.render();
    context.currentUserView.attach();
}

var initializeWeek = function() {
    context.currentWeek = getCurrentWeek(new Date());
    // context.currentWeekView = new WeekView(context.currentWeek);
}

var initializeSynchronizers = function() {

    var userSync = new Synchronizer(function() {
        var user = context.User.fetch(getBidFromPath());
        if (!user.get('synced')) {
            return [user];
        }
        return [];
    })
    userSync.start();
}

// Begin

context.bid = getBidFromPath();

initializeUser();
initializeWeek();
initializeSynchronizers();

})(window, window.Zepto);
