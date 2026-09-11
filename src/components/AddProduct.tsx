import { ChangeEvent, FormEvent, useState } from "react";

interface Product {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}
interface addProductProps {
  productsList: Product[];
  defaultCategory: string;
  onAddProduct: (
    name: string,
    category: string,
    price: number,
    inStock: number,
  ) => void;
}
const MAX_TITLE_LENGTH = 25;

export default function AddProduct(props: addProductProps) {
  const [draftName, setDraftName] = useState("");
  const [draftPrice, setDraftPrice] = useState(0);
  const [draftCategory, setDraftCategory] = useState("");
  const [draftInStock, setDraftInStock] = useState(0);
  const [formError, setFormError] = useState("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftName(event.target.value);
  }

  function handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftPrice(Number(event.target.value));
  }

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    setDraftCategory(event.target.value);
  }

  function handleInStockChange(event: ChangeEvent<HTMLSelectElement>) {
    setDraftInStock(Number(event.target.value));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedTitle = draftName.trim();

    if (!trimmedTitle) {
      setFormError("Title can't be empty.");
      return;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setFormError(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
      return;
    }

    props.onAddProduct(trimmedTitle, draftCategory, draftPrice, draftInStock);

    setDraftName("");
    setFormError("");
    setDraftPrice(0);
    setDraftCategory("");
    setDraftInStock(0);
  }
  const categoryList = props.productsList
    .map((product) => product.category)
    .filter((category, index, array) => array.indexOf(category) === index);
  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <input
        type="number"
        className="add-product-input"
        placeholder="Add a price..."
        value={draftPrice}
        onChange={handlePriceChange}
      />

      <select
        className="add-product-select"
        value={draftCategory}
        onChange={handleCategoryChange}
      >
        <option value={props.defaultCategory}>Select Category</option>
        {categoryList.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select>
      <select
        className="add-product-select"
        value={draftInStock}
        onChange={handleInStockChange}
      >
        <option value={0}>Choose status</option>
        <option value={1}>Out of Stock</option>
        <option value={2}>In Stock</option>
      </select>

      <input
        type="text"
        className="add-product-input"
        placeholder="Add a new product..."
        value={draftName}
        onChange={handleNameChange}
      />

      <button className="add-product-button" type="submit">
        Add Product
      </button>
      {formError !== "" && <p className="form-error">{formError}</p>}
    </form>
  );
}
