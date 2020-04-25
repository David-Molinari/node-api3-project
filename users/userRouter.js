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

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      if(!posts) {
        res.status(400).json({ message: "invalid user id"  });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch((err) => {
      res.status(500).json({message: 'Error retrieving the posts'});
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
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: "invalid user id"  });
      } else {
        console.log(user);
        next(); // calls the next normal mw in the stack
      }
    })
    .catch((err) => {
      res.status(500).json({message: 'error validating the user'});
    });
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({ error: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field"});
  } else {
    console.log(req.body);
    next();
  }
}

module.exports = router;

// I know - need to test the routers