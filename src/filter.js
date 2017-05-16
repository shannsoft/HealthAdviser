app.filter('getShortName', function () {
    return function (value) {
      if(value){
        var temp = angular.copy(value);
        temp = temp.split(" ");
        temp = temp[0].charAt(0)+temp[temp.length-1].charAt(0);
        return temp.toUpperCase();
      }
    };
});
app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("MM/DD/YYYY");
    }
  }
})
app.filter('yearMonth', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY MMM");
    }
  }
})
app.filter('dateYear', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY");
    }
  }
})
app.filter('dateformat1', function(){
  return function(date){
    if(date){
      return moment(date).format("DD-MM-YYYY");
    }
  }
})
app.filter('dateformat2', function(){
  return function(date){
    if(date){
      return moment(date).format("MMM DD, YYYY");
    }
  }
})
app.filter('dateformat3', function(){
  return function(date){
    if(date){
      return moment(date).format("MM-DD-YYYY");
    }
  }
})
app.filter('dateformat4', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY/MMM");
    }
  }
})
app.filter('timeFormat', function(){
  return function(time){
    if(time){
      return moment(time,"HH:mm:ss").format("hh:mm A");
    }
  }
})
app.filter('phonenumber', function() {
  return function (number) {
    if (!number) { return ''; }
    number = String(number);
    var formattedNumber = number;
    var c = (number[0] == '1') ? '1 ' : '';
    number = number[0] == '1' ? number.slice(1) : number;
    var area = number.substring(0,3);
    var front = number.substring(3, 6);
    var end = number.substring(6, 10);
    if (front) {
      formattedNumber = (c + "(" + area + ") " + front);
    }
    if (end) {
      formattedNumber += ("-" + end);
    }
    return formattedNumber;
  };
});