const notes = [];
let divsArray = [];

const render = () => {
  divsArray = [];
  const length = notes.length;

  notes.forEach((el, i) => {
    const div = `<div class="expense">
                  <div class="shop">
                    <p>
                    ${length - i}. 
                    </p>
                    <input class="editable-data" disabled type="text" value='${el.shop}'></input>
                  </div>
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
  document.getElementsByClassName('print-shop')[0].children[1].value = null;
  document.getElementsByClassName('print-amount')[0].children[1].value = null;
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

      if (elem.shop === previousShopName && elem.amount === previousAmount && elem.date === previousDate) {
        const date = new Date(dateInput.value);
        
        elem.shop = shopInput.value;
        elem.amount = amountInput.value;
        elem.date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

        render();
      }
    });
  }
}
    