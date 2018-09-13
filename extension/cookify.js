console.log('start!');

function debug(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    return out;
}

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
      $.get(`https://cookify.internal.brightify.org/api/v1/cookify/${dishHash}?rating=${starRating}`,
      function(data) {
        console.log(`Got rating feedback: '${data.rating}' for dishHash '${dishHash}'`);
      });
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

let remindButton = document.createElement('button');
remindButton.innerHTML = 'Remind me';
remindButton.className = 'button toprightcorner';
remindButton.onclick = function() {
  console.log('Will remind you in an hour.');
  chrome.runtime.sendMessage({
    type: "notification",
    delay: 3600,
    options: {
      type: 'basic',
      iconUrl: chrome.extension.getURL('./icons/cookify-96.png'),
      title: 'Hello there!',
      message: 'Have you rated your Cookify dish yet?'
    }
  });
}
document.body.appendChild(remindButton);

$.post(
  "https://cookify.internal.brightify.org/api/v1/cookify/",
  $.param({ dishHashes: hashes }, true),
  function(data) {
    let dishRatingsArray = JSON.parse(data).dishRatings;

    // create a hash map from the array of tuples
    let dishRatings = dishRatingsArray.reduce(function(map, obj) {
      map[obj.dishHash] = obj.rating;
      return map;
    }, {});

    for (var i = 0; i < names.length; i++) {
      element = names[i];
      let dishHash = hashes[i];
      let dishRating = dishRatings[dishHash] || 0;
      element.style.color = colorRating(dishRating);
      insertAfter(stars(dishRating, dishHash), element);
    }
  },
  "text");

console.log('end!');
