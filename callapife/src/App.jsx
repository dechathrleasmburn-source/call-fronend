import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost:4000/api/products";
const CATEGORY_API_URL = "http://localhost:4000/api/categories"; // เพิ่มตัวแปรสำหรับ API Category เพื่อความสะอาดของโค้ด

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // --- Product States ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  // --- Category States ---
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState(null); // เพิ่ม State สำหรับแก้ไข Category

  const loadData = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Fetch products unsuccess:", error));

    fetch(CATEGORY_API_URL)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Fetch categories unsuccess:", error));
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  //                PRODUCTS
  // ==========================================
  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setStock("");
  };

  const handleSubmit = () => {
    const productData = { name, price: Number(price), stock: Number(stock) };

    if (editingId) {
      fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      })
        .then((res) => res.json())
        .then(() => {
          loadData();
          resetForm();
        })
        .catch((error) => console.error("Update product unsuccess:", error));
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      })
        .then((res) => res.json())
        .then(() => {
          loadData();
          resetForm();
        })
        .catch((error) => console.error("Add product unsuccess:", error));
    }
  };

  const handleDeleteProduct = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => loadData())
      .catch((error) => console.error("Delete product unsuccess:", error));
  };

  // ==========================================
  //               CATEGORIES
  // ==========================================
  
  // ฟังก์ชันดึงข้อมูลมาใส่ฟอร์มตอนกดปุ่ม Edit Category
  const handleEditCategory = (category) => {
    setEditingCatId(category.id);
    setCatName(category.name);
    setCatDesc(category.description || "");
  };

  // ฟังก์ชันล้างฟอร์ม Category
  const resetCatForm = () => {
    setEditingCatId(null);
    setCatName("");
    setCatDesc("");
  };

  // ฟังก์ชัน Submit สำหรับ Category (ใช้ร่วมกันทั้ง Add และ Edit)
  const handleCatSubmit = () => {
    const categoryData = { name: catName, description: catDesc };

    if (editingCatId) {
      // Edit Category (PUT)
      fetch(`${CATEGORY_API_URL}/${editingCatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
      })
        .then((res) => res.json())
        .then(() => {
          loadData();
          resetCatForm();
        })
        .catch((error) => console.error("Update category unsuccess:", error));
    } else {
      // Add Category (POST)
      fetch(CATEGORY_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
      })
        .then((res) => res.json())
        .then(() => {
          loadData();
          resetCatForm();
        })
        .catch((error) => console.error("Add category unsuccess:", error));
    }
  };

  const handleDeleteCategory = (id) => {
    fetch(`${CATEGORY_API_URL}/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => loadData())
      .catch((error) => console.error("Delete category unsuccess:", error));
  };

  return (
    <div className='container mt-4 mb-5'>
      <h1 className='mb-4'>Products list</h1>

      {/* Product Form */}
      <div className='card p-3 mb-4'>
        <h5>{editingId ? "Edit Product" : "Add Product"}</h5>
        <div className='row g-2'>
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
              placeholder='Product price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className='col'>
            <input
              type="number"
              className='form-control'
              placeholder='Product Stock'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className='col-auto'>
            <button 
              className={editingId ? "btn btn-success" : "btn btn-primary"} 
              onClick={handleSubmit}
            >
              {editingId ? "บันทึกการแก้ไข" : "เพิ่ม"}
            </button>
            {editingId && (
              <button className="btn btn-secondary ms-2" onClick={resetForm}>
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <table className='table table-bordered table-striped mb-5'>
        <thead className='table-dark'>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Amountd</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prd) => (
            <tr key={prd.id}>
              <td>{prd.id}</td>
              <td>{prd.name}</td>
              <td>{prd.price}</td>
              <td>{prd.stock}</td>
              <td>
                <button 
                  className='btn btn-warning btn-sm me-2' 
                  onClick={() => handleEdit(prd)}
                >
                  Edit
                </button>
                <button 
                  className='btn btn-danger btn-sm' 
                  onClick={() => handleDeleteProduct(prd.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Categories Section */}
      <h1 className='mb-4'>Categories list</h1>

      {/* Category Form */}
      <div className='card p-3 mb-4'>
        <h5>{editingCatId ? "Edit Category" : "Add Category"}</h5>
        <div className='row g-2'>
          <div className='col'>
            <input
              type="text"
              className='form-control'
              placeholder='Category Name'
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
          </div>
          <div className='col'>
            <input
              type="text"
              className='form-control'
              placeholder='Description'
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
            />
          </div>
          <div className='col-auto'>
            <button 
              className='btn btn-success' 
              onClick={handleCatSubmit}
            >
              {editingCatId ? "บันทึกการแก้ไข" : "Add Category"}
            </button>
            {editingCatId && (
              <button className="btn btn-secondary ms-2" onClick={resetCatForm}>
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <table className='table table-bordered table-striped'>
        <thead className='table-dark'>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description || '-'}</td>
              <td>
                <button 
                  className='btn btn-warning btn-sm me-2' 
                  onClick={() => handleEditCategory(cat)}
                >
                  Edit
                </button>
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
  );
};

export default App;