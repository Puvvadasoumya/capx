import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AddEditStock = () => {
  const [stock, setStock] = useState({
    name: '',
    ticker: '',
    quantity: 0,
    buyPrice: 0,
  });

  const { id } = useParams(); // Get stock ID from URL params (for edit mode)
  const navigate = useNavigate();

  // Fetch stock details if editing
  useEffect(() => {
    if (id) {
      const fetchStock = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/stocks/${id}`);
          setStock(response.data);
        } catch (error) {
          console.error('Error fetching stock:', error);
          alert('Failed to fetch stock details.');
        }
      };
      fetchStock();
    }
  }, [id]);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update the stock if an ID is provided (edit mode)
        await axios.put(`http://localhost:5000/api/stocks/${id}`, stock);
        alert('Stock updated successfully!');
      } else {
        // Add a new stock if no ID (add mode)
        await axios.post('http://localhost:5000/api/stocks', stock);
        alert('Stock added successfully!');
      }
      navigate('/stocks'); // Redirect to stock list after success
    } catch (error) {
      console.error('Error saving stock:', error);
      alert('Failed to save stock.');
    }
  };

  // Function to handle deletion of the stock
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this stock?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/stocks/${id}`);
        alert('Stock deleted successfully!');
        navigate('/stocks'); // Redirect to stock list after deletion
      } catch (error) {
        console.error('Error deleting stock:', error);
        alert('Failed to delete stock.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Stock' : 'Add Stock'}</h2>
      <label>
        Stock Name:
        <input type="text" name="name" value={stock.name} onChange={handleChange} />
      </label>
      <label>
        Ticker:
        <input type="text" name="ticker" value={stock.ticker} onChange={handleChange} />
      </label>
      <label>
        Quantity:
        <input type="number" name="quantity" value={stock.quantity} onChange={handleChange} />
      </label>
      <label>
        Buy Price:
        <input type="number" name="buyPrice" value={stock.buyPrice} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
      
      {/* Show delete button only if stock is being edited (id exists) */}
      {id && (
        <button
          type="button"
          onClick={handleDelete}
          style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
        >
          Delete
        </button>
      )}
    </form>
  );
};

export default AddEditStock;
  