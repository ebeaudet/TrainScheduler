var trainName = "";
var destination = "";
var frequency = "";
var startTime = "";
var nextArrival = "";
var minutesAway = "";


var config = {
    apiKey: "AIzaSyCtq9wl6iEwdK_k0acalhqjcjyttbAstRA",
    authDomain: "trainscheduler-77671-90679.firebaseapp.com",
    databaseURL: "https://trainscheduler-77671-90679.firebaseio.com",
    projectId: "trainscheduler-77671",
    storageBucket: "trainscheduler-77671.appspot.com",
    messagingSenderId: "759007027846"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).on("click", "#btnSubmit", function (event) {
    
    event.preventDefault();
    // values from text-boxes
    trainName = $("#trainInput").val().trim();
    destination = $("#destInput").val().trim();
    frequency = $("#freqInput").val().trim();
    startTime = $("#startInput").val().trim();

    //clear the textboxes after submit
    $("#trainInput").val("");
    $("#destInput").val("");
    $("#freqInput").val("");
    $("#startInput").val("");

    //push the data to the database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        startTime: startTime,
    });
});

database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    var startTimeConvert = moment(snapshot.val().startTime, "HH:mm").subtract(1, "years");
    console.log(startTimeConvert);

    var currentTime = moment().format("HH:mm");
    console.log("Current Time:" + currentTime);

    timeDifference = moment().diff(moment(startTimeConvert), "minutes");
    console.log("Time Difference:" + timeDifference);

    var timeRemaining = timeDifference % snapshot.val().frequency;
    console.log(frequency);
    console.log("Time Remaining:" + timeRemaining);

    var minTilTrain = snapshot.val().frequency - timeRemaining;
    console.log("Minutes: " + minTilTrain);

    nextTrainArrival = moment().add(minTilTrain, "minutes");
    console.log("Next Train: " + moment(nextTrainArrival).format("hh:mm"));

    //create table row and tabledata
    var tableRow = $("<tr>");
    var tableData1 = $("<td>");
    tableData1.text(sv.trainName);
    var tableData2 = $("<td>");
    tableData2.text(sv.destination);
    var tableData3 = $("<td>");
    tableData3.text(sv.frequency);
    var tableData4 = $("<td>");
    tableData4.text(nextTrainArrival.format("hh:mm"));
    var tableData5 = $("<td>");
    tableData5.html(minTilTrain);

    //append the data to the to the table row
    tableRow.append(tableData1, tableData2, tableData3, tableData4, tableData5);
    $(".table").append(tableRow); 
}, function (error) {
    console.log("Errors: " + error);

});
 
