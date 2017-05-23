﻿angular.module('platformWebApp')
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('workspace.userProfile', {
            url: '/userProfile',
            templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
            controller: ['$scope', 'platformWebApp.bladeNavigationService', function ($scope, bladeNavigationService) {
                var blade = {
                    id: 'userProfile',
                    controller: 'platformWebApp.userProfile.userProfileController',
                    template: '$(Platform)/Scripts/app/userProfile/blades/userProfile.tpl.html',
                    isClosingDisabled: true
                };
                bladeNavigationService.showBlade(blade);
            }]
        });
}])
.factory('platformWebApp.userProfile', ['platformWebApp.userProfileApi', 'platformWebApp.settings.helper', 'platformWebApp.common.languages', 'platformWebApp.common.locales', 'platformWebApp.common.timeZones', function (userProfileApi, settingsHelper, languages, locales, timeZones) {
    var result = {
        language: undefined,
        regionalFormat: undefined,
        timeZone: undefined,
        mainMenuState: {},
        load: function () {
            return userProfileApi.get(function (profile) {
                settingsHelper.fixValues(profile.settings);
                profile.language = languages.normalize(settingsHelper.getSetting(profile.settings, "VirtoCommerce.Platform.UI.Language").value);
                profile.regionalFormat = locales.normalize(settingsHelper.getSetting(profile.settings, "VirtoCommerce.Platform.UI.RegionalFormat").value);
                profile.timeZone = settingsHelper.getSetting(profile.settings, "VirtoCommerce.Platform.UI.TimeZone").value;
                if (profile.timeZone) {
                    profile.timeZone = timeZones.normalize(profile.timeZone);
                }
                profile.mainMenuState = settingsHelper.getSetting(profile.settings, "VirtoCommerce.Platform.UI.MainMenu.State").value;
                if (profile.mainMenuState) {
                    profile.mainMenuState = angular.fromJson(profile.mainMenuState);
                }
                angular.extend(result, profile);
            }).$promise;
        },
        save: function()
        {
            var mainMenuStateSetting = settingsHelper.getSetting(this.settings, "VirtoCommerce.Platform.UI.MainMenu.State");
            mainMenuStateSetting.value = angular.toJson(this.mainMenuState);
            settingsHelper.getSetting(this.settings, "VirtoCommerce.Platform.UI.Language").value = result.language;
            settingsHelper.getSetting(this.settings, "VirtoCommerce.Platform.UI.RegionalFormat").value = result.regionalFormat;
            settingsHelper.getSetting(this.settings, "VirtoCommerce.Platform.UI.TimeZone").value = result.timeZone;
            return userProfileApi.save(result).$promise;
        }
    }
    return result;
}])
.run(['platformWebApp.mainMenuService', '$state', function (mainMenuService, $state) {
    var menuItem = {
        path: 'configuration/userProfile',
        icon: 'fa  fa-user',
        title: 'platform.menu.user-profile',
        priority: 99,
        action: function () { $state.go('workspace.userProfile'); }
    };
    mainMenuService.addMenuItem(menuItem);
}]);