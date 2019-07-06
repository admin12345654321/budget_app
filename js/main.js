class UI {
  constructor() {
    this.budget = document.getElementById('budget');
    this.budgetAmount = document.getElementById('budget-amount');
    this.expenses = document.getElementById('expenses');
    this.expensesAmount = document.getElementById('expenses-amount');
    this.balance = document.getElementById('balance');
    this.balanceAmount = document.getElementById('balance-amount');
    this.budgetForm = document.getElementById('budget-form');
    this.budgetInput = document.getElementById('budget-input');
    this.feedBack = document.querySelector('.feedback');
    this.expenseForm = document.getElementById('expense-form');
    this.expenseTitle = document.getElementById('expense-title');
    this.expenseAmount = document.getElementById('expense-amount');
    this.expenseList = document.querySelector('.expense-list');
    this.itemList = [];
    this.itemID = 0;
  }

  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (this.budgetInput.value === '' || this.budgetInput.value < 0) {
      this.feedBack.innerHTML = 'field value cannot be empty or negative';
      this.feedBack.style.display = 'block';
      setTimeout(() => {
        this.feedBack.style.display = 'none';
      }, 4000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      if (parseInt(this.budgetAmount.textContent) === 0) {
        this.budget.classList.remove('showGreen');
        this.budget.classList.add('showBlack');
      } else {
        this.budget.classList.remove('showBlack');
        this.budget.classList.add('showGreen');
      }
      this.showBalance();
    }
  }

  submitExpenseForm() {
    const title = this.expenseTitle.value;
    const amount = this.expenseAmount.value;
    if (this.expenseTitle.value === '' || this.expenseAmount.value === '' || parseInt(this.expenseAmount.value) < 0) {
      this.feedBack.innerHTML = 'field value cannot be empty or negative';
      this.feedBack.style.display = 'block';
      setTimeout(() => {
        this.feedBack.style.display = 'none';
      }, 4000);
    }
    let expense = {
      id: this.itemID,
      title,
      amount
    }
    this.itemID++;
    this.itemList = [...this.itemList, expense];
    this.expenseTitle.value = '';
    this.expenseAmount.value = '';
    this.addExpense(expense);
    this.showBalance();
  }

  editItem(element) {
    const id = parseInt(element.dataset.id);
    const parent = element.parentElement.parentElement;
    // remove from dom
    this.expenseList.removeChild(parent);
    // find element need to edit
    const itemToBeEdited = this.itemList.find(item => item.id === id);
    // show value in input
    this.expenseTitle.value = itemToBeEdited.title;
    this.expenseAmount.value = itemToBeEdited.amount;
    const updatedList = this.itemList.filter(item => item.id !== id);
    this.itemList = updatedList;
    this.showBalance();
  }

  deleteItem(element) {
    const id = parseInt(element.dataset.id);
    const parent = element.parentElement.parentElement;
    this.expenseList.removeChild(parent);
    const updatedList = this.itemList.filter(item => item.id !== id);
    this.itemList = updatedList;
    this.showBalance();
  }

  showBalance() {
    const expense = this.totalExpenses();
    this.balanceAmount.textContent = parseInt(this.budgetAmount.textContent) - expense;
    if (parseInt(this.balanceAmount.textContent) === 0) {
      this.balance.classList.remove('showGreen', 'showRed');
      this.balance.classList.add('showBlack');
    } else if (parseInt(this.balanceAmount.textContent) > 0) {
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');
    } else if (parseInt(this.balanceAmount.textContent) < 0) {
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    }
  }

  totalExpenses() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((acc, curr) => {
        acc += parseInt(curr.amount);
        return acc;
      }, 0);
    }
    this.expensesAmount.textContent = total;
    return total;
  }

  addExpense(expense) {
    let div = document.createElement('div');
    div.classList.add('expense-item', 'd-flex', 'justify-content-between', 'align-items-baseline', 'text-capitalize', 'mb-3');
    div.innerHTML = `
      <h6 class="expense-title" style='margin-bottom: 0'>- ${expense.title}</h6>
      <h6 class="expense-amount" style='margin-bottom: 0'><i class="fas fa-euro-sign"></i>${expense.amount}</h6>
      <div class="expense-icons">
        <a href="#" class="edit-icon mr-2 text-success" data-id='${expense.id}'>
          <i class="fas fa-pen"></i>
        </a>
        <a href="#" class="delete-icon text-danger" data-id='${expense.id}'>
          <i class="fas fa-trash"></i>
        </a>
      </div>
    `;
    this.expenseList.appendChild(div);
  }
}

const eventListeners = () => {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.querySelector('.expense-list');

  const ui = new UI();

  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    ui.submitBudgetForm();
  });

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    ui.submitExpenseForm();
  });

  expenseList.addEventListener('click', (e) => {
    if (e.target.parentElement.classList.contains('edit-icon')) {
      ui.editItem(e.target.parentElement);
    } else if (e.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteItem(e.target.parentElement);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  eventListeners();
});