(function(){
	var app = angular.module('categories_manager', ['ui.bootstrap','ngTagsInput','720kb.datepicker','colorpicker.module'], function($interpolateProvider)
		{ $interpolateProvider.startSymbol('<%'); $interpolateProvider.endSymbol('%>'); });

	app.controller('categoriesController',['$rootScope','$scope','$sce','$http','$uibModal',function ($rootScope,$scope,$sce,$http,$uibModal) {
		var self = this;
		$rootScope.bussy=true;
		self.cats=[];
		$rootScope.currentCat={id:null};
		$rootScope.currentProperty={id:null};
		$rootScope.currentSubProperty={id:null};
		$rootScope.selectedProperty={id:null};
		$rootScope.selectedSubProp={id:null};
		$rootScope.currentForm={id:null};

		self.rv=false;
		self.shrv=function(){
			self.rv =!self.rv;
			if(!self.rv)
				self.vm=false;
		}
		self.vm=false;
		self.shvm=function(){
			self.vm =!self.vm;
		}

		$http({
			method: 'GET',
			url: api
		}).then(function successCallback(response) {
			self.cats = response.data;
			$rootScope.bussy=false;
		}, function errorCallback(response) {
			self.cats = [];
			$rootScope.bussy=false;
		});

		self.renameSubPropId=0;
		self.renameFormId=0;
		self.time_id=-1;

		self.selectForm=function(form){
			$rootScope.currentForm =form;
			if($rootScope.currentForm.properties==null)
				$rootScope.currentForm.properties={Activated:false,Submission_limit:false,times:[]};
			else{

				if(typeof $rootScope.currentForm.properties == "string") {
					$rootScope.currentForm.properties = JSON.parse($rootScope.currentForm.properties);
				}

				if(!$rootScope.currentForm.properties.Activated)
					$rootScope.currentForm.properties.Activated=false;
				if(!$rootScope.currentForm.properties.Submission_limit)
					$rootScope.currentForm.properties.Submission_limit=false;
				if(!$rootScope.currentForm.properties.times)
					$rootScope.currentForm.properties.times=[];
			}

			setTimeout(function(){updateTooltip()},1000);
		}
		self.copyForm= function(){
			if($rootScope.currentCat.id && $rootScope.currentForm.id) {
				var modalInstance = $uibModal.open({
					animation: true,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					template: `<div class="modal-header">
				<h3 class="modal-title" id="modal-title">Copy form</h3>
				</div>
				<div class="modal-body" id="modal-body">
				<form name="myForm" novalidate>
				<div ng-class="{'form-group':true}">
					<label for="parent_category">copy to category</label>
					<select class="form-control" ng-model="CopyFromCtrl.data.cat_id">
						<option ng-repeat="c in CopyFromCtrl.cats" value="<% c.id %>" ng-selected="c.id == CopyFromCtrl.data.cat_id" ><% c.category_name %> </option>
					</select>
				</div>
				</form>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" type="button" ng-click="CopyFromCtrl.ok()" ng-disabled="myForm.$invalid">OK</button>
					<button class="btn btn-warning" type="button" ng-click="CopyFromCtrl.cancel()">Cancel</button>
				</div>`,
					controller: 'ModalCopyFromCtrl',
					controllerAs: 'CopyFromCtrl',
					size: 'md',
					appendTo: undefined,
					resolve: {
						cats: function(){ return self.cats; },
						form: function () { return $rootScope.currentForm }
					}
				});
				modalInstance .result.then(function (newCats) {
					self.cats = newCats.data;
				}, function () {
					console.log('Modal dismissed at: ' + new Date());
				});
			}
		}
		self.addForm=function(){
			if($rootScope.currentCat.id) {
				var modalInstance = $uibModal.open({
					animation: true,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					template: `<div class="modal-header">
				<h3 class="modal-title" id="modal-title">Add Form</h3>
				</div>
				<div class="modal-body" id="modal-body">
					<div class="row">
						<div class="col-xs-6">
							<form name="myForm" novalidate>
							
							<div ng-class="{'form-group':true,'has-error':myForm.form_name.$invalid && myForm.form_name.$touched}">
								<label for="form_name">Form name</label>
								<input type="text" name="form_name" ng-model="AddFormCtrl.form.form_name" class="form-control"  required>
								<p ng-show="myForm.form_name.$invalid && myForm.form_name.$touched" class="help-block">form name is required.</p>
							</div>
							<div ng-class="{'form-group':true,'has-error':myForm.thumbnail.$error.validFile}">	
								<label for="thumbnail">PDF</label>
								<input type="file" name="thumbnail" file-model = "AddFormCtrl.form.file" ng-model = "AddFormCtrl.form.file" class="form-control" accept="application/pdf">
								<p ng-show="myForm.thumbnail.$error.validFile" class="help-block">PDF file is required.</p>
							</div>
							</form>
						</div>
						<div class="col-xs-6">
							<a href="<%AddFormCtrl.add_form_from_builder%>" class="add-form-builder-link"> Go to form builder </a>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" type="button" ng-click="AddFormCtrl.ok()" ng-disabled="myForm.$invalid">OK</button>
					<button class="btn btn-warning" type="button" ng-click="AddFormCtrl.cancel()">Cancel</button>
				</div>`,
					controller: 'ModalAddFormCtrl',
					controllerAs: 'AddFormCtrl',
					size: 'md',
					appendTo: undefined,
					resolve: {}
				});
				modalInstance.result.then(function (newCats) {
					self.cats = newCats.data;
					self.renderforms($rootScope.currentCat.id, self.cats);
					setTimeout(function () {
						$scope.$apply();
					}, 200);
				}, function () {
					console.log('Modal dismissed at: ' + new Date());
				});
			}
		}
		self.renameForm=function(){
			if($rootScope.currentForm.id){
				self.renameFormId=$rootScope.currentForm.id;
			}
		}
		self.updateFormDone=function(){
			if($rootScope.currentForm.id) {
				self.renameFormId = 0;
				$rootScope.bussy = true;
				var fd = new FormData();
				fd.append('data', JSON.stringify($rootScope.currentForm));
				$http.post(api + "/form/edit", fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).then(function successCallback(response) {
					console.log(response);
					self.cats = response.data;
					$rootScope.bussy = false;
				}, function errorCallback(response) {
					console.log(response);
					$rootScope.bussy = false;
				});
			}
		}
		self.removeForm=function(){
			if($rootScope.currentForm.id) {
				$rootScope.bussy = true;
				var fd = new FormData();
				fd.append('data', JSON.stringify($rootScope.currentForm));
				$http.post(api + "/form/delete", fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).then(function successCallback(response) {
					console.log(response);
					self.cats = response.data;
					self.renderforms($rootScope.currentCat.id,self.cats);
					$rootScope.bussy = false;
					//$rootScope.currentForm={id:null};
				}, function errorCallback(response) {
					console.log(response);
					$rootScope.bussy = false;
				});
			}
		}
		self.openForm=function(){

			if($rootScope.currentForm.id) {
                window.open('/preview/'+$rootScope.currentForm.id, '_blank');
			}
		}
		self.addFormTime=function(){
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!

			var yyyy = today.getFullYear();
			if(dd<10){
				dd='0'+dd;
			}
			if(mm<10){
				mm='0'+mm;
			}
			var today = dd+'-'+mm+'-'+yyyy;
			$rootScope.currentForm.properties.times.push({"every":"year","from":today ,"end":today });

			self.updateFormDone();
		}
		self.selectFormTime=function(_id){
			self.time_id=_id;
		}
		self.removeFormTime=function(){
			if(self.time_id>=0){
				$rootScope.currentForm.properties.times.splice(self.time_id,1);
				self.time_id=-1;
				self.updateFormDone();
			}
		}
		self.renderforms=function(_id,_cats){
			self.unselectCategory();
			for(var i=0;i<_cats.length;i++){
				if(_cats[i].id==_id){
					$rootScope.currentCat=_cats[i];
					return 1;
				}else{
					if(self.renderforms(_id,_cats[i].categorires)==1){
						return 1;
					}
				}
			}
			return 0;
		}




		self.unselectProperty=function(){
			$rootScope.currentProperty={id:null};
			$rootScope.currentSubProperty={id:null};
			$rootScope.selectedProperty={id:null};
			$rootScope.selectedSubProp={id:null};
		}
		self.unselectCategory=function(){
			$rootScope.currentCat={id:null};
			$rootScope.currentProperty={id:null};
			$rootScope.currentSubProperty={id:null};
			$rootScope.selectedProperty={id:null};
			$rootScope.selectedSubProp={id:null};
			$rootScope.currentForm={id:null};
		}

		self.updateCurrentCat=function(){
			console.log("updateCurrentCat");
			self.renameSubPropId=0;
			self.renameFormId=0;

			$rootScope.bussy = true;
			var fd = new FormData();
			fd.append('data', JSON.stringify($rootScope.currentCat));
			$http.post(api+"/edit", fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).then(function successCallback(response) {
				console.log(response);
				self.cats = response.data;
				$rootScope.bussy=false;
			}, function errorCallback(response) {
				console.log(response);
				$rootScope.bussy=false;
			});
		}

		self.addSubProp=function(){
			if($rootScope.selectedProperty.id){
				$rootScope.selectedProperty.value.sub.push({
					id: Date.now(),
					title: "",
					codes: ""
				});
				$rootScope.selectedSubProp = $rootScope.selectedProperty.value.sub[$rootScope.selectedProperty.value.sub.length-1];
				self.renameSubPropId =$rootScope.selectedSubProp.id;
			}
		}
		self.removeSubProp=function(){
			for(var i=0;i<$rootScope.selectedProperty.value.sub.length;i++)
			{
				if($rootScope.selectedProperty.value.sub[i].id== $rootScope.selectedSubProp.id){
					$rootScope.selectedProperty.value.sub.splice(i, 1);
					self.updateCurrentCat();
					break;
				}
			}
		}
		self.renameSubProp=function(){
			self.renameSubPropId =$rootScope.selectedSubProp.id;
		}
		self.selectSubProp=function(id){
			for(var i=0;i<$rootScope.selectedProperty.value.sub.length;i++){
				if($rootScope.selectedProperty.value.sub[i].id==id){
					$rootScope.selectedSubProp = $rootScope.selectedProperty.value.sub[i];
				}
			}
		}

		self.removeProperty=function(){
			if($rootScope.currentSubProperty.id){
				for(var i=0;i<$rootScope.currentProperty.sub_props.length;i++)
				{
					if($rootScope.currentProperty.sub_props[i].id == $rootScope.currentSubProperty.id){
						$rootScope.currentProperty.sub_props.splice(i, 1);
						self.updateCurrentCat();
						break;
					}
				}
			}else{
				if($rootScope.currentProperty.id) {
					for(var i=0;i<$rootScope.currentCat.properties.length;i++)
					{
						if($rootScope.currentCat.properties[i].id == $rootScope.currentProperty.id){
							$rootScope.currentCat.properties.splice(i, 1);
							self.updateCurrentCat();
							break;
						}
					}
				}
			}

		}
		self.renameProperty=function(){
			if($rootScope.currentSubProperty.id){
				angular.element('#prop-item-'+$rootScope.currentSubProperty.id).scope()._renameProp($rootScope.currentSubProperty.id);
			}else{
				if($rootScope.currentProperty.id) {
					angular.element('#prop-item-' + $rootScope.currentProperty.id).scope()._renameProp($rootScope.currentProperty.id);
				}
			}
		}
		self.addProperty=function(){
			if($rootScope.currentCat.id) {
				if(!$rootScope.currentProperty.id) {
					$rootScope.currentCat.properties.push({
						id: Date.now(),
						title: "",
						value: {address: "", sub: []},
						sub_props: []
					});
					$rootScope.currentProperty = $rootScope.currentCat.properties[$rootScope.currentCat.properties.length-1];
				}
				else{
					$rootScope.currentProperty.sub_props.push({
						id: Date.now(),
						title: "",
						value: {address: "", sub: []}
					});
					$rootScope.currentSubProperty = $rootScope.currentProperty.sub_props[$rootScope.currentProperty.sub_props.length-1];
				}
				setTimeout(function(){
					if($rootScope.currentSubProperty.id){
						angular.element('#prop-item-'+$rootScope.currentSubProperty.id).scope()._renameProp($rootScope.currentSubProperty.id);
					}else{
						if($rootScope.currentProperty.id) {
							angular.element('#prop-item-' + $rootScope.currentProperty.id).scope()._renameProp($rootScope.currentProperty.id);
						}
					}
				},100);
			}
		}

		self.renameCategory=function(){
			if($rootScope.currentCat.id){
				angular.element('#cat-item-'+$rootScope.currentCat.id).scope().renameCategory();
			}
		}
		self.deleteCategory=function(){
			if($rootScope.currentCat.id) {
				$rootScope.bussy = true;
				var fd = new FormData();
				fd.append('data', JSON.stringify($rootScope.currentCat));
				console.log($rootScope.currentCat);
				$http.post(api + "/delete", fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).then(function successCallback(response) {
					console.log(response);
					self.cats = response.data;
					$rootScope.bussy = false;
				}, function errorCallback(response) {
					console.log(response);
					$rootScope.bussy = false;
				});
			}
		}
		self.editImage=function (cat) {
			console.log("editImage");
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				template: `<div class="modal-header">
				<h3 class="modal-title" id="modal-title">Add new Image</h3>
				</div>
				<div class="modal-body" id="modal-body">
				<form name="myForm" novalidate>
				<div ng-class="{'form-group':true,'has-error':myForm.thumbnail.$error.validFile}">	
					<label for="thumbnail">thumbnail</label>
					<input type="file" name="thumbnail" file-model = "EditCatCtrl.cat.image_thumb" ng-model = "EditCatCtrl.cat.image_thumb" class="form-control" accept="image/jpeg">
					<p ng-show="myForm.thumbnail.$error.validFile" class="help-block">thumbnail is required.</p>
				</div>
				</form>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" type="button" ng-click="EditCatCtrl.ok()" ng-disabled="myForm.$invalid">OK</button>
					<button class="btn btn-warning" type="button" ng-click="EditCatCtrl.cancel()">Cancel</button>
				</div>`,
				controller: 'ModalEditCatCtrl',
				controllerAs: 'EditCatCtrl',
				size: 'md',
				appendTo: undefined,
				resolve: {
					cat: function(){ return cat; }
				}
			});
			modalInstance .result.then(function (newCats) {
				self.cats = newCats.data;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		}
		self.addCategory=function(){
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				template: `<div class="modal-header">
				<h3 class="modal-title" id="modal-title">Add category</h3>
				</div>
				<div class="modal-body" id="modal-body">
				<form name="myForm" novalidate>
				<div ng-class="{'form-group':true}">
					<label for="parent_category">parent category</label>
					<select class="form-control" ng-model="AddCatCtrl.cat.cat_id">
						<option value="0" >Main Category</option>
						<option ng-repeat="c in AddCatCtrl.cats" value="<% c.id %>" ng-selected="c.id == AddCatCtrl.cat.cat_id" ><% c.category_name %> </option>
					</select>
				</div>
				<div ng-class="{'form-group':true,'has-error':myForm.category_name.$invalid && myForm.category_name.$touched}">
					<label for="category_name">category name</label>
					<input type="text" name="category_name" ng-model="AddCatCtrl.cat.category_name" class="form-control"  required>
					<p ng-show="myForm.category_name.$invalid && myForm.category_name.$touched" class="help-block">category name is required.</p>
				</div>
				<div ng-class="{'form-group':true,'has-error':myForm.color.$invalid && myForm.color.$touched}">
					<label for="color">color</label>
					<input type="text" name="color" colorpicker autocomplete="off" ng-model="AddCatCtrl.cat.category_color" class="form-control"  required>
					<p ng-show="myForm.color.$invalid && myForm.color.$touched" class="help-block">color is required.</p>
				</div>
				<div ng-class="{'form-group':true,'has-error':myForm.thumbnail.$error.validFile}">	
					<label for="thumbnail">thumbnail</label>
					<input type="file" name="thumbnail" file-model = "AddCatCtrl.cat.image_thumb" ng-model = "AddCatCtrl.cat.image_thumb" class="form-control" accept="image/jpeg">
					<p ng-show="myForm.thumbnail.$error.validFile" class="help-block">thumbnail is required.</p>
				</div>
				</form>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" type="button" ng-click="AddCatCtrl.ok()" ng-disabled="myForm.$invalid">OK</button>
					<button class="btn btn-warning" type="button" ng-click="AddCatCtrl.cancel()">Cancel</button>
				</div>`,
				controller: 'ModalAddCatCtrl',
				controllerAs: 'AddCatCtrl',
				size: 'md',
				appendTo: undefined,
				resolve: {
					cats: function(){ return self.cats; }
				}
			});
			modalInstance .result.then(function (newCats) {
				self.cats = newCats.data;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		}
	}]);


	app.directive('categoryList', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				cats: '=',
				edit:'&'
			},
			template: `<ul class="list-group" ng-if="cats.length>0" primary-id="<% cats[0].parent_category_id %>">
				<category-item ng-repeat="(key, cat) in cats track by $index" edit="edit()" cat="cat"></category-item>
			</ul>`
		};
	});
	app.directive('categoryItem', function($compile,$rootScope,$http) {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				cat: '=',
				edit: '&'
			},
			controller: ['$scope', function catController(scope) {
				scope.rename = false;
				scope.opened = false;
				scope.selected= function(){
					return $rootScope.currentCat.id == scope.cat.id;
				}
				var lastclick=0;
				scope.open=function () {
					if(lastclick < Date.now()){
						if(!scope.opened)
							scope.opened = Date.now();
						else
							scope.opened = false;
						console.log(scope.opened);
						lastclick = Date.now()+200;
					}
				}
				scope.selectItem = function() {
					$rootScope.currentCat = scope.cat;
					$rootScope.currentProperty={id:null};
					$rootScope.currentSubProperty={id:null};
					$rootScope.selectedProperty={id:null};
					$rootScope.selectedSubProp={id:null};
					$rootScope.currentForm={id:null};
					if(typeof $rootScope.currentCat.properties == "string"){
						$rootScope.currentCat.properties = JSON.parse($rootScope.currentCat.properties);
					}
					if(typeof $rootScope.currentCat.forms == "string"){
						$rootScope.currentCat.forms = JSON.parse($rootScope.currentCat.forms);
					}
				};
				scope.updateCategoryDone = function(_cat) {
					scope.rename = false;
					$rootScope.bussy=true;
					var fd = new FormData();
					fd.append('data', JSON.stringify(_cat));
					$http.post(api+"/edit", fd, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					}).then(function successCallback(response) {
						console.log(response);
						self.cats = response.data;
						$rootScope.bussy=false;
					}, function errorCallback(response) {
						console.log(response);
						$rootScope.bussy=false;
					});
				};
				scope.$on('colorpicker-closed', function(event, colorObject){
					console.log(event, colorObject);
					console.log(scope.cat);
					scope.updateCategoryDone(scope.cat);
				});
			}],
			template: `<li class="list-group-item" id="cat-item-<%cat.id%>" parent-category="<% cat.parent_category_id %>">
				<ul ng-class="{'custom-item':true, 'active':selected() }" ng-click="selectItem(); $event.stopPropagation();" ng-dblclick="renameCategory()">
				<li>
				<a href="javascript:void(0)" ng-click="open()"> 
				
				<i class="admin-icons icons-plus-circle" ng-if="(cat.categorires.length>0) && !opened"></i>
				<i class="admin-icons icons-minis-circle" ng-if="(cat.categorires.length==0) || ((cat.categorires.length>0) && opened)"></i>
				</a>
				</li>
				<li class="item-label-container">
					<label ng-if="!rename"><% cat.category_name %></label>
					<input ng-if="rename" type="text" ng-model="cat.category_name" ng-blur="updateCategoryDone(cat)" style="color: #000;">
				</li>
				<li class="right-float">
					<button class="floatColorButton" colorpicker="" type="button" colorpicker-position="top" ng-model="cat.color" value="<%cat.color%>" title="change color" data-toggle="tooltip" data-placement="left"></button>
					<div class="color-sign" data-color="<% cat.color %>" style="background-color:<% cat.color %>"></div>
				</li>
				<li class="right-float" >
				
				<a href="javascript:void(0)" ng-click="_edit(cat)"  title="change photo" data-toggle="tooltip" data-placement="left">
				<i class="admin-icons icons-background"></i></a>
				</li>
				</ul>
			</li>`,
			link: function (scope, element, attrs) {
				scope.cc=0;
				updateTooltip();
				if (angular.isArray(scope.cat.categorires)) {
					element.children(":first").append("<category-list edit='edit()' cats='cat.categorires' ng-if='opened'></category-list>");
					$compile(element.contents())(scope)
				}
				scope._edit= function(cat) {
					scope.cc++;
					if(scope.cc%2==0)
						scope.edit()(cat);
				}
				scope.renameCategory = function() {
					scope.rename = true;
					$(element[0].querySelector("input")).focus();
				};
			}
		};
	});

	app.directive('propertyList', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				parent: '=',
				properties: '='
			},
			controller: ['$scope','$rootScope','$http', function catController(scope,$rootScope,$http) {
				scope.rename = 0;
				scope.selected= function(id){
					if($rootScope.currentSubProperty.id)
						return $rootScope.currentSubProperty.id == id;

					return $rootScope.currentProperty.id == id;
				}
				scope.selectProp = function(prop, parent) {
					//scope.current = scope.cat;
					if(parent==null){
						$rootScope.currentProperty = prop;
						$rootScope.currentSubProperty={id:null};
					}else{
						$rootScope.currentSubProperty = prop;
						$rootScope.currentProperty = parent;
					}
					$rootScope.selectedProperty=prop;
					$rootScope.selectedSubProp={id:null};

					setTimeout(function(){updateTooltip()},1000);

				};
				scope.updatePropDone = function() {
					scope.rename = 0;
					$rootScope.bussy=true;
					var fd = new FormData();
					fd.append('data', JSON.stringify($rootScope.currentCat));
					$http.post(api+"/edit", fd, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					}).then(function successCallback(response) {
						console.log(response);
						self.cats = response.data;
						$rootScope.bussy=false;
					}, function errorCallback(response) {
						console.log(response);
						$rootScope.bussy=false;
					});
				};
			}],
			template: `<ul class="list-group" ng-if="properties.length>0" primary-id="<% cats[0].parent_category_id %>">
				<li ng-repeat="(key, prop) in properties track by $index" class="list-group-item" id="prop-item-<%prop.id%>">
					<ul ng-class="{'custom-item':true, 'active':selected(prop.id) }" ng-click="selectProp(prop,parent)" ng-dblclick="renameProp(prop.id)">
					<li><i class="admin-icons icons-main-category" ></i></li>
					<li class="item-label-container">
						<label ng-if="rename!=prop.id"><% prop.title %></label>
						<input ng-if="rename==prop.id" type="text" ng-model="prop.title" ng-blur="updatePropDone()" style="color: #000;">
					</li>
					</ul>
					<property-list ng-if="prop.sub_props" properties="prop.sub_props" parent="prop"></property-list>
				</li>
			</ul>`,
			link: function (scope, element, attrs) {
				scope.renameProp = function(id) {
					scope.rename = id;
					$(element[0].querySelector("#prop-item-"+id+" input")).focus();
				};
				scope._renameProp = function(id) {
					scope.rename = id;
					scope.$apply();
					$(element[0].querySelector("#prop-item-"+id+" input")).focus();
				};
			}
		};
	});

	app.controller('ModalAddFormCtrl', function ($uibModalInstance,$http,$rootScope) {
		var self = this;
		$rootScope.bussy=false;

		self.add_form_from_builder = add_form_from_builder;
		self.form = {
			cat_id: $rootScope.currentCat.id,
			form_name: "",
			file:""
		};


		self.ok = function () {
			$rootScope.bussy=true;

			var fd = new FormData();
			fd.append('file', self.form.file);
			fd.append('data', JSON.stringify(self.form));

			$http.post(api+"/form/store", fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).then(function successCallback(response) {
				$uibModalInstance.close(response);
				console.log(response);
				$rootScope.bussy=false;
			}, function errorCallback(response) {
				console.log(response);
				$rootScope.bussy=false;
			});

		};

		self.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

	app.controller('ModalAddCatCtrl', function ($uibModalInstance,cats,$http,$rootScope) {
		var self = this;
		$rootScope.bussy=false;
		self.cats=[];
		console.log(cats);

		for(var i=0;i<cats.length;i++) {
			genlist(cats[i], 0);
		}
		function genlist(cc,level){
			var name = "";
			for(j=0;j<level;j++)
				name+='\xA0\xA0\xA0';
			name += cc.category_name;
			self.cats.push({id: cc.id,category_name:name});
			for(var i=0;i<cc.categorires.length;i++){
				genlist(cc.categorires[i],level+1);
			}
		}

		self.cat = {
			cat_id:0,
			category_name: "",
			category_color:"#000000",
			image_thumb:""
		};


		self.ok = function () {
			console.log(self.cat)
			$rootScope.bussy=true;

			var fd = new FormData();
			fd.append('file', self.cat.image_thumb);
			fd.append('data', JSON.stringify(self.cat));

			$http.post(api+"/store", fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).then(function successCallback(response) {
				$uibModalInstance.close(response);
				console.log(response);
				$rootScope.bussy=false;
			}, function errorCallback(response) {
				console.log(response);
				$rootScope.bussy=false;
			});

		};

		self.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

	app.controller('ModalCopyFromCtrl', function ($uibModalInstance,cats,form,$http,$rootScope) {
		var self = this;
		$rootScope.bussy=false;
		self.cats=[];
		console.log(cats);

		for(var i=0;i<cats.length;i++) {
			genlist(cats[i], 0);
		}
		function genlist(cc,level){
			var name = "";
			for(j=0;j<level;j++)
				name+='\xA0\xA0\xA0';
			name += cc.category_name;
			self.cats.push({id: cc.id,category_name:name});
			for(var i=0;i<cc.categorires.length;i++){
				genlist(cc.categorires[i],level+1);
			}
		}

		self.data = {
			cat_id:0,
			form_id:form.id
		};


		self.ok = function () {
			console.log(self.data);
			if(self.data.cat_id!=0){
				console.log(self.cat)
				$rootScope.bussy=true;

				var fd = new FormData();
				fd.append('data', JSON.stringify(self.data));

				$http.post(api+"/form/copyForm", fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).then(function successCallback(response) {
					$uibModalInstance.close(response);
					console.log(response);
					$rootScope.bussy=false;
				}, function errorCallback(response) {
					console.log(response);
					$rootScope.bussy=false;
				});
			}
		};

		self.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

	app.controller('ModalEditCatCtrl', function ($uibModalInstance,cat,$http,$rootScope) {
		var self = this;
		$rootScope.bussy=false;
		self.cat = cat;
		console.log(self.cat);

		self.ok = function () {
			console.log(self.cat)
			$rootScope.bussy=true;

			var fd = new FormData();
			fd.append('file', self.cat.image_thumb);
			fd.append('data', JSON.stringify(self.cat));

			$http.post(api+"/edit", fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).then(function successCallback(response) {
				$uibModalInstance.close(response);
				console.log(response);
				$rootScope.bussy=false;
			}, function errorCallback(response) {
				console.log(response);
				$rootScope.bussy=false;
			});

		};

		self.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

	app.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			require:'ngModel',
			link: function(scope, element, attrs,ctrl) {
				ctrl.$setValidity('validFile', element.val() != '');

				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;

				element.bind('change', function(){
					ctrl.$setValidity('validFile', element.val() != '');
					scope.$apply(function(){
						ctrl.$setViewValue(element.val());
						ctrl.$render();
					});
					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}]);
})();