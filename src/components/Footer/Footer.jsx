import React from "react";

const Footer = () => {
    return (


    <footer className="bg-orange-400 text-orange-950 py-4">
        <div className="container mx-auto flex justify-between">
        <div className="nombre">
            <h5>Creado por: Aries Altuve</h5>
        </div>
        <div className="correo">
            <h6>ariesalisosa@gmail.com</h6>
        </div>
        <div className="derechos">
            <h6>© 2023 HATHOR - Joyas y accesorios. Todos los derechos reservados.</h6>
        </div>
        <div className="volver">
            <a className="volver" href="#up">
            Volver arriba
            </a>
        </div>
        </div>
    </footer>
    );
};

export default Footer;
