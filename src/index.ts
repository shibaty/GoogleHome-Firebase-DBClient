'use strict';

import * as firebase from "firebase";
import * as request from "request";
import * as config from "./config";

// main_rountine
const mainRoutine = () => {
  console.log("Firebase DB Client is started.");

  firebase.initializeApp(config.firebase);

  const db = firebase.database();
  const ref = db.ref("electronics");

  let isFirst = true;

  ref.on('value', (dataSnapshot) => {
    if (isFirst) {
      // skip the first notification because it will definitely come.
      isFirst = false;
    } else {
      const target: string = dataSnapshot.child("target").val();
      const action: string = dataSnapshot.child("action").val();

      if (target && action) {
        console.log("target: " + target + " action: " + action);

        const options = {
          url: config.url,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          json: {
            "target": target,
            "action": action
          }        
        };

        request(options, (error, response, body) => {
          console.log(response.statusCode + " " + body);
        });
      }
    }
  });
};

mainRoutine();
