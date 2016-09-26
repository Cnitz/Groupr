define([
    './Module'
], function(module) {
    return module.filter('parentFolder', function() {
        return function(items, numLvl) {
			//debugger;
			if(numLvl >= items.length) {
				//debugger;
				return items;
			}
			//debugger;
			return items.slice(items.length - numLvl);
        };
    });
});
