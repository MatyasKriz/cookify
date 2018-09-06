console.log('start!');

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// get rid of unnecessary comma
let soups = document.body.getElementsByClassName('soup')
for (var i = 0; i < soups.length; i++) {
  soups[i].innerHTML = soups[i].innerHTML.split('Menu na celý týden, naleznete zde.').join('Menu na celý týden naleznete zde.');
}

let faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
document.body.appendChild(faLink);

// function star(value, container) {
//   let radio = document.createElement('input');
//   radio.id = `star${value}b`;
//   radio.name = 'ratings';
//   radio.value = `${value}`; // maybe have to retype to string?
//   let label = document.createElement('label');
//   label.className = 'full'; // TODO: add shadow
//   label.htmlFor = radio.id;
//   label.title = `${value} stars`;
//
//   container.appendChild(radio);
//   container.appendChild(label);
// }

function stars(rating, dishHash) {
  var container = document.createElement('span');
  container.className = 'star-stack';
  container.innerHTML = '&nbsp;';
  for (var i = 1; i <= 5; i++) {
    // star(i, container);
    let star = document.createElement('i');
    let starState = rating - i + 1 > 0 ? 'filled' : 'empty';
    star.className = `fa fa-star ${starState} shadow`;
    let starRating = i;
    star.onclick = function() {
      // rating the dish
      $.get(`192.168.0.108:3000/api/v1/cookify/${dishHash}`, { rating: starRating });
    };
    container.appendChild(star);
  }

  return container;
}

function colorRating(rating) {
  switch (rating) {
    case 1:
      return 'midnightblue';
    case 2:
      return 'indianred';
    case 3:
      return 'goldenrod';
    case 4:
      return 'yellowgreen';
    case 5:
      return 'lime';
    default:
      return 'orchid';
  }
}

console.log("Before the fun starts.");
let names = document.getElementsByClassName('mname');
console.log("Before array mapping.");
let hashes = [];
for (var i = 0; i < names.length; i++) {
  let element = names[i];
  hashes.push(md5(element.innerHTML).substring(0, 20));
}
console.log(`Result hashes: ${hashes}`);

// get the ratings
var oReq = new XMLHttpRequest();

function transferComplete(evt) {
  console.log("The transfer is complete.");
}

function transferFailed(evt) {
  console.log("An error occurred while transferring the file.");
}

function transferCanceled(evt) {
  console.log("The transfer has been canceled by the user.");
}

oReq.upload.addEventListener("progress", updateProgress);
oReq.upload.addEventListener("load", transferComplete);
oReq.upload.addEventListener("error", transferFailed);
oReq.upload.addEventListener("abort", transferCanceled);

oReq.open("GET", "http://192.168.0.108:3000/api/v1/cookify/randomHash", true);
oReq.send();

// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://192.168.0.108:3000/api/v1/cookify/randomHash", true);
// xhr.onreadystatechange = function() {
//   if (xhr.readyState == 4) {
//     console.log(`Hallo: ${xhr.response}`);
//     // JSON.parse does not evaluate the attacker's scripts.
//     var res = JSON.parse(xhr.responseText);
//     console.log(`Got data: ${data}`);
//     let dishRatings = res.dishRatings;
//
//     for (var i = 0; i < names.length; i++) {
//       element = names[i];
//       let dishTuple = dishRatings[hashes[i]];
//       let [dishHash, dishRating] = dishTuple || [hashes[i], 0];
//       element.style.color = colorRating(dishRating);
//       insertAfter(stars(dishRating, dishHash), element);
//     }
//   }
// }
// xhr.send();
// $.get(
//   "http://192.168.0.108:3000/api/v1/cookify/randomHash",
//   function(data) {
//     console.log(`Got data: ${data}`);
//   }
// )

// $.post(
//     "http://192.168.0.108:3000/api/v1/cookify/",
//     { dishHashes: hashes },
//     function(data) {
//       console.log(`Got data: ${data}`);
//       let dishRatings = data.dishRatings;
//
//       for (var i = 0; i < names.length; i++) {
//         element = names[i];
//         let dishTuple = dishRatings[hashes[i]];
//         let [dishHash, dishRating] = dishTuple || [hashes[i], 0];
//         element.style.color = colorRating(dishRating);
//         insertAfter(stars(dishRating, dishHash), element);
//       }
//     },
//     "json");

console.log('end!');
