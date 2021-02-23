const express = require('express');
const Route = express.Router();
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();
const model = require('../db/models/index');
const excel = require('excel4node');
const {style, styleColumn} = require('../middleware/jsexcell');
const path = require('path');
const fs = require('fs');

Route.get('/:group', async function(req, res){
    try {
        let group = parseInt(req.params.group);
        const order = model.order;
        let allOlder;
        let wb = new excel.Workbook({author: 'Elbi Library'});
        let lembarKerja = wb.addWorksheet('Sheet 1');
        
        // Sesuaikan dengan kondisi
        if(group === 1) allOlder = await order.findAll({where: {return_status: true}});
        else if(group === 0) allOlder = await order.findAll({where: {return_status: false}})
        else allOlder = await order.findAll();

        // Ambil Attribute
        let attributes = await order.rawAttributes
    
        // Mengambil Data dari tabel relasi
        for (let value in allOlder) {
    
            // Ubah Format waktu
            let jam = new Date(parseInt(allOlder[value].dataValues.order_date));
            allOlder[value].dataValues.order_date = `${jam.getFullYear()}-${jam.getMonth()}-${jam.getDate()}`
      
            // Ubah status
            allOlder[value].dataValues.return_status = allOlder[value].dataValues.return_status === true ? "the book has been returned" : "the book has not been returned";
      
      
            allOlder[value].dataValues.book_id = await allOlder[value].getBook({
              raw: true,
              attributes: ["id", ["book_title", "title"]],
            });
            allOlder[value].dataValues.user_id = await allOlder[value].getUser({
              raw: true,
              attributes: ["id", ["name", `title`]],
            }); 
          };
    
          

          // Buat Attribute
          let idx = 1;
          for(let col in attributes) {
              let name = moduleLibrary.ambilKata(col, '_', {without: [0]});
              if(name.toLowerCase() === "id" && idx !== 1) name = `Name ${moduleLibrary.ambilKata(col, '_', {without: [1]})}`;
              
              lembarKerja
                .cell(1, idx++)
                .string(name)
                .style(styleColumn)
           };

           // Buat Kolom Baru
           lembarKerja
            .cell(1, idx++)
            .string("Fines")
            .style(styleColumn)
           lembarKerja
            .cell(1, idx++)
            .string("Time late")
            .style(styleColumn)

    
    
          
          let index = 1;
          let data = [];
          let formula = 0;
          // Melooping entitas
          for(let element of allOlder) {
              let index2 = 1
            
              // Melooping field per entitas
              for (let element2 in element.dataValues) {
                let value = element.dataValues[element2];
    
                // Jika baru pertama kali berjalan maka
                if (index === 1) data[index2 - 1] = []
                
                if (value) {
                    let value2 = typeof value !== 'object' ? `${value}` : `${value.title}`;
                    data[index2 - 1][index - 1] = value2.length;           
                }

                if(element2 === 'order_price') {
                    const dayOrder = parseInt(element.dataValues['order_day']);
                    let date = element.dataValues['order_date'].split('-');
                    const price = parseInt(value);
                    
                    let timeNow = new Date(
                        parseInt(date[0]), 
                        parseInt(date[1]), 
                        parseInt(date[2])
                    );
                        
                    let {days} = moduleLibrary.getTime(timeNow.getTime(), dayOrder);
                    let totalLate = price * days;
                    let total = (dayOrder * price) + totalLate;
                    formula += total;

                    // Masukan Ke baris kerja
                    lembarKerja.cell(index + 1, idx - 1)
                        .number(days)
                        .style(style)
                    lembarKerja.cell(index + 1, idx - 2)
                        .number(totalLate)
                        .style(style)
                }


                // Jika Bernilai Number
                if(typeof value === 'number') {
                    lembarKerja
                        .cell(index + 1, index2)
                        .number(value)
                        .style(style)
    
                } else if (typeof value === 'string') {
                    lembarKerja
                        .cell(index + 1, index2)
                        .string(value)
                        .style(style)
                    } else {
                        if(value) {
                            lembarKerja
                                .cell(index + 1, index2)
                                .string(value.title)
                                .style(style)
                        }
                        
                    }
                index2++
              }
    
              index++
          };

        // Price dikolom E
        // Beri Total
        lembarKerja
            .cell((index + 2), (idx - 2))
            .string("Total")
            .style(styleColumn);

    
        lembarKerja
            .cell((index + 2), (idx - 1))
            .number(formula)
            .style(styleColumn);
        console.log(formula)


        // Beri Jarak bedasarkan panjang
        data.forEach(function(e, i){
            let max = e.sort((a,b) => a - b)[e.length - 1];
            lembarKerja.column(i + 1).setWidth(max + 10)
        })  
    
          let name = `Elbi-Library-${Date.now()}.xlsx`;
          wb.write(name, function(err){
              if(err) throw err
              else {
                  res.download(`${path.resolve(__dirname, `../${name}`)}`, function(err){
                      if(err) throw err
                      fs.unlink(`${path.resolve(__dirname, `../${name}`)}`, function(err){
                          if(err) throw err
                      })  
                  });
            } 
         });

    } catch (err) {
        console.log(err.message)
        res.status(200).end()
    }
      
});


module.exports = Route