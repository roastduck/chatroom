angular.module("appIndex", [])
    .service("auth", ["$http", function($http) {
        this.register = function() {
            var auth = this;
            if (! this.allowSubmit) return;
            if (auth.password != auth.repeatPassword)
            {
                auth.errMsg = "wrong repeated password";
                return;
            }

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
                auth.hideModal();
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
                auth.hideModal();
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

        /// login or register?
        this.toLogin = true;

        /// Whether to show the modal
        this.showModal = function() { $("#login-register-modal").modal("show"); }
        this.hideModal = function() { $("#login-register-modal").modal("hide"); }

        /// Initialize modal
        $("#login-register-modal").modal();
    }])

    .controller("IndexController", ["$scope", "auth", function($scope, auth) {
        $scope.auth = auth;
    }]);

