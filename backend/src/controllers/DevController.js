const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    try {
      const devs = await Dev.find();

      return res.json(devs);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
  },

  async store(req, res) {
    try {
      // Get github user info from body on post route
      const { github_username, techs, latitude, longitude } = req.body;

      const devExists = await Dev.findOne({ github_username });

      if (devExists) {
        throw new Error('Usuário já está cadastrado');
      }

      // Get response from github API with user information
      const { data } = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      // Get name (or login if name empty), avatar url and bio
      // eslint-disable-next-line no-undef
      const { name = login, avatar_url, bio } = data;

      // Change each tech(text) in array as item
      const techsArray = parseStringAsArray(techs);

      // Create geolocation for lat & long (based on PointSchema)
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      // Create new user in Database
      const dev = await Dev.create({
        name,
        github_username,
        bio,
        avatar_url,
        techs: techsArray,
        location,
      });

      return res.json(dev);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
  },

  async update(req, res) {
    try {
      // Get github username
      const { github_username } = req.params;

      // Check if user exists in database
      const dev = await Dev.findOne({ github_username });

      // If username do not exists
      if (!dev) {
        throw new Error('Usuário não encontrado');
      }

      // If exists, update it
      const { name, avatar_url, bio, techs, latitude, longitude } = req.body;

      // Transform techs text in Array for each tech
      const techsArray = parseStringAsArray(techs);

      // Create geolocation for lat & long (based on PointSchema)
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      // Update Dev and return the "updated" Dev
      const devUpdated = await dev.update({
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      return res.json(devUpdated);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
  },

  async destroy(req, res) {
    try {
      // Get github username
      const { github_username } = req.params;

      // Check if user exists in database
      const dev = await Dev.findOne({ github_username });

      if (!dev) {
        throw new Error('Usuário não encontrado');
      }

      // Delete user
      await dev.delete();

      return res.send();
    } catch ({ message }) {
      return res.status(400).json({ message });
    }
  },
};
