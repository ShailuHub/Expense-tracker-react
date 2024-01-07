import { createSlice } from "@reduxjs/toolkit";

const initialExpenseState = {
  expenses: [],
  enableEditingMode: false,
  totalExpense: 0,
};

const expenseSlice = createSlice({
  name: "Expense",
  initialState: initialExpenseState,
  reducers: {
    setExpense(state, action) {
      state.expenses = [...action.payload.expenseDetail];
    },
    editExpense(state, action) {
      const { id, updatedExpense } = action.payload;
      const idx = state.expenses.findIndex((item) => item.id === id);
      if (idx !== -1) {
        const editAmount = +state.expenses[idx].amount;
        const updatedAmount = +updatedExpense.amount;
        state.expenses[idx] = updatedExpense;
        state.totalExpense = state.totalExpense - editAmount + updatedAmount;
      }
    },
    deleteExpense(state, action) {
      const deleteItem = state.expenses.find(
        (item) => item.id === action.payload.id
      );
      const updatedExpense = state.expenses.filter(
        (item) => item.id !== action.payload.id
      );
      state.expenses = [...updatedExpense];
      state.totalExpense = state.totalExpense - +deleteItem.amount;
    },
    addExpense(state, action) {
      const { id, expenseDetail } = action.payload;
      const amount = +expenseDetail.amount;
      state.expenses.push({ id, ...expenseDetail });
      state.totalExpense = state.totalExpense + amount;
    },
    toggleEditExpense(state) {
      state.enableEditingMode = true;
    },
    addTotalExpense(state, action) {
      state.totalExpense = action.payload.totalAmount;
    },
  },
});

export default expenseSlice;
