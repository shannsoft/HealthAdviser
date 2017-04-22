app.directive('phonenumberDirective', ['$filter', function($filter) {
	function link(scope, element, attributes) {
		scope.inputValue = scope.phonenumberModel;
		scope.$watch('inputValue', function(value, oldValue) {
			value = String(value);
			var number = value.replace(/[^0-9]+/g, '');
			scope.phonenumberModel = number;
			scope.inputValue = $filter('phonenumber')(number);
		});
		scope.$watch('phonenumberModel', function(value, oldValue) {
    value = String(value);
			var number = value.replace(/[^0-9]+/g, '');
			scope.phonenumberModel = number;
			scope.inputValue = $filter('phonenumber')(number);
		});
	}
	return {
		link: link,
		restrict: 'E',
		scope: {
			phonenumberPlaceholder: '=placeholder',
			phonenumberModel: '=model',
    		class: '=customclass',
		},
		template: '<input ng-model="inputValue" name="phone" type="tel" class="{{class}}" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 9999-9999)">',
	};
}])