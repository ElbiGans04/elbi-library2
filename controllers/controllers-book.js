const respon = require('./respon');
const ModuleTemplate = require('./module');
let model = require('../db/models/index')
const  moduleLibrary = new ModuleTemplate();
const path = require('path');
const url = require('url');

// Export
module.exports = {
    get: async function(req, res, next) {
        try {
            let book = model.book;
            const id = req.params.id;
            
            // Validation
            // Jika apakah ditemukan user dengan id tsb
            let result = await book.findOne({
                where: {
                    id
                }
            });
            
            // ambil name
            let about = model.about;
            let {appName} = await about.findOne({
                raw: true,
                attributes: ['appName']
            });

            
            // Jika tidak ditemukan
            if(!result) throw new respon({message: 'book not found', code: 200, alert: true});

            // Jika ditemukan convert image ke base 64
            result.dataValues.book_image = result.dataValues.book_image.toString('base64')
            
            // Ubah Tanggal
            let year = result.dataValues.book_launching.slice(0,4)
            let month = result.dataValues.book_launching.slice(4,6)
            let day = result.dataValues.book_launching.slice(6,8);
            result.dataValues.book_launching = `${year}-${month}-${day}`;
        
    
            // Jika Ada maka Kirimkan
            res.json(new respon({message: 'success',data: result, type: true, alert: true, code: 200, show: true}))
            
        } catch ( err ) {
            next(err);
        }
    },

    getAll: async function (req, res, next) {
        try {
            const book = model.book;
            const category = model.category;
            const publisher = model.publisher;
            let result;

            // Ambil Url
            let {group} = url.parse(req.url, true).query;
            if(group === undefined || group.toLowerCase() == "all") result = await book.findAll();
            else {
                let resultOfGroup = await category.findOne({
                    where: {
                        id: group
                    }
                });

                // Jika tidak ada
                if(!resultOfGroup) result = await book.findAll();  
                else {
                    result = await resultOfGroup.getBooks()
                }
            }


            // ambil name
            let about = model.about;
            let {appName} = await about.findOne({
                raw: true,
                attributes: ['appName']
            });


            let resultCategory = await category.findAll({
                raw: true,
                attributes: ['id', ['name', 'value']]
            });

            let resultPublisher = await publisher.findAll({
                raw: true,
                attributes: ['id', ['name', 'value']]
            });


            // COloumn without
            let without = ['id', 'createdat', 'updatedat', 'book_type'];
            let coloumn = Object.keys(await book.rawAttributes);
            coloumn = [...coloumn, `category`, `publisher`]


            for(let el of result) {
                let year = el.dataValues.book_launching.slice(0,4)
                let month = el.dataValues.book_launching.slice(4,6)
                let day = el.dataValues.book_launching.slice(6,8);
                el.dataValues.book_launching = `${year}-${month}-${day}`

                let result = await el.getCategories({
                    raw: true,
                    attributes: ['id', ['name', 'title']]
                });
                let result2 = await el.getPublishers({
                    raw: true,
                    attributes: ['id', ['name', 'title']]
                });

                el.dataValues.book_category = result[0];
                el.dataValues.publisher = result2[0];

               
            };

            // Render 
            res.render('table', {
                appName,
                coloumn,
                data: result,
                modalwithout:[...without],
                without,
                title: 'Book',
                module: moduleLibrary,
                profile: req.user,
                as: [
                    moduleLibrary.as({target: 'book_image', type: 'file', without: [0]}),
                    moduleLibrary.as({target: 'book_title', as: 'identifer', without: [0]}),
                    moduleLibrary.as({target: 'book_launching', type: 'date'}),
                    moduleLibrary.as({target: 'category',  type: 'select', value: resultCategory }),
                    moduleLibrary.as({target: 'publisher',  type: 'select', value: resultPublisher }),
                ],
                buttonHeader: {
                    add: {
                        class: 'fas fa-book mr-2',
                        id: 'addActionButton'
                    },
                },
                group: resultCategory,
                buttonAction: {
                    delete: true,
                    update: true
                }
            })

        } catch (err) {
            next(err)
        }
    },

    post: async function (req,res,next) {
        try {
            const book = model.book;
            const category = model.category;
            const publisher = model.publisher;
            let { category: usercategory } = req.body;


            // Verification
            if(!req.body.book_title || !usercategory) throw new respon({message: 'title/ category cannot null', code: 200, alert: true})
            // check apakah buku dengan title tsb sudah ada
            let validation = await book.count({
                where : {
                    book_title
                     : req.body.book_title

                },
                raw: true
            });
            
            // Jika Ada
            if (validation > 0) throw new respon({code: 200, message: 'book already', alert: true});

            // Pisahkan format launching
            let {book_launching} = req.body
            if ( book_launching.split('-').length != 3 ) throw new respon({code: 200, message: 'date is invalid', alert: true});
            req.body.book_launching = moduleLibrary.ambilKata(book_launching, '-', {space: false, uppercase: false});



            // Buat File Format
            if(!req.file) {
                throw new respon({code: 200, message: 'please insert image' ,alert: true})
            } else {
                let format = path.extname(req.file.originalname);
                format = format.split('.')[1];
                req.body.book_type = format
    
                // Tambahkan File, Karena file berada direq.file
                req.body.book_image = req.file.buffer;
            };

            // Check apakah 
            let resultCategory = await category.findOne({
                where: {
                    id: usercategory
                }
            });

            // Jika tidak ada
            if(!resultCategory) throw new respon({message: 'category is invalid', code: 200, alert: true});

            // Check apakah 
            let resultPublisher = await publisher.findOne({
                where: {
                    id: req.body.publisher
                }
            });

            // Jika tidak ada
            if(!resultPublisher) throw new respon({message: 'publisher is invalid', code: 200, alert: true});
            
            // Buat
            let book1 = await book.create(req.body);
            await book1.setPublishers(resultPublisher);
            await book1.setCategories(resultCategory);
            // Beri respone
            res.json(new respon({message: 'successfully added', type: true, alert: true, code: 200, show: true, redirect: '/books'}));

        } catch (err) {
            next(err);
        }
    },

    put: async function (req, res, next) {
        try {
            const book = model.book;
            const category = model.category;
            const publisher = model.publisher;
            let entitasId = req.params.id;
            let { category: userCategory } = req.body; 

            
            // Verify
            // Validation
            if(!req.body.book_title || !usercategory) throw new respon({message: 'title/ category cannot null', code:200, alert: true})
            let validation = await book.findOne({
                where: {
                    id: entitasId
                }
            });
    
            // Jika book tidak ditemukan
            if(!validation) throw new respon({message: 'book not found', code: 200, alert: true})

            
            // Tambahkan File, Karena file berada direq.file
            // Buat File Format
            if(req.file) {
                let format = path.extname(req.file.originalname);
                format = format.split('.')[1];
                req.body.book_type = format
    
                // Tambahkan File, Karena file berada direq.file
                req.body.book_image = req.file.buffer;
            };

            
            // Pisahkan format launching
            let {book_launching} = req.body
            if ( book_launching.split('-').length != 3 ) throw new respon({code: 200, message: 'date is invalid', alert: true});
            req.body.book_launching = moduleLibrary.ambilKata(book_launching, '-', {space: false, uppercase: false});
            
            // Check apakah 
            let resultCategory = await category.findOne({
                where: {
                    id: userCategory
                }
            });
            
            // Jika tidak ada
            if(!resultCategory) throw new respon({message: 'category is invalid', code: 200, alert: true});
            
            // Check apakah 
            let resultPublisher = await publisher.findOne({
                where: {
                    id: req.body.publisher
                }
            });

            // Jika tidak ada
            if(!resultPublisher) throw new respon({message: 'publisher is invalid', code: 200, alert: true});

            // Jika Ditemukan maka lanjutkan
            await book.update(req.body, {
                where: {
                    id: entitasId
                }
            });
            

            await validation.setCategories(resultCategory)
            await validation.setPublishers(resultPublisher)
    
    
            res.json(new respon({message: 'updated successfully', type: true, alert: true, code: 200, show: true, redirect: '/books'}))
    
        } catch (err) {
            next(err)
        }
    },

    delete: async function (req, res, next) {
        try {
            const book = model.book;
            let id = req.params.id;
            
            // Verify
            // Validation
            let validation = await book.count({
                where: {
                    id
                },
                raw: true
            });
    
            // Jika TIdak terdapat user
            if ( validation <= 0) throw new respon({message: 'book not found', code: 200, alert: true});
    
            // Hapus book
            await book.destroy({
                where: {
                    id
                }
            })
            

            // Kirim Respon
            res.json(new respon({message: 'successfully deleted', type: true, alert: true, code: 200, show: true, redirect: '/books'}));
            
        } catch (err) {
            next(err)
        }
    }

}


