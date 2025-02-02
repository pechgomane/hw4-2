// ฟังก์ชันสำหรับสร้าง ID แบบสุ่ม
function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // ฟังก์ชันเพิ่มสินค้า
  function addProduct(productData) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const newProduct = { ...productData, id: generateId(), totalSales: 0 };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
  }


  
  // ฟังก์ชันอัปเดตจำนวนสินค้า
  function updateStock(productId, quantity) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find((p) => p.id === productId);
    if (product) {
      product.inStock += quantity;
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
    }
  }
  
  // ฟังก์ชันขายสินค้า
  function sellProduct(productId, quantity) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find((p) => p.id === productId);
    if (product && product.inStock >= quantity) {
      product.inStock -= quantity;
      product.totalSales += quantity;
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
    } else {
      alert("สินค้าไม่เพียงพอ");
    }
  }
  
  // ฟังก์ชันตรวจสอบสินค้าใกล้หมด
  function checkLowStock() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const lowStockProducts = products.filter((p) => p.inStock < p.minStock);
    const lowStockList = document.getElementById("lowStockList");
    lowStockList.innerHTML = lowStockProducts
      .map((p) => `<li>${p.name} (เหลือ ${p.inStock} ชิ้น)</li>`)
      .join("");
  }
  
  // ฟังก์ชันสร้างรายงานสินค้าขายดี
  function generateSalesReport() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const sortedProducts = products.sort((a, b) => b.totalSales - a.totalSales);
    const salesReport = document.getElementById("salesReport");
    salesReport.innerHTML = sortedProducts
      .map((p) => `<li>${p.name} - ขายได้ ${p.totalSales} ชิ้น</li>`)
      .join("");
  }
  
 // ฟังก์ชันลบสินค้า
function deleteProduct(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const updatedProducts = products.filter((p) => p.id !== productId); // กรองสินค้าที่ไม่ต้องการลบ
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  renderProducts(); // อัปเดตหน้าเว็บ
}

// ฟังก์ชันแสดงรายการสินค้า
function renderProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productTable = document.getElementById("productTable").querySelector("tbody");
  productTable.innerHTML = products
    .map(
      (p) => `
      <tr>
        <td class="p-2">${p.name}</td>
        <td class="p-2">${p.price}</td>
        <td class="p-2">${p.inStock}</td>
        <td class="p-2">${p.category}</td>
        <td class="p-2">${p.totalSales}</td>
        <td class="p-2">
          <button onclick="updateStock('${p.id}', 1)" class="bg-green-500 text-white px-2 py-1 rounded">+1</button>
        </td>
        <td class="p-2">
          <button onclick="sellProduct('${p.id}', 1)" class="bg-red-500 text-white px-2 py-1 rounded">ขาย</button>
        </td>
        <td class="p-2">
          <button onclick="deleteProduct('${p.id}')" class="bg-gray-500 text-white px-2 py-1 rounded">ลบ</button>
        </td>
      </tr>
    `
    )
    .join("");
  checkLowStock();
  generateSalesReport();
}
  
  // เพิ่มสินค้าเมื่อฟอร์มถูกส่ง
  document.getElementById("addProductForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const productData = {
      name: document.getElementById("productName").value,
      price: parseFloat(document.getElementById("productPrice").value),
      inStock: parseInt(document.getElementById("productStock").value),
      category: document.getElementById("productCategory").value,
      minStock: 5, // กำหนดค่าเริ่มต้น
    };
    addProduct(productData);
    e.target.reset();
  });
  
  // โหลดข้อมูลสินค้าเมื่อหน้าเว็บโหลดเสร็จ
  window.onload = () => {
    renderProducts();
  };