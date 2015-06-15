define([
	'angular',
	'window'
], function(angular) {
	'use strict';

	return angular.module('TT-UI.Common.Config', [])
	.constant('CONFIG', {
		INDEX_STATE: 'customers.home',

		DATE_FORMAT:       'dd/MM/yyyy',
		DATETIME_FORMAT:   'dd/MM/yyyy HH:mm:ss',

		MODEL_DATE_FORMAT: 'yyyy-MM-ddT00:00:00.000\'Z\'', // Angular date filter format

		BASE_URL: 'scripts/common/', // Slash at the end

		LOCALE_PATH:   'data/', // Slash at the end
		LOCALE_PREFIX: 'locale-',
		LOCALE_SUFFIX: '.json',
		LOCALE_DEFAULT: '<%= defaultLang %>',
		LOCALE_LIST:    [<% langs.forEach(function (item, idx) { if (idx!=0) {%>,<%}%>'<%= item %>'<% }); %>]
	});
});
