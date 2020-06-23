(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["layouts-layout-module"],{

/***/ "./src/app/layouts/layout-routing.module.ts":
/*!**************************************************!*\
  !*** ./src/app/layouts/layout-routing.module.ts ***!
  \**************************************************/
/*! exports provided: LayoutRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutRoutingModule", function() { return LayoutRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");




const routes = [
    { path: 'about', loadChildren: () => __webpack_require__.e(/*! import() | about-about-module */ "about-about-module").then(__webpack_require__.bind(null, /*! ./about/about.module */ "./src/app/layouts/about/about.module.ts")).then(m => m.AboutModule) },
    { path: 'education', loadChildren: () => __webpack_require__.e(/*! import() | education-education-module */ "education-education-module").then(__webpack_require__.bind(null, /*! ./education/education.module */ "./src/app/layouts/education/education.module.ts")).then(m => m.EducationModule) },
    { path: 'award', loadChildren: () => __webpack_require__.e(/*! import() | award-award-module */ "award-award-module").then(__webpack_require__.bind(null, /*! ./award/award.module */ "./src/app/layouts/award/award.module.ts")).then(m => m.AwardModule) },
    { path: 'experience', loadChildren: () => __webpack_require__.e(/*! import() | experience-experience-module */ "experience-experience-module").then(__webpack_require__.bind(null, /*! ./experience/experience.module */ "./src/app/layouts/experience/experience.module.ts")).then(m => m.ExperienceModule) },
    { path: 'interest', loadChildren: () => __webpack_require__.e(/*! import() | interest-interest-module */ "interest-interest-module").then(__webpack_require__.bind(null, /*! ./interest/interest.module */ "./src/app/layouts/interest/interest.module.ts")).then(m => m.InterestModule) },
    { path: 'skill', loadChildren: () => __webpack_require__.e(/*! import() | skill-skill-module */ "skill-skill-module").then(__webpack_require__.bind(null, /*! ./skill/skill.module */ "./src/app/layouts/skill/skill.module.ts")).then(m => m.SkillModule) },
];
class LayoutRoutingModule {
}
LayoutRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: LayoutRoutingModule });
LayoutRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function LayoutRoutingModule_Factory(t) { return new (t || LayoutRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](LayoutRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LayoutRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/layouts/layout.module.ts":
/*!******************************************!*\
  !*** ./src/app/layouts/layout.module.ts ***!
  \******************************************/
/*! exports provided: LayoutModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutModule", function() { return LayoutModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _layout_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout-routing.module */ "./src/app/layouts/layout-routing.module.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");




class LayoutModule {
}
LayoutModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: LayoutModule });
LayoutModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function LayoutModule_Factory(t) { return new (t || LayoutModule)(); }, providers: [], imports: [[
            _layout_routing_module__WEBPACK_IMPORTED_MODULE_1__["LayoutRoutingModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](LayoutModule, { imports: [_layout_routing_module__WEBPACK_IMPORTED_MODULE_1__["LayoutRoutingModule"],
        _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LayoutModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _layout_routing_module__WEBPACK_IMPORTED_MODULE_1__["LayoutRoutingModule"],
                    _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
                ],
                declarations: [],
                providers: [],
                exports: []
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=layouts-layout-module-es2015.js.map