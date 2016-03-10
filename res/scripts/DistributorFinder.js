(function (w) {
    var Class = function (parent) {
        var _class = function () {
            this.init.apply(this, arguments);
        };

        if (parent) {
            var subClass = function () {
            };
            subClass.prototype = parent.prototype;
            _class.prototype = new subClass();
        }
        _class.prototype.init = function () {
        };

        _class.fn = _class.prototype;
        _class.fn.parent = _class;
        _class._super = _class.__proto__;

        _class.proxy = function (func) {
            var self = this;
            var _arguments = [];

            for (var i = 1; i < arguments.length; i++) {
                _arguments.push(arguments[i]);
            }

            return (function () {
                if (_arguments.length <= 0) {
                    _arguments = arguments;
                }
                return func.apply(self, _arguments);
            });
        };

        _class.fn.proxy = _class.proxy;

        _class.extend = function (obj) {
            var extended = obj.extended;
            for (var i in obj) {
                _class[i] = obj[i];
            }

            if (extended) {
                extended(_class);
            }
        };

        _class.include = function (obj) {
            var included = obj.included;
            for (var i in obj) {
                _class.fn[i] = obj[i];
            }

            if (included) {
                included(_class);
            }
        };

        return _class;
    };

    w.Class = Class;
}(window));

var DistributorFinder = {};

DistributorFinder.Constant = {
//    AjaxPage: "Ajax/DistributorFinderAjax.aspx",
    CountryJsonPath: "res/json/Us.json",
    CountiesJsonPath: "res/json/AllCounties.json",
};

DistributorFinder.SearchText = {
    SelectBeverage: "Beverage Types",
    SelectASupplier: "Supplier",
    SelectABrand: "Brand",
    SelectAState: "State",
    SelectADistributor: "Distributor"
};

DistributorFinder.Action = {
    Search: "Search",
    Profile: "Profile",
    Brand: "Brand",
    SearchResult: "SearchResult",
    CheckHasPassword: "CheckHasPassword",
    SetProfilePassword: "SetProfilePassword",
    JudgeProfilePassword: "JudgeProfilePassword",
    UpdateProfile: "UpdateProfile",
    Save: "Save",
    ClearProfilePassword: "ClearProfilePassword",
    Register: "Register"
};

DistributorFinder.Global = {
    distributorFilter: null,
    projection: null,
    ajaxPostData: "&Supplier=&Brand=&State=&Customer=&beverageTypes="
};

DistributorFinder.DataProvider = {
    getDataBySearch: function (supplierText, brandText, stateText, customerText, beverageTypes) {
        var tmpIsEmptyOrNull = DistributorFinder.Helper.isEmptyOrNull;
        var postData = "";
        postData += "&Supplier=" + encodeURIComponent(supplierText);
        postData += "&Brand=" + encodeURIComponent(brandText);
        postData += "&State=" + stateText;
        postData += "&Customer=" + encodeURIComponent(customerText);
        postData += "&beverageTypes=" + beverageTypes;
        DistributorFinder.Global.ajaxPostData = postData;
        return $.getJSON(DistributorFinder.Constant.AjaxPage + '?Action=' + DistributorFinder.Action.Search + postData).fail(function () {
            console.log("getDataBySearch fail");
        });
    },

    getGeoStateJson: function () {
        return $.getJSON(DistributorFinder.Constant.CountryJsonPath);
    },

    getGeoCountiesJson: function () {
        return $.getJSON(DistributorFinder.Constant.CountiesJsonPath);
    },

    saveData: function (saveData) {
        return $.post(DistributorFinder.Constant.AjaxPage, {
            Action: DistributorFinder.Action.Save,
            SaveData: saveData
        });
    },

    setProfilePassword: function (customerID, profilePassword) {
        return $.post(DistributorFinder.Constant.AjaxPage, {
            Action: DistributorFinder.Action.SetProfilePassword,
            CustomerID: customerID,
            ProfilePassword: profilePassword
        });
    },

    JudgeProfilePassword: function (customerID, profilePassword) {
        return $.post(DistributorFinder.Constant.AjaxPage, {
            Action: DistributorFinder.Action.JudgeProfilePassword,
            CustomerID: customerID,
            ProfilePassword: profilePassword
        });
    },

    clearProfilePassword: function (customerID) {
        return $.post(DistributorFinder.Constant.AjaxPage, {
            Action: DistributorFinder.Action.ClearProfilePassword,
            CustomerID: customerID
        });
    },
};

DistributorFinder.CustomEvent = {};

DistributorFinder.Helper = {
//    rgb2hex: function (rgb) {
//        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
//        function hex(x) {
//            return ("0" + parseInt(x).toString(16)).slice(-2);
//        }
//
//        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
//    },
//
//    createAutoCompleteInput: function (searchText, source, ajaxUrl, parentAutoComplete, linkageKey) {
//        var ajaxSource = _.isUndefined(ajaxUrl) ? DistributorFinder.Constant.AjaxPage + '?Action=' + "Autocomplete&Type=" + source : ajaxUrl + source;
//
//        if (!_.isUndefined(parentAutoComplete)) {
//            parentAutoComplete.on("autocompleteselect", function (event, ui) {
//                ajaxSource = ajaxUrl + source + "&" + linkageKey + "=" + parentAutoComplete.data('value');
//            });
//        }
//
//        var input = $('<input>');
//        input.attr("value", searchText)
//            .attr("class", "form-control")
//            .attr("type", "text")
//            .on('focus', function () {
//                this.value = "";
//            })
//            .on('blur', function () {
//                this.value = _.isEmpty(this.value) ? searchText : this.value;
//                if (!_.isUndefined(parentAutoComplete)) {
//                    ajaxSource = _.isUndefined(ajaxUrl) ? DistributorFinder.Constant.AjaxPage + '?Action=' + "Autocomplete&Type=" + source : ajaxUrl + source;
//                }
//            });
//
//        var tmpKeyValue = {};
//
//        input.autocomplete({
//            max: 3,
//            minLength: 1,
//            autoFocus: true,
//            select: function (e, ui) {
//                input.data('value', tmpKeyValue[ui.item.label]);
//            },
//            source: function (request, response) {
//                $.getJSON(ajaxSource + "&term=" + request.term).done(function (result) {
//                    tmpKeyValue = {};
//                    response($.map(result, function (item) {
//                        tmpKeyValue[item.label] = item.value;
//                        return {
//                            label: item.label,
//                            value: item.label
//                        };
//                    }));
//                });
//            }
//        });
//
//        return input;
//    },
//
//    createAutoCompleteInputRe: function (searchText, source, ajaxUrl) {
//        var ajaxSource = _.isUndefined(ajaxUrl) ? DistributorFinder.Constant.AjaxPage + '?Action=' + "Autocomplete&Type=" + source : ajaxUrl + source;
//        var input = $('<input>');
//        input.attr("placeholder", searchText)
//             .attr("class", "form-control")
//             .attr("type", "text")
//             .on('focus', function () {
//                 this.value = "";
//             });
//
//        input.autocomplete({
//            max: 3,
//            minLength: 1,
//            autoFocus: true,
//            source: function (request, response) {
//                $.getJSON(ajaxSource + "&term=" + encodeURIComponent(request.term)).done(function (result) {
//                    response($.map(result, function (item) {
//                        return  item.label;
//                    }));
//                });
//            }
//        });
//
//        return input;
//    },
//
//    isEmptyOrNull: function (arg) {
//        return _.isEmpty(arg) && !_.isNumber(arg);
//    },
//
//    replaceNumber: function (str) {
//        var regex = /[`0-9]/ig
//        return str.replace(regex, "");
//    },
//
//    replaceSpace: function (str) {
//        return str.replace(/(^\s*)|(\s*$)/g, "");
//    },

    countiesDeferred: (function () {
        var result = null;
        var tmpDeferred = function () {
            var dtd = $.Deferred();
            if (DistributorFinder.Helper.isEmptyOrNull(result)) {
                DistributorFinder.DataProvider.getGeoCountiesJson().done(function (r) {
                    result = r;
                    dtd.resolve(result);
                }).fail(function () {
                        console.log("county data error");
                    }
                );
            } else {
                dtd.resolve(result);
            }

            return dtd;
        };
        return tmpDeferred;
    })(),

    stateDeferred: (function () {
        var result = null;
        var tmpDeferred = function () {
            var dtd = $.Deferred();
            if (DistributorFinder.Helper.isEmptyOrNull(result)) {
                DistributorFinder.DataProvider.getGeoStateJson().done(function (r) {
                    result = r;
                    dtd.resolve(result);
                }).fail(function () {
                    console.log("state data error");
                })
            } else {
                dtd.resolve(result);
            }
            return dtd;
        };
        return tmpDeferred;
    })(),

    trimRightLeftSpace: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    isEmail: function (str) {
        var emailString = DistributorFinder.Helper.trimRightLeftSpace(str);
        var emailStringLower = emailString.toLowerCase();
        var reg = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+(?:[A-Za-z]*$)\b/;
        return reg.test(emailStringLower);
    },


    judgeContainPage: function (lowerCaseUrl) {
        var result = false;
        try {
            result = document.location.href.toLowerCase().indexOf(lowerCaseUrl) > -1;
        }
        catch (e) {
            result = false;
        }
        return result;
    },

    hrefRequest: function (strParame, requestStr) {
        var args = new Object();
        var query = requestStr || location.search.substring(1);

        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var argname = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[argname] = value;
        }
        return args[strParame];
    },

    getCityName: function (LatB, MLonB) {
        //var q = $.Deferred();
        //var tmpArr = [];
        //d3.csv("includes/json/zipcode.csv", function (d) {
        //    return {
        //        zip: d["zip"], city: d["city"], latitude: d["latitude"], longitude: d["longitude"]
        //    };
        //}, function (error, rows) {
        //    _.each(rows, function (r) {
        //        var LatA = parseFloat(r.latitude);
        //        var MLonA = parseFloat(r.longitude);
        //        var c = Math.sin(LatA * Math.PI / 180) * Math.sin(LatB * Math.PI / 180) + Math.cos(LatA * Math.PI / 180) * Math.cos(LatB * Math.PI / 180) * Math.cos((MLonA - MLonB) * Math.PI / 180);
        //        var dis = 0.621371192 * 6371.004 * Math.acos(c);
        //        if (dis < 10) {
        //            tmpArr.push(r);
        //        }
        //    });
        //    q.resolve(tmpArr);
        //});
        //return q;
    }
};
DistributorFinder.Business = (function () {

    var DistributorFinderClass = (function () {
        var distributorFinderClass = new Class();

        distributorFinderClass.include({
            init: function () {
            },
            initData: function () {
                switch (DistributorFinder.Helper.hrefRequest("Action")) {
                    case "ShowMap":
                        $(window).on('orientationchange', function (e) {
                            $(".map-container").children().remove();
                            DistributorFinderMapPageClass.init();
                        });
                        DistributorFinderMapPageClass.init();
                        break;
                    case "Profile":
                        $(window).on('orientationchange', function (e) {
                            // Portrait
                            if (window.orientation == 0 || window.orientation == 180) {
                                $(".profile-map").children().remove();
                                DistributorFinderProfilePageClass.drawProfileMap();
                            } else if (window.orientation == 90 || window.orientation == -90) {
                                $(".profile-map").children().remove();
                                DistributorFinderProfilePageClass.drawProfileMap();
                            }
                        });
                        DistributorFinderProfilePageClass.init();
                        break;
                    case "ShareProfile":
                        var isGeoCounty = false;
                        if (DistributorFinder.Helper.hrefRequest("ShareProfileType") == "GeoCounty") {
                            isGeoCounty = true;
                        }
                        DistributorFinderProfilePageClass.init(true, isGeoCounty);
                        break;
                    case "Brand":
                        break;
                    case "EnterPassword":
                        break;
                    case "UpdateProfile":
                        break;
                    case "Register":
                        break;
                    default:
                        DistributorFinderHomePageClass.init();
                }
            },

            initUI: function () {

            }
        });

        return distributorFinderClass;
    })();
    var DistributorFinderHomePageClass = (function () {
        var distributorFinderHomePageClass = new Class();

        var drawSymbol = function (svgWidth, svgHeight) {
            var symbol = d3.select("body")
                .append("svg")
                .attr("id", "symbolPoint")
                .attr("display", "none")
                .append("defs")
                .append("symbol")
                .attr("viewBox", "0 0 " + svgWidth * 90 + " " + svgHeight * 90)
                .attr("id", "icon-location");
            symbol.append("path").attr("fill", "#F54436")
                .attr("d", "M306,70.4c-135.3,0-244.9,109.7-244.9,244.9S306,723.6,306,723.6s244.9-273,244.9-408.2S441.3,70.4,306,70.4z");
            symbol.append("path").attr("fill", "#FFFFFF")
                .attr("d", "M306,167.1c-77.4,0-140.1,62.8-140.1,140.1S228.6,447.3,306,447.3s140.1-62.8,140.1-140.1S383.4,167.1,306,167.1z");
        };


        distributorFinderHomePageClass.extend({

            init: function () {

                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var svgHeight = 0;
//                if (windowHeight > windowWidth) {
//                    svgHeight = $(window).height() - $("nav").height() - $("footer").height() - 130;
//                } else {
//                    svgHeight = $(window).height() - $("nav").height() - $("footer").height();
//                }


                distributorFinderHomePageClass.drawSvgMap(svgHeight).done(function (projection) {
                    distributorFinderHomePageClass.drawCustomersPointer(projection, DistributorFinder.Global.distributorFilter);
                });


//                $(window).on('orientationchange', function (e) {
//                    var windowWidth = $(window).width();
//                    var windowHeight = $(window).height();
//                    var svgHeight = 0;
//                    if (windowHeight > windowWidth) {
//                        svgHeight = $(window).height() - $("nav").height() - $("footer").height() - 130;
//                    } else {
//                        svgHeight = $(window).height() - $("nav").height() - $("footer").height();
//                    }
//
//                    $("#homeMap").children().remove();
//                    $("#symbolPoint").remove();
//                    var numSlider = $(window).width() / 90 - 1;
//                    slider.reloadSlider({
//                        minSlides: numSlider,
//                        maxSlides: numSlider,
//                        slideWidth: 90,
//                        slideMargin: 20,
//                        controls: false,
//                        ticker: true,
//                        speed: 200000
//                    });
//                    $(".bx-controls").remove();
//                    distributorFinderHomePageClass.drawSvgMap(svgHeight).done(function (projection) {
//                        distributorFinderHomePageClass.drawCustomersPointer(undefined, DistributorFinder.Global.distributorFilter);
//                    });
//                });
            },


            drawSvgMap: function (svgHeight) {
                var dtd = $.Deferred();
                var svgWidth = $(window).width() - $(".nav-panel").width();
                var svgHeight = $(window).height();

                drawSymbol(svgWidth, svgHeight);
                var svg = d3.select("#map-container").append("svg").attr("id", "usMapSvg").style("overflow", "hidden").attr("width", svgWidth).attr("height", svgHeight);
                var projection = d3.geo.albersUsa();
                var path = d3.geo.path().projection(projection);
                DistributorFinder.Helper.stateDeferred().done(function (us) {
                    projection.scale(1).translate([0, 0]);
                    var b = path.bounds(topojson.feature(us, us.objects.usa));
                    s = .95 / Math.max((b[1][0] - b[0][0]) / svgWidth, (b[1][1] - b[0][1]) / svgHeight),
                        t = [(svgWidth - s * (b[1][0] + b[0][0])) / 2, (svgHeight - s * (b[1][1] + b[0][1])) / 2];
                    projection.scale(s).translate(t);
                    d3.select("#usMapSvg").append("g")
                        .attr("id", "usmap")
                        .selectAll("path")
                        .data(topojson.feature(us, us.objects.usa).features)
                        .enter().append("path")
                        .attr("d", path)
                        .attr("class", "features")
                        .attr("fill", "#ccc")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1.5)
                        .on("click", function (d) {
                            var distributorByState = _.filter(DistributorFinder.Global.distributorFilter, function (distributor) {
                                return distributor.State.toUpperCase() == d.id;
                            });
                            if (distributorByState.length === 0) {
                                return;
                            } else {
                                var supplier = encodeURIComponent(DistributorFinder.Helper.hrefRequest("Supplier", DistributorFinder.Global.ajaxPostData));
                                var brand = encodeURIComponent(DistributorFinder.Helper.hrefRequest("Brand", DistributorFinder.Global.ajaxPostData));
                                var state = d.id;
                                var beverageTypes = DistributorFinder.Helper.hrefRequest("beverageTypes", DistributorFinder.Global.ajaxPostData);
                                var customer = encodeURIComponent(DistributorFinder.Helper.hrefRequest("Customer", DistributorFinder.Global.ajaxPostData));
                                location.href = "DistributorFinder.aspx" + "?Action=ShowMap" + "&Supplier=" + supplier + "&Brand=" + brand + "&State=" + d.id + "&Customer=" + customer + "&beverageTypes=" + beverageTypes;

                            }

                        });
                    DistributorFinder.Global.projection = projection;
                    dtd.resolve(projection);
                });
                return dtd;
            },

            drawCustomersPointer: function (projection, filterCustomers) {
                if (_.isUndefined(projection)) {
                    projection = DistributorFinder.Global.projection;
                }
                $("#customerSvg").remove();
                d3.select("#usMapSvg").append("g")
                    .attr("id", "customerSvg")
                    .selectAll("use")
                    .data(_.filter(filterCustomers, function (customer) {
                        return customer.Longitude != "" && customer.Latitude != "" && customer.Longitude < 0 && !_.isEmpty(projection([customer.Longitude, customer.Latitude]));
                    }))
                    .enter().append("use")
                    .attr("xlink:href", "#icon-location")
                    .attr("transform", function (d) {
                        return "translate(" + (projection([d.Longitude, d.Latitude])[0] - 5) + "," + (projection([d.Longitude, d.Latitude])[1] - 10) + ")";
                    });
            }
        });
        return distributorFinderHomePageClass;
    })();
    var classResult = {};

    classResult.DistributorFinderClass = DistributorFinderClass;

    if (DistributorFinder.Helper.judgeContainPage("distributorfinderqunit")) {
        classResult.DistributorFinderHeaderClass = DistributorFinderHeaderClass;
    }

    return classResult;
})();

$(function () {
//    FastClick.attach(document.body);


    if (DistributorFinder.Helper.judgeContainPage("distributorfinderqunit")) {
        return;
    }

    var distributorfinder = new DistributorFinder.Business.DistributorFinderClass();
    distributorfinder.initData();
});