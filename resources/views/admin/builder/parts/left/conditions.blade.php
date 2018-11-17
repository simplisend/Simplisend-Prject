<div id="conditions" style="padding: 0px;" ng-app="conditions">
    <div id="ng_conditions" ng-controller="conditionController as conditionCtrl">
        <div id="condition_setting" class="tools_panel animated form-builder col-lg-12" style="display: none">
            {{--<h3>Rows</h3>--}}
            <div class="panel-title">
                <a href="javascript:void(0)" class="add_remove " ng-click="conditionCtrl.addCondition()"
                   style="margin: -10px 12px;">
                    <i class="admin-icons icons-plus-circle" style="color: #fff;"></i>
                </a>
                Conditions
            </div>
            <div class="panel-item row-item" id="accordion_columns_setting" style="margin-top: 9px">

                <div class="panel panel-default" ng-repeat="(key, value) in conditionCtrl.conditions track by $index ">
                    <div class="item-title" style="padding-top: 7px; cursor: pointer;" ng-click="conditionCtrl.openthis(key)">
                        Condition <% conditionCtrl.conditions.length-key %>
                        <a href="javascript:void(0)" class="add_remove " value="remove" ng-click="conditionCtrl.removeCondition(key)">
                            <i class="admin-icons icons-minis-circle"></i>
                        </a>
                    </div>
                    <div id="collapse_<%key%>" class="<% (key == conditionCtrl.currentIfIndex) ? 'collapse panel-collapse in' : 'collapse panel-collapse' %> tools-group" style="background-color: white;" >

                        <div class="full_condition_statement">
                            <div class="if_statement_container" >
                                <div class="if_statement" ng-repeat="(if_key, if_value) in value.if track by $index">

                                    <div class="if-tools-btns" style="text-align: center;" ng-if="if_key!=0" class="if_sub">
                                        <button ng-class="{'and_or_button':true, 'active':value.if[if_key].sub=='and' }" ng-click="conditionCtrl.changeIfSub(key,if_key,'and')" >
                                            And
                                        </button>
                                        <button ng-class="{'and_or_button':true, 'active':value.if[if_key].sub=='or' }" ng-click="conditionCtrl.changeIfSub(key,if_key,'or')" >
                                            Or
                                        </button>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-2 label-big"> If </div>
                                        <div class="col-xs-8">
                                            <select class="condition_select" ng-model="value.if[if_key].value_1_key" ng-change="conditionCtrl.setValue1(key,if_key)">
                                                <option value="">Choose Element</option>
                                                <option ng-repeat="(input_key, input_value) in conditionCtrl.inputList.fieldsets track by $index" value="<%input_key%>" ng-selected="value.if[if_key].value_1_key == input_key" > <%input_value.id%> </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-2 label-small"> is </div>
                                        <div class="col-xs-8">
                                            <select class="condition_select" ng-model="value.if[if_key].operation" ng-change="conditionCtrl.operationChange(key,if_key)">
                                                <option value="Empty"> Empty </option>
                                                <option value="Filled"> Filled </option>
                                                <option value="Equal_to"> Equal to </option>
                                                <option value="Not_equal_to"> Not equal to </option>
                                                <option value="Contains" ng-if="conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])"> Contains </option>
                                                <option value="Not_contains" ng-if="conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])"> Not Contains </option>
                                                <option value="Is_grater_than" ng-if="conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])"> Greater than </option>
                                                <option value="Is_less_than" ng-if="conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])"> Less than </option>
                                                <option value="Is_grater_than_or_equal" ng-if="conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])"> Greater than or equal </option>
                                                <option value="Is_less_than_or_equal" ng-if="conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])"> Less than or equal </option>
                                            </select>
                                        </div>
                                        <div class="col-xs-2 label-small" ng-if="value.if.length>1">
                                            <a href="javascript:void(0)" class=" add_remove " value="remove" ng-click="conditionCtrl.removeIf(key,if_key)">
                                                <i class="admin-icons icons-minis-circle"></i>
                                            </a>
                                        </div>

                                    </div>
                                    <div ng-if="value.if[if_key].operation!='Empty' && value.if[if_key].operation!='Filled' ">

                                        <div ng-repeat="(input_key_2, input_value_2) in value.if[if_key].value_2 track by $index">
                                            <div class="row">
                                                <div class="col-xs-2 label-small" ><span ng-if="input_key_2!=0"><%value.if[if_key].value_2[input_key_2].sub%></span></div>
                                                <div class="col-xs-8">
                                                    <input ng-model="value.if[if_key].value_2[input_key_2].val" ng-if="conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])" ng-change="conditionCtrl.conditionChange()">
                                                    <select class="condition_select" ng-model="value.if[if_key].value_2[input_key_2].val" ng-if="!conditionCtrl.inputNotAvilableFor(value.if[if_key].value_1,['radio','dropdown','checkbox'])" ng-change="conditionCtrl.conditionChange()">
                                                        <option ng-repeat="(input_key, input_value) in value.if[if_key].value_1.values track by $index" value="<%input_value.value%>" ng-selected="value.if[if_key].value_2[input_key_2].val == input_value.value"> <%input_value.text%> </option>
                                                    </select>
                                                </div>
                                                <div class="col-xs-2" ng-if="input_key_2!=0">
                                                    <a href="javascript:void(0)" class=" add_remove " value="remove" ng-click="conditionCtrl.removeVal(key,if_key,input_key_2)"
                                                       style="margin: -6px -2px -18px -2px">
                                                        <i class="admin-icons icons-minis-circle"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-12" ng-if="input_key_2==0">
                                                    <button class="and_or_button" ng-click="conditionCtrl.addVal(key,if_key,'and')">
                                                        And
                                                    </button>
                                                    <button class="and_or_button" ng-click="conditionCtrl.addVal(key,if_key,'or')">
                                                        Or
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <hr >
                                </div>
                                <div class="if-tools-btns" style="text-align: center;">
                                    <button class="and_or_button " ng-click="conditionCtrl.addIf(key,'and')" >
                                        And
                                    </button>
                                    <button class="and_or_button " ng-click="conditionCtrl.addIf(key,'or')" >
                                        Or
                                    </button>
                                </div>
                                <hr >
                            </div>

                            <div class="do_statement_container" >
                                <div class="do_statement">
                                    <div class="row">
                                        <div class="col-xs-10 label-big">
                                            Do
                                        </div>
                                        <div class="col-xs-2">
                                            <a href="javascript:void(0)" class=" add_remove " ng-click="conditionCtrl.addDo(key)" style="padding: 4px 0;">
                                                <i class="admin-icons icons-plus-circle"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div  ng-repeat="(do_key, do_value) in value.do track by $index">
                                        <div class="row">
                                            <div class="col-xs-2 label-big">    </div>
                                            <div class="col-xs-8">
                                                <select class="condition_select" ng-model="value.do[do_key].action" ng-change="conditionCtrl.conditionChange()">
                                                    <option value="">Select Action</option>
                                                    <option value="Hide">Hide</option>
                                                    <option value="Show">Show</option>
                                                    <option value="Printable">Print</option>
                                                    <option value="Unprintable">Unprint</option>
                                                    <option value="Required">Require</option>
                                                    <option value="Not_Required">Not Require</option>
                                                    <option value="Clear_value">Clear value</option>
                                                    <option value="Attach_form">Attach form</option>

                                                    <option value="Send_to_freind">Send To</option>
                                                    <option value="Show_popup">Show PopUp</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row" style="position: relative;" >
                                            <div class="col-xs-2 label-big">    </div>
                                            <div class="col-xs-8">
                                                <div class="checkList" ng-if="value.do[do_key].action!='Show_popup' && value.do[do_key].action!='Attach_form'">
                                                    <div class="checkRow" ng-repeat="(input_key, input_value) in conditionCtrl.inputList.rows track by $index">
                                                        <input type="checkbox"
                                                               id="ch-rows-<%do_key%>-<%$index%>"
                                                               value="<%input_value%>"
                                                               ng-checked="value.do[do_key].objects.indexOf(input_value) > -1"
                                                               ng-click="conditionCtrl.toggleSelection(value.do[do_key].objects,input_value)"
                                                        >
                                                        <label for="ch-rows-<%do_key%>-<%$index%>">
                                                            <%input_value%>
                                                        </label>
                                                    </div>
                                                    <div class="checkRow" ng-repeat="(input_key, input_value) in conditionCtrl.inputList.fieldsets track by $index">
                                                        <input type="checkbox"
                                                               id="ch-fieldsets-<%do_key%>-<%$index%>"
                                                               value="<%input_value.id%>"
                                                               ng-checked="value.do[do_key].objects.indexOf(input_value.id) > -1"
                                                               ng-click="conditionCtrl.toggleSelection(value.do[do_key].objects,input_value.id)"
                                                        >
                                                        <label for="ch-fieldsets-<%do_key%>-<%$index%>">
                                                            <%input_value.id%>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="checkList" ng-if="value.do[do_key].action=='Attach_form'">
                                                    <div class="checkRow" ng-repeat="(input_key, input_value) in conditionCtrl.formList track by $index">
                                                        <input type="checkbox"
                                                               id="ch-rows-<%do_key%>-<%$index%>"
                                                               value="<%input_value.value%>"
                                                               ng-checked="value.do[do_key].objects.indexOf(input_value) > -1"
                                                               ng-click="conditionCtrl.toggleSelection(value.do[do_key].objects,input_value)"
                                                        >
                                                        <label for="ch-rows-<%do_key%>-<%$index%>">
                                                            <%input_value.text%>
                                                        </label>
                                                    </div>
                                                </div>
                                                <select class="condition_select" ng-if="value.do[do_key].action=='Show_popup'" ng-model="value.do[do_key].popup" ng-change="conditionCtrl.conditionChange()">
                                                    <option value="">Select Popup</option>
                                                    <option ng-repeat="(input_key, input_value) in conditionCtrl.popupList track by $index" value="<%input_value%>" > <%input_value%> </option>
                                                </select>
                                            </div>

                                            <a href="javascript:void(0)" class=" add_remove " ng-click="conditionCtrl.removeDo(key,do_key)"
                                               style="position: absolute; bottom: 0px; right: 10px;">
                                                <i class="admin-icons icons-minis-circle"></i>
                                            </a>
                                        </div>
                                        <hr ng-if="value.do.length > (do_key+1)">
                                    </div>

                                </div>
                            </div>

                            <div class="do_statement_container" >
                                <div class="else_statement">
                                    <div class="row">
                                        <div class="col-xs-10 label-big">
                                            Else
                                        </div>
                                        <div class="col-xs-2">
                                            <a href="javascript:void(0)" class=" add_remove " ng-click="conditionCtrl.addElse(key)" style="padding: 4px 0;">
                                                <i class="admin-icons icons-plus-circle"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div  ng-repeat="(else_key, else_value) in value.else track by $index">
                                        <div class="row">
                                            <div class="col-xs-2 label-big">    </div>
                                            <div class="col-xs-8">
                                                <select class="condition_select" ng-model="value.else[else_key].action" ng-change="conditionCtrl.conditionChange()">
                                                    <option value="">Select Action</option>
                                                    <option value="Hide">Hide</option>
                                                    <option value="Show">Show</option>
                                                    <option value="Printable">Print</option>
                                                    <option value="Unprintable">Unprint</option>
                                                    <option value="Required">Require</option>
                                                    <option value="Not_Required">Not Require</option>
                                                    <option value="Clear_value">Clear value</option>
                                                    <option value="Attach_form">Attach form</option>
                                                    <option value="Send_to_freind">Send To</option>
                                                    <option value="Show_popup">Show PopUp</option>
                                                </select>
                                            </div>
                                            <div class="col-xs-2">
                                            </div>
                                        </div>
                                        <div class="row" style="position: relative;">
                                            <div class="col-xs-2 label-big">    </div>
                                            <div class="col-xs-8">
                                                <div class="checkList" ng-if="value.else[else_key].action!='Show_popup' & value.else[else_key].action!='Attach_form'">
                                                    <div class="checkRow" ng-repeat="(input_key, input_value) in conditionCtrl.inputList.rows track by $index">
                                                        <input type="checkbox"
                                                               id="ch2-rows-<%do_key%>-<%$index%>"
                                                               value="<%input_value%>"
                                                               ng-checked="value.do[do_key].objects.indexOf(input_value) > -1"
                                                               ng-click="conditionCtrl.toggleSelection(value.do[do_key].objects,input_value)"
                                                        >
                                                        <label for="ch2-rows-<%do_key%>-<%$index%>">
                                                            <%input_value%>
                                                        </label>
                                                    </div>
                                                    <div class="checkRow" ng-repeat="(input_key, input_value) in conditionCtrl.inputList.fieldsets track by $index">
                                                        <input type="checkbox"
                                                               id="ch2-fieldsets-<%do_key%>-<%$index%>"
                                                               value="<%input_value.id%>"
                                                               ng-checked="value.else[else_key].objects.indexOf(input_value.id) > -1"
                                                               ng-click="conditionCtrl.toggleSelection(value.else[else_key].objects,input_value.id)"
                                                        >
                                                        <label for="ch2-fieldsets-<%do_key%>-<%$index%>">
                                                            <%input_value.id%>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="checkList" ng-if="value.else[else_key].action=='Attach_form'">
                                                    <div class="checkRow" ng-repeat="(input_key, input_value) in conditionCtrl.inputList.rows track by $index">
                                                        <input type="checkbox"
                                                               id="ch2-rows-<%do_key%>-<%$index%>"
                                                               value="<%input_value%>"
                                                               ng-checked="value.do[do_key].objects.indexOf(input_value) > -1"
                                                               ng-click="conditionCtrl.toggleSelection(value.do[do_key].objects,input_value)"
                                                        >
                                                        <label for="ch2-rows-<%do_key%>-<%$index%>">
                                                            <%input_value%>
                                                        </label>
                                                    </div>
                                                    <div class="checkRow" ng-repeat="(input_key, input_value) in conditionCtrl.inputList.fieldsets track by $index">
                                                        <input type="checkbox"
                                                               id="ch2-fieldsets-<%do_key%>-<%$index%>"
                                                               value="<%input_value.id%>"
                                                               ng-checked="value.else[else_key].objects.indexOf(input_value.id) > -1"
                                                               ng-click="conditionCtrl.toggleSelection(value.else[else_key].objects,input_value.id)"
                                                        >
                                                        <label for="ch2-fieldsets-<%do_key%>-<%$index%>">
                                                            <%input_value.id%>
                                                        </label>
                                                    </div>
                                                </div>
                                                <select class="condition_select" ng-if="value.else[else_key].action=='Show_popup'" ng-model="value.else[else_key].popup" ng-change="conditionCtrl.conditionChange()">
                                                    <option value="">Select Popup</option>
                                                    <option ng-repeat="(input_key, input_value) in conditionCtrl.popupList track by $index" value="<%input_value%>" > <%input_value%> </option>
                                                </select>
                                            </div>
                                            <a href="javascript:void(0)" class=" add_remove " ng-click="conditionCtrl.removeElse(key,else_key)"
                                               style="position: absolute; bottom: 0px; right: 10px;">
                                                <i class="admin-icons icons-minis-circle"></i>
                                            </a>
                                        </div>
                                        <hr ng-if="value.else.length > (else_key+1)">
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</div>
