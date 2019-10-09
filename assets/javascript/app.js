$(document).ready(function () {
    
    $( ".inner-switch" ).on("click", function() {
        if( $( "body" ).hasClass( "dark" )) {
          $( "body" ).removeClass( "dark" );
          $( ".inner-switch" ).text( "OFF" );
        } else {
          $( "body" ).addClass( "dark" );
          $( ".inner-switch" ).text( "ON" );
        }
    });

    // Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyBJQRyWQIreKvpRXBtEu60k3JIYyCvUicU",
        authDomain: "rps-game-86734.firebaseapp.com",
        databaseURL: "https://rps-game-86734.firebaseio.com",
        projectId: "rps-game-86734",
        storageBucket: "rps-game-86734.appspot.com",
        messagingSenderId: "204022287789",
        appId: "1:204022287789:web:f20d87b8747f6b3d7ba524",
        measurementId: "G-84WG0VZ41T"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    var database = firebase.database();
    // this variable holds ALL the database information
    var everything = [];

    // Function that pushing everything to the database and creates the table
    $("#submit").on("click", function (event) {
        
        event.preventDefault();

        // varibales that grab the values
        var trainName = $("#train-name").val().trim();
        var initialTime = $("#initial-time").val().trim();
        var frequency = $("#frequency").val().trim();
        var destination = $("#destination").val().trim();

        // Modal/Alert
        if ($("#train-name").val() === "" || $("#destination").val() === "" || $("#frequency").val() === "" || $("#initial-time").val() === "") {
            swal ("Hold up..", "Please fill out ALL the information", "error", {
                buttons: false,
                timer: 3000,
            });
            event.preventDefault();

            return false;
        }

        // pushes things into Firebase
        database.ref().push({

            trainName: trainName,
            initialTime: initialTime,
            frequency: frequency,
            destination: destination

        });

        // Clears the input fields
        $('#train-name').val("");
        $('#destination').val("");
        $('#initial-time').val("");
        $('#frequency').val("");

    });

    // Retrieves the information from firebase and pushes them into an array
    database.ref().on("child_added", function(snapshot) {

        var snapVal = snapshot.val();
        everything.push(snapVal);

        var tbodyId = $("#trains");
        // prevents the snapshot from being appended twice
        tbodyId.empty();

        var currentTime = moment().format('HH:mm');

        for (var i = 0; i < everything.length; i++) {

            var initialTimeConverted = moment(everything[i].initialTime, "HH:mm").subtract(1, 'year');

            var difference = moment().diff(moment(initialTimeConverted), "minutes");

            var remainder = difference % everything[i].frequency;

            var minutesUntil = everything[i].frequency - remainder;

            var nextTrain = moment(currentTime, 'HH:mm').add(minutesUntil, 'minutes');

            nextTrain = nextTrain.format('HH:mm');

            var name = $("<td class='table-hover'>").text(everything[i].trainName);
            var dest = $("<td>").text(everything[i].destination);
            var freq = $("<td>").text(everything[i].frequency + " mins");
            var next = $("<td>").text(nextTrain);
            var mins = $("<td>").text(minutesUntil + " mins");
            
            var train = $("<tr>").append(name, dest, freq, next, mins);
            tbodyId.append(train);

        };

    });
    
});

// this still needs some more work to removed things from firebase with a button

// $('#remove').on('click', function () {

//     ref = new Firebase("myfirebase.com")
//     ref.child(everything).remove()

//     // var adaRef = firebase.database().ref('users/ada');
//     // adaRef.remove()
//     .then(function() {
//         console.log("Remove succeeded.")
//     })
//     .catch(function(error) {
//         console.log("Remove failed: " + error.message)
//     });
// })
