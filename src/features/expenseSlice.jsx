import { createSlice } from "@reduxjs/toolkit";

const isPremiumUser = localStorage.getItem("premiumFeature");

const initialExpenseState = {
  expenses: [],
  enableEditingMode: false,
  totalExpense: 0,
  premiumFeatures: !!isPremiumUser,
  darkMode: true,
};

//Update premium features function
const updatePremiumFeatures = (state) => {
  if (state.totalExpense >= 10000) {
    state.premiumFeatures = true;
    localStorage.setItem("premiumFeature", true);
  } else {
    state.premiumFeatures = false;
    localStorage.setItem("premiumFeature", false);
  }
  if (state.premiumFeatures) {
    state.darkMode = true;
  } else {
    state.darkMode = false;
  }
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
        updatePremiumFeatures(state);
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
      updatePremiumFeatures(state);
    },
    addExpense(state, action) {
      const { id, expenseDetail } = action.payload;
      const amount = +expenseDetail.amount;
      state.expenses.push({ id, ...expenseDetail });
      state.totalExpense = state.totalExpense + amount;
      updatePremiumFeatures(state);
    },
    toggleEditExpense(state) {
      state.enableEditingMode = true;
    },
    addTotalExpense(state, action) {
      state.totalExpense = action.payload.totalAmount;
      updatePremiumFeatures(state);
    },
    toggleDarkthem(state) {
      if (state.premiumFeatures) {
        state.darkMode = !state.darkMode;
      }
    },
  },
});

export default expenseSlice;
