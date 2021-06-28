import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FirebaseContext } from '../../firebase';
import { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import  FileUploader from 'react-firebase-file-uploader'; 

//NOTA PARA MAÑANA CUANDO ESTE DESARROLLANDO. DESCARGAS TODOS LOS COMPONENTES QUE BORRE


//con YUP leemos los datos que estamos guardando en el formulario despues de enviarlo.
//FileUploader es un es un cargador de archivos en este caso le pasamos un props que es accept= donde le indicamos que solo aceptamos archivos de imagen le pasamos un props que se 
//llama randomizeFiename para que si + de una persona sube un archivo con el mismo nombre este props le asigna un nombre unico storageRef es como crear una carpeta en la cual se van a guardar las imagenes

const NuevoPlatillo = () => {

    //estado de las imagenes

    const [subiendo,guardarSubiendo] = useState(false); //cuando se comienza el estado de cargar las imagenes comience en false porque aun no se tiene una imagen
    const [progreso,guardarProgreso] = useState(0); //este quiere decir que cuando comienza a subir la imagen muestre el progreso en % y comienza en 0
    const [ urlimagen, guardarUrlimagen] =useState(''); //con este estado definimos guardar la Url de la imagen y comienza en un string vacio.

    //Context con las operaciones de firebase

    const { firebase } = useContext(FirebaseContext);

    // console.log(firebase);

    //Hook para redireccionar
    const navigate = useNavigate();

   

    //validación y leer los datos del formulario

    const formik = useFormik({

        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen:'',
            descripcion: '',

        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .min(3, 'Los Platillos deben tener al menos 3 caracteres')
                        .required('El Nombre del platillo es obligatorio'),
            precio: Yup.number()
                        .min(1, 'Debes agregar un número')
                        .required('El precio del platillo es obligatorio'),
            categoria: Yup.string()
                        .required('La Categoria del platillo es obligatorio'),
            descripcion: Yup.string()
                        .required('La Descripción del platillo es obligatorio'),
        }),
        onSubmit: platillo =>{
           try {
               platillo.existencia = true;
               platillo.imagen = urlimagen;
               firebase.db.collection('productos').add(platillo)

               //Redireccionar
               navigate('/menu')
           } catch (error) {
               console.log(error)
               
           }
        }
    })

    // todo sobre las imagenes

    const handleUploadStart = () => {
        guardarProgreso(0); //nos aseguramos que si comience en cero
        guardarSubiendo(true); //cambiamos el estado a true porque ya estamos subiendo la imagen
    }
    const handleUploadError = error => {
         guardarSubiendo(false);
         console.log(error);   

    }
    const handleUploadSuccess= async nombre => {
        guardarProgreso(100);
        guardarSubiendo(false) //se vuelve a poner en false porque ya la imagen se subio correctamente

        //Almacenar la URL destino
        const url = await firebase 
                    .storage
                    .ref("productos")
                    .child(nombre)
                    .getDownloadURL();
                     
        console.log(url);
        
        guardarUrlimagen(url);

    }
    const handleProgress= progreso => {
        guardarProgreso(progreso);

        console.log(progreso);
    }

    return ( 
        <>
        <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>

        <div className="flex justify-center mt-10">
            <div className="w-full max-w-3xl">
                <form
                     onSubmit={formik.handleSubmit}
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                        <input
                           className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="nombre"
                           type="text"
                           placeholder="Nombre Platillo"
                           value={formik.values.nombre}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.nombre && formik.errors.nombre ? (
                        <div className="bg-red-300 border-l-4 border-red-500 text-red-800 p-4 mb-5 "role="alert">
                            <p className="font-bold">Hubo un error:</p>
                            <p>{formik.errors.nombre}</p>
                        </div>
                    ) : null }
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                        <input
                           className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="precio"
                           type="number"
                           placeholder="$30"
                           min="0"
                           value={formik.values.precio}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.precio && formik.errors.precio? (
                        <div className="bg-red-300 border-l-4 border-red-500 text-red-800 p-4 mb-5 "role="alert">
                            <p className="font-bold">Hubo un error:</p>
                            <p>{formik.errors.precio}</p>
                        </div>
                    ) : null }
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">Categoría</label>
                        <select
                        className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="categoria"
                        name="categoria"  
                        value={formik.values.categoria}
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur}
                        >
                            <option value=""> --Seleccione-- </option>
                            <option value="desayuno"> Desayuno</option>
                            <option value="comida"> Comida</option>
                            <option value="cena">Cena </option>
                            <option value="bebida">Bebidas</option>
                            <option value="postre">Postre</option>
                            <option value="ensalada"> Ensalada</option>

                        </select>
                    </div>
                    { formik.touched.categoria && formik.errors.categoria ? (
                        <div className="bg-red-300 border-l-4 border-red-500 text-red-800 p-4 mb-5 "role="alert">
                            <p className="font-bold">Hubo un error:</p>
                            <p>{formik.errors.categoria}</p>
                        </div>
                    ) : null }
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">Imagen</label>
                            <FileUploader
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFiename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart} //comienza a subir la imagen
                                onUploadError={handleUploadError} //para detectar si se sube con error
                                onUploadSuccess={handleUploadSuccess} //para identificar la URL donde se guardo la imagen
                                onProgress={handleProgress} //el progreso de la imagen
                            />
                    </div>

                    { subiendo && (
                        <div className="h-12 relative w-full border">
                            <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm flex items-center" style={{ width: '${progreso}%'}}>
                                    {progreso} %
                            </div>
                        </div>
                    )}
                    {urlimagen && (
                        <p className="bg-green-500 text-white p-3 text-center my-5">
                            La Imagen se subió correctamente
                        </p>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">Descripción</label>
                        <input
                           className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                           id="descripcion"
                           placeholder="Descripción del Platillo"
                           value={formik.values.descripcion}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.descripcion && formik.errors.descripcion ? (
                        <div className="bg-red-300 border-l-4 border-red-500 text-red-800 p-4 mb-5 "role="alert">
                            <p className="font-bold">Hubo un error:</p>
                            <p>{formik.errors.descripcion}</p>
                        </div>
                    ) : null }
                    <input
                        type="submit"
                        className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                        value="Agregar Platillo"
                    />

                </form>
            </div>
        </div>
        </>
     );
}
 
export default NuevoPlatillo;