const express = require('express');
const Route = express.Router();
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();
const model = require('../db/models/index');
const excel = require('excel4node');
const {style, styleColumn} = require('../middleware/jsexcell');
const path = require('path');
const fs = require('fs');

Route.get('/:group', async function(req, res, next){
    try {
        const order = model.order;
        let group = parseInt(req.params.group);
        let allOlder;
        let wb = new excel.Workbook({author: 'Elbi Library'});
        let lembarKerja = wb.addWorksheet('Sheet 1');
        let harga = [];
        
        // Sesuaikan dengan kondisi
        switch (group) {
            case 1: 
                allOlder = await order.findAll({where: {return_status: true}});
                break;
            case 0: 
                allOlder = allOlder = await order.findAll({where: {return_status: false}});
                break;
            case 2: 
                allOlder = allOlder = await order.findAll({where: {return_status: null}});
                break;
            default: 
                allOlder = await order.findAll();
                break;
        }


        // Ambil Attribute
        let attributes = await order.rawAttributes;
        
        
        // Mengambil Data dari tabel relasi
        for (let value in allOlder) {
    
            // Ubah Format waktu
            let jam = new Date(parseInt(allOlder[value].dataValues.order_date));
            allOlder[value].dataValues.order_date = `${jam.getFullYear()}-${jam.getMonth()}-${jam.getDate()}`

            // Ubah Format waktu
            let jam2 = new Date(parseInt(allOlder[value].dataValues.order_finish));
            allOlder[value].dataValues.order_finish = `${jam2.getFullYear()}-${jam2.getMonth()}-${jam2.getDate()}`
      
            // Ubah status
            let status = allOlder[value].dataValues.return_status;
            switch (status) {
                case null :
                    allOlder[value].dataValues.return_status = 'in the process';
                    break;
                case true :
                    allOlder[value].dataValues.return_status = 'done';
                    break;
                case false : 
                    allOlder[value].dataValues.return_status = 'in trouble';
            };
      
            allOlder[value].dataValues.book_id = await allOlder[value].getBook({
              raw: true,
              attributes: ["id", ["book_title", "title"], ['book_price', 'price']],
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
                } else data[index2 - 1][index - 1] = 0;

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

                    // Tambahkan harga buku jika 
                    if(element.dataValues.return_status === `in trouble`) total += element.dataValues.book_id.price
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
        


        // // Beri Jarak bedasarkan panjang
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
        next(err)
    }
      
});


module.exports = Route