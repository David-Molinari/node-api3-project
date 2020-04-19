const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'there was an error adding user'
      });
    });
});

router.get('/', (req, res) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({message: 'Error retrieving the users'});
    });
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({message: 'Error retrieving the users'});
    });
});

router.get('/:id/posts', (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({message: 'Error retrieving the users'});
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(deleted => {
      if (deleted) {
        res.json({removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find user with given id' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete user'})
    })
  }
);

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => {
    res.status(500).json({message: 'Error updating the user'});
  });
});

//custom middleware

function validateUserId(req, res, next) {
  let user = Users.getById(req.params.id);
  if (user) {
    console.log(user);
    next(); // calls the next normal mw in the stack
  } else {
    res.status(400).json({ error: "something broke!" });
  }
}

function validateUser(req, res, next) {
  if(req.body.name) {
    console.log(req.body.name);
    next();
  } else {
    res.status(400).json({ error: "something broke!" });
  }
}

module.exports = router;

// I know - need to test the routers