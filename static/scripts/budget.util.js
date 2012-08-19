(function($) {

    window.WeekUtil = {

        startOfWeek: function(date) {
            d = date || new Date();
            d.setUTCDate(d.getUTCDate() - d.getDay());
            return d;
        },

        makeWeek: function(date) {
            var week = [], d;
            for (var i = 0 ; i < 7; i++) {
                d = new Date(date.getTime());
                date.setUTCDate(week.getUTCDate() + i);
            }
            return week;
        }

    };
    
/*
    var WEEK_IN_MILLIS = 604800000;
    var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 

    window.DateUtil = {

        ensureDate: function(date) {
            if (date.constructor.name === 'Number') date = new Date(date);
            return date;
        },

        ordinalSuffix: function(day) {
            if (day >= 10 && day < 20) return 'th';
            day = day % 10;
            if (day === 1) return 'st';
            if (day === 2) return 'nd';
            if (day === 3) return 'rd';
            if (day > 3 || day === 0) return 'th';
        },

        fmtDate: function(fmt, date) {
            date = this.ensureDate(date);

            var formats = {
                '%m': function() { return date.getMonth() + 1},
                '%B': function() { return MONTHS[date.getMonth()]},
                '%d': function() { return date.getDate()},
                '%D': _.bind(function() { return date.getDate() + this.ordinalSuffix(date.getDate())}, this),
                '%a': function() { return (DAYS[date.getDay()]).substr(0, 3)},
                '%Y': function() { return date.getFullYear()},
                '%y': function() { return ("" + date.getFullYear()).substr(2,2)}
            };

            for (f in formats) {
                fmt = fmt.replace(new RegExp(f, 'g'), formats[f]);
            }

            return fmt;
        },

        clone: function(date) {
            date = this.ensureDate(date);
            return new Date(date.getTime());
        },

        incrementWeek: function(week, amt) {
            amt = amt || 1;
            week = DateUtil.clone(week);
            week.setDate(week.getDate() + (7 * amt));
            return week;
        },

        today: function() {
            var now = new Date;
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        },
        
        week: function() {
            var now = new Date;
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        },

        inWeek: function(date, week) {
            week = this.ensureDate(week);
            date = this.ensureDate(date);
            return date.getTime() >= week.getTime() && date.getTime() < week.getTime() + WEEK_IN_MILLIS;
        },

        inMonth: function(date, month) {
            date = this.ensureDate(date);
            month = this.ensureDate(month);
            return (month.getMonth() === date.getMonth()) && (month.getFullYear() === date.getFullYear());
        }
    
    };
*/

})(window.Zepto);
