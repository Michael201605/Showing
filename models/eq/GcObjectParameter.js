/**
 * Created by pi on 8/24/16.
 */
var Element = function () {

};
Element.prototype.Commands = {};
Element.prototype.HardwareIO = {};
Element.prototype.Information = {};
Element.prototype.Parameter = {};
Element.prototype.States = {};

var Unit = function () {

};
Unit.prototype.Commands = {};
Unit.prototype.Information = {};
Unit.prototype.Parameter = {};
Unit.prototype.States = {};


var BeltMonitor = function () {

};
BeltMonitor.prototype.Commands = {
    CmdFaultReset: false,
    CmdMonitoringEnable: false,
    CmdUsebyUnitIdent: '',
    CmdUsebyUnitType: ''
};
BeltMonitor.prototype.HardwareIO = {
    ValInput1: false
};
BeltMonitor.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};
BeltMonitor.prototype.Parameter = {
    ParAdrInput1: '',
    ParMonitoringTime: ''
};
BeltMonitor.prototype.States = {
    StaFaulted: '',
    StaHealty: ''
};


var FilterControl = function () {

};
FilterControl.prototype.Commands = {
    CmdEnable: false,
    CmdEnableIdling: false,
    CmdFaultReset: false,
    CmdInterlock: false,
    CmdManual: false,
    CmdService: false,
    CmdUseByUnitIdent: '',
    CmdUseByUnitType: ''
};
FilterControl.prototype.HardwareIO = {
    ValInput1: false,
    ValOutput1: false
};
FilterControl.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};
FilterControl.prototype.Parameter = {
    ParAdrInput1: '',
    ParAdrOutput1: '',
    ParRelatedToUnitIdent1: '',
    ParRelatedToUnitIdent2: '',
    ParRelatedToUnitIdent3: '',
    ParRelatedToUnitIdent4: '',
    ParRelatedToUnitType1: '',
    ParRelatedToUnitType2: '',
    ParRelatedToUnitType3: '',
    ParRelatedToUnitType4: '',
    ParTimeOut: '',
    ParWithInputFeedback: ''
};
FilterControl.prototype.States = {
    StaFault: false,
    StaStarted: false,
    StaStarting: false,
    StaStopped: false,
    StaStopping: false
};

var HighLevel = function () {

};
HighLevel.prototype.Commands = {
    CmdFaultReset: false,
    CmdUsebyUnitIdent: false,
    CmdUsebyUnitType: false
};

HighLevel.prototype.HardwareIO = {
    ValInput1: false,
    ValInput2: false
};
HighLevel.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};
HighLevel.prototype.Parameter = {
    ParAdrInput1: '',
    ParAdrInput2: '',
    ParCoverTime: '',
    ParUncoverTime: ''
};

HighLevel.prototype.States = {
    StaCover: false,
    StaCovered: false,
    StaFaulted: false,
    StaUncover: false,
    StaUncoverd: false
};


//=====================================

var SimpleMotor = function () {
    this.Commands = {
        CmdEnable: false,
        CmdEnableIdling: false,
        CmdFaultReset: false,
        CmdInterlock: false,
        CmdManual: false,
        CmdService: false,
        CmdUseByUnitIdent: '',
        CmdUseByUnitType: ''
    };
    this.HardwareIO = {
        ValInput1: false,
        ValOutput1: false
    };
    this.Information = {
        InfListIdent: '',
        InfType: ''
    };
    this.Parameter = {
        ParAdrInput1: '',
        ParAdrOutput1: '',
        ParRelatedToUnitIdent1: '',
        ParRelatedToUnitIdent2: '',
        ParRelatedToUnitIdent3: '',
        ParRelatedToUnitIdent4: '',
        ParRelatedToUnitType1: '',
        ParRelatedToUnitType2: '',
        ParRelatedToUnitType3: '',
        ParRelatedToUnitType4: '',
        ParTimeOut: ''
    };
    this.States = {
        StaFault: false,
        StaStarted: false,
        StaStarting: false,
        StaStopped: false,
        StaStopping: false
    };
};
SimpleMotor.prototype = {};

var SpeedMonitor = function () {

};

SpeedMonitor.prototype.Commands = {
    CmdFaultReset: false,
    CmdMonitoringEnable: false,
    CmdUsebyUnitIdent: '',
    CmdUsebyUnitType: ''
};

SpeedMonitor.prototype.HardwareIO = {
    ValInput1: false
};
SpeedMonitor.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};


SpeedMonitor.prototype.Parameter = {
    ParAdrInput1: '',
    ParMonitoringTime: ''
};

SpeedMonitor.prototype.States = {
    StaFaulted: false,
    StaHealty: false
};


var ValveOpenClose = function () {

};

ValveOpenClose.prototype.Commands = {
    CmdEnable: false,
    CmdEnableIdling: false,
    CmdFaultReset: false,
    CmdInterlock: false,
    CmdManual: false,
    CmdService: false,
    CmdUseByUnitIdent: '',
    CmdUseByUnitType: ''
};

ValveOpenClose.prototype.HardwareIO = {
    ValInput1: false,
    ValInput2: false,
    ValOutput1: false,
    ValOutput2: false
};
ValveOpenClose.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};


ValveOpenClose.prototype.Parameter = {
    ParAdrInput1: '',
    ParAdrInput2: '',
    ParAdrOutput1: '',
    ParAdrOutput2: '',
    ParRelatedToUnitIdent1: '',
    ParRelatedToUnitIdent2: '',
    ParRelatedToUnitIdent3: '',
    ParRelatedToUnitIdent4: '',
    ParRelatedToUnitType1: '',
    ParRelatedToUnitType2: '',
    ParRelatedToUnitType3: '',
    ParRelatedToUnitType4: '',
    ParTimeOut: ''
};

ValveOpenClose.prototype.States = {
    StaClosed: false,
    StaClosing: false,
    StaFault: false,
    StaOpened: false,
    StaOpening: false
};


var LBCA = function () {

};

LBCA.prototype.Commands = {
    CmdEnable: false,
    CmdEnableIdling: false,
    CmdFaultReset: false,
    CmdInterlock: false,
    CmdUseByUnitIdent: '',
    CmdUseByUnitType: ''

};

LBCA.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};


LBCA.prototype.Parameter = {
    ParIdelingTime: '',
    ParRelatedToUnitIdent1: '',
    ParRelatedToUnitIdent2: '',
    ParRelatedToUnitIdent3: '',
    ParRelatedToUnitIdent4: '',
    ParRelatedToUnitType1: '',
    ParRelatedToUnitType2: '',
    ParRelatedToUnitType3: '',
    ParRelatedToUnitType4: '',
    ParStartDelay: '',
    ParStartingTime: '',
    ParStopDelay: '',
    ParStoppingTime: '',
    ParWithOverflowFlap: false,
    ParWithSpeedMonitor: false

};

LBCA.prototype.States = {
    StaFault: false,
    StaIdeling: false,
    StaStarted: false,
    StaStarting: false,
    StaStopped: false,
    StaStopping: false
};

var LBEA = function () {

};

LBEA.prototype.Commands = {
    CmdEnable: false,
    CmdEnableIdling: false,
    CmdFaultReset: false,
    CmdInterlock: false,
    CmdUseByUnitIdent: '',
    CmdUseByUnitType: ''

};

LBEA.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};


LBEA.prototype.Parameter = {
    ParIdelingTime: '',
    ParRelatedToUnitIdent1: '',
    ParRelatedToUnitIdent2: '',
    ParRelatedToUnitIdent3: '',
    ParRelatedToUnitIdent4: '',
    ParRelatedToUnitType1: '',
    ParRelatedToUnitType2: '',
    ParRelatedToUnitType3: '',
    ParRelatedToUnitType4: '',
    ParStartDelay: '',
    ParStartingTime: '',
    ParStopDelay: '',
    ParStoppingTime: '',
    ParWithBeltMonitor1: false,
    ParWithBeltMonitor2: false,
    ParWithBeltMonitor3: false,
    ParWithBeltMonitor4: false,
    ParWithSpeedMonitor: false

};

LBEA.prototype.States = {
    StaFault: false,
    StaIdeling: false,
    StaStarted: false,
    StaStarting: false,
    StaStopped: false,
    StaStopping: false
};

var MVRW = function () {

};

MVRW.prototype.Commands = {
    CmdEnable: false,
    CmdEnableIdling: false,
    CmdFaultReset: false,
    CmdInterlock: false,
    CmdUseByUnitIdent: '',
    CmdUseByUnitType: ''

};

MVRW.prototype.Information = {
    InfListIdent: '',
    InfType: ''
};


MVRW.prototype.Parameter = {
    ParIdelingTime: '',
    ParRelatedToUnitIdent1: '',
    ParRelatedToUnitIdent2: '',
    ParRelatedToUnitIdent3: '',
    ParRelatedToUnitIdent4: '',
    ParRelatedToUnitType1: '',
    ParRelatedToUnitType2: '',
    ParRelatedToUnitType3: '',
    ParRelatedToUnitType4: '',
    ParStartDelay: '',
    ParStartingTime: '',
    ParStopDelay: '',
    ParStoppingTime: '',
    ParWithFilterControl: false

};

MVRW.prototype.States = {
    StaFault: false,
    StaIdeling: false,
    StaStarted: false,
    StaStarting: false,
    StaStopped: false,
    StaStopping: false
};

module.exports.Element = Element;
module.exports.Unit = Unit;
module.exports.BeltMonitor = BeltMonitor;
module.exports.FilterControl = FilterControl;
module.exports.HighLevel = HighLevel;
module.exports.SimpleMotor = SimpleMotor;
module.exports.SpeedMonitor = SpeedMonitor;
module.exports.ValveOpenClose = ValveOpenClose;
module.exports.LBCA = LBCA;
module.exports.LBEA = LBEA;
module.exports.MVRW = MVRW;