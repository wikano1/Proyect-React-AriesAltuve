import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemListContainer = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categoryId } = useParams();
    const { addToCart, state } = useCart();

    useEffect(() => {
        setLoading(true);

        // 1.- Armar una referencia (sync)
        const productosRef = collection(db, 'productos');
        const docsRef = categoryId
            ? query(productosRef, where('category', '==', categoryId))
            : productosRef;

        // 2.- LLamar a esa referencia (async)
        getDocs(docsRef)
            .then((querySnapshot) => {
                const docs = querySnapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id
                    }
                });

                console.log(docs);
                setProductos(docs);
            })
            .finally(() => setLoading(false));

    }, [categoryId, state.cartItems]);

    const handleAddToCart = (product) => {
        const productInCart = state.cartItems.find((item) => item.id === product.id);

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

            <section className="py-10">
                <h4 className="text-3xl font-semibold mb-8">Hathor tu joyeria por excelencia</h4>

                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {productos.map((product) => (
                            <div key={product.id} className="mb-8">
                                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                                    <Link to={`/producto/${product.id}`}>
                                        <img
                                            className="w-full h-48 object-cover object-center"
                                            src={`/${product.image}`}
                                            alt={product.name}
                                        />
                                    </Link>

                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <p className="text-gray-700">${product.price}</p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Link to={`/producto/${product.id}`}>
                                                <button
                                                    type="button"
                                                    className="p-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-400 "
                                                >
                                                    Ver
                                                </button>
                                            </Link>

                                            <button
                                                type="button"
                                                className="p-2 bg-gray-300 text-orange-700 rounded-md flex hover:text-orange-500"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                                                </svg>
                                                Añadir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ItemListContainer;


