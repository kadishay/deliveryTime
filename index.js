var fs = require('fs');
var restFile = fs.createWriteStream("restaurants.xls");
restFile.write("Name\tAvg Time\tTimes Tested\n");

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('slack.txt')
});

var lastTime = "00:00";
var timeLineReg = /\d\d\:\d\d$/;

var restaurants = {};

function nameTranslate(name) {

  name = name.replace("הגיע", "");
  name = name.trim();


  if (name.toLowerCase() == 'liv') {
    return 'ליב';
  } else if (name.toLowerCase() == 'noon') {
    return 'נון';
  } else if (name.toLowerCase() == 'vong') {
    return 'וונג';
  } else if (name.toLowerCase().indexOf('jars')!= -1) {
    return 'גארס אנד בולס';
  }  else if (name.toLowerCase() == 'japo') {
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
  } else if (name=="גארס") {
    return "גארס אנד בולס";
  } else if (name=="גארס אנד בול") {
    return "גארס אנד בולס";
  } else if (name=="גוטא") {
    return "גוטה";
  } else if (name=="ראמן" || name=="אירו ראמן") {
    return "הירו ראמן";
  } else if (name=="ארעיס" || name == "ערייס") {
    return "עראיס";
  } else if (name.indexOf("סוי") != -1 || name=="sui" || name.indexOf("סיו") != -1) {
    return "סוי ניתן תאי";
  } else if (name=="זהסושי") {
    return "זה סושי";
  } else if (name=="פאפאר" || name=="פפר" || name.indexOf("פפרס") != -1) {
    return "דה פפרס";
  } else if (name.indexOf("כרמליס") != -1) {
    return "כרמליס בייגל";
  } else if (name.indexOf("אושי") != -1) {
    return "אושי אושי";
  } else if (name.indexOf("פורקי") != -1) {
    return "פוקי";
  } else if (name.indexOf("בכור") != -1) {
    return "בכור את שושי";
  } else if (name.indexOf("קפנף") != -1) {
    return "קרנף";
  } else if (name.indexOf("Pasta via") != -1) {
    return "פסטה ויה";
  } else if (name.indexOf("שניצליה") != -1) {
    return "השניצליה";
  } else if (name.indexOf("jamilla") != -1) {
    return "גמילה";
  } else if (name.indexOf("הינדירה") != -1) {
    return "אינדירה";
  } else if (name.indexOf("Nini hatchi") != -1) {
    return "ניני האצי";
  } else if (name.indexOf("סושי מן") != -1) {
    return "סושי מן";
  } else if (name.indexOf("גירף") != -1) {
    return "גירף";
  } else if (name.indexOf("תאתא") != -1) {
    return "תאתא";
  } else if (name.indexOf("ניני") != -1) {
    return "ניני האצי";
  } else if (name.indexOf("פוקי") != -1) {
    return "פוקישופ";
  } else if (name.indexOf("מרקט פ") != -1) {
    return "מרקט פיש";
  } else if (name.indexOf("ניטן") != -1) {
    return "סוי ניתן תאי";
  } else if (name.indexOf("רייבר") != -1) {
    return "ריבר";
  } else if (name.indexOf("מינדו") != -1) {
    return "מידו";
  } else if (name.indexOf("שך סלט") != -1) {
    return "שף סלט";
  } else if (name.indexOf("מזנון") != -1) {
    return "מזנון";
  } else if (name.indexOf("מידו") != -1) {
    return "מידו";
  } else if (name.indexOf("האריס") != -1) {
    return "עראיס";
  }  else if (name.indexOf("זוזברה") != -1) {
    return "זוזוברה";
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
    //console.log(line.match(timeLineReg)[0].substring(0))
     lastTime = line.match(timeLineReg)[0];
  } else { //rest
      if (line.indexOf("?")==-1 && line != "" && line.indexOf("Reminder")==-1 
          && line.indexOf("10bis")==-1 && line.indexOf("#tlv")==-1 && line.indexOf("תפריט")==-1 
          && line.indexOf("אשראי")==-1 && line.indexOf("giphy")==-1 && line.indexOf("here")==-1 
          && line.indexOf("#tech-toha-lunch")==-1 && line.toLocaleLowerCase().indexOf("lol")==-1 && line.indexOf("pray")==-1 
          && line.indexOf("channel")==-1 && line.indexOf("ordered")==-1 && line.indexOf("להזדכות")==-1 
          && line.indexOf("what")==-1 && line.indexOf(".jpg")==-1 && line.indexOf("@")==-1 
          && line.toLocaleLowerCase().indexOf("thanks")==-1 && line.indexOf("nexhebv")==-1) { //not question
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
    if (item.occurances>=2) {
      console.log("Restaurant: " + item.restaurant + " / Arrives on: " + item.avrageTime + " / Times tested: " + item.occurances);
      restFile.write(item.restaurant+"\t"+item.avrageTime+"\t"+item.occurances+"\n");
    }
  })
});
//.split("").reverse().join("")

