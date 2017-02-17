(function(){
    var app = angular.module('app',['ui.sortable']);

    var storage1 = [];
    var storage2 = [];

    function makeWord() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    function generateFlags() {
        var flags = ['moon','locator','rocket','earth'];

        var randomArr = Array.apply(null, flags).map(function(item, index){
            return flags[Math.floor(Math.random() * 4)]
        });

        return randomArr;
    }

    for (var i=0; i<100; i++) {
        storage1.push({
            name: makeWord(),
            flags: generateFlags()
        });

        storage2.push({
            name: makeWord(),
            flags: generateFlags()
        });
    }


    app.constant('appConfig', {
        baseDir: 'src/html/app/',
    });

    app.directive('appWrap', function(appConfig){
        return {
            scope: {},
            restrict: "E",
            templateUrl: appConfig.baseDir + 'templates/appWrap.html',
            controllerAs: 'vm',
            controller: function($scope) {
                var vm = this;

                vm.storage1 = storage1;
                vm.storage2 = storage2;

                vm.sortableOptions = {
                    connectWith: ".list",
                }
            }
        }
    });

    app.directive('appBarLeft', function(appConfig){
        return {
            scope: {
                storage:'=storage',
                sortableOptions:'=sortableOptions'
            },
            restrict: "A",
            templateUrl: appConfig.baseDir + 'templates/appBarLeft.html',
            controllerAs: 'vm',
            controller: function($scope) {
                var vm = this;
                vm.sort = {
                    'ascending': false
                };
            }
        }
    });

    app.directive('appBarRight', function(appConfig, $filter){
        return {
            scope: {
                storage:'=storage',
                sortableOptions:'=sortableOptions'
            },
            restrict: "A",
            templateUrl: appConfig.baseDir + 'templates/appBarRight.html',
            controllerAs: 'vm',
            controller: function($scope) {
                var vm = this;

                vm.filters = [
                    {
                        flag: 'moon',
                        className: 'n-moon-bg'
                    },
                    {
                        flag: 'locator',
                        className: 'n-locator-bg'
                    },
                    {
                        flag: 'earth',
                        className: 'n-earth-bg'
                    },
                    {
                        flag: 'rocket',
                        className: 'n-rocket-bg'
                    }
                ];

                vm.checkedFilters = new Array(vm.filters.length);
                vm.selectedFilter = function() {
                     $filter('filter')(vm.filters, result);
                };

                function result(value, index, array) {
                    value.checked ? vm.checkedFilters[index] = value.flag : vm.checkedFilters[index] = null;
                }

                vm.checkboxFilter = function(item) {

                    var isAllEmpty = true;

                    for (var i=0; i<vm.checkedFilters.length; i++) {
                        if (vm.checkedFilters[i] != null) {
                            isAllEmpty = false
                        }
                    }

                    if (isAllEmpty) {
                        return true
                    }

                    if (!isAllEmpty) {

                        for (var i=0; i<item.flags.length; i++) {
                            for (var j=0; j<vm.checkedFilters.length; j++) {
                                if (item.flags[i] == vm.checkedFilters[j]) {
                                    return true;
                                }
                            }
                        }

                    }

                    return false;
                }
            }
        }
    });

    app.directive('appInfo', function(appConfig, appStorage){
        return {
            scope: {},
            restrict: "A",
            templateUrl: appConfig.baseDir + 'templates/appInfo.html',
            controllerAs: 'vm',
            controller: function($scope) {
                var vm = this;

                vm.storage = appStorage;
            }
        }
    });

    app.directive('appItem', function(appConfig, appStorage, appFunctions){
        return {
            scope: {
                item:'=item',
                isInFirstRoad:'@isInFirstRoad',
                isFirstItem:'@isFirstItem',
                index: '@index'
            },
            restrict: "A",
            templateUrl: appConfig.baseDir + 'templates/appItem.html',
            controllerAs: 'vm',
            controller: function($scope) {
                var vm = this;

                if ($scope.isFirstItem == 'true' && $scope.isInFirstRoad == 'true') {
                    appStorage.items = $scope.item;
                }

                appFunctions.setFlagPath($scope.item);

                vm.change = function() {
                    appStorage.items = $scope.item;
                }
            }
        }
    });

    app.factory('appStorage', function() {
        var storage = {
            items: []
        };

        return storage
    });

    app.factory('appFunctions', function() {

        function setFlagPath(obj) {
            obj.paths = [];
            for (var i=0; i<obj.flags.length; i++) {

                switch (obj.flags[i].toLowerCase()) {
                    case "earth" :
                        obj.paths.push('img/earth.png');
                        break;
                    case "locator" :
                        obj.paths.push('img/locator.png');
                        break;
                    case "moon" :
                        obj.paths.push('img/moon.png');
                        break;
                    case "rocket" :
                        obj.paths.push('img/rocket.png');
                        break;
                }
            }
        }

        return {
            setFlagPath: setFlagPath
        }
    });
})();