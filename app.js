/* INSERT CODE HERE */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(9914, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/* 
  This is an endpoint that Intercom will POST HTTP request when the card needs to be initialized.
  This can happen when your teammate inserts the app into a conversation composer, Messenger home settings or User Message.
  Params sent from Intercom contains for example `card_creation` parameter that was formed by your `configure` response.
*/

// app.post("/initialize", (request, response) => {
//   const body = request.body;
//   console.log("body of intialise = ", body);
//   response.send({
//     canvas: {
//       content: {
//         components: [
//           {
//             type: "button",
//             label: "Submit Feedback Sheet!!!!",
//             style: "primary",
//             id: "url_button",
//             action: { type: "submit" }
//           }
//         ]
//       }
//     }
//   });
// });
var optiontoText = {};
for (var i = 1; i <= 5; i++) {
  var s = "option-" + i;
  optiontoText[s] = "you have selected " + i + " stars ";
}

var customerDetails = {};

app.post("/intercom/initialize", (request, response) => {
  const body = request.body;
  console.log("body of intialize = ", body);
  response.send({
    canvas: {
      content: {
        components: [
          {
            type: "single-select",
            id: "single-select-1",
            label: "Give Feedback",
            action: { type: "submit" },
            style: "primary",
            options: [
              {
                type: "option",
                id: "option-1",
                text: "1 🌟"
              },
              {
                type: "option",
                id: "option-2",
                text: "2 🌟"
              },
              {
                type: "option",
                id: "option-3",
                text: "3 🌟"
              },
              {
                type: "option",
                id: "option-4",
                text: "4 🌟 "
              },
              {
                type: "option",
                id: "option-5",
                text: "5 🌟"
              }
            ]
          }
        ]
      }
    }
  });
});

// app.post("/submit", (request, response) => {
//   const body = request.body;
//   console.log("body of submit = ", body);
//   var componentText = optiontoText[body["input_values"]["single-select-1"]];
//   customerDetails["email"] = body["customer"]["email"];
//   customerDetails["name"] = body["customer"]["name"];
//   customerDetails["phone"] = body["customer"]["phone"];
//   console.log("CustomerDetails = ", customerDetails);
//   response.send({
//     canvas: {
//       content: {
//         components: [
//           {
//             type: "text",
//             text:
//               "sorry for the inconvience click the below button to submit feedback",
//             style: "header",
//             align: "center"
//           },
//           {
//             type: "button",
//             id: "inbox-url-action",
//             label: "click here to fill the form",
//             style: "primary",
//             action: {
//               type: "url",
//               url: "https://tripetto.app/run/BBRXQW6XL3"
//             }
//           }
//         ]
//       }
//     }
//   });
// });

app.post("/intercom/submit2", (request, response) => {
  const body = request.body;
  console.log("body of submit2 = ", body);
  var componentText = optiontoText[body["input_values"]["single-select-1"]];

  customerDetails["email"] = body["customer"]["email"];
  customerDetails["name"] = body["customer"]["name"];
  customerDetails["phone"] = body["customer"]["phone"];
  customerDetails["user_id"] = body["customer"]["user_id"];

  console.log("CustomerDetails = ", customerDetails);
  
  response.send({
    canvas: {
      content: {
        components: [
          {
            type: "text",
            text:
              "sorry for the inconvience click the below button to submit feedback",
            style: "header",
            align: "center"
          },
          {
            type: "button",
            id: "inbox-sheet-action",
            label: "click here to fill the form",
            style: "primary",
            action: {
              type: "sheet",
              url: "https://api-beta.rupeek.co/rupeek-quick-2/intercom/sheetform"
            }
          }
        ]
      }
    }
  });
});

app.post("/intercom/sheetform", function(request, response) {

  var dataString =
  "?email=" +
  customerDetails["email"] +
  "&name=" +
  customerDetails["name"] +
  "&phone=" +
  customerDetails["phone"] +
  "&user_id=" + 
  customerDetails["user_id"];
  response.redirect("https://tripetto.app/run/BBRXQW6XL3" + dataString);
});

app.post("/sheet", (request, response) => {
  const body = request.body;
  console.log("body of sheet = ", body);
  response.send({
    canvas: {
      content: {
        components: [
          {
            type: "text",
            text: "you submitted the form",
            style: "header",
            align: "center"
          }
        ]
      }
    },
    event: { type: "completed" }
  });
});

app.post("/intercom/feedbackFormData", (request, response) => {
  const body = request.body;
  console.log("body of feedbackFormData = ", body);
  response.send({
    canvas: {
      content: {
        components: [
          {
            type: "text",
            text: "you have submitted the feedback",
            style: "header",
            align: "center"
          }
        ]
      }
    }
  });
});

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log("results = ",results);