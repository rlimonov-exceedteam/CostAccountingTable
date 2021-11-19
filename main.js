let notes = [];
let divsArray = [];

const getFromServer = async () => {
  const response = await fetch('http://localhost:8000/allNotes', {
    method: 'GET',
  });

  let result;

  if (response.ok) {
    result = await response.json();
  } else {
    alert(`Error HTTP: ${response.status}`);
    return;
  }
  notes = result.data;
  render();
}

const postOnServer = async (shop, amount, date) => {
  const response = await fetch('http://localhost:8000/createNote',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', 
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      shop,
      amount,
      date
    })
  });
  const result = await response.json();

  if (response.ok) {
    notes.push({
      shop,
      date,
      amount,
      _id: result._id,
    });

    document.getElementsByClassName('print-shop')[0].children[1].value = null;
    document.getElementsByClassName('print-amount')[0].children[1].value = null;
    render();
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
}

const patchOnServer = async (shop, amount, date, _id) => {
  const response = await fetch(`http://localhost:8000/updateNote?_id=${_id}`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', 
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      shop,
      amount,
      date,
      _id
    })
  });
  const result = await response.json();

  if (response.ok) {
    notes.forEach(elem => {

      if (elem._id === _id) {
        elem.shop = shop;
        elem.amount = amount;
        elem.date = date;
      }
    });
    render();
  }
}

const deleteFromServer = async (_id) => {
  const response = await fetch(`http://localhost:8000/deleteNote?_id=${_id}`,{
    method: 'DELETE',
  });

  if (response.ok) {
    notes = notes.filter(elem => elem._id !== _id);
    render();
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
}

const render = () => {
  divsArray = [];

  notes.forEach((el, i) => {
    const { _id, shop, date, amount } = el;
    const div = `<div class="expense" id=${_id}>
                  <div class="shop">
                    <p>
                    ${i + 1}. 
                    </p>
                    <input class="editable-data" disabled type="text" value='${shop}'></input>
                  </div>
                  <div class="date-amount-wrapper">
                    <input class="date editable-data" disabled type="text" value="${date}"></input>
                    <input class="amount editable-data" disabled type="text" value="${amount} р."></input>
                    <div class="buttons">
                      <button class="edit" onclick="editNote(event)">
                        <img src="images/edit-icon.png">
                      </button>
                      <button class="delete" onclick="deleteNote(event)">
                        <img src="images/trash-icon.png">
                      </button>
                    </div>
                  </div>
                </div>`;

    divsArray.unshift(div);
  });

  const allDivs = divsArray.join('');
  document.getElementsByClassName('expenses-root')[0].innerHTML = allDivs;
}  

const addNote = (event) => {
  const parentDiv = event.target.parentElement;
  const [, shopInput] = parentDiv.children[0].children;
  const [, amountInput] = parentDiv.children[1].children;
  const date = new Date(); 

  postOnServer(shopInput.value, 
               amountInput.value, 
               `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
               );
}

const editNote = (event) => {
  const parentDiv = event.target.parentElement.parentElement.parentElement.parentElement;
  const [, shopInput] = parentDiv.children[0].children;
  const [dateInput, amountInput] = parentDiv.children[1].children;
  const editButton = parentDiv.children[1].children[2].children[0];
  const date = new Date();

  const previousShopName = shopInput.value;
  const previousDate = dateInput.value;
  const previousAmount = amountInput.value.substring(0, amountInput.value.indexOf(' '));

  shopInput.disabled = false;
  shopInput.classList.value = 'editable-data ready-to-edit';

  dateInput.disabled = false;
  dateInput.value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  dateInput.type = 'date';
  dateInput.classList.value = 'date editable-data ready-to-edit';

  amountInput.disabled = false;
  amountInput.value = +amountInput.value.substring(0, amountInput.value.indexOf(' '));
  amountInput.type = 'number';
  amountInput.classList.value = 'amount editable-data ready-to-edit';
  
  editButton.onclick = async () => {
    notes.forEach(elem => {
      if (
          elem.shop === previousShopName && 
          elem.amount === previousAmount && 
          elem.date === previousDate
        ) {
        const date = new Date(dateInput.value);
        const newDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        const _id = elem._id;

        patchOnServer(shopInput.value, amountInput.value, newDate, _id);
      }
    });
  }
}

const deleteNote = (event) => {
  const parentDiv = event.target.parentElement.parentElement.parentElement.parentElement;
  const shop = parentDiv.children[0].children[1].value;
  const date = parentDiv.children[1].children[0].value;
  const amountData = parentDiv.children[1].children[1].value;
  const amount = amountData.substring(0, amountData.indexOf(' '));
  const _id = parentDiv.id;
  
  deleteFromServer(_id);
} 

window.onload = async () => {
  getFromServer();
}