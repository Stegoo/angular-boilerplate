(function() {

    'use strict';

    angular.module('app.service').factory('User', [function() {
        var User = function User(data) {
            this.id = data.id;
            this.name = data.name ? data.name : null;
        };

        User.prototype = {
            /*getName: function getName() {
                return(this.name);
            }*/
        };

        User.action = function action() {
            return 'test action';
        };

        return User;
    }])
    .service('Users', ['User', function(User) {

        var UserList = [];

        this.get = function(user) {
            if (!user)
                return UserList;
            if (!(user instanceof User))
            {
                $log.warn('you must provide an user instance');
                return;
            }
            for (var i = 0; i < UserList.length; i++) {
                if (user.id && UserList[i].id === user.id)
                    return UserList[i];
            }
        };

        this.set = function(users) {
            UserList = users;
            return UserList;
        };

        this.count = function() {
            return UserList.length;
        };

        this.add = function(user) {
            //console.info(user, typeof user, user instanceof User);
            if (!user)
            {
                $log.warn('you must provide an user');
                return;
            }

            //If we receive a list, we copy it
            if (Object.prototype.toString.call(user) === '[object Array]')
                angular.copy(user, UserList);
            else
            {
                if (!(user instanceof User))
                {
                    $log.warn('you must provide an user instance');
                    return;
                }
                //We either update the user object
                for (var i = 0; i < UserList.length; i++) {
                    if (user.id && UserList[i].id === user.id)
                    {
                        UserList[i] = user;
                        return;
                    }
                }
                //Or add it in the list if we have not found it
                if (user.id)
                    UserList.unshift(user);
            }

            //We then format some configurations
             for (var j = 0; j < UserList.length; j++) {
                    for (var k = 0; k < UserList[j].configuration.length; k++) {
                        if (UserList[j].configuration[k].rules.render === 'typeahead') {
                            formatTypeheadUser(UserList[j].configuration[k]);
                        }
                    }
             }
        };

        this.delete = function (user) {
            //Delete every elements of the list if the id is not set
            if (typeof user === 'undefined')
            {
                UserList.splice(0, UserList.length);
                return;
            }

            for (var i = 0; i < UserList.length; i++) {
            //console.info('instance application:', user, 'elem dans la liste existante: ',UserList[i]);
                if (UserList[i].id === user.id || (UserList[i].extended_property && UserList[i].extended_property.id === user.id)) {
                    UserList.splice(i, 1);
                }
            }
        };

    }]);

})();