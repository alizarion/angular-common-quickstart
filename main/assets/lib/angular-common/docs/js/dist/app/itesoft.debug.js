/**
 *
 */
var IteSoft = angular.module('itesoft', [
    'ngSanitize',
    'ui.bootstrap.tabs',
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'ngAnimate',
    'matchMedia',
    'ui.grid',
    'ui.grid.pagination',
    'ngRoute',
    'pascalprecht.translate',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ui.grid.moveColumns',
    'LocalStorageModule',
    'ngToast'
]);

/**
 * @ngdoc directive
 * @name itesoft.directive:itCompile
 * @module itesoft
 * @restrict EA
 *
 * @description
 * This directive can evaluate and transclude an expression in a scope context.
 *
 * @example
  <example module="itesoft">
    <file name="index.html">
        <div ng-controller="DemoController">
             <div class="jumbotron ">
                 <div it-compile="pleaseCompileThis"></div>
             </div>
    </file>
    <file name="controller.js">
         angular.module('itesoft')
         .controller('DemoController',['$scope', function($scope) {

                $scope.simpleText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
                    'Adipisci architecto, deserunt doloribus libero magni molestiae nisi odio' +
                    ' officiis perferendis repudiandae. Alias blanditiis delectus dicta' +
                    ' laudantium molestiae officia possimus quaerat quibusdam!';

                $scope.pleaseCompileThis = '<h4>This is the compile result</h4><p>{{simpleText}}</p>';
            }]);
    </file>
  </example>
 */
IteSoft
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.directive('itCompile', ['$compile',function($compile) {
            return function (scope, element, attrs) {
                scope.$watch(
                    function (scope) {
                        return scope.$eval(attrs.itCompile);
                    },
                    function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
                );
            };
        }]);
    }]);

/**
 * @ngdoc directive
 * @name itesoft.directive:itModalFullScreen
 * @module itesoft
 * @restrict EA
 *
 * @description
 * print the encapsuled content into full screen modal popup. 42
 *
 * <table class="table">
 *  <tr>
 *   <td><pre><it-modal-full-screen it-open-class="myCssClass"></pre></td>
 *   <td>class to set on the modal popup where is expanded , default class it-modal-background </td>
 *  </tr>
 * <tr>
 *   <td><pre><it-modal-full-screen it-escape-key="27"></pre></td>
 *   <td>it-escape-key keyboard mapping for close action, default 27 "escape key" </td>
 *  </tr>
 * <tr>
 *   <td><pre><it-modal-full-screen it-z-index="700"></pre></td>
 *   <td>set the  z-index of the modal element, by default take highest index of the view.</td>
 *  </tr>
 *  </table>
 * @example
 <example module="itesoft">
     <file name="index.html">
        <div konami style="height:500px">
         <it-modal-full-screen  class="it-fill">
             <div class="jumbotron it-fill" >Lorem ipsum dolor sit amet,
             consectetur adipisicing elit.  Assumenda autem cupiditate dolor dolores dolorum et fugiat inventore
             ipsum maxime, pariatur praesentium quas sit temporibus velit, vitae. Ab blanditiis expedita tenetur.
             </div>
         </it-modal-full-screen>
        </div>
     </file>

 </example>
 */
IteSoft
    .directive('itModalFullScreen',
    [ '$timeout','$window','$document',
        function( $timeout,$window,$document) {

            function _findHighestZIndex()
            {
                var elements = document.getElementsByTagName("*");
                var highest_index = 0;

                for (var i = 0; i < elements.length - 1; i++) {
                    var computedStyles = $window.getComputedStyle(elements[i]);
                    var zindex = parseInt(computedStyles['z-index']);
                    if ((!isNaN(zindex)? zindex : 0 )> highest_index) {
                        highest_index = zindex;
                    }
                }
                return highest_index;
            }

            var TEMPLATE = '<div class="it-modal-full-screen" ng-class="$isModalOpen? $onOpenCss : \'\'">' +
                '<div class="it-modal-full-screen-header pull-right">'+
                '<div  ng-if="$isModalOpen"  class="it-modal-full-screen-button ">' +

                '<button class="btn " ng-click="$closeModal()"><div class="it-animated-ciruclar-button"><i class="fa fa-compress"></i></div></button>' +
                '</div>'+

                '<div  ng-if="!$isModalOpen"  class="it-modal-full-screen-button ">' +
                ' <button class="btn pull-right"  ng-click="$openModal()"><div class="it-animated-ciruclar-button"><i class="fa fa-expand"></i></div></button> ' +
                '</div>'+
                '</div>'+
                '<div  class="it-modal-full-screen-content it-fill"  ng-transclude> </div>' +
                '</div>';

            return {
                restrict: 'EA',
                transclude: true,
                scope: false,
                template: TEMPLATE,
                link : function(scope, iElement, iAttrs, controller){
                    var zindex = (!isNaN(parseInt(iAttrs.itZIndex))? parseInt(iAttrs.itZIndex) : null);
                    scope.$onOpenCss = iAttrs.itOpenClass ?iAttrs.itOpenClass : 'it-modal-background';

                    var escapeKey =   (!isNaN(parseInt(iAttrs.itEscapeKey))? parseInt(iAttrs.itEscapeKey) : 27);
                    var content = angular.element(iElement[0]
                        .querySelector('.it-modal-full-screen'));
                    var contentElement = angular.element(content[0]);
                    scope.$openModal = function () {
                        scope.$isModalOpen = true;
                        var body = document.getElementsByTagName("html");
                        var computedStyles = $window.getComputedStyle(body[0]);
                        var top = parseInt(computedStyles['top']);
                        var marginTop = parseInt(computedStyles['margin-top']);
                        var paddingTop = parseInt(computedStyles['padding-top']);
                        var topSpace = (!isNaN(parseInt(top))? parseInt(top) : 0) +
                            (!isNaN(parseInt(marginTop))? parseInt(marginTop) : 0)
                            + (!isNaN(parseInt(paddingTop))? parseInt(paddingTop) : 0);
                        contentElement.addClass('it-opened');
                        contentElement.css('top', topSpace+'px');
                        if(zindex !== null){
                            contentElement.css('z-index',zindex );
                        } else {
                            contentElement.css('z-index', _findHighestZIndex() +100 );
                        }
                        $timeout(function(){
                            var event = document.createEvent('Event');
                            event.initEvent('resize', true /*bubbles*/, true /*cancelable*/);
                            $window.dispatchEvent(event);
                        },300)
                    };

                    scope.$closeModal = function(){
                        scope.$isModalOpen = false;
                        scope.$applyAsync(function(){
                            contentElement.removeAttr( 'style' );
                            contentElement.removeClass('it-opened');
                            $timeout(function(){
                                var event = document.createEvent('Event');
                                event.initEvent('resize', true /*bubbles*/, true /*cancelable*/);
                                $window.dispatchEvent(event);
                            },300)
                        })
                    };

                    $document.on('keyup', function(e) {
                        if(e){
                            if(e.keyCode == escapeKey){
                                scope.$closeModal();
                            }
                        }
                    });
                }
            }
        }]);


'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itLazyGrid
 * @module itesoft
 * @restrict ECA
 *
 * @description
 * The itLazyGrid widgets provides lazy grid feature on ui-grid
 *
 *
 * ```html
 *    <it-lazy-grid option="option" ></it-lazy-grid>
 * ```
 *
 * <h1>Skinning</h1>
 * Following is the list of structural style classes:
 *
 * <table class="table">
 *  <tr>
 *      <th>
 *          Class
 *      </th>
 *      <th>
 *          Applies
 *      </th>
 *  </tr>
 *  </table>
 *
 *
 * @example
 <example module="itesoft-showcase">
 <file name="index.html">
 <style>
 </style>
 <div ng-controller="HomeCtrl" >
 Query RSQL send to REST API:
    <pre><code class="lang-html">{{query}}</code></pre>
     <div style="height:300px;display:block;">
        <it-lazy-grid options="options" ></it-lazy-grid>
     </div>
    </div>
 </div>
 </div>
 </file>
 <file name="Module.js">
 angular.module('itesoft-showcase',['ngMessages','itesoft']);
 </file>
 <file name="controller.js">
 angular.module('itesoft-showcase')
 .controller('HomeCtrl',['$scope', '$templateCache', function ($scope,$templateCache) {
        $scope.query = "";
        // require to link directive with scope
        $scope.options = {
            // call when lazyGrid is instantiate
            onRegisterApi: function (lazyGrid) {
                $scope.lazyGrid = lazyGrid;
                $scope.lazyGrid.appScope = $scope;
                $scope.lazyGrid.fn.initialize();
                $scope.lazyGrid.fn.callBack = load;
                $scope.lazyGrid.fields.gridOptions.paginationPageSizes = [2,4,20];
                $scope.lazyGrid.fields.gridOptions.paginationPageSize = 2;

                // Call after each loaded event
                $scope.lazyGrid.on.loaded = function () {
                };

                // Call when user click
                $scope.lazyGrid.on.rowSelectionChanged = function (row) {
                    $scope.selectedInvoice = row.entity;
                };

                // Loading columnDef
                 $scope.lazyGrid.fields.gridOptions.columnDefs = [
                     {"name":"type", "cellClass":"type", "cellFilter":"translate", "filterHeaderTemplate":$templateCache.get('dropDownFilter.html'), "headerCellClass":"it-sp-SUPPLIERPORTAL_INVOICES_DOCUMENTTYPE", "visible":true, "width":80, "displayName":"Type", "headerTooltip":"Le document est de type soit facture, soit avoir.", "sorterRsqlKey":"type", "filters":[ { "options":{ "data":[ { "id":"", "value":"Tous" }, { "id":"INVOICE", "value":"Facture" }, { "id":"CREDIT", "value":"Avoir" } ] }, "condition":"==", "class":"width-50", "defaultTerm":"" } ] },
                     { "name": "date", "cellClass": "date", "type": "date", "cellFilter": "date:'dd/MM/yyyy'", "filterHeaderTemplate": $templateCache.get('dateRangeFilter.html'), "headerCellClass": "it-sp-SUPPLIERPORTAL_INVOICES_DATE", "visible": true, "width": "180", "sort": [ { "direction": "desc" } ], "displayName": "Date", "headerTooltip": "Filtre des factures par date d’émission, en indiquant soit une plage de dates, soit la date de début du filtre.", "filters": [ { "emptyOption": "Du", "condition": "=ge=" }, { "emptyOption": "Au", "condition": "=le=" } ] },
                     {"name":"supplierName", "cellClass":"supplierName", "cellFilter":"translate", "filterHeaderTemplate":$templateCache.get('stringFilter.html'), "headerCellClass":"it-sp-SUPPLIERPORTAL_INVOICES_SUPPLIER", "visible":true, "minWidth":150, "displayName":"Fournisseur", "headerTooltip":"Fournisseur concerné par la facture.", "sorterRsqlKey":"supplier.name", "filters":[ { "options":{ "data":[ ] }, "rsqlKey":"supplier.id", "condition":"==", "class":"width-125", "defaultTerm":"" } ]}
                 ];

                //Call when grid is ready to use (with config)
                $scope.$applyAsync(function () {
                   $scope.lazyGrid.fn.initialLoad();
                });
        }};

         // ui-grid loading function, will be call on:
         //-filter
         //-pagination
         //-sorter
        function load(query) {

            // ignore this, it's just for demo
            if(query.size == 2){
                 var data = {"metadata":{"count":2,"maxResult":10},"items":[
                    {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true},
                    ]};
                }else if(query.size == 4){
                 var data = {"metadata":{"count":4,"maxResult":10},"items":[
                    {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true},
                    {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true},
                    ]};
                }else{
                 var data = {"metadata":{"count":10,"maxResult":10},"items":[
                    {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true},
                    {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true},
                    {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true},
                    {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true},
                   {"id":-26,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1540504800000,"dueDate":null,"number":"F049865665","totalAmount":700,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63640","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-26,"companyName":"ma filiale numéro 4","showImage":true},
                    {"id":-14,"status":"SP_AVAILABLE_FOR_PAYMENT","date":1477432800000,"dueDate":null,"number":"INV123456","totalAmount":10235.25,"totalNetAmount":40000.556,"site":"SITE","type":"INVOICE","currency":"EUR","code":"63653","scanDate":null,"batchName":"batch_name","dateChangeState":1446937200000,"custom1":null,"custom2":null,"custom3":null,"custom4":null,"custom5":null,"supplierId":-22,"supplierName":"fournisseur1","companyId":-8,"companyName":"ma filiale numéro 6","showImage":true}
                 ]};
             }
            // end ignore this, it's just for demo
            query = query.build();
            // query RSQL to send to REST API
            console.log(query);
            $scope.query = query;
            $scope.lazyGrid.fields.gridOptions.data = data.items;
            $scope.lazyGrid.fields.gridOptions.totalItems = data.metadata.maxResult;

            $scope.isBusy = false;
            $scope.lazyGrid.on.loaded();
        }
     }
 ]
 );
 </file>
 </example>
 */
IteSoft.directive('itLazyGrid',
                 ['OPERATOR', 'NOTIFICATION_TYPE', 'itQueryFactory', 'itQueryParamFactory', 'itAmountCleanerService', 'localStorageService',  '$rootScope', '$log', '$q', '$templateCache', '$timeout',
        function (OPERATOR, NOTIFICATION_TYPE, itQueryFactory, itQueryParamFactory, itAmountCleanerService, localStorageService, $rootScope, $log, $q, $templateCache,$timeout) {
            return {
                restrict: 'AE',
                scope: {
                    options: '='
                },
                template: '<div ui-grid="lazyGrid.fields.gridOptions"  ui-grid-selection ui-grid-pagination ui-grid-auto-resize="true" class="it-fill it-sp-lazy-grid">' +
                '<div class="it-watermark sp-watermark gridWatermark" ng-show="!lazyGrid.fields.gridOptions.data.length"> {{\'GLOBAL.NO_DATA\' |translate}} </div> </div> ' +
                '<!------------------------------------------------------------------------------------------------------------------------------- FILTER --------------------------------------------------------------------------------------------------------------------------------> ' +
                '<script type="text/ng-template" id="dropDownFilter.html"> <div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> ' +
                '<it-autocomplete items="colFilter.options.data" selected-option="colFilter.term" input-class="col.headerCellClass" option-container-class="colFilter.class"> </div> ' +
                '</script> <script type="text/ng-template" id="dateRangeFilter.html"> ' +
                '<div class="ui-grid-filter-container"> ' +
                '<span ng-repeat="colFilter in col.filters" class="{{col.headerCellClass}}"> ' +
                '<input type="text" class="form-control {{col.headerCellClass}}_{{colFilter.emptyOption}}" style="width: 75px;display:inline;margin-left: 1px;margin-right: 1px" ' +
                'placeholder="{{colFilter.emptyOption | translate}}" ng-model="colFilter.term" data-min-date="01/01/1980" data-max-date="01/01/2100" data-autoclose="1" ' +
                'name="date2" data-date-format="{{\'GLOBAL.DATE.FORMAT\' | translate}}" bs-datepicker> </span> </div> ' +
                '</script> <script type="text/ng-template" id="stringFilter.html"> ' +
                '<div class="ui-grid-filter-container {{col.headerCellClass}}" ng-repeat="colFilter in col.filters"> ' +
                '<input type="text" class="form-control" ng-model="colFilter.term" pattern="{{colFilter.pattern}}" placeholder="{{colFilter.emptyOption | translate}}"> </div>' +
                ' </script> ' +
                '<!------------------------------------------------------------------------------------------------------------------------------- PAGINATOR --------------------------------------------------------------------------------------------------------------------------------> ' +
                '<script type="text/ng-template" id="paginationTemplate.html"> ' +
                '<div role="contentinfo" class="ui-grid-pager-panel" ui-grid-pager ng-show="grid.options.enablePaginationControls"> ' +
                '<div role="navigation" class="ui-grid-pager-container"> ' +
                '<div role="menubar" class="ui-grid-pager-control"> ' +
                '<button type="button" role="menuitem" class="ui-grid-pager-first it-sp-grid-pager-first" bs-tooltip title="{{ \'HELP.FIRSTPAGE\' | translate }}" ng-click="pageFirstPageClick()" ng-disabled="cantPageBackward()"> ' +
                '<div class="first-triangle"> <div class="first-bar"> </div> </div> ' +
                '</button> <button type="button" role="menuitem" class="ui-grid-pager-previous it-sp-grid-pager-previous" ' +
                'bs-tooltip title="{{ \'HELP.PREVPAGE\' | translate }}" ng-click="pagePreviousPageClick()" ng-disabled="cantPageBackward()"> ' +
                '<div class="first-triangle prev-triangle"></div> </button> ' +
                '<input type="number" class="ui-grid-pager-control-input it-sp-grid-pager-control-input" ng-model="grid.options.paginationCurrentPage" min="1" max="{{ paginationApi.getTotalPages() }}" required/> ' +
                '<span class="ui-grid-pager-max-pages-number it-sp-grid-pager-max-pages-number" ng-show="paginationApi.getTotalPages() > 0"> <abbr> / </abbr> ' +
                '{{ paginationApi.getTotalPages() }} ' +
                '</span> <button type="button" role="menuitem" class="ui-grid-pager-next it-sp-grid-pager-next "' +
                ' bs-tooltip title="{{ \'HELP.NEXTPAGE\' | translate }}" ng-click="pageNextPageClick()" ng-disabled="cantPageForward()"> ' +
                '<div class="last-triangle next-triangle">' +
                '</div> ' +
                '</button> ' +
                '<button type="button" role="menuitem" class="ui-grid-pager-last it-sp-grid-pager-last" bs-tooltip title="{{ \'HELP.FIRSTPAGE\' | translate }}" ng-click="pageLastPageClick()" ng-disabled="cantPageToLast()"> ' +
                '<div class="last-triangle"> ' +
                '<div class="last-bar"> ' +
                '</div> </div> ' +
                '</button> </div> ' +
                '<div class="ui-grid-pager-row-count-picker it-sp-grid-pager-row-count-picker" ng-if="grid.options.paginationPageSizes.length > 1"> ' +
                '<select ui-grid-one-bind-aria-labelledby-grid="\'items-per-page-label\'" ng-model="grid.options.paginationPageSize" ng-options="o as o for o in grid.options.paginationPageSizes"></select>' +
                '<span ui-grid-one-bind-id-grid="\'items-per-page-label\'" class="ui-grid-pager-row-count-label"> &nbsp; </span> ' +
                '</div> ' +
                '<span ng-if="grid.options.paginationPageSizes.length <= 1" class="ui-grid-pager-row-count-label it-sp-grid-pager-row-count-label"> ' +
                '{{grid.options.paginationPageSize}}&nbsp;{{sizesLabel}} ' +
                '</span> </div> ' +
                '<div class="ui-grid-pager-count-container">' +
                '<div class="ui-grid-pager-count"> ' +
                '<span class="it-sp-grid-pager-footer-text" ng-show="grid.options.totalItems > 0"> ' +
                '{{\'PAGINATION.INVOICE.FROM\' | translate}} {{showingLow}} <abbr> </abbr> ' +
                '{{\'PAGINATION.INVOICE.TO\' | translate}} {{showingHigh}} {{\'PAGINATION.INVOICE.ON\' | translate}} {{grid.options.totalItems}} ' +
                '{{\'PAGINATION.INVOICE.TOTAL\' | translate}} </span>' +
                ' </div> </div> </div> ' +
                '</script>',
                controllerAs: 'lazyGrid',
                controller: ['$scope', function ($scope) {


                    //Get current locale
                    var locale = localStorageService.get('Locale');

                    var self = this;

                    self.options = $scope.options;

                    /**
                     * Fields
                     * @type {{filter: Array, externalFilter: {}, gridApi: {}, paginationOptions: {pageNumber: number, pageSize: number, sort: {name: undefined, direction: undefined}}, appScope: {}}}
                     */
                    self.fields = {
                        template: {pagination: $templateCache.get('paginationTemplate.html')},
                        filter: [],
                        externalFilter: {},
                        gridApi: {},
                        gridOptions: {},
                        paginationOptions: {},
                        appScope: {},
                        promise: {refresh: {}}
                    };

                    /**
                     * Event callback method
                     * @type {{loaded: onLoaded, ready: onReady, filterChange: onFilterChange, sortChange: onSortChange, paginationChanged: onPaginationChanged, rowSelectionChanged: onRowSelectionChanged}}
                     */
                    self.on = {
                        loaded: onLoaded,
                        ready: onReady,
                        filterChange: onFilterChange,
                        sortChange: onSortChange,
                        paginationChanged: onPaginationChanged,
                        rowSelectionChanged: onRowSelectionChanged
                    };
                    /**
                     * Public Method
                     * @type {{callBack: *, initialize: initialize, getGrid: getGrid, refresh: refresh, initialLoad: initialLoad, addExternalFilter: addExternalFilter}}
                     */
                    self.fn = {
                        callBack: self.options.callBack,
                        initialize: initialize,
                        refresh: refresh,
                        initialLoad: initialLoad,
                        addExternalFilter: addExternalFilter
                    };


                    /**
                     *
                     * @type {{pageNumber: number, pageSize: number, sort: {name: undefined, direction: undefined}}}
                     */
                    self.fields.paginationOptions = {
                        pageNumber: 1,
                        pageSize: 10,
                        sort: {
                            name: undefined,
                            direction: undefined
                        }
                    };
                    /**
                     * Default grid options
                     * @type {{enableFiltering: boolean, enableSorting: boolean, enableColumnMenus: boolean, useExternalPagination: boolean, useExternalSorting: boolean, enableRowSelection: boolean, enableRowHeaderSelection: boolean, multiSelect: boolean, modifierKeysToMultiSelect: boolean, noUnselect: boolean, useExternalFiltering: boolean, data: Array, columnDefs: Array, paginationTemplate: *, onRegisterApi: self.fields.gridOptions.onRegisterApi}}
                     */
                    self.fields.gridOptions = {
                        enableFiltering: true,
                        enableSorting: true,
                        enableColumnMenus: false,
                        useExternalPagination: true,
                        useExternalSorting: true,
                        enableRowSelection: true,
                        enableRowHeaderSelection: false,
                        multiSelect: false,
                        modifierKeysToMultiSelect: false,
                        noUnselect: true,
                        useExternalFiltering: true,
                        data: [],
                        columnDefs: [],
                        paginationTemplate: self.fields.template.pagination,
                        onRegisterApi: function (gridApi) {
                            gridApi.core.on.filterChanged(self.appScope, self.on.filterChange);
                            gridApi.core.on.sortChanged(self.appScope, self.on.sortChange);
                            gridApi.pagination.on.paginationChanged(self.appScope, self.on.paginationChanged);
                            gridApi.selection.on.rowSelectionChanged(self.appScope, self.on.rowSelectionChanged);
                            self.fields.gridApi = gridApi;
                            $log.debug('LazyGrid:UI-grid:onRegisterApi')
                        }
                    };
                    /**
                     * Apply external filter
                     * @private
                     */
                    function _applyExternalFilter() {
                        $log.debug("LazyGrid:Apply External filter");
                        angular.forEach(self.fields.externalFilter, function (externalFilter, key) {
                            if (!angular.isUndefined(key) && !angular.isUndefined(externalFilter.value) && !angular.isUndefined(externalFilter.condition)) {
                                var queryParam = itQueryParamFactory.create(key, externalFilter.value, externalFilter.condition);
                                self.fields.filter.push(queryParam);
                            }
                        });
                    }

                    /**
                     * Apply filter
                     * @private
                     */
                    function _applyFilter() {
                        $log.debug("LazyGrid:Apply filter");
                        var key = '';
                        var value = '';
                        var condition = OPERATOR.EQUALS;
                        if(angular.isDefined(self.fields.gridApi.grid)) {
                            for (var i = 0; i < self.fields.gridApi.grid.columns.length; i++) {
                                key = self.fields.gridApi.grid.columns[i].field;
                                for (var j = 0; j < self.fields.gridApi.grid.columns[i].filters.length; j++) {
                                    value = self.fields.gridApi.grid.columns[i].filters[j].term;
                                    if (value != undefined && value != '') {
                                        $log.debug("LazyGrid:Filter changed, fieds: " + key + ", and value: " + value);
                                        // if filter key is override
                                        var rsqlKey = self.fields.gridApi.grid.columns[i].filters[j].rsqlKey;
                                        if (rsqlKey != undefined) {
                                            key = rsqlKey;
                                        }

                                        if (self.fields.gridApi.grid.columns[i].filters[j].condition != undefined) {
                                            condition = self.fields.gridApi.grid.columns[i].filters[j].condition;
                                        }

                                        //Si la donnée doit être traitée comme un nombre
                                        if (self.fields.gridApi.grid.columns[i].filters[j].amount == true) {
                                            value = itAmountCleanerService.cleanAmount(value, locale);
                                        }

                                        var queryParam = itQueryParamFactory.create(key, value, condition);
                                        self.fields.filter.push(queryParam);
                                    }
                                }
                            }
                        }
                    }

                    /**
                     * Apply default filter configured inside columnDef filter option
                     * @private
                     */
                    function _applyDefaultFilter() {
                        $log.debug("LazyGrid:Apply default filter");
                        if(angular.isDefined(self.fields.gridApi.grid)) {
                            angular.forEach(self.fields.gridApi.grid.columns, function (column) {
                                if (angular.isDefined(column) && angular.isDefined(column.colDef) && angular.isDefined(column.colDef.filters) && angular.isDefined(column.colDef.filters[0]) && angular.isDefined(column.colDef.filters[0].defaultTerm)) {
                                    if (!angular.isUndefined(column.field) && !angular.isUndefined(column.colDef.filters[0].defaultTerm)) {
                                        //Apparemment ne sert pas car le _applyFilter récupère les données dans les columns
                                        //if (angular.isDefined(column.colDef.filters[0].defaultTerm) && column.colDef.filters[0].defaultTerm != '') {
                                        //    var queryParamClient = QueryParamFactory.create(column.field, column.colDef.filters[0].defaultTerm, OPERATOR.EQUALS);
                                        //    self.fields.filter.push(queryParamClient);
                                        //}
                                        column.colDef.filters[0].term = column.colDef.filters[0].defaultTerm;

                                        $log.debug("LazyGrid:Apply default filter: " + column.field + "->" + column.colDef.filters[0].term);
                                    }
                                }
                            });
                        }
                    }

                    /**
                     * Call after each loading
                     */
                    function onLoaded() {
                    }

                    /**
                     * Call when grid is ready, when config is loaded (columnDef is present)
                     */
                    function onReady() {
                    }

                    /**
                     * Call on filter change
                     */
                    function onFilterChange() {
                        $log.debug("LazyGrid:Filter Changed");
                        self.fields.filter = [];
                        if (angular.isDefined(self.fields.promise.refresh)) {
                            $timeout.cancel(self.fields.promise.refresh);
                        }
                        self.fields.promise.refresh = $timeout(function () {
                                self.fn.refresh();
                            }
                            , 1000);

                    }

                    /**
                     * Call on sort change
                     * @param grid
                     * @param sortColumns
                     */
                    function onSortChange(grid, sortColumns) {
                        $log.debug("LazyGrid:Sort Changed");
                        self.fields.filter = [];
                        if (sortColumns.length == 0) {
                            self.fields.paginationOptions.sort.name = undefined;
                            self.fields.paginationOptions.sort.direction = undefined;
                        } else {
                            var sortKey = sortColumns[0].name;
                            /**
                             * Surcharge avec la clé rsql
                             */
                            if (angular.isDefined(sortColumns[0]) && angular.isDefined(sortColumns[0].colDef) && angular.isDefined(sortColumns[0].colDef.sorterRsqlKey)) {
                                sortKey = sortColumns[0].colDef.sorterRsqlKey;
                            }
                            self.fields.paginationOptions.sort.name = sortKey;
                            self.fields.paginationOptions.sort.direction = sortColumns[0].sort.direction;
                            $log.debug("sort changed, sort key: " + sortColumns[0].name + ", and direction: " + sortColumns[0].sort.direction);
                        }
                        self.fn.refresh();
                    }

                    /**
                     * Call when page changed
                     * @param newPage
                     * @param pageSize
                     */
                    function onPaginationChanged(newPage, pageSize) {
                        $log.debug("LazyGrid:Pagination Changed");
                        self.fields.filter = [];
                        if (self.fields.paginationOptions.pageNumber != newPage || self.fields.paginationOptions.pageSize != pageSize) {
                            self.fields.paginationOptions.pageNumber = newPage;
                            self.fields.paginationOptions.pageSize = pageSize;
                            self.fn.refresh();
                        }
                    }

                    /**
                     * Call when user click on row
                     */
                    function onRowSelectionChanged() {
                        $log.debug("LazyGrid:Row Selection Changed");
                    }

                    /**
                     * Call to refresh data
                     */
                    function refresh() {
                        $log.debug("LazyGrid:Refresh");
                        _applyExternalFilter();
                        _applyFilter();
                        var firstRow = (self.fields.paginationOptions.pageNumber - 1) * self.fields.paginationOptions.pageSize;
                        var query = itQueryFactory.create(self.fields.filter, firstRow, self.fields.paginationOptions.pageSize, self.fields.paginationOptions.sort);
                        self.fn.callBack(query);
                    }

                    /**
                     * Initial loading
                     */
                    function initialLoad() {
                        $log.debug("LazyGrid:Initial load");

                        //application des filtres pour récupérer le nom de filtre actifs
                        _applyFilter();
                        if (self.fields.filter.length <= 0) {
                            _applyDefaultFilter();
                        }
                        //remise à 0 des informations de filtre
                        self.fields.filter = [];

                        self.fn.refresh();
                    }

                    /**
                     * Add external filter like clientId
                     * @param filter external filter to always apply
                     * @param filter.key
                     * @param filter.value
                     * @param filter.condition
                     */
                    function addExternalFilter(filter) {
                        if (angular.isUndefined(filter.key)) {
                            $log.error("External filter object must have key");
                            return;
                        }
                        if (angular.isUndefined(filter.condition)) {
                            $log.error("External filter object must have condition");
                            return;
                        }
                        if (angular.isUndefined(filter.value)) {
                            self.fields.externalFilter[filter.key] = {};
                        } else {
                            self.fields.externalFilter[filter.key] = filter;
                        }
                    }

                    /**
                     * Call before using
                     * @returns {*}
                     */
                    function initialize() {

                    }

                    if (angular.isDefined(self.options.onRegisterApi)) {
                        self.options.onRegisterApi(self);
                        $log.debug('LazyGrid:onRegisterApi')
                    }


                }]
            }
        }
    ]
).constant("OPERATOR", {
        "EQUALS": "==",
        "LIKE": "==%",
        "NOT_EQUALS": "!=",
        "LESS_THAN": "=lt=",
        "LESS_EQUALS": "=le=",
        "GREATER_THAN": "=gt=",
        "GREATER_EQUALS": "=ge="
})
.constant('NOTIFICATION_TYPE', {
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS",
    DISMISS: "DISMISS"
})
;
"use strict";

/**
 * @ngdoc directive
 * @name itesoft.directive:itBusyIndicator
 * @module itesoft
 * @restrict EA
 *
 * @description
 * <li>Simple loading spinner displayed instead of the screen while waiting to fill the data.</li>
 * <li>It has 2 usage modes:
 * <ul>
 *     <li> manual : based on "is-busy" attribute value to manage into the controller.</li>
 *     <li> automatic : no need to use "is-busy" attribute , automatically displayed while handling http request pending.</li>
 * </ul>
 * </li>
 *
 * @usage
 * <it-busy-indicator is-busy="true">
 * </it-busy-indicator>
 *
 * @example
 <example module="itesoft-showcase">
 <file name="index.html">
 <div ng-controller="LoaderDemoController">
     <it-busy-indicator is-busy="loading">
     <div class="container-fluid">
     <div class="jumbotron">
     <button class="btn btn-primary" ng-click="loadData()">Start Loading (manual mode)</button>
    <button class="btn btn-primary" ng-click="loadAutoData()">Start Loading (auto mode)</button>
     <div class="row">
     <table class="table table-striped table-hover ">
     <thead>
     <tr>
     <th>#</th>
     <th>title</th>
     <th>url</th>
     <th>image</th>
     </tr>
     </thead>
     <tbody>
     <tr ng-repeat="dataItem in data">
     <td>{{dataItem.id}}</td>
     <td>{{dataItem.title}}</td>
     <td>{{dataItem.url}}</td>
     <td><img ng-src="{{dataItem.thumbnailUrl}}" alt="">{{dataItem.body}}</td>
     </tr>
     </tbody>
     </table>
     </div>
     </div>
     </div>
     </it-busy-indicator>
 </div>
 </file>
 <file name="Module.js">
 angular.module('itesoft-showcase',['ngResource','itesoft']);
 </file>
 <file name="PhotosService.js">
 angular.module('itesoft-showcase')
 .factory('Photos',['$resource', function($resource){
                                return $resource('http://jsonplaceholder.typicode.com/photos/:id',null,{});
                            }]);
 </file>
 <file name="Controller.js">
 angular.module('itesoft-showcase')
 .controller('LoaderDemoController',['$scope','Photos','$timeout', function($scope,Photos,$timeout) {
        $scope.loading = false;

        var loadInternalData = function () {
            var data = [];
            for (var i = 0; i < 15; i++) {
                var dataItem = {
                    "id" : i,
                    "title": "title " + i,
                    "url" : "url " + i
                };
                data.push(dataItem);
            }
            return data;
        };

        $scope.loadData = function() {
            $scope.data = [];
            $scope.loading = true;

            $timeout(function() {
                $scope.data = loadInternalData();
            },500)
            .then(function(){
                $scope.loading = false;
            });
        }

        $scope.loadAutoData = function() {
            $scope.data = [];
            Photos.query().$promise
            .then(function(data){
                $scope.data = data;
            });
        }
 }]);
 </file>

 </example>
 *
 **/

IteSoft
    .directive('itBusyIndicator', ['$timeout', '$http', function ($timeout, $http) {
        var _loadingTimeout;

        function link(scope, element, attrs) {
            scope.$watch(function () {
                return ($http.pendingRequests.length > 0);
            }, function (value) {
                if (_loadingTimeout) $timeout.cancel(_loadingTimeout);
                if (value === true) {
                    _loadingTimeout = $timeout(function () {
                        scope.hasPendingRequests = true;
                    }, 250);
                }
                else {
                    scope.hasPendingRequests = false;
                }
            });
        }

        return {
            link: link,
            restrict: 'AE',
            transclude: true,
            scope: {
                isBusy:'='
            },
            template:   '<div class="mask-loading-container" ng-show="hasPendingRequests"></div>' +
                '<div class="main-loading-container" ng-show="hasPendingRequests || isBusy"><i class="fa fa-circle-o-notch fa-spin fa-4x text-primary "></i></div>' +
                '<ng-transclude ng-show="!isBusy" class="it-fill"></ng-transclude>'
        };
    }]);
"use strict";


/**
 * @ngdoc directive
 * @name itesoft.directive:itLoader
 * @module itesoft
 * @restrict EA
 *
 * @description
 * Simple loading spinner that handle http request pending.
 *
 *
 * @example
    <example module="itesoft-showcase">
        <file name="index.html">
            <div ng-controller="LoaderDemoController">
                 <div class="jumbotron ">
                 <div class="bs-component">
                 <button class="btn btn-primary" ng-click="loadMoreData()">Load more</button>
                 <it-loader></it-loader>
                 <table class="table table-striped table-hover ">
                 <thead>
                 <tr>
                 <th>#</th>
                 <th>title</th>
                 <th>url</th>
                 <th>image</th>
                 </tr>
                 </thead>
                 <tbody>
                 <tr ng-repeat="data in datas">
                 <td>{{data.id}}</td>
                 <td>{{data.title}}</td>
                 <td>{{data.url}}</td>
                 <td><img ng-src="{{data.thumbnailUrl}}" alt="">{{data.body}}</td>
                 </tr>
                 </tbody>
                 </table>
                 <div class="btn btn-primary btn-xs" style="display: none;">&lt; &gt;</div></div>
                 </div>
            </div>
        </file>
         <file name="Module.js">
             angular.module('itesoft-showcase',['ngResource','itesoft']);
         </file>
         <file name="PhotosService.js">
          angular.module('itesoft-showcase')
                .factory('Photos',['$resource', function($resource){
                                return $resource('http://jsonplaceholder.typicode.com/photos/:id',null,{});
                            }]);
         </file>
         <file name="Controller.js">
             angular.module('itesoft-showcase')
                     .controller('LoaderDemoController',['$scope','Photos', function($scope,Photos) {
                            $scope.datas = [];

                            $scope.loadMoreData = function(){
                                Photos.query().$promise.then(function(datas){
                                    $scope.datas = datas;
                                });
                     };
             }]);
         </file>

    </example>
 *
 **/
IteSoft
    .directive('itLoader',['$http','$rootScope', function ($http,$rootScope) {
        return {
            restrict : 'EA',
            scope:true,
            template : '<span class="fa-stack">' +
                            '<i class="fa fa-refresh fa-stack-1x" ng-class="{\'fa-spin\':$isLoading}">' +
                            '</i>' +
                        '</span>',
            link : function ($scope) {
                $scope.$watch(function() {
                    if($http.pendingRequests.length>0){
                        $scope.$applyAsync(function(){
                            $scope.$isLoading = true;
                        });

                    } else {
                        $scope.$applyAsync(function(){
                            $scope.$isLoading = false;
                        });

                    }
                });

            }
        }
    }]
);
"use strict";
/**
 * @ngdoc directive
 * @name itesoft.directive:itDetail
 * @module itesoft
 * @restrict EA
 *
 * @description
 * A container element for detail part of the master-detail main content.
 *
 * To use master details directive, add an {@link itesoft.directive:itMasterDetail `<it-master-detail>`} parent element. This will encompass all master details content,
 * and have 2 child elements: 1 {@link itesoft.directive:itMaster `<it-master>`} for the list selectable content,
 * and {@link itesoft.directive:itDetail `<it-detail>`} that display the content of the selected item.
 *
 *
 * ```html
 * <it-master-detail>
 *   <!-- Master Content content -->
 *
 *   <it-master>
 *       <it-master-header>
 *       </it-master-header>
 *   </it-master>
 *
 *   <!-- menu -->
 *   <it-detail>
 *        <it-detail-header>
 *       </it-detail-header>
 *
 *       <it-detail-content>
 *       </it-detail-content>
 *   </it-detail>
 *
 * </it-master-detail>
 * ```
 */
IteSoft
    .directive('itDetail',[function() {
        return {
            restrict: 'EA',
            require: '^itMasterDetail',
            transclude: true,
            scope: false,
            template: ' <div ng-show="($parent.$parent.desktop || ($parent.$parent.activeState == \'detail\' &&$parent.$parent.mobile))"' +
                '   ng-if="currentItemWrapper.currentItem" ' +
                ' class="it-master-detail-slide-left col-md-{{$masterCol ? (12-$masterCol) : 6}} it-fill" >' +
                ' <div class="it-fill" ng-transclude>' +
                '</div>' +
                '</div>' +
                '<div  ng-show="($parent.$parent.desktop || ($parent.$parent.activeState == \'detail\' &&$parent.$parent.mobile))" ' +
                'class="col-md-{{$masterCol ? (12-$masterCol) : 6}} it-fill" ' +
                'ng-if="!currentItemWrapper.currentItem">' +
                '<div class="it-watermark" >{{$itNoDetail}}</div>' +
                '</div>'
        }
    }]);

"use strict";
/**
 * @ngdoc directive
 * @name itesoft.directive:itDetailContent
 * @module itesoft
 * @restrict EA
 *
 * @description
 * A container element for detail part of the master-detail main content.
 *
 * To use master details directive, add an {@link itesoft.directive:itMasterDetail `<it-master-detail>`} parent element. This will encompass all master details content,
 * and have 2 child elements: 1 {@link itesoft.directive:itMaster `<it-master>`} for the list selectable content,
 * and {@link itesoft.directive:itDetail `<it-detail>`} that display the content of the selected item.
 *
 *
 * ```html
 * <it-master-detail>
 *   <!-- Master Content content -->
 *
 *   <it-master>
 *       <it-master-header>
 *       </it-master-header>
 *   </it-master>
 *
 *   <!-- menu -->
 *   <it-detail>
 *        <it-detail-header>
 *       </it-detail-header>
 *
 *       <it-detail-content>
 *       </it-detail-content>
 *   </it-detail>
 *
 * </it-master-detail>
 * ```
 */
IteSoft
    .directive('itDetailContent',function() {
        return {
            restrict: 'EA',
            require: '^itDetail',
            transclude: true,
            scope:false,
            template : '<div class="row it-fill">' +
                ' <div class="col-md-12  it-fill" ng-transclude>'+

                            '</div>'+
                       '</div>'

        }
    });
"use strict";
/**
 * @ngdoc directive
 * @name itesoft.directive:itDetailHeader
 * @module itesoft
 * @restrict EA
 *
 * @description
 * A container element for detail header, MUST be include in {@link itesoft.directive:itDetail `<it-detail>`} .
 * for more information see {@link itesoft.directive:itMasterDetail `<it-master-detail>`}.
 *
 * ```html
 * <it-master-detail>
 *   <!-- Master Content content -->
 *
 *   <it-master>
 *       <it-master-header>
 *       </it-master-header>
 *   </it-master>
 *
 *   <!-- menu -->
 *   <it-detail>
 *        <it-detail-header>
 *           <button class="btn btn-primary" title="Add" ng-disabled="currentItemWrapper.hasChanged" ng-click="myAction()"><span class="fa fa-plus fa-lg"></span></button>
 *       </it-detail-header>
 *
 *       <it-detail-content>
 *       </it-detail-content>
 *   </it-detail>
 *
 * </it-master-detail>
 * ```
 */
IteSoft
    .directive('itDetailHeader',function() {
        return {
            restrict: 'EA',
            require : '^itDetail',
            scope : false,
            transclude: true,
            template : '<div class="fluid-container"><div class="row it-md-header">'+
                '<div class="col-md-2 it-fill  col-xs-2">' +
                '<a href="" ng-if="$parent.$parent.$parent.mobile" ng-click="$parent.$parent.$parent.$parent.goToMaster()" class="it-material-design-hamburger__icon pull-left it-fill "> ' +
                '<span  class="menu-animated it-material-design-hamburger__layer " ng-class="{\'it-material-design-hamburger__icon--to-arrow\':$parent.$parent.$parent.$parent.mobile}"> ' +
                '</span>' +
                ' </a>'+
                '</div>'+
                '<div class="col-md-10 col-xs-10 it-fill ">'+
                '<div class="btn-toolbar  it-fill pull-right " ng-transclude>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>'
        }

    });
"use strict";
/**
 * @ngdoc directive
 * @name itesoft.directive:itMaster
 * @module itesoft
 * @restrict EA
 *
 * @description
 * Most important part of master-detail component, that
 *
 * To use master details directive, add an  {@link itesoft.directive:itMasterDetail `<it-master-detail>`} parent element. This will encompass all master details content,
 * and have 2 child elements: 1  {@link itesoft.directive:itMaster `<it-master>`} for the list selectable content,
 * and {@link itesoft.directive:itDetail `<it-detail>`} that display the content of the selected item.
 * * for more information see {@link itesoft.directive:itMasterDetail `<it-master-detail>`}.
 * <table class="table">
 *  <tr>
 *   <td><code>masterDetail.getSelectedItems()</code></td>
 *   <td>Method to get selected items in the master grid.</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.getCurrentItemWrapper()</code></td>
 *   <td>Method to get the selected item wrapper that contain next attributes [originalItem ,currentItem, hasChanged ] .</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.undoChangeCurrentItem()</code></td>
 *   <td>Method to revert changes on the selected item.</td>
 *  </tr>
 * <tr>
 *   <td><code>masterDetail.getFilteredItems()</code></td>
 *   <td>Method to get displayed item after filter.</td>
 *  </tr>
 *  <tr>
 * <tr>
 *   <td><code>masterDetail.fillHeight()</code></td>
 *   <td>method refresh the master detail Height.</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.setCurrentItem(entity)</code></td>
 *   <td>Method to define the selected item, return promise</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.scrollToItem(item)</code></td>
 *   <td>Method to scroll to the entity row.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$scope.$broadcast('unlockCurrentItem')</code></td>
 *   <td>unlock the selected item from the editing mode.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$scope.$broadcast('lockCurrentItem',unlockOnEquals)</code></td>
 *   <td>lock the selected item from the editing mode. unlockOnEquals : default true | auto unlock the item if the changed item is equals to the original selected item, if set to false only the $scope.$broadcast('unlockCurrentItem') can unlock it.</td>
 *  </tr>
 *  <tr>
 *   <td><code>grid.appScope.itAppScope</code></td>
 *   <td>access to your application scope from the master-detail context, mainly for template binding</td>
 *  </tr>
 * </table>
 *
 * ```html
 * <it-master-detail>
 *   <!-- Master Content content -->
 *
 *   <it-master>
 *       <it-master-header>
 *       </it-master-header>
 *   </it-master>
 *
 *   <!-- menu -->
 *   <it-detail>
 *   </it-detail>
 *
 * </it-master-detail>
 * ```
 *
 */
IteSoft
    .directive('itMaster',function(){
        return {
            restrict : 'EA',
            require : '^itMasterDetail',
            priority : -1,
            transclude : true,
            scope : {
                itMasterData : '=',
                itLang:'=',
                itCol:'=',
                itMasterDetailControl:'=',
                itLockOnChange: '=',
                itNoDataMsg: '@',
                itNoDetailMsg:'@'
            },
            template : '<div  ng-show="($parent.$parent.activeState == \'master\')" class=" it-master it-master-detail-slide-right col-md-{{itCol ? itCol : 6}} it-fill " ui-i18n="{{itLang}}">'+
                '<div class="row" ng-transclude>'+
                '</div>'+
                '<div class="row it-master-grid it-fill" >'+
                '<div class="col-md-12 it-fill">'+
                '<div ui-grid="gridOptions" ui-grid-selection ui-grid-resize-columns  ui-grid-move-columns  ui-grid-auto-resize class="it-master-detail-grid it-fill ">' +
                '<div class="it-watermark" ng-show="!gridOptions.data.length" >{{itNoDataMsg}}</div>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>',
            controller : ['$scope',
                '$filter',
                '$q',
                '$timeout',
                'itPopup',
                '$templateCache',
                '$route',
                '$window',
                function ($scope,
                          $filter,
                          $q,
                          $timeout,
                          itPopup,
                          $templateCache,
                          $route,
                          $window){

                    $templateCache.put('ui-grid/selectionRowHeaderButtons','<div class="it-master-detail-row-select"' +
                        ' ng-class="{\'ui-grid-row-selected\': row.isSelected}" >' +
                        '<input type="checkbox" ng-disabled="grid.appScope.$parent.currentItemWrapper.hasChanged && grid.appScope.itLockOnChange " tabindex="-1" ' +
                        ' ng-checked="row.isSelected"></div>');

                    $templateCache.put('ui-grid/selectionSelectAllButtons','<div class="it-master-detail-select-all-header" ng-click="(grid.appScope.$parent.currentItemWrapper.hasChanged && grid.appScope.itLockOnChange  )? \'return false\':headerButtonClick($event)">' +
                        '<input type="checkbox" ' +
                        ' ng-change="headerButtonClick($event)" ng-disabled="grid.appScope.$parent.currentItemWrapper.hasChanged  && grid.appScope.itLockOnChange" ng-model="grid.selection.selectAll"></div>');

                    function ItemWrapper(item){
                        var _self = this;
                        angular.forEach($scope.itMasterData,function(entry,index){

                            if(angular.equals(entry,item)) {
                                _self.index = index;
                            }
                        });
                        _self.originalItem = item;
                        _self.currentItem = angular.copy(item);
                        _self.hasChanged = false;
                        _self.isWatched = false;
                        _self.unlockOnEquals = true;
                    }

                    $scope.$parent.$masterCol = $scope.itCol;
                    ItemWrapper.prototype.unlockCurrent = function(){
                        this.hasChanged = false;
                        this.isWatched = false;
                    };

                    ItemWrapper.prototype.lockCurrent = function(autoUnlock){
                        this.hasChanged = true;
                        this.isWatched = true;
                        this.unlockOnEquals = !autoUnlock;
                    };



                    $scope.$parent.currentItemWrapper = null;

                    function _selectionChangedHandler(row){
                        if(!$scope.itMasterDetailControl.disableMultiSelect){
                            if($scope.gridApi.selection.getSelectedRows().length > 1 ){
                                $scope.$parent.currentItemWrapper = null;
                            } else if($scope.gridApi.selection.getSelectedRows().length === 1) {
                                _displayDetail($scope.gridApi.selection.getSelectedRows()[0]);
                                _scrollToEntity($scope.gridApi.selection.getSelectedRows()[0]);
                            }
                            else if($scope.gridApi.selection.getSelectedRows().length === 0) {
                                $scope.$parent.currentItemWrapper = null;
                            }
                        }else {
//                            _displayDetail(row.entity);
//                            _scrollToEntity(row.entity);
                        }
                    }

                    $scope.$parent.$itNoDetail = $scope.itNoDetailMsg;


                    $scope.gridOptions  = {
                        rowHeight: 40,
                        data : $scope.itMasterData,
                        multiSelect: !$scope.itMasterDetailControl.disableMultiSelect,
                        enableSelectAll: !$scope.itMasterDetailControl.disableMultiSelect,
                        enableRowHeaderSelection:!$scope.itMasterDetailControl.disableMultiSelect,
                        showGridFooter: true,
                        enableMinHeightCheck :true,
                        enableColumnResizing: true,
                        enableHorizontalScrollbar : 0,
                        enableVerticalScrollbar : 2,
                        onRegisterApi : function(gridApi){
                            $scope.gridApi = gridApi;
                            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                                _selectionChangedHandler(row);
                            });
                            gridApi.selection.on.rowSelectionChangedBatch($scope,function(row){
                                _selectionChangedHandler(row);
                            });

                        },
                        gridFooterTemplate: '<div class="ui-grid-footer-info ui-grid-grid-footer"> ' +
                            '<span class="ngLabel badge ">{{"search.totalItems" |t}}  {{grid.appScope.itMasterData.length}}</span> ' +
                            '<span ng-show="grid.appScope.filterText.length > 0 && grid.appScope.itMasterData.length != grid.renderContainers.body.visibleRowCache.length" class="ngLabel badge alert-info ">{{"search.showingItems" |t}}  {{grid.renderContainers.body.visibleRowCache.length}}</span> ' +
                            '<span ng-show="!grid.appScope.itMasterDetailControl.disableMultiSelect" class="ngLabel badge">{{"search.selectedItems" | t}} {{grid.appScope.gridApi.selection.getSelectedRows().length}}</span>' +
                            '</div>',
                        rowTemplate: '<div ng-click="grid.appScope.onRowClick(col,row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell>' +
                            '</div>'
                    };

                    if(typeof $scope.itMasterDetailControl.columnDefs !== 'undefined'){
                        angular.forEach($scope.itMasterDetailControl.columnDefs, function(columnDef){
                            columnDef['headerCellTemplate'] = '<div ng-class="{ \'sortable\': sortable }"> <!-- <div class="ui-grid-vertical-bar">&nbsp;</div> --> ' +
                                '<div class="ui-grid-cell-contents" col-index="renderIndex" title="TOOLTIP"> ' +
                                '<span>{{ col.displayName CUSTOM_FILTERS }}</span> ' +
                                '<span ui-grid-visible="col.sort.direction" ' +
                                'ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }"> &nbsp; ' +
                                '</span> </div> <div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader && col.colDef.enableColumnMenu !== false" ' +
                                'ng-click="toggleMenu($event)" ng-class="{\'ui-grid-column-menu-button-last-col\': isLastCol}"> <i class="fa fa-align-justify"></i>' +
                                ' </div> <div ui-grid-filter></div> </div>';
                        },true)
                    }

                    $scope.gridOptions.columnDefs =
                        $scope.itMasterDetailControl.columnDefs;

                    function _displayDetail(item) {
                        var deferred = $q.defer();
                        if($scope.$parent.currentItemWrapper != null){
                            if($scope.$parent.currentItemWrapper.hasChanged &&
                                $scope.itLockOnChange){
                                deferred.reject('undo or save before change');
                                return deferred.promise;
                            }
                        }
                        $scope.$parent.currentItemWrapper  = new ItemWrapper(item);
                        deferred.resolve('');
                        return deferred.promise;
                    }

                    $scope.onRowClick = function(row,col) {
                        if (col.entity != undefined && typeof row.providedHeaderCellTemplate != 'undefined') {
                            _displayDetail(col.entity).then(function (msg) {
                                if (row.providedHeaderCellTemplate !== 'ui-grid/selectionHeaderCell') {
                                    $scope.gridApi.selection.clearSelectedRows();
                                    if ($scope.$parent.$parent.mobile) {
                                        $scope.$parent.$parent.goToDetail();
                                    }
                                }
                                $scope.gridApi.selection.toggleRowSelection(col.entity);
                            }, function (msg) {
                                itPopup.alert($scope.itMasterDetailControl.navAlert);
                                $scope.gridApi.selection.selectRow($scope.$parent.currentItemWrapper.originalItem);
                            });
                        }
                    };


                    function _scrollToEntity(entity){
                        $scope.gridApi.core.scrollTo(entity);
                    }

                    $scope.itMasterDetailControl.selectItem =function (item){
                        $scope.onRowClick(null,{entity:item});
                    };

                    /**
                     * Method to filter rows
                     */
                    $scope.refreshData = function() {
                        var renderableEntities = $filter('itUIGridGlobalFilter')
                        ($scope.gridOptions.data, $scope.gridOptions, $scope.filterText);

                        angular.forEach($scope.gridApi.grid.rows, function( row ) {
                            var match = false;
                            renderableEntities.forEach(function(entity){

                                if(angular.equals(row.entity,entity)){
                                    match  = true;
                                }
                            });
                            if ( !match ){
                                $scope.gridApi.core.setRowInvisible(row);
                            } else {
                                $scope.gridApi.core.clearRowInvisible(row);
                            }
                        });
                    };


                    function _unlockCurrent(){
                        $scope.$applyAsync(function(){
                            if($scope.$parent.currentItemWrapper!==null){
                                $scope.$parent.currentItemWrapper.hasChanged = false;
                                $scope.$parent.currentItemWrapper.isWatched = false;
                            }
                        });

                    }

                    $scope.itMasterDetailControl.getCurrentItem = function(){
                        return   $scope.$parent.currentItemWrapper.currentItem;
                    };

                    $scope.itMasterDetailControl.undoChangeCurrentItem = function(){
                        if($scope.$parent.currentItemWrapper!= null){
                            _displayDetail($scope.$parent.currentItemWrapper.originalItem)
                            $scope.$parent.currentItemWrapper.currentItem =
                                angular.copy($scope.$parent.currentItemWrapper.originalItem);
                            _unlockCurrent();
                        }
                    };

                    $scope.$on('unlockCurrentItem',function(){
                        _unlockCurrent();
                    });

                    /**
                     * Method to scroll to specific item.
                     * @param entity item to scroll to.
                     */
                    $scope.itMasterDetailControl.scrollToItem =function (entity){
                        _scrollToEntity(entity);
                    };

                    /**
                     * Method to get Selected items.
                     * @returns {Array} of selected items
                     */
                    $scope.itMasterDetailControl.getSelectedItems = function(){
                        if(typeof $scope.gridApi !== 'undefined' ) {
                            if (typeof $scope.gridApi.selection.getSelectedRows === 'function') {
                                return $scope.gridApi.selection.getSelectedRows();
                            }
                        }
                        return [];
                    };

                    /**
                     * Method to get Current item.
                     * @returns {$scope.$parent.currentItemWrapper.currentItem|*}
                     * @deprecated
                     */
                    $scope.itMasterDetailControl.getCurrentItem = function(){
                        return   $scope.$parent.currentItemWrapper.currentItem;
                    };

                    /**
                     * Method to get Current item.
                     * @returns {$scope.$parent.currentItemWrapper.currentItem|*}
                     */
                    $scope.itMasterDetailControl.getCurrentItemWrapper = function(){
                        return   $scope.$parent.currentItemWrapper;
                    };

                    /**
                     * Method to get filtered items.
                     * @returns {Array} of filtered items.
                     */
                    $scope.itMasterDetailControl.getFilteredItems = function(){
                        var rows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
                        var entities  = [];
                        angular.forEach(rows,function(row){
                            entities.push(row.entity);
                        });
                        return entities;
                    };


                    /**
                     * Method to select the current Item.
                     * @param entity item to select.
                     * @returns {deferred.promise|*} success if the item is found.
                     */
                    $scope.itMasterDetailControl.setCurrentItem = function(entity){

                        var deferred = $q.defer();
                        $scope.gridApi.selection.clearSelectedRows();
                        _displayDetail(entity).then(function(){
                            $timeout(function() {
                                var entityIndex = $scope.itMasterData.indexOf(entity);
                                if(entityIndex>=0) {

                                    $scope.gridApi.selection.selectRow(entity);
                                    _scrollToEntity(entity);
                                    if( $scope.$parent.$parent.mobile){
                                        $scope.$parent.$parent.goToDetail();
                                    }
                                    deferred.resolve();
                                } else {
                                    deferred.reject();
                                }

                            });
                        },function(){
                            deferred.reject();
                        });
                        return deferred.promise;
                    };

                    /**
                     * Method to undo changes on the current item.
                     */
                    $scope.itMasterDetailControl.undoChangeCurrentItem = function(){
                        if($scope.$parent.currentItemWrapper!= null){
                            _displayDetail($scope.$parent.currentItemWrapper.originalItem)
                            $scope.$parent.currentItemWrapper.currentItem =
                                angular.copy($scope.$parent.currentItemWrapper.originalItem);
                            $scope.$parent.currentItemWrapper.unlockCurrent();
                        }
                    };

                    /**
                     * Method to fill windows height to the master part.
                     */
                    $scope.itMasterDetailControl.fillHeight = function(){
                        //  evalLayout.fillHeight();
                    };


                    /**
                     * Handler to unlock the current item.
                     */
                    $scope.$on('unlockCurrentItem',function(){
                        $timeout(function(){
                            $scope.$parent.currentItemWrapper.unlockCurrent();
                        });
                    });

                    /**
                     * Handler to lock the current item.
                     */
                    $scope.$on('lockCurrentItem',function(unlockOnEquals){
                        $timeout(function(){
                            $scope.$parent.currentItemWrapper.lockCurrent(unlockOnEquals);
                        });
                    });

                    function confirmLeavePage(e) {
                        if($scope.$parent.currentItemWrapper!=null){
                            if ( $scope.$parent.currentItemWrapper.hasChanged
                                && $scope.itLockOnChange ) {
                                itPopup.alert( $scope.itMasterDetailControl.navAlert);
                                e.preventDefault();
                            }
                        }
                    }
                    $scope.itAppScope = $scope.$parent;

                    //  $scope.itAppScope.$navAlert = {};

                    $scope.itAppScope.$navAlert = $scope.itMasterDetailControl.navAlert;

                    var w = angular.element($window);
                    w.bind('resize', function () {
                        $scope.gridApi.core.handleWindowResize();
                    });

                    $scope.itMasterDetailControl.initState = true;
                    $scope.$on("$locationChangeStart", confirmLeavePage);
                    $scope.itMasterDetailControl = angular.extend({navAlert:{
                        text:'Please save or revert your pending change',
                        title:'Unsaved changes',
                        buttons: [
                            {
                                text: 'OK',
                                type: 'btn-info',
                                onTap: function () {
                                    return false;
                                }
                            }]
                    }}, $scope.itMasterDetailControl );


                    /*  watchers */
                    $scope.$watch('itLang',function(){
                        $scope.gridApi.grid.refresh();
                    });

                    $scope.$watch('itMasterData',function(){
                        $scope.gridOptions.data = [];
                        $scope.itMasterData.forEach(function(entry){
                            $scope.gridOptions.data.push(entry);
                        });

                        if( typeof $scope.itMasterData === 'undefined' || $scope.itMasterData === null){
                            $scope.$parent.currentItemWrapper = null;
                        } else {
                            if( $scope.itMasterData.length === 0){
                                $scope.$parent.currentItemWrapper = null;
                            }
                        }
                        $scope.gridApi.grid.refresh();
                        if($scope.itMasterDetailControl !== null){
                            if(typeof  $scope.itMasterDetailControl.getCurrentItemWrapper() !== 'undefined'
                                && $scope.itMasterDetailControl.getCurrentItemWrapper()!= null){

                                $scope.$applyAsync(function(){
                                    _scrollToEntity($scope.itMasterDetailControl.getCurrentItemWrapper().originalItem);
                                });
                            }
                        }
                        $scope.refreshData();

                    },true);

                   $timeout(function(){
                        var event = document.createEvent('Event');
                        event.initEvent('resize', true /*bubbles*/, true /*cancelable*/);
                        $window.dispatchEvent(event);
                    },250);

                    $scope.$watch('$parent.currentItemWrapper.currentItem', function(newValue,oldValue){

                        if($scope.$parent.currentItemWrapper != null ){
                            if(!$scope.$parent.currentItemWrapper.isWatched)
                            {
                                $scope.$parent.currentItemWrapper.isWatched = true;
                            }
                            if($scope.$parent.currentItemWrapper.unlockOnEquals){
                                $scope.$parent.currentItemWrapper.hasChanged =
                                    !angular.equals(newValue,
                                        $scope.$parent.currentItemWrapper.originalItem);
                            } else   {
                                $scope.$parent.currentItemWrapper.hasChanged = true;
                            }
                        }
                    }, true);

                    $scope.$watch('filterText',function(){
                        $scope.refreshData();
                    },true);

                    $scope.$watch('itNoDetailMsg',function(){
                        $scope.$parent.$itNoDetail = $scope.itNoDetailMsg;

                    });
                }]


        }
    }).filter('itUIGridGlobalFilter',['$rootScope',function($rootScope) {
        return function(data, grid, query) {
            var matches = [];
            //no filter defined so bail
            if (query === undefined || query === '') {
                return data;
            }
            query = query.toLowerCase();

            function _deepFind(obj, path) {
                var paths = path.split('.')
                    , current = obj
                    , i;

                for (i = 0; i < paths.length; ++i) {
                    if (current[paths[i]] == undefined) {
                        return undefined;
                    } else {
                        current = current[paths[i]];
                    }
                }
                return current;
            }

            var scope = $rootScope.$new(true);
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < grid.columnDefs.length; j++) {
                    var dataItem = data[i];

                    var fieldName = grid.columnDefs[j].field;
                    var renderedData = _deepFind(dataItem,fieldName);
                    // apply cell filter
                    if (grid.columnDefs[j].cellFilter) {
                        scope.value = renderedData;
                        renderedData = scope.$eval('value | ' + grid.columnDefs[j].cellFilter);
                    }
                    //as soon as search term is found, add to match and move to next dataItem
                    if(typeof renderedData !== 'undefined' && renderedData != null){
                        if (renderedData.toString().toLowerCase().indexOf(query) > -1) {
                            matches.push(dataItem);
                            break;
                        }
                    }
                }
            }
            scope.$destroy();
            return matches;
        };
    }] );

'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itMasterDetail
 * @module itesoft
 * @restrict EA
 *
 * @description
 * A container element for master-detail main content.
 *
 * To use master details directive, add an `<it-master-detail>` parent element. This will encompass all master details content,
 * and have 2 child elements: 1 `<it-master>` for the list selectable content,
 * and `<it-detail>` that display the content of the selected item.
 *
 * You MUST pass an empty object  `<it-master it-master-detail-control="myMasterDetailControl"></it-master>`
 * this object will
 *
 * <table class="table">
 *  <tr>
 *   <td><code>myMasterDetailControl.navAlert = { <br/> text: 'my forbidden navigation text ', <br/> title : 'forbidden navigation title'  <br/>}</code></td>
 *   <td>Object passed to the navigation modal popup, when navigate triggered on unsaved item.</td>
 *  </tr>
 *  <tr>
 *   <td><code>myMasterDetailControl.disableMultiSelect  = true | false</code></td>
 *   <td>Disable | Enable  multiple row selection for entire grid .</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.getSelectedItems()</code></td>
 *   <td>Method to get selected items in the master grid.</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.getCurrentItemWrapper()</code></td>
 *   <td>Method to get the selected item wrapper that contain next attributes [originalItem ,currentItem, hasChanged ] .</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.undoChangeCurrentItem()</code></td>
 *   <td>Method to revert changes on the selected item.</td>
 *  </tr>
 * <tr>
 *   <td><code>masterDetail.getFilteredItems()</code></td>
 *   <td>Method to get displayed item after filter.</td>
 *  </tr>
 *  <tr>
 * <tr>
 *   <td><code>masterDetail.fillHeight()</code></td>
 *   <td>method refresh the master detail Height.</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.setCurrentItem(entity)</code></td>
 *   <td>Method to define the selected item, return promise</td>
 *  </tr>
 *  <tr>
 *   <td><code>masterDetail.scrollToItem(item)</code></td>
 *   <td>Method to scroll to the entity row.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$scope.$broadcast('unlockCurrentItem')</code></td>
 *   <td>unlock the selected item from the editing mode.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$scope.$broadcast('lockCurrentItem',unlockOnEquals)</code></td>
 *   <td>lock the selected item from the editing mode. unlockOnEquals : default true | auto unlock the item if the changed item is equals to the original selected item, if set to false only the $scope.$broadcast('unlockCurrentItem') can unlock it.</td>
 *  </tr>
 *  <tr>
 *   <td><code>grid.appScope.itAppScope</code></td>
 *   <td>access to your application scope from the master-detail context, mainly for template binding</td>
 *  </tr>
 *
 *   <tr>
 *   <td><code><pre><it-master it-col="3"></it-master></pre></code></td>
 *   <td>number of bootstrap columns of the master element, detail element automatically take  (12 - it-col), if undefined = 6</td>
 *  </tr>
 * </table>
 *
 * ```html
 * <it-master-detail>
 *   <!-- Master Content content -->
 *
 *   <it-master>
 *       <it-master-header>
 *       </it-master-header>
 *   </it-master>
 *
 *   <!-- menu -->
 *   <it-detail>
 *   </it-detail>
 *
 * </it-master-detail>
 * ```
 * @example
    <example module="itesoft">
         <file name="index.html">
             <div ng-controller="MasterDetailController">
                 <it-master-detail >
                 <it-master it-col="4" it-master-data="data" it-lang="'fr'" it-no-data-msg="No data available"  it-no-detail-msg="{{( masterDetails.initState ? (masterDetails.getSelectedItems().length > 0 ?  masterDetails.getSelectedItems().length +' items selected' :  'no item selected') : '') | translate}}"  it-master-detail-control="masterDetails"  it-lock-on-change="true">
                 <it-master-header it-search-placeholder="Recherche" >
                 <button class="btn btn-primary" title="Add" ng-disabled="currentItemWrapper.hasChanged" ng-click="addNewItem()"><span class="fa fa-plus fa-lg"></span></button>
                 <button class="btn btn-danger" title="Delete" ng-disabled="currentItemWrapper.hasChanged" ng-click="deleteSelectedItems()"><span class="fa fa-trash fa-lg"></span></button>
                 <button class="btn btn-success" ng-disabled="currentItemWrapper.hasChanged" title="Down"><span class="fa fa-chevron-down fa-lg"></span></button>
                 <button class="btn btn-success" ng-disabled="currentItemWrapper.hasChanged" title="Up"><span class="fa fa-chevron-up fa-lg"></span></button>
                 </it-master-header>
                 </it-master>
                 <it-detail>
                 <it-detail-header>
                 <button class="btn btn-warning" title="Save"  ng-disabled="!currentItemWrapper.hasChanged" ng-click="saveCurrentItem()">
                 <span class="fa fa-floppy-o fa-lg"></span>
                 </button>
                 <button class=" btn btn-info" title="Check">
                 <span class="fa fa-file-code-o fa-lg"></span>
                 </button>
                 <button class="btn btn-success" title="Undo" ng-click="undoChange()">
                 <span class="fa fa-undo fa-lg"></span>
                 </button>

                 </it-detail-header>
                 <it-detail-content>
                 <it-modal-full-screen>
                             <div class="form-group">
                                 <input it-input type="text" class="form-control floating-label" id="priorityDescription"
                                     it-label="code"
                                     ng-model="currentItemWrapper.currentItem.code"
                                     name=""
                                     ng-required="true"/>
                             </div>
                             <div class="form-group">
                             <input it-input type="text" class="form-control floating-label" id="priorityCategory"
                                 it-label="description"
                                 ng-model="currentItemWrapper.currentItem.description" name=""/>
                             </div>
                             <div class="form-group">
                             <input type="checkbox"
                                 it-toggle
                                 ng-model="currentItemWrapper.currentItem.enabledde"
                                 it-label="tete"/>
                             </div>
                 </it-modal-full-screen>
                 </it-detail-content>
                 </it-detail>
                 </it-master-detail>
             </div>
         </file>
         <file name="controller.js">
             angular.module('itesoft')
              .controller('MasterDetailController', ['$scope', function($scope) {

                                            $scope.data =
                                               [
                                                    {
                                                        "code" : "Code 1",
                                                        "description": "Description 1",
                                                        "enabledde" : true
                                                    },
                                                    {
                                                        "code" : "Code 2",
                                                        "description": "Description 2",
                                                        "enabledde" : false
                                                    },
                                                    {
                                                        "code" : "Code 3",
                                                        "description": "Description 3",
                                                        "enabledde" : true
                                                    },
                                                    {
                                                        "code" : "Code 4",
                                                        "description": "Description 4",
                                                        "enabledde" : false
                                                    },
                                                    {
                                                        "code" : "Code 5",
                                                        "description": "Description 5",
                                                        "enabledde" : true
                                                    }
                                                ];

                                            $scope.masterDetails = {};

                                            $scope.masterDetails = {
                                                columnDefs : [{ field: 'code', displayName: 'My value 1',  sortable:true},
                                                    { field: 'description', displayName: 'My value 2',  sortable:true},
                                                    { field: 'enabledde', displayName: 'My value 3',   sortable:false}]

                                            };

                                             $scope.masterDetails.disableMultiSelect = false;
                                            $scope.masterDetails.navAlert = {
                                                text:'{{\'BUTTON_LANG_EN\' | translate}}',
                                                title:'{{\'FOO\' | translate}}',
                                                buttons: [
                                                        {
                                                            text:  '<span class="fa fa-floppy-o fa-lg"></span>',
                                                            type:  'btn-warning',
                                                            onTap: function() {
                                                                $scope.saveCurrentItem();
                                                                return true;
                                                            }
                                                        },
                                                        {
                                                            text: '<span  class="fa fa-file-code-o fa-lg"></span>',
                                                            type: 'btn-primary',
                                                            onTap: function () {
                                                                $scope.saveCurrentItem();
                                                                return true;

                                                            }
                                                        },
                                                        {
                                                            text: '<span class="fa fa-undo fa-lg"></span>',
                                                            type: 'btn-success',
                                                            onTap: function () {
                                                                $scope.undoChange();
                                                                return true;

                                                            }
                                                        }
                                                    ]
                                            };

                                            function _removeItems(items,dataList){
                                                angular.forEach(items,function(entry){
                                                    var index = dataList.indexOf(entry);
                                                    dataList.splice(index, 1);
                                                })
                                            }

                                            $scope.deleteSelectedItems = function(){
                                                _removeItems($scope.masterDetails.getSelectedItems(), $scope.data);
                                            };


                                            $scope.saveCurrentItem = function(){
                                                   angular.copy( $scope.masterDetails.getCurrentItemWrapper().currentItem,$scope.data[$scope.masterDetails.getCurrentItemWrapper().index])

                                                    $scope.$broadcast('unlockCurrentItem');
                                                };

                                            $scope.undoChange = function(){
                                                $scope.masterDetails.undoChangeCurrentItem();
                                                $scope.masterDetails.fillHeight();
                                            };

                                            $scope.addNewItem = function(){
                                                var newItem =  {
                                                    "code" : "Code " + ($scope.data.length+1) ,
                                                    "description": "Description " + ($scope.data.length+1),
                                                    "enabledde" : true
                                                };
                                                $scope.data.push(newItem);
                                                $scope.masterDetails.setCurrentItem(newItem).then(function(success){
                                                    $scope.$broadcast('lockCurrentItem',false);
                                                },function(error){

                                                });
                                            };

                                            $scope.hasChanged = function(){
                                                if($scope.masterDetails.getCurrentItemWrapper() != null){
                                                    return $scope.masterDetails.getCurrentItemWrapper().hasChanged;
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }]);
          </file>
         <file src="test.css">
         </file>
    </example>
 */
IteSoft
    .directive('itMasterDetail',['itPopup','$timeout','$window',function(itPopup,$timeout,$window){
        return {
            restrict: 'EA',
            transclude : true,
            scope :true,
            template : '<div it-bottom-glue="" class="it-master-detail-container jumbotron "> <div class="it-fill row " ng-transclude></div></div>',
            controller : [
                '$scope',
                'screenSize',
                function(
                    $scope,
                    screenSize
                    )
                {
                    $scope.activeState = 'master';
                    $scope.desktop = screenSize.on('md, lg', function(match){
                        $scope.desktop = match;

                    });

                    $scope.mobile = screenSize.on('xs, sm', function(match){
                        $scope.mobile = match;
                    });

                    $scope.goToDetail = function(){
                        $scope.activeState = 'detail';
                    };

                    $scope.$watch('mobile',function(){
                        if($scope.mobile &&
                            (typeof $scope.$$childHead.currentItemWrapper !== 'undefined'
                                &&  $scope.$$childHead.currentItemWrapper != null )){
                            $scope.activeState = 'detail';
                        } else {
                            $scope.activeState = 'master';
                        }
                    });

                    $scope.$watch('$$childHead.currentItemWrapper',function() {
                        if($scope.mobile &&
                            (typeof $scope.$$childHead.currentItemWrapper === 'undefined'
                                ||  $scope.$$childHead.currentItemWrapper === null )){
                            $scope.activeState = 'master';
                        } else {
                            if($scope.mobile &&
                                (typeof $scope.$$childHead.currentItemWrapper.currentItem === 'undefined'
                                    ||  $scope.$$childHead.currentItemWrapper.currentItem === null )) {
                                $scope.activeState = 'master';
                            }
                        }
                    });

                    $scope.goToMaster = function(){

                        if($scope.mobile &&
                            (typeof $scope.$$childHead.currentItemWrapper !== 'undefined'
                                &&  $scope.$$childHead.currentItemWrapper != null )){
                            if($scope.$$childHead.currentItemWrapper.hasChanged &&
                                $scope.$$childHead.$$childHead.itLockOnChange){
                                itPopup.alert(  $scope.$$childHead.$navAlert);
                            } else {
                                $scope.activeState = 'master';
                                $timeout(function(){
                                    $window.dispatchEvent(new Event('resize'));
                                },300)

                            }
                        } else {
                            $scope.activeState = 'master';
                            $timeout(function(){
                                $window.dispatchEvent(new Event('resize'));
                            },300)

                        }

                    };
                }]
        }
    }]);
"use strict";
/**
 * @ngdoc directive
 * @name itesoft.directive:itMasterHeader
 * @module itesoft
 * @restrict EA
 *
 * @description
 * A container element for master headers, MUST be include in {@link itesoft.directive:itMaster `<it-master>`},
 * can contain the action buttons of selected items.
 * for more information see {@link itesoft.directive:itMasterDetail `<it-master-detail>`}.
 *
 * ```html
 * <it-master-detail>
 *   <!-- Master Content content -->
 *
 *   <it-master>
 *       <it-master-header>
 *             <button class="btn btn-primary" title="Add" ng-disabled="currentItemWrapper.hasChanged" ng-click="myAction()"><span class="fa fa-plus fa-lg"></span></button>
 *       </it-master-header>
 *   </it-master>
 *
 *   <!-- menu -->
 *   <it-detail>
 *        <it-detail-header>
 *
 *       </it-detail-header>
 *
 *
 *       <it-detail-content>
 *       </it-detail-content>
 *   </it-detail>
 *
 * </it-master-detail>
 * ```
 */
IteSoft
    .directive('itMasterHeader',function() {
        return {
            restrict: 'EA',
            require: '^itMaster',
            scope: false,
            transclude : true,
            template :'<div class="fuild-container">   <div class="row it-fill">   <div class="it-md-header col-xs-12 col-md-12">'+
                '<div class="btn-toolbar it-fill" ng-transclude>'+
                '</div>'+
                '</div>'+
                '<div class="col-xs-12 col-md-12 pull-right">'+
                '<div>'+
                '<form>'+
                '<div class="form-group has-feedback it-master-header-search-group  col-xs-12 col-md-{{$parent.itCol < 4 ? 12 :6 }} pull-right" >'+
                '<span class="glyphicon glyphicon-search form-control-feedback"></span>'+
                '<input  class="form-control " type="text" ng-model="$parent.filterText" class="form-control floating-label"  placeholder="{{placeholderText}}"/>'+
                '</div>'+
                '</form>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>',
            link: function (scope, element, attrs) {
                scope.$watch(function () { return attrs.itSearchPlaceholder }, function (newVal) {
                    scope.placeholderText = newVal;
                });
            }
        }

    });

'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itAutocomplete
 * @module itesoft
 * @restrict ECA
 *
 * @description
 * The ItAutocomplete widgets provides suggestions while you type into the field
 *
 *
 * ```html
 *   <it-autocomplete items="[{id=1,value='premiere option'}]" selected-option="selectedId" search-mode="'contains'"  />
 * ```
 *
 * <h1>Skinning</h1>
 * Following is the list of structural style classes:
 *
 * <table class="table">
 *  <tr>
 *      <th>
 *          Class
 *      </th>
 *      <th>
 *          Applies
 *      </th>
 *  </tr>
 *  <tr>
 *      <td>
 *          it-autocomplete-select
 *      </td>
 *      <td>
 *          Default option class
 *      </td>
 *  </tr>
 *  <tr>
 *      <td>
 *          it-autocomplete-selected
 *      </td>
 *      <td>
 *          Selected option class
 *      </td>
 *  </tr>
 *  <tr>
 *      <td>
 *          it-autocomplete-container
 *      </td>
 *      <td>
 *          Option container div
 *      </td>
 *  </tr>
 *  <tr>
 *      <td>
 *          it-autocomplete-div
 *      </td>
 *      <td>
 *         parent  div
 *      </td>
 *  </tr>
 *  </table>
 *
 *
 * @example
 <example module="itesoft-showcase">
 <file name="index.html">
 <style>
 .width300{width:300px};
 </style>
 <div ng-controller="HomeCtrl">
 <h1>Usage inside grid:</h1>
 <div id="grid1" ui-grid="gridOptions" class="grid"></div>
 <h1>Standalone usage:</h1>
 Selected Id:<input type="text" ng-model="selectedOption"/>
 <it-autocomplete items="firstNameOptions" selected-option="selectedOption" search-mode="'startsWith'" ></it-autocomplete>
 <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br>
 </div>
 </file>
 <file name="Module.js">
 angular.module('itesoft-showcase',['ngMessages','itesoft']);
 </file>
 <file name="controller.js">
 angular.module('itesoft-showcase').controller('HomeCtrl',
 ['$scope',function($scope) {
            $scope.myData = [];
            // sample values
            $scope.myDataInit = [ { "firstName": "Cox", "lastName": "Carney", "company": "Enormo", "employed": true }, { "firstName": "Lorraine", "lastName": "Wise", "company": "Comveyer", "employed": false }, { "firstName": "Nancy", "lastName": "Waters", "company": "Fuelton", "employed": false }];
            $scope.firstNameOptions = [{id:"Cox",value:"Cox"},{id:"Lorraine",value:"Lorraine"},{id:"Enormo",value:"Enormo"},{id:"Enormo1",value:"Enormo1"},{id:"Enormo2",value:"Enormo2"},{id:"Enormo3",value:"Enormo3"},{id:"Enormo4",value:"Enormo4"},{id:"Enormo5",value:"Enormo5"},{id:"Enormo6",value:"Enormo6"},{id:"Enormo7",value:"Enormo7"},{id:"Enormo8",value:"Enormo8"},{id:"Enormo9",value:"Enormo9"},{id:"Enormo10",value:"Enormo10"},{id:"Enormo11",value:"Enormo12"}];
            $scope.lastNameOptions = [{id:"Carney",value:"Carney"},{id:"Wise",value:"Wise"},{id:"Waters",value:"Waters"}];
            angular.copy($scope.myDataInit,$scope.myData);
            $scope.gridOptions = {
                data:$scope.myData,
                useExternalFiltering: true,
                enableFiltering: true,
                onRegisterApi: function(gridApi){
                  $scope.gridApi = gridApi;
                  //quick an dirty example of filter that use it-autocomplete
                  $scope.gridApi.core.on.filterChanged($scope, function(){
                      $scope.myData = [];
                            var filterUse = false;
                      angular.forEach($scope.myDataInit,function(item){
                            var added = false;
                            var key = '';
                            var value = '';
                            for (var i = 0; i < $scope.gridApi.grid.columns.length; i++) {
                            if(!added){
                                    key = $scope.gridApi.grid.columns[i].field;
                                    for (var j = 0; j < $scope.gridApi.grid.columns[i].filters.length; j++) {
                                            value = $scope.gridApi.grid.columns[i].filters[j].term;
                                            if (value != undefined && value != '') {
                                                if(item[key] == value &&  $scope.myData.push(item)){
                                                    $scope.myData.push(item);
                                                    added = true;
                                                    filterUse = true;
                                                 }
                                            }
                                         }
                                    }
                                    }
                            if(! filterUse){
                             //angular.copy($scope.myDataInit,$scope.myData);
                            }
                            $scope.gridOptions.data = $scope.myData;
                            $scope.gridOptions.totalItems = $scope.myData.length;
                      })
                    });
                },
                columnDefs:[{
                    name: 'firstName',
                    cellClass: 'firstName',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><it-autocomplete placeholder="\'filter\'" items="grid.appScope.firstNameOptions" selected-option="colFilter.term" input-class="\'firstNameFilter\'" option-container-class="\'width300\'" ></it-autocomplete></div>',
                    filter:[{
                      term: 1
                      }]
                    },
                    {
                    name: 'lastName',
                    cellClass: 'lastName',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><it-autocomplete items="grid.appScope.lastNameOptions" selected-option="colFilter.term" input-class="\'lastNameFilter\'" option-container-class="\'width300\'"></it-autocomplete></div>',
                    filter:[{
                      term: 1 }]
                    }
                ]
            };
            $scope.selectedOption = "Lorraine";
     }
 ]);
 </file>
 </example>
 */

IteSoft
    .directive('itAutocomplete', function () {
        return {
            restrict: 'AE',
            scope: {
                /**
                 * items list must contain id and value
                 */
                items: "=",
                /**
                 * selected item id
                 */
                selectedOption: "=",
                /**
                 * stylesheet class added on input filter
                 */
                inputClass: "=",
                /**
                 * stylesheet class added on option
                 */
                optionClass: "=",
                /**
                 * stylesheet class added on option container
                 */
                optionContainerClass: "=",
                /**
                 * input searchMode value= startsWith,contains default contains
                 */
                searchMode: "=",
                /**
                 * input placeHolder
                 */
                placeholder: "="
            },
            controllerAs: 'itAutocompleteCtrl',
            controller: ['$scope', '$rootScope', '$translate', '$document', '$timeout', '$log',
                function ($scope, $rootScope, $translate, $document, $timeout, $log) {

                    var self = this;

                    /****************************************************************************************
                     *                                  DECLARATION
                     **************************************************************************************/

                    /**
                     * public fields
                     * @type {{}}
                     */
                    self.fields = {
                        items: [],
                        inputSearch: '',
                        showItems: false,
                        optionClass: $scope.optionClass,
                        optionContainerClass: $scope.optionContainerClass,
                        inputClass: $scope.inputClass,
                        defaultSelectClass: '',
                        selectedSelectClass: '',
                        selectedItem: {},
                        searchMode: $scope.searchMode,
                        placeholder: $scope.placeholder
                    };

                    if(angular.isUndefined(self.fields.optionClass)){
                        self.fields.optionClass = '';
                    }
                    if(angular.isUndefined(self.fields.optionContainerClass)){
                        self.fields.optionContainerClass = '';
                    }
                    if(angular.isUndefined(self.fields.inputClass)){
                        self.fields.inputClass = 'it-autocomplete-input-class';
                    }
                    if(angular.isUndefined(self.fields.placeholder)){
                        self.fields.placeholder = '';
                    }
                    self.fields.optionContainerClass = self.fields.optionContainerClass + " it-autocomplete-container";
                    self.fields.defaultSelectClass = self.fields.optionClass + " it-autocomplete-select";
                    self.fields.selectedSelectClass = self.fields.defaultSelectClass + " it-autocomplete-selected";
                    /**
                     * Use unique id for container, all to find it if there are multiple itAutocomplete directive inside the same page
                     * @type {string}
                     */
                    self.fields.optionContainerId = _generateID();


                    /**
                     * public function
                     * @type {{}}
                     */
                    self.fn = {
                        select: select,
                        change: change,
                        init: init,
                        fullInit: fullInit,
                        hideItems: hideItems,
                        showItems: showItems,
                        keyBoardInteration: keyBoardInteration,
                    };

                    /****************************************************************************************
                     *                                  CODE
                     **************************************************************************************/

                    /**
                     * initialize default data
                     */
                    fullInit();
                    $scope.focusIndex = -1;
                    //Apply default select
                    _selectItemWithId($scope.selectedOption);

                    /**
                     * Watch items change to items to reload select if item is now present
                     */
                    $scope.$watch('items', function (newValue, oldValue) {
                        $log.debug("itAutocomplete: items value changed");
                        fullInit();
                        _selectItemWithId($scope.selectedOption);
                        hideItems();
                    });

                    /**
                     * Watch selectedOption change to select option if value change outside this directive
                     */
                    $scope.$watch('selectedOption', function (newValue, oldValue) {
                        $log.debug("itAutocomplete: selectedOption value changed");
                        if (angular.isUndefined(self.fields.selectedItem) || newValue != self.fields.selectedItem.id) {
                            _selectItemWithId(newValue);
                            hideItems();
                        }
                    });

                    /**
                     * Keyboard interation
                     */
                    $scope.$watch('focusIndex', function (newValue, oldValue) {
                        $log.debug("itAutocomplete: focusIndex value changed");
                        if (newValue != oldValue) {
                            if (newValue < 0) {
                                $scope.focusIndex = -1;
                            } else if (newValue >= self.fields.items.length) {
                                $scope.focusIndex = self.fields.items.length - 1;
                            }
                            if (angular.isDefined(self.fields.items)) {
                                select(self.fields.items[$scope.focusIndex]);
                            }
                        }

                    });

                    /****************************************************************************************
                     *                                  FUNCTION
                     **************************************************************************************/

                    /**
                     * Select Item with it id
                     * @param id
                     * @private
                     */
                    function _selectItemWithId(id) {
                        $log.debug("itAutocomplete: select with  id "+id);
                        var selected = false;
                        self.fields.selectedItem = {};
                        if (angular.isDefined(id)) {
                            angular.forEach(self.fields.items, function (item) {
                                if (item.id == id) {
                                    select(item);
                                    selected = true;
                                }
                            });
                            if (!selected) {
                                init();
                            }
                        }
                    }

                    /**
                     * init + copy of externalItems
                     */
                    function fullInit() {
                        $log.debug("itAutocomplete: copy option items");
                        angular.copy($scope.items, self.fields.items);
                        init();
                    }

                    /**
                     * Style class and position initialization
                     */
                    function init() {
                        var i = 0;
                        angular.forEach(self.fields.items, function (item) {
                            if (angular.isDefined(self.fields.selectedItem)){
                                if (self.fields.selectedItem != item) {
                                    unselect(item);
                                } else {
                                    select(item)
                                }
                            }
                            item.position = i;
                            i++;
                        });
                    }

                    /**
                     * Call when option is selected
                     * @param id
                     */
                    function select(selectedItem) {
                        $log.debug("itAutocomplete: select "+selectedItem.id);
                        // reset last selectedItem class
                        if (angular.isDefined(self.fields.selectedItem)) {
                            unselect(self.fields.selectedItem);
                        }
                        if (angular.isDefined(selectedItem)) {
                            $scope.focusIndex = selectedItem.position;
                            self.fields.selectedItem = selectedItem;
                            $scope.selectedOption = selectedItem.id;
                            self.fields.selectedItem.class = self.fields.selectedSelectClass;
                            var selectedDiv = $document[0].querySelector("#options_" + selectedItem.id);
                            scrollTo(selectedDiv);
                        }
                    }

                    /**
                     * Unselect item
                     * @param item
                     */
                    function unselect(item) {
                        item.class = self.fields.defaultSelectClass;
                    }

                    /**
                     * Scroll on selectedItem when user use keyboard to select an item
                     * @param divId
                     */
                    function scrollTo(targetDiv) {
                        var containerDiv = $document[0].querySelector("#" + self.fields.optionContainerId);
                        if (angular.isDefined(targetDiv) && targetDiv != null && angular.isDefined(targetDiv.getBoundingClientRect())
                            && angular.isDefined(containerDiv) && containerDiv != null) {
                            var targetPosition = targetDiv.getBoundingClientRect().top + targetDiv.getBoundingClientRect().height + containerDiv.scrollTop;
                            var containerPosition = containerDiv.getBoundingClientRect().top + containerDiv.getBoundingClientRect().height;
                            var pos = targetPosition - containerPosition;
                            containerDiv.scrollTop = pos;
                        }
                    }

                    /**
                     * Hide option items
                     */
                    function hideItems($event) {
                        // Si appelé lors du click sur la touche entrée
                        if(angular.isUndefined($event) ){
                            self.fields.showItems = false;
                            self.fields.inputSearch = self.fields.selectedItem.value;
                            // si appelé par le on blur, on vérifie que le onblur n'est pas émit par la scrollbar si ie
                        } else if(! document.activeElement.parentElement.firstElementChild.classList.contains(self.fields.inputClass)) {
                            self.fields.showItems = false;
                            self.fields.inputSearch = self.fields.selectedItem.value;

                            //si il s'agit de la scrollbar, on annule le onblur en remettant le focus sur l'element
                        }else{
                            $scope.$applyAsync(function(){
                                $event.srcElement.focus();
                            })
                        };
                    }

                    /**
                     * Return internet explorer version
                     * @returns {number}
                     */
                    function getInternetExplorerVersion()
                    {
                        var rv = -1;
                        if (navigator.appName == 'Microsoft Internet Explorer')
                        {
                            var ua = navigator.userAgent;
                            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null)
                                rv = parseFloat( RegExp.$1 );
                        }
                        else if (navigator.appName == 'Netscape')
                        {
                            var ua = navigator.userAgent;
                            var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null)
                                rv = parseFloat( RegExp.$1 );
                        }
                        return rv;
                    }

                    /**
                     * Show option items
                     */
                    function showItems($event) {
                        //refresh modal position on internet explorer because fixed position doesn't follow scroll
                        if(angular.isDefined($event) && getInternetExplorerVersion() != -1){
                                var container = $event.srcElement.parentElement.children[1];
                                var myParent = angular.element($event.srcElement.parentElement)[0];
                            //only needed with ie and fixed positiion
                            if( angular.isDefined(container) && angular.isDefined(myParent) && container.currentStyle["position"]== "fixed") {
                                var newTop = (myParent.getBoundingClientRect().top + myParent.getBoundingClientRect().height);
                                container.style.setProperty("top", newTop + "px");
                            }
                        }
                        self.fields.showItems = true;
                    }

                    /**
                     * Call when search input content change
                     */
                    function change() {
                        $log.debug("itAutocomplete: input search change value")
                        self.fields.items = [];
                        if (self.fields.inputSearch == "") {
                            fullInit();
                        } else {
                            var i = 0;
                            angular.forEach($scope.items, function (item) {
                                /**
                                 * StartsWith
                                 */
                                if (self.fields.searchMode == "startsWith") {
                                    if (item.value.toLowerCase().startsWith(self.fields.inputSearch.toLowerCase())) {
                                        self.fields.items.push(item);
                                        self.fields.items[i].position = i;
                                        i++;
                                    }
                                    /**
                                     * Contains
                                     */
                                } else {
                                    if (item.value.toLowerCase().search(self.fields.inputSearch.toLowerCase()) != -1) {
                                        self.fields.items.push(item);
                                        self.fields.items[i].position = i;
                                        i++;
                                    }
                                }
                            });
                        }
                        if (self.fields.items.length == 1) {
                            select(self.fields.items[0]);
                        }
                        showItems();
                    }

                    /**
                     * Manage keyboard interaction up down enter
                     * @type {Array}
                     */
                    $scope.keys = [];

                    const KEY_ENTER = 13;
                    const KEY_DOWN = 38;
                    const KEY_UP = 40;
                    const KEY_BACK = 8;
                    const KEY_DELETE = 8;

                    $scope.keys.push({
                        code: KEY_ENTER, action: function () {
                            if (self.fields.showItems) {
                                hideItems();
                            } else {
                                showItems();
                                if (self.fields.inputSearch == "") {
                                    $scope.focusIndex = -1;
                                }
                            }
                        }
                    });
                    $scope.keys.push({
                        code: KEY_DOWN, action: function () {
                            showItems();
                            $scope.focusIndex--;
                        }
                    });
                    $scope.keys.push({
                        code: KEY_UP, action: function () {
                            showItems();
                            $scope.focusIndex++;
                        }
                    });

                    /**
                     * Use to manage keyboard interaction
                     * @param event
                     */
                    function keyBoardInteration(event) {
                        var code = event.keyCode;
                        $scope.keys.forEach(function (o) {
                            if (o.code !== code) {
                                return;
                            }
                            o.action();
                        });
                    };

                    /**
                     * Generate unique Id
                     * @returns {string}
                     */
                    function _generateID() {
                        var d = new Date().getTime();
                        var uuid = 'option_container_xxxxxxxxxxxx4yxxxxx'.replace(/[xy]/g, function (c) {
                            var r = (d + Math.random() * 16) % 16 | 0;
                            d = Math.floor(d / 16);
                            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                        });
                        return uuid;
                    };
                }
            ],
            template: '<div class="col-xs-12 it-autocomplete-div">'+
            '<input placeholder="{{itAutocompleteCtrl.fields.placeholder}}" ng-keydown="itAutocompleteCtrl.fn.keyBoardInteration($event)" ng-focus="itAutocompleteCtrl.fn.showItems($event)" ng-blur="itAutocompleteCtrl.fn.hideItems($event)" type="text" class="form-control" ' +
            'ng-class="inputClass" ng-change="itAutocompleteCtrl.fn.change()" ng-model="itAutocompleteCtrl.fields.inputSearch"> ' +
            '<div  ng-class="itAutocompleteCtrl.fields.optionContainerClass" id="{{itAutocompleteCtrl.fields.optionContainerId}}" ng-show="itAutocompleteCtrl.fields.showItems" >' +
            '<div class="it-autocomplete-content"  ng-repeat="item in itAutocompleteCtrl.fields.items">' +
            '<div ng-class="item.class" id="options_{{item.id}}"  ng-mousedown="itAutocompleteCtrl.fn.select(item)">{{item.value | translate}}</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        }
    })
;

'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itCheckbox
 * @module itesoft
 * @restrict A
 *
 * @description
 * The checkbox is no different than the HTML checkbox input,
 * except it's styled differently.
 *
 *
 * @example
    <example module="itesoft">
        <file name="index.html">
            <div>
                 <input it-checkbox type="checkbox" it-label="Checkbox">
            </div>
        </file>
    </example>
 */
IteSoft
    .directive('itCheckbox',function(){
        return {
            restrict: 'A',
            transclude : true,
            replace : true,
            link : function (scope, element, attrs ) {
                var input = angular.element(element[0]);
                input.wrap('<div class="checkbox"></div>');
                input.wrap('<label></label>');
                input.after('<span class="checkbox-material"><span class="check" style="margin-right:16px;width: '+attrs.width+';height:'+ attrs.height+';"></span></span>&nbsp;'+(attrs.itLabel || ''));
            }
        }
});
'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itInput
 * @module itesoft
 * @restrict ECA
 *
 * @description
 * Floating labels are just like Stacked Labels,
 * except that their labels animate, or "float" up whe
 * n text is entered in the input.
 *
 *
 * ```html
 *   <form class="form-group"  novalidate name="myForm" ng-submit="submit(myForm)">
 *       <input it-input
 *              class="form-control floating-label"
 *              type="text"
 *              name="Email"
 *              ng-minlength="5"
 *              ng-maxlength="10"
 *              required=""
 *              it-label="Email"
 *              ng-model="user.email">
 *              <div class="form-errors" ng-messages="myForm.Email.$error" style="color: red;">
         *            <div class="form-error" ng-message="required">This field is required.</div>
         *            <div class="form-error" ng-message="minlength">This field is must be at least 5 characters.</div>
         *            <div class="form-error" ng-message="maxlength">This field is must be less than 50 characters</div>
 *             </div>
 *   </form>
 * ```
 * @example
    <example module="itesoft-showcase">
        <file name="index.html">
            <div ng-controller="HomeCtrl">
               <form class="form-group"  novalidate name="myForm" ng-submit="submit(myForm)">
                <div class="form-group">
                        <input it-input class="form-control floating-label" type="text" it-label="Email" ng-model="user.email">
                </div>
                <div class="form-group">
                        <input it-input class="form-control floating-label"   required="" ng-minlength="5"  ng-maxlength="10" type="text" it-label="Prénom" name="Prenom" ng-model="user.firstName">
                </div>
                  <div class="form-errors" ng-messages="myForm.Prenom.$error" style="color: red;">
                      <div class="form-error" ng-message="required">This field is required.</div>
                      <div class="form-error" ng-message="minlength">This field is must be at least 5 characters.</div>
                      <div class="form-error" ng-message="maxlength">This field is must be less than 50 characters</div>
                  </div>
                  <button class="btn btn-primary" type="submit">submit</button>
               </form>
            </div>
        </file>
         <file name="Module.js">
         angular.module('itesoft-showcase',['ngMessages','itesoft']);
         </file>
        <file name="controller.js">
            angular.module('itesoft-showcase').controller('HomeCtrl',['$scope', function($scope) {
                  $scope.user = {
                      email : 'test@itesoft.com',
                      firstName :''
                     };

                  $scope.submit = function(form){
                       if(form.$valid){
                         console.log('submit');
                       }
                  }
            }]);
        </file>

    </example>
 */
IteSoft
    .directive('itInput',function(){
        return {
            restrict: 'A',
            replace : true,
            require: '?ngModel',
            link : function (scope, element, attrs, ngModel ) {
                // Check if ngModel is there else go out
                if (!ngModel)
                    return;
                // Fix on input element
                var input = angular.element(element[0]);
                //If there is no floating-lbal do nothing
                if (input.hasClass('floating-label')) {
                    // Wrapper for material design
                    input.wrap('<div class="form-control-wrapper"></div>');
                    // If there is astatic placeholder use it
                    var placeholder = input.attr('placeholder');
                    if (placeholder) {
                        input.after('<div class="floating-label">' +  placeholder + '</div');
                    } else {
                        // Else user data binding text 
                        input.after('<div class="floating-label">' +  scope.itLabel + '</div');
                        scope.$watch('itLabel', function(value) {
                            scope.$applyAsync(function(){
                                if (!input[0].offsetParent) {
                                    return;
                                }
                                var elementDiv = input[0].offsetParent.children;
                                angular.forEach(elementDiv, function(divHtml) {
                                    var div = angular.element(divHtml);
                                    if (div.hasClass('floating-label')) {
                                        div.text(value);
                                    }
                                });
                            })

                        });
                    }
                    input.after('<span class="material-input"></span>');
                    input.attr('placeholder', '').removeClass('floating-label');
                }
                // Check if error message is set
                input.after('<small class="text-danger" style="display:none;"></small>');
                scope.$watch('itError', function(value) {
                    if (!input[0].offsetParent) {
                        return;
                    }
                    var elementDiv = input[0].offsetParent.children;
                    angular.forEach(elementDiv, function(divHtml) {
                        var div = angular.element(divHtml);
                        if (div.hasClass('text-danger')) {
                            div.text(value);
                            if (value != '' && value != undefined) {
                                div.removeClass('ng-hide');
                                div.addClass('ng-show');
                                div.css('display','block');
                            } else {
                                div.removeClass('ng-show');
                                div.addClass('ng-hide');
                                div.css('display','none');
                            }
                        }
                    });
                });
                if (input.val() === null || input.val() == "undefined" || input.val() === "") {
                    input.addClass('empty');
                }
                // Watch value and update to move floating label
                scope.$watch(function () {return ngModel.$modelValue; }, function(value,oldValue) {
                    if (value === null || value == undefined || value ==="" ) {
                        input.addClass('empty');
                    } else {
                        input.removeClass('empty');
                    }
                });

                // wait for input
                input.on('change', function() {
                    if (input.val() === null || input.val() == "undefined" || input.val() === "") {
                        input.addClass('empty');
                    } else {
                        input.removeClass('empty');
                    }
                });
            },
            scope : {
                itError : '=',
                itLabel : '@'
            }
        }
});
"use strict";
/**
 * @ngdoc directive
 * @name itesoft.directive:itSearch
 * @module itesoft
 * @restrict A
 *
 * @description
 * Attribute providing on an input a single filter box that searches across multiple columns in a grid (ui-grid) or a table.
 *
 * You MUST pass an object `<input it-search it-search-control="searchControl" ng-model="searchControl.filterText" ></input>`.
 * This object will be used as following:
 * <table class="table">
 *  <tr>
 *   <td><code>searchControl = { <br/> columnDefs : [{field:'field1'}, {field:'field2'}, {field:'field3'}]  <br/>}</code></td>
 *   <td>Object passed to the multicolumns function filter inside the component to let it know on which columns to apply the filter.
 *   <br>This object is based on the columnDefs defined for the UI-GRID. Only property field and cellFilter are used.
 *   </td>
 *  </tr>
 *  <tr>
 *   <td><code>searchControl.multicolumnsFilter(renderableRows)</code></td>
 *   <td>Method to filter in the grid or table according the choosen column fields.<br/>It returns the new rows to be displayed.</td>
 *  </tr>
 *  <tr>
 *   <td><code>searchControl.filterText</code></td>
 *   <td>This property of the scope has to be associated to the input<br/>(through ng-model).</td>
 *  </tr>
 * </table>
 * You MUST also pass a function `<input it-search ng-change="filter()"></input>`.
 * This function should call searchControl.multicolumnsFilter() to refresh the displayed data and has to be written in the application controller.
 *
 * @usage
 * <input it-search it-search-control="searchControl" ng-model="searchControl.filterText" ng-change="filter()">
 * </input>
 *
 * @example
 * <span><b>SEARCH IN UI-GRID</b></span>
 <example module="itesoft-showcase">
 <file name="index.html">
 <div ng-controller="SearchDemoControllerGrid">
 <div class="container-fluid">
 <div class="jumbotron">
 <div class="row">
 <button class="btn btn-primary" ng-click="loadDataGrid()">DISPLAY DATA IN UI-GRID</button>
 <form>
 <div class="form-group has-feedback" >
 <input it-search class="form-control" type="text" placeholder="Recherche multicolonnes dans UI-GRID" it-search-control="searchControl" ng-model="searchControl.filterText" ng-change="filter()"/>
 </div>
 </form>
 <div ui-grid="latinGrid" id="latinGrid"></div>
 </div>
 </div>
 </div>
 </div>
 </file>

 <file name="Module.js">
 angular.module('itesoft-showcase',['ngResource','itesoft']);
 </file>
 <file name="LatinService.js">
 angular.module('itesoft-showcase')
 .factory('Latin',['$resource', function($resource){
                                                    return $resource('http://jsonplaceholder.typicode.com/posts');
                                                }]);
 </file>
 <file name="Controller.js">
 angular.module('itesoft-showcase')
 .controller('SearchDemoControllerGrid',['$scope','Latin', function($scope,Latin) {
                            $scope.searchControl = {
                                columnDefs : [{field:'title'}, {field:'body'}]
                            };

                            $scope.dataSource = [];

                            //---------------ONLY UI-GRID--------------------
                            $scope.myDefs = [
                                    {
                                        field: 'id',
                                        width: 50
                                    },
                                    {
                                        field: 'title'
                                    },
                                    {
                                        field: 'body'
                                    }
                            ];
                            $scope.latinGrid = {
                                data: 'dataSource',
                                columnDefs: $scope.myDefs,
                                onRegisterApi: function (gridApi) {
                                    $scope.gridApi = gridApi;
                                    $scope.gridApi.grid.registerRowsProcessor($scope.searchControl.multicolumnsFilter, 200);
                                }
                            };
                            //---------------ONLY UI-GRID--------------------

                            $scope.filter = function () {
                                $scope.gridApi.grid.refresh();
                            };

                            $scope.loadDataGrid = function() {
                                $scope.dataSource = [];

                                Latin.query().$promise
                                .then(function(data){
                                    $scope.dataSource = data;
                                });
                            };
                     }]);
 </file>

 </example>

 * <span><b>SEARCH IN TABLE</b></span>
 <example module="itesoft-showcase1">
 <file name="index.html">
 <div ng-controller="SearchDemoControllerTable">
 <div class="container-fluid">
 <div class="jumbotron">
 <div class="row">
 <button class="btn btn-primary" ng-click="loadDataTable()">DISPLAY DATA IN TABLE</button>
 <form>
 <div class="form-group has-feedback" >
 <input it-search class="form-control" type="text" placeholder="Recherche multicolonnes dans TABLE" it-search-control="searchControl" ng-model="searchControl.filterText" ng-change="filter()"/>
 </div>
 </form>
 <table class="table table-striped table-hover ">
 <thead>
 <tr><th>id</th><th>title</th><th>body</th></tr>
 </thead>
 <tbody>
 <tr ng-repeat="dataItem in data">
 <td>{{dataItem.id}}</td>
 <td>{{dataItem.title}}</td>
 <td>{{dataItem.body}}</td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </div>
 </file>
 <file name="Module1.js">
 angular.module('itesoft-showcase1',['ngResource','itesoft']);
 </file>
 <file name="LatinService1.js">
 angular.module('itesoft-showcase1')
 .factory('Latin1',['$resource', function($resource){
                                            return $resource('http://jsonplaceholder.typicode.com/posts');
                                        }]);
 </file>
 <file name="Controller1.js">
 angular.module('itesoft-showcase1')
 .controller('SearchDemoControllerTable',['$scope','Latin1', function($scope,Latin1) {
                    $scope.searchControl = {};
                    $scope.searchControl = {
                        columnDefs : [{field:'title'}, {field:'body'}]
                    };

                    $scope.dataSource = [];
                    $scope.data = [];

                    $scope.filter = function () {
                        $scope.data = $scope.searchControl.multicolumnsFilter($scope.dataSource);
                    };

                    $scope.loadDataTable = function() {
                        $scope.dataSource = [];
                        $scope.data = [];

                        Latin1.query().$promise
                        .then(function(data){
                           $scope.dataSource = data;
                           $scope.data = data;
                        });
                    };
             }]);
 </file>

 </example>
 **/
IteSoft
    .directive('itSearch',function() {
        return {
            restrict: 'A',
            replace : true,
            scope: {
                itSearchControl:'='
            },
            link : function (scope, element, attrs ) {
                var input = angular.element(element[0]);

                input.after('<span class="glyphicon glyphicon-search form-control-feedback"/>');
            },
            controller : ['$scope',
                function ($scope) {
                    $scope.itSearchControl.multicolumnsFilter = function (renderableRows) {
                        var matcher = new RegExp($scope.itSearchControl.filterText, 'i');
                        var renderableRowTable = [];
                        var table = false;
                        if ($scope.itSearchControl.columnDefs) {
                            renderableRows.forEach(function (row) {
                                var match = false;
                                if (row.entity) {//UI-GRID
                                    $scope.itSearchControl.columnDefs.forEach(function (col) {
                                        if (!match && row.entity[col.field]) {
                                            var renderedData = row.entity[col.field].toString();
                                            if (col.cellFilter) {
                                                $scope.value = renderedData;
                                                renderedData = $scope.$eval('value | ' + col.cellFilter);
                                            }
                                            if(typeof renderedData !== 'undefined' && renderedData != null){
                                                if (renderedData.match(matcher)) {
                                                    match = true;
                                                }
                                            }
                                        }
                                    });
                                    if (!match) {
                                        row.visible = false;
                                    }
                                }
                                else {//TABLE
                                    table = true;
                                    $scope.itSearchControl.columnDefs.forEach(function (col) {
                                        if (!match && row[col.field] && row[col.field].toString().match(matcher)) {
                                            match = true;
                                        }
                                    });
                                    if (match) {
                                        renderableRowTable.push(row);
                                    }
                                }
                            });
                        }
                        if (table){
                            renderableRows = renderableRowTable;
                        }
                        return renderableRows;
                    };
                }]
        }
    });
'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itToggle
 * @module itesoft
 * @restrict A
 *
 * @description
 * A toggle is an animated switch which binds a given model to a boolean.
 * Allows dragging of the switch's nub.
 *
 *
 * ```html
 *     <input  it-toggle type="checkbox" it-label="Toggle button">
 * ```
 *
 *
 * @example
    <example module="itesoft">
        <file name="index.html">
            <div>
                <input  it-toggle type="checkbox" ng-model="data" it-label="Toggle button">
            </div>
        </file>

    </example>
 */
IteSoft
    .directive('itToggle',['$compile',function($compile){
        return {
            restrict: 'A',
            transclude : true,
            link : function (scope, element, attrs ) {
                var input = angular.element(element[0]);
                input.wrap('<div class="togglebutton"></div>');
                if (scope.itLabel == undefined) {
                    input.wrap('<label></label>');
                    input.after('<span class="toggle"></span>');
                } else {
                    input.wrap('<label></label>');
                    input.after('<span class="toggle"></span><span>'+(scope.itLabel || '')+'</span>');

                    scope.$watch('itLabel', function(value) {
                        if ((value) && (input.context)) {
                            var label = angular.element(input.context.parentNode);
                            if ((label) && (attrs.itLabel)) {
                                var labelText = angular.element(label.get(0).firstChild);
                                labelText.get(0).textContent = value+'  ';
                            }
                        }
                    });
                }
            },
            scope: {
                itLabel: '@'
            }
        }
}]);
"use strict";
/**
 * You do not talk about FIGHT CLUB!!
 */
IteSoft
    .directive("konami", ['$document','$uibModal', function($document,$modal) {
        return {
            restrict: 'A',
            template : '<style type="text/css"> @-webkit-keyframes easterEggSpinner { from { -webkit-transform: rotateY(0deg); } to { -webkit-transform: rotateY(-360deg); } } @keyframes easterEggSpinner { from { -moz-transform: rotateY(0deg); -ms-transform: rotateY(0deg); transform: rotateY(0deg); } to { -moz-transform: rotateY(-360deg); -ms-transform: rotateY(-360deg); transform: rotateY(-360deg); } } .easterEgg { -webkit-animation-name: easterEggSpinner; -webkit-animation-timing-function: linear; -webkit-animation-iteration-count: infinite; -webkit-animation-duration: 6s; animation-name: easterEggSpinner; animation-timing-function: linear; animation-iteration-count: infinite; animation-duration: 6s; -webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; -ms-transform-style: preserve-3d; transform-style: preserve-3d; } .easterEgg img { position: absolute; border: 1px solid #ccc; background: rgba(255,255,255,0.8); box-shadow: inset 0 0 20px rgba(0,0,0,0.2); } </style>',
            link: function(scope) {
                var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], konami_index = 0;

                var handler = function(e) {
                    if (e.keyCode === konami_keys[konami_index++]) {
                        if (konami_index === konami_keys.length) {
                            $document.off('keydown', handler);

                            var modalInstance =  $modal.open({
                                template: '<div style="max-width: 100%;" class="easterEgg"> <img style="-webkit-transform: rotateY(0deg) translateX(180px); padding: 0 0 0 0px;" src="http://media1.woopic.com/493/f/470x264/q/85/fd/p/newsweb-finance-article%7Cc8c%7C177%7Cbe13e9df471d6c4469b3e3ac93/itesoft-la-sf2i-monte-a-9-9-des-parts%7Cl_itesoftlogo.png" width="100%" height="160" alt=""> <img style="-webkit-transform: rotateY(-72deg) translateX(180px); padding: 0 0 0 0px;" src="http://media1.woopic.com/493/f/470x264/q/85/fd/p/newsweb-finance-article%7Cc8c%7C177%7Cbe13e9df471d6c4469b3e3ac93/itesoft-la-sf2i-monte-a-9-9-des-parts%7Cl_itesoftlogo.png" width="100%" height="160" alt=""> <img style="-webkit-transform: rotateY(-144deg) translateX(180px); padding: 0 0 0 0px;" src="http://media1.woopic.com/493/f/470x264/q/85/fd/p/newsweb-finance-article%7Cc8c%7C177%7Cbe13e9df471d6c4469b3e3ac93/itesoft-la-sf2i-monte-a-9-9-des-parts%7Cl_itesoftlogo.png" width="100%" height="160" alt=""> <img style="-webkit-transform: rotateY(-216deg) translateX(180px); padding: 0 0 0 0px;" src="http://media1.woopic.com/493/f/470x264/q/85/fd/p/newsweb-finance-article%7Cc8c%7C177%7Cbe13e9df471d6c4469b3e3ac93/itesoft-la-sf2i-monte-a-9-9-des-parts%7Cl_itesoftlogo.png" width="100%" height="160" alt=""> <img style="-webkit-transform: rotateY(-288deg) translateX(180px); padding: 0 0 0 0px;" src="http://media1.woopic.com/493/f/470x264/q/85/fd/p/newsweb-finance-article%7Cc8c%7C177%7Cbe13e9df471d6c4469b3e3ac93/itesoft-la-sf2i-monte-a-9-9-des-parts%7Cl_itesoftlogo.png" width="100%" height="160" alt=""> </div>'
                                   ,
                                size: 'lg'
                            });
                            scope.cancel = function(){
                                modalInstance.dismiss('cancel');
                            } ;
                        }
                    } else {
                        konami_index = 0;
                    }
                };

                $document.on('keydown', handler);

                scope.$on('$destroy', function() {
                    $document.off('keydown', handler);
                });
            }
        };
    }]);
"use strict";
/**
 * @ngdoc directive
 * @name itesoft.directive:itPrettyprint

 * @module itesoft
 * @restrict EA
 * @parent itesoft
 *
 * @description
 * A container for display source code in browser with syntax highlighting.
 *
 * @usage
 * <it-prettyprint>
 * </it-prettyprint>
 *
 * @example
    <example module="itesoft">
        <file name="index.html">
             <pre it-prettyprint=""  class="prettyprint lang-html">
                 <label class="toggle">
                     <input type="checkbox">
                         <div class="track">
                         <div class="handle"></div>
                     </div>
                 </label>
             </pre>
        </file>
    </example>
 */
IteSoft
    .directive('itPrettyprint', ['$rootScope', '$sanitize', function($rootScope, $sanitize) {
        var prettyPrintTriggered = false;
        return {
            restrict: 'EA',
            terminal: true,  // Prevent AngularJS compiling code blocks
            compile: function(element, attrs) {
                if (!attrs['class']) {
                    attrs.$set('class', 'prettyprint');
                } else if (attrs['class'] && attrs['class'].split(' ')
                    .indexOf('prettyprint') == -1) {
                    attrs.$set('class', attrs['class'] + ' prettyprint');
                }
                return function(scope, element, attrs) {
                    var entityMap = {
                          "&": "&amp;",
                          "<": "&lt;",
                          ">": "&gt;",
                          '"': '&quot;',
                          "'": '&#39;',
                          "/": '&#x2F;'
                      };

                       function replace(str) {
                          return String(str).replace(/[&<>"'\/]/g, function (s) {
                              return entityMap[s];
                          });
                      }
                    element[0].innerHTML = prettyPrintOne(replace(element[0].innerHTML));

                };
            }

        };
    }]);
'use strict';

/**
 * @ngdoc directive
 * @name itesoft.directive:itBottomGlue
 * @module itesoft
 * @restrict A
 *
 * @description
 * Simple directive to fill height.
 *
 *
 * @example
     <example module="itesoft">
         <file name="index.html">
             <div class="jumbotron " style="background-color: red; ">
                 <div class="jumbotron " style="background-color: blue; ">
                     <div class="jumbotron " style="background-color: yellow; ">
                         <div it-bottom-glue="" class="jumbotron ">
                            Resize the window height the component will  always fill the bottom !!
                         </div>
                     </div>
                 </div>
             </div>
         </file>
     </example>
 */
IteSoft
    .directive('itBottomGlue', ['$window','$timeout',
        function ($window,$timeout) {
    return function (scope, element) {
        function _onWindowsResize () {

            var currentElement = element[0];
            var elementToResize = angular.element(element)[0];
            var marginBottom = 0;
            var paddingBottom = 0;
            var  paddingTop = 0;
            var  marginTop =0;

            while(currentElement !== null && typeof currentElement !== 'undefined'){
                var computedStyles = $window.getComputedStyle(currentElement);
                var mbottom = parseInt(computedStyles['margin-bottom'], 10);
                var pbottom = parseInt(computedStyles['padding-bottom'], 10);
                var ptop = parseInt(computedStyles['padding-top'], 10);
                var mtop = parseInt(computedStyles['margin-top'], 10);
                marginTop += !isNaN(mtop)? mtop : 0;
                marginBottom += !isNaN(mbottom) ? mbottom : 0;
                paddingBottom += !isNaN(pbottom) ? pbottom : 0;
                paddingTop += !isNaN(ptop)? ptop : 0;
                currentElement = currentElement.parentElement;
            }

            var elementProperties = $window.getComputedStyle(element[0]);
            var elementPaddingBottom = parseInt(elementProperties['padding-bottom'], 10);
            var elementToResizeContainer = elementToResize.getBoundingClientRect();
            element.css('height', ($window.innerHeight
                - (elementToResizeContainer.top )-marginBottom -
                (paddingBottom - elementPaddingBottom)
                + 'px' ));
            element.css('overflow-y', 'auto');
        }

        $timeout(function(){
            _onWindowsResize();
        $window.addEventListener('resize', function () {
            _onWindowsResize();
        });
        },250)

    };

}]);
'use strict';

/**
 * @ngdoc directive
 * @name itesoft.directive:pixelWidth
 * @module itesoft
 * @restrict A
 *
 * @description
 * Simple Stylesheet class to manage width.
 * width-x increment by 25
 *
 *
 * @example
 <example module="itesoft">
 <file name="index.html">
         <!-- CSS adaptation for example purposes. Do not do this in production-->
         <div class="width-75" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .width-75
         </div>
         <div class="width-225" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .width-225
         </div>
         <div class="width-1000" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .width-1000
         </div>
 </file>
 </example>
 */
'use strict';

/**
 * @ngdoc directive
 * @name itesoft.directive:rowHeight
 * @module itesoft
 * @restrict A
 *
 * @description
 * Simple Stylesheet class to manage height like bootstrap row.<br/>
 * Height is split in 10 parts.<br/>
 * Div's parent need to have a define height (in pixel, or all parent need to have it-fill class).<br/>
 *
 *
 * @example
 <example module="itesoft">
 <file name="index.html">
 <div style="height: 300px" >
     <div class="col-md-3 row-height-10">
         <!-- CSS adaptation for example purposes. Do not do this in production-->
         <div class="row-height-5" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-5
         </div>
     </div>
     <div  class="col-md-3 row-height-10">
        <!-- CSS adaptation for example purposes. Do not do this in production-->
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
            .row-height-1
         </div>
         <div class="row-height-2" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
           .row-height-2
         </div>
         <div class="row-height-3" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
            .row-height-3
         </div>
         <div class="row-height-4" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
            .row-height-4
         </div>
     </div>
     <div  class="col-md-3 row-height-10">
         <!-- CSS adaptation for example purposes. Do not do this in production-->
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
         <div class="row-height-1" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-1
         </div>
    </div>
     <div class="col-md-3 row-height-10">
         <!-- CSS adaptation for example purposes. Do not do this in production-->
         <div class="row-height-10" style="background-color: rgba(86,61,124,.15);border: solid 1px white;padding:5px; ">
         .row-height-10
         </div>
     </div>
 <div>
 </file>
 </example>
 */
'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itCollapsedItem
 * @module itesoft
 * @restrict E
 * @parent sideMenus
 *
 * @description
 * Directive to collapse grouped item in {@link itesoft.directive:itSideMenus `<it-side-menus>`}.
 *
 * <img src="../dist/assets/img/collapsed-item.gif" alt="">
 * @usage
 *  <li>
 *  </li>
 *  <li it-collapsed-item=""  >
 *    <a href=""><h5>Menu Title</h5></a>
 *    <ul  class=" nav navbar-nav  nav-pills nav-stacked it-menu-animated ">
 *        <li>
 *            <a  href="#/datatable">Normal</a>
 *        </li>
 *    </ul>
 *  </li>
 *  <li>
 *  </li>
 */
IteSoft
    .directive('itCollapsedItem', function() {
        return  {
            restrict : 'A',
            link : function ( scope,element, attrs) {
                var menuItems = angular.element(element[0]
                    .querySelector('ul'));
                var link = angular.element(element[0]
                    .querySelector('a'));
                menuItems.addClass('it-side-menu-collapse');
                element.addClass('it-sub-menu');
                var title = angular.element(element[0]
                    .querySelector('h5'));
                var i = angular.element('<i class="pull-right fa fa-angle-right" ></i>');
                title.append(i);
                link.on('click', function () {
                    if (menuItems.hasClass('it-side-menu-collapse')) {
                        menuItems.removeClass('it-side-menu-collapse');
                        menuItems.addClass('it-side-menu-expanded');
                        i.removeClass('fa-angle-right');
                        i.addClass('fa-angle-down');
                        element.addClass('toggled');
                    } else {
                        element.removeClass('toggled');
                        i.addClass('fa-angle-right');
                        i.removeClass('fa-angle-down');
                        menuItems.removeClass('it-side-menu-expanded');
                        menuItems.addClass('it-side-menu-collapse');

                    }
                });

            }
        }
    });


'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itNavActive
 * @module itesoft
 * @restrict A
 *
 * @description
 * Directive to set active view css class on side menu item {@link itesoft.directive:itSideMenus `<it-side-menus>`}.
 *
 *  <div class="jumborton ng-scope">
 *    <img src="../dist/assets/img/nav-active.gif" alt="">
 *  </div>
 *
 * ```html
 *     <it-side-menu>
 *            <ul it-nav-active="active" class="nav navbar-nav nav-pills nav-stacked list-group">
 *                <li>
 *                <a href="#"><h5><i class="fa fa-home fa-fw"></i>&nbsp; Content</h5></a>
 *                </li>
 *                <li>
 *                <a href="#/typo"><h5><i class="fa fa-book fa-fw"></i>&nbsp; Typography</h5></a>
 *                </li>
 *                <li>
 *                <a href=""><h5><i class="fa fa-book fa-fw"></i>&nbsp; Tables</h5></a>
 *                </li>
 *            </ul>
 *
 *     </it-side-menu>
 * ```
 *
 */

IteSoft.
    directive('itNavActive', ['$location', function ($location) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element,attrs) {
                var clazz = attrs.itActive || 'active';
                function setActive() {
                    var path = $location.path();
                    if (path) {
                        angular.forEach(element.find('li'), function (li) {
                            var anchor = li.querySelector('a');
                            if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                                angular.element(li).addClass(clazz);
                            } else {
                                angular.element(li).removeClass(clazz);
                            }
                        });
                    }
                }

                setActive();

                scope.$on('$locationChangeSuccess', setActive);
            }
        }
    }]);
'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSideMenu
 * @module itesoft
 * @restrict E
 * @parent sideMenus
 *
 * @description
 * A container for a side menu, sibling to an {@link itesoft.directive:itSideMenuContent} Directive.
 * see {@link itesoft.directive:itSideMenus `<it-side-menus>`}.
 *
 * @usage
 * <it-side-menu>
 * </it-side-menu>
 */
IteSoft
    .directive('itSideMenu',function(){
        return {
            restrict: 'E',
            require : '^itSideMenus',
            transclude : true,
            scope:true,
            template :
                '<div class="it-side-menu it-side-menu-left it-side-menu-hide it-menu-animated" ng-class="{\'it-side-menu-hide\':!showmenu,\'it-side-menu-slide\':showmenu}">' +
                   '<div class="it-sidebar-inner">'+
                        '<div class="nav navbar navbar-inverse">'+
                        '<nav class="" ng-transclude ></nav>' +
                        '</div>'+
                    '</div>'+
                '</div>'


        }
});
'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSideMenuContent

 * @module itesoft
 * @restrict E
 * @parent itesoft/sideMenus
 *
 * @description
 * A container for a side menu, sibling to an directive.
 * see {@link itesoft.directive:itSideMenus `<it-side-menus>`}.
 * @usage
 * <it-side-menu>
 * </it-side-menu>
 */
IteSoft

    .directive('itSideMenuContent',function(){
        return {
            restrict : 'ECA',
            require : '^itSideMenus',
            transclude : true,
            scope : true,
            template :
                '<div class="it-menu-content" ng-class="{\'it-side-menu-overlay\':showmenu}">' +
                    '<div class="it-container it-fill" ng-transclude></div>'+
                '</div>'
        }
    });
'use strict';

IteSoft
    .controller("$sideMenuCtrl",[
        '$scope',
        '$document',
        '$timeout'
        ,'$window',
        function($scope,
                 $document,
                 $timeout,
                 $window){
        var _self = this;
        _self.scope = $scope;

        _self.scope.showmenu = false;
        _self.toggleMenu = function(){

            _self.scope.showmenu=(_self.scope.showmenu) ? false : true;

            $timeout(function(){
                var event = document.createEvent('Event');
                event.initEvent('resize', true /*bubbles*/, true /*cancelable*/);
                $window.dispatchEvent(event);
            },300)
        };
        _self.hideSideMenu = function(){
            _self.scope.showmenu= false;
        }
    }]);

'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSideMenuHeader
 * @module itesoft
 * @restrict E
 * @parent sideMenus
 *
 * @description
 * A container for a side menu header.
 * see {@link itesoft.directive:itSideMenus `<it-side-menus>`}
 *
 * <table class="table">
 *  <tr>
 *   <td><code>it-animate="true | false"</code></td>
 *   <td>Static or animated button.</td>
 *  </tr>
 *  <tr>
 *   <td><code>it-button-menu="true | false"</code></td>
 *   <td>show or hide side menu button</td>
 *  </tr>
 *</table>
 *
 * @usage
 * <it-side-menu-header it-animate="true | false" it-hide-button-menu="true | false">
 * </it-side-menu-header>
 */
IteSoft
    .directive('itSideMenuHeader',['$rootScope',function($rootScope){
        return {
            restrict: 'E',
            require : '^itSideMenus',
            transclude : true,
            scope: true,
            link : function (scope, element, attrs ,sideMenuCtrl) {

                var child = angular.element(element[0]
                    .querySelector('.it-material-design-hamburger__layer'));
                var button = angular.element(element[0]
                    .querySelector('.it-material-design-hamburger__icon'));

                scope.toggleMenu = sideMenuCtrl.toggleMenu;
                if(attrs.itAnimate === "true") {
                    scope.$watch('showmenu', function (newValue, oldValue) {
                        if (newValue != oldValue) {
                            if (!newValue) {
                                child.removeClass('it-material-design-hamburger__icon--to-arrow');
                                child.addClass('it-material-design-hamburger__icon--from-arrow');
                                $rootScope.$broadcast('it-sidemenu-state', 'opened');
                            } else {
                                child.removeClass('it-material-design-hamburger__icon--from-arrow');
                                child.addClass('it-material-design-hamburger__icon--to-arrow');
                                $rootScope.$broadcast('it-sidemenu-state', 'closed');
                            }
                        }
                    }, true);
                }

                if(attrs.itHideButtonMenu){
                    scope.itHideButtonMenu = scope.$eval(attrs.itHideButtonMenu);

                }
                scope.$watch(attrs.itHideButtonMenu, function(newValue, oldValue) {
                    scope.itHideButtonMenu = newValue;
                    if(newValue){
                        sideMenuCtrl.hideSideMenu();
                    }
                });

            },
            template :
                '<nav id="header" class="it-side-menu-header nav navbar navbar-fixed-top navbar-inverse">' +
                    '<section class="it-material-design-hamburger" ng-hide="itHideButtonMenu">' +
                        '<button  ng-click="toggleMenu()" class="it-material-design-hamburger__icon">' +
                            '<span class="it-menu-animated it-material-design-hamburger__layer"> ' +
                            '</span>' +
                        '</button>' +
                    ' </section>' +
                    '<div class="container-fluid" ng-transclude>' +
                    '</div>' +
                '</nav>'
        }
    }]);

'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSideMenus
 * @module itesoft
 * @restrict ECA
 *
 * @description
 * A container element for side menu(s) and the main content. Allows the left and/or right side menu
 * to be toggled by dragging the main content area side to side.
 *
 * To use side menus, add an `<it-side-menus>` parent element. This will encompass all pages that have a
 * side menu, and have at least 2 child elements: 1 `<it-side-menu-content>` for the center content,
 * and `<it-side-menu>` directives
 *

 *
 * ```html
 * <it-side-menus>
 *
 *  <it-side-menu-header it-animate="true"  it-hide-button-menu="true">
 *  </it-side-menu-header>
 *
 *   <!-- Center content -->
 *
 *   <it-side-menu-content>
 *   </it-side-menu-content>
 *
 *   <!-- menu -->
 *
 *
 *   <it-side-menu >
 *   </it-side-menu>
 *
 * </it-side-menus>
 * ```
 * @example
    <example module="itesoft">
        <file name="index.html">

         <it-side-menus>
             <it-side-menu-header it-animate="true"  it-button-menu="true">


             </it-side-menu-header>

             <it-side-menu>
                     <ul it-nav-active="active" class="nav navbar-nav nav-pills nav-stacked list-group">


                     <li it-collapsed-item=""   >
                     <a href=""><h5>Menu</h5></a>
                     <ul  class="nav navbar-nav nav-pills nav-stacked it-menu-animated">
                     <li >
                     <a href="#/widget/itloader">SubMenu1</a>
                     </li>
                     <li >
                     <a href="#/widget/itBottomGlue">SubMenu2</a>
                     </li>
                     </ul>
                     </li>
                     </ul>
              </it-side-menu>


             <it-side-menu-content>

                 <h1>See on Plunker !</h1>

             </it-side-menu-content>
         </it-side-menus>

    </file>
  </example>
 */
IteSoft
    .directive('itSideMenus',function(){
        return {
            restrict: 'ECA',
            transclude : true,
            controller : '$sideMenuCtrl',
            template : '<div class="it-side-menu-group" ng-transclude></div>'
        }
});
'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSidePanel
 * @module itesoft
 * @restrict E
 *
 * @description
 * A container element for side panel and its Header, Content and Footer
 *
 * <table class="table">
 *   <tr>
 *      <td>
 *          <pre>
 *              <it-side-panel it-col="3">
 *              </it-side-panel>
 *          </pre>
 *      </td>
 *      <td>number of bootstrap columns of the Site Panel element, if undefined = 4</td>
 *  </tr>
 *  <tr>
 *      <td>
 *          <pre>
 *          <it-side-panel it-z-index="700">
 *          </it-side-panel>
 *          </pre>
 *      </td>
 *      <td>set the  z-index of the Site Panel elements, by default take highest index of the view.</td>
 *  </tr>
 *  <tr>
 *      <td>
 *          <pre>
 *              <it-side-panel it-icon-class="fa-star-o">
 *              </it-side-panel>
 *          </pre>
 *      </td>
 *      <td>set icon class of Site Panel button. Use Font Awesome icons</td>
 *  </tr>
 *  <tr>
 *      <td>
 *          <pre>
 *              <it-side-panel it-height-mode="auto | window | full">
 *              </it-side-panel>
 *          </pre>
 *      </td>
 *      <td>
 *          set "Height Mode" of the Side Panel.
 *          <ul>
 *              <li><b>auto</b> :
 *                  <ul>
 *                      <li>if height of Side Panel is greater to the window's : the mode "window" will be applied.</li>
 *                      <li>Else the height of Side Panel is equal to its content</li>
 *                  </ul>
 *                </li>
 *              <li><b>window</b> : the height of the side panel is equal to the height of the window </li>
 *              <li><b>full</b>
*                   <ul>
 *                      <li>If the height of Side Panel is smaller than the window's, the mode "auto" is applied</li>
 *                      <li>Else the height of Side Panel covers the height of its content (header, content and footer) without scroll bar.</li>
 *                  </ul>
 *              </li>
 *          </ul>
 *      </td>
 *  </tr>
 *  <tr>
 *      <td>
 *          <pre>
 *              <it-side-panel it-top-position="XX | none">
 *              </it-side-panel>
 *          </pre>
 *      </td>
 *      <td>
 *          set css top position of the Side Panel. Default value is "none" mode
 *          <ul>
 *              <li><b>none</b> :  Will take the default css "top" property of theSide Panel. Default "top" is "0px". This position can be override by 'it-side-panel .it-side-panel-container' css selector</li>
 *              <li><b>XX</b> : Has to be a number. It will override the default css top position of Side Panel. <i>Ex : with it-top-position="40", the top position of Side Panel will be "40px"</i>
 *              </li>
 *          </ul>
 *      </td>
 *  </tr>
 * </table>
 *
 * ```html
 * <it-side-panel>
 *      <it-side-panel-header>
 *          <!--Header of Side Panel -->
 *      </it-side-panel-header>
 *      <it-side-panel-content>
 *          <!--Content Side Panel-->
 *      </it-side-panel-content>
 *      <it-side-panel-footer>
 *          <!--Footer Side Panel-->
 *      </it-side-panel-footer>
 * </it-side-panel>
 * ```
 * @example
 <example module="itesoft">
 <file name="custom.css">

     it-side-panel:nth-of-type(1) .it-side-panel-container .it-side-panel-button  {
       background-color: blue;
     }

     it-side-panel:nth-of-type(2) .it-side-panel-container .it-side-panel-button {
       background-color: green;
     }

     it-side-panel:nth-of-type(3) .it-side-panel-container .it-side-panel-button {
       background-color: gray;
     }


     .it-side-panel-container .it-side-panel .it-side-panel-footer {
        text-align: center;
        display: table;
        width: 100%;
     }

     .it-side-panel-container .it-side-panel .it-side-panel-footer div{
        display: table-cell;
        vertical-align:middle;
     }

     .it-side-panel-container .it-side-panel .it-side-panel-footer .btn {
        margin:0px;
     }

 </file>
 <file name="index.html">

 <it-side-panel it-col="6" it-z-index="1100" it-height-mode="window" it-top-position="40"  it-icon-class="fa-star-o">
 <it-side-panel-header>
 <div><h1>Favorites</h1></div>
 </it-side-panel-header>
 <it-side-panel-content>
 <div>
 <h2>Favorite 1</h2>
 <p>

 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae, repudiandae, totam vel dignissimos saepe cum assumenda velit tempora blanditiis harum hic neque et magnam tenetur alias provident tempore cumque facilis.
 </p>

 <br>
 <h2>Favorite 2</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 3</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 4</h2>
 <p>
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas, tenetur, nesciunt molestias illo sapiente ab officia soluta vel ipsam aut laboriosam hic veritatis assumenda alias in enim rem commodi optio?
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt quisquam autem debitis perspiciatis explicabo! Officiis, eveniet quas illum commodi cum rerum temporibus repellendus ducimus magnam facilis a aliquam eligendi minus.
 </p>
 <br>
 <h2>Favorite 5</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 6</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 7</h2>
 <p>
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas, tenetur, nesciunt molestias illo sapiente ab officia soluta vel ipsam aut laboriosam hic veritatis assumenda alias in enim rem commodi optio?
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt quisquam autem debitis perspiciatis explicabo! Officiis, eveniet quas illum commodi cum rerum temporibus repellendus ducimus magnam facilis a aliquam eligendi minus.
 </p>
 <br>
 <h2>Favorite 8</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 9</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 10</h2>
 <p>
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas, tenetur, nesciunt molestias illo sapiente ab officia soluta vel ipsam aut laboriosam hic veritatis assumenda alias in enim rem commodi optio?
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt quisquam autem debitis perspiciatis explicabo! Officiis, eveniet quas illum commodi cum rerum temporibus repellendus ducimus magnam facilis a aliquam eligendi minus.
 </p>
 <br>
 <h2>Favorite 11</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 12</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 13</h2>
 <p>
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas, tenetur, nesciunt molestias illo sapiente ab officia soluta vel ipsam aut laboriosam hic veritatis assumenda alias in enim rem commodi optio?
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt quisquam autem debitis perspiciatis explicabo! Officiis, eveniet quas illum commodi cum rerum temporibus repellendus ducimus magnam facilis a aliquam eligendi minus.
 </p>
 <br>
 <h2>Favorite 14</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 15</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Favorite 16</h2>
 <p>
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas, tenetur, nesciunt molestias illo sapiente ab officia soluta vel ipsam aut laboriosam hic veritatis assumenda alias in enim rem commodi optio?
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt quisquam autem debitis perspiciatis explicabo! Officiis, eveniet quas illum commodi cum rerum temporibus repellendus ducimus magnam facilis a aliquam eligendi minus.
 </p>


 </div>
 </it-side-panel-content>
 <it-side-panel-footer>
 <div><button class="btn btn-default btn-success">Submit</button></div>
 </it-side-panel-footer>
 </it-side-panel>


 <it-side-panel it-col="8" it-z-index="1200" it-height-mode="auto" it-top-position="none"  it-icon-class="fa-pied-piper-alt">
 <it-side-panel-header>
 <div><h1>Silicon Valley</h1></div>
 </it-side-panel-header>
 <it-side-panel-content>
 <div>
 <h2>Paragraph 1</h2>
 <p>

 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae, repudiandae, totam vel dignissimos saepe cum assumenda velit tempora blanditiis harum hic neque et magnam tenetur alias provident tempore cumque facilis.
 </p>

 <br>
 <h2>Paragraph 2</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Paragraph 3</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>

 </div>
 </it-side-panel-content>
 <it-side-panel-footer>
 <div><button class="btn btn-default btn-success">Submit</button></div>
 </it-side-panel-footer>
 </it-side-panel>



 <it-side-panel it-col="2" it-z-index="1300" it-height-mode="full" it-top-position="80">
 <it-side-panel-header>
 <div><h1>Search</h1></div>
 </it-side-panel-header>
 <it-side-panel-content>
 <div>
 <h2>Search 1</h2>
 <p>

 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.
 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae, repudiandae, totam vel dignissimos saepe cum assumenda velit tempora blanditiis harum hic neque et magnam tenetur alias provident tempore cumque facilis.
 </p>

 <br>
 <h2>Search 2</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>
 <br>
 <h2>Search 3</h2>
 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, delectus suscipit laboriosam commodi harum totam quas! Autem, quaerat, neque, unde qui nobis aperiam culpa dignissimos iusto ipsam similique dolorem dolor.</p>

 </div>
 </it-side-panel-content>
 <it-side-panel-footer>
 <div><button class="btn btn-default btn-success">Submit</button></div>
 </it-side-panel-footer>
 </it-side-panel>

 </file>
 </example>
 */
IteSoft
    .directive('itSidePanel', ['$window', function ($window) {


        function _link(scope, element, attrs) {

            scope.itSidePanelElement = element;

            scope.setIconClass(scope, attrs);

            scope.setZIndexes(element, attrs);

            scope.setColMd(attrs);

            scope.setHeightMode(attrs);

            scope.setTopPosition(attrs);

        }

        return {
            link: _link,
            restrict: 'E',
            transclude: true,
            controller: '$sidePanelCtrl',
            scope : true,
            template:
            '<div class="it-side-panel-container" ng-class="{\'it-side-panel-container-show\': showPanel}">' +
                '<div class="it-side-panel-button it-vertical-text" ng-class="{\'it-side-panel-button-show\':showPanel,\'it-side-panel-button-right\':!showPanel}" ng-click="toggleSidePanel()">' +
                    '<span class="fa {{itIconClass}}"></span>' +
                '</div>'+
                '<div class="it-side-panel" ng-transclude></div>'+
            '</div>'

        };
    }]);


'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSidePanelContent
 * @module itesoft
 * @restrict E
 *
 * @description
 * A container for a Side Panel content, sibling to an directive.
 * see {@link itesoft.directive:itSidePanel `<it-side-panel>`}.
 * @usage
 * <it-side-panel-content>
 * </it-side-panel-content>
 */
IteSoft
    .directive('itSidePanelContent', function () {
        function _link(scope) {

        }

        return {
            scope: false,
            link: _link,
            restrict: 'E',
            transclude: true,
            require: '^itSidePanel',
            template:
                '<div class="it-side-panel-content" ng-transclude></div>'
        };
    });


'use strict';

IteSoft
    .controller("$sidePanelCtrl", [
        '$scope',
        '$window',
        '$document',
        '$timeout',
        '$log',
        function ($scope, $window, $document, $timeout, $log) {


            var COL_MD_NAME = 'it-col';
            var HEIGHT_MODE_NAME = 'it-height-mode';
            var TOP_POSITION_NAME = 'it-top-position';

            var DEFAULT_SIDE_PANEL_BUTTON_WIDTH = 40;

            var Z_INDEX_CSS_KEY = 'z-index';

            var IT_HEIGHT_MODE_WINDOW = 'window';
            var IT_HEIGHT_MODE_FULL = 'full';
            var IT_HEIGHT_MODE_AUTO = 'auto';
            var IT_HEIGHT_MODES = [IT_HEIGHT_MODE_WINDOW, IT_HEIGHT_MODE_FULL,IT_HEIGHT_MODE_AUTO];

            var DEFAULT_HEIGHT_MODE = IT_HEIGHT_MODE_WINDOW;


            var DEFAULT_COL_MD = 4;
            var MAX_COL_MD = 12;
            var MIN_COL_MD = 1;

            var DEFAULT_ICON_CLASS = 'fa-search';


            var DEFAULT_TOP_POSITION = 'none';
            var TOP_POSITION_MODE_NONE = DEFAULT_TOP_POSITION;

            var IT_SIDE_PANEL_BUTTON_CLASS = '.it-side-panel-button';
            var IT_SIDE_PANEL_BUTTON_RIGHT_CLASS = '.it-side-panel-button-right';
            var IT_SIDE_PANEL_CONTAINER_CLASS = '.it-side-panel-container';
            var IT_SIDE_PANEL_CLASS = '.it-side-panel';
            var IT_SIDE_PANEL_HEADER_CLASS = '.it-side-panel-header';
            var IT_SIDE_PANEL_CONTENT_CLASS = '.it-side-panel-content';
            var IT_SIDE_PANEL_FOOTER_CLASS = '.it-side-panel-footer';

            var _self = this;
            _self.scope = $scope;
            _self.scope.showPanel = false;

            _self.scope.itHeightMode = DEFAULT_HEIGHT_MODE;

            //Set default col-md(s) to the scope
            _self.scope.itSidePanelcolMd = DEFAULT_COL_MD;

            _self.scope.itSidePanelTopPosition = DEFAULT_TOP_POSITION;

            _self.scope.sidePanelButtonWidth = DEFAULT_SIDE_PANEL_BUTTON_WIDTH;

            _self.scope.sidePanelContainerWidth = null;
            _self.scope.sidePanelContainerRight = null;
            _self.scope.sidePanelButtonRight = null;


            var w = angular.element($window);


            /**
             * Get window Dimensions
             * @returns {{height: Number, width: Number}}
             */
            _self.scope.getWindowDimensions = function () {
                return {
                    'height': $window.innerHeight,
                    'width': $window.innerWidth
                };
            };

            /**
             * Watch the resizing of window Dimensions
             */
            _self.scope.$watch(_self.scope.getWindowDimensions, function (newValue, oldValue) {

                _self.scope.windowHeight = newValue.height;
                _self.scope.windowWidth = newValue.width;

                var sidePanelContainer = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTAINER_CLASS);

                if (_self.scope.itHeightMode === IT_HEIGHT_MODE_WINDOW) {

                    var top = sidePanelContainer[0].getBoundingClientRect().top;

                    //Do not update side panel height property when
                    // Math.abs('top' value of side panel container) is greater than the height of the window
                    if(Math.abs(top) < _self.scope.windowHeight){

                        var itTopPosition = _self.scope.itSidePanelTopPosition;
                        if(_self.scope.isNoneTopPosition()){
                            itTopPosition = 0;
                        }

                        var newHeight = (_self.scope.windowHeight-top-itTopPosition);

                        var heightHeader = (newHeight*0.10);
                        var sidePanelHeader = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_HEADER_CLASS);
                        sidePanelHeader.css('height',heightHeader+'px');

                        var heightFooter = (newHeight*0.10);
                        var sidePanelFooter = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_FOOTER_CLASS);
                        sidePanelFooter.css('height',heightFooter+'px');

                        var sidePanelContent = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTENT_CLASS);
                        sidePanelContent.css('height', (newHeight*0.8)+'px');

                    }
                }


                if(_self.scope.showPanel){
                    var newWidth = (_self.scope.windowWidth/12*_self.scope.itSidePanelcolMd);
                    _self.scope.sidePanelContainerWidth = newWidth;
                    sidePanelContainer.css('width', newWidth + 'px');
                //if its the firt time initialise all components width an right
                }else {
                    _self.scope.modifySidePanelCssProperties();
                }

            }, true);

            /**
             * Update Side panel Css properties (right and width)
             */
            _self.scope.modifySidePanelCssProperties = function (){

                var sidePanelContainer = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTAINER_CLASS);
                var sidePanelButtonRight = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_BUTTON_RIGHT_CLASS);
                var newWidth = (_self.scope.windowWidth / 12) * _self.scope.itSidePanelcolMd;

                _self.scope.sidePanelContainerWidth = newWidth;
                _self.scope.sidePanelContainerRight = -_self.scope.sidePanelContainerWidth;
                _self.scope.sidePanelButtonRight = _self.scope.sidePanelContainerWidth;

                //update side panel container right and width properties
                sidePanelContainer.css('width', _self.scope.sidePanelContainerWidth + 'px');
                sidePanelContainer.css('right', _self.scope.sidePanelContainerRight + 'px');

                //update side panel button right right property
                sidePanelButtonRight.css('right', _self.scope.sidePanelButtonRight + 'px');
            };

            w.bind('resize', function () {
                _self.scope.$apply();
            });

            /**
             * Change class for display Side Panel or not depending on the value of @{link: _self.scope.showPanel}
             */
            _self.scope.toggleSidePanel = function () {
                _self.scope.showPanel = (_self.scope.showPanel) ? false : true;

                var sidePanelContainer = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTAINER_CLASS);
                var iconButtonElement = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_BUTTON_CLASS);

                if(_self.scope.showPanel){

                    //Reset the right property of Side panel button
                    iconButtonElement.css('right', "");

                    //Do the transition in order to the side panel be visible
                    //Wait few ms to prevent unexpected "iconButtonElement" transition behaviour
                    $timeout(function(){
                        _self.scope.sidePanelContainerRight = 0;
                        sidePanelContainer.css('right', _self.scope.sidePanelContainerRight+'px');
                    },50);


                } else {

                    var newRight = sidePanelContainer.css('width');
                    _self.scope.sidePanelContainerRight = -parseInt(newRight.slice(0, newRight.length-2));
                    _self.scope.sidePanelButtonRight = _self.scope.sidePanelContainerWidth;

                    sidePanelContainer.css('right', _self.scope.sidePanelContainerRight+'px');
                    iconButtonElement.css('right', _self.scope.sidePanelButtonRight+'px');
                }
            };

            _self.scope.setItSidePanelElement = function(element){
                _self.scope.itSidePanelElement = element;
            };


            /**
             * Set the Side Panel Height Mode from "it-height-mode" attributes
             * @param attrs directive attributes object
             */
            _self.scope.setHeightMode = function (attrs){
                _self.scope.itHeightMode = attrs.itHeightMode;

                //If attribute is not defined set the default height Mode
                if (_self.scope.itHeightMode === '' || typeof _self.scope.itHeightMode === 'undefined') {
                    _self.scope.itHeightMode = DEFAULT_HEIGHT_MODE;

                } else if (IT_HEIGHT_MODES.indexOf(_self.scope.itHeightMode) != -1 ) {
                    var index = IT_HEIGHT_MODES.indexOf(_self.scope.itHeightMode);
                    //Get the provided mode
                    _self.scope.itHeightMode = IT_HEIGHT_MODES[index];
                } else{

                    //If height mode is defined but unknown set to the default  height mode
                    _self.scope.itHeightMode = DEFAULT_HEIGHT_MODE;
                    $log.error('"'+HEIGHT_MODE_NAME+'" with value "'+_self.scope.itHeightMode+'"is unknown. ' +
                        'The default value is taken : "'+DEFAULT_HEIGHT_MODE+'"');
                }

                //Set height of header, content and footer
                var sidePanelHeader = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_HEADER_CLASS);
                sidePanelHeader.css('height','10%');

                var sidePanelFooter = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_FOOTER_CLASS);
                sidePanelFooter.css('height','10%');

                var sidePanelContent = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTENT_CLASS);
                sidePanelContent.css('height', '80%');



                //Configure height of Side Panel elements depending on the provided height mode
                switch(_self.scope.itHeightMode) {
                    case IT_HEIGHT_MODE_FULL:

                        var sidePanelContainer = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTAINER_CLASS);
                        var sidePanelContainerHeight = sidePanelContainer.css('height');

                        if(sidePanelContainerHeight > _self.scope.windowHeight){
                            sidePanelContainer.css('height', '100%');
                            var sidePanel = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CLASS);
                            sidePanel.css('height', '100%');
                        }
                        break;
                    case IT_HEIGHT_MODE_AUTO:
                        //console.log(IT_HEIGHT_MODE_AUTO+" mode!");
                        break;
                    case IT_HEIGHT_MODE_WINDOW:

                        var sidePanel = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CLASS);
                        sidePanel.css('height', '100%');

                        //set overflow : auto to the Side Panel Content
                        var sidePanelContent = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTENT_CLASS);
                        sidePanelContent.css('overflow', 'auto');
                        break;
                    default:
                        $log.error('Height mode : "'+_self.scope.itHeightMode+'" is unknown.');
                }
            };

            /**
             * Retrieve provided iconClass and put the value it in scope
             * @param scope the scope
             * @param attrs the attributes provided by directive
             * @private
             */
            _self.scope.setIconClass = function (scope, attrs) {
                var defaultIconClass = DEFAULT_ICON_CLASS;
                if (attrs.itIconClass === '' || typeof attrs.itIconClass === 'undefined') {
                    _self.scope.itIconClass = defaultIconClass;
                } else {
                    _self.scope.itIconClass = attrs.itIconClass;
                }
            };

            /**
             * Handle col-md of directive.
             * If itCol is provided to the directive apply its col-md-X
             * If no itCol is provided to the directive, the col-md-X applied will be the default col-md-X. Where X is DEFAULT_COL_MD
             * @param element
             * @param attrs
             */
            _self.scope.setColMd = function (attrs) {
                var colMd = DEFAULT_COL_MD;
                if (!isNaN(parseInt(attrs.itCol))) {

                    if (attrs.itCol > MAX_COL_MD) {
                        _self.scope.itSidePanelcolMd = MAX_COL_MD;
                        $log.warn('Attribute "' + COL_MD_NAME + '" of itSidePanel directive exceeds the maximum value ' +
                            '(' + MAX_COL_MD + '). The maximum value is taken.');
                    } else if (attrs.itCol < MIN_COL_MD) {
                        _self.scope.itSidePanelcolMd = MIN_COL_MD;
                        $log.warn('Attribute "' + COL_MD_NAME + '" of itSidePanel directive exceeds the minimum value ' +
                            '(' + MIN_COL_MD + '). The minimum value is taken.');
                    } else {
                        _self.scope.itSidePanelcolMd = attrs.itCol;
                    }
                } else {
                    _self.scope.itSidePanelcolMd = DEFAULT_COL_MD;
                    $log.warn('Attribute "' + COL_MD_NAME + '" of itSidePanel directive is not a number. ' +
                     'The default value is taken : "' + _self.scope.itSidePanelcolMd + '"');
                }
            };

            /**
             * Handle z indexes of directive.
             * If itZIndex is provided to the directive apply its z-index
             * If no itZIndex is provided to the directive, the z-index applied will be the highest zi-index of the DOM + 100
             * @param element
             * @param attrs
             */
            _self.scope.setZIndexes = function (element, attrs) {

                var zindex = null;
                if (!isNaN(parseInt(attrs.itZIndex))) {
                    zindex = parseInt(attrs.itZIndex);
                }

                var sidePanelContainer = _self.scope.getElementFromClass(element, IT_SIDE_PANEL_CONTAINER_CLASS);
                var iconButtonElement = _self.scope.getElementFromClass(element, IT_SIDE_PANEL_BUTTON_CLASS);

                if (zindex !== null) {
                    sidePanelContainer.css(Z_INDEX_CSS_KEY, zindex);
                    iconButtonElement.css(Z_INDEX_CSS_KEY, zindex + 1);
                } else {

                    var highestZIndex = _self.scope.findHighestZIndex();
                    var newHighestZIndex = highestZIndex + 100;

                    //set the zindex to side panel element
                    sidePanelContainer.css(Z_INDEX_CSS_KEY, newHighestZIndex);

                    //set the zindex to the icon button of the side panel element
                    iconButtonElement.css(Z_INDEX_CSS_KEY, newHighestZIndex + 1);

                }
            };

            /**
             * Get Dom element from its class
             * @param element dom element in which the class search will be performed
             * @param className className. Using 'querySelector' selector convention
             * @private
             */
            _self.scope.getElementFromClass = function (element, className) {
                var content = angular.element(element[0].querySelector(className));
                var sidePanel = angular.element(content[0]);
                return sidePanel;
            };

            /**
             * Find the highest z-index of the DOM
             * @returns {number} the highest z-index value
             * @private
             */
            _self.scope.findHighestZIndex = function () {
                var elements = document.getElementsByTagName("*");
                var highest_index = 0;

                for (var i = 0; i < elements.length - 1; i++) {
                    var computedStyles = $window.getComputedStyle(elements[i]);
                    var zindex = parseInt(computedStyles['z-index']);
                    if ((!isNaN(zindex) ? zindex : 0 ) > highest_index) {
                        highest_index = zindex;
                    }
                }
                return highest_index;
            };

            _self.scope.setTopPosition = function (attrs) {
                var topPosition = attrs.itTopPosition;
                if (!isNaN(parseInt(topPosition))) {
                    _self.scope.itSidePanelTopPosition = attrs.itTopPosition;
                    var sidePanelContainer = _self.scope.getElementFromClass(_self.scope.itSidePanelElement, IT_SIDE_PANEL_CONTAINER_CLASS);
                    sidePanelContainer.css('top', _self.scope.itSidePanelTopPosition + 'px');

                } else if (!_self.scope.isNoneTopPosition() || typeof topPosition === 'undefined') {

                    _self.scope.itSidePanelTopPosition = TOP_POSITION_MODE_NONE;
                    $log.warn('Attribute "' + TOP_POSITION_NAME + '" of itSidePanel directive is not a number. ' +
                    'The mode taken is "' + TOP_POSITION_MODE_NONE + '"');
                }
            };

            /**
             *
             * @returns {boolean}
             */
            _self.scope.isNoneTopPosition = function () {
                return _self.scope.itSidePanelTopPosition === 'none';
            };
        }
    ]);

'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSidePanelFooter
 * @module itesoft
 * @restrict E
 *
 * @description
 * A container for a Side Panel footer, sibling to an directive.
 * see {@link itesoft.directive:itSidePanel `<it-side-panel>`}.
 * @usage
 * <it-side-panel-footer>
 * </it-side-panel-footer>
 */
IteSoft
    .directive('itSidePanelFooter', function () {
        function _link(scope) {

        }

        return {
            scope: false,
            link: _link,
            restrict: 'E',
            transclude: true,
            require : '^itSidePanel',
            template:
                '<div class="it-side-panel-footer" ng-transclude></div>'
        };
    });


'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itSidePanelHeader
 * @module itesoft
 * @restrict E
 *
 * @description
 * A container for a Side Panel header, sibling to an directive.
 * see {@link itesoft.directive:itSidePanel `<it-side-panel>`}.
 * @usage
 * <it-side-panel-header>
 * </it-side-panel-header>
 */
IteSoft
    .directive('itSidePanelHeader', function () {
        function _link(scope) {

        }

        return {
            scope: false,
            link: _link,
            restrict: 'E',
            transclude: true,
            require : '^itSidePanel',
            template:
                '<div class="it-side-panel-header text-center" ng-transclude></div>'
        };
    });


'use strict';

IteSoft
    .directive('itFillHeight', ['$window', '$document', function($window, $document) {
        return {
            restrict: 'A',
            scope: {
                footerElementId: '@',
                additionalPadding: '@'
            },
            link: function (scope, element, attrs) {

                angular.element($window).on('resize', onWindowResize);

                onWindowResize();

                function onWindowResize() {
                    var footerElement = angular.element($document[0].getElementById(scope.footerElementId));
                    var footerElementHeight;

                    if (footerElement.length === 1) {
                        footerElementHeight = footerElement[0].offsetHeight
                            + getTopMarginAndBorderHeight(footerElement)
                            + getBottomMarginAndBorderHeight(footerElement);
                    } else {
                        footerElementHeight = 0;
                    }

                    var elementOffsetTop = element[0].offsetTop;
                    var elementBottomMarginAndBorderHeight = getBottomMarginAndBorderHeight(element);

                    var additionalPadding = scope.additionalPadding || 0;

                    var elementHeight = $window.innerHeight
                        - elementOffsetTop
                        - elementBottomMarginAndBorderHeight
                        - footerElementHeight
                        - additionalPadding;

                    element.css('height', elementHeight + 'px');
                }

                function getTopMarginAndBorderHeight(element) {
                    var footerTopMarginHeight = getCssNumeric(element, 'margin-top');
                    var footerTopBorderHeight = getCssNumeric(element, 'border-top-width');
                    return footerTopMarginHeight + footerTopBorderHeight;
                }

                function getBottomMarginAndBorderHeight(element) {
                    var footerBottomMarginHeight = getCssNumeric(element, 'margin-bottom');
                    var footerBottomBorderHeight = getCssNumeric(element, 'border-bottom-width');
                    return footerBottomMarginHeight + footerBottomBorderHeight;
                }

                function getCssNumeric(element, propertyName) {
                    return parseInt(element.css(propertyName), 10) || 0;
                }
            }
        };

    }]);


'use strict';

IteSoft
    .directive('itViewMasterHeader',function(){
        return {
            restrict: 'E',
            transclude : true,
            scope:true,
            template :  '<div class="row">' +
                            '<div class="col-md-6">' +
                                '<div class="btn-toolbar" ng-transclude>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-6 pull-right">' +
                                '<div>' +
            '<form>' +
            '<div class="form-group has-feedback">' +
            '<span class="glyphicon glyphicon-search form-control-feedback"></span>' +
            '<input it-input class="form-control" type="text" placeholder="Rechercher"/>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '</div>'
        }
    });

'use strict';

IteSoft
    .directive('itViewPanel',function(){
        return {
            restrict: 'E',
            transclude : true,
            scope:true,
            template : '<div class="jumbotron" ng-transclude></div>'
        }
    });

'use strict';

IteSoft
    .directive('itViewTitle',function(){
        return {
            restrict: 'E',
            transclude : true,
            scope:true,
            template : '<div class="row"><div class="col-xs-12"><h3 ng-transclude></h3><hr></div></div>'
        }
    });

/**
 * @ngdoc filter
 * @name itesoft.filter:itUnicode
 * @module itesoft
 * @restrict EA
 *
 * @description
 * Simple filter that escape string to unicode.
 *
 *
 * @example
    <example module="itesoft">
        <file name="index.html">
             <div ng-controller="myController">
                <p ng-bind-html="stringToEscape | itUnicode"></p>

                 {{stringToEscape | itUnicode}}
             </div>
        </file>
         <file name="Controller.js">
            angular.module('itesoft')
                .controller('myController',function($scope){
                 $scope.stringToEscape = 'o"@&\'';
            });

         </file>
    </example>
 */
IteSoft
    .filter('itUnicode',['$sce', function($sce){
        return function(input) {
            function _toUnicode(theString) {
                var unicodeString = '';
                for (var i=0; i < theString.length; i++) {
                    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
                    while (theUnicode.length < 4) {
                        theUnicode = '0' + theUnicode;
                    }
                    theUnicode = '&#x' + theUnicode + ";";

                    unicodeString += theUnicode;
                }
                return unicodeString;
            }
            return $sce.trustAsHtml(_toUnicode(input));
        };
}]);


'use strict';
/**
 * Service that provide RSQL query
 */
IteSoft.factory('itAmountCleanerService', [function () {

        var supportedLocales = ['en_US',
            'en_GB', 'fr_FR', 'de_DE', 'id_IT'];

        return {
            cleanAmount: function (amountString, aLocale) {
                var result = 0;


                //Recherche si la locale passée en argument est acceptée
                var localeFound = false;
                supportedLocales.forEach(function (entry) {

                    if (JSON.stringify(entry) == JSON.stringify(aLocale)) {
                        localeFound = true;
                    }
                })

                if (localeFound == false) {
                    console.log("Unable to format amount for local "
                        + aLocale);

                    return '';
                }

                //Suppression des " " pour séparer les milliers et des caractères non numériques
                amountString = amountString.replace(/[^0-9,.]/g, "");

                // SI on est en France ou Italie, on peut taper . ou , pour les décimales
                if (JSON.stringify(aLocale) == JSON.stringify(supportedLocales[2]) || JSON.stringify(aLocale) == JSON.stringify(supportedLocales[4])) {
                    amountString = amountString.replace(",", ".");
                }

                //pas de traitement particulier pour le francais
                //si la locale est en-US
                if(JSON.stringify(aLocale) == JSON.stringify(supportedLocales[0])) {
                    //suppression de la virgule permettant de séparer les milliers
                    amountString = amountString.replace(",", "");
                    //si la locale est de-DE
                }else if(JSON.stringify(aLocale) == JSON.stringify(supportedLocales[3])) {
                    //suppression du point permettant de séparer les milliers
                    amountString = amountString.replace(".", "");
                    //remplacement de la virgule par un point
                    amountString = amountString.replace(",", ".");
                }

                //Formattage des montants avec la locale
                result = parseFloat(amountString);

                console.log('result1 ' + result);

                if (result == undefined) {
                    result = parseFloat(amountString);
                }

                console.log('result2 ' + result);

                return result;
            },

            formatAmount: function (amount, aLocale) {
                var result = '';


                //Recherche si la locale passée en argument est acceptée
                var localeFound = false;
                supportedLocales.forEach(function (entry) {

                    if (JSON.stringify(entry) == JSON.stringify(aLocale)) {
                        localeFound = true;
                    }
                })

                if (localeFound == false) {
                    console.log("Unable to format amount for local "
                        + aLocale);

                    return '';
                }
                if (amount != undefined) {
                    var amountString = amount.toString();

                    //Suppression des " " pour séparer les milliers et des caractères non numériques
                    amountString = amountString.replace(/[^0-9,.]/g, "");

                    // SI on est en France ou Italie, on peut taper . ou , pour les décimales
                    if (JSON.stringify(aLocale) == JSON.stringify(supportedLocales[2]) || JSON.stringify(aLocale) == JSON.stringify(supportedLocales[4])) {
                        amountString = amountString.replace(",", ".");
                    }
                }
                //Formattage des montants avec la locale avec 2 décimales après la virgule
                //TODO dinar tunisien, incompatible
                result = new Intl.NumberFormat(aLocale.replace("_", "-"), {minimumFractionDigits: 2,maximumFractionDigits:2}).format(parseFloat(amountString));

                return result;
            }
        }


    }
    ]
)
;
/**
 * Created by SZA on 20/01/2016.
 */

'use strict';
/**
 * Singleton that provide paginatorConfig
 */
IteSoft.factory('itPaginatorConfigService',
        ['$q', '$log', 'itNotifier', '$filter', 'MetadataService',
            function ($q, $log, itNotifier, $filter, MetadataService) {

                var self = this;
                var deferred = $q.defer();

                /**
                 * fields
                 * @type {{options: Array, defaultOption: string, loaded: boolean}}
                 */
                self.fields = {
                    options: [],
                    defaultOption: "",
                    loaded: false
                };

                /**
                 * public method
                 * @type {{initialize: initialize}}
                 */
                self.fn = {
                    initialize: initialize
                };

                return self;
                /**
                 * filter initialization
                 * @returns {*}
                 */
                function initialize() {
                    if (!self.fields.loaded) {
                        var paginatorOptionsPromise = MetadataService.getConfig.get({type: 'paginatorOptions'}).$promise;
                        var paginatorDefaultOptionPromise = MetadataService.getConfig.get({type: 'paginatorDefaultOption'}).$promise;
                        $q.all([paginatorOptionsPromise, paginatorDefaultOptionPromise]).then(
                            function (options) {
                                self.fields.defaultOption = options[1].value;
                                var paginatorOptions = options[0].value;
                                if (angular.isDefined(paginatorOptions) && paginatorOptions != null && angular.isDefined(paginatorOptions.split)) {
                                    self.fields.options = paginatorOptions.split(',');
                                } else {
                                    itNotifier.notifyError({content: $filter('translate')('ERROR.WS.METADATA_ERROR')}, paginatorOptions);
                                }

                                $log.debug("PaginatorConfigService: loaded");
                                self.fields.loaded = true;
                                deferred.resolve('ok');
                            },
                            function (failed) {
                                itNotifier.notifyError({content: $filter('translate')('ERROR.WS.METADATA_ERROR')}, failed.data);
                            });
                    } else {
                        $log.debug("PaginatorConfigService: loaded");
                        deferred.resolve('ok');
                    }
                    return deferred.promise;

                }

            }
        ]
    );
'use strict';
/**
 * Query param service
 */
IteSoft.factory('itQueryParamFactory', [function () {
    function QueryParam(key, value, operator) {
        this.key = key;
        this.value = value;
        this.operator = operator;
    }
    return {
        /**
         * create a queryParam
         * @param key: name
         * @param value: myName
         * @param operator: OPERATOR.equals
         * @returns {QueryParam}
         */
        create: function (key, value, operator) {
            return new QueryParam(key, value, operator);
        }
    }
}]);
'use strict';
/**
 * Service that provide RSQL query
 */
IteSoft.factory('itQueryFactory', ['OPERATOR', function (OPERATOR) {
        function Query(parameters, start, size, sort) {
            this.parameters = parameters;
            this.start = start;
            this.size = size;
            this.sort = sort;
            /**
             * Method that return RSQL path
             * @returns {string}: query=id==1 and name=="name"
             */
            this.build = function () {
                var result = '';
                if (parameters != undefined) {
                    this.parameters.forEach(function (entry) {
                        if(angular.isDefined(entry.value) && angular.isDefined(entry.key)) {

                            //Si c'est une date max, on définit l'heure à 23h59
                            if((entry.value instanceof Date) && (entry.operator == OPERATOR.LESS_EQUALS)){
                                entry.value.setHours(23);
                                entry.value.setMinutes(59);
                                entry.value.setSeconds(59);
                                entry.value.setMilliseconds(999);
                            }

                            if (result.length > 0) {
                                result += " and ";
                            }

                            //formattage ISO des dates
                            if (entry.value instanceof Date) {
                                entry.value = entry.value.toISOString();
                            }

                            if (entry.operator == OPERATOR.LIKE) {
                                entry.value = entry.value + '%';
                            }
                            result += entry.key + entry.operator + entry.value;
                        }
                    });
                }
                result = 'query=' + result;
                if (size != null && angular.isDefined(size) && size != '') {
                    result += "&size=" + this.size;
                }
                if (start != null && angular.isDefined(start) && start != '') {
                    result += "&start=" + this.start;
                }
                //le sorting en décroissant s'écrit -fieldName
                if (sort != undefined) {
                    if (this.sort.name != undefined) {
                        result += "&sort="
                        if (this.sort.direction == "desc") {
                            result += "-"
                        }
                        result += this.sort.name;
                    }
                }
                return result;

            };


        }

        return {
            create: function (parameters, start, size, sort) {
                return new Query(parameters, start, size, sort);
            }
        }
    }
    ]
);
'use strict';
/**
 * @ngdoc directive
 * @name itesoft.directive:itNotifier
 * @module itesoft
 * @since 1.0.1
 * @requires ngToast
 * @requires $rootScope
 * @requires $log
 *
 * @description
 * Simple notifier service, that display toasters.
 *
 * You can personalise itNotifier behavior using attribute and modifying original object setting's toaster:
 *
 * <table class="table">
 * <tr>
 *     <th>Property</th>
 *     <th>Default value</th>
 *     <th>Description</th>
 * </tr>
 * <tr>
 *     <td><code>additionalClasses</code></td>
 *     <td>''</td>
 *     <td>Allows to add some classes to the current ngToast</td>
 * </tr>
 * <tr>
 *     <td><code>animation</code></td>
 *     <td>'fade'</td>
 *     <td>Adds an openning/ending animation, for example 'fade'</td>
 * </tr>
 * <tr>
 *     <td><code>className</code></td>
 *     <td>"success"</td>
 *     <td>The className of the toast message</td>
 * </tr>
 * <tr>
 *     <td><code>content</code></td>
 *     <td>''</td>
 *     <td>Content of the toast message as String (HTML compliant)</td>
 * </tr>
 * <tr>
 *     <td><code>combineDuplications</code></td>
 *     <td>false</td>
 *     <td>Combine toaster in a unique one. A counter precede the toaster content</td>
 * </tr>
 * <tr>
 *     <td><code>compileContent</code></td>
 *     <td>false</td>
 *     <td>Re-compiles the toast message content within parent (or given) scope. Needs to be used with trusted HTML content. See here for more information. (boolean|object)</td>
 * </tr>
 * <tr>
 *     <td><code>dismissOnTimeout</code></td>
 *     <td>true</td>
 *     <td>Automatically remove toast message after specific time</td>
 * </tr>
 * <tr>
 *     <td><code>dismissButton:</code></td>
 *     <td>true</td>
 *     <td>Adds close button on toast message</td>
 * </tr>
 * <tr>
 *     <td><code>dismissButtonHtml</code></td>
 *     <td>"&#38;times;"</td>
 *     <td>Html of close button</td>
 * </tr>
 * <tr>
 *     <td><code>dismissOnClick</code></td>
 *     <td>false</td>
 *     <td>Allows to remove toast message with a click</td>
 * </tr>
 * <tr>
 *     <td><code>horizontalPosition</code></td>
 *     <td>"right"</td>
 *     <td>Horizontal position of the toast message. Possible values : "right", "left" or "center"</td>
 * </tr>
 * <tr>
 *     <td><code>maxNumber</code></td>
 *     <td>0</td>
 *     <td>Maximum number of toast message to display. (0 means unlimined)</td>
 * </tr>
 * <tr>
 *     <td><code>timeout</code></td>
 *     <td>4000</td>
 *     <td>Timer for remove toast message</td>
 * </tr>
 * <tr>
 *     <td><code>verticalPosition</code></td>
 *     <td>"bottom"</td>
 *     <td>Vertical position of the toast message. possible values "top" or "bottom"</td>
 * </tr>
 * </table>
 * It's possible to defines specific behavior for each type of error. When overloading ngToast configuration, add an attribute to ngToast.configure() parameter.
 *
 * Overload of defaults options value for each type of toasts are :
 * <ul>
 * <li>success:{dismissOnClick: true}</li>
 * <li>info:{dismissOnClick: true}</li>
 * <li>error:{dismissOnTimeout: false}</li>
 * <li>warning:{dismissOnTimeout: false}</li>
 * </ul>
 * For example, in the "Controller.js", the notifyError method override orginial settings and add some content and disable the dismiss on timeout.
 * The toasts success behavior is also overloaded for dissmiss the toast on click. (see .config(['ngToastProvider' for details)
 *
 *
 * <br/><br/>If Error log is enabled, you can pass errorDetail object to the methods. Here is the details of this object
 *
 * <table class="table">
 * <tr>
 *     <th>Property</th>
 *     <th>Possible value</th>
 *     <th>Description</th>
 * </tr>
 * <tr>
 *     <td>CODE</td>
 *     <td>EMPTY_REQUEST(1000), INCOMPLETE_OBJECT(1001), MALFORMED_OBJECT(1002), INTERNAL_ERROR(2000), BAD_REQUEST(400), INTERNAL_SERVER_ERROR(500), OK(200)</td>
 *     <td>The code bounds to the status of the action</td>
 * </tr>
 * <tr>
 *     <td>TYPE</td>
 *     <td>ERROR("error"), INFO("information"), WARN("warning"), DETAIL("detail"), SUCCESS("S");</td>
 *     <td>The type message received</td>
 * </tr>
 * <tr>
 *     <td>MESSAGE</td>
 *     <td></td>
 *     <td>The message received from the server</td>
 * </tr>
 * <tr>
 *     <td>DETAIL</td>
 *     <td></td>
 *     <td>The detail of the message received from the server</td>
 * </tr>
 * <tr>
 *     <td>DONE</td>
 *     <td>TRUE("1"), FALSE("0");</td>
 *     <td>A boolean that decribes the final result of the request</td>
 * </tr>
 * </table>
 * <br/>
 *
 * There is two ways to use it, by injecting the service in each controller or by using events. See Controller.js for details
 *
 * Possible itNotifier type : "SUCCESS", "ERROR", "INFO", "WARNING" and "DISMISS"<br/>
 * @example
     <example module="itesoft">

         <file name="Controller.js">

            angular.module('itesoft')
                .config(['itNotifierProvider', function (itNotifierProvider) {
                    //configuration of default values
                    itNotifierProvider.defaultOptions = {
                        dismissOnTimeout: true,
                        timeout: 4000,
                        dismissButton: true,
                        animation: 'fade',
                        horizontalPosition: 'right',
                        verticalPosition: 'bottom',
                        compileContent: true,
                        dismissOnClick: false,
                        success:{dismissOnClick: true},//optional overload behavior toast success
                        info:{dismissOnClick: true},//optional overload behavior toast info
                        error:{dismissOnTimeout: false},//optional overload behavior toast error
                        warning:{dismissOnTimeout: false}//optional overload behavior toast warning
                    };

                }]).controller('NotifierCtrl',['$scope','itNotifier', function($scope,itNotifier) {
                    $scope.showSuccess = function(){
                        itNotifier.notifySuccess({
                        content: "Success popup"
                        });
                    };
                    $scope.showSuccessEvent = function(){
                        $scope.$emit('itNotifierEvent', {
                            type: "SUCCESS",
                            options: {
                                content : "Success event popup"
                            }}
                         );
                    };
                    $scope.showError = function(){
                        itNotifier.notifyError({
                            content: "Error popup",
                            dismissOnTimeout: false
                        },
                        {
                            CODE:500,
                            TYPE:'error',
                            MESSAGE:'Something bad happened',
                            DETAIL:'You don\'t wanna know',
                            DONE:1
                        });
                    };
                    $scope.showErrorOnEvent = function(){
                        $scope.$emit('itNotifierEvent', {
                        type: "ERROR",
                        options: {
                                content : "error event popup"
                            },
                        errorDetails :
                            {
                                CODE:500,
                                TYPE:'error',
                                MESSAGE:'Something bad happened',
                                DETAIL:'You don\'t wanna know',
                                DONE:1
                            }
                        });
                    }
                    $scope.showInfo = function(){
                        itNotifier.notifyInfo({
                        content: "Information popup"
                        });
                    };
                    $scope.showWarningOnEvent = function(){
                        $scope.$emit('itNotifierEvent', {
                        type: "WARNING",
                        options: {
                                content : "Warning event popup"
                            },
                        errorDetails :
                            {
                                CODE:1000,
                                TYPE:'warning',
                                MESSAGE:'The request is empty',
                                DETAIL:'Nothing',
                                DONE:1
                            }
                        });
                    };
                    $scope.dismiss = function(){
                        itNotifier.notifyDismiss();
                        $scope.$emit('itNotifierEvent',{
                            type:"DISMISS"
                        });
                    };
                    $scope.dismissOnEvent = function(){
                        $scope.$emit("$locationChangeSuccess");

                    };
                }]);
         </file>
         <file name="index.html">
             <!-- CSS adaptation of ngToast for example purposes. Do not do this in production-->
             <toast class="toaster" style="left:0px !important; bottom:0px !important"></toast>
             <div ng-controller="NotifierCtrl">
                 <button class="btn btn-success" ng-click="showSuccess()">
                    Success
                 </button>
                 <button class="btn btn-success" ng-click="showSuccessEvent()">
                    Success on event
                 </button>
                 <button class="btn btn-danger" ng-click="showError()">
                    Error
                 </button>
                 <button class="btn btn-danger" ng-click="showErrorOnEvent()">
                    Error on event
                 </button>
                 <button class="btn btn-info" ng-click="showInfo()">
                    Info
                 </button>
                 <button class="btn btn-warning" ng-click="showWarningOnEvent()">
                    Warning
                 </button>
                 <button class="btn btn-success" ng-click="dismiss()">
                    Dismiss all popups
                 </button>
                 <button class="btn btn-success" ng-click="dismissOnEvent()">
                    Dismiss on Change location event
                 </button>
             </div>
         </file>
     </example>
 **/
IteSoft.provider('itNotifier', [ function () {

    var self = this;

    //default behaviors
    self.defaultOptions = {
        dismissOnTimeout: true,
        timeout: 4000,
        dismissButton: true,
        animation: 'fade',
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        compileContent: true,
        dismissOnClick: false,
        success:{dismissOnClick: true},//optional overload behavior toast success
        info:{dismissOnClick: true},//optional overload behavior toast info
        error:{dismissOnTimeout: false},//optional overload behavior toast error
        warning:{dismissOnTimeout: false}//optional overload behavior toast warning
    };

    //provide get method to build provider
    this.$get= ['ngToast', '$rootScope','$log', function(ngToast, $rootScope, $log){

        // service declaration
        var itNotifier = {};

        //configuration of the ngToast
        ngToast.settings = angular.extend(ngToast.settings,self.defaultOptions);

        /**
         * Private method that format error details message
         * @param errorDetails
         * @returns {string}
         * @private
         */
        function _formatErrorDetails(errorDetails){
            return " CODE : "+errorDetails.CODE +", TYPE : "+ errorDetails.TYPE +", MESSAGE : "+ errorDetails.MESSAGE +", DETAIL : "+ errorDetails.DETAIL +", DONE : "+ errorDetails.DONE;
        }

        /** method declaration**/
        /**
         * Display a toast configure as success element
         * @param options
         * @param errorDetails
         */
        itNotifier.notifySuccess= function (options,errorDetails) {
            var localOptions = angular.extend(ngToast.settings, self.defaultOptions,self.defaultOptions.success,options,options.success);
            ngToast.success(localOptions);
            if(errorDetails != undefined) {
                $log.log("Success popup called : "+_formatErrorDetails(errorDetails));
            }
        };
        /**
         * Display a toast configure as error element
         * @param options
         * @param errorDetails
         */
        itNotifier.notifyError= function (options,errorDetails) {
            var localOptions = angular.extend(ngToast.settings, self.defaultOptions,self.defaultOptions.error,options, options.error);

            ngToast.danger(localOptions);
            if(errorDetails != undefined) {
                $log.error("Error popup called : "+_formatErrorDetails(errorDetails));
            }
        };
        /**
         * Display a toast configure as info element
         * @param options
         * @param errorDetails
         */
        itNotifier.notifyInfo= function (options,errorDetails) {
            var localOptions = angular.extend(ngToast.settings, self.defaultOptions,self.defaultOptions.info,options, options.info);

            ngToast.info(localOptions);
            if(errorDetails != undefined) {
                $log.info("Info popup called : "+_formatErrorDetails(errorDetails));
            }
        };
        /**
         * Display a toast configure as warning element
         * @param options
         * @param errorDetails
         */
        itNotifier.notifyWarning= function (options,errorDetails) {
            var localOptions = angular.extend(ngToast.settings, self.defaultOptions,self.defaultOptions.warning,options, options.warning);

            ngToast.warning(localOptions);
            if(errorDetails != undefined) {
                $log.warn("Warning popup called : "+_formatErrorDetails(errorDetails));
            }
        };
        /**
         * Dismiss all toaster
         * @param options
         * @param errorDetails
         */
        itNotifier.notifyDismiss= function (options,errorDetails) {
            ngToast.dismiss();
        };
        /**
         * Log an error because this type is unknown
         * @param options
         */
        itNotifier.notify= function (options) {
            $log.error('Unknown type for itNotifier: '+options )
        }

        /** events declaration **/

        /**
         * Listen an event and dismiss all toaster
         */
        $rootScope.$on("$locationChangeSuccess", function () {
            // Remove all currently display toaster messages.
            itNotifier.notifyDismiss();
        });

        /**
         * Listen an event and display associated toast depending on his type
         */
        $rootScope.$on("itNotifierEvent",function(event, args){
            //Handle event and calls appropriate method depending on the type of request
            if (args) {
                switch (args.type) {
                    case "SUCCESS":
                        itNotifier.notifySuccess(args.options,args.errorDetails);
                        break;
                    case "ERROR":
                        itNotifier.notifyError(args.options,args.errorDetails);
                        break;
                    case "INFO":
                        itNotifier.notifyInfo(args.options,args.errorDetails);
                        break;
                    case "WARNING":
                        itNotifier.notifyWarning(args.options,args.errorDetails);
                        break;
                    case "DISMISS":
                        itNotifier.notifyDismiss(args.options,args.errorDetails);
                        break;
                    default:
                        itNotifier.notify(args.type);
                        break;
                }
            }
            else{
                $log.error('Bad usage of itNotifier. Check manual for details');
            }
        });
        return itNotifier;
    }];
}]);
'use strict';
/**
 * @ngdoc service
 * @name itesoft.service:itPopup
 * @module itesoft
 * @requires $uibModal
 * @requires $uibModalStack
 * @requires $rootScope
 * @requires $q
 *
 * @description
 * The Itesoft Popup service allows programmatically creating and showing popup windows that require the user to respond in order to continue.
 * The popup system has support for more flexible versions of the built in alert(),
 * prompt(), and confirm() functions that users are used to,
 * in addition to allowing popups with completely custom content and look.
 *
 * @example
    <example module="itesoft">

        <file name="Controller.js">
             angular.module('itesoft')
             .controller('PopupCtrl',['$scope','itPopup', function($scope,itPopup) {

                  $scope.showAlert = function(){
                      var alertPopup = itPopup.alert({
                          title: "{{'POPUP_TITLE' | translate}}",
                          text: "{{'POPUP_CONTENT' | translate}}"
                      });
                      alertPopup.then(function() {
                         alert('alert callback');
                      });
                  };

                  $scope.showConfirm = function(){
                      var confirmPopup = itPopup.confirm({
                          title: "{{'POPUP_TITLE' | translate}}",
                          text: "{{'POPUP_CONTENT' | translate}}",
                          buttons: [

                              {
                                  text: 'Cancel',
                                  type: '',
                                  onTap: function () {
                                      return false;
                                  }
                              },
                              {
                                  text: 'ok',
                                  type: '',
                                  onTap: function () {
                                      return true;
                                  }
                              }
                             ]
                      });
                      confirmPopup.then(function(res) {

                          alert('confirm validate');
                      },function(){
                          alert('confirm canceled');
                      });
                  };

              $scope.data = {};
              $scope.data.user =  '';

              $scope.showCustomConfirm = function(){
              var customPopup = itPopup.custom({
                  title: 'My Custom title',
                  scope: $scope,
                  backdrop:false,
                  text: '<h3 id="example_my-custom-html-content">My custom html content</h3> <p>{{data.user}} </p>  <input it-input class="form-control floating-label" type="text" it-label="Email Required!!" ng-model="data.user">',
                  buttons: [{
                          text: 'My Custom Action Button',
                          type: 'btn-danger',
                          onTap: function (event,scope) {
                               console.log(scope.data );
                               if(typeof scope.data.user === 'undefined' ||scope.data.user ==='' ){
                                    event.preventDefault();
                               }
                              return true;
                          }
                      }
                  ]
              });
              customPopup.then(function(res) {
                 console.log(res);
                  alert('confirm validate');
              },function(){
                  alert('confirm canceled');
              });
              };

              $scope.showPrompt = function(){
                  var promptPopup = itPopup.prompt({
                      title: "{{'POPUP_TITLE' | translate}}",
                      text: "{{'POPUP_CONTENT' | translate}}",
                      inputLabel : "{{'POPUP_LABEL' | translate}}",
                      inputType: 'password'
                  });
                  promptPopup.then(function(data) {
                      alert('prompt validate with value ' + data.response);
                  },function(){
                      alert('prompt canceled');
                  });
              };

              }]);

         </file>
         <file name="index.html">
             <div ng-controller="PopupCtrl">
                 <button class="btn btn-info" ng-click="showAlert()">
                 Alert
                 </button>
                 <button class="btn btn-danger" ng-click="showConfirm()">
                 Confirm
                 </button>
                 <button class="btn btn-warning" ng-click="showPrompt()">
                 Prompt
                 </button>

                 <button class="btn btn-warning" ng-click="showCustomConfirm()">
                 My Custom popup
                 </button>
             </div>
         </file>
     </example>
 */

IteSoft
    .factory('itPopup',['$uibModal','$uibModalStack','$rootScope','$q','$compile',function($modal,$modalStack,$rootScope,$q,$compile){

        var MODAL_TPLS = '<div class="modal-header it-view-header">' +
                             '<h3 it-compile="options.title"></h3>'+
                         '</div>'+
                         '<div class="modal-body">'+
                            '<p it-compile="options.text"></p>'+
                         '</div>'+
                         '<div class="modal-footer">'+
                              '<button ng-repeat="button in options.buttons" class="btn btn-raised {{button.type}}" ng-click="itButtonAction($event,button)" it-compile="button.text"></button>'+
                         '</div>';

        var MODAL_TPLS_PROMT = '<div class="modal-header it-view-header">' +
            '<h3 it-compile="options.title"></h3>'+
            '</div>'+
            '</div>'+
            '<div class="modal-body">'+
            '<p it-compile="options.text"></p>'+
            '   <div class="form-group">'+
            '<div class="form-control-wrapper"><input type="{{options.inputType}}" class="form-control" ng-model="data.response"  placeholder="{{options.inputPlaceholder}}"></div>'+
            '</div>'+
            '</div>'+
            '<div class="modal-footer">'+
            '<button ng-repeat="button in options.buttons" class="btn btn-raised {{button.type}}" ng-click="itButtonAction($event,button)" it-compile="button.text"></button>'+
            '</div>';

        var itPopup = {
            alert : _showAlert,
            confirm :_showConfirm,
            prompt : _showPromt,
            custom : _showCustom
        };

        function _createPopup(options){
            var self = {};
            self.scope = (options.scope || $rootScope).$new();

            self.responseDeferred = $q.defer();
            self.scope.$buttonTapped= function(event, button ) {
                var result = (button.onTap || noop)(event);
                self.responseDeferred.resolve(result);
            };

            function _noop(){
                return false;
            }

            options = angular.extend({
                scope: self.scope,
                template : MODAL_TPLS,

                controller :['$scope' ,'$modalInstance',function($scope, $modalInstance) {
                   // $scope.data = {};
                    $scope.itButtonAction= function(event, button ) {
                        var todo = (button.onTap || _noop)(event,$scope);

                        var result = todo;
                        if (!event.isDefaultPrevented()) {
                            self.responseDeferred.resolve(result ? close() : cancel());
                        }
                    };

                    function close(){
                        $modalInstance.close($scope.data);
                    }
                    function cancel() {
                        $modalInstance.dismiss('cancel');
                    }
                }],
                buttons: []
            }, options || {});

            options.scope.options = options;


            self.options = options;

            return self;

        }

        function _showPopup(options){
            $modalStack.dismissAll();
            var popup = _createPopup(options);

            return  $modal.open(popup.options).result;
        }

        function _showAlert(opts){
            $modalStack.dismissAll();

            return _showPopup(angular.extend({

                buttons: [{
                    text: opts.okText || 'OK',
                    type: opts.okType || 'btn-info',
                    onTap: function() {
                        return true;
                    }
                }]
            }, opts || {}));
        }

        function _showConfirm(opts){
            $modalStack.dismissAll();

            return _showPopup(angular.extend({
                buttons: [
                    {
                        text: opts.okText || 'OK',
                        type: opts.okType || 'btn-info',
                        onTap: function() { return true; }
                    },{
                        text: opts.cancelText || 'Cancel',
                        type: opts.cancelType || '',
                        onTap: function() { return false; }
                    }]
            }, opts || {}));
        }


        function _showCustom(opts){
            $modalStack.dismissAll();
         return   _showPopup(opts);
        }

        function _showPromt(opts){
            $modalStack.dismissAll();

            var scope = $rootScope.$new(true);
            scope.data = {};
            var text = '';
            if (opts.template && /<[a-z][\s\S]*>/i.test(opts.template) === false) {
                text = '<span>' + opts.template + '</span>';
                delete opts.template;
            }

            return _showPopup(angular.extend({
                template : MODAL_TPLS_PROMT,
                inputLabel : opts.inputLabel || '',
                buttons: [
                    {
                        text: opts.okText || 'OK',
                        type: opts.okType || 'btn-info',
                        onTap: function() {
                            return true;
                        }
                    },
                    {
                        text: opts.cancelText || 'Cancel',
                        type: opts.cancelType || '',
                        onTap: function() {}
                    } ]
            }, opts || {}));
        }
        return itPopup;
    }]);