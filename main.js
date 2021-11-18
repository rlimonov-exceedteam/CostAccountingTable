const notes = [];
let divsArray = [];

const getAllNotes = async (notes) => {
  const response = await fetch('http://localhost:8000/allNotes', {
    method: 'GET'
  });

  let result;

  if (response.ok) {
    result = await response.json();
  } else {
    alert(`Error HTTP: ${response.status}`);
  }

  for (let el of result.data) {
    notes.push({
                shop,
                date,
                amount,
                _id
               });
  }
}

const render = () => {
  divsArray = [];
  const length = notes.length;

  notes.forEach((el, i) => {
    const div = `<div class="expense">
                  <p class="shop">
                    <span>
                    ${length - i}. 
                    </span>
                    <input class="editable-data" disabled type="text" value="${el.shop}"></input>
                  </p>
                  <div class="date-amount-wrapper">
                    <input class="date editable-data" disabled type="text" value="${el.date}"></input>
                    <input class="amount editable-data" disabled type="text" value="${el.amount} р."></input>
                    <div class="buttons">
                      <button class="edit" onclick="editNote(event)">
                        <img src="images/edit-icon.png">
                      </button>
                      <button class="delete">
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
  const shopName = event.target.parentElement.children[0].children[1].value;
  const amount = event.target.parentElement.children[1].children[1].value;
  const date = new Date();

  notes.push({
    shop: shopName,
    date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
    amount,
   });

  render();
}

const editNote = (event) => {
  const parentDiv = event.target.parentElement.parentElement.parentElement.parentElement;
  const shopInput = parentDiv.children[0].children[1];
  const dataInput = parentDiv.children[1].children[0];
  const amountInput = parentDiv.children[1].children[1];
  const date = new Date();

  shopInput.disabled = false;
  shopInput.classList.value = 'editable-data ready-to-edit';

  dataInput.disabled = false;
  dataInput.value = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  dataInput.type = 'date';
  
}
    