import React, { useContext, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../firebase/config";
import { collection, writeBatch, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  const totalAmount = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const [customerData, setCustomerData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  const handleModifyCart = () => {
    navigate("/");
  };

  const handleSubmitOrder = async () => {
    // Validar que todos los campos del formulario estén llenos
    const areAllFieldsFilled = Object.values(customerData).every((value) => value.trim() !== '');
  
    if (!areAllFieldsFilled) {
      // Mostrar mensaje de error si algún campo está vacío
      Swal.fire("Todos los campos del formulario son obligatorios.");
      return;
    }
  
    // Definir la variable outOfStock en el alcance más amplio
    let outOfStock = [];
  
    // Resto de la lógica de procesamiento de la compra
    const batch = writeBatch(db);
    const ordersRef = collection(db, "orders");
    const productsRef = collection(db, 'productos');
  
    try {
      // Resto del código de verificación de stock y procesamiento de la compra
      // ...
  
      if (outOfStock.length === 0) {
        // Si no hay productos sin stock, procedemos a realizar la compra
        const orderData = {
          customer: customerData,
          items: state.cartItems,
          total: totalAmount,
          date: new Date(),
        };
  
        const orderRef = await addDoc(ordersRef, orderData);
  
        // Obtener el código de orden asignado por Firebase
        const orderId = orderRef.id;
  
        // Limpiar el carrito
        const cartItemsRef = state.cartItems.map(item => doc(productsRef, item.id));
        cartItemsRef.forEach(itemRef => batch.delete(itemRef));
  
        // Commit de las operaciones
        await batch.commit();
  
        // Limpiar el carrito local
        clearCart();
  
        // Mostrar mensaje de éxito con el código de orden
        Swal.fire(`Gracias por tu compra! Tu código de orden es: ${orderId}`);
      } else {
        // Mostrar mensaje si hay productos sin stock
        Swal.fire("Hay items sin stock");
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Swal.fire("Hubo un error al procesar la compra. Por favor, inténtalo de nuevo.");
    }
  };
  

  // Función para generar un código de orden único (puedes personalizarla según tus necesidades)
  const generateOrderCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Estás a punto de finalizar tu compra...</h2>

      {/* Formulario de Datos del Cliente */}
      <div className="w-full max-w-md mb-8">
        <h2 className="text-xl font-bold mb-4">Datos del Cliente</h2>
        <form className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={customerData.nombre}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={customerData.apellidos}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customerData.email}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={customerData.telefono}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={customerData.direccion}
            onChange={handleInputChange}
            className="border p-2 col-span-2"
          />
        </form>
      </div>

      {/* Resumen de la Compra */}
<div className="w-full max-w-md">
  <h2 className="text-xl font-bold mb-4">Resumen de la Compra</h2>
  {state.cartItems.length === 0 ? (
    <p>Tu bolsa de compras está vacía.</p>
  ) : (
    <div>
      <div className="flex justify-end shadow">
        <button
          onClick={handleModifyCart}
          className="text-black-400 px-4 py-2 hover:text-orange-500"
        >
          Modificar mi compra ❕
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-4 w-full text-center">
        {state.cartItems.map((item) => (
          <li key={item.id} className="border-b py-4 w-full flex items-center">
            <img src={`/${item.image}`} alt={item.name} className="w-16 h-16 mr-4 object-cover" />

            <div>
              <span>{item.name}</span>
              <div className="flex items-center">
                <span className="mr-2">{item.price}</span>
                <span className="mr-2">Cantidad: {item.quantity}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <p className="font-bold">Monto a pagar: ${totalAmount.toFixed(2)}</p>
      </div>
    </div>
  )}
</div>

      {/* Botones de Finalizar Compra */}
      <div className="mt-4 py-4">
        <button
          type="submit"
          onClick={() => handleSubmitOrder()}
          className="rounded-md bg-orange-400 py-2 px-4 font-bold text-white shadow-md hover:bg-orange-600"
        >
          Finalizar mi compra ✅
        </button>
      </div>
    </div>
  );
};

export default Checkout;
