var express = require('express');
var router = express.Router();
var fs=require('fs');
/* GET home page. */
var firstTimer;
var irNfcTimer;
var SerialPort = require('serialport');
var rdport2 = new SerialPort('/dev/ttyO2');
var irNfctestRunning='false';
var flushIRNFCData;
var useIRNFCData = '';
var irNFCreadCount = 0;
/*
rdport2.on('data', function (data) {
       console.log('Data:', data);
       console.log('ASCII data: ', data.toString());
       if(irNfctestRunning === "false"){
	       console.log("TestCase Not Running So  Flushing Data:" , data);
		       flushIRNFCData = data.toString();
		       useIRNFCData = '';

       }
       else{
	       console.log("TestCase Running So Using Data:" , data);
	       if(irNFCreadCount <== 3){
	           if (irNFCreadCount == 0){
	           useIRNFCData=data.toString();
	        }
	       irNFCreadCount = irNFCreadCount + 1;
	       useIRNFCData=useIRNFCData + data.toString();
	       console.log("readCount ",irNFCreadCount);
	       }
	      else{
                      //already read 3 times so flushing
	               console.log("Already read 3 times so flushing");
		       flushIRNFCData = data.toString();

	      }
               
       }
 });
*/

router.all('/', function(req, res, next)
{
    var request = req.body.inputJsonStr;
    var jsonrequest=JSON.parse(request);
    var DUTID_TCID=jsonrequest.DUTID_TCID;
    var StepNum=jsonrequest.StepNum;
    console.log(DUTID_TCID + StepNum);
    var b = require('bonescript');
    function Success()
    {
        var response={"status":"success"};
        res.send(response);
    }
    function Failed()
    {
        var response={"status":"Failed"};
        res.send(response);
    }
    switch (DUTID_TCID)
    {
        case "M10_1" :
        {
            console.log("M10_1 selected");
                    console.log("Check if HDMI Cable is Connected");
                    Success();
                    break;

        }
        case "M10_2" :
        {
            console.log("M10_2 selected");
                    console.log("Push the power button");
                    console.log("Is the Power LED Turned Green?");
                    Success();
                    break;
        }
        case "CC_1":
        {
            console.log("CC_1 selected");
                    console.log("CC_1 step 1");
                    Success();
                    break;
        }
        case "CC_2":
        {
            console.log("CC_2 selected");
            console.log("Push the power button");
            console.log("Is the Power LED Turned Green?");
            Success();
            break;
        }
        case "IRNFC_1":
        {
	    useIRNFCData = "";
	    var irNfcTimeOut;
	    var irNfcTimeInt;
            console.log("IRNFC_1 selected");
	    irNfctestRunning = 'true';
        rdport2.on('data', function (data) {
          if(irNfctestRunning === "false"){
	       console.log("TestCase Not Running So  Flushing Data:" + data.toString());
		       flushIRNFCData = data.toString();
		       useIRNFCData = '';
       		}
       	else{
	    console.log("TestCase Running So Using Data:" + data.toString());
		useIRNFCData= useIRNFCData + (data.toString()).trim();
	 }
	});
	    //set 7 seconds timeout
	    irNfcTimeOut = setTimeout(function() {
	         irNfctestRunning = 'false';
		    console.log("irNfcTimeOut Triggered");
		    //clear Interval
		    clearInterval(irNfcTimeInt);
		 if(useIRNFCData !== ""){
                       console.log("Read IRNFC Data:" , useIRNFCData );
                       if(useIRNFCData.includes("*j;31#") && 
		       useIRNFCData.includes("*k;30#") &&
		       useIRNFCData.includes("*f;2;04:61:4B:A2:87:52:81"))
		       {
			       console.log("IR & NFC Data is there");
			       Success();
		       }else{
			       console.log("Received Invalid Data");
			       console.log(useIRNFCData);
			       Failed();
	         	}
		 }
		 else{
		    useIRNFCData=''
	            console.log("No IRNFC Data Read");
		    Failed();
	        }
	    },7000);
	    //Set test running status to True
		/*
            irNfcTimeInt = setInterval(function () {
            //if(irNFCreadCount == 3){ 
		  console.log("In irNfcTime Interval Runs");
		  //reset variables
		 if(useIRNFCData !== ""){
                 console.log("Found Data: " + useIRNFCData);
		 irNfctestRunning="false";
		 clearTimeout(irNfcTimeOut);
		 clearInterval(irNfcTimeInt);
                 Success();
	        }
	    //}
        },1000);
		*/
            break;
	}
        case "IRNFC_2":
    {
        console.log("IRNFC_2 selected");
        console.log("CC_1 step 1");
        Success();
        break;
    }
    case "IRNFC_3":
    {
        console.log("IRNFC_3 selected");
        console.log("CC_1 step 1");
        Success();
        break;
    }
    case "IRNFC_4":
        {
            console.log("IRNFC_4 selected");
            console.log("Push the power button");
            console.log("Is the Power LED Turned Green?");
            Success();
            break;
        }

    case "TRIAC_1":
    {
	    console.log("TRIAC_1 Start");
	    var outputtr1=b.HIGH;
	    var expectedInputtr1 =b.HIGH;
            var oPintr1="P9_16";
            var iPintr1="P9_42";
            b.pinMode(oPintr1,b.OUTPUT);
	    b.pinMode(iPintr1,b.INPUT);
            b.digitalWrite(oPintr1,outputtr1);
            console.log("after digitalWrite");
	    b.digitalRead(iPintr1,checkResultTRIAC1);

            firstTimer = setTimeout(function () {
            console.log("firstTimerTimeOutCalled");
            console.log("timeout cleared");
        },2000);

	    break;
    }

    case "ESR_1":
    {
	    console.log("ESR1 Start");
	    var output=b.HIGH;
	    var expectedInput =b.HIGH;
            var oPin="P9_14";
            var iPin="P9_27";
            b.pinMode(oPin,b.OUTPUT);
	    b.pinMode(iPin,b.INPUT);
            b.digitalWrite(oPin,output);
            console.log("after digitalWrite");
	    b.digitalRead(iPin,checkResultESR1);

            firstTimer = setTimeout(function () {
            console.log("Second function called");
            console.log("timeout cleared");
        },2000);

	    break;

	    /*
        console.log("ESR_1 selected");
        console.log("Just Sending Success");

        var firstTimer = setTimeout(function () {
            console.log("Second function called");
            console.log("timeout cleared");
        },2000);

        var secondTimer = setTimeout(function () {
            console.log("First function called");
            clearTimeout(firstTimer);
            Success();
        },1000);

//        Success();
        break;
	    */
    }
}

function checkResultESR1(result){
	                    console.log('Result = ' + result.value);
	                    var b2 = require('bonescript');
                            var oPin="P9_14";
	                    var expectedInput2 =b2.HIGH;
	                    console.log('Error = ' + result.err);
	                    if (result.value==expectedInput2) {
	                           console.log('ESR_1: Success');
                                   b2.digitalWrite(oPin,b2.LOW);
				   clearTimeout(firstTimer);
	                           Success();
                            }
	                    else{
		                  console.log('ESR_1: Fail');
                                   b2.digitalWrite(oPin,b2.LOW);
				  clearTimeout(firstTimer);
		                  Failed();
		            }
}

function checkResultTRIAC1(result){
	                    console.log('Triac1 Result = ' + result.value);
	                    var b2 = require('bonescript');
                            var oPin="P9_16";
	                    var expectedInput2 =b2.HIGH;
	                    console.log('Error = ' + result.err);
	                    if (result.value==expectedInput2) {
	                           console.log('ESR_1: Success');
                                   b2.digitalWrite(oPin,b2.LOW);
				   clearTimeout(firstTimer);
	                           Success();
                            }
	                    else{
		                  console.log('ESR_1: Fail');
                                   b2.digitalWrite(oPin,b2.LOW);
				  clearTimeout(firstTimer);
		                  Failed();
		            }
}
});

module.exports = router;
