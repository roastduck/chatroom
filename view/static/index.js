angular.module("appIndex", [])
    .service("auth", ["$http", function($http) {
        this.register = function() {
            var auth = this;
            if (! this.allowSubmit) return;
            this.allowSubmit = false;
            $http.post("/dynamic/public/register", {
                username: this.username,
                password: this.password
            }).then(function(response) {
                if (response.data.stat == "error")
                    auth.errMsg = response.data.msg;
            }, function(response) {
                auth.errMsg = "connection failed";
            }).finally(function() {
                auth.allowSubmit = true;
            });
        };

        this.login = function() {
            var auth = this;
            if (! this.allowSubmit) return;
            this.allowSubmit = false;
            $http.post("/dynamic/public/login", {
                username: this.username,
                password: this.password
            }).then(function(response) {
                if (response.data.stat == "error")
                    auth.errMsg = response.data.msg;
            }, function(response) {
                auth.errMsg = "connection failed";
            }).finally(function() {
                auth.allowSubmit = true;
            });
        };

        this.logout = function(callback) {
            $http.get("dynamic/private/logout");
        };

        /// allow submiting login and register form
        this.allowSubmit = true;

        /// username and password to be submitted
        this.username = "";
        this.password = "";

        /// error message
        this.errMsg = "";
    }])

    .controller("IndexController", ["$scope", "auth", function($scope, auth) {
        $scope.auth = auth;
    }]);

