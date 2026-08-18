import React, { useEffect, useState } from 'react'

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const loadProducts = () => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Fetch products unsuccess", error));

    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Fetch categories unsuccess", error));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = () => {
    fetch("http://localhost:4000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, stock })
    })
      .then((res) => res.json())
      .then(() => {
        loadProducts();
        setName("");
        setPrice("");
        setStock("");
      })
      .catch((error) => console.error("Add product error", error));
  };

  const handleDelelete = (id) => {
    fetch(`http://localhost:4000/api/products/${id}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then(() => loadProducts())
      .catch((error) => console.error("Delete product error", error));
  };

  const handleDeleteCategory = (id) => {
    fetch(`http://localhost:4000/api/categories/${id}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then(() => loadProducts())
      .catch((error) => console.error("Delete category error", error));
  };

  return (
    <div className='container mt-4 mb-5'>
      <h1 className='mb-3'>Products List</h1>

      <div className='card p-3 mb-4'>
        <h5>Add products</h5>
        <div className='row g-2 mb-3'>
          <div className='col'>
            <input
              type="text"
              className='form-control'
              placeholder='Product Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='col'>
            <input
              type="number"
              className='form-control'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className='col'>
            <input
              type="number"
              className='form-control'
              placeholder='Stock'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>
        <button className='btn btn-primary' onClick={handleAdd}>Add Product</button>
      </div>

      <table className='table table-bordered table-striped mb-5'>
        <thead className='table-dark'>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.map((prd) => (
            <tr key={prd.id}>
              <td>{prd.id}</td>
              <td>{prd.name}</td>
              <td>{prd.price}</td>
              <td>{prd.stock}</td>
              <td>
                <button
                  className='btn btn-danger btn-sm'
                  onClick={() => handleDelelete(prd.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className='mb-3'>Categories List</h1>
      <table className='table table-bordered table-hover'>
        <thead className='table-primary'>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>IsActive</th>
            <th>CreatedAt</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categories) && categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>{String(cat.isActive)}</td>
              <td>{cat.createdAt}</td>
              <td>
                <button
                  className='btn btn-danger btn-sm'
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App