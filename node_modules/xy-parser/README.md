# XY text file parser

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

XY file parser allows to convert a text file to an array of XY.




## Example of use:
```
var parseXY = require('xy-parser')
var result=parseXY(realValue, {normalize: true})
```

## Options

* normalize : will set the maximal value to 1
* arrayType :
  * 'xxyy' [[x1,x2,x3,...],[y1,y2,y2,...]]
  * 'xyxy' [[x1,y1],[x2,y2],[x3,y3], ...]] (default)

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/cheminfo-dummy.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/cheminfo-dummy
[travis-image]: https://img.shields.io/travis/cheminfo-js/dummy/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo-js/dummy
[david-image]: https://img.shields.io/david/cheminfo-js/dummy.svg?style=flat-square
[david-url]: https://david-dm.org/cheminfo-js/dummy
[download-image]: https://img.shields.io/npm/dm/cheminfo-dummy.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/cheminfo-dummy
