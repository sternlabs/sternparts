Message = {
	show: function (head, ctnt) {
		Session.set('message', {
			header: head,
			content: ctnt
		});
	},
	clear: function () {
		Session.set('message', {});
	}
};

Session.setDefault('message', {});

Template.Message.events({
	'click .message .close': function (evt) {
		// $(evt.target).closest('.message').fadeOut(); // the semantic-ui way
		Message.clear(); /* this forces the template to redraw itself. */
	}
});

Template.Message.helpers({
	header: function () {
		return Session.get('message').header;
	},
	content: function () {
		return Session.get('message').content;
	}
});
