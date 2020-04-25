const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({message: 'Error retrieving the posts'});
    });
});

router.get('/:id', (req, res) => {
  Posts.getById(req.params.id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({message: 'Error retrieving the posts'});
    });
});

router.post('/', validatePost, (req, res) => {
  Posts.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'there was an error adding post'
      });
    });
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
    .then(deleted => {
      if (deleted) {
        res.json({removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find post with given id' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete post'})
    })
});

router.put('/:id', (req, res) => {
  Posts.update(req.params.id, req.body)
  .then((post) => {
    res.status(200).json(post);
  })
  .catch((err) => {
    res.status(500).json({message: 'Error updating the post'});
  });
});

// custom middleware

function validatePost(req, res, next) {
  if(!req.body) {
    res.status(400).json({ error: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field"});
  } else {
    console.log(req.body);
    next();
  }
}

module.exports = router;
