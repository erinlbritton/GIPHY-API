$(document).ready(function() {

    var topics = ["Maru","Neko Atsume","Pusheen","Lil Bub","Keyboard Cat","Grumpy Cat","Colonel Meow","Didga"];

    var validColors = ["lightblue","lawngreen","deeppink","crimson","red","coral","orange","yellow","green","darkgoldenrod","dodgerblue","blue","purple","indigo","brown","grey","black","white"];
    var validColorsWhite = ["deeppink","crimson","red","coral","orange","green","darkgoldenrod","dodgerblue","blue","purple","indigo","brown","grey","black"];
    var validColorsBlack = ["lightblue","lawngreen","white", "yellow"];

// Function to render buttons
    function renderButtons() {
    // For each element of the topics array
        $.each(topics, function(i) {
        // Select a random color for the button background
            var randomColor = validColors[Math.floor(Math.random()*validColors.length)];
        // If the color needs black text, render the button with black text
            if (validColorsBlack.indexOf(randomColor) != -1) {
                $("#buttons").append(`<button class="btn btn-default btn-space btn-call" style="background-color: ${randomColor}; color: dimgrey;" data-value="${topics[i]}">${topics[i]}</button>`);
        // If the color needs white text, render the button with white text
            } else if (validColorsWhite.indexOf(randomColor) != -1) {
                $("#buttons").append(`<button class="btn btn-default btn-space btn-call" style="background-color: ${randomColor}; color: white;" data-value="${topics[i]}">${topics[i]}</button>`);
            }
        });
    // Also select and assign a random color to the plus sign on the input form group
        var randomColor = validColors[Math.floor(Math.random()*validColors.length)];
        $("#addBtn").html(`<span class="glyphicon glyphicon-plus" style="color: ${randomColor};" aria-hidden="true"></span>`);
    };

// Click event to add a new button to the button group
    $("#addBtn").on("click", function() {
    // Grab text from input
        var newTopic = $("#btnText").val().trim();
    // If the text isn't already in the array or blank, add it to the end
        if ((topics.indexOf(newTopic) === -1) && (newTopic != "")) {
            topics.push(newTopic);    
        }
    // Empty out existing buttons
        $("#buttons").empty();
    // Reload buttons (including new button generated above)
        renderButtons();
    });

// Click event to make AJAX call based on button click
    $("#buttons").on("click", ".btn-call", function() {
    // Clear out existing images
        $("#images").html("");
    // Grab data-value from clicked button
        var value = $(this).attr("data-value");
    // Assign the search term to the giphy api url to return 10 gifs rated pg or under  
        var queryURL = `https://api.giphy.com/v1/gifs/search?q=${value}&api_key=4vAw715MqP3CoeVIoj5T8npyNOUo90Ga&limit=10&rating=pg`;
  
    // Establishing an AJAX call to queryURL 
        $.ajax({
          url: queryURL,
          method: "GET"
        })
  
    // Upon receipt of JSON object response, execute function to load 10 gifs
        .then(function(response) {
        // For each response sub-object
            $.each(response.data, function(i) {
        // Define the image tag with needed attributes for animation/still click action
            var img = $(`<img alt="${value} image" src="${response.data[i].images.fixed_height_still.url}" class="gif" data-state="still" data-still="${response.data[i].images.fixed_height_still.url}" data-animate="${response.data[i].images.fixed_height.url}" id="gif${i}">`);
        // Define a div tag to contain the rating information to display below the image
            var rating = $(`<div class="rating">Rating: ${response.data[i].rating.toUpperCase()}</div>`);
        // Display each image/rating combination in a bootstrap panel
            var panel = $("<div>");
                panel.attr("class", "panel panel-default");
            var panelBody = $("<div>");
                panelBody.attr("class", "panel-body");
            var panelFooter = $("<div>");
                panelFooter.attr("class", "panel-footer");
        // Assemble the panel components
            panelBody.append(img);
            panelFooter.append(rating);
            panel.append(panelBody);            
            panel.append(panelFooter);
        // Prepend each panel within the images id
            $("#images").prepend(panel);
            });
        });
      });

// Click event to animate a gif
      $(document).on("click", ".gif", function() {
    // Grab the data-state of the clicked gif
        var state = $(this).attr("data-state");
    // If still, switch to animate
        if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
    // If animated, switch to still
        } else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }
      });

// Render buttons outside of a click event so buttons will render when the page loads.
      renderButtons();
});