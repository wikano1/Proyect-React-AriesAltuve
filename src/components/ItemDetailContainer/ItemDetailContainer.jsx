import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const ItemDetailContainer = () => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const { productId } = useParams();
    const { addToCart, state } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        setLoading(true);

        // 1.- Armar la referencia (sync)
        const docRef = doc(db, 'productos', productId);

        // 2.- Llamar a esa referencia (async)
        getDoc(docRef)
            .then((docSnapshot) => {
                console.log(docSnapshot);
                const doc = {
                    ...docSnapshot.data(),
                    id: docSnapshot.id
                };

                setProduct(doc);
            })
            .finally(() => setLoading(false));

    }, [productId]);

    const handleAddToCart = () => {
        // Verificar si el producto ya está en el carrito
        const productInCart = state.cartItems.some(item => item.id === product.id);

        if (productInCart) {
            toast.warning('Este producto ya fue agregado anteriormente.', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        } else {
            addToCart(product);
            setAddedToCart(true);

            toast.success('Producto añadido correctamente', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        }
    };

    return (
        <>
            <ToastContainer />
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <section className="py-10">
                    <h5>PRENDAS EXCLUSIVAS...</h5>
                    <div className="container mx-auto flex items-center">
                        <div className="w-1/2 pr-8">
                            <img
                                className="w-full h-96 object-cover object-center rounded-3xl"
                                src={`/${product.image}`}
                                alt={product.name}
                            />
                        </div>

                        <div className="w-1/2">
                            <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>
                            <p className="text-gray-700 mb-4">${product.price}</p>
                            <div className="flex items-center space-x-4 mb-4">
                                <Link to="/productos">
                                    <button className="p-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-400">
                                        Volver
                                    </button>
                                </Link>

                                <div className="flex items-center space-x-2">
                                    <button
                                        className="p-2 bg-gray-300  text-orange-700 rounded-md flex hover:text-orange-500"
                                        onClick={handleAddToCart}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.960 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                                        </svg>
                                        Añadir a la bolsa
                                    </button>
                                </div>
                            </div>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default ItemDetailContainer;
