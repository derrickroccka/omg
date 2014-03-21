'use strict';

angular.module('VideosModule', [])
.controller('VideosCtrl', [ '$scope', '$sce', '$animate', 'YoutubeService', function ($scope, $sce, $animate, YoutubeService) {
	var baseVideoURL = 'http://www.youtube.com/embed/';
	var baseVideoId = '_Ah2nTHgMCI';

	$scope.section = 'videos';
	$scope.videoTitle = '"Putas Asesinas" de Roberto Bolaño';
	$scope.videoURL = $sce.trustAsResourceUrl(baseVideoURL+baseVideoId);
	$scope.videoDesc = 'Vídeo promocional de l\'adaptació teatral del conte "Putas Asesinas" de Roberto Bolaño.';
	$scope.videoList = YoutubeService.getVideoList();
	$scope.videoStatistics = YoutubeService.getVideoStatistics(baseVideoId);

	$scope.videoChange = function (title, id, desc) {
		$scope.videoTitle = title;
		$scope.videoURL = $sce.trustAsResourceUrl(baseVideoURL+id);
		$scope.videoDesc = desc;
		$scope.videoStatistics = YoutubeService.getVideoStatistics(id);
	};
}]);
