angular.module('core')

.factory('PagingService', function($q, $filter) {

	function PagingService(options) {
		var me = this;
		angular.extend(me, {
			currentPage: 1,
			pageSize: 15,
			options: {
				appendPages: false
				//uniqueBy: 'id'
			}
		});

		angular.extend(me.options, options || {});
		if (me.options.onSuccess) {
			me.onSuccess = me.options.onSuccess;
		};

		//@private
		me.applyData = function(responseData) {

			responseData = angular.isFunction(responseData.headers) ? responseData.data : responseData;

			me.totalItems = responseData.count;
			me.totalPage = Math.ceil(me.totalItems / me.pageSize);

			var itens = responseData.items;
			if (me.options.appendPages && me.items) {
				itens = $filter('unique')(me.items.concat(responseData.items), me.options.uniqueBy || undefined);
			};
			me.items = itens;

			var min = Math.max(1, me.currentPage - 2);
			var max = Math.min(min + 4, me.totalPage);
			me.pages = [];
			for (var i = min; i <= max; i++) {
				me.pages.push(i);
			};

		};
		//@private
		me.getParams = function() {
			return {
				"$inlinecount": "allpages",
				"limit": me.pageSize,
				"$skip": (me.currentPage - 1) * me.pageSize,
				"$filter": me.filter
			};
		};
		//@protected
		me.getExtraParams = function() {
			return {};
		};
		//UserService.query
		//@public
		me.setQueryFn = function(queryFn) {
			me.queryFn = queryFn;
		};


		//@public
		me.setPage = function(pageNumber) {
			me.currentPage = pageNumber;
			me.getPage();
		};

		//@public
		me.pullRefresh = function(pageNumber) {
			me.currentPage = 1;
			me.getPage();
		};

		//@public
		me.hasPrevious = function() {
			return me.currentPage < me.totalPage;
		};

		//@public
		me.previousPage = function() {
			if (me.hasPrevious()) {
				me.currentPage++;
				me.getPage();
			}
		};

		//@public
		me.hasNext = function() {
			return me.currentPage > 1;
		}

		//@public
		me.nextPage = function() {
			if (me.hasNext()) {
				me.currentPage--;
				me.getPage();
			}
		};
		// me.find = function (nome) {
		//     if (nome) {
		//         me.currentPage = 1;
		//         me.filter = "substringof('" + nome + "',nome)";
		//     } else {
		//         me.currentPage = 1;
		//         me.filter = undefined;
		//     }
		//     me.getPage();
		// }
		return me;
	};


	PagingService.prototype.getPage = function() {
		var me = this;
		var deferred = $q.defer();
		var params = angular.extend(me.getParams(), me.getExtraParams());
		me.queryFn(params, function(data) {
			me.applyData(data);
			me.onSuccess && me.onSuccess(data);
			deferred.resolve(data);
		}, function(data) {
			me.onError && me.onError(data);
			deferred.reject(arguments);
		});
		return deferred.promise;
	};


	return PagingService;
});