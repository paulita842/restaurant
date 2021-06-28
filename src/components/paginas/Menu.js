import { result } from 'lodash';
import React, {useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase'


import Platillo from '../../ui/platillo';

const Menu = () => {

    //DEFINIR EL STATE PARA LOS PLATILLOS

    const [ platillos, guardarPlatillos ] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    //CONSULTAR LA BASE DE DATOS AL CARGAR

    useEffect(() => {
        const obtenerPlatillos =  () =>{
            firebase.db.collection('productos').onSnapshot(manejarSnapshot);

        }
        obtenerPlatillos();
    },[]);

    //Snapshot nos permite utilizar la base de datos en tiempo real de firestore
    function manejarSnapshot(snapshot){
            const platillos = snapshot.docs.map(doc => {
                return{
                    id: doc.id,
                    ...doc.data()
                }
            });
            //ALMACENAR PLATILLOS EN EL STATE
            guardarPlatillos(platillos)
    }


    return ( 
        <>

        <h1 className="text-3xl font-light mb-4">Menu</h1>

        <Link to="/nuevoplatillo" className="bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold"> Agregar Platillo</Link>
        
        {platillos.map( platillo =>(
            <Platillo
                key={platillo.id}
                platillo={platillo}
            />
        ))}
        </>
     );
}
 
export default Menu;