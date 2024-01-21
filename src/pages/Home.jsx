import Layout from "../layout/Layout";
import { Button, Container } from "react-bootstrap";
import classes from "./Products.module.css";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import ExpenseCard from "../components/Expense/ExpenseCard";
import { expenseAction } from "../store/redux";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expense.expenses);
  const totalExpense = useSelector((state) => state.expense.totalExpense);
  const displayName = useSelector((state) => state.profile.displayName);
  const darkMode = useSelector((state) => state.expense.darkMode);
  const isProfileCompleted = useSelector(
    (state) => state.profile.isProfileCompleted
  );
  const premiumFeatures = useSelector((state) => state.expense.premiumFeatures);
  const [profileForm, setProfileForm] = useState(true);
  const [toggleAddExpense, setToggleAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const dateInput = useRef();
  const categoryInput = useRef();
  const itemInput = useRef();
  const amountInput = useRef();

  const profileFormShowHandler = () => {
    setProfileForm((previousState) => !previousState);
  };

  const getExpenseDetails = async () => {
    try {
      const uid = JSON.parse(localStorage.getItem("user")).uid;
      const url = `https://expense-tracker-4e541-default-rtdb.firebaseio.com/users/${uid}/expense.json`;
      const response = await Axios.get(url);
      const expensesArray = Object.keys(response.data).map((id) => ({
        id: id,
        ...response.data[id].data,
      }));
      const totalAmount = expensesArray.reduce(
        (total, item) => total + parseFloat(item.amount),
        0
      );
      dispatch(
        expenseAction.setExpense({
          expenseDetail: expensesArray,
        })
      );
      dispatch(expenseAction.addTotalExpense({ totalAmount }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const saveUserDetail = async () => {
      const url =
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDnQXjr5tNZXPbL9WtgBFFTTu-kuqq2jGM";
      const user = JSON.parse(localStorage.getItem("user"));
      const idToken = user.tokenId;
      try {
        const response = await Axios.post(url, {
          idToken,
          returnSecureToken: true,
        });
        const { displayName, emailVerified, photoUrl } = response.data.users[0];
        const modifiedUser = { ...user, displayName, emailVerified, photoUrl };
        localStorage.setItem("user", JSON.stringify(modifiedUser));
      } catch (error) {
        console.log(error);
      }
    };
    saveUserDetail();
  }, []);
  useEffect(() => {
    getExpenseDetails();
  }, []);

  const expenseFormHandler = async (event) => {
    event.preventDefault();
    const date = new Date(dateInput.current.value);
    const item = itemInput.current.value;
    const amount = +amountInput.current.value;
    const category = categoryInput.current.value;
    const expenseDetail = {
      date,
      item,
      amount,
      category,
    };
    if (editingExpenseId) {
      try {
        const uid = JSON.parse(localStorage.getItem("user")).uid;
        const url = `https://expense-tracker-4e541-default-rtdb.firebaseio.com/users/${uid}/expense/${editingExpenseId}.json`;
        const response = await Axios.patch(url, {
          data: expenseDetail,
        });
        const { date, item, amount, category } = response.data.data;
        const updatedExpense = { date, item, amount, category };
        dispatch(
          expenseAction.editExpense({
            id: editingExpenseId,
            updatedExpense,
          })
        );
        setToggleAddExpense(false);
        setEditingExpenseId(null);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const uid = JSON.parse(localStorage.getItem("user")).uid;
        const url = `https://expense-tracker-4e541-default-rtdb.firebaseio.com/users/${uid}/expense.json`;
        const response = await Axios.post(url, {
          data: expenseDetail,
        });

        const id = response.data.name;
        dispatch(
          expenseAction.addExpense({ id: id, expenseDetail: expenseDetail })
        );
      } catch (error) {
        console.log(error);
      }
    }
    categoryInput.current.value = "";
    itemInput.current.value = "";
    amountInput.current.value = "";
    dateInput.current.value = "";
  };

  const handleOnEditClick = (expenseId) => {
    const expenseToEdit = expenses.find((item) => item.id === expenseId);
    const isoDateString = new Date(expenseToEdit.date)
      .toISOString()
      .split("T")[0];
    categoryInput.current.value = expenseToEdit.category;
    itemInput.current.value = expenseToEdit.item;
    amountInput.current.value = expenseToEdit.amount;
    dateInput.current.value = isoDateString;
    setToggleAddExpense(true);
    setEditingExpenseId(expenseId);
    dispatch(expenseAction.toggleEditExpense());
  };

  const handleOnDeleteClick = async (expenseId) => {
    const uid = JSON.parse(localStorage.getItem("user")).uid;
    const url = `https://expense-tracker-4e541-default-rtdb.firebaseio.com/users/${uid}/expense/${expenseId}.json`;
    try {
      await Axios.delete(url);
      dispatch(expenseAction.deleteExpense({ id: expenseId }));
    } catch (error) {
      console.log(error);
    }
  };
  let downloadUrl = "";
  const handleDownload = async () => {
    //Heading for csv data table
    const csvHeader = "Date,Item,Category,Amount\n";

    //Converting expenses to CSV format
    const toCSV = expenses
      .map((expense) => {
        const { date, item, category, amount } = expense;
        return `${date.substring(0, 10)},${item},${category},${amount}`;
      })
      .join("\n");
    const blobData = new Blob([csvHeader, toCSV], { type: "csv/text" });
    downloadUrl = URL.createObjectURL(blobData);

    //Create a temporary download anchor tag
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = "expenses.csv";
    document.body.appendChild(downloadLink);

    // Trigger the download and remove the temporary downloadLink element
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDarkTheme = () => {
    dispatch(expenseAction.toggleDarkthem());
  };

  return (
    <Layout>
      {!profileForm ? (
        <Navigate to="/profile" />
      ) : (
        <Container>
          <div
            className={`${classes.updateProfileContainer} container d-md-flex flex-row justify-content-between mt-3`}
          >
            <h4 className="d-flex justify-content-center align-items-center text-md">
              Welcome{" "}
              <span className="text-primary" style={{ marginLeft: "10px" }}>
                {isProfileCompleted ? displayName : "Saver"}
              </span>
            </h4>
            <h4 className="d-flex justify-content-center align-items-center text-md">
              Your Expenses ={" "}
              <span className="text-primary" style={{ marginLeft: "10px" }}>
                Rs. {totalExpense}
              </span>
            </h4>

            {!isProfileCompleted ? (
              <div>
                <button onClick={profileFormShowHandler}>
                  Your profile is incomplete.{" "}
                  <span className="text-primary">Complete it now</span>
                </button>
              </div>
            ) : null}
          </div>
        </Container>
      )}
      <form className="container mt-3 " onSubmit={expenseFormHandler}>
        <div className="row align-items-center flex-column gy-2 flex-md-row">
          <div className="col">
            <input
              type="date"
              className="form-control"
              ref={dateInput}
              required
            />
          </div>

          <div className="col">
            <div className="col">
              <select
                name="category"
                id="category"
                className="form-control"
                ref={categoryInput}
                required
              >
                <option value="" disabled selected hidden>
                  Select Category
                </option>
                <option value="grocery">Grocery</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
              </select>
            </div>
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Item"
              ref={itemInput}
              required
            />
          </div>

          <div className="col d-flex">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                Rs.
              </span>
            </div>
            <input
              type="number"
              className="form-control"
              placeholder="00"
              aria-label="00"
              aria-describedby="basic-addon1"
              ref={amountInput}
              required
            />
          </div>

          {!toggleAddExpense ? (
            <div className="col">
              <input
                type="submit"
                className="form-control"
                value="Add Expense"
                style={{
                  backgroundColor: "transparent",
                  border: "2px solid #007bff",
                }}
              />
            </div>
          ) : (
            <div className="col">
              <input
                type="submit"
                className="form-control"
                value="Update"
                style={{
                  backgroundColor: "transparent",
                  border: "2px solid red",
                }}
              />
            </div>
          )}
        </div>
      </form>
      {premiumFeatures && (
        <div className="container mt-2 d-flex justify-content-center gap-3">
          {darkMode ? (
            <Button onClick={handleDarkTheme}>Turn off dark theme</Button>
          ) : (
            <Button onClick={handleDarkTheme}>Turn on dark theme</Button>
          )}
          <Button onClick={handleDownload}>Download</Button>
        </div>
      )}
      {/* {turnOffDarkTheme
        ? premiumFeatures && (
            <div className="container mt-2 d-flex justify-content-center gap-3">
              <Button onClick={handleDarkTheme}>Turn off dark theme</Button>
              <Button onClick={handleDownload}>Download</Button>
            </div>
          )
        : premiumFeatures && (
            <div className="container mt-2 d-flex justify-content-center gap-3">
              <Button onClick={handleDarkTheme}>Turn on dark theme</Button>
              <Button onClick={handleDownload}>Download</Button>
            </div>
          )}
      {} */}

      <div className="container mt-2 d-flex flex-wrap flex-md-wrap justify-content-center gap-3">
        {expenses.map((item, idx) => {
          return (
            <ExpenseCard
              key={item.id}
              idx={idx}
              expenseItem={item}
              onEditClick={handleOnEditClick}
              onDeleteClick={handleOnDeleteClick}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export default Home;
