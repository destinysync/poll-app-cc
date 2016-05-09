module.exports = function updateColorArr(arr) {
    this.randomNum = function() {
        return Math.floor(Math.random() * 251);
    };

    this.randomColor = function() {
        return "rgb(" + this.randomNum() + "," + this.randomNum() + "," + this.randomNum() + ")";
    };

    var randomColour = '';

    function fn1() {
        randomColour = this.randomColor();
        while (arr.indexOf(randomColour) != -1) {
            randomColour = this.randomColor();
        }


    }
    fn1();
    var array = arr;
    array.push(randomColour);
    return array;
};