'use strict';
angular.module('underscore', []).factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

window.angular.module('helpers', [])
.factory('$helpers', ['$rootScope', '$http', '$window', '$document', '$compile',
	function($rootScope, $http, $window, $document, $compile) {
	return {
		'files': {
			'readPreview': function (file, onLoad) {
				var reader = new FileReader();
				reader.onload = onLoad;
		    reader.readAsDataURL(file);
		    return reader.result;
			},
			'readAsArray': function(file, onLoad) {
				var reader = new FileReader();
				reader.onloadend = onLoad;
		    reader.readAsArrayBuffer(file);
		    return reader.result;
			}
		},
		error: function(msg, silent) {
			window.alertify.set('notifier','delay', 50);

			if (silent) {
				return;
			}
			// console.log("*-----------------------------------*");
			// console.log(msg);
			// console.log("*-----------------------------------*");

			if ( msg && msg['msg'] && msg['permission_denied'] == true) {
				window.alertify.set('notifier','position', 'bottom-left');
				window.alertify.message(msg['msg']);
			} else if ( msg && msg['msg'] ) {
				window.alertify.set('notifier','position', 'bottom-left');
				window.alertify.warning(msg['msg']);
			} else if (msg && msg['errors']) {
				var str = "";
				for(var opt in msg['errors']) {
					str += opt + ": " + msg['errors'][opt] + "\n";
				}
				alert(str);
			} else if ( msg && msg["meta"] && msg["meta"]["msg"] ) {
				window.alertify.set('notifier','position', 'bottom-left');
				// console.log("help", msg["meta"]["msg"]);
				window.alertify.warning(msg["meta"]["msg"]);
			} else if ( msg && msg["data"] && msg["data"]["meta"] && msg["data"]["meta"]["msg"] ) {
				window.alertify.set('notifier','position', 'bottom-left');
				//console.log(window.alertify);
				window.alertify.error(msg["data"]["meta"]["msg"]);
			} else {
				// alert('No se completó la operación correctamente. \nPor favor refresque el navegador e intentelo de nuevo.');
				var msg = "No se completó la operación correctamente. \nPor favor refresque el navegador e intentelo de nuevo.";
				window.alertify.set('notifier','position', 'bottom-left');
				window.alertify.warning(msg);
			}
		},
		wait: function(msg) {

		},
		success: function(msg, silent) {
			if (silent) {
				console.log(msg);
				return;
			}
			window.alertify.set('notifier','position', 'top-rigth');
			if ( msg && msg['msg'] ) {
				// window.alertify.set('notifier','position', 'bottom-left');
				window.alertify.success(msg['msg']);

			} else if (msg && msg['meta'] && msg['meta']['msg']) {
				window.alertify.success(msg['meta']['msg']);
			} else {
				// window.alertify.set('notifier','position', 'bottom-left');
				window.alertify.success('OK. \nOperacion satisfactoria.');
			}
		},
		alert: function(msg, silent) {
			if (silent) {
				console.log(msg);
				return;
			}
			if ( msg && msg['msg'] ) {
				// alert(msg['msg']);
				// console.log(msg['msg']);
				window.alertify.set('notifier','position', 'bottom-left');
				window.alertify.error(msg['msg']);

			} else {
				// alert('Ups. \nEstas haciendo algo incorrecto.');
				// console.log('Ups. \nEstas haciendo algo incorrecto.');
				window.alertify.set('notifier','position', 'bottom-left');
				window.alertify.error('Ups. \nEstas haciendo algo incorrecto.');
			}
		},
		module: {
			'dom': {
         toClipboard: function(element){
          var copyElement = window.angular.element('<span id="ngClipboardCopyId">'+element+'</span>');
          var body = $document.find('body').eq(0);
          body.append($compile(copyElement)($rootScope));
          
          var ngClipboardElement = window.angular.element(document.getElementById('ngClipboardCopyId'));
          var range = document.createRange();

          range.selectNode(ngClipboardElement[0]);

          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);

          var successful = document.execCommand('copy');

          var msg = successful ? 'successful' : 'unsuccessful';
          window.getSelection().removeAllRanges();

          copyElement.remove();
        }				
			},
			'views': function(app, module, url) {
				if ( app && module && url ) {
					return $window.INFINITY['settings']['modules'][app][module]['assets'] + 'views/' + url;
				} else if (app && url) {
					return $window.INFINITY['settings']['modules'][app]['assets'] + 'views/' + url
				} else if ( app ) {
					return $window.INFINITY['settings']['modules']['current']['assets'] + 'views/' + app;
				}
			},
			'cache': function(key, value) {
				var _value = value || undefined;
				if(!localStorageService.isSupported) {
					return undefined;
				}
				if ( key && _value === undefined ) {
					return localStorageService.get(key);
				} else if ( key && value ) {
					localStorageService.set(key, _value);
				}
			},
			'auth': {
				'on': function(group_list, except){
					if ( except ) {
						var ones = _.reject($rootScope.profile.auth.groups, function(t){
							return (except.indexOf(t) >= 0);
						});
					} else {
						var ones = $rootScope.profile.auth.groups;
					}
					
					if ( ones.indexOf("super") >= 0 ) {
						return true;
					}
					for(var i = 0; group_list.length > i; i++) {
						if (ones.indexOf(group_list[i]) >= 0){
							return true;
						}
					}
					return false;
				}
			},
			'template': function(template) {
				if ( template[0] === ':' && template[1] === ':' ) {
					if ( $rootScope.profile.auth.group && $rootScope.profile.auth.group.length > 0 ) {
						if ( $rootScope.profile.auth.group === 'super' ) {
							var tmpl = template.slice(2, template.length);
							return  tmpl;
						} else {
							var tmpl = template.slice(2, template.length);
							return  '/' + $rootScope.profile.auth.group + tmpl;
						}
					}
					return '/infinity/404.html'
				} else {
					return template;
				}
			}
		},
		utils: {
			'groupBy': function (arr, key) {
				var newArr = [],
				  types = {},
				  newItem, i, j, cur;
					for (i = 0, j = arr.length; i < j; i++) {
					  cur = arr[i];
					  if (!(cur[key] in types)) {
					      types[cur[key]] = { type: cur[key], data: [] };
					      newArr.push(types[cur[key]]);
					  }
					  types[cur[key]].data.push(cur);
					}
					return newArr;
			},
		}
	}
}]);

var app = window.angular.module('exelsa-app', ['underscore', 'helpers']);
app.directive('ryFileSelect', ['$helpers', function($helpers) {
	var template = '<div class="custom-file"><input type="file" name="multimediaFile" class="custom-file-input"  id="customFile" /><label class="custom-file-label" for="customFile">Seleccione el archivo excel</label></div>';
	return {
		scope: {
			'_model': '=model',
		},
		restrict: 'A',
		link: function( $scope, elem, attrs ) {
			var mimeTypes = [];
			if ( $scope._model.type === "image" ) {
				mimeTypes = ["image/png", "image/jpg", "image/jpeg"];
			} else if ( $scope._model.type === "file" ) {
				mimeTypes = ["application/vnd.ms-excel", "application/msword", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
			} else if ( $scope._model.type === "pdf" ) {
				mimeTypes = ["application/pdf"];
			}
			
			var selector = $( template );
			elem.append(selector);
			var prepath = undefined;
			var onLoad = function(arg1) {
				$scope.$apply(function(){
					$scope._model.preview = arg1.target.result;
					if ( prepath ) {
						$scope._model.path = prepath;
					}
				});
			};
			var _onLoad = function(arg1) {
				$scope.$apply(function(){
					$scope._model._preview = arg1.target.result;
				});
			};
			var clearBinary = function(){
				$scope.$apply(function(){
					$scope._model._preview = undefined;
					$scope._model.path = undefined;
				});
			}
			function getExt(filepath){
			     return filepath.split("?")[0].split("#")[0].split('.').pop();
			}
			var renderFile = function(_type) {
				var _img = "";
				if ( _type === "application/vnd.ms-excel" || _type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
					_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJySURBVGhD7ZrfS1NhGMdH/5SrrSxcVHf9WBR0FRQIWtmPy0DopqJ2JtrsZptGrsxfd13pdBS0QNPEKEvDLAslNgdrNV31be/xcb4HT+9MzvseiPc7Puyc9zkPez6cH9vFPDo6LqXG8Ie9Id97KRi+dk+zZwd9lNyURRJeww+nqW2tM99rQv6YEhlZIr2T/TgcPWZuK5GRJTI8m8KrpdfqZGSKLBaW1MnIFlEmo0JEiYwqkYpMLGjWHZdRKSJVRrUIQ4qMGyIMXsYb8l+jcbYfWSI3krdwb6xLiJFqwa7wHrAZaJztR5bIv6BF+GgRB9EifLSIg2gRPlsVYV9cox9fYCH32WTobdJSP9fXVKkxLg5csdRFKD8jVx83g8+Zh/WV2suFSVoF3ixOm+J8rwjlIjuN3Zj6MkXjAs/m0uZ6Y+95WllL/aOGTb0ilIsw2Fn4XX6t53TiLMY/TdAeMDKTsu0T4YoIY3B6iMYG5rPztAWs/lxFMH7StkeEayJHokGslFZo/I08GOu2Pb4arokweib6aPy1FEtFBCIHbY+thmsi7Ik083WWFDbSNHDZ9vhquCZyffAmjQ7LjT+X+QBfS61tjwhXROruHECmkKHRgfjzTuSLedoDbg+HbftEuCJyfzRBIwPZQhZ7WwOIpuO0AuR+5LC//ZBt799QLnI0dtx8xK6n7UnEXGc3eb74jVaB7vGeTb0ilIsk343QqMDy92XsawtUarF0B1WA0q8STnSesvSKUCrCLqHI07sVLvRfstTZ5cTXG8o/W/i6COVnRBZahI8WcRAtwkeLOIgW4fM/icj7C8cWYTPQODo6auPx/AFMWSit+HWjMQAAAABJRU5ErkJggg==";
				} else if ( _type === "application/pdf"){
					_img = "data:image/png;base64,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";
				} else {
				  _img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAS1BMVEUAAADQ09Xp7vLl7fbp7vLp7vLp7/Lo7vHt7fbp7vLp7/Lr6/Lp7vLDxsfg5Ofi5+rS1tnn7PDN0NLHyszU19nJzc7Iyszl6u7Q09YqpvyVAAAADHRSTlMAxfId7uysqRyvqice46UmAAAA70lEQVRYw+3Xy66CMBSFYQ/Hu3vtXkHf/0llYNwOSEuXJgb1H5B0wJeWAklXH9X/tpNif5X7N1IJZWErVaAsdHWgLEgdMIEETCABE0jABBIwgQMuJnCASyZQgJyLc5CmfsBcwOUe6LMjgeBxywcGCBHwGoKOTgwE4JFuc9cE3w444L52BVwz4OEfB7kZ6KE2UPTNABBscAaagRiFBCx2CRb/EAtbygAuIQsNcK+yFTGWg9CAfc40MF6WDcS47L/yCwBNgz4FDEB6L6BD0oXvwg/4OqCThtYTwKEF2E0Ap7XMbrOfPDgeZ66i2+1Xn9QVBUp7ARDyDywAAAAASUVORK5CYII=";
				}
				$scope.$apply(function(){
					$scope._model.preview = _img;
					if ( prepath ) {
						$scope._model.path = prepath;
					}
				});				
			};
			selector.bind('change', function(e) {
				// console.log("1>>>d:", e);
				var file = (e.srcElement || e.target).files[0];
				if ( !file  ) {
				  return;
				}
				$scope._model.name = file.name;
				if (mimeTypes.indexOf(file.type) >= 0) {
					prepath = (e.srcElement || e.target).files;
					if ( $scope._model.type === "image" ) {
						$helpers.files.readPreview(file, onLoad);
					} else if ( $scope._model.type === "file" ) {
						$helpers.files.readAsArray(file, _onLoad);
						renderFile("application/vnd.ms-excel");
					} else if ( $scope._model.type === "pdf" ) {
						// $helpers.files.readAsArray(file, _onLoad);
						renderFile("application/pdf");
					}
					return;
				}
				if ( file.type === "" ) {
					if (getExt(file.name) === "xls" || getExt(file.name) === "xlsx") {
						prepath = (e.srcElement || e.target).files;
						// $scope._model.name = file.name;
						renderFile("application/vnd.ms-excel");
					} else {
					  //clear
					}
				}
				clearBinary();
				renderFile(undefined);
			});
			$scope.$watch('_model.path', function(file) {
				if ( file === undefined ) {
					selector.val('');
					$scope._model.preview = undefined;
					$scope._model.loaded = false;
				} else {
					$scope._model.loaded = true;
				}
			});
		// 	$scope.$watch('_model.trigger', function(value, oldValue) {
		// 		if ( value ) {
		// 			selector.trigger('click');
		// 		}
		// 	});
		}
	};
}]);
	
app
  .controller('upUploadFileCtrl', ['$scope', '$http', '$helpers', 
    function($scope, $http, $helpers){
    var _uufc_ = this;
    
    _uufc_.data = {
      'tmp': {
        'request': undefined,
        'file': {
					'path': undefined,
					'preview': undefined,
					'trigger': undefined,
					'name': undefined,
					'type': 'file',
					'loaded': undefined,
        },
        'excel': {
          'read': false,
          'data': undefined
        },
        'isUploading': false,
      },
    };
    // console.log(window.XLSX);
    _uufc_.utils = {
      'readAsJson': function() {
        var formData = new FormData();
        if (!_uufc_.data.tmp.file.path || _uufc_.data.tmp.file.path.length <= 0 ) {
          $helpers.error({'msg': 'Seleccione un documento por favor.'});
          _uufc_.data.tmp.file.path = undefined;
          return;
        }
        if ( !_uufc_.data.tmp.file._preview ) {
          $helpers.error({'msg': 'Seleccione un documento por favor.'});
          return;
        }
        
        var options = { type: 'array' };

        var workbook = window.XLSX.read(_uufc_.data.tmp.file._preview, options);
    
        var sheetName = workbook.SheetNames;
        console.log("><>>", sheetName);
        var sheet = workbook.Sheets[sheetName];
        $("#final-content").html(window.XLSX.utils.sheet_to_html(sheet));
        // result1.innerHTML = 
        // var jsonData = window.XLSX.utils.sheet_to_json(sheet);
        // if (jsonData  ) {
        //   _uufc_.data.tmp.excel.read = true;
        //   console.log(">>>", jsonData);
        //   // _uufc_.utils.analizeJson(jsonData);
        // }
      }
    };
}]);
      
$(document).on("ready", function(){
  
});