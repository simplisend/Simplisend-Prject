if (!_conditions)
    var _conditions = [];

function getObjectValue(id, type) {
    switch (type) {
        case "dropdown":
            return $($("[primary-id='" + id + "']").find("select")[0]).val();
        case "radio":
            return $($("[primary-id='" + id + "']").find("input:checked")).val();
        case "textarea":
            return $($("[primary-id='" + id + "']").find("textarea")[0]).val();
        case "checkbox":
            arr = [];
            $.each($($("[primary-id='" + id + "']").find("input:checked")), function (element_key, element_value) {
                arr.push($(element_value).val());
            });
            return arr;
        default:
            return $($("[primary-id='" + id + "']").find("input")[0]).val();
    }
}

function getResultCheckbox(item, operation, values) {
    var result = "";
    switch (operation) {
        case "Empty":
            result = (item.length == 0);
            break;
        case "Filled":
            result = (item.length > 0);
            break;
        case "Equal_to":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (item.indexOf(values[i].val) > -1);
                }
                else {
                    if (values[i] == "and")
                        result = result && (item.indexOf(values[i].val) > -1);
                    else
                        result = result || (item.indexOf(values[i].val) > -1);
                }
            }
            break;
        case "Not_equal_to":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (item.indexOf(values[i].val) == -1);
                }
                else {
                    if (values[i] == "and")
                        result = result && (item.indexOf(values[i].val) == -1);
                    else
                        result = result || (item.indexOf(values[i].val) == -1);
                }
            }
            break;
    }
    return result;
}

function getResult(item, operation, values) {
    var result = "";
    switch (operation) {
        case "Empty":
            result = (item == "" || item == undefined);
            break;
        case "Filled":
            result = (item != "" || item != undefined);
            break;
        case "Equal_to":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (values[i].val == item);
                }
                else {
                    if (values[i] == "and")
                        result = result && (values[i].val == item);
                    else
                        result = result || (values[i].val == item);
                }
            }
            break;
        case "Not_equal_to":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (values[i].val != item);
                }
                else {
                    if (values[i] == "and")
                        result = result && (values[i].val != item);
                    else
                        result = result || (values[i].val != item);
                }
            }
            break;
        case "Contains":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (item.indexOf(values[i].val) > -1);
                }
                else {
                    if (values[i] == "and")
                        result = result && (item.indexOf(values[i].val) > -1);
                    else
                        result = result || (item.indexOf(values[i].val) > -1);
                }
            }
            break;
        case "Not_contains":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (item.indexOf(values[i].val) == -1);
                }
                else {
                    if (values[i] == "and")
                        result = result && (item.indexOf(values[i].val) == -1);
                    else
                        result = result || (item.indexOf(values[i].val) == -1);
                }
            }
            break;
        case "Is_grater_than":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (Number(values[i].val) < Number(item));
                }
                else {
                    if (values[i] == "and")
                        result = result && (Number(values[i].val) < Number(item));
                    else
                        result = result || (Number(values[i].val) < Number(item));
                }
            }
            break;
        case "Is_less_than":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (Number(values[i].val) > Number(item));
                }
                else {
                    if (values[i] == "and")
                        result = result && (Number(values[i].val) > Number(item));
                    else
                        result = result || (Number(values[i].val) > Number(item));
                }
            }
            break;
        case "Is_grater_than_or_equal":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (Number(values[i].val) <= Number(item));
                }
                else {
                    if (values[i] == "and")
                        result = result && (Number(values[i].val) <= Number(item));
                    else
                        result = result || (Number(values[i].val) <= Number(item));
                }
            }
            break;
        case "Is_less_than_or_equal":
            for (i = 0; i < values.length; i++) {
                if (result == "") {
                    result = (Number(values[i].val) >= Number(item));
                }
                else {
                    if (values[i] == "and")
                        result = result && (Number(values[i].val) >= Number(item));
                    else
                        result = result || (Number(values[i].val) >= Number(item));
                }
            }
            break;
    }

    return result;
}

function doAction(_do, index) {
    switch (_do.action) {
        case "Hide":
            for (i = 0; i < _do.objects.length; i++)
                $("[primary-id='" + _do.objects[i] + "']").addClass("element-hidden");
            break;
        case "Show":
            for (i = 0; i < _do.objects.length; i++)
                $("[primary-id='" + _do.objects[i] + "']").removeClass("element-hidden");
            break;
        case "Printable":
            for (i = 0; i < _do.objects.length; i++)
                $("[primary-id='" + _do.objects[i] + "']").removeClass("element-unprintable");
            break;
        case "Unprintable":
            for (i = 0; i < _do.objects.length; i++)
                $("[primary-id='" + _do.objects[i] + "']").addClass("element-unprintable");
            break;
        case "Required":
            for (i = 0; i < _do.objects.length; i++) {
                $("[primary-id='" + _do.objects[i] + "']").find("input").prop("required", true);
                $("[primary-id='" + _do.objects[i] + "']").find("textarea").prop("required", true);
                $("[primary-id='" + _do.objects[i] + "']").addClass("element-requried");

            }
            break;
        case "Not_Required":
            for (i = 0; i < _do.objects.length; i++) {
                $("[primary-id='" + _do.objects[i] + "']").find("input").prop("required", false);
                $("[primary-id='" + _do.objects[i] + "']").find("textarea").prop("required", false);
                $("[primary-id='" + _do.objects[i] + "']").removeClass("element-requried");
            }
            break;
        case "Clear_value":
            for (i = 0; i < _do.objects.length; i++) {
                $("[primary-id='" + _do.objects[i] + "']").find("input").val("");
                $("[primary-id='" + _do.objects[i] + "']").find("textarea").val("");
                $("[primary-id='" + _do.objects[i] + "']").removeClass("element-requried");
            }
            break;
        case "Send_to_freind":
            break;
        case "Show_popup":
            //open popup
            $(".popups-page .popup-content").find("[primary-id='" + _do.popup + "']").show();
            // alert(_do.popup);
            break;
    }
}

function unDoAction(_do, index) {
    switch (_do.action) {
        case "Hide":
            for (i = 0; i < _do.objects.length; i++)
                $("[primary-id='" + _do.objects[i] + "']").removeClass("element-hidden");
            break;
        case "Unprintable":
            for (i = 0; i < _do.objects.length; i++)
                $("[primary-id='" + _do.objects[i] + "']").removeClass("element-unprintable");
            break;
        case "Required":
            for (i = 0; i < _do.objects.length; i++) {
                $("[primary-id='" + _do.objects[i] + "']").find("input").prop("required", false);
                $("[primary-id='" + _do.objects[i] + "']").find("textarea").prop("required", false);
                $("[primary-id='" + _do.objects[i] + "']").removeClass("element-requried");
            }
            break;
    }
}

function onFormUpdate() {
    _conditions.forEach(function (_con, index) {
        var result = "";
        _con.if.forEach(function (_if, index) {
            item = getObjectValue(_if.value_1.id, _if.value_1.type);
            if (_if.value_1.type == "checkbox") {
                if (result == "") {
                    result = getResultCheckbox(item, _if.operation, _if.value_2);
                } else {
                    if (_if.sub == "and")
                        result = result && getResultCheckbox(item, _if.operation, _if.value_2);
                    else
                        result = result || getResultCheckbox(item, _if.operation, _if.value_2);
                }
            } else {
                if (result == "") {
                    result = getResult(item, _if.operation, _if.value_2);
                } else {
                    if (_if.sub == "and")
                        result = result && getResult(item, _if.operation, _if.value_2);
                    else
                        result = result || getResult(item, _if.operation, _if.value_2);
                }
            }
        });
        if (result) {
            _con.do.forEach(doAction);
            _con.else.forEach(unDoAction);
        } else {
            _con.else.forEach(doAction);
            _con.do.forEach(unDoAction);
        }
    });
}

//textarea,short-text,radio,dropdown,checkbox
function getInputList() {
    data = {rows: [], fieldsets: []}
    $.each($(".builder-paper .row"), function (key, value) {
        if ($(value).attr("primary-id"))
            data.rows.push($(value).attr("primary-id"));
        $.each($(value).find("[primary-id]"), function (k, v) {
            var fild = {
                id: "",
                type: "",
                values: []
            }
            fild.id = $(v).attr("primary-id");
            fild.type = $(v).attr("rel");
            switch (fild.type) {
                case 'checkbox':
                    $.each($(v).find(".checkbox_input"), function (element_key, element_value) {
                        var val = {
                            text: $(element_value).find("label:visible").text(),
                            value: $(element_value).find("input").val()
                        };
                        fild.values.push(val);
                    });
                    break;
                case 'radio':
                    $.each($(v).find(".radio_input"), function (element_key, element_value) {
                        var val = {
                            text: $(element_value).find("label:visible").text(),
                            value: $(element_value).find("input").val()
                        };
                        fild.values.push(val);
                    });
                    break;
                case 'dropdown':
                    $.each($(v).find("select option"), function (element_key, element_value) {
                        if ($(element_value).css('display') != 'none') {
                            var val = {
                                text: $(element_value).text(),
                                value: $(element_value).attr("value")
                            };
                            fild.values.push(val);
                        }
                    });
                    break;
            }
            data.fieldsets.push(fild);
        });
    });

    $.each($("#popup-builder-mode .row"), function (key, value) {
        if ($(value).attr("primary-id"))
            data.rows.push($(value).attr("primary-id"));
        $.each($(value).find("[primary-id]"), function (k, v) {
            var fild = {
                id: "",
                type: "",
                values: []
            }
            fild.id = $(v).attr("primary-id");
            fild.type = $(v).attr("rel");
            switch (fild.type) {
                case 'checkbox':
                    $.each($(v).find(".checkbox_input"), function (element_key, element_value) {
                        var val = {
                            text: $(element_value).find("label:visible").text(),
                            value: $(element_value).find("input").val()
                        };
                        fild.values.push(val);
                    });
                    break;
                case 'radio':
                    $.each($(v).find(".radio_input"), function (element_key, element_value) {
                        var val = {
                            text: $(element_value).find("label:visible").text(),
                            value: $(element_value).find("input").val()
                        };
                        fild.values.push(val);
                    });
                    break;
                case 'dropdown':
                    $.each($(v).find("select option"), function (element_key, element_value) {
                        if ($(element_value).css('display') != 'none') {
                            var val = {
                                text: $(element_value).text(),
                                value: $(element_value).attr("value")
                            };
                            fild.values.push(val);
                        }
                    });
                    break;
            }
            data.fieldsets.push(fild);
        });
    });

    return data;
}

function getPopupList() {
    data = [];
    $.each($(".popups-page .popup-content"), function (key, value) {
        if ($(value).attr("primary-id"))
            data.push($(value).attr("primary-id"));
    });
    return data;
}

function getFormsList() {
    data = [];

    if ($("input[name='related_forms']").eq(0).val() !== "") {

        var $related_forms = ToJson($("input[name='related_forms']").eq(0).val());
        //[
        // {"id":"34","name":"form1"},
        // {"id":"42","name":"567890987654"}
        // ]

        $.each($related_forms, function () {

            var val = {
                text: this.name,
                value: this.id
            };

            data.push(val);
        });
    }

    return data;
}

function renderConditions() {
    angular.element('#ng_conditions').scope().update();
    angular.element('#ng_conditions').scope().$apply();
}


(function () {
    var app = angular.module('conditions', [], function ($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    });

    app.controller('conditionController', ['$scope', '$sce', '$http', function ($scope, $sce, $http) {
        var self = this;

        self.conditions = _conditions;
        self.inputList = getInputList();
        self.popupList = getPopupList();
        self.formList = getFormsList();

        self.currentIfIndex = -1;
        self.openthis = function (x) {
            self.currentIfIndex = x;
            //$scope.$apply();
        }

        $scope.update = function () {
            console.log("update");
            self.inputList = getInputList();
            self.popupList = getPopupList();
            self.formList = getFormsList();
        }
        //angular.element('#ng_conditions').scope().update();
        //angular.element('#ng_conditions').scope().$apply();

        self.addCondition = function () {
            self.conditions.unshift({if: [], do: [], else: []});
            self.addIf(0);
        }
        self.removeCondition = function (condition_key) {
            self.conditions.splice(condition_key, 1);
        }

        self.toggleSelection = function (arr, value) {
            var idx = arr.indexOf(value);

            // Is currently selected
            if (idx > -1) {
                arr.splice(idx, 1);
            }
            // Is newly selected
            else {
                arr.push(value);
            }
            console.log(_conditions);
        }

        self.addIf = function (condition_key, type = "") {
            self.conditions[condition_key].if.push({
                sub: type,
                value_1: "",
                value_2: [{sub: "", val: ""}],
                operation: "Filled"
            });
            self.currentIfIndex = 0;
        }
        self.removeIf = function (condition_key, if_key) {
            if (self.conditions[condition_key].if.length > 1) {
                self.conditions[condition_key].if.splice(if_key, 1);
            }
        }
        self.changeIfSub = function (condition_key, if_key, sub) {
            self.conditions[condition_key].if[if_key].sub = sub;
        }


        self.addDo = function (condition_key) {
            console.log(condition_key);
            self.conditions[condition_key].do.push({
                action: "",
                objects: [],
                popup: ""
            });
        }
        self.removeDo = function (condition_key, do_key) {
            self.conditions[condition_key].do.splice(do_key, 1);
        }

        self.addElse = function (condition_key) {
            self.conditions[condition_key].else.push({
                action: "",
                objects: [],
                popup: ""
            });
        }
        self.removeElse = function (condition_key, else_key) {
            self.conditions[condition_key].else.splice(else_key, 1);
        }

        self.addVal = function (condition_key, if_key, type) {
            self.conditions[condition_key].if[if_key].value_2.push({sub: type, val: ""});

        }
        self.removeVal = function (condition_key, if_key, val_key) {
            if (self.conditions[condition_key].if[if_key].value_2.length > 1) {
                self.conditions[condition_key].if[if_key].value_2.splice(val_key, 1);

            }
        }

        self.setValue1 = function (key, if_key) {
            self.conditions[key].if[if_key].value_1 = JSON.parse(JSON.stringify(self.inputList.fieldsets[self.conditions[key].if[if_key].value_1_key]));
            self.conditions[key].if[if_key].value_2 = [{sub: "", val: ""}];
            self.conditions[key].if[if_key].operation = "Filled";

        }

        self.operationChange = function (key, if_key) {
            self.conditions[key].if[if_key].value_2 = [{sub: "", val: ""}];

        }

        self.inputNotAvilableFor = function (input, notAvilable) {
            if (input) {
                //input = JSON.parse(input);
                for (var i = 0; i < notAvilable.length; i++) {
                    if (input.type == notAvilable[i])
                        return false;
                }
            }
            return true;
        }
        self.conditionChange = function () {

        }

    }]);


})();