module.exports = function randColor(arr) {
    this.randomNum = function() {
        return Math.floor(Math.random() * 251);
    };

    this.randomColor = function() {
        return "rgb(" + this.randomNum() + "," + this.randomNum() + "," + this.randomNum() + ")";
    };
    var colorArr = [];
    for (var i = 0; i < arr.length; i++) {
        var randomColour = '';

        function fn1(cb) {
          randomColour = this.randomColor();
            while (colorArr.indexOf(randomColour) != -1) {
                randomColour = this.randomColor();
            }
            cb();
        }

        function fn2() {
            colorArr.push(randomColour);
        }
        fn1(fn2);
    }
    return colorArr;
};

