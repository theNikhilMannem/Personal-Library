'use strict';

const Book = require('../models.js').Book

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, allBooks) => {
        if (err || !allBooks) {
          console.log('Error in GET (All): Books not found')
        }
        else {
          for (let eachBook of allBooks) {
            eachBook.commentcount = eachBook.comments.length
            eachBook.save((err, eachBookSaved) => {
              if (err) {
                console.log('error')
              }
              else if (!eachBookSaved) {
                console.log('eachBook can\'t be saved')
              }
              else {
                // console.log(eachBookSaved)
              }
            })
          }
          res.json(allBooks)
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;

      if (!title) {
        res.send('missing required field title')
        return
      }
      
      const book = new Book({
        title: title
      })

      book.save((err, bookSaved) => {
        if (err) {
          console.log('Error in POST (Create a Book): in saving book!')
        }
        else if (!bookSaved) {
          console.log('Error in POST: book ain\'t saved!')
        }
        else {
          res.json({
            _id: bookSaved._id,
            title: bookSaved.title
          })
        }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, allBooks) => {
        if (err || !allBooks) {
          console.log('Error in DELETE (All): Can\'t find the books!')
        }
        else {
          // allBooks.remove()
          res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findOne({ _id: bookid }, (err, bookFound) => {
        if (err || !bookFound) {
          console.log('Error in GET (by id): no book found')
          res.send('no book exists')
        }
        else {
          res.json(bookFound)
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        res.send('missing required field comment')
        return
      }
      //json res format same as .get
      Book.findById(bookid, (err, bookFound) => {
        if (err || !bookFound) {
          console.log('Error in POST (id and add comment): Book not found!')
          res.send('no book exists')
        }
        else {
          bookFound.comments.push(comment)
          bookFound.save((err, bookFoundSaved) => {
            if (err || !bookFoundSaved) {
              console.log('Error in POST (id and add comment): Bok found, but, can\'t be saved!')
              res.send('Book can\'t be saved!')
            }
            else {
              res.json(bookFoundSaved)
            }
          })
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findById(bookid, (err, bookFound) => {
        if (err || !bookFound) {
          console.log('Error in DELETE (by Id): Book casn\'t be found!')
          res.send('no book exists')
        }
        else {
          bookFound.remove()
          res.send('delete successful')
        }
      })
    });
  
};
