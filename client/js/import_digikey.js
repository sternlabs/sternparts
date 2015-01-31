Template.ImportDigikey_list.helpers({
	list: function () {
		return Scratchpad.find();
	}
});

Template.ImportDigikey_list.events({
	'click .import-selected': function () {
		var selected = Scratchpad.find({ checked: true });
		selected.forEach(function (item) {
			var found = Parts.findOne({
				'Digi-Key Part Number': item['Part Number']
			});
			if (found) {
				Inventory.update({
					part_id: found._id
				}, {
					part_id: found._id,
					$inc: { quantity: item.Quantity }
				}, {
					upsert: true
				});
			}
		});
	}
});

Template.ImportDigikey_item.events({
	/* toggles the `.checked` booolean field. */
	'click .toggle-checked': function () {
		Scratchpad.update(this._id, { $set: { checked: !this.checked }});
	}
});

Template.ImportDigikey_upload.events({
	/* this gets called whenever the user selects a file. */
	'change .file-selected': function (event, template) {
		event.preventDefault();
		var file = template.find('input#upload_file').files[0];
		var reader = new FileReader();
		/* onload is called once the file is uploaded. */
		reader.onload = function (evt) {
			/* clear our temporary buffer, parse the csv and
			insert the data back into our buffer. */
			Scratchpad.remove({});
			var start = reader.result.indexOf("Index\tQuant");
			var end = reader.result.indexOf("Subtotal");
			var data = reader.result.slice(start, end).trim();
			/* `data` should contain only the order table */
			var parsed = Papa.parse(data, {
				header: true,
				error: function (err) {
					Message.show('CSV parsing', file.name + ': ' + err);
				}
			});
			parsed.data.forEach(function (obj) {
				Scratchpad.insert(obj);
			});
		};
		/* read the uploaded file as a utf8 text. */
		reader.readAsText(file);
		/* we must reset the form so the 'change' event can fire again. */
		template.find('form#upload_form').reset();
	}
});
