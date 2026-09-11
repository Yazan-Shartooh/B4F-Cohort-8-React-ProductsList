import { ChangeEvent, useState } from "react";

interface productListProps {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, name: string) => void;
}

const MAX_NAME_LENGTH = 25;
export default function ProductList(props: productListProps) {
  const [editName, setEditName] = useState(props.name);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");

  function handleEditClick() {
    setIsEditing(true);
  }
  function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
    setEditName(event.target.value);
  }
  function handleCancelClick() {
    setIsEditing(false);
    setEditError("");
  }
  function handleSaveClick() {
    const newName = editName.trim();

    if (newName === "") {
      setEditError("Title can't be empty.");
      return;
    }

    if (newName.length > MAX_NAME_LENGTH) {
      setEditError(`Title must be ${MAX_NAME_LENGTH} characters or fewer.`);
      return;
    }

    props.onEdit(props.id, newName);

    setEditError("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="task-item">
        <input
          type="text"
          className="edit-title-input"
          value={editName}
          onChange={handleChangeName}
        />

        <span className="task-actions">
          <button
            className="task-action-button save-button"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button className="task-action-button" onClick={handleCancelClick}>
            Cancel
          </button>
          {editError !== "" && <p className="form-error">{editError}</p>}
        </span>
      </li>
    );
  }

  return (
    <li className="product-item">
      <div className="product-text">
        <span className="product-name">{props.name}</span>
        <span className="product-category">{props.category}</span>
        <span className="product-price">{props.price}$</span>
      </div>
      <div className="product-list-btns">
        <button
          className={`task-action-button ${props.inStock ? "instock" : "outstock"}`}
          onClick={() => props.onToggle(props.id)}
        >
          {props.inStock ? "InStock" : "Out of Stock"}
        </button>
        <button className="task-action-button edit" onClick={handleEditClick}>
          Edit
        </button>
        <button
          className="task-action-button delete"
          onClick={() => props.onDelete(props.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
