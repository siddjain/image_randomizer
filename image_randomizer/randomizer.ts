/// <reference path="Scripts/knockout.d.ts" />

class Randomizer
{

    private _canvas1: HTMLCanvasElement;

    private _canvas2: HTMLCanvasElement;  

    constructor(canvas1: string, canvas2: string)
    {        

        this._canvas1 = <HTMLCanvasElement> document.getElementById(canvas1);

        this._canvas2 = <HTMLCanvasElement> document.getElementById(canvas2);             
    }



    public uploadImage(ev: any): void
    {

        var reader = new FileReader();

        reader.onload = (event: any) =>
        {

            var img = new Image();

            img.onload = () =>
            {

                var canvas = this._canvas1;

                var ctx = canvas.getContext("2d");

                canvas.width = img.width;

                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                Randomizer._clearCanvas(this._canvas2);                
            }

            img.src = event.target.result;

        }

        reader.readAsDataURL(ev.target.files[0]);

    }



    private static _clearCanvas(canvas: HTMLCanvasElement): void
    {

        var width = canvas.width;

        var height = canvas.height;

        canvas.getContext("2d").clearRect(0, 0, width, height);

    }



    public randomize(randomness: number): void
    {
        var pValue = randomness / 100;
        var canvas = this._canvas1;

        var canvas2 = this._canvas2;

        var width = canvas.width;

        var height = canvas.height;

        var n = width * height;

        var permutation = Randomizer.generateRandomArray(width * height);

        var ctx = canvas.getContext("2d");

        var imgData = ctx.getImageData(0, 0, width, height);

        var bmpData = imgData.data;

        canvas2.width = width;

        canvas2.height = height;

        var ctx2 = canvas2.getContext("2d");

        var imgData2 = ctx2.createImageData(width, height);

        var bmpData2 = imgData2.data;

        var j = 0;

        var i = 0;
        var k = 0;
        for (var y = 0; y < height; y++)
        {

            for (var x = 0; x < width; x++ , i++)
            {
                if (Math.random() < pValue)
                {
                    k = permutation[i];
                }
                else
                {
                    k = i;
                }
                k *= 4;

                bmpData2[j++] = bmpData[k];

                bmpData2[j++] = bmpData[k + 1];

                bmpData2[j++] = bmpData[k + 2];

                bmpData2[j++] = bmpData[k + 3];

            }

        }

        ctx2.putImageData(imgData2, 0, 0);

    }



    private static getRandomInt(start: number, end: number): number
    {

        return start + Math.round(Math.random() * (end - start));

    }



    private static swap(array: number[], i: number, j: number): void
    {

        var temp = array[i];

        array[i] = array[j];

        array[j] = temp;

    }



    private static generateRandomArray(size: number): number[]
    {

        var array = new Array(size);

        for (var i = 0; i < size; i++)
        {

            array[i] = i;

        }

        for (i = 0; i < size - 1; i++)
        {

            var j = Randomizer.getRandomInt(i, size - 1);

            Randomizer.swap(array, i, j);

        }

        return array;

    }    
}



window.onload = () =>
{

    var randomizer = new Randomizer("canvas1", "canvas2");
    var vm =
        {
            uploadImage: function (data, event)
            {
                randomizer.uploadImage(event);
            },
            randomize: function ()
            {
                randomizer.randomize(vm.randomness());
            },
            randomness: ko.observable(100)            
        };
    ko.applyBindings(vm);
};