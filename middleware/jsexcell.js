const xl = require('excel4node');
// Create a new instance of a Workbook class
let wb = new xl.Workbook({
  author: 'Elbi Library',
});
 
// Add Worksheets to the workbook
let ws = wb.addWorksheet('Sheet 1');
 
let styleColumn = wb.createStyle({
  alignment: {
    horizontal: ['center'],
    vertikal: ['center]']
    
  },
  font: {
    color: '#ffffff',
    size: 12,
    bold: true
  },
  fill: {
    type: `pattern`,
    patternType: `solid`,
    fgColor: `#152238`
  },
  border:{
    left: {
      style: 'thin',
      color: '#ffffff'
    }
  },
  numberFormat: '$#,##0.00; ($#,##0.00); -',
});

let style = wb.createStyle({
  alignment: {
    horizontal: ['center'],
    vertikal: ['center]']
    
  },
  font: {
    color: '#000000',
    size: 12,
  },
  border:{
    left: {
      style: 'thin',
      color: '#000000'
    }
  },
});

module.exports = {
    style,
    ws,
    wb,
    styleColumn
}