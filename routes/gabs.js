const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (req, res) => {
	models.Gab.all().then((gabs) => {
		let model = {};
		model.gabs = [];
		for(let i in gabs) {
			model.gabs.push(gabs[i].dataValues);
		}
		console.log(model);
		res.render('gab', model);
	})
});

router.post('/create', (req, res) => {
	let gab = models.Gab.build({
		title: req.body.title,
		content: req.body.content,
		userId: req.session.userId,
		likes: 0
	}).then((gab) => {
		console.log(gab);
	});

	gab.save().then(() => {
		res.redirect('/gabs');
	});
});

module.exports = router;
