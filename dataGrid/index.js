const data = {
  'name': ['Nick', 'Max', 'Alex', 'Brain'],
  'secondname': ['Goodman', 'Woods', 'Marian', 'Silver'],
  'phone': ['555-1556', '41-32-16', '555-3658', '911'],
};


const grid = new DataGrid({
  element: document.getElementById('first_grid'),
  dataSet: data,
  checkbox: true,
  searchable: false,
  header: [
    {title: 'Name', key: 'name'},
    {title: 'Secondname', key: 'secondname'},
    {title: 'Phone', key: 'phone'},
  ],
});

const grid2 = new DataGrid({
  element: document.getElementById('second_grid'),
  dataSet: data,
  searchable: false,
  checkbox: false,
  sorting: false,
  border: false,
  horizontal: 'flex-start',
  vertical: 'center',
  margin: '10px 20px',
  headerBackgroundColor: '#FD018F',
  header: [
    {title: 'Name', key: 'name', backgroundColor: '#fff'},
    {title: 'Secondname', key: 'secondname'},
    {title: 'Phone', key: 'phone', width: '75px'},
  ],
});

const grid3 = new DataGrid({
  element: document.getElementById('third_grid'),
  dataSet: data,
  checkbox: true,
  header: [
    {title: 'Name', key: 'name'},
    {title: 'Secondname', key: 'secondname'},
    {title: 'Phone', key: 'phone'},
  ],
    cellEvent: (elem, column) => {
      console.log(elem);
      console.log(column);
      elem.style.backgroundColor = '#FD018F';
      setTimeout(function () {
        elem.style.backgroundColor = '#FFFFFF';
      }, 200);
    },
    headerEvent: (elem, column) => {
      console.log(elem);
      console.log(column);
      elem.style.backgroundColor = '#FD018F';
      setTimeout(function () {
        elem.style.backgroundColor = '#9d40de';
      }, 200);
    },
    checkboxEvent: (value, cell, checkbox) => {
      console.log(value);
      console.log(cell);
      console.log(checkbox);
      cell.style.backgroundColor = '#FD018F';
      setTimeout(function () {
        cell.style.backgroundColor = '#FFFFFF';
      }, 200);
    },
});


































//
