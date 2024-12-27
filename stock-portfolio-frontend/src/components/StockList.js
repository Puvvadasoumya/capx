import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Track the stock being edited
  const [updatedStock, setUpdatedStock] = useState({ name: '', ticker: '', quantity: '', buyPrice: '' });

  // Fetch stocks from the server
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stocks');
        setStocks(response.data.stocks); // Assuming response contains the 'stocks' array
      } catch (error) {
        console.error('Error fetching stocks:', error);
        alert('Failed to fetch stocks.');
      }
    };

    fetchStocks();
  }, []);

  // Handle stock update
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/stocks/${id}`, updatedStock);
      setStocks(stocks.map(stock => stock._id === id ? { ...stock, ...updatedStock } : stock));
      setIsEditing(null); // Close the editing form
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock.');
    }
  };

  // Handle stock delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/stocks/${id}`);
      setStocks(stocks.filter(stock => stock._id !== id));
      alert('Stock deleted successfully!');
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert('Failed to delete stock.');
    }
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) return; // No movement

    const reorderedStocks = Array.from(stocks);
    const [removed] = reorderedStocks.splice(source.index, 1);
    reorderedStocks.splice(destination.index, 0, removed);

    setStocks(reorderedStocks);

    // Optionally, update order in the database
    // await axios.put('http://localhost:5000/api/stocks/order', reorderedStocks);
  };

  // Handle input changes for the edit form
  const handleInputChange = (e) => {
    setUpdatedStock({ ...updatedStock, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Stock List</h2>

      {stocks.length === 0 ? (
        <p>No stocks available. Add one!</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="stocks-list">
            {(provided) => (
              <table ref={provided.innerRef} {...provided.droppableProps}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Ticker</th>
                    <th>Quantity</th>
                    <th>Buy Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, index) => (
                    <Draggable key={stock._id} draggableId={stock._id} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <td>{isEditing === stock._id ? (
                            <input
                              type="text"
                              name="name"
                              value={updatedStock.name || stock.name}
                              onChange={handleInputChange}
                            />
                          ) : stock.name}</td>

                          <td>{isEditing === stock._id ? (
                            <input
                              type="text"
                              name="ticker"
                              value={updatedStock.ticker || stock.ticker}
                              onChange={handleInputChange}
                            />
                          ) : stock.ticker}</td>

                          <td>{isEditing === stock._id ? (
                            <input
                              type="number"
                              name="quantity"
                              value={updatedStock.quantity || stock.quantity}
                              onChange={handleInputChange}
                            />
                          ) : stock.quantity}</td>

                          <td>{isEditing === stock._id ? (
                            <input
                              type="number"
                              name="buyPrice"
                              value={updatedStock.buyPrice || stock.buyPrice}
                              onChange={handleInputChange}
                            />
                          ) : stock.buyPrice}</td>

                          <td>
                            {isEditing === stock._id ? (
                              <button onClick={() => handleUpdate(stock._id)}>Save</button>
                            ) : (
                              <button onClick={() => setIsEditing(stock._id)}>Edit</button>
                            )}
                            <button onClick={() => handleDelete(stock._id)}>Delete</button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default StockList;
