var fs = require('fs');
var restFile = fs.createWriteStream("restaurants.xls");
restFile.write("Name\tAvg Time\tTimes Tested\n");

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('slack.txt')
});

var lastTime = "00:00";
var timeLineReg = /\[\d\d\:\d\d\]$/;

var restaurants = {};

function nameTranslate(name) {


  if (name.toLowerCase() == 'liv') {
    return 'ליב';
  } else if (name.toLowerCase() == 'noon') {
    return 'נון';
  } else if (name.toLowerCase() == 'vong') {
    return 'וונג';
  } else if (name.toLowerCase() == 'japo') {
    return 'גאפו';
  } else if (name=="אורבן") {
    return "אורבן פוד";
  } else if (name=="בראדלי") {
    return "ברדלי";
  } else if (name=="גארז אנד בולז") {
    return "גארס אנד בולס";
  } else if (name=="וולפנייטס") {
    return "וולפנייט";
  } else if (name=="קופיבר") {
    return "קופי בר";
  } else if (name.toLowerCase() == "wok away") {
    return "ווק אוואי"
  } else if (name.toLowerCase() == "mido") {
    return "מידו"
  } else if (name.toLowerCase() == "yashka") {
    return "יאשקה"
  } else if (name.toLowerCase() == "giraffe") {
    return "גירף"
  } else if (name.toLowerCase() == "breadly") {
    return "ברדלי"
  } else if (name.toLowerCase() == "pokeshop") {
    return "פוקישופ"
  } else if (name=="גארז אנד בולס") {
    return "גארס אנד בולס";
  } else if (name=="גארז אנד בולז") {
    return "גארס אנד בולס";
  } else if (name=="גארס") {
    return "גארס אנד בולס";
  }

  name = name.replace(/׳/g, "");
  name = name.replace(/’/g, "");
  name = name.replace(/׳/g, "");
  name = name.replace(/׳/g, "");
  name = name.replace(/'/g, "");


  return name;
}

function getAverageTime(arr) {
  var num = arr.length;
  var sum = 0;
  arr.forEach((item)=>{
    var a = new Date();
    a.setHours(parseInt(item.split(":")[0]));
    a.setMinutes(parseInt(item.split(":")[1]));
    sum += a.getTime();
  });
  var result = new Date(sum/num);
  return result.getHours()+":"+result.getMinutes();
}

lineReader.on('line', function (line) {
  line = line.trim();
  if (timeLineReg.test(line)) { //time
     lastTime = line.match(timeLineReg)[0].substring(1).slice(0, -1);
  } else { //rest
      if (line.indexOf("?")==-1 && line != "" && line.indexOf("Reminder")==-1&& line.indexOf("10bis")==-1 && line.indexOf("#tlv")==-1 && line.indexOf("תפריט")==-1 && line.indexOf("אשראי")==-1 && line.indexOf("giphy")==-1 && line.indexOf("here")==-1) { //not question
        var name = nameTranslate(line);
        if (!restaurants[name]) { //first time
          restaurants[name] = {
            occurances: 0,
            times: []
          }
        }
        restaurants[name].occurances++;
        restaurants[name].times.push(lastTime);
      }
  }
 //console.log(restaurants);
});

lineReader.on('close', function(){
  //tranlate to array and sort by times + claculate avrage
  var arr = [];
  Object.keys(restaurants).forEach((key)=>{
    arr.push({
      restaurant: key,
      occurances: restaurants[key].occurances,
      times: restaurants[key].times
    });
  });

  arr.sort((a,b)=>{
    if (a.occurances < b.occurances) {
      return 1;
    } else if (a.occurances > b.occurances) {
      return -1;
    }
    return 0;
  });

  arr = arr.map((item)=>{
    return ({
      avrageTime: getAverageTime(item.times),
      restaurant: item.restaurant,
      occurances: item.occurances,
      times: item.times
    })
  });

  arr.forEach(item=>{
    if (item.occurances>=5) {
      console.log("Restaurant: " + item.restaurant + " / Arrives on: " + item.avrageTime + " / Times tested: " + item.occurances);
      restFile.write(item.restaurant+"\t"+item.avrageTime+"\t"+item.occurances+"\n");
    }
  })
});
//.split("").reverse().join("")

