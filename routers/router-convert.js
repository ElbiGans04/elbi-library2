const express = require('express');
const Route = express.Router();
const ModuleLibrary = require('../controllers/module');
const moduleLibrary = new ModuleLibrary();
const model = require('../models/model-index');
const excel = require('../middleware/jsexcell');
const path = require('path');
const fs = require('fs');

Route.get('/', async function(req, res){
    try {

        let { order } = await model();
        let allOlder = await order.findAll();
        let attributes = await order.rawAttributes
    
        // Mengambil Data dari tabel relasi
        for (let value in allOlder) {
    
            // Ubah Format waktu
            let jam = new Date(allOlder[value].dataValues.order_date);
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
    
    
          let idx = 1;
          for(let col in attributes) {
              let name = moduleLibrary.ambilKata(col, '_', {without: [0]});
              if(name.toLowerCase() === "id" && idx !== 1) name = `Name ${moduleLibrary.ambilKata(col, '_', {without: [1]})}`;
              
              excel.ws
                .cell(1, idx)
                .string(name)
                .style(excel.styleColumn)
    
              // Increment
              idx++
          }
    
    
          
          let index = 1;
          let data = [];
    
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
    
                if(typeof value === 'number') {
                    excel.ws
                        .cell(index + 1, index2)
                        .number(value)
                        .style(excel.style)
    
                } else if (typeof value === 'string') {
                    excel.ws
                        .cell(index + 1, index2)
                        .string(value)
                        .style(excel.style)
                    } else {
                        if(value) {
                            excel.ws
                                .cell(index + 1, index2)
                                .string(value.title)
                                .style(excel.style)
                        }
                        
                    }
                index2++
              }
    
              index++
          }
    
        // Beri Jarak bedasarkan panjang
        data.forEach(function(e, i){
            let max = e.sort((a,b) => a - b)[e.length - 1];
            excel.ws.column(i + 1).setWidth(max + 10)
        })  
    
          let name = `Elbi-Library-${Date.now()}.xlsx`;
          excel.wb.write(name, function(err){
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