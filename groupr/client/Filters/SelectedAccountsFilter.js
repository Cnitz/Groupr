define([
    './Module'
], function(module) {
    return module.filter('selectedAccounts', function() {
        return function(items, accounts) {
            var filtered = [];
			angular.forEach(items, function(key, value) {
				if(accounts[key.account].active)
					filtered.push(key);
			});
            return filtered;
        };
    });
});
