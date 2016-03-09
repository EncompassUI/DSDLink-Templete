//(function (i, s, o, g, r, a, m) {
//    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
//        (i[r].q = i[r].q || []).push(arguments)
//    }, i[r].l = 1 * new Date(); a = s.createElement(o),
//    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
//})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
//
//ga('create', 'UA-254841-2', 'auto');
//ga('send', 'pageview');

(function (w) {
    var Class = function (parent) {
        var _class = function () {
            this.init.apply(this, arguments);
        };

        if (parent) {
            var subClass = function () { };
            subClass.prototype = parent.prototype;
            _class.prototype = new subClass();
        }
        _class.prototype.init = function () { };

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
    CountryJsonPath: "includes/json/Us.json",
    CountiesJsonPath: "includes/json/AllCounties.json",
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

DistributorFinder.CustomEvent = {

};

DistributorFinder.Helper = {
    rgb2hex: function (rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }

        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    },

    createAutoCompleteInput: function (searchText, source, ajaxUrl, parentAutoComplete, linkageKey) {
        var ajaxSource = _.isUndefined(ajaxUrl) ? DistributorFinder.Constant.AjaxPage + '?Action=' + "Autocomplete&Type=" + source : ajaxUrl + source;

        if (!_.isUndefined(parentAutoComplete)) {
            parentAutoComplete.on("autocompleteselect", function (event, ui) {
                ajaxSource = ajaxUrl + source + "&" + linkageKey + "=" + parentAutoComplete.data('value');
            });
        }

        var input = $('<input>');
        input.attr("value", searchText)
            .attr("class", "form-control")
            .attr("type", "text")
            .on('focus', function () {
                this.value = "";
            })
            .on('blur', function () {
                this.value = _.isEmpty(this.value) ? searchText : this.value;
                if (!_.isUndefined(parentAutoComplete)) {
                    ajaxSource = _.isUndefined(ajaxUrl) ? DistributorFinder.Constant.AjaxPage + '?Action=' + "Autocomplete&Type=" + source : ajaxUrl + source;
                }
            });

        var tmpKeyValue = {};

        input.autocomplete({
            max: 3,
            minLength: 1,
            autoFocus: true,
            select: function (e, ui) {
                input.data('value', tmpKeyValue[ui.item.label]);
            },
            source: function (request, response) {
                $.getJSON(ajaxSource + "&term=" + request.term).done(function (result) {
                    tmpKeyValue = {};
                    response($.map(result, function (item) {
                        tmpKeyValue[item.label] = item.value;
                        return {
                            label: item.label,
                            value: item.label
                        };
                    }));
                });
            }
        });

        return input;
    },

    createAutoCompleteInputRe: function (searchText, source, ajaxUrl) {
        var ajaxSource = _.isUndefined(ajaxUrl) ? DistributorFinder.Constant.AjaxPage + '?Action=' + "Autocomplete&Type=" + source : ajaxUrl + source;
        var input = $('<input>');
        input.attr("placeholder", searchText)
             .attr("class", "form-control")
             .attr("type", "text")
             .on('focus', function () {
                 this.value = "";
             });

        input.autocomplete({
            max: 3,
            minLength: 1,
            autoFocus: true,
            source: function (request, response) {
                $.getJSON(ajaxSource + "&term=" + encodeURIComponent(request.term)).done(function (result) {
                    response($.map(result, function (item) {
                        return  item.label;
                    }));
                });
            }
        });

        return input;
    },

    isEmptyOrNull: function (arg) {
        return _.isEmpty(arg) && !_.isNumber(arg);
    },

    replaceNumber: function (str) {
        var regex = /[`0-9]/ig
        return str.replace(regex, "");
    },

    replaceSpace: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

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

DistributorFinder.Common = {

};

DistributorFinder.Business = (function () {

    var DistributorFinderClass = (function () {
        var distributorFinderClass = new Class();

        distributorFinderClass.include({
            init: function () { },
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

        var drawSymbol = function (svgWidth,svgHeight) {
            var symbol = d3.select("body")
                            .append("svg")
                            .attr("id","symbolPoint")
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

        var drawSlider = function (distributors) {
            var distributorFindersFilter = _.filter(distributors, function (customer) {
                return !_.isEmpty(customer.LogoUrl);
            });

            //distributorFindersFilter = _.groupBy(distributorFindersFilter, function (filter) {
            //    return filter.ChainID;
            //});

            //var distributorsByLogo = [];
            //for (var key in distributorFindersFilter) {
            //    if (key == "28") {
            //        _.each(distributorFindersFilter[key], function (distributor) {
            //            distributorsByLogo.push(distributor);
            //        })
            //    } else if (key == "156") {
            //        _.each(distributorFindersFilter[key], function (distributor) {
            //            distributorsByLogo.push(distributor);
            //        })
            //    } else {
            //        distributorsByLogo.push(distributorFindersFilter[key][0]);
            //    }
            //}
            distributorFindersFilter = _.sample(distributorFindersFilter, 15);

            var sliderParent = $(".bxslider");
            _.each(distributorFindersFilter, function (distributor) {
                var sliderDiv = $("<li>").appendTo(sliderParent);
                $("<img>").attr("class", "img-responsive").attr("src", distributor.LogoUrl).attr("alt", distributor.Company).appendTo(sliderDiv);
            });
            var numSlider = $(window).width() / 90 - 1;
            var slider = $('.bxslider').bxSlider({
                minSlides: numSlider,
                maxSlides: numSlider,
                slideWidth: 90,
                slideMargin: 20,
                controls: false,
                ticker: true,
                speed: 200000
            });
            $(".bx-controls").remove();
            return slider;
        };

        distributorFinderHomePageClass.extend({
            
            init: function () {
                $(".home").on("click", function () {
                    location.href = "DistributorFinder.aspx";
                });

                $("#register").on("click", function () {
                    location.href = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.Register;
                });

                distributorFinderHomePageClass.searchForm();

                DistributorFinder.Global.distributorFilter = initMapCustomers();

                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var svgHeight = 0;
                if (windowHeight > windowWidth) {
                    svgHeight = $(window).height() - $("nav").height() - $("footer").height() - 130;
                } else {
                    svgHeight = $(window).height() - $("nav").height() - $("footer").height();
                }

               var slider = drawSlider(initMapCustomers());
                distributorFinderHomePageClass.drawSvgMap(svgHeight).done(function (projection) {
                    distributorFinderHomePageClass.drawCustomersPointer(projection, DistributorFinder.Global.distributorFilter);
                });


                $(window).on('orientationchange', function (e) {
                    var windowWidth = $(window).width();
                    var windowHeight = $(window).height();
                    var svgHeight = 0;
                    if (windowHeight > windowWidth) {
                        svgHeight = $(window).height() - $("nav").height() - $("footer").height() - 130;
                    } else {
                        svgHeight = $(window).height() - $("nav").height() - $("footer").height();
                    }

                    $("#homeMap").children().remove();
                    $("#symbolPoint").remove();
                    var numSlider = $(window).width() / 90 - 1;
                    slider.reloadSlider({
                        minSlides: numSlider,
                        maxSlides: numSlider,
                        slideWidth: 90,
                        slideMargin: 20,
                        controls: false,
                        ticker: true,
                        speed: 200000
                    });
                    $(".bx-controls").remove();
                    distributorFinderHomePageClass.drawSvgMap(svgHeight).done(function (projection) {
                        distributorFinderHomePageClass.drawCustomersPointer(undefined, DistributorFinder.Global.distributorFilter);
                    });
                });
            },

            searchForm: function () {
                var suppliersDiv = DistributorFinder.Helper.createAutoCompleteInputRe(DistributorFinder.SearchText.SelectASupplier, "Supplier").appendTo($(".supplier"));
                var brandDiv = DistributorFinder.Helper.createAutoCompleteInputRe(DistributorFinder.SearchText.SelectABrand, "Brand").appendTo($(".brand"));
                var stateDiv = DistributorFinder.Helper.createAutoCompleteInputRe(DistributorFinder.SearchText.SelectAState, "State").appendTo($(".state"));
                var customerDiv = DistributorFinder.Helper.createAutoCompleteInputRe(DistributorFinder.SearchText.SelectADistributor, "Customer").appendTo($(".distributor"));
                var beverageDiv = $(".beverage-select");

                if (navigator.userAgent.toLowerCase().indexOf("pad") > -1) {
                    $("<option>").attr("disabled","disabled").attr("selected","selected").text("Beverage").prependTo(beverageDiv);
                    beverageDiv.on("change", function () {
                        beverageDiv.find("option:first").removeAttr("selected");
                    });
                    
                } else {
                    beverageDiv.multiselect({
                        header:false,
                        selectedList: 1,
                        noneSelectedText: DistributorFinder.SearchText.SelectBeverage
                    });
                    beverageDiv.parent().find("button").addClass("form-control");
                    suppliersDiv.addClass("text-center");
                    brandDiv.addClass("text-center");
                    customerDiv.addClass("text-center");
                    stateDiv.addClass("text-center");
                }
                

                $("#search").on("click", function () {

                    var supplierText = suppliersDiv.val();
                    var brandText = brandDiv.val();
                    var stateText = stateDiv.val();
                    var customerText = customerDiv.val();
                    var beverageTypes = beverageDiv.val();
                    if (DistributorFinder.Helper.isEmptyOrNull(beverageTypes)) {
                        beverageTypes = "";
                    } else {
                        beverageTypes = beverageTypes.toString()
                    }
                    if (DistributorFinder.Helper.isEmptyOrNull(supplierText) && DistributorFinder.Helper.isEmptyOrNull(brandText) && DistributorFinder.Helper.isEmptyOrNull(stateText) && DistributorFinder.Helper.isEmptyOrNull(customerText) && DistributorFinder.Helper.isEmptyOrNull(beverageTypes)) {
                            DistributorFinder.Global.distributorFilter = initMapCustomers();
                            DistributorFinder.Global.ajaxPostData = "&Supplier=&Brand=&State=&Customer=&beverageTypes=";
                            distributorFinderHomePageClass.drawCustomersPointer(undefined, DistributorFinder.Global.distributorFilter);
                    } else {
                        DistributorFinder.DataProvider.getDataBySearch(supplierText, brandText, stateText, customerText, beverageTypes).done(function (result) {
                            if (result.length > 0) {
                                DistributorFinder.Global.distributorFilter = _.filter(initMapCustomers(), function (customer) {
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i] == customer.CustomerID) {
                                            return customer;
                                        }
                                    }
                                })
                                distributorFinderHomePageClass.drawCustomersPointer(undefined, DistributorFinder.Global.distributorFilter);
                            } else {
                                alert("No results match your search criteria. Please try again.");
                            }
                        });
                    }

                    //if (suppliersDiv.val() == DistributorFinder.SearchText.SelectASupplier) {
                    //    suppliersDiv.data('value', "");
                    //}

                    //if (brandDiv.val() == DistributorFinder.SearchText.SelectABrand) {
                    //    brandDiv.data('value', "");
                    //}

                    //if (stateDiv.val() == DistributorFinder.SearchText.SelectAState) {
                    //    stateDiv.data('value', "");
                    //}

                    //if (customerDiv.val() == DistributorFinder.SearchText.SelectADistributor) {
                    //    customerDiv.data('value', "");
                    //}

                    //if (DistributorFinder.Helper.isEmptyOrNull(beverageDiv.val()) && suppliersDiv.val() == DistributorFinder.SearchText.SelectASupplier && brandDiv.val() == DistributorFinder.SearchText.SelectABrand && stateDiv.val() == DistributorFinder.SearchText.SelectAState && customerDiv.val() == DistributorFinder.SearchText.SelectADistributor) {
                    //    DistributorFinder.Global.distributorFilter = initMapCustomers();
                    //    DistributorFinder.Global.ajaxPostData = "";
                    //    distributorFinderHomePageClass.drawCustomersPointer(undefined, DistributorFinder.Global.distributorFilter);
                    //}
                    //else {
                    //    var supplierID = suppliersDiv.data('value');
                    //    var brandID = brandDiv.data('value');
                    //    var state = stateDiv.data('value');
                    //    var customerID = customerDiv.data('value');
                    //    var beverageType = beverageDiv.val();
                    //    if (_.isEmpty(state)) {
                    //        state = stateDiv.val().toUpperCase();
                    //        if (state === "STATE") {
                    //            state = "";
                    //        }
                    //    }

                    //    DistributorFinder.DataProvider.getDataBySearch(supplierID, brandID, state, customerID, beverageType).done(function (result) {
                    //        if (result.length > 0) {
                    //            DistributorFinder.Global.distributorFilter = _.filter(initMapCustomers(), function (customer) {
                    //                for (var i = 0; i < result.length; i++) {
                    //                    if (result[i] == customer.CustomerID) {
                    //                        return customer;
                    //                    }
                    //                }
                    //            })
                    //            distributorFinderHomePageClass.drawCustomersPointer(undefined, DistributorFinder.Global.distributorFilter);
                    //        } else {
                    //            alert("No results match your search criteria. Please try again.");
                    //        }
                    //    });
                    //}
                });
            },

            drawSvgMap: function (svgHeight) {
                var dtd = $.Deferred();
                var svgWidth = $(window).width();
                var svgHeight = svgHeight;

                drawSymbol(svgWidth, svgHeight);
                var svg = d3.select("#homeMap").append("svg").attr("id", "usMapSvg").style("overflow", "hidden").attr("width", svgWidth).attr("height", svgHeight);
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
                                var supplier = encodeURIComponent( DistributorFinder.Helper.hrefRequest("Supplier", DistributorFinder.Global.ajaxPostData));
                                var brand = encodeURIComponent( DistributorFinder.Helper.hrefRequest("Brand", DistributorFinder.Global.ajaxPostData));
                                var state = d.id;
                                var beverageTypes = DistributorFinder.Helper.hrefRequest("beverageTypes", DistributorFinder.Global.ajaxPostData);
                                var customer = encodeURIComponent( DistributorFinder.Helper.hrefRequest("Customer", DistributorFinder.Global.ajaxPostData));
                                location.href = "DistributorFinder.aspx" + "?Action=ShowMap" + "&Supplier=" + supplier + "&Brand=" + brand + "&State=" + d.id + "&Customer=" + customer + "&beverageTypes=" + beverageTypes;
                              
                            }

                        });
                    DistributorFinder.Global.projection = projection;
                    dtd.resolve(projection);
                });
                return dtd;
            },

            drawCustomersPointer: function (projection, filterCustomers) {
                if(_.isUndefined(projection)){
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
                        return "translate(" + (projection([d.Longitude, d.Latitude])[0]-5) + "," + (projection([d.Longitude, d.Latitude])[1]-10) + ")";
                    });
            }
        });
        return distributorFinderHomePageClass;
    })();

    var DistributorFinderMapPageClass = (function () {
        var distributorFinderMapPageClass = new Class();

        var drawCustomersList = function () {
            var customersFilterData = initMapCustomers();
            var customerObjGroupByCity = _.groupBy(customersFilterData, function (c) {
                return c.City;
            });
            var customerAllkeys = _.keys(customerObjGroupByCity);
            var customerSortResult = _.sortBy(customerAllkeys);

            for (var key in customerObjGroupByCity) {
                customerObjGroupByCity[key] = _.sortBy(customerObjGroupByCity[key], "Company");
            }
        };

        distributorFinderMapPageClass.extend({
            init: function () {
                var mapHeight = $(window).height() - $("nav").height() - $("footer").height();
                $(".map-container").css("height", mapHeight);

                $(".home").on("click", function () {
                    location.href = "DistributorFinder.aspx";
                });

                $(".listbar h4").on("click", ".fa-angle-left", function () {
                    window.history.back();
                });

                $("#register").on("click", function () {
                    location.href = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.Register;
                });

                DistributorFinderMapClass.drawGoogleMap().done(function () {
                    var listMaxHeight = mapHeight - $(".listbar").find("h4")[0].offsetHeight;
                    $(".list").css("max-height", listMaxHeight);
                });
               
            },
        });
        return distributorFinderMapPageClass;
    })();

    var DistributorFinderProfilePageClass = (function () {
        var distributorFinderMobileProfileClass = new Class();

        distributorFinderMobileProfileClass.extend({
            init: function (isShare, isGeoCounty) {
                if (isShare != true) {
                    var customerID;
                    var shortName;
                    customerID = DistributorFinder.Helper.hrefRequest("CustomerID");
                    shortName = DistributorFinder.Helper.hrefRequest("ShortName");

                    $('#shareModal').on('show.bs.modal', function (event) {
                        var button = $(event.relatedTarget); // Button that triggered the modal
                        var recipient = button.data('whatever'); // Extract info from data-* attributes
                        var iframeData = button.data('iframe');
                        var modal = $(this);
                        modal.find('.modal-body #url-input').val(recipient);
                        modal.find('.modal-body #iframe-input').val(iframeData);
                        $(".share-templete-wrapper").html(iframeData);
                    });

                    $("#share-copy").on("click", function () {
                        try {
                            $(".share-copy-input:not(:hidden)").select();
                            var successful = document.execCommand('copy');
                            var msg = successful ? 'successful' : 'unsuccessful';
                            console.log('Copying text command was ' + msg);
                        } catch (err) {
                            console.log('Oops, unable to copy');
                        }
                    });

                    $(".home").on("click", function () {
                        location.href = "DistributorFinder.aspx";
                    });

                    $("#register").on("click", function () {
                        location.href = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.Register;
                    });

                    $(".content").find(".fa-angle-left").on("click", function () {
                        window.history.back();
                    });

                    $("#update-profile").on("click", function () {
                        if (_.isUndefined(customerID)) {
                            location.href = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.CheckHasPassword + "&ShortName=" + shortName;
                        } else {
                            location.href = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.CheckHasPassword + "&CustomerID=" + customerID;
                        }
                    });

                    var brandsModal = $("#brandsModal");
                    var brandTable = brandsModal.find(".table-view");


                    $(".brands-logo").on("click", function () {
                        var SupplierMasterID = $(this).attr("id");
                        var supplier = encodeURIComponent($(this).find("img").attr("alt"));
                        if (_.isUndefined(customerID)) {
                            location.href = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.Brand + "&ShortName=" + shortName + "&SupplierMasterID=" + SupplierMasterID + "&Supplier=" + supplier;
                        } else {
                            location.href = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.Brand + "&CustomerID=" + customerID + "&SupplierMasterID=" + SupplierMasterID + "&Supplier=" + supplier;
                        }
                    });

                    distributorFinderMobileProfileClass.drawProfileMap();
                    distributorFinderMobileProfileClass.drawProfileRadius();
                } else {
                    $(".btn-primary").hide();
                    $(".btn-share").hide();
                    if (isGeoCounty === true) {
                        distributorFinderMobileProfileClass.drawProfileMap();
                    }
                    distributorFinderMobileProfileClass.drawProfileRadius();
                }
            },

            drawProfileRadius: function () {
                //var service = new google.maps.places.PlacesService(document.createElement('div'));
                //service.nearbySearch({
                //    location: new google.maps.LatLng(lat, lng),
                //    radius: '32186',
                //    type: 'city_hall'
                //}, function (r) { console.log(r) });
                var radiusDom = $(".radius");
                var tmpResultArr = [];
                var lat = radiusDom.attr("customer-lat");
                var lng = radiusDom.attr("customer-lng");
                var url = "http://api.geonames.org/findNearbyPostalCodesJSON?lat=" + lat + "&lng=" + lng + "&username=sunxinfei&maxRows=20";
                $.get(url, function (r) {
                    try {
                        if (_.isUndefined(r.postalCodes)) {
                            return;
                        }
                        _.each(r.postalCodes, function (p) {
                            tmpResultArr.push(p.placeName + ", " + p.adminCode1);
                        });
                        resultArr = _.uniq(tmpResultArr);
                        
                        _.each(resultArr, function (result) {
                            $("<li>").text(result).append("<i class=\"fa fa-map-marker\"></i>").appendTo(radiusDom);
                        });
                    } catch (e) {
                        console.log(e);
                    }
                });
            },

            drawProfileMap: function () {
                var customerGeoCounties = getCustomerGeoCounties();
                var svgCountyWidth = $(".card").width();
                var svgCountyHeight = $(".card").width() * 500 / 960;
                var parentDom = $(".profile-map");
                var tmpDtd = [];
                _.each(customerGeoCounties, function (customerGeoCounty) {
                    tmpDtd.push(DistributorFinderMapClass.drawCountyMap(customerGeoCounty.State, customerGeoCounty.GeoCounties, svgCountyWidth, svgCountyHeight, parentDom));
                });
                $.when.apply(null, tmpDtd).then(function () {
                    if ($('.grid').length != 0) {
                        $('.grid').masonry({
                            // options
                            itemSelector: '.grid-item'
                        });
                    }
                });
            }
        });
        return distributorFinderMobileProfileClass;
    })();

    var DistributorFinderMapClass = (function () {
        var distributorFinderMapClass = new Class();

        var getStateCentroidDeferred = function (stateName) {
            var dtd = $.Deferred();
            DistributorFinder.Helper.stateDeferred().done(function (us) {
                var collection = $.extend({}, us.objects.usa, true);
                collection.geometries = collection.geometries.filter(function (d) {
                    return d.id == stateName;
                });
                dtd.resolve(d3.geo.centroid(topojson.feature(us, collection).features[0]));
            });
            return dtd;
        };

        var getTranslateScaleByState = function (d, path, svgCountyWidth, svgCountyHeight) {
            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = .9 / Math.max(dx / svgCountyWidth, dy / svgCountyHeight),
                translate = [svgCountyWidth / 2 - scale * x, svgCountyHeight / 2 - scale * y];

            return {
                scale: scale,
                translate: translate
            };
        };

        var getTranslateScaleDeferred = function (GeoState, path, svgCountyWidth, svgCountyHeight) {
            var dtd = $.Deferred();
            DistributorFinder.Helper.stateDeferred().done(function (us) {
                var countryPath = topojson.feature(us, us.objects.usa).features.filter(function (d) {
                    return d.id == GeoState;
                });

                var tmpTranslate = getTranslateScaleByState(countryPath[0], path, svgCountyWidth, svgCountyHeight);
                dtd.resolve(tmpTranslate);
            });
            return dtd;
        };

        var drawGoogleCountyPolygon = function (g, stateName) {
            DistributorFinder.Helper.countiesDeferred().done(function (json) {
                var countiesJson = $.extend({}, json.objects.collection, true);
                countiesJson.geometries = _.filter(countiesJson.geometries, function (countyJson) {
                    return countyJson.properties.state === stateName;
                });

                var countiesData = topojson.feature(json, countiesJson).features;
                _.each(countiesData, function (countyData) {
                    if (!DistributorFinder.Helper.isEmptyOrNull(countyData.geometry)) {
                        _.each(countyData.geometry.coordinates, function (tmp) {
                            if (_.isArray(tmp[0][0])) {
                                g.drawPolygon(tmp[0]);
                            } else {
                                g.drawPolygon(tmp);
                            }
                        });

                    } else {

                    }
                });
            });
        };

        var joinCardDom = function (stateCustomer) {
            var tmpHtml = "";
            tmpHtml += "<div class = \"map-card fix\"  data-customerid=" + stateCustomer.CustomerID + ">";
            tmpHtml += "<h4>" + stateCustomer.Company + "</h4>";
            tmpHtml += "<div class=\"address\">";
            tmpHtml += "<ul class=\"inline-block\">";
            if (!_.isEmpty(stateCustomer.Address)) {
                tmpHtml += "<li><i class=\"fa fa-map-marker\"></i><p>" + stateCustomer.Address + "</p></li>";
            }
            if (!_.isEmpty(stateCustomer.Address2)) {
                tmpHtml += "<li><i class=\"fa fa-map-marker\"></i><p>" + stateCustomer.Address2 + "</p></li>";
            }
            if (!_.isEmpty(stateCustomer.City) || !_.isEmpty(stateCustomer.State) || !_.isEmpty(stateCustomer.PostalCode)) {
                tmpHtml += "<li><p>" + stateCustomer.City + ', ' + stateCustomer.State + ' ' + stateCustomer.PostalCode + "</p></li>"
            }
            if (!_.isEmpty(stateCustomer.Phone)) {
                tmpHtml += "<li><i class=\"fa fa-phone\"></i><p>" + stateCustomer.Phone + "</p></li>";
            }
            if (!_.isEmpty(stateCustomer.Website)) {
                if (stateCustomer.Website.indexOf("http") > -1) {
                    tmpHtml += "<li><i class=\"fa fa-link\"></i><p><a target=\"_blank\" title=\"" + stateCustomer.Company + "\""+ "href=\"" + stateCustomer.Website + "\">" + stateCustomer.Company + "</a></p></li>";
                } else {
                    tmpHtml += "<li><i class=\"fa fa-link\"></i><p><a target=\"_blank\" title=\"" + stateCustomer.Company + "\""+ "href=\"http://" + stateCustomer.Website + "\">" + stateCustomer.Company + "</a></p></li>";
                }
            }
            tmpHtml += "</ul>";

            if (!_.isEmpty(stateCustomer.LogoUrl)) {
                tmpHtml += "<div class=\"inline-block map-logo\">";
                tmpHtml += "<img src =\" " + stateCustomer.LogoUrl + "?cacherandom=" + Math.random()+"\"" + "alt=\"" + stateCustomer.Company + "\">";
                tmpHtml += "</div>";
            }
            var locationHref = "DistributorFinder.aspx" + '?Action=' + DistributorFinder.Action.Profile + "&CustomerID=" + stateCustomer.CustomerID + "&ShortName=" + stateCustomer.ShortName;
            tmpHtml += "</div>";
            tmpHtml += "<button class=\"btn btn-block btn-primary margintop10\" onclick= \"window.goProfile()\" >Company Profile</button>"
            tmpHtml += "</div>";

            var  goProfile = function() {
                window.location.href = locationHref;
            }

            window.goProfile = goProfile;
            return tmpHtml;
          
        }

        var drawGoogleMarker = function (g, stateCustomers) {
            var markerOptionsArr = [];

            _.each(stateCustomers, function (stateCustomer) {
                var markerOption = {
                    key: stateCustomer.CustomerID,
                    position: [stateCustomer.Longitude, stateCustomer.Latitude],
                    content: stateCustomer.Company,
                    eventHandlerArr: [
                        {
                            event: "click", handler: function (r) {
                                g.clearInfowindow();
                                
                                var infowindowOptions = {
                                    key: stateCustomer.CustomerID,
                                    content: joinCardDom(stateCustomer)
                                }
                                g.createInfowindow(infowindowOptions).openInfowindow(stateCustomer.CustomerID, stateCustomer.CustomerID);

                                var defultOption = {
                                    icon: "",
                                    zIndex: 10
                                }
                                g.clearMarkerStyle(defultOption);
                                var styleOption = {
                                    icon: "./images/MapMarkerBlue.png",
                                    zIndex: 100
                                }
                                g.setMarkersStyle(styleOption, stateCustomer.CustomerID);
                                g.setCenterByPoint(stateCustomer.Latitude, stateCustomer.Longitude);
                            }
                        }
                    ],
                    customData: { stateCustomer: stateCustomer }
                };
                markerOptionsArr.push(markerOption);
            });
            return markerOptionsArr;
        };

        distributorFinderMapClass.extend({
            init: function () { },

            drawGoogleMap: function () {
                var dtd = $.Deferred();

                var g = new GoogleMap();
                
                $(".listbar").on("click", "li", function () {
                    g.markerBehavior($(this).attr("data-customerid"), g.MarkerAction.TRIGGER, "click");
                });

                var mapCanvas = $("<div>").attr("id", "map-canvas").appendTo($(".map-container")).css({ "width": "100%", "height": "100%" });
                var stateCustomersFilter = initMapCustomers();
                var stateCustomers = _.filter(stateCustomersFilter, function (customer) {
                    for (var i = 0; i < stateCustomersFilter.length; i++) {
                        return customer.Longitude != "" && customer.Latitude != "" && customer.Longitude < 0;
                    }
                });
                var options = {
                    container: $('#map-canvas')[0]
                }
                g.render(options);
                var markerOptionsArr = drawGoogleMarker(g, stateCustomers);

                DistributorFinder.Helper.stateDeferred().done(function (json) {
                    var statesJson = $.extend({}, json.objects.usa, true);
                    statesJson.geometries = _.filter(statesJson.geometries, function (stateJson) {
                        return stateJson.id == DistributorFinder.Helper.hrefRequest("State").toUpperCase();
                    });
                    $(".listbar").find("h4").html("<i class=\"fa fa-angle-left pre\"></i>" + statesJson.geometries[0].properties.name);
                    statesJson.geometries[0].properties.name
                    var statePolygon = topojson.feature(json, statesJson).features;

                    DistributorFinder.Helper.countiesDeferred().done(function (json) {
                        drawGoogleCountyPolygon(g, DistributorFinder.Helper.hrefRequest("State").toUpperCase());
                        if (statePolygon[0].geometry.coordinates.length == 1) {
                            g.setLatLngBounds(statePolygon[0].geometry.coordinates[0])
                             .setCenterByLatLngBounds()
                             .drawMarkers(markerOptionsArr);
                        }
                        if (statePolygon[0].geometry.coordinates.length > 1) {
                            var tmp = _.flatten(_.flatten(statePolygon[0].geometry.coordinates, true), true);
                            g.setLatLngBounds(tmp)
                             .setCenterByLatLngBounds()
                             .drawMarkers(markerOptionsArr);
                        }
                        dtd.resolve();
                    });
                });
                return dtd;
            },

            drawCountyMap: function (GeoState, GeoCountiesNames, svgCountyWidth, svgCountyHeight, parentDom) {
                var dtd = $.Deferred();

                var countyNames = GeoCountiesNames;
                getStateCentroidDeferred(GeoState, svgCountyWidth, svgCountyHeight).done(function (result) {
                    var geoCountiesMapDiv = $("<div>").appendTo(parentDom).attr("class", "geoCountiesMap").attr("id", GeoState).css({ "width": svgCountyWidth, "height": svgCountyHeight });
                    var svg = d3.select(geoCountiesMapDiv[0]).append("svg")
                                .attr("width", svgCountyWidth)
                                .attr("height", svgCountyHeight).append("g").attr("id", "countyMap");
                    var projection = d3.geo.mercator().center(result).scale(1000).translate([svgCountyWidth / 2, svgCountyHeight / 2]);
                    var path = d3.geo.path().projection(projection);

                    var callBack = function (translateScale) {
                        DistributorFinder.Helper.countiesDeferred().done(function (counties) {
                            var collection = $.extend({}, counties.objects.collection, true);
                            collection.geometries = collection.geometries.filter(function (d) {
                                return d.properties.state == GeoState;
                            });
                            var countyData = topojson.feature(counties, collection).features;
                            svg.selectAll("path")
                                .data(countyData)
                                .enter().append("path")
                                .attr("stroke", "#fff")
                                .attr("stroke-width", 1 / translateScale.scale)
                                .attr("d", path)
                                .attr("fill", function (d) {
                                    var flag = false;
                                    for (var i = 0; i < countyNames.length; i++) {
                                        var tmpCounty = countyNames[i];
                                        if (tmpCounty.County == d.properties.name) {
                                            flag = true;
                                            $(this).attr("distributorgeocountyid", tmpCounty.DistributorGeoCountyID);
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        return "#b3c06c";
                                    } else {
                                        return "#cccccc";
                                    }
                                });
                            svg.attr("transform", "translate(" + translateScale.translate + ")scale(" + translateScale.scale + ")");
                            dtd.resolve();
                        });
                    };
                    getTranslateScaleDeferred(GeoState, path, svgCountyWidth, svgCountyHeight).done(callBack);
                });
                return dtd.promise();
            }
        });

        return distributorFinderMapClass;
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