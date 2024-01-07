import "./ExpenseCard.css";

const ExpenseCard = (props) => {
  const idx = props.idx;
  const dateObject = new Date(props.expenseItem.date);
  const date = dateObject.toLocaleDateString();
  const category = props.expenseItem.category.toUpperCase();
  const { id, item, amount } = props.expenseItem;

  const handleOnEdit = async () => {
    props.onEditClick(id);
  };

  const handleOnDelete = () => {
    props.onDeleteClick(id);
  };

  return (
    <div className="expense-card-container">
      <div className="header-container d-flex justify-content-between">
        <h4 className="text-primary">{idx + 1}.</h4>
        <h4 className="date-text">{date}</h4>
      </div>
      <div className="content-container">
        <h3 className="category-text">{category}</h3>
        <p className="item-text">{item}</p>
        <p className="description-text">Rs. {amount}</p>
      </div>
      <div className="button-container d-flex justify-content-between">
        <button className="btn edit-btn" onClick={handleOnEdit}>
          Edit
        </button>
        <button className="btn delete-btn" onClick={handleOnDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
