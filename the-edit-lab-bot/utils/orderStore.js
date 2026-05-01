const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'orders.json');

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf8');
}

function loadOrders() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveOrders(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function createOrder(ticketChannelId, orderData) {
  const orders = loadOrders();
  orders[ticketChannelId] = {
    ...orderData,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveOrders(orders);
  return orders[ticketChannelId];
}

function getOrder(ticketChannelId) {
  const orders = loadOrders();
  return orders[ticketChannelId] || null;
}

function updateOrderStatus(ticketChannelId, status) {
  const orders = loadOrders();
  if (!orders[ticketChannelId]) return null;
  orders[ticketChannelId].status = status;
  orders[ticketChannelId].updatedAt = new Date().toISOString();
  saveOrders(orders);
  return orders[ticketChannelId];
}

function getAllOrders() {
  return loadOrders();
}

function deleteOrder(ticketChannelId) {
  const orders = loadOrders();
  delete orders[ticketChannelId];
  saveOrders(orders);
}

module.exports = { createOrder, getOrder, updateOrderStatus, getAllOrders, deleteOrder };
