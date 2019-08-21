class DataGrid {
		constructor(args) {
			const self = this;
			args = Object.assign({
				checkbox: false,
				sorting: true,
				element: document.getElementById('grid'),
				dataSet: { 'empty': ['empty'] },
				headerBackgroundColor: '#9d40de',
				headerColor: '#efefef',
				backgroundColor: '#fff',
				color: '#222',
				header: [{title: '<h1>EMPTY</h1>', key: 'empty'}],
				horizontal: 'center',
				vertical: 'center',
				cellPointer: true,
				cellHover: true,
				headerHide: false,
				headerPointer: false,
				headerHover: false,
				searchable: true,
				padding: '15px',
				margin: '0px',
				border: true,
				cellEvent: false,
				headerEvent: false,
				checkboxEvent: false,
			}, args);
			self.grid = args.element[0] || args.element;
			self.grid.classList.add('--grid');
			let style = document.createElement('style');
			style.innerHTML = `.--grid{
				  font-family: Geneva, Arial, Helvetica, sans-serif;
				}

				.--grid .row{
				    display: flex;
				}
				.--grid .row .column{
				    background-color: #e4e4e4;
				    flex: 1;
				}
				.--grid .row .header_cell{
				    background-color: #999;
				    min-height: 18px;
				    padding: 5px;
				    display:  flex;
				    margin: 5px;
				}
				.--grid .row .cell{
				    background-color: #999;
				    min-height: 18px;
				    padding: 5px;
				    display:  flex;
				    text-align: justify;
				    margin: 5px;
				    overflow:  hidden;
				}
				.--grid .row .checkbox{
				    background-color: #fff;
				    border: solid 1px #000;
				    width: 25px;
				    height: 25px;
				    cursor: pointer;
				    justify-content: center;
				    align-items: center;
				    display: flex;
				    cursor: pointer;
				}
				.--grid .row .checked:after{
				    content: '✔';
				    font-size: 1.5em;
				    transform: translateX(1px);
				    justify-content: center;
				    align-items: center;
				}
				.--grid .row .hover:hover{
				    filter: brightness(.8);
				}
				.--grid .row .hover:active{
				    filter: brightness(.6);
				}
				.--grid .row .pointer{
				    cursor: pointer;
				}
				.--grid .search_row{
				    justify-content: flex-end;
				}
				.--grid .input_icon{
				    width: 20px;
				    height: 20px;
				    opacity: .4;
				    transition: .25s ease-in-out;
				    margin-right: 5px;
				}
				.--grid .input {
				  outline: none;
				  display: flex !important;
				  border: solid 1px #3f51b5;
				  padding: .8em;
				  background-color: #fff;
				  cursor: text;
				  transition: .25s ease-in-out;
				}
				.--grid .input:focus-within .input_icon {
				  width: 15px;
				}
				.--grid .input:focus-within input {
				  border-bottom: solid 1px #808080;
				}
				.--grid input.input_line {
				  outline: none;
				  color: #808080;
				  border: solid 1px transparent;
				  background-color: transparent;
				  text-transform: uppercase;
				  align-items: center;
				  transition: .25s ease-in-out;
				}
				.--grid .row .header_cell div .sortBtn{
				  margin-left: 5px;
				  width: 10px;
				  position: relative;
				  cursor: pointer;
				}
				.--grid .row .header_cell div .sortBtn:after{
				  content: '';
				  border: 5px solid transparent;
				  border-top: 5px solid #0006;
				  position: absolute;
				  transform: translateY(10px);
				}
				.--grid .row .header_cell div .sortBtn:before{
				  content: '';
				  border: 5px solid transparent;
				  border-bottom: 5px solid #0006;
				  position: absolute;
				  transform: translateY(-2px);
				}
				.--grid .row .header_cell div .sortBtn:hover:after{
				  border-top: 5px solid #000;
				}
				.--grid .row .header_cell div .sortBtn:hover:before{
				  border-bottom: 5px solid #000;
				}
				.--grid .row .header_cell div .sortBtn-down:after{
				  content: '';
				  border: 5px solid transparent;
				  border-top: 5px solid #000;
				  position: absolute;
				  transform: translateY(10px);
				}
				.--grid .row .header_cell div .sortBtn-down:before{
				  content: '';
				  border: 5px solid transparent;
				  border-bottom: 5px solid #0004;
				  position: absolute;
				  transform: translateY(-2px);
				}
				.--grid .row .header_cell div .sortBtn-down:hover:after{
				  border-top: 5px solid #000;
				}
				.--grid .row .header_cell div .sortBtn-down:hover:before{
				  border-bottom: 5px solid #000;
				}
				.--grid .row .header_cell div .sortBtn-up:after{
				  content: '';
				  border: 5px solid transparent;
				  border-top: 5px solid #0004;
				  position: absolute;
				  transform: translateY(10px);
				}
				.--grid .row .header_cell div .sortBtn-up:before{
				  content: '';
				  border: 5px solid transparent;
				  border-bottom: 5px solid #000;
				  position: absolute;
				  transform: translateY(-2px);
				}
				.--grid .row .header_cell div .sortBtn-up:hover:after{
				  border-top: 5px solid #000;
				}
				.--grid .row .header_cell div .sortBtn-up:hover:before{
				  border-bottom: 5px solid #000;
				}`;
			document.getElementsByTagName("body")[0].appendChild(style);
			self.data = {...args.dataSet};
			Object.assign(self, args);
			self.sortingChange = {
				state: 'sortBtn',
				column: null
			};
			self.cells = [];
			self.columns = [];
			self.headers = [];
				self.resize();
				window.addEventListener('resize', function () {
					self.resize();
				});
				return self;
		}
		search_init() {
			const self = this;
			if (!self.searchable) return;
			const row = document.createElement('div');
			row.classList.add('row');
			row.classList.add('search_row');
			if (!self.border) row.style.padding = self.margin;
			const div = document.createElement('div');
			div.classList.add('input');
			const icon = document.createElement('img');
			icon.classList.add('input_icon');
			icon.src = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjUwLjMxMyAyNTAuMzEzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNTAuMzEzIDI1MC4zMTM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJTZWFyY2giPg0KCTxwYXRoIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDsiIGQ9Ik0yNDQuMTg2LDIxNC42MDRsLTU0LjM3OS01NC4zNzhjLTAuMjg5LTAuMjg5LTAuNjI4LTAuNDkxLTAuOTMtMC43Ng0KCQljMTAuNy0xNi4yMzEsMTYuOTQ1LTM1LjY2LDE2Ljk0NS01Ni41NTRDMjA1LjgyMiw0Ni4wNzUsMTU5Ljc0NywwLDEwMi45MTEsMFMwLDQ2LjA3NSwwLDEwMi45MTENCgkJYzAsNTYuODM1LDQ2LjA3NCwxMDIuOTExLDEwMi45MSwxMDIuOTExYzIwLjg5NSwwLDQwLjMyMy02LjI0NSw1Ni41NTQtMTYuOTQ1YzAuMjY5LDAuMzAxLDAuNDcsMC42NCwwLjc1OSwwLjkyOWw1NC4zOCw1NC4zOA0KCQljOC4xNjksOC4xNjgsMjEuNDEzLDguMTY4LDI5LjU4MywwQzI1Mi4zNTQsMjM2LjAxNywyNTIuMzU0LDIyMi43NzMsMjQ0LjE4NiwyMTQuNjA0eiBNMTAyLjkxMSwxNzAuMTQ2DQoJCWMtMzcuMTM0LDAtNjcuMjM2LTMwLjEwMi02Ny4yMzYtNjcuMjM1YzAtMzcuMTM0LDMwLjEwMy02Ny4yMzYsNjcuMjM2LTY3LjIzNmMzNy4xMzIsMCw2Ny4yMzUsMzAuMTAzLDY3LjIzNSw2Ny4yMzYNCgkJQzE3MC4xNDYsMTQwLjA0NCwxNDAuMDQzLDE3MC4xNDYsMTAyLjkxMSwxNzAuMTQ2eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=`;
			const input = document.createElement('input');
			input.classList.add('input_line');
			input.type = 'text';
			input.placeholder = 'search';
			div.appendChild(icon);
			input.addEventListener('focus', function () {
				this.placeholder = '';
			}, false);
			input.addEventListener('blur', function () {
				this.placeholder = 'search';
			});
			input.addEventListener('keyup', function () {
				let rows = [...self.grid.getElementsByClassName('content-row')].filter(row => ![...row.childNodes].some(cell => cell.innerText.toUpperCase().indexOf(input.value.toUpperCase()) != -1));
				[...self.grid.getElementsByClassName('content-row')].forEach(row => {
					row.style.display = 'flex';
					[...row.childNodes].forEach(cell => {
						if (cell.innerText.toUpperCase().indexOf(input.value.toUpperCase()) != -1 && rows.length != 0) cell.style.backgroundColor = '#fff7ae';
						else cell.style.backgroundColor = self.backgroundColor;
					});
				});
				if (rows.length != 0) rows.forEach(elem => elem.style.display = 'none');
			});
			div.appendChild(input);
			row.appendChild(div);
			self.grid.appendChild(row);
		}
		resize() {
			const self = this;
			self.update();
		}
		headerCell_init(elem, row, index) {
			const self = this;
			let headerCell = document.createElement('div');
			headerCell.classList.add('header_cell');
			self.headerHover ? headerCell.classList.add('hover') : false;
			self.headerPointer ? headerCell.classList.add('pointer') : false;
			elem.width ? headerCell.style.width = elem.width : headerCell.style.flex = '1 1 0%';
			elem.width ? headerCell.style.minWidth = elem.width : headerCell.style.flex = '1 1 0%';
			self.headerBackgroundColor ? headerCell.style.background = self.headerBackgroundColor : false;
			self.headerColor ? headerCell.style.color = self.headerColor : false;
			elem.horizontal ? headerCell.style.justifyContent = elem.horizontal :
				self.horizontal ? headerCell.style.justifyContent = self.horizontal : false ;
			headerCell.style.margin = self.margin;
			headerCell.style.padding = self.padding;
			if (self.border) {
				headerCell.style.boxShadow = '0px 0px 0px 1px #000';
				headerCell.style.margin = '1px 0px';
			}
			elem.vertical ? headerCell.style.alignItems = elem.vertical :
				self.vertical ? headerCell.style.alignItems = self.vertical : false ;

			headerCell.innerHTML = `<div>${elem.title}</div>`;
			if (self.sorting && elem.key != 'checkbox') self.sort_init(headerCell, elem, index);
			row.appendChild(headerCell);
			headerCell.addEventListener('click', function () {
				if (self.headerEvent) {
					if (typeof self.headerEvent == 'function') self.headerEvent(headerCell, elem);
				}
			});
			elem.elem = headerCell;
		}
		sort_init(cell, elem, index) {
			const self = this;
			const title = [...cell.childNodes][0];
			const sortBtn = document.createElement('div');
			if (index == self.sortingChange.column) sortBtn.classList = self.sortingChange.state ; else sortBtn.classList.add('sortBtn');
			title.style.display = 'flex';
			sortBtn.addEventListener('click', function () {
				if (typeof [...sortBtn.classList][1] == 'undefined') {
					sortBtn.classList.add('sortBtn-up');
					self.sortingChange.state = 'sortBtn sortBtn-up';
				} else
				switch ([...sortBtn.classList][1]) {
					case 'sortBtn-up': sortBtn.classList.remove('sortBtn-up'); sortBtn.classList.add('sortBtn-down'); self.sortingChange.state = 'sortBtn sortBtn-down';	break;
					case 'sortBtn-down': sortBtn.classList.remove('sortBtn-down');  self.sortingChange.state = 'sortBtn';break;
					default: false;
				}
				self.sortingChange.column = index;
				self.update();
			});
			title.appendChild(sortBtn);
		}
		header_init() {
			const self = this;
			if (!self.header) return;
			const row = document.createElement('div');
			row.classList.add('row');
			if (self.checkbox && !self.header.some(head => head.key == 'checkbox')) self.header.unshift({title: '', width: '50px', key: 'checkbox'});
			self.header.forEach((elem, index) => self.headerCell_init(elem, row, index));
			self.grid.appendChild(row);
			self.headerRow = row;
		}
		data_init() {
			const self = this;
			if (!self.data) return;
			self.rows = [];
			let max = 0;
			for (let key in self.data) max < self.data[key].length ? max = self.data[key].length : false;
			for (let key in self.data) for (let i = 0; i < max; i++) if (typeof self.data[key][i] == 'undefined') self.data[key][i] = '';
			if (self.checkbox) self.data.checkbox = [];
			for (let i = 0; i < max; i++) {
				const row = document.createElement('div');
				row.classList.add('row');
				row.classList.add('content-row');
				self.grid.appendChild(row);
				self.rows.push(row);
				if (self.checkbox) self.data.checkbox.push(`<div class="checkbox"></div>`);
			}
			self.sortUpdate();
			self.header.forEach((key, index) => self.forEachKey(self.data[key.key], key.key, index));
		}
		sortUpdate() {
			const self = this;
			let order = [];
			self.header.forEach((elem, index) => {
				if (self.sortingChange.column == index && self.dataSet[elem.key]) {
					self.data[elem.key] = [...self.dataSet[elem.key]];
					if (self.sortingChange.state == 'sortBtn sortBtn-down') self.data[elem.key] = self.data[elem.key].sort();
					if (self.sortingChange.state == 'sortBtn sortBtn-up') self.data[elem.key] = self.data[elem.key].sort().reverse();
					[...self.dataSet[elem.key]].forEach(first => self.data[elem.key].forEach((second,index) => first == second ? order.push(index) : false));
				}
			});
			order = Array.from(new Set(order));
			if (order.length > 0) {
				self.header.forEach((elem, index) => {
					if (self.sortingChange.column != index && self.dataSet[elem.key]) {
						self.data[elem.key] = [...self.dataSet[elem.key]];
						order.forEach((num,index) => self.data[elem.key][num] = [...self.dataSet[elem.key]][index]);
					}
				});
			}
		}
		findIndex(array, el) {
			const self = this;
			let index = null;
			array.forEach((elem, i) => {
				if (elem == el) index = i;
			});
			return index;
		}
		forEachKey(data, key, key_index) {
			const self = this;
			if (!Array.isArray(data)) return false;
			data.forEach((elem, index) => {
				const cell = document.createElement('div');
				cell.classList.add('cell');
				cell.innerHTML = elem;
				let option = self.header.filter(elem => elem.key == key)[0];
				if (option) {
					if (option.key == 'checkbox') self.checkboxEvents(cell);
					(self.cellHover && option.key != 'checkbox') ? cell.classList.add('hover') : false;
					self.cellPointer ? cell.classList.add('pointer') : false;
					cell.style.margin = self.margin;
					if (self.border) {
						if (self.border == 'full') cell.style.boxShadow = '0px 0px 0px 1px #000';
						else cell.style.boxShadow = '0px 1px 0px 1px #000';
						cell.style.margin = '0px';
					}
					setTimeout(function () {
						cell.style.width = option.elem.getBoundingClientRect().width-10+'px';
						cell.style.maxWidth = option.elem.getBoundingClientRect().width-10+'px';
					}, 0);
					cell.style.minHeight = parseInt(self.padding) * 2 +'px';
					self.headerBackgroundColor ? cell.style.backgroundColor = self.color : false;
					self.backgroundColor ? cell.style.backgroundColor = self.backgroundColor : false;
					self.color ? cell.style.color = self.color : false;
					option.horizontal ? cell.style.justifyContent = option.horizontal :
						self.horizontal ? cell.style.justifyContent = self.horizontal : false ;
					option.vertical ? cell.style.alignItems = option.vertical :
						self.vertical ? cell.style.alignItems = self.vertical : false ;
					if (self.rows[index]) {
						self.rows[index].appendChild(cell);
						self.cells.push(cell);
						cell.addEventListener('click', function () {
							if (self.cellEvent && option.key != 'checkbox') {
								if (typeof self.cellEvent == 'function') self.cellEvent(cell, option);
							}
						});
					}
				}
			});
		}
		checkboxEvents(cell) {
			const self = this;
			const checkbox = [...cell.childNodes][0];
			cell.addEventListener('click', function () {
				checkbox.classList.toggle('checked');
				if (self.checkboxEvent) {
					if (typeof self.checkboxEvent == 'function') self.checkboxEvent([...checkbox.classList].some(elem => elem == 'checked'), cell, checkbox);
				}
			});
		}
		update() {
			const self = this;
			self.grid.innerHTML = '';
			if (self.searchable) self.search_init();
			if (self.header) self.header_init();
			if (self.data) self.data_init();
			if (self.headerHide) self.headerRow.style.display = 'none';
		}
	};
