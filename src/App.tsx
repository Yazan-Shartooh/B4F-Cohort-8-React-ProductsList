import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

type FilterStatus = "all" | "inStock" | "outStock";

const PRODOCT_URL = "/assets/products.json";

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODOCT_URL);
  const products = (await response.json()) as Product[];

  return products;
}

function App() {
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("all");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const [hasProductsError, setHasProductsError] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }

  function handleShowAll() {
    setCurrentFilter("all");
  }

  function handleShowInStock() {
    setCurrentFilter("inStock");
  }

  function handleShowOutStock() {
    setCurrentFilter("outStock");
  }

  function handleToggleProduct(id: number): void {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, inStock: !product.inStock };
      }
      return product;
    });
    setProducts(updatedProducts);
  }
  function handleDeleteProduct(id: number): void {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  }
  function handleSaveEdit(id: number, newName: string): void {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, name: newName };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function AddNewProduct(
    name: string,
    category: string,
    price: number,
    inStock: number,
  ): void {
    let status = true;
    if (inStock === 1) status = true;
    else status = false;

    const draftProduct: Product = {
      id: products.length + 1,
      name: name.trim(),
      category: category.trim(),
      price: price,
      inStock: status,
    };

    const newProducts = [...products, draftProduct];
    setProducts(newProducts);
  }

  const totalProducts = products.length;
  const instockCount = products.reduce(function (count, product) {
    if (product.inStock) {
      return count + 1;
    }
    return count;
  }, 0);
  const outStockCount = totalProducts - instockCount;

  const search = searchText.toLowerCase();

  const visibleProducts = products.filter((product) => {
    let matchesFilter = false;

    if (currentFilter === "all") {
      matchesFilter = true;
    } else if (currentFilter === "inStock" && product.inStock) {
      matchesFilter = true;
    } else if (currentFilter === "outStock" && !product.inStock) {
      matchesFilter = true;
    }

    const name = product.name.toLowerCase();
    const matchesSearch = name.includes(search);

    return matchesFilter && matchesSearch;
  });

  async function loadProductsData() {
    setIsLoadingProducts(true);
    setHasProductsError(false);
    try {
      const _products = await fetchProducts();
      setProducts(_products);
      setIsLoadingProducts(false);
    } catch (error) {
      setIsLoadingProducts(false);
      setHasProductsError(true);
    }
  }
  useEffect(() => {
    loadProductsData();
  }, []);
  return (
    <div>
      <Header />

      <main className="container">
        <section className="stats">
          <StatCard label="All Products" value={totalProducts} />
          <StatCard label="In Stock" value={instockCount} />
          <StatCard label="Out of Stock" value={outStockCount} />
        </section>

        <AddProduct
          productsList={products}
          defaultCategory={""}
          onAddProduct={AddNewProduct}
        />

        <section className="search">
          <input
            type="text"
            className="search-input"
            placeholder="Search product..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </section>

        <section className="filters">
          <button
            className={
              "filter-button" + (currentFilter === "all" ? " active" : "")
            }
            onClick={handleShowAll}
          >
            All
          </button>
          <button
            className={
              "filter-button" + (currentFilter === "inStock" ? " active" : "")
            }
            onClick={handleShowInStock}
          >
            InStock
          </button>
          <button
            className={
              "filter-button" + (currentFilter === "outStock" ? " active" : "")
            }
            onClick={handleShowOutStock}
          >
            Out of Stock
          </button>
        </section>

        {isLoadingProducts && <p className="message">Loading tasks...</p>}
        {!isLoadingProducts && hasProductsError && (
          <div className="message error">
            <p>
              We could not load the products. Please check your internet
              connection and try again.
            </p>
            <button className="retry-button" onClick={loadProductsData}>
              Retry
            </button>
          </div>
        )}
        <ul className="product-list">
          {!isLoadingProducts &&
          !hasProductsError &&
          visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <ProductList
                id={product.id}
                name={product.name}
                price={product.price}
                inStock={product.inStock}
                category={product.category}
                onToggle={handleToggleProduct}
                onDelete={handleDeleteProduct}
                onEdit={handleSaveEdit}
              />
            ))
          ) : (
            <p className="empty-state">No products to show.</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
