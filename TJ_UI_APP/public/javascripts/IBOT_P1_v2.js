var modal1 = document.getElementById('myModal1');
var modal = document.getElementById('SettingsModalID');
var modal2 = document.getElementById('myModal2');
var jigtype = document.getElementById('TestJigSelectList');
var producttype = document.getElementById('producttype');
var testModeOption = document.getElementById('testModeOption');

var testMode = "manual"; //default to auto testing mode
var testCaseData;
var testJigData;
var testJigList;
//var TestJigLists;
var productType;
var LoadedTestCase;
var PreviousTestcase;
var PreviousTestCaseButtonId;
var testResultSummary={TotalCnt:0,TestedCnt:0,SuccessCnt:0,FailCnt:0};
var testedTestCases=[];
var testResultDetails=
    {
        "objTestCaseResults": [],
        "TEST_RUN_ID":"9999999",
        "DUT_NUMBER": "DUT_NUMBER",
        "DUT_HW_VER": "XX:YY",
        "DUT_SW_VER": "PP:QQ",
        "DUT_NM": "SHORTNM",
        "SN":"XXXXXXX",
        "HW_VER":"XX:XX",
        "SW_VER":"XX:XX",
        "MFGDT":"000000,030118",
        "FIXTURE_TYPE_ID":"01",
      //  "TESTCASE_FILE_NM":"TestCaseFileName",
        "TEST_START_TS":"STARTTIMESTAMP",
        "TEST_END_TS":"ENDTIMESTAMP",
        "TEST_RESULT": "SUCCESS/FAIL",
        "TOTAL_CNT":testResultSummary.TotalCnt,
        "TESTED_CNT": testResultSummary.TestedCnt,
        "TS_SUCCESS_CNT": testResultSummary.SuccessCnt,
        "TS_FAIL_CNT":testResultSummary.FailCnt,
        "MANUFACTURER":"MANUFACTURER1",
        "PCB_NM":"PCBNAME"
    };
var testResultDetailsTemplate=
    {
        "objTestCaseResults": [],
        "TEST_RUN_ID":"9999999",
        "DUT_NUMBER": "DUT_NUMBER",
        "DUT_HW_VER": "XX:YY",
        "DUT_SW_VER": "PP:QQ",
        "DUT_NM": "SHORTNM",
        "SN":"XXXXXXX",
        "HW_VER":"XX:XX",
        "SW_VER":"XX:XX",
        "MFGDT":"000000,030118",
        "FIXTURE_TYPE_ID":"01",
        //"TESTCASE_FILE_NM":"TestCaseFileName",
        "TEST_START_TS":"STARTTIMESTAMP",
        "TEST_END_TS":"ENDTIMESTAMP",
        "TEST_RESULT": "SUCCESS/FAIL",
        "TOTAL_CNT":testResultSummary.TotalCnt,
        "TESTED_CNT": testResultSummary.TestedCnt,
        "TS_SUCCESS_CNT": testResultSummary.SuccessCnt,
        "TS_FAIL_CNT":testResultSummary.FailCnt,
        "MANUFACTURER":"MANUFACTURER1",
        "PCB_NM":"PCB_NM"
    };
function UpdateTestJigData()
{
    //Set TestJigType in the backend
    //LoadTestJigData
}


function checkIfAllCasesRan()
{
    var finalResult;
    if(testedTestCases.length===testCaseData.TestCases.length){
        //document.getElementById('TestCaseRunText').value="All test cases had ran";
        if (testResultSummary.SuccessCnt===testResultSummary.TotalCnt){
            finalResult="PASSED";
        }
        else{
            finalResult="FAILED";
        }
        document.getElementById('TestCasesFinalResult').value="Testing Completed  " + finalResult;
        document.getElementById('TestCasesFinalResult').style.display="block";
        var curDate = new Date();
        var endDateTime = curDate.getTime();
        //var curTimeStamp = curDate.getTime();
        testResultDetails.TEST_RESULT=finalResult;
        testResultDetails.TEST_END_TS=endDateTime;
        testResultDetails.TESTED_CNT=testResultSummary.TestedCnt;
        testResultDetails.TOTAL_CNT=testResultSummary.TotalCnt;
        testResultDetails.TS_SUCCESS_CNT=testResultSummary.SuccessCnt;
        testResultDetails.TS_FAIL_CNT=testResultSummary.FailCnt;
        //testResultDetails.objTestCaseResults = testResultDetail;
        //upload Final Results
        UploadTestResults();

            setTimeout(function(){
                //document.location.reload(true);
                LoadTestJigDataSync();
            },4000);

    }
}

function UpdateTestResults(testCaseId,result)
{
//update Result Summary & Details
    testResultSummary.TotalCnt=testResultSummary.TotalCnt+1;
   if (result == "success") {
        document.getElementById('TestCaseRunStatus').style.color="green";
        document.getElementById('TestCaseRunStatus').value = "SUCCESS";
    }
    else {
        document.getElementById('TestCaseRunStatus').style.color="red";
        document.getElementById('TestCaseRunStatus').value = "FAILED";
    }
    if (!testedTestCases.includes(testCaseId))
    {
        testedTestCases.push(testCaseId);
        for (var i = 0; i < testCaseData.TestCases.length; i++)
        {
            if (testCaseData.TestCases[i].TCID == testCaseId)
            {

                testResultSummary.TestedCnt=testResultSummary.TestedCnt+1;
                testResultDetails.objTestCaseResults[i].TEST_RUN_ID=9999999;
                testResultDetails.objTestCaseResults[i].TCID=LoadedTestCase.TCID;
                testResultDetails.objTestCaseResults[i].TCSHORTNM=LoadedTestCase.TCSHORTNM;
                testResultDetails.objTestCaseResults[i].DESC=LoadedTestCase.DESC;
                testResultDetails.objTestCaseResults[i].LAST_STATUS = result;
                testResultDetails.objTestCaseResults[i].TRY_CNT = 1;
                testResultDetails.objTestCaseResults[i].TD_FAIL_CNT = 0;
                if (result == "success") {
                    testResultDetails.objTestCaseResults[i].TD_SUCCESS_CNT = 1;
                    testResultSummary.SuccessCnt=testResultSummary.SuccessCnt+1;
                    document.getElementById('TestCaseRunStatus').style.color="green";
                    document.getElementById('TestCaseRunStatus').value = "SUCCESS";
                }
                else {
                    testResultDetails.objTestCaseResults[i].TD_FAIL_CNT = 1;
                    testResultSummary.FailCnt = testResultSummary.FailCnt + 1;
                    document.getElementById('TestCaseRunStatus').style.color = "red";
                    document.getElementById('TestCaseRunStatus').value = "FAILED";
                }


            }
        }
    }
    else
    {
        for (i = 0; i < testCaseData.TestCases.length; i++)
        {
            if (testCaseData.TestCases[i].TCID == testCaseId)
            {
                testResultDetails.objTestCaseResults[i].TEST_RUN_ID="9999999";
                testResultDetails.objTestCaseResults[i].TCID=LoadedTestCase.TCID;
                //testResultDetail.DETAILS[i].TCSHORTNM=LoadedTestCase.TCSHORTNM;
                testResultDetails.objTestCaseResults[i].DESC=LoadedTestCase.DESC;
                testResultDetails.objTestCaseResults[i].TRY_CNT = testResultDetails.objTestCaseResults[i].TRY_CNT + 1;
                if (result == "success") {
                    testResultDetails.objTestCaseResults[i].TD_SUCCESS_CNT = testResultDetails.objTestCaseResults[i].TD_SUCCESS_CNT+1;
                    if(testResultDetails.objTestCaseResults[i].LAST_STATUS=="failed") {
                        testResultSummary.SuccessCnt = testResultSummary.SuccessCnt + 1;
                        testResultSummary.FailCnt = testResultSummary.FailCnt - 1;
                    }
                }
                else {
                    testResultDetails.objTestCaseResults[i].TD_FAIL_CNT = testResultDetails.objTestCaseResults[i].TD_FAIL_CNT + 1;
                    if(testResultDetails.objTestCaseResults[i].LAST_STATUS=="success") {
                        testResultSummary.SuccessCnt = testResultSummary.SuccessCnt - 1;
                        testResultSummary.FailCnt = testResultSummary.FailCnt + 1;
                    }
                }
                testResultDetails.objTestCaseResults[i].LAST_STATUS = result;
            }
        }
    }
    console.log(testResultSummary);
    document.getElementById('tested_text_box').value=testResultSummary.TestedCnt;
    document.getElementById('success_text_box').value=testResultSummary.SuccessCnt;
    document.getElementById('fail_text_box').value=testResultSummary.FailCnt;
    checkIfAllCasesRan(); //this includes uploading results
}

function ResetScreen(){
    testResultDetails = testResultDetailsTemplate;
    document.getElementById('tested_text_box').value="";
    document.getElementById('success_text_box').value="";
    document.getElementById('fail_text_box').value="";
    document.getElementById('totalCasesTxtBox').value = "";
    //document.getElementById('TestCaseTitle').value="";
    document.getElementById('TestCaseRunText').value="";
    document.getElementById('TestCaseRunStatus').value="";
    document.getElementById('TestCaseRunInstruction').value = "";
    document.getElementById('TestCaseRunTimer').value = "";
    document.getElementById('TestCasesFinalResult').value = "";
    //Disable();
    console.log("Exiting ResetScreen");
}

function LoadTestJigData() {
    //Initialize Test Jig Data
    //Initialize Test Case Data
    initialize();
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:3001/LoadTestJigData_BE";
    //making a synchronous request here.
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function ()
    {
        if ((this.readyState == 4) && (this.status == 200))
        {
            //document.getElementById('tc').style.display='block';
            console.log("after getting response" + xhttp.responseText);
            var response=JSON.parse(this.responseText);
            if(response.status=="success") {

                testJigList=response.TestJigList;
                testJigData=response.TestJigData;
                testCaseData = response.TestCaseData;
                //Fill TestJig Details in to Results Detail.
                testResultDetails.DUT_NUMBER =testJigData.DUT_NUMBER;
                testResultDetails.DUT_HW_VER =testJigData.HW_VER;
                testResultDetails.DUT_SW_VER =testJigData.SW_VER;
                testResultDetails.DUT_NM =testJigData.DUT_NM;
                testResultDetails.PCB_NM =testJigData.DUT_NM;
                //testResultDetails.TESTCASE_FILE_NM =testJigData.TestCaseFile;
                for(i=0;i<testCaseData.TestCases.length;i++)
                {
                    testResultDetails.objTestCaseResults.push({});
                }
                console.log(testResultDetails.objTestCaseResults);

                var totalCases = Object.keys(testCaseData.TestCases).length;
                document.getElementById('TestJigType').value = testJigData.DUT_NM;
                document.getElementById('totalCasesTxtBox').value = totalCases;
                console.log(testCaseData.TestCases.length);

                document.getElementById("tc").style.display = "none";
                for(var i=0;i<testCaseData.TestCases.length;i++)
                {
                    var button = document.createElement("BUTTON");
                    var ButtonID=("_"+ i);
                    document.getElementById('tc').appendChild(button).setAttribute("id",ButtonID);
                    button.innerText=testCaseData.TestCases[i].TCSHORTNM;
                    testCaseData.TestCases[i].UILabelID=ButtonID;
                    button.onclick= function()
                    {
                        var ClickedBtnID=event.srcElement.id;
                        var j=ClickedBtnID.slice(1);
                        console.log(j);
                        LoadTestCase(testCaseData.TestCases[j].TCID,testCaseData.TestCases[j].UILabelID);
                    }
                }
                LoadTestCase(testCaseData.TestCases[0].TCID,testCaseData.TestCases[0].UILabelID);
                EnableOnLoad();

            }
            else
            {
                var error=response.error;
                document.getElementById('TestJigType').value = error;
            }
        }
    };
    xhttp.send();
}

function LoadTestJigDataSync() {
    //Initialize Test Jig Data
    Disable() ;//disable all clickable elements
    initialize();
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:3001/LoadTestJigData_BE";
    //making a synchronous request here.
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
    console.log("after getting response" + xhttp.responseText);
    var response = JSON.parse(xhttp.responseText);
    if (response.status == "success") {
        testJigList = response.TestJigList;
        testJigData = response.TestJigData;
        testCaseData = response.TestCaseData;
        //Fill TestJig Details in to Results Detail.
        testResultDetails.DUT_NUMBER = testJigData.DUT_NUMBER;
        testResultDetails.DUT_HW_VER = testJigData.HW_VER;
        testResultDetails.DUT_SW_VER = testJigData.SW_VER;
        testResultDetails.DUT_NM = testJigData.DUT_NM;
        //testResultDetails.TESTCASE_FILE_NM = testJigData.TestCaseFile;
        for (i = 0; i < testCaseData.TestCases.length; i++) {
            testResultDetails.objTestCaseResults.push({});
        }
        console.log(testResultDetails.objTestCaseResults);
        var totalCases = Object.keys(testCaseData.TestCases).length;
        document.getElementById('TestJigType').value = testJigData.DUT_NM;
        document.getElementById('totalCasesTxtBox').value = totalCases;
        console.log(testCaseData.TestCases.length);
        document.getElementById("tc").style.display = "none";
        for (var i = 0; i < testCaseData.TestCases.length; i++) {
            var button = document.createElement("BUTTON");
            var ButtonID = ("_" + i);
            document.getElementById('tc').appendChild(button).setAttribute("id", ButtonID);
            button.innerText = testCaseData.TestCases[i].TCSHORTNM;
            testCaseData.TestCases[i].UILabelID = ButtonID;
            button.onclick = function () {
                var ClickedBtnID = event.srcElement.id;
                var j = ClickedBtnID.slice(1);
                console.log(j);
                LoadTestCase(testCaseData.TestCases[j].TCID, testCaseData.TestCases[j].UILabelID);
            }
        }
        LoadTestCase(testCaseData.TestCases[0].TCID, testCaseData.TestCases[0].UILabelID);
        EnableOnLoad();
    }
}

function ReloadTestJigData(TestJigType)
{
    //Set TestJigType in the backend
    //LoadTestJigData
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:3001/LoadTestJigData_BE/Reload_BE";
    xhttp.open("POST", url, false);
    var request={"TestJigType":TestJigType};
    var params = JSON.stringify(request);
    console.log(params);
    var params = "inputJsonStr" + "=" + params;
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
    console.log("after getting response" + xhttp.responseText);
    var response=JSON.parse(xhttp.responseText);
    if(response.success=="success")
    {
        //document.location.reload(true);
        LoadTestJigDataSync();
    }
    /*
    xhttp.onreadystatechange = function () {
        if ((this.readyState == 4) && (this.status == 200)){
            console.log("after getting response" + xhttp.responseText);
            var response=JSON.parse(this.responseText);
            testJigData=response.TestJigData;
            if(response.success=="success") {
                LoadTestJigDataSync();
            }
            }

    };
    xhttp.send(params);
    */

}

function nextTestCase()
{
    var NextTestcase;
    for(i=0;i<testCaseData.TestCases.length;i++)
    {
        if(testCaseData.TestCases[i].TCID==LoadedTestCase.TCID)
        {
            NextTestcase=testCaseData.TestCases[i+1];
            console.log(NextTestcase);
        }
    }
    LoadTestCase(NextTestcase.TCID,NextTestcase.UILabelID);
}

function initialize()
{
    ResetScreen();
    //Initialize Test Case Data
    //Reset Test Result Details
    testResultDetails = testResultDetailsTemplate;
    testResultSummary={TotalCnt:0,TestedCnt:0,SuccessCnt:0,FailCnt:0};
    //document.getElementById('tc').style.display='block';
    testedTestCases=[];

}
function retryTestCase()
{
    LoadTestCase(LoadedTestCase.TCID,LoadedTestCase.UILabelID);
    RunTestCase(LoadedTestCase.TCID,LoadedTestCase.Steps[0].StepNumber);
}
function LoadTestCase(tcid,id)
{
document.getElementById('TestCaseRunStatus').value = "";
    document.getElementById('TestCasesFinalResult').style.display="none";
    if(PreviousTestcase==undefined){}
    else
    document.getElementById(PreviousTestCaseButtonId).style.background="blue";
    for(i=0;i<testCaseData.TestCases.length;i++)
    {
        if (tcid == testCaseData.TestCases[i].TCID)
        {
            LoadedTestCase=testCaseData.TestCases[i];
            LoadedTestCase.TCStatus="loaded";
            LoadedTestCase.TCStartTime="";
            LoadedTestCase.TCEndTime="";
            LoadedTestCase.NumberOfSteps="";
            LoadedTestCase.LastRunStep="";

            PreviousTestcase=LoadedTestCase;
            PreviousTestCaseButtonId=id;
            document.getElementById('TestCaseTitle').value = "TCID:"+LoadedTestCase.TCID +"   "+ LoadedTestCase.TCSHORTNM;
            //document.getElementById('testcase_nm').value = LoadedTestCase.TCSHORTNM;
            document.getElementById('TestCaseRunText').value = LoadedTestCase.DESC;
            document.getElementById(id).style.background="orange";
            document.getElementById(id).innerText=LoadedTestCase.TCSHORTNM;
        }
    }
}

function RunTestCase(tcid,StepNum)
{
    console.log(tcid);
    var tciModal = document.getElementById('TestcasesModalId');
    var xhttp;
    var url = "http://localhost:3001/RunTestCase_BE_stub";
    var response;
    var result;
    LoadedTestCase.TCStartTime = x;
    console.log(LoadedTestCase);
    Disable();
    var DUTID_TCID = testCaseData.DUT + "_" + tcid;
    var request =
        {
            DUTID_TCID: DUTID_TCID, StepNum: StepNum
        };
    var params = JSON.stringify(request);
    params = "inputJsonStr" + "=" + params;
    console.log(params);
    switch (DUTID_TCID)
    {
        case "M10_1" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_2" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_3" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_4" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_5" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_6" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_7" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_8" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "M10_9" :
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;

        case "CC_1":
            console.log("CC_1 selected");
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "CC_2":

            console.log("CC_2 step 1");
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();

            console.log(testResultSummary);
            Enable();
            break;

        case "FNFC_1":
         console.log("FNFC TC1 selected");
         console.log("Yes going through new logic");
         //document.getElementById('TestCaseRunStatus').style.display="none";
         document.getElementById('TestCaseRunInstruction').style.display="block";
         document.getElementById('TestCaseRunInstruction').style.color="blue";
	     document.getElementById('TestCaseRunInstruction').value = "Place TestStrip on Filter NFC Sensor";
	     var fnfctimerCount = 10;
	     document.getElementById('TestCaseRunTimer').style.display="block";
	     document.getElementById('TestCaseRunTimer').style.color="orange";
	     document.getElementById('TestCaseRunTimer').value="";
	     var fnfccountDown = setInterval(function () {
	     document.getElementById('TestCaseRunTimer').value = fnfctimerCount;
	     fnfctimerCount = fnfctimerCount - 1;
	     console.log("Counting down :" + fnfctimerCount);

         }, 1000);
          xhttp = new XMLHttpRequest();
         xhttp.open("POST", url, true);
         xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         xhttp.onreadystatechange = function ()
         {

            if ((this.readyState == 4) ) {
                    if(this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log("after getting response" + xhttp.responseText);
                    var fnfcresult = response.status;
                        }else {
                       fnfcresult="failed";
										                    }
                   clearInterval(fnfccountDown);
                   console.log(fnfccountDown);
                   console.log("after clearInterval");
                    console.log("TestCase: " + tcid);
                 document.getElementById('TestCaseRunInstruction').style.display="none";
                  document.getElementById('TestCaseRunTimer').style.display="none";
                 //document.getElementById('TestCaseRunStatus').style.display="block";
                  UpdateTestResults(tcid,fnfcresult);
                  //checkIfAllCasesRan();

               console.log(testResultSummary);
                Enable();
                }
        };
        xhttp.send(params);
       break;
      case "IRNFC_1":
         console.log("IRNFC TC1 selected");
         console.log("Yes going through new logic");
         //document.getElementById('TestCaseRunStatus').style.display="none";
         document.getElementById('TestCaseRunInstruction').style.display="block";
	    document.getElementById('TestCaseRunInstruction').style.color="blue";
	    document.getElementById('TestCaseRunInstruction').value = "Place TestStrip on IRNFC Sensor and remove it";
	    var timerCount = 10;
	    document.getElementById('TestCaseRunTimer').style.display="block";
	    document.getElementById('TestCaseRunTimer').style.color="orange";
	    document.getElementById('TestCaseRunTimer').value="";
	     countDown = setInterval(function () {
	    document.getElementById('TestCaseRunTimer').value = timerCount;
	    timerCount = timerCount - 1;
	    console.log("Counting down :" + timerCount);

            }, 1000);
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.onreadystatechange = function ()
            {

                if ((this.readyState == 4) ) {
                    if(this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log("after getting response" + xhttp.responseText);
                   var result = response.status;
                        }else {
                       result="failed";
										                    }
                   clearInterval(countDown);
                   console.log(countDown);
                   console.log("after clearInterval");
                    console.log("TestCase: " + tcid);
                    document.getElementById('TestCaseRunInstruction').style.display="none";
                    document.getElementById('TestCaseRunTimer').style.display="none";
                    document.getElementById('TestCaseRunStatus').style.display="block";
                    UpdateTestResults(tcid,result);
                    //checkIfAllCasesRan();
                    console.log(testResultSummary);
                    Enable();
                }
            };
            xhttp.send(params);
            break;
        case "IRNFC_2":
            console.log("IRNFC TC2 selected");
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "IRNFC_3":
            console.log("IRNFC TC3 selected");
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "IRNFC_4":
            console.log("IRNFC TC3 selected");
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response=JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            //checkIfAllCasesRan();
            console.log(testResultSummary);
            Enable();
            break;
        case "ESR_1":
            console.log("Running Test Case ESR_1");
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "TRIAC_1":
            console.log("Running Test Case TRIAC_1");
            xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_1":
            console.log("running testcase HUL1_1");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_2":
            console.log("running testcase HUL1_2");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_3":
            console.log("running testcase HUL1_3");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_4":
            console.log("running testcase HUL1_4");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_5":
            console.log("running testcase HUL1_5");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_6":
            console.log("running testcase HUL1_6");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_7":
            console.log("running testcase HUL1_7");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_8":
            console.log("running testcase HUL1_8");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_9":
            console.log("running testcase HUL1_9");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_10":
            console.log("running testcase HUL1_10");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_11":
            console.log("running testcase HUL1_11");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_12":
            console.log("running testcase HUL1_12");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_13":
            console.log("running testcase HUL1_13");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_14":
            console.log("running testcase HUL1_14");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_15":
            console.log("running testcase HUL1_15");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_16":
            console.log("running testcase HUL1_16");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_17":
            console.log("running testcase HUL1_17");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_18":
            console.log("running testcase HUL1_18");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_19":
            console.log("running testcase HUL1_19");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_20":
            console.log("running testcase HUL1_20");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_21":
            console.log("running testcase HUL1_21");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_22":
            console.log("running testcase HUL1_22");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_23":
            console.log("running testcase HUL1_23");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_24":
            console.log("running testcase HUL1_24");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL1_25":
            console.log("running testcase HUL1_25");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_1":
            console.log("running testcase HUL2_1");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_2":
            console.log("running testcase HUL2_2");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_3":
            console.log("running testcase HUL2_3");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_4":
            console.log("running testcase HUL2_4");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_5":
            console.log("running testcase HUL2_5");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_6":
            console.log("running testcase HUL2_6");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_7":
            console.log("running testcase HUL2_7");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_8":
            console.log("running testcase HUL2_8");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
        case "HUL2_9":
            console.log("running testcase HUL2_9");
            xhttp=new XMLHttpRequest();
            xhttp.open("POST",url,false);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            console.log("after getting response" + xhttp.responseText);
            response = JSON.parse(xhttp.responseText);
            result=response.status;
            UpdateTestResults(tcid,result);
            Enable();
            break;
}
    if(testMode==="auto"){
        nextTestCase();
        RunTestCase(LoadedTestCase.TCID,LoadedTestCase.Steps[0].StepNumber);
    }
}
function Disable() 
{
    document.getElementById('start_icon').style.pointerEvents = "none";
    document.getElementById('next_icon').style.pointerEvents = "none";
    document.getElementById('retry_icon').style.pointerEvents = "none";
    document.getElementById('setting_icon').style.pointerEvents = "none";
    document.getElementById('reset').style.pointerEvents = "none";
    document.getElementById('view_results').style.pointerEvents = "none";
    document.getElementById('scanner_image').style.pointerEvents = "none";
}
function Enable()
{
    document.getElementById('start_icon').style.pointerEvents = "auto";
    document.getElementById('next_icon').style.pointerEvents = "auto";
    document.getElementById('retry_icon').style.pointerEvents = "auto";
    document.getElementById('setting_icon').style.pointerEvents = "auto";
    document.getElementById('reset').style.pointerEvents = "auto";
    document.getElementById('view_results').style.pointerEvents = "auto";
    document.getElementById('scanner_image').style.pointerEvents = "auto";
}

function EnableOnLoad()
{
    document.getElementById('setting_icon').style.pointerEvents = "auto";
    document.getElementById('reset').style.pointerEvents = "auto";
    document.getElementById('scanner_image').style.pointerEvents = "auto";
    document.getElementById('BoardDetail').readOnly=false;
    document.getElementById('BoardDetail').focus();
    document.getElementById('BoardDetail').value="";

}
    /*var xhttp = new XMLHttpRequest();
    var url = "http://localhost:3001/RunTestCase_BE";
    var request =
        {
            DUTID_TCID:DUTID_TCID,StepNum:StepNum
        };
    var params = JSON.stringify(request);
    console.log(params);
    var params = "inputJsonStr" + "=" + params;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function ()
    {
        if ((this.readyState == 4) && (this.status == 200))
        {
            console.log("after getting response" + xhttp.responseText);
            var status=JSON.parse(this.responseText);
            LoadedTestCase.TCEndTime=x;
            attempts=attempts+1;
                if (!tested.includes(request.testcase_id)) {
                    tested.push(request.testcase_id);
                    if(status.status=="success")
                    {
                        success = success + 1;
                        //document.getElementById('message').innerHTML=current_TC +
                        //    "  tested successfully enter next button to test next testcase";
                        document.getElementById('success_text_box').value=success;
                    }
                    else
                    {
                        //document.getElementById('message').innerHTML=current_TC +
                         //   "  testing failed click on retry icon to retest or click on next icon to test next testcase";
                        failed=failed+1;
                        document.getElementById('fail_text_box').value=failed;
                    }
                    document.getElementById('tested_text_box').value=tested.length;
                }
            console.log(success);
            console.log(failed);
            console.log(tested.length);
            console.log(attempts);

           // document.getElementById('tested_text_box').value=tested;
            document.getElementById('retry_icon').style.pointerEvents="auto";
            document.getElementById('next_icon').style.pointerEvents="auto";
            document.getElementById('start_icon').style.pointerEvents="none";
        }
    };
    xhttp.send(params);
}*/
    function ReloadTestJigList(producttype) {
        var xhttp = new XMLHttpRequest();
        var url = "http://localhost:3001/LoadTestJigData_BE/ReloadProductType_BE";
        xhttp.open("POST", url, false);
        var request={"ProductType":producttype};
        var params = JSON.stringify(request);
        console.log(params);
        var params = "inputJsonStr" + "=" + params;
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);
        console.log("after getting response" + xhttp.responseText);
        var response=JSON.parse(xhttp.responseText);
        if(response.result=="success")
        {
           // document.location.reload(true);
            LoadTestJigDataSync();
        }
        console.log(testJigList);
        //TO Update Form Dropdown List for TestJig List
        jigtype.innerHTML = '<option>' + "SelectJigType" + '</option>';
        for (var i = 0; i < testJigList.TestJigList.length; i++) {
            jigtype.innerHTML = jigtype.innerHTML +
                '<option value="' + testJigList.TestJigList[i]['DUT_ID'] + '">' +
                testJigList.TestJigList[i]['DUT_ID'] + '</option>';
        }
    }
function DisplaySettingsModal()
{
    modal.style.display = "block";
    jigtype.innerHTML="";

    jigtype.innerHTML = '<option>' + "SelectJigType" + '</option>';
    for (var i = 0; i < testJigList.TestJigList.length; i++) {
        jigtype.innerHTML = jigtype.innerHTML +
            '<option value="' + testJigList.TestJigList[i]['DUT_ID'] + '">' +
            testJigList.TestJigList[i]['DUT_ID'] + '</option>';
    }

}

function setTestMode(selectedTestMode){
    testMode=selectedTestMode;
}

function closeBarcodeModal()
{
    modal1.style.display = "none";
}
function OKButtonForBarcode()
{
    modal1.style.display = "none";
}

function closeViewResultsModal()
{
    modal2.style.display = "none";
}
function closeSettingsModal()
{
    modal.style.display = "none";
}

function readBarCode(barCodeText){
    console.log(barCodeText);
    document.getElementById('BoardDetail').value=barCodeText;
    var SN=barCodeText;
    modal1.style.display="none";
    setBoardDetails(barCodeText);
}

function setBoardDetails(boardDetail)
{
    console.log("In Set Board Detail");
    document.getElementById('BoardDetail').readOnly="true";
    document.getElementById("start_icon").style.pointerEvents="auto";
    document.getElementById('next_icon').style.pointerEvents="auto";
    var curDate = new Date();
    var curTimeStamp = curDate.getTime();
    var startDateTime = curTimeStamp;
    testResultDetails.SN =boardDetail;
    testResultDetails.TEST_START_TS=startDateTime;

}
function ScanBarCode(){

    modal1.style.display = "block";
    var barcode="dmantztk20-01-181.12.2";
    var SN=barcode.slice(0,8);
    var MFGDT="000000,030118";
    //var MFGDT=barcode.substr(8,8);
    var HWver=barcode.substr(16,3);
    var SWver=barcode.substr(19,3);
    console.log(SN);
    console.log(MFGDT);
    console.log(HWver);
    console.log(SWver);

    document.getElementById("start_icon").style.pointerEvents="auto";
    document.getElementById('next_icon').style.pointerEvents="auto";
    //document.getElementById('scanner_image').style.pointerEvents="none";
}
var x = new Date();
function DisplayTimeIPInfo()
{
    var strcount;
    var dateTime = new Date();
    document.getElementById('date_time').innerHTML = dateTime.toLocaleString('en-IN', { timeZone: 'UTC' });
    DT=displayDateTime();
}
function displayDateTime()
{
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('DisplayTimeIPInfo()',refresh)
}
function reset() {
    /*
    document.getElementById("currently_tested_board").value = "";
    document.getElementById("case_text_box").value = "";
    document.getElementById("tested_text_box").value = "";
    document.getElementById("success_text_box").value = "";
    document.getElementById("fail_text_box").value = "";
    document.getElementById("inner_table").value = "";
    */
    document.location.reload(true);
    LoadTestJigDataSync();
}

function viewResults() {
    modal2.style.display = "block";
    var txt = "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" + "<b>RESULTS</b>";
    txt += "<div id='id'><table border='3' id='table'>" +
        "<tr id='tr1'><th id='th'>TID</th>" +
        "<th>TCSHORM</th>" +
        "<th id='th1'>DESC</th>" +
        "<th>LAST_STATUS</th></tr>";
    for (x in testResultDetails.objTestCaseResults) {
            txt += "<tr id='tr'><td>" + testResultDetails.objTestCaseResults[x].TCID + "</td>" +
                "<td>" + testResultDetails.objTestCaseResults[x].TCSHORTNM + "</td>" +
                "<td>" + testResultDetails.objTestCaseResults[x].DESC + "</td>" +
                "<td>" + testResultDetails.objTestCaseResults[x].LAST_STATUS + "</td>" +
                "</tr>";
    }
    txt += "</table></div>";
    document.getElementById("show1").innerHTML = txt;
    //modal2.innerHTML="";
}

function UploadTestResults()
{
    //modal2.style.display = "block";
    document.getElementById("uploaddata").innerHTML = "Uploading";
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:3001/ViewResults_BE";
    var request = JSON.stringify(testResultDetails);
    var params=request;
    //var params = JSON.stringify(request);
    console.log(params);
    var params = "inputJsonStr" + "=" + params;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
        if ((this.readyState == 4) && (this.status == 200)) {
            console.log("after getting response" + xhttp.responseText);
            var jsonresponse=JSON.parse(this.responseText);
                document.getElementById("uploaddata").innerHTML = jsonresponse.status;
        }
    };
    xhttp.send(params);
}
/*function nextTestcase()
{
    var current_TC=document.getElementById('testcase_id').value;
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:3001/nextTestcase_v2";
    var request =
        {
            testcase_id:current_TC
        };
    var params = JSON.stringify(request);
    console.log(params);
    var params = "inputJsonStr" + "=" + params;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function ()
    {
        if ((this.readyState == 4) && (this.status == 200))
        {
            console.log("after getting response" + xhttp.responseText);
            var jsonresponse=JSON.parse(this.responseText);
            var nextTestcase=jsonresponse.nexttestcase;
            document.getElementById('testcase_id').value=nextTestcase;
            //document.getElementById('retry_icon').style.pointerEvents="auto";
           // document.getElementById('next_icon').style.pointerEvents="auto";
           // document.getElementById('start_icon').style.pointerEvents="auto";
        }
    };
    xhttp.send(params);
}
*/
