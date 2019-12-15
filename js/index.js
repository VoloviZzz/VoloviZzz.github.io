var Alert = {
  error: function (arg={}) {
	document.querySelector('#alert .title').innerText = arg.title;
	document.querySelector('#alert .desc').innerText = arg.desc;
	document.querySelector('#alert').classList.add('error');
	Alert.show();
	setTimeout(function () {
	  Alert.hide();
	  document.querySelector('#alert').classList.remove('error');
	}, 2000);
  },
  success: function (arg={}) {
	document.querySelector('#alert .title').innerText = arg.title;
	document.querySelector('#alert .desc').innerText = arg.desc;
	document.querySelector('#alert').classList.add('success');
	Alert.show();
	setTimeout(function () {
	  Alert.hide();
	  document.querySelector('#alert').classList.remove('success');
	}, 2000);
  },
  info: function (arg={}) {
	document.querySelector('#alert .title').innerText = arg.title;
	document.querySelector('#alert .desc').innerText = arg.desc;
	document.querySelector('#alert').classList.add('info');
	Alert.show();
	setTimeout(function () {
	  Alert.hide();
	  document.querySelector('#alert').classList.remove('info');
	}, 2000);
  },
  show: function (arg={}) {
	document.querySelector('#alert').classList.add('show');
  },
  hide: function (arg={}) {
	document.querySelector('#alert').classList.remove('show');
  },
};
var Book = {
	opened_form_id: false,
	editting_mode: false,
	get_people: function  (id) {
	  return JSON.parse(localStorage.getItem('people')).filter( elem => {
		if (elem.id == id) {
		  return elem;
		}
	  })[0];
	},
	rand: function getRandomInt(min, max){
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	get_array_people: function  () {
	  if (localStorage.getItem('people') == null) {
		localStorage.setItem('people', JSON.stringify([
		  {
			id: 1,
			name: 'Железный человек (винил)',
			phone_self: '3200',
			phone_home: 'Детский мир',
			phone_work: 'Империя куколдов',
			email: 'https://dollsempire.ru/',
			comment: 'Опиши куклу тут как-нибудь.'
		  }
		]));
	  }
	  if (decodeURIComponent(window.location.search)) return JSON.parse(decodeURIComponent(window.location.search).slice(1))
	  return JSON.parse(localStorage.getItem('people'));
	},
	create_list_element: function (people) {
	  var phone = people.phone_self+' '+people.phone_work+' '+people.phone_home;
	  phone = phone.replace(/  /g, ' ').replace(/[. .]/g, ', ');
	  return `<li data-id="`+people.id+`" class="people-elem">
		<img src="img/trash/${Book.rand(1,7)}.png" alt="Картинка человека">
		<name>`+people.name+`</name>
		<phone>`+phone+`</phone>
		<email><a href="${people.email}">${people.email}</a></email>
	  </li>`;
	},
	draw_list: function () {
	  var list = '';
	  Book.get_array_people().reverse().map( elem => {
		list += Book.create_list_element(elem);
	  });
	  document.querySelector('.people-list').innerHTML = list;
	},
	set_form: function (people) {
	  var people = Object.values(people);
	  document.querySelectorAll('.form-elem').forEach(function (elem, index) {
		elem.querySelector('input') ?
		elem.querySelector('input').value = people[index+1] :
		elem.querySelector('textarea').value = people[index+1]
	  });
	  Book.opened_form_id = people[0];
	},
	whereIAm: function () {
		if (decodeURIComponent(window.location.search)) {
			 Alert.info({title: 'Сожалею', desc:'Добавлять или изменять желания друзей не в ваших силах'});
			 return;
		}
	  var cont = Array.from(document.querySelector('.cont').classList).includes('s--profile') ?
	  Book.editting() :
	  Book.add_form()
	},
	add_form: function () {
	  Alert.success({title: 'Успех!', desc:'Добавлен новый человек.'});
	  var people = Book.get_array_people();
	  people.push({
		id: people.length+1,
		name: 'Новое желание',
		phone_self: '',
		phone_home: '',
		phone_work: '',
		email: '',
		comment: ''
	  });
	  localStorage.setItem('people', JSON.stringify(people));
	  Book.draw_list();
	  document.querySelectorAll('.people-elem').forEach(elem => {
		elem.addEventListener('click', Book.open_profile);
	  });
	},
	remove_form: function () {
	  Alert.success({title: 'Успех!', desc:'Человек был удалён.'});
	  var people = Book.get_array_people();
	  people = people.filter( function (elem, index) {
		if (elem.id != Book.opened_form_id) {
		  elem.id = index;
		  return elem;
		}
	  });
	  localStorage.setItem('people', JSON.stringify(people));
	  Book.draw_list();
	  document.querySelectorAll('.people-elem').forEach(elem => {
		elem.addEventListener('click', Book.open_profile);
	  });
	  Book.swipe();
	},
	editting: function () {
		if (decodeURIComponent(window.location.search)) {
			 Alert.info({title: 'Сожалею', desc:'Добавлять или изменять желания друзей не в ваших силах'});
			 return;
		}
	  if (Book.editting_mode == true) {
		Alert.info({title: 'Обратите внимание', desc:'Выключен режим редактирования.'})
		Book.editting_mode = false;
		document.querySelector('.edit').style.color = "#000";
		document.querySelectorAll('.form-elem').forEach(function (elem, index) {
		  elem.querySelector('input') ?
		  elem.querySelector('input').disabled = true :
		  elem.querySelector('textarea').disabled = true
		});
	  }else {
		Alert.info({title: 'Обратите внимание', desc:'Включен режим редактирования.'})
		Book.editting_mode = true;
		document.querySelector('.edit').style.color = "#00f";
		document.querySelectorAll('.form-elem').forEach(function (elem, index) {
		  elem.querySelector('input') ?
		  elem.querySelector('input').disabled = false :
		  elem.querySelector('textarea').disabled = false
		});
		// тут нужно как-то отправлять данные
	  }
	},
	edit_form: function () {
	  var people = Book.get_array_people();
	  people.map( elem => {
		if (elem.id == Book.opened_form_id) {
		  elem.name = document.querySelectorAll('.form-elem')[0].querySelector('input').value;
		  elem.phone_self = document.querySelectorAll('.form-elem')[1].querySelector('input').value;
		  elem.phone_home = document.querySelectorAll('.form-elem')[2].querySelector('input').value;
		  elem.phone_work = document.querySelectorAll('.form-elem')[3].querySelector('input').value;
		  elem.email = document.querySelectorAll('.form-elem')[4].querySelector('input').value;
		  elem.comment = document.querySelectorAll('.form-elem')[5].querySelector('textarea').value;
		}
	  });
	  localStorage.setItem('people', JSON.stringify(people));
	  Book.draw_list();
	  document.querySelectorAll('.people-elem').forEach(elem => {
		elem.addEventListener('click', Book.open_profile);
	  });
	},
	search: function () {
	  var list = '';
	  Book.get_array_people().reverse().map( elem => {
		if (elem.name.indexOf(this.value) != -1) {
		  list += Book.create_list_element(elem);
		}
	  });
	  document.querySelector('.people-list').innerHTML = list;
	},
	copyLink(link) {
		var copytext = document.createElement('input')
		 copytext.value = link;
		 document.body.appendChild(copytext)
		 copytext.select()
		 document.execCommand('copy')
		 document.body.removeChild(copytext)
	},
	bufer() {

	},
	generateLink() {
		var list = localStorage.getItem('people');
		var link_list = 'https://volovizzz.github.io/?' + encodeURIComponent(list);
		document.querySelector('.send_btn').innerHTML = `<a onclick="Book.copyLink('${link_list}')" href='#'>Кликните, что бы скопировать ссылку</a>`;
		var url = new URL(link_list);
	},
	init: function () {
		Book.draw_list();
		document.querySelector('.back').addEventListener('click', Book.swipe);
		document.querySelector('.edit').addEventListener('click', Book.editting);
		document.querySelector('.edit2').addEventListener('click', Book.editting);
		document.querySelector('.remove').addEventListener('click', Book.remove_form);
		document.querySelector('.img__btn').addEventListener('click', Book.whereIAm);
		document.querySelector('.send_btn').addEventListener('click', Book.generateLink);
		document.querySelector('.search_input').addEventListener('keyup', Book.search);
		document.querySelectorAll('.form-elem').forEach(function (elem, index) {
			elem.querySelector('input') ?
			elem.querySelector('input').addEventListener('keyup', Book.edit_form) :
			elem.querySelector('textarea').addEventListener('keyup', Book.edit_form)
		});
		document.querySelectorAll('.people-elem').forEach(elem => {
				elem.addEventListener('click', Book.open_profile);
			});
			if (decodeURIComponent(window.location.search)) {
				document.querySelector('.form.profilesList h2').innerText = 'Список желаний Вашего друга';
				document.querySelector('.send_btn').innerHTML = `<a href="https://volovizzz.github.io">Перейти на свой список желаний</a>`;
			}
	},
	open_profile: function() {
		Book.opened_form_id = this.dataset.id;
		Book.set_form(Book.get_people(this.dataset.id));
		Book.swipe();
	},
	swipe: function() {
		document.querySelector('.cont').classList.toggle('s--profile');
	},
}
document.addEventListener("DOMContentLoaded", Book.init);























//----------------------end--------------------
