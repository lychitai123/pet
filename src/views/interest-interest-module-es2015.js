(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["interest-interest-module"],{

/***/ "./src/app/layouts/interest/interest.component.ts":
/*!********************************************************!*\
  !*** ./src/app/layouts/interest/interest.component.ts ***!
  \********************************************************/
/*! exports provided: InterestComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InterestComponent", function() { return InterestComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class InterestComponent {
    constructor() { }
    ngOnInit() {
    }
}
InterestComponent.ɵfac = function InterestComponent_Factory(t) { return new (t || InterestComponent)(); };
InterestComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: InterestComponent, selectors: [["app-interest"]], decls: 9, vars: 0, consts: [["id", "interests", 1, "resume-section"], [1, "resume-section-content"], [1, "mb-5"], [1, "mb-0"], [1, "m-0"]], template: function InterestComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Interests");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Apart from being a web developer, I enjoy most of my time being outdoors. In the winter, I am an avid skier and novice ice climber. During the warmer months here in Colorado, I enjoy mountain biking, free climbing, and kayaking.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "When forced indoors, I follow a number of sci-fi and fantasy genre movies and television shows, I am an aspiring chef, and I spend a large amount of my free time exploring the latest technology advancements in the front-end web development world.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "hr", 4);
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xheW91dHMvaW50ZXJlc3QvaW50ZXJlc3QuY29tcG9uZW50LnNjc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](InterestComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-interest',
                templateUrl: './interest.component.html',
                styleUrls: ['./interest.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/layouts/interest/interest.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/layouts/interest/interest.module.ts ***!
  \*****************************************************/
/*! exports provided: InterestModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InterestModule", function() { return InterestModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _shared_share_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/share.module */ "./src/app/shared/share.module.ts");
/* harmony import */ var _interest_routing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interest.routing */ "./src/app/layouts/interest/interest.routing.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");


// Routing



class InterestModule {
}
InterestModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: InterestModule });
InterestModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function InterestModule_Factory(t) { return new (t || InterestModule)(); }, imports: [[_shared_share_module__WEBPACK_IMPORTED_MODULE_1__["ShareModule"], _interest_routing__WEBPACK_IMPORTED_MODULE_2__["InterestRouting"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](InterestModule, { imports: [_shared_share_module__WEBPACK_IMPORTED_MODULE_1__["ShareModule"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](InterestModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_shared_share_module__WEBPACK_IMPORTED_MODULE_1__["ShareModule"], _interest_routing__WEBPACK_IMPORTED_MODULE_2__["InterestRouting"]],
                declarations: []
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/layouts/interest/interest.routing.ts":
/*!******************************************************!*\
  !*** ./src/app/layouts/interest/interest.routing.ts ***!
  \******************************************************/
/*! exports provided: InterestRouting */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InterestRouting", function() { return InterestRouting; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _interest_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interest.component */ "./src/app/layouts/interest/interest.component.ts");


const routes = [
    { path: '', component: _interest_component__WEBPACK_IMPORTED_MODULE_1__["InterestComponent"] }
];
const InterestRouting = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes);


/***/ })

}]);
//# sourceMappingURL=interest-interest-module-es2015.js.map